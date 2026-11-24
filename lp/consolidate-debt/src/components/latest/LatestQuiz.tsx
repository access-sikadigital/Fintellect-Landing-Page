"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import {
  ABR_GUID,
  AMOUNT,
  LOAN_TYPE,
  QUIZ_NAME,
  QUIZ_STEPS,
  STATES,
  cleanAbn,
  fmtAbn,
  money,
  optText,
  outcomeFor,
  type ChoiceKey,
  type Opt,
} from "@/lib/quiz";
import { checkEmail as checkEmailShared, sanitiseName, toE164 } from "@/lib/validation";
import { ATTRIBUTION_KEYS, BOOK_PATH, PREFILL_KEYS, saveContact } from "@/lib/funnel";
import { attribution, matchUser, newEventId, relayConversion, track, trackCustom } from "@/lib/track";

/**
 * The Consolidate Debt quiz (ported from the GHL quiz) in the ATO page's LATEST design, rebuilt in React with the same markup classes,
 * copy, timings and behaviour: amount slider → 6 choice steps → business (ABN lookup) →
 * contact → mobile → "working through your options" → booking redirect.
 * Leads go to /api/lead (GoHighLevel webhook + Meta CAPI).
 */

type Answers = Partial<Record<ChoiceKey, string>> & {
  amount?: number;
  business_name?: string;
  abn?: string;
  state?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
};
type View = { kind: "quiz" } | { kind: "calc" } | { kind: "end"; end: "fit" | "review" | "nofit" };
type Phase = "in" | "idle" | "out";

const PICK_DELAY = 380;
const CALC_STEP = 900;
const REDIRECT_DELAY = 1800;

/* ---------------- validation (the design's rules + the site's shared rules) ---------------- */
const DOMAINS = ["gmail.com", "googlemail.com", "hotmail.com", "hotmail.com.au", "outlook.com", "outlook.com.au", "live.com", "live.com.au", "msn.com", "yahoo.com", "yahoo.com.au", "ymail.com", "icloud.com", "me.com", "mac.com", "bigpond.com", "bigpond.net.au", "bigpond.com.au", "optusnet.com.au", "iinet.net.au", "tpg.com.au", "internode.on.net", "westnet.com.au", "dodo.com.au", "aapt.net.au", "protonmail.com", "proton.me", "aol.com"];
const DOMAIN_FIX: Record<string, string> = { "gmail.com.au": "gmail.com", "gmail.au": "gmail.com", "icloud.com.au": "icloud.com", "outlook.au": "outlook.com.au", "hotmail.au": "hotmail.com.au", "bigpond.au": "bigpond.com" };
const THROWAWAY = /(^|\.)(mailinator|guerrillamail|guerrillamailblock|sharklasers|10minutemail|tempmail|temp-mail|tempmailo|yopmail|trashmail|getnada|dispostable|maildrop|throwawaymail|fakeinbox|moakt|mailnesia|mintemail|emailondeck|spamgourmet|mohmal|burnermail|tempr|discard)\./;
const FAKE_LOCAL = /^(asdf\w*|qwerty\w*|abc|abc123|abcd|fake|none|no|nope|noemail|na|nil|null|x{2,}|a{2,}|example|sample|email|user|name|123+|1234\w*)$/;
const FAKE_DOMAIN = /^(example|domain|fake|none|abc|asdf|xyz|email\.co|nomail|noemail)\.(com|com\.au|net|org|co)$/;
const FAKE_NAME = /^(asdf|qwerty|fake|abc|xxx?|aaa|test)$/i;

