"use client";

import Image from "next/image";
import { useId, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { pain } from "@/lib/content";
import { BrandIcon, CheckIcon } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/Reveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * "Costs more than it used to", told as a scroll story.
 *
 * Desktop: a sticky stage on the left, five numbered pressures on the right. As each
 * pressure reaches the middle of the screen it lights up and the stage switches to an
 * illustration made for it (curve, struck-out deduction, squeezed cashflow, credit file,
 * the kitchen table). A segmented progress bar tracks where you are.
 * Phones: no sticky stage; each pressure carries its own illustration inline.
 * Every illustration plays to completion (never tied to scroll position), so it's never half-drawn.
 */
export function Pain() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(1); // bitmask of pressures that have scrolled into view

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".pn-item").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
          onEnter: () => setSeen((s) => s | (1 << i)),
        });
        ScrollTrigger.create({ trigger: el, start: "top 85%", once: true, onEnter: () => setSeen((s) => s | (1 << i)) });
      });
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".pn-stage", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".pn-body", start: "top 80%", once: true } });
        gsap.utils.toArray<HTMLElement>(".pn-item").forEach((el) => {
          gsap.from(el.querySelectorAll(".pn-rise"), { y: 36, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        });
      });
    },
    { scope: root },
  );

  const visuals = (on: boolean): ReactNode[] => [
    <InterestVisual key="0" on={on} />,
    <DeductibleVisual key="1" on={on} />,
    <CashflowVisual key="2" on={on} />,
    <CreditVisual key="3" on={on} />,
    <HomeVisual key="4" on={on} />,
  ];

  return (
    <section ref={root} aria-labelledby="pain-title" className="bg-cream py-20 sm:py-28 lg:py-32 2xl:py-40">
      <div className="container-x">
        {/* Heading */}
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-ink-soft">
              <span aria-hidden className="size-2 rounded-full bg-green" />
              The real cost
            </p>
            <SplitHeading id="pain-title" className="h-section mt-5">
              {pain.title}
            </SplitHeading>
          </div>
          <p className="lead text-ink-soft lg:col-span-4 lg:pb-3">{pain.sub}</p>
        </div>

        <div className="pn-body mt-12 grid gap-10 sm:mt-16 lg:grid-cols-12 lg:gap-14 2xl:mt-20 2xl:gap-24">
          {/* Sticky stage (desktop) */}
          <div className="hidden lg:col-span-6 lg:block xl:col-span-6">
            <div className="pn-stage sticky top-[max(6.5rem,calc(50vh-17rem))]">
              <div className="relative h-[30rem] 2xl:h-[32rem]">
                {visuals(false).map((_, i) => (
                  <div
                    key={i}
                    aria-hidden={active !== i}
                    className={clsx(
                      "absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)]",
                      active === i ? "scale-100 opacity-100" : "pointer-events-none scale-[0.96] opacity-0",
                    )}
                  >
                    {visuals(active === i)[i]}
                  </div>
                ))}
              </div>
              {/* Progress */}
              <div className="mt-5 flex items-center gap-4">
                <p className="font-serif text-[1.15rem] tabular-nums text-ink">
                  <span className="text-green">0{active + 1}</span>
                  <span className="text-ink-mute"> / 0{pain.cards.length}</span>
                </p>
                <div className="flex flex-1 gap-1.5">
                  {pain.cards.map((c, i) => (
                    <span key={c.title} className="relative h-1 flex-1 overflow-hidden rounded-pill bg-line">
                      <span
                        className={clsx("absolute inset-0 origin-left rounded-pill bg-green transition-transform duration-700 ease-[var(--ease-out-soft)]", i <= active ? "scale-x-100" : "scale-x-0")}
                      />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* The five pressures */}
          <ol className="lg:col-span-6 xl:col-span-6">
            {pain.cards.map((c, i) => {
              const isActive = active === i;
              return (
                <li key={c.title} className="pn-item group border-t border-line py-10 first:border-t-0 first:pt-0 lg:flex lg:min-h-[46vh] lg:items-center lg:py-14 lg:first:pt-14">
                  <div className={clsx("w-full transition-opacity duration-700", isActive ? "lg:opacity-100" : "lg:opacity-30")}>
                    <div className="pn-rise flex items-center gap-4">
                      <span
                        className={clsx(
                          "font-serif text-[clamp(2.6rem,2rem+2vw,4.2rem)] leading-none tabular-nums transition-colors duration-700",
                          isActive ? "text-green" : "text-ink/15",
                          "max-lg:text-green",
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span aria-hidden className={clsx("h-px flex-1 origin-left bg-line transition-transform duration-700", isActive ? "lg:scale-x-100" : "lg:scale-x-50")} />
                    </div>
                    <h3 className="pn-rise h-sub mt-5">{c.title}</h3>
                    <p className="pn-rise lead mt-4 max-w-xl text-ink-soft">{c.body}</p>
                    {/* Phones: the illustration sits inline */}
                    <div className="pn-rise mt-8 h-[23rem] sm:h-[26rem] lg:hidden">{visuals(!!(seen & (1 << i)))[i]}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Illustrations                                                       */
/* ------------------------------------------------------------------ */

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("relative h-full w-full overflow-hidden rounded-card", className)}>{children}</div>;
}

/*
 * 01 data: an illustrative balance curve (no real figures). One formula drives the bars,
 * the line and the "+ interest" markers so they always line up.
 * Values are a share of the chart height: OWED is the original debt, the rest is interest.
 */
const OWED = 0.16;
const balance = (t: number) => OWED + 0.8 * Math.pow(t, 2.6);
const BAR_COUNT = 28;
const bars = Array.from({ length: BAR_COUNT }, (_, i) => balance((i + 0.5) / BAR_COUNT));
const curvePath = Array.from({ length: 61 }, (_, k) => {
  const t = k / 60;
  return `${k ? "L" : "M"}${(t * 600).toFixed(1)} ${(300 * (1 - balance(t))).toFixed(1)}`;
}).join(" ");
const markers = [0.45, 0.68, 0.86].map((t) => ({ left: t * 100, top: (1 - balance(t)) * 100 }));

/**
 * 01: the balance compounds.
 * Stacked bars (what you owed + interest) grow left to right, the balance line draws
 * over their tops, "+ interest" markers pop along it, and the tip pulses: still growing.
 */
function InterestVisual({ on }: { on: boolean }) {
  const glowId = `pn-glow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <Frame className="flex flex-col bg-paper p-5 ring-1 ring-line sm:p-7">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink-mute">Your ATO balance</p>
          <p className="mt-1 font-serif text-[1.25rem] leading-tight text-ink sm:text-[1.4rem]">Interest on interest</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 rounded-pill bg-ink px-3 py-1.5 text-[0.75rem] font-semibold text-offwhite">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint/70" />
            <span className="relative inline-flex size-2 rounded-full bg-mint" />
          </span>
          Compounding daily
        </span>
      </div>

      {/* Chart */}
      <div className="relative mt-6 min-h-0 flex-1">
        {/* gridlines */}
        {[25, 50, 75].map((p) => (
          <span key={p} aria-hidden className="absolute inset-x-0 border-t border-dashed border-line" style={{ top: `${p}%` }} />
        ))}

        {/* stacked bars: what you owed (base) + interest (top) */}
        <div aria-hidden className="absolute inset-0 flex items-end gap-[3px] sm:gap-1">
          {bars.map((b, i) => (
            <span
              key={i}
              className="flex flex-1 origin-bottom flex-col overflow-hidden rounded-t-[4px] transition-transform duration-700 ease-[var(--ease-out-soft)]"
              style={{ height: `${b * 100}%`, transform: on ? "scaleY(1)" : "scaleY(0)", transitionDelay: on ? `${120 + i * 32}ms` : "0ms" }}
            >
              <span className="flex-1 bg-[linear-gradient(to_top,rgba(32,105,67,0.18),rgba(32,105,67,0.42))]" />
              <span className="shrink-0 bg-sand" style={{ height: `${(OWED / b) * 100}%` }} />
            </span>
          ))}
        </div>

        {/* "what you owed" baseline */}
        <span aria-hidden className="absolute inset-x-0 border-t-[1.5px] border-dashed border-ink/35" style={{ bottom: `${OWED * 100}%` }} />
        <span
          className={clsx("absolute left-0 rounded-md bg-paper/90 px-1.5 py-0.5 text-[0.7rem] font-semibold text-ink-soft transition-opacity duration-500 max-sm:hidden", on ? "opacity-100 delay-300" : "opacity-0")}
          style={{ bottom: `calc(${OWED * 100}% + 6px)` }}
        >
          What you owed
        </span>

        {/* balance line, drawn left to right over the bar tops */}
        <svg
          viewBox="0 0 600 300"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0 h-full w-full overflow-visible transition-[clip-path] duration-[1700ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ clipPath: on ? "inset(-30px -30px -30px -30px)" : "inset(-30px 100% -30px -30px)", transitionDelay: on ? "450ms" : "0ms" }}
        >
          <defs>
            <filter id={glowId} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          <path d={curvePath} fill="none" stroke="#206943" strokeOpacity="0.35" strokeWidth="10" strokeLinecap="round" vectorEffect="non-scaling-stroke" filter={`url(#${glowId})`} />
          <path d={curvePath} fill="none" stroke="#206943" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* "+ interest" markers along the line */}
        {markers.map((m, i) => (
          <span
            key={i}
            aria-hidden
            className={clsx(
              "absolute transition-[opacity,transform] duration-500 ease-[var(--ease-spring)]",
              on ? "scale-100 opacity-100" : "scale-50 opacity-0",
              i === markers.length - 1 && "max-sm:hidden", // phones: keep clear of "Still growing"
            )}
            style={{ left: `${m.left}%`, top: `${m.top}%`, transitionDelay: on ? `${1200 + i * 320}ms` : "0ms" }}
          >
            <span className="absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper ring-[2.5px] ring-green" />
            <span className="absolute bottom-2 -translate-x-[85%] whitespace-nowrap rounded-pill bg-green px-2 py-0.5 text-[0.68rem] font-semibold text-offwhite shadow-[0_6px_14px_-6px_rgba(32,105,67,0.8)]">
              + interest
            </span>
          </span>
        ))}

        {/* tip: still growing */}
        <span
          aria-hidden
          className={clsx("absolute transition-opacity duration-500", on ? "opacity-100" : "opacity-0")}
          style={{ left: "100%", top: `${(1 - balance(1)) * 100}%`, transitionDelay: on ? "2100ms" : "0ms" }}
        >
          <span className="absolute size-6 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-green/35" />
          <span className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green ring-4 ring-paper" />
          <span className="absolute right-4 top-0 inline-flex -translate-y-1/2 items-center gap-1 whitespace-nowrap rounded-pill bg-ink px-2.5 py-1 text-[0.7rem] font-semibold text-offwhite">
            Still growing
            <svg viewBox="0 0 12 12" className="size-3 text-mint" aria-hidden>
              <path d="M6 10V2m0 0L2.5 5.5M6 2l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      </div>

      {/* Axis + legend */}
      <div className="mt-2.5 flex justify-between text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">
        <span>Day 1</span>
        <span>The longer it sits</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-line pt-3 text-[0.78rem] text-ink-soft">
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-[3px] bg-sand" />
          What you owed
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2.5 rounded-[3px] bg-green/40" />
          Interest, charged on interest
        </span>
        <span className="text-ink-mute sm:ml-auto">Illustration only</span>
      </div>
    </Frame>
  );
}

/** 02: no longer deductible. The word is struck out; before / now chips underneath. */
function DeductibleVisual({ on }: { on: boolean }) {
  return (
    <Frame className="grain grain-light flex flex-col justify-between bg-ink p-6 text-offwhite sm:p-8">
      <div aria-hidden className="absolute -right-20 -top-20 size-72 rounded-full border border-sage/25" />
      <div aria-hidden className="absolute -bottom-24 -left-10 size-72 glow [--glow:rgba(32,105,67,0.65)]" />
      <p className="eyebrow relative text-offwhite">
        <span className="size-2 rounded-full bg-mint" />
        Since 1 July 2025
      </p>
      <p className="relative font-serif text-[clamp(2.6rem,1.8rem+3vw,4.6rem)] leading-none tracking-tight">
        <span className="relative inline-block text-offwhite/75">
          Tax-deductible
          <span
            aria-hidden
            className={clsx("absolute left-[-3%] top-[56%] h-[0.08em] w-[106%] origin-left rounded-pill bg-mint transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]", on ? "scale-x-100 delay-300" : "scale-x-0")}
          />
        </span>
      </p>
      <div className="relative grid gap-2.5 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-offwhite">Before July 2025</p>
          <p className="mt-1.5 inline-flex items-center gap-2 font-medium text-offwhite">
            <CheckIcon className="size-4 text-offwhite" />
            ATO interest deductible
          </p>
        </div>
        <div className={clsx("rounded-2xl bg-mint/15 p-4 ring-1 ring-mint/30 transition-[opacity,transform] duration-700", on ? "translate-y-0 opacity-100 delay-700" : "translate-y-3 opacity-0")}>
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-offwhite">Now</p>
          <p className="mt-1.5 font-medium text-offwhite">A full dollar for every dollar</p>
        </div>
      </div>
    </Frame>
  );
}

/** 03: cashflow squeeze. The ATO plan pushes into the month and the room to run the business shrinks. */
const flow = [
  { label: "Wages", before: 34, after: 30, cls: "bg-ink" },
  { label: "Suppliers", before: 26, after: 23, cls: "bg-green" },
  { label: "Your own bills", before: 16, after: 14, cls: "bg-sage" },
  { label: "ATO plan", before: 0, after: 28, cls: "bg-[repeating-linear-gradient(135deg,#c98a2b_0_6px,#d9a24a_6px_12px)]" },
  { label: "Room to run the business", before: 24, after: 5, cls: "bg-paper ring-1 ring-inset ring-line" },
];
function CashflowVisual({ on }: { on: boolean }) {
  return (
    <Frame className="flex flex-col justify-between bg-paper p-6 ring-1 ring-line sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-paper px-3 py-1.5 text-[0.8rem] font-semibold text-ink">
          <BrandIcon name="calendar" className="size-3.5 text-green" />
          This month&rsquo;s cashflow
        </span>
        <span className={clsx("whitespace-nowrap rounded-pill bg-[#f6e3bf] px-3 py-1.5 text-[0.78rem] font-semibold text-amber transition-opacity duration-500", on ? "opacity-100 delay-500" : "opacity-0")}>
          + ATO payment plan
        </span>
      </div>

      <div>
        <div className="flex h-16 gap-1 overflow-hidden rounded-2xl sm:h-20">
          {flow.map((f, i) => (
            <span
              key={f.label}
              className={clsx("h-full rounded-xl transition-[flex-grow] duration-[1200ms] ease-[cubic-bezier(0.65,0,0.35,1)]", f.cls)}
              style={{ flexGrow: on ? f.after : f.before, flexBasis: 0, transitionDelay: on ? `${300 + i * 60}ms` : "0ms" }}
            />
          ))}
        </div>
        <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[0.86rem] text-ink-soft">
          {flow.map((f) => (
            <li key={f.label} className={clsx("flex items-center gap-2", f.label === "Room to run the business" && "col-span-2")}>
              <span className={clsx("size-3 shrink-0 rounded-[4px]", f.cls)} />
              <span className={clsx(f.label === "ATO plan" && "font-semibold text-amber")}>{f.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="text-[0.74rem] text-ink-mute">Illustration only.</p>
    </Frame>
  );
}

/** 04: it can follow you. A credit file fills in line by line. */
function CreditVisual({ on }: { on: boolean }) {
  const rows = [
    { k: "Business tax debt", v: "$100,000+" },
    { k: "Overdue", v: "90+ days" },
    { k: "Engaging with the ATO", v: "No" },
  ];
  return (
    <Frame className="grid place-items-center bg-[radial-gradient(circle_at_30%_20%,#eef0e4,#e2e6d1)] p-6 sm:p-8">
      <div className="w-full max-w-md rounded-[1.4rem] bg-paper p-5 shadow-[0_30px_60px_-30px_rgba(1,36,18,0.45)] ring-1 ring-ink/5 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
          <span className="inline-flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-ink text-offwhite">
              <BrandIcon name="file-copy" className="size-4.5" />
            </span>
            <span>
              <span className="block font-semibold leading-tight">Credit file</span>
              <span className="block text-[0.8rem] text-ink-mute">Business</span>
            </span>
          </span>
          <span
            className={clsx(
              "rounded-pill bg-[#f6e3bf] px-3 py-1 text-[0.76rem] font-semibold text-amber transition-[opacity,transform] duration-500",
              on ? "scale-100 opacity-100 delay-[1100ms]" : "scale-90 opacity-0",
            )}
          >
            Can be reported
          </span>
        </div>
        <dl className="mt-2">
          {rows.map((r, i) => (
            <div
              key={r.k}
              className={clsx("flex items-center justify-between gap-4 border-b border-dashed border-line py-3.5 transition-[opacity,transform] duration-500 last:border-0", on ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0")}
              style={{ transitionDelay: on ? `${250 + i * 220}ms` : "0ms" }}
            >
              <dt className="text-[0.92rem] text-ink-soft">{r.k}</dt>
              <dd className="font-serif text-[1.15rem] text-ink">{r.v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 h-2 overflow-hidden rounded-pill bg-sand-soft">
          <span className={clsx("block h-full origin-left rounded-pill bg-amber/70 transition-transform duration-[1200ms] ease-[var(--ease-out-soft)]", on ? "scale-x-75 delay-500" : "scale-x-0")} />
        </div>
        <p className="mt-2 text-[0.74rem] text-ink-mute">Makes the next loan harder to get</p>
      </div>
    </Frame>
  );
}

/** 05: it comes home with you. The kitchen table, with the letters, reminders and late nights floating in. */
function HomeVisual({ on }: { on: boolean }) {
  const notes = [
    { t: "The letters", pos: "left-5 top-6 sm:left-7 sm:top-8", d: 200, bob: "6s" },
    { t: "The reminders", pos: "right-5 top-[32%] sm:right-7", d: 420, bob: "7s" },
    { t: "The late nights", pos: "left-[18%] bottom-20 sm:bottom-24", d: 640, bob: "6.5s" },
  ];
  return (
    <Frame className="bg-ink">
      <Image src="/images/pain-at-home.webp" alt="" fill quality={90} sizes="(min-width: 1024px) 45vw, 100vw" className={clsx("object-cover object-[45%_35%] transition-transform duration-[2400ms] ease-[var(--ease-out-soft)]", on ? "scale-100" : "scale-110")} />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(1,36,18,0.9)_8%,rgba(1,36,18,0.15)_55%,rgba(1,36,18,0.35))]" />
      {notes.map((n) => (
        <span
          key={n.t}
          className={clsx("absolute transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)]", n.pos, on ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}
          style={{ transitionDelay: on ? `${n.d}ms` : "0ms" }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-2xl bg-offwhite px-3.5 py-2 text-[0.88rem] font-semibold text-ink shadow-[0_16px_30px_-16px_rgba(0,0,0,0.6)] motion-safe:animate-[bob_var(--bob)_ease-in-out_infinite]"
            style={{ ["--bob" as string]: n.bob }}
          >
            <BrandIcon name={n.t === "The letters" ? "mail" : n.t === "The reminders" ? "calendar" : "clock"} className="size-4 text-green" />
            {n.t}
          </span>
        </span>
      ))}
    </Frame>
  );
}
