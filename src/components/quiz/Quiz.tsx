"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FormEvent } from "react";
import clsx from "clsx";
import { NO_PROPERTY, quizSteps, quizTrust, site, type ChoiceStep } from "@/lib/content";
import { attribution, newEventId, track, trackCustom } from "@/lib/track";
import { ArrowIcon, BrandIcon, CheckIcon } from "@/components/ui/primitives";
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

type Answers = Record<string, string>;
type Contact = { name: string; phone: string; email: string };
type Key = keyof Contact;
const KEYS: Key[] = ["name", "phone", "email"];
type Status = "quiz" | "sending" | "done";

const STORE_KEY = "ft-ato-quiz";

/** The ten questions shown as four short stages. */
const STAGES = [
  { label: "ATO debt", ids: ["atoDebt", "atoStatus"] },
  { label: "Property", ids: ["property", "propertyValue", "mortgage"] },
  { label: "Business", ids: ["trading", "structure", "lodgements", "state"] },
  { label: "Details", ids: ["contact"] },
];
const ADVANCE_MS = 280;

/**
 * The lead quiz. One question per screen; choosing an answer moves on by itself.
 * Steps slide in the direction of travel and the card eases to each step's height.
 * Answers persist for the session, so a reload doesn't lose progress.
 */
export function Quiz() {
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<"next" | "prev">("next");
  const [status, setStatus] = useState<Status>("quiz");
  const [picked, setPicked] = useState<string | null>(null);
  const [contact, setContact] = useState<Contact>({ name: "", phone: "", email: "" });
  const [touched, setTouched] = useState<Record<Key, boolean>>({ name: false, phone: false, email: false });
  const [error, setError] = useState<string | null>(null);
  const lock = useRef(false);
  const started = useRef(false);
  const [moved, setMoved] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const steps = useMemo(() => quizSteps.filter((s) => s.kind === "contact" || !s.skipIf?.(answers)), [answers]);
  const step = steps[Math.min(index, steps.length - 1)];
  const total = steps.length;
  const progress = status === "done" ? 1 : (index + (status === "sending" ? 1 : 0)) / total;

  // Group the questions into four short stages for the progress header
  const answeredUpTo = status === "quiz" ? index : total; // steps before this position are answered
  const stageFill = STAGES.map((stage) => {
    const positions = steps.map((s, i) => (stage.ids.includes(s.id) ? i : -1)).filter((i) => i >= 0);
    if (!positions.length) return 1; // stage skipped (e.g. no property)
    return positions.filter((i) => i < answeredUpTo).length / positions.length;
  });
  const stageNow = Math.max(
    0,
    STAGES.findIndex((stage) => stage.ids.includes(step.id)),
  );
  const cheer =
    status === "done"
      ? { icon: "check", text: "Sent to Robert" }
      : step.kind === "contact"
        ? { icon: "check", text: "Last step" }
        : index === 0
          ? { icon: "clock", text: "About a minute" }
          : progress < 0.5
            ? { icon: "check", text: "Great start" }
            : { icon: "check", text: "Over halfway" };

  // Restore progress from this session
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

  // Move focus to the new question after the visitor navigates (not on first load)
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
    setIndex(Math.max(0, to));
  };

  const choose = (s: ChoiceStep, option: string) => {
    if (lock.current) return;
    lock.current = true;
    setPicked(option);
    const next = { ...answers, [s.id]: option };
    setAnswers(next);
    if (!started.current) {
      started.current = true;
      trackCustom("QuizStart");
    }
    trackCustom("QuizStep", { step: index + 1, question: s.id });
    setTimeout(() => {
      lock.current = false;
      go(index + 1, "next");
    }, ADVANCE_MS);
  };

  // Same rules as the server (src/lib/validation.ts). A field's error shows once the visitor has left it.
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
      const firstBad = KEYS.find((k) => !checks[k].ok);
      document.getElementById(`q-${firstBad}`)?.focus();
      return;
    }
    const clean = { name: name.value, phone: phone.value, email: email.value };
    const honeypot = (new FormData(e.currentTarget).get("company") as string) || "";
    const eventId = newEventId();
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, contact: clean, eventId, attribution: attribution(), company: honeypot }),
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

  const firstName = contact.name.trim().split(/\s+/)[0];
  const stepKey = status === "done" ? "done" : step.id;

  return (
    <div id="quiz" className="relative">
      {/* soft glow behind the card */}
      <div aria-hidden className="glow absolute -inset-16 [--glow:rgba(159,211,176,0.32)]" />

      <div className="relative rounded-[1.75rem] bg-paper text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55),0_0_0_1px_rgba(1,36,18,0.06)]">
        {/*
          Progress: four short stages instead of "Step x of 10", so it never feels long.
          Each stage bar fills as its questions are answered; finished stages get a tick.
          The right-hand line encourages instead of counting.
        */}
        <div className="px-5 pt-5 sm:px-8 sm:pt-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.74rem] font-semibold uppercase tracking-[0.14em] text-green">{status === "done" ? "All done" : STAGES[stageNow].label}</p>
            <p aria-live="polite" className="inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-ink-mute">
              {cheer.icon === "clock" ? <BrandIcon name="clock" className="size-3.5" /> : <CheckIcon className="size-3.5 text-green" />}
              {cheer.text}
            </p>
          </div>
          <div
            className="mt-3 grid grid-cols-4 gap-1.5"
            role="progressbar"
            aria-label="Quiz progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
            aria-valuetext={status === "done" ? "Complete" : `${STAGES[stageNow].label}, ${Math.round(progress * 100)}% done`}
          >
            {stageFill.map((fill, si) => {
              const finished = fill >= 1;
              const current = status !== "done" && si === stageNow;
              return (
                <div key={STAGES[si].label} aria-hidden>
                  <span className="block h-1.5 overflow-hidden rounded-pill bg-sand-soft">
                    <span
                      className="block h-full rounded-pill bg-green transition-[width] duration-700 ease-[var(--ease-out-soft)]"
                      style={{ width: `${(current ? Math.max(fill, 0.14) : fill) * 100}%` }}
                    />
                  </span>
                  <span
                    className={clsx(
                      "mt-2 flex items-center gap-1 whitespace-nowrap text-[0.72rem] font-medium transition-colors duration-500",
                      finished ? "text-green" : current ? "text-ink" : "text-ink-mute/70",
                    )}
                  >
                    {finished && <CheckIcon className="size-3 shrink-0" />}
                    {STAGES[si].label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animated body */}
        <div className="overflow-hidden transition-[height] duration-500 ease-[var(--ease-out-soft)]" style={{ height: height ?? "auto" }}>
          <div ref={bodyRef} className="px-5 pb-5 pt-6 sm:px-8 sm:pb-7 sm:pt-7">
            <div key={stepKey} className={clsx(moved && (dir === "next" ? "animate-[step-in-next_0.55s_var(--ease-out-soft)]" : "animate-[step-in-prev_0.55s_var(--ease-out-soft)]"))}>
              {status === "done" ? (
                <Done firstName={firstName} noProperty={answers.property === NO_PROPERTY} headingRef={headingRef} />
              ) : step.kind === "choice" ? (
                <fieldset>
                  <legend className="contents">
                    <h2 ref={headingRef} tabIndex={-1} data-quiz-focus className="h-card text-[clamp(1.55rem,1.25rem+0.9vw,2rem)] outline-none">
                      {step.question}
                    </h2>
                  </legend>
                  {step.hint && <p className="mt-1.5 text-[0.92rem] text-ink-mute">{step.hint}</p>}
                  <div className={clsx("mt-5", step.compact ? "grid grid-cols-4 gap-2" : "flex flex-col gap-2.5")}>
                    {step.options.map((o, i) => {
                      const selected = picked === o || (!picked && answers[step.id] === o);
                      return (
                        <button
                          key={o}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => choose(step, o)}
                          style={{ animationDelay: moved ? `${80 + i * 40}ms` : undefined }}
                          className={clsx(
                            "group relative flex items-center rounded-2xl border-[1.5px] text-left font-medium transition-[border-color,background-color,transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] motion-safe:animate-[rise_0.5s_var(--ease-out-soft)_both] hover:-translate-y-px active:scale-[0.99]",
                            step.compact ? "justify-center px-2 py-3.5 text-[0.98rem]" : "min-h-[3.5rem] gap-3.5 px-4 py-3 text-[1rem]",
                            selected
                              ? "border-green bg-sage-soft/60 shadow-[0_8px_20px_-14px_rgba(32,105,67,0.8)]"
                              : "border-line bg-canvas hover:border-ink/25 hover:bg-paper hover:shadow-[0_10px_24px_-18px_rgba(1,36,18,0.5)]",
                          )}
                        >
                          {!step.compact && (
                            <span
                              aria-hidden
                              className={clsx(
                                "grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] transition-colors duration-300",
                                selected ? "border-green bg-green text-offwhite" : "border-ink/20 bg-paper text-transparent group-hover:border-ink/40",
                              )}
                            >
                              {selected && <CheckIcon className="size-3.5 animate-[pop_0.35s_var(--ease-out-soft)]" />}
                            </span>
                          )}
                          <span className="flex-1">{o}</span>
                          {!step.compact && (
                            <ArrowIcon className="size-4 shrink-0 -translate-x-1 text-ink/0 transition-[transform,color] duration-300 group-hover:translate-x-0 group-hover:text-ink/45" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ) : (
                <form onSubmit={submit} noValidate>
                  <h2 ref={headingRef} tabIndex={-1} data-quiz-focus className="h-card text-[clamp(1.55rem,1.25rem+0.9vw,2rem)] outline-none">
                    {step.question}
                  </h2>
                  {step.hint && <p className="mt-1.5 text-[0.92rem] text-ink-mute">{step.hint}</p>}
                  <div className="mt-5 flex flex-col gap-3.5">
                    <Field
                      id="q-name"
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
                      id="q-phone"
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
                      id="q-email"
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
                        <p className="mt-1.5 text-[0.85rem] text-ink-soft">
                          Did you mean{" "}
                          <button
                            type="button"
                            onClick={() => setContact((c) => ({ ...c, email: emailSuggestion }))}
                            className="font-semibold text-green underline underline-offset-2 hover:text-ink"
                          >
                            {emailSuggestion}
                          </button>
                          ?
                        </p>
                      )}
                    </Field>
                    {/* Honeypot: hidden from people, filled by bots */}
                    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                      <label>
                        Company
                        <input name="company" tabIndex={-1} autoComplete="off" />
                      </label>
                    </div>
                  </div>

                  {error && (
                    <p role="alert" className="mt-4 rounded-xl bg-[#fdecea] px-4 py-3 text-[0.92rem] text-[#8c1d18]">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group mt-5 flex min-h-14 w-full items-center justify-center gap-3 rounded-pill bg-ink py-2 pl-6 pr-2 text-[1rem] font-semibold text-offwhite shadow-[0_14px_30px_-16px_rgba(1,36,18,0.7)] transition-[background-color,transform] duration-300 hover:bg-green-600 active:scale-[0.99] disabled:opacity-80"
                  >
                    <span className="flex-1 text-center">{status === "sending" ? "Sending…" : "Send to Robert"}</span>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-green transition-colors duration-300 group-hover:bg-offwhite group-hover:text-ink">
                      {status === "sending" ? (
                        <span aria-hidden className="size-4 animate-[spin_0.8s_linear_infinite] rounded-full border-2 border-current border-r-transparent" />
                      ) : (
                        <ArrowIcon className="size-4 transition-transform duration-300 group-hover:-rotate-45" />
                      )}
                    </span>
                  </button>
                  <p className="mt-3 text-center text-[0.8rem] leading-relaxed text-ink-mute">
                    We only use your details to contact you about this enquiry. See our{" "}
                    <a href={site.privacyHref} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-ink">
                      privacy policy
                    </a>
                    .
                  </p>
                </form>
              )}
            </div>

            {/* Footer row: back + trust */}
            {status !== "done" && (
              <div className="mt-5 flex min-h-8 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-4">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => go(index - 1, "prev")}
                    className="group inline-flex min-h-11 items-center gap-2.5 rounded-pill bg-canvas py-1.5 pl-1.5 pr-4 text-[0.88rem] font-semibold text-ink ring-1 ring-line transition-[background-color,box-shadow,transform] duration-300 hover:bg-sand-soft hover:ring-ink/20 active:scale-[0.98]"
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-paper text-ink shadow-[0_4px_10px_-6px_rgba(1,36,18,0.5)] ring-1 ring-line transition-colors duration-300 group-hover:bg-ink group-hover:text-offwhite group-hover:ring-ink">
                      <ArrowIcon className="size-3.5 rotate-180 transition-transform duration-300 group-hover:-translate-x-0.5" />
                    </span>
                    Previous question
                  </button>
                ) : (
                  <span />
                )}
                <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.78rem] text-ink-mute">
                  {quizTrust.map((t) => (
                    <li key={t} className="inline-flex items-center gap-1.5">
                      <CheckIcon className="size-3.5 text-green" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
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
  children?: React.ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "id" | "children">) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.88rem] font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          aria-required
          className="field pr-12"
          {...rest}
        />
        {/* tick once the value passes validation */}
        <span
          aria-hidden
          className={clsx(
            "pointer-events-none absolute right-3.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-green text-offwhite transition-[opacity,transform] duration-300 ease-[var(--ease-out-soft)]",
            valid && !error ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        >
          <CheckIcon className="size-3.5" />
        </span>
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-[0.82rem] text-[#b3261e]">
          {error}
        </p>
      )}
      {children}
    </div>
  );
}

function Done({ firstName, noProperty, headingRef }: { firstName: string; noProperty: boolean; headingRef: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <div className="py-2 text-center">
      <div className="relative mx-auto grid size-20 place-items-center">
        <span aria-hidden className="absolute inset-0 rounded-full bg-green/25 motion-safe:animate-[pulse-ring_1.6s_var(--ease-out-soft)_0.3s_2]" />
        <svg viewBox="0 0 80 80" aria-hidden className="relative size-20">
          <circle cx="40" cy="40" r="38" fill="var(--color-green)" />
          <path
            d="M25 41.5 35 51l20-21"
            fill="none"
            stroke="var(--color-offwhite)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray="1"
            className="animate-[draw_0.7s_var(--ease-out-soft)_0.25s_both]"
          />
        </svg>
      </div>
      <h2 ref={headingRef} tabIndex={-1} data-quiz-focus className="h-sub mt-6 outline-none">
        Thanks{firstName ? `, ${firstName}` : ""}. You&rsquo;re all set.
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-ink-soft">
        Robert will call you {site.callback} for a 15-minute chat about your options. He&rsquo;ll tell you straight whether this is the right move.
      </p>
      {noProperty && (
        <p className="mx-auto mt-4 max-w-sm rounded-2xl bg-sand-soft px-4 py-3 text-[0.92rem] text-ink-soft">
          Paying out the ATO through a home loan needs equity in a property, so this exact option may not fit. Robert can still talk you through what might.
        </p>
      )}
      <p className="mt-5 text-[0.85rem] text-ink-mute">In the meantime, it&rsquo;s worth a quick chat with your accountant about your tax position.</p>
    </div>
  );
}