function dist(a: string, b: string) {
  const d: number[][] = [];
  for (let i = 0; i <= a.length; i++) d[i] = [i];
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  return d[a.length][b.length];
}
function suggestDomain(dom: string) {
  if (DOMAIN_FIX[dom]) return DOMAIN_FIX[dom];
  const fixed = dom
    .replace(/\.(con|cpm|cim|xom|vom|comm|coom|cm|om|c0m|ocm|cmo)$/, ".com")
    .replace(/\.com\.(ua|aus|a|u)$/, ".com.au")
    .replace(/\.net\.(ua|a|u)$/, ".net.au");
  if (DOMAINS.includes(dom)) return null;
  if (fixed !== dom) return DOMAIN_FIX[fixed] || fixed;
  let best: string | null = null;
  let bd = 9;
  for (const k of DOMAINS) {
    const x = dist(dom, k);
    if (x < bd) {
      bd = x;
      best = k;
    }
  }
  return bd > 0 && bd <= (dom.length < 9 ? 1 : 2) ? best : null;
}
function checkEmail(raw: string): { err?: string; v?: string; sug?: string } {
  const v = raw.trim().toLowerCase().replace(/,/g, ".").replace(/\.+$/, "");
  if (!v) return { err: "Please add your email address." };
  if (/\s/.test(v)) return { err: "Email addresses can't have spaces in them. Please check it." };
  if (!v.includes("@")) return { err: "Your email is missing the @." };
  if (!/^[a-z0-9._%+'-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(v) || /\.\./.test(v) || /^\.|\.@/.test(v))
    return { err: "Please check your email address. Something in it doesn't look right." };
  const shared = checkEmailShared(v);
  if (!shared.ok) return { err: shared.error };
  const [loc, dom] = v.split("@");
  if (THROWAWAY.test(dom)) return { err: "Please use your everyday email, not a temporary one. We send your options there." };
  if (FAKE_LOCAL.test(loc) || FAKE_DOMAIN.test(dom)) return { err: "Please use your real email so we can send your options." };
  const sug = suggestDomain(dom);
  if (sug && sug !== dom) return { v, sug: `${loc}@${sug}` };
  return { v };
}
const fmtPhone = (d: string) => (d.length === 10 ? `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}` : d);
function checkPhone(raw: string): { err?: string; v?: string; warn?: string } {
  let d = raw.replace(/[^\d+]/g, "").replace(/^\+?61/, "0").replace(/^\+/, "");
  if (/^4\d{8}$/.test(d)) d = "0" + d;
  if (!d) return { err: "Please add your mobile number." };
  if (/^0[2378]\d{8}$/.test(d)) return { err: "That looks like a landline. Please use a mobile (starting 04) so Robert can reach you." };
  if (/^04\d{0,7}$/.test(d)) return { err: "That number is too short. Australian mobiles have 10 digits." };
  if (/^04\d{9,}$/.test(d)) return { err: "That number is too long. Australian mobiles have 10 digits." };
  if (!/^04\d{8}$/.test(d)) return { err: "Please enter an Australian mobile starting with 04." };
  const s = d.slice(2);
  const n = new Set(s).size;
  const seq = "01234567890123456789".includes(s) || "98765432109876543210".includes(s);
  if (n === 1 || seq || /(\d)\1{6}/.test(s)) return { err: "That number doesn't look real. Please enter your actual mobile." };
  if (n === 2 || /(\d{4})\1/.test(s) || /(\d)\1{4}/.test(s)) return { v: d, warn: `Just checking: is ${fmtPhone(d)} right? Tap the button again to confirm.` };
  return { v: d };
}
/** Letters (any language), spaces, hyphens, apostrophes; at least 2 letters. */
function checkNamePart(v: string, which: "first" | "last") {
  if (!v) return "Please add your first and last name.";
  if (/\d/.test(v) || FAKE_NAME.test(v) || /[^\p{L}\p{M}\s'’-]/u.test(v) || !/^\p{L}/u.test(v)) return "Please add your real first and last name.";
  if (v.replace(/[^\p{L}]/gu, "").length < 2) return `Please add your full ${which} name.`;
  return null;
}

/* ---------------- ABN Lookup (Australian Business Register, JSONP) ---------------- */
type AbrHit = { name: string; abn: string; state?: string };
let abrSeq = 0;
function abrCall(path: string, query: string, cb: (d: Record<string, unknown> | null) => void) {
  const name = `flAbr${++abrSeq}`;
  const sc = document.createElement("script");
  let done = false;
  const w = window as unknown as Record<string, unknown>;
  const cleanup = () => {
    delete w[name];
    sc.remove();
  };
  w[name] = (d: Record<string, unknown>) => {
    done = true;
    cb(d);
    cleanup();
  };
  sc.onerror = () => {
    if (!done) cb(null);
    cleanup();
  };
  sc.src = `https://abr.business.gov.au/json/${path}?${query}&guid=${encodeURIComponent(ABR_GUID)}&callback=${name}`;
  document.head.appendChild(sc);
  setTimeout(() => {
    if (!done) {
      cb(null);
      cleanup();
    }
  }, 6000);
  return abrSeq;
}

function Trust() {
  return (
    <div className="fl-trust">
      <span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
        Your data is safe &amp; secure
      </span>
      <span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        No credit score impact
      </span>
    </div>
  );
}

export function LatestQuiz() {
  const [i, setI] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [a, setA] = useState<Answers>({ amount: AMOUNT.start });
  const [view, setView] = useState<View>({ kind: "quiz" });
  const [phase, setPhase] = useState<Phase>("in");
  const [busy, setBusy] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [err, setErr] = useState<ReactNode>(null);
  const [sending, setSending] = useState(false);
  const [moved, setMoved] = useState(false);
  const confirmed = useRef<{ em?: string; ph?: string }>({});
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const S = QUIZ_STEPS;
  const n = S.length;
  const s = S[i];

  // slide-in after each render of a new step (two frames so the start state paints first)
  useEffect(() => {
    if (phase !== "in") return;
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setPhase("idle"));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, [phase, i, view]);

  useEffect(() => {
    if (moved && phase === "idle") headingRef.current?.focus({ preventScroll: true });
  }, [moved, phase, i, view]);

  // card height eases between steps
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = useCallback(
    (to: number, push = true, delay = 230) => {
      setBusy(true);
      setPhase("out");
      setMoved(true);
      setTimeout(() => {
        if (push) setHistory((h) => [...h, i]);
        setI(to);
        setSel(null);
        setErr(null);
        setPhase("in");
        setBusy(false);
      }, delay);
    },
    [i],
  );

  const back = () => {
    if (busy) return;
    setBusy(true);
    setPhase("out");
    setMoved(true);
    setTimeout(() => {
      setHistory((h) => {
        const copy = [...h];
        const prev = copy.pop() ?? 0;
        setI(prev);
        return copy;
      });
      setSel(null);
      setErr(null);
      setPhase("in");
      setBusy(false);
    }, 200);
  };

  const showEnd = (end: "fit" | "review" | "nofit") => {
    setView({ kind: "end", end });
    setPhase("in");
    setMoved(true);
  };

  const restart = () => {
    setA({ amount: AMOUNT.start });
    setI(0);
    setHistory([]);
    setView({ kind: "quiz" });
    setPhase("in");
    setErr(null);
    confirmed.current = {};
  };

  /* ---------- choices ---------- */
  const pick = (k: number, o: Opt) => {
    if (busy || s.type !== "choice") return;
    setBusy(true);
    setSel(k);
    if (!started.current) {
      started.current = true;
      trackCustom("QuizStart", { type: LOAN_TYPE });
    }
    trackCustom("QuizStep", { step: i + 1, question: s.key });
    setTimeout(() => {
      const val = optText(o);
      setA((prev) => ({ ...prev, [s.key]: val }));
      if (typeof o !== "string" && o.exit) {
        trackCustom("QuizNotFit", { step: s.key, type: LOAN_TYPE });
        setBusy(false);
        showEnd("nofit");
        return;
      }
      go(i + 1);
    }, PICK_DELAY);
  };

  /* ---------- business step (ABN lookup) ---------- */
  const [bn, setBn] = useState("");
  const [dd, setDd] = useState<{ open: boolean; items: AbrHit[]; msg?: string; hi: number }>({ open: false, items: [], hi: -1 });
  const [manual, setManual] = useState(false);
  const [abnInput, setAbnInput] = useState("");
  const [stateSel, setStateSel] = useState("");
  const searchT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSearch = useRef(0);

  useEffect(() => {
    if (s.key !== "business") return;
    setBn(a.business_name ?? "");
    setAbnInput(a.abn ?? "");
    setStateSel(a.state ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.key]);

  const search = (q: string) => {
    q = q.trim();
    if (q.length < 3) return setDd({ open: false, items: [], hi: -1 });
    setDd({ open: true, items: [], msg: "Searching…", hi: -1 });
    const digits = q.replace(/\s/g, "");
    const fail = "Search isn't available right now. Enter it manually below.";
    let id = 0;
    if (/^\d{11}$/.test(digits)) {
      id = lastSearch.current = abrCall("AbnDetails.aspx", `abn=${digits}`, (d) => {
        if (id !== lastSearch.current) return;
        if (!d) return setDd({ open: true, items: [], msg: fail, hi: -1 });
        if (!d.Abn) return setDd({ open: true, items: [], hi: -1 });
        const names = d.BusinessName as string[] | undefined;
        setDd({ open: true, items: [{ name: (names && names[0]) || String(d.EntityName), abn: String(d.Abn), state: String(d.AddressState || "") }], hi: -1 });
      });
    } else {
      id = lastSearch.current = abrCall("MatchingNames.aspx", `name=${encodeURIComponent(q)}&maxResults=8`, (d) => {
        if (id !== lastSearch.current) return;
        if (!d) return setDd({ open: true, items: [], msg: fail, hi: -1 });
        const seen: Record<string, 1> = {};
        const list = ((d.Names as { Name: string; Abn: string; State?: string; IsCurrent?: boolean }[]) || [])
          .filter((x) => {
            if (x.IsCurrent === false || seen[x.Abn + x.Name]) return false;
            seen[x.Abn + x.Name] = 1;
            return true;
          })
          .map((x) => ({ name: x.Name, abn: x.Abn, state: x.State }));
        setDd({ open: true, items: list, hi: -1 });
      });
    }
  };
  const pickBiz = (x: AbrHit) => {
    setBn(x.name);
    setAbnInput(x.abn);
    const st = x.state && STATES.includes(x.state) ? x.state : "";
    setStateSel(st);
    setA((p) => ({ ...p, business_name: x.name, abn: x.abn, state: st }));
    setDd({ open: false, items: [], hi: -1 });
    if (!st) setManual(true);
  };

  /* ---------- contact / phone inputs ---------- */
  const [fn, setFn] = useState("");
  const [ln, setLn] = useState("");
  const [em, setEm] = useState("");
  const [ph, setPh] = useState("");
  useEffect(() => {
    if (s.key === "contact") {
      setFn(a.first_name ?? "");
      setLn(a.last_name ?? "");
      setEm(a.email ?? "");
    }
    if (s.key === "phone") setPh(a.phone ? fmtPhone(a.phone) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.key]);

  /* ---------- submit ---------- */
  const submit = async (phone: string) => {
    const final = { ...a, phone };
    const outcome = outcomeFor(final);
    const eventId = newEventId();
    setSending(true);
    setBusy(true);
    const started = Date.now();
    // Sends the lead; a server or network failure is retried once. Only a 422 (a detail the visitor
    // needs to fix) stops them: otherwise they always reach the calendar, and the GHL booking still
    // creates the contact even if the webhook was down.
    const send = () =>
      fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: 3,
          answers: {
            loan_amount: final.amount,
            detail_1: final.detail_1,
            monthly_revenue: final.monthly_revenue,
            trading_time: final.trading_time,
            detail_2: final.detail_2,
            property_owner: final.property_owner,
            credit_history: final.credit_history,
          },
          business: { name: final.business_name, abn: final.abn, state: final.state },
          contact: { first_name: final.first_name, last_name: final.last_name, email: final.email, phone },
          eventId,
          attribution: attribution(),
          company: honeypot.current?.value ?? "",
        }),
      }).then(
        (r) => r,
        () => null,
      );
    try {
      let res = await send();
      if (!res || res.status >= 500) res = await send();
      if (res && res.status === 422) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Please check your details and try again.");
      }
      if (!res || !res.ok) console.error("[lead] not saved, continuing to the calendar", res?.status);
      // Every completed quiz is a Lead (pixel + CAPI relay). lead_outcome separates good fits from reviews in Meta.
      const lead = { content_name: QUIZ_NAME, content_category: LOAN_TYPE, lead_outcome: outcome === "Good fit" ? "good_fit" : "review" };
      const contact = { first_name: final.first_name, last_name: final.last_name, email: final.email, phone: toE164(phone) };
      matchUser(contact);
      track("Lead", lead, eventId);
      relayConversion("Lead", eventId, contact, lead);
      if (outcome === "Good fit") {
        const qualifiedId = newEventId();
        trackCustom("QualifiedLead", lead, qualifiedId);
        relayConversion("QualifiedLead", qualifiedId, contact, lead);
      }
      setA(final);
      await new Promise((r) => setTimeout(r, Math.max(0, 600 - (Date.now() - started))));
      setSending(false);
      setBusy(false);
      setView({ kind: "calc" });
      setPhase("in");
    } catch (e) {
      setSending(false);
      setBusy(false);
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  const next = () => {
    if (busy) return;
    if (s.type === "amount") return go(i + 1);
    if (s.type === "business") {
      const name = bn.trim();
      if (!name) return setErr("Please add the business name.");
      if (!manual && !a.abn) return setErr("Pick your business from the list, or enter it manually.");
      if (!stateSel && !manual) {
        setManual(true);
      }
      const abn = cleanAbn(abnInput);
      if (abn === null) return setErr(abnInput.replace(/\D/g, "").length !== 11 ? "An ABN is 11 digits. Leave it blank if you're not sure." : "That ABN doesn't look right. Leave it blank if you're not sure.");
      if (!stateSel) return setErr("Please pick a state.");
      setA((p) => ({ ...p, business_name: name, abn, state: stateSel }));
      return go(i + 1);
    }
    if (s.type === "contact") {
      const f = fn.trim();
      const l = ln.trim();
      const nameErr = checkNamePart(f, "first") || checkNamePart(l, "last");
      if (nameErr) return setErr(nameErr);
      const e = checkEmail(em);
      if (e.err) return setErr(e.err);
      if (e.sug && confirmed.current.em !== e.v) {
        confirmed.current.em = e.v;
        return setErr(
          <>
            Did you mean{" "}
            <button
              type="button"
              className="fl-sug"
              onMouseDown={(ev) => ev.preventDefault()}
              onClick={() => {
                setEm(e.sug!);
                confirmed.current.em = e.sug;
                setErr("Fixed. Tap Next to carry on.");
              }}
            >
              {e.sug}
            </button>
            ? Tap it to fix, or tap Next again if yours is right.
          </>,
        );
      }
      setA((p) => ({ ...p, first_name: f, last_name: l, email: e.v }));
      return go(i + 1);
    }
    if (s.type === "phone") {
      const c = checkPhone(ph);
      if (c.err) return setErr(c.err);
      if (c.warn && confirmed.current.ph !== c.v) {
        confirmed.current.ph = c.v;
        return setErr(c.warn);
      }
      setErr(null);
      void submit(c.v!);
    }
  };

  /* ---------- calculating screen ---------- */
  const calcLines = ["Checking your answers", "Matching against 40+ lenders' criteria", `Weighing up ${LOAN_TYPE.toLowerCase()} options`, "Preparing your summary for Robert"];
  const [calcK, setCalcK] = useState(0);
  useEffect(() => {
    if (view.kind !== "calc") return;
    setCalcK(0);
    let k = 0;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      k++;
      setCalcK(k);
      if (k > calcLines.length) {
        // Everyone books a call for now; the outcome (Good fit / Review) still goes to GHL and Meta
        t = setTimeout(() => showEnd("fit"), 450);
        return;
      }
      t = setTimeout(tick, CALC_STEP);
    };
    t = setTimeout(tick, 30);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view.kind]);

  const goBook = useCallback(() => {
    // Funnel step 2 (/book): the GHL calendar, pre-filled with the quiz contact and carrying the ad attribution
    const contact = { first_name: a.first_name, last_name: a.last_name, email: a.email, phone: a.phone ? toE164(a.phone) : undefined };
    saveContact(contact);
    const u = new URL(BOOK_PATH, window.location.origin);
    for (const k of PREFILL_KEYS) if (contact[k]) u.searchParams.set(k, contact[k]!);
    const attr = attribution();
    for (const k of ATTRIBUTION_KEYS) if (attr[k]) u.searchParams.set(k, attr[k]);
    window.top!.location.href = u.toString();
  }, [a]);

  useEffect(() => {
    if (view.kind === "end" && view.end === "fit") {
      const t = setTimeout(goBook, REDIRECT_DELAY);
      return () => clearTimeout(t);
    }
  }, [view, goBook]);

  /* ---------- render ---------- */
  const pct = Math.round((i / n) * 100);
  const stepClass = clsx("fl-step", phase === "in" && "fl-in", phase === "out" && "fl-out");

  let body: ReactNode;
  if (view.kind === "calc") {
    const done = Math.min(Math.max(calcK - 1, 0), calcLines.length);
    body = (
      <div className="fl-calc">
        <div className="fl-bar">
          <span style={{ width: `${Math.round((done / calcLines.length) * 100)}%` }} />
        </div>
        <div className="fl-ring" />
        <h3 ref={headingRef} tabIndex={-1} data-quiz-focus>
          Working through your options…
        </h3>
        <p className="fl-help">This takes a few seconds.</p>
        <ul className="fl-list">
          {calcLines.map((l, k) => {
            const isDone = k < done;
            const on = k === done && calcK > 0 && calcK <= calcLines.length;
            return (
              <li key={l} className={clsx(on && "on", isDone && "done")}>
                <i>{isDone ? "✓" : ""}</i>
                <span>{l}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  } else if (view.kind === "end") {
    const nm = a.first_name ?? "";
    body = (
      <div className={stepClass}>
        {view.end === "fit" ? (
          <div className="fl-end">
            <div className="fl-tick">✓</div>
            <h3 ref={headingRef} tabIndex={-1} data-quiz-focus>
              {outcomeFor(a) === "Good fit" ? `Good news, ${nm}. There are options worth talking through.` : `Thanks, ${nm}. Let's talk it through.`}
            </h3>
            <p>Pick a time for a 15-minute call with Robert. He&apos;ll go over what lenders are likely to look at for your situation.</p>
            <p>Taking you to his calendar now…</p>
            <button className="fl-next" type="button" onClick={goBook}>
              Choose a time
            </button>
          </div>
        ) : view.end === "review" ? (
          <div className="fl-end">
            <div className="fl-tick">✓</div>
            <h3 ref={headingRef} tabIndex={-1} data-quiz-focus>
              Thanks, {nm}. Robert will take a closer look.
            </h3>
            <p>A few of your answers mean the right lender takes a bit more working out. Robert will review your details and be in touch.</p>
          </div>
        ) : (
          <div className="fl-end">
            <h3 ref={headingRef} tabIndex={-1} data-quiz-focus>
              It might be a bit early for business finance
            </h3>
            <p>Most lenders want to see at least 6 months of trading before they&apos;ll look at a business loan.</p>
            <p>Come back once you&apos;ve got a bit more history behind you, and we&apos;ll take a look.</p>
            <button className="fl-back" type="button" onClick={restart}>
              Start again
            </button>
          </div>
        )}
      </div>
    );
  } else {
    body = (
      <div className={stepClass}>
        <div className="fl-top">
          <span>
            {i > 0 ? (
              <button className="fl-back fl-back-pill" type="button" onClick={back}>
                <span className="fl-back-ic" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M11 18l-6-6 6-6" />
                  </svg>
                </span>
                Back
              </button>
            ) : (
              <span className="fl-tag">{LOAN_TYPE}</span>
            )}
          </span>
          <span>{i > 0 ? `Step ${i + 1} of ${n}` : ""}</span>
        </div>
        <div className="fl-bar">
          <span style={{ width: `${pct}%` }} />
        </div>
        <h3 ref={headingRef} tabIndex={-1} data-quiz-focus>
          {s.q}
        </h3>
        {s.help && <p className="fl-help">{s.help}</p>}

        {s.type === "choice" && (
          <div className={clsx("fl-opts", s.two && "two")}>
            {s.opts.map((o, k) => {
              const on = sel === k || (sel === null && a[s.key] === optText(o));
              return (
                <button key={optText(o)} className={clsx("fl-opt", on && "sel")} type="button" disabled={sel !== null} onClick={() => pick(k, o)}>
                  <span className="fl-dot" />
                  <span>{optText(o)}</span>
                </button>
              );
            })}
          </div>
        )}

        {s.type === "amount" && (
          <>
            <div className="fl-amt">{money(a.amount ?? AMOUNT.start)}</div>
            <input
              type="range"
              min={AMOUNT.min}
              max={AMOUNT.max}
              step={AMOUNT.step}
              value={a.amount ?? AMOUNT.start}
              aria-label="Amount"
              aria-valuetext={money(a.amount ?? AMOUNT.start)}
              style={{ ["--fill" as string]: ((a.amount ?? AMOUNT.start) - AMOUNT.min) / (AMOUNT.max - AMOUNT.min) }}
              onChange={(e) => setA((p) => ({ ...p, amount: +e.target.value }))}
            />
            <div className="fl-ends">
              <span>$10k</span>
              <span>$1m+</span>
            </div>
            <button className="fl-next" type="button" onClick={next}>
              Next
            </button>
          </>
        )}

        {s.type === "business" && (
          <>
            <label htmlFor="fl-bn">Business name</label>
            <div className="fl-ac">
              <input
                id="fl-bn"
                autoComplete="off"
                placeholder="Start typing your business name"
                value={bn}
                role="combobox"
                aria-expanded={dd.open}
                aria-controls="fl-dd"
                onChange={(e) => {
                  const v = e.target.value;
                  setBn(v);
                  setA((p) => ({ ...p, business_name: v, ...(manual ? {} : { abn: "" }) }));
                  if (!manual) setAbnInput("");
                  clearTimeout(searchT.current);
                  searchT.current = setTimeout(() => search(v), 300);
                }}
                onKeyDown={(e) => {
                  if (!dd.open || !dd.items.length) return;
                  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const len = dd.items.length;
                    setDd((d) => ({ ...d, hi: (d.hi + (e.key === "ArrowDown" ? 1 : -1) + len) % len }));
                  } else if (e.key === "Enter" && dd.hi > -1) {
                    e.preventDefault();
                    pickBiz(dd.items[dd.hi]);
                  } else if (e.key === "Escape") setDd({ open: false, items: [], hi: -1 });
                }}
                onBlur={() => setTimeout(() => setDd((d) => ({ ...d, open: false })), 150)}
              />
              {dd.open && (
                <ul className="fl-dd" id="fl-dd" role="listbox">
                  {dd.items.length ? (
                    dd.items.map((x, k) => (
                      <li
                        key={x.abn + x.name}
                        role="option"
                        aria-selected={dd.hi === k}
                        className={clsx("fl-ddi", dd.hi === k && "on")}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          pickBiz(x);
                        }}
                      >
                        <b>{x.name}</b>
                        <span>
                          ABN: {fmtAbn(x.abn)}
                          {x.state ? ` · ${x.state}` : ""}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="fl-ddm">{dd.msg || "No matches. Check the spelling, or enter it manually."}</li>
                  )}
                </ul>
              )}
            </div>
            {!manual && a.abn && (
              <div className="fl-picked">
                ✓ ABN {fmtAbn(a.abn)}
                {a.state ? ` · ${a.state}` : ""}
              </div>
            )}
            {!manual && (
              <button type="button" className="fl-link" onClick={() => setManual(true)}>
                Can’t find it? Enter it manually
              </button>
            )}
            {manual && (
              <div>
                <label htmlFor="fl-abn">
                  ABN <span style={{ fontWeight: 400, color: "var(--m)" }}>(optional)</span>
                </label>
                <input id="fl-abn" inputMode="numeric" placeholder="11 digits" value={abnInput} onChange={(e) => setAbnInput(e.target.value.replace(/[^\d\s]/g, "").slice(0, 14))} />
                <label htmlFor="fl-st">State</label>
                <select id="fl-st" value={stateSel} onChange={(e) => setStateSel(e.target.value)}>
                  <option value="">Select…</option>
                  {STATES.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="fl-err" role="alert">
              {err}
            </div>
            <button className="fl-next" type="button" onClick={next}>
              Next
            </button>
          </>
        )}

        {s.type === "contact" && (
          <>
            <label htmlFor="fl-fn">First name</label>
            <input id="fl-fn" autoComplete="given-name" value={fn} maxLength={40} onChange={(e) => setFn(sanitiseName(e.target.value))} />
            <label htmlFor="fl-ln">Last name</label>
            <input id="fl-ln" autoComplete="family-name" value={ln} maxLength={40} onChange={(e) => setLn(sanitiseName(e.target.value))} />
            <label htmlFor="fl-em">Email</label>
            <input
              id="fl-em"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              spellCheck={false}
              value={em}
              onChange={(e) => setEm(e.target.value.replace(/\s/g, ""))}
              onBlur={() => {
                if (!em.trim()) return;
                const c = checkEmail(em);
                if (c.err) setErr(c.err);
                else if (c.sug)
                  setErr(
                    <>
                      Did you mean{" "}
                      <button
                        type="button"
                        className="fl-sug"
                        onMouseDown={(ev) => ev.preventDefault()}
                        onClick={() => {
                          setEm(c.sug!);
                          confirmed.current.em = c.sug;
                          setErr("Fixed. Tap Next to carry on.");
                        }}
                      >
                        {c.sug}
                      </button>
                      ?
                    </>,
                  );
                else setErr(null);
              }}
            />
            <div className="fl-err" role="alert">
              {err}
            </div>
            <button className="fl-next" type="button" onClick={next}>
              Next
            </button>
          </>
        )}

        {s.type === "phone" && (
          <>
            <label htmlFor="fl-ph">Mobile number</label>
            <input
              id="fl-ph"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="04xx xxx xxx"
              value={ph}
              maxLength={18}
              onChange={(e) => setPh(e.target.value.replace(/[^\d\s+()-]/g, ""))}
              onBlur={() => {
                const c = checkPhone(ph);
                if (c.v) setPh(fmtPhone(c.v));
              }}
              onKeyDown={(e) => e.key === "Enter" && next()}
            />
            {/* Honeypot: hidden from people, filled by bots */}
            <input ref={honeypot} name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }} />
            <div className="fl-err" role="alert">
              {err}
            </div>
            <button className="fl-next" type="button" onClick={next} disabled={sending}>
              {sending ? (
                <>
                  <span className="fl-spin" /> Checking…
                </>
              ) : (
                "See my options"
              )}
            </button>
          </>
        )}
        <Trust />
      </div>
    );
  }

  return (
    <div id="fl-quiz" aria-live="polite">
      {/* +8: the wrapper's 4px padding (room for option hover lift) sits inside its border-box height */}
      <div className="fl-body" style={{ height: height === null ? "auto" : height + 8 }}>
        <div ref={innerRef}>{body}</div>
      </div>
    </div>
  );
}
