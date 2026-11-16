"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import clsx from "clsx";
import { NO_PROPERTY, quizSteps, site, type ChoiceStep } from "@/lib/content";
import { attribution, newEventId, track, trackCustom } from "@/lib/track";
import {
  checkAuMobile,
  checkEmail,
  checkName,
  formatAuMobile,
  sanitiseEmail,
  sanitiseName,
  sanitisePhone,
  suggestEmail,
} from "@/lib/validation";
import s from "./original.module.css";

type Answers = Record<string, string>;
type Contact = { name: string; phone: string; email: string };
type Key = keyof Contact;
type Status = "quiz" | "sending" | "done";

const STORE_KEY = "ft-ato-quiz-original";
const ADVANCE_MS = 260;
const KEYS: Key[] = ["name", "phone", "email"];

/**
 * The lead quiz in the original artifact's style: "Step x of y", a thin progress bar,
 * one question per screen. Picking an answer moves on by itself; each step slides in
 * the direction of travel and the card eases to the new height.
 * Same data, validation and /api/lead (GoHighLevel) submission as the classic quiz.
 */
export function OriginalQuiz() {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [moved, setMoved] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("quiz");
  const [contact, setContact] = useState<Contact>({ name: "", phone: "", email: "" });
  const [touched, setTouched] = useState<Record<Key, boolean>>({ name: false, phone: false, email: false });
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const steps = useMemo(() => quizSteps.filter((q) => q.kind === "contact" || !q.skipIf?.(answers)), [answers]);
  const step = steps[Math.min(index, steps.length - 1)];
  const total = steps.length;
  const pct = status === "done" ? 100 : ((Math.min(index, total - 1) + 1) / total) * 100;

  // Restore progress for this browser session
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { answers?: Answers; index?: number };
      queueMicrotask(() => {
        if (saved.answers) setAnswers(saved.answers);
        if (typeof saved.index === "number") setIndex(saved.index);
        started.current = Object.keys(saved.answers ?? {}).length > 0;
      });
    } catch {
      /* storage unavailable */
    }
  }, []);
  useEffect(() => {
    if (status === "done") return;
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify({ answers, index }));
    } catch {
      /* storage unavailable */
    }
  }, [answers, index, status]);

  // Focus the new question after the visitor navigates (not on first load)
  useEffect(() => {
    if (moved) headingRef.current?.focus({ preventScroll: true });
  }, [index, status, moved]);

  // Card height eases between steps
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = (to: number, d: "next" | "prev") => {
    setMoved(true);
    setDir(d);
    setPicked(null);
    setError(null);
    setIndex(Math.max(0, to));
  };

  const choose = (q: ChoiceStep, option: string) => {
    if (lock.current) return;
    lock.current = true;
    setPicked(option);
    setAnswers((a) => ({ ...a, [q.id]: option }));
    if (!started.current) {
      started.current = true;
      trackCustom("QuizStart");
    }
    trackCustom("QuizStep", { step: index + 1, question: q.id });
    setTimeout(() => {
      lock.current = false;
      go(index + 1, "next");
    }, ADVANCE_MS);
  };

  // Shared rules with the server (src/lib/validation.ts). A field's error shows once it has been left.
  const checks = { name: checkName(contact.name), phone: checkAuMobile(contact.phone), email: checkEmail(contact.email) };
  const errorOf = (k: Key) => {
    const c = checks[k];
    return touched[k] && !c.ok ? c.error : null;
  };
  const emailSuggestion = checks.email.ok ? suggestEmail(contact.email) : null;
  const touch = (k: Key) => setTouched((t) => (t[k] ? t : { ...t, [k]: true }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    setError(null);
    const { name, phone, email } = checks;
    if (!name.ok || !phone.ok || !email.ok) {
      document.getElementById(`oq-${KEYS.find((k) => !checks[k].ok)}`)?.focus();
      return;
    }
    const honeypot = (new FormData(e.currentTarget).get("company") as string) || "";
    const eventId = newEventId();
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          contact: { name: name.value, phone: phone.value, email: email.value },
          eventId,
          attribution: attribution(),
          company: honeypot,
        }),
      });
      if (res.status === 422) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus("quiz");
        setError(data.error || "Please check your details and try again.");
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      track("Lead", { content_name: "ATO debt quiz", content_category: answers.atoDebt }, eventId);
      try {
        sessionStorage.removeItem(STORE_KEY);
      } catch {}
      setMoved(true);
      setDir("next");
      setStatus("done");
    } catch {
      setStatus("quiz");
      setError("Something went wrong sending your details. Please try again.");
    }
  };

  const stepKey = status === "done" ? "done" : step.id;
  const firstName = contact.name.trim().split(/\s+/)[0];

  return (
    <div id="quiz" className={s.quiz}>
      <div className={s.quizMeta}>
        <span aria-live="polite">{status === "done" ? "All done" : `Step ${Math.min(index, total - 1) + 1} of ${total}`}</span>
        <span>About a minute</span>
      </div>
      <div
        className={s.bar}
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <div className={s.barFill} style={{ width: `${pct}%` }} />
      </div>

      <div className={s.body} style={{ height: height ?? "auto" }}>
        <div ref={bodyRef}>
          <div key={stepKey} className={clsx(moved && (dir === "next" ? s.stepNext : s.stepPrev))}>
            {status === "done" ? (
              <Done firstName={firstName} noProperty={answers.property === NO_PROPERTY} headingRef={headingRef} />
            ) : step.kind === "choice" ? (
              <fieldset style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
                <legend style={{ display: "contents" }}>
                  <h2 ref={headingRef} tabIndex={-1} data-quiz-focus className={clsx(s.serif, s.qTitle)}>
                    {step.question}
                  </h2>
                </legend>
                {step.hint ? <p className={s.qHint}>{step.hint}</p> : <div className={s.qGap} />}
                <div className={step.compact ? s.optionsGrid : s.options}>
                  {step.options.map((o, i) => {
                    const on = picked === o || (!picked && answers[step.id] === o);
                    return (
                      <button
                        key={o}
                        type="button"
                        aria-pressed={on}
                        onClick={() => choose(step, o)}
                        className={clsx(s.option, on && s.optionOn, moved && s.rise)}
                        style={moved ? { animationDelay: `${70 + i * 35}ms` } : undefined}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ) : (
              <form onSubmit={submit} noValidate>
                <h2 ref={headingRef} tabIndex={-1} data-quiz-focus className={clsx(s.serif, s.qTitle)}>
                  {step.question}
                </h2>
                {step.hint && <p className={s.qHint}>{step.hint}</p>}
                <div className={s.fields}>
                  <Field
                    id="oq-name"
                    label="First and last name"
                    autoComplete="name"
                    autoCapitalize="words"
                    spellCheck={false}
                    maxLength={60}
                    placeholder="e.g. Sarah Mitchell"
                    value={contact.name}
                    onChange={(v) => setContact((c) => ({ ...c, name: sanitiseName(v) }))}
                    onBlur={() => touch("name")}
                    error={errorOf("name")}
                    valid={checks.name.ok}
                  />
                  <Field
                    id="oq-phone"
                    label="Australian mobile"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    maxLength={18}
                    placeholder="04XX XXX XXX"
                    value={contact.phone}
                    onChange={(v) => setContact((c) => ({ ...c, phone: sanitisePhone(v) }))}
                    onBlur={() => {
                      touch("phone");
                      const p = checks.phone;
                      if (p.ok) setContact((c) => ({ ...c, phone: formatAuMobile(p.value) }));
                    }}
                    error={errorOf("phone")}
                    valid={checks.phone.ok}
                  />
                  <Field
                    id="oq-email"
                    label="Email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={254}
                    placeholder="name@example.com"
                    value={contact.email}
                    onChange={(v) => setContact((c) => ({ ...c, email: sanitiseEmail(v) }))}
                    onBlur={() => touch("email")}
                    error={errorOf("email")}
                    valid={checks.email.ok && !emailSuggestion}
                  >
                    {touched.email && emailSuggestion && (
                      <p className={s.suggest}>
                        Did you mean{" "}
                        <button type="button" onClick={() => setContact((c) => ({ ...c, email: emailSuggestion }))}>
                          {emailSuggestion}
                        </button>
                        ?
                      </p>
                    )}
                  </Field>
                  {/* Honeypot: hidden from people, filled by bots */}
                  <div aria-hidden style={{ position: "absolute", left: -9999, width: 0, height: 0, overflow: "hidden" }}>
                    <label>
                      Company
                      <input name="company" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>
                </div>

                {error && (
                  <p role="alert" className={s.alert}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={status === "sending"} className={s.submit}>
                  {status === "sending" && <span aria-hidden className={s.spinner} />}
                  {status === "sending" ? "Sending…" : "Send to Robert"}
                </button>
                <p className={s.privacy}>
                  We only use your details to contact you about this enquiry. See our{" "}
                  <a href={site.privacyHref} target="_blank" rel="noopener">
                    privacy policy
                  </a>
                  .
                </p>
              </form>
            )}
          </div>

          {status !== "done" && index > 0 && (
            <button type="button" className={s.back} onClick={() => go(index - 1, "prev")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 18l-6-6 6-6" />
              </svg>
              Back
            </button>
          )}
        </div>
      </div>

      {status !== "done" && (
        <div className={s.trust}>
          <span>Licensed broker</span>
          <span>ACL {site.acl}</span>
          <span>Your details stay with us</span>
        </div>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  valid,
  children,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
  valid?: boolean;
  children?: ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id" | "children">) {
  return (
    <div>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <div className={s.inputWrap}>
        <input
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          aria-required
          className={s.input}
          {...rest}
        />
        <span aria-hidden className={clsx(s.ok, valid && !error && s.okOn)}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </span>
      </div>
      {error && (
        <p id={`${id}-err`} className={s.error}>
          {error}
        </p>
      )}
      {children}
    </div>
  );
}

function Done({ firstName, noProperty, headingRef }: { firstName: string; noProperty: boolean; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <div className={s.done}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className={s.doneIcon}>
        <circle cx="32" cy="32" r="31" fill="#206943" />
        <path d="M20 33l8 8 16-17" fill="none" stroke="#FBFEEE" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      </svg>
      <h2 ref={headingRef} tabIndex={-1} data-quiz-focus className={clsx(s.serif, s.doneTitle)}>
        Thanks{firstName ? `, ${firstName}` : ""}. You&rsquo;re all set.
      </h2>
      <p className={s.doneText}>
        Robert will call you {site.callback} for a 15-minute chat about your options. He&rsquo;ll tell you straight whether this is the right move.
      </p>
      {noProperty && (
        <p className={s.doneNote}>
          Paying out the ATO through a home loan needs equity in a property, so this exact option may not fit. Robert can still talk you through what might.
        </p>
      )}
    </div>
  );
}
