"use client";

import clsx from "clsx";
import { compare } from "@/lib/content";
import { BrandIcon, CheckIcon, QuizButton } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/Reveal";
import { useInView } from "@/components/ui/useInView";

type Tone = "good" | "neutral" | "risk";

/** Status marks (all sit on light cards): amber for the ATO side; green / info / caution for the home-loan side. */
function Mark({ tone }: { tone: Tone | "ato" }) {
  if (tone === "ato")
    return (
      <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-[#f6e3bf] text-amber">
        <svg viewBox="0 0 12 12" className="size-3">
          <path d="M3 6h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
    );
  if (tone === "good")
    return (
      <span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-green text-offwhite">
        <CheckIcon className="size-3.5" />
      </span>
    );
  return (
    <span
      aria-hidden
      className={clsx("grid size-6 shrink-0 place-items-center rounded-full font-serif text-[0.8rem] font-semibold", tone === "risk" ? "bg-[#f6e3bf] text-amber" : "bg-sand text-ink")}
    >
      {tone === "risk" ? "!" : "i"}
    </span>
  );
}

/** Desktop grid: ATO card | spine of row labels | home-loan card. */
const COLS = "grid grid-cols-[minmax(0,1fr)_minmax(14rem,17rem)_minmax(0,1fr)]";

/**
 * Head-to-head comparison on the green band: staying on an ATO payment plan vs clearing it
 * through the home loan. Every card on the green is light for readability:
 * cream card (ATO) | centre spine with a "vs" medallion and white label pills | white card with a
 * mint ring (home loan). Hovering a row lights it across all three columns. Risks shown on both sides.
 * Phones: one cream card per row, both answers stacked.
 */
export function Compare() {
  const [ref, inView] = useInView<HTMLDivElement>(0.15);
  const n = compare.rows.length;

  return (
    <section aria-labelledby="compare-title" className="on-dark grain grain-light relative overflow-hidden bg-ink py-20 text-offwhite sm:py-28 lg:py-32 2xl:py-40">
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/3 size-[44rem] glow [--glow:rgba(32,105,67,0.55)]" />

      <div className="container-x relative">
        <div className="max-w-5xl">
          <p className="eyebrow text-sand/75">
            <span aria-hidden className="size-2 rounded-full bg-mint" />
            {compare.eyebrow}
          </p>
          <SplitHeading id="compare-title" className="h-section mt-5">
            {compare.title}
          </SplitHeading>
        </div>

        <div ref={ref} className="mt-12 sm:mt-16 2xl:mt-20">
          {/* ---------- Desktop: versus layout ---------- */}
          <div role="table" aria-label="ATO payment plan compared with a home loan restructure" className="relative hidden lg:block">
            {/* Header */}
            <div role="row" className={clsx(COLS, "items-stretch")}>
              <div role="columnheader" className="relative overflow-hidden rounded-tl-[1.75rem] bg-cream px-9 pb-7 pt-8 text-right text-ink">
                <div className="flex items-center justify-end gap-4">
                  <div>
                    <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-amber">{compare.ato.tag}</span>
                    <p className="mt-1 font-serif text-[1.6rem] leading-tight 2xl:text-[1.8rem]">{compare.ato.label}</p>
                  </div>
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#f6e3bf] text-amber">
                    <BrandIcon name="calendar" className="size-6" />
                  </span>
                </div>
                <p className="mt-3 text-[0.95rem] text-ink-soft">{compare.ato.summary}</p>
              </div>

              {/* vs medallion */}
              <div role="columnheader" className="relative grid place-items-center">
                <span className="sr-only">Compared on</span>
                <span aria-hidden className="absolute bottom-0 left-1/2 top-1/2 w-px -translate-x-1/2 bg-white/25" />
                <span
                  aria-hidden
                  className={clsx(
                    "relative grid size-20 place-items-center rounded-full bg-paper font-serif text-[1.6rem] italic text-green shadow-[0_0_0_8px_rgba(1,36,18,0.95),0_18px_40px_-16px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-[var(--ease-spring)]",
                    inView ? "scale-100" : "scale-0",
                  )}
                >
                  vs
                </span>
              </div>

              <div role="columnheader" className="relative overflow-hidden rounded-tr-[1.75rem] bg-paper px-9 pb-7 pt-8 text-ink shadow-[inset_0_4px_0_0_var(--color-mint)]">
                <span aria-hidden className="absolute -right-16 -top-20 size-56 glow [--glow:rgba(159,211,176,0.6)]" />
                <div className="relative flex items-center gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-green text-offwhite">
                    <BrandIcon name="home-1" className="size-6" />
                  </span>
                  <div>
                    <span className="inline-flex rounded-pill bg-green px-2.5 py-0.5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-offwhite">{compare.home.tag}</span>
                    <p className="mt-1 font-serif text-[1.6rem] leading-tight 2xl:text-[1.8rem]">{compare.home.label}</p>
                  </div>
                </div>
                <p className="relative mt-3 text-[0.95rem] text-ink-soft">{compare.home.summary}</p>
              </div>
            </div>

            {/* Rows */}
            {compare.rows.map((r, i) => {
              const last = i === n - 1;
              return (
                <div
                  key={r.label}
                  role="row"
                  className={clsx(COLS, "group/row transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)]", inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}
                  style={{ transitionDelay: `${150 + i * 70}ms` }}
                >
                  {/* ATO answer, mirrored toward the spine */}
                  <div
                    role="cell"
                    className={clsx(
                      "flex items-center justify-end gap-3.5 border-t border-ink/[0.07] bg-cream px-9 py-5 text-right text-[1.02rem] leading-snug text-ink-soft transition-colors duration-300 group-hover/row:bg-sand-soft",
                      last && "rounded-bl-[1.75rem] pb-8",
                    )}
                  >
                    <span>{r.ato}</span>
                    <Mark tone="ato" />
                  </div>

                  {/* Spine label */}
                  <div role="rowheader" className="relative flex items-center justify-center px-3">
                    <span aria-hidden className={clsx("absolute left-1/2 w-px -translate-x-1/2 bg-white/25", last ? "top-0 h-1/2" : "inset-y-0")} />
                    <span className="relative inline-flex items-center gap-2 whitespace-nowrap rounded-pill bg-paper py-2 pl-2 pr-4 text-ink shadow-[0_8px_20px_-12px_rgba(0,0,0,0.6)] transition-[background-color,color] duration-300 group-hover/row:bg-mint">
                      <span className="grid size-7 place-items-center rounded-full bg-sand-soft text-green transition-colors duration-300 group-hover/row:bg-ink group-hover/row:text-mint">
                        <BrandIcon name={r.icon} className="size-3.5" />
                      </span>
                      <span className="font-serif text-[1.02rem]">{r.label}</span>
                    </span>
                  </div>

                  {/* Home-loan answer */}
                  <div
                    role="cell"
                    className={clsx(
                      "flex items-center gap-3.5 border-t border-ink/[0.07] bg-paper px-9 py-5 text-[1.02rem] font-medium leading-snug text-ink transition-colors duration-300 group-hover/row:bg-[#f4faf1]",
                      last && "rounded-br-[1.75rem] pb-8",
                    )}
                  >
                    <Mark tone={r.homeTone} />
                    <span className={clsx(r.homeTone === "risk" && "font-normal text-ink-soft")}>{r.home}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ---------- Phones / tablets: one cream card per row ---------- */}
          <ul className="flex flex-col gap-3 lg:hidden">
            {compare.rows.map((r, i) => (
              <li
                key={r.label}
                className={clsx("rounded-card bg-cream p-4 text-ink transition-[opacity,transform] duration-700 ease-[var(--ease-out-soft)] sm:p-5", inView ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0")}
                style={{ transitionDelay: `${80 + i * 60}ms` }}
              >
                <h3 className="flex items-center gap-2.5 font-serif text-[1.3rem] leading-snug">
                  <span className="grid size-8 place-items-center rounded-full bg-paper text-green">
                    <BrandIcon name={r.icon} className="size-4" />
                  </span>
                  {r.label}
                </h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="flex items-start gap-3 rounded-2xl bg-sand-soft p-3.5">
                    <Mark tone="ato" />
                    <div className="min-w-0">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-amber">ATO plan</p>
                      <p className="mt-0.5 text-[0.95rem] leading-snug text-ink-soft">{r.ato}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl bg-paper p-3.5 ring-1 ring-mint">
                    <Mark tone={r.homeTone} />
                    <div className="min-w-0">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-green">Home loan</p>
                      <p className={clsx("mt-0.5 text-[0.95rem] leading-snug", r.homeTone === "risk" ? "text-ink-soft" : "font-medium text-ink")}>{r.home}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Legend (plain text on the green, no card) */}
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.88rem] text-offwhite lg:justify-center">
            <span className="inline-flex items-center gap-2">
              <Mark tone="good" /> Works in your favour
            </span>
            <span className="inline-flex items-center gap-2">
              <Mark tone="neutral" /> Depends on your situation
            </span>
            <span className="inline-flex items-center gap-2">
              <Mark tone="risk" /> The trade-off to weigh up
            </span>
          </div>
        </div>

        {/* Honest note + CTA, on a cream card */}
        <div className="mt-12 grid gap-6 rounded-card bg-cream p-6 text-ink sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12 lg:p-10">
          <div className="flex gap-5">
            <span className="hidden size-12 shrink-0 place-items-center rounded-2xl bg-ink text-mint sm:grid">
              <BrandIcon name="help" className="size-5" />
            </span>
            <div>
              <h3 className="h-card">{compare.honest.title}</h3>
              <p className="mt-2 max-w-3xl leading-relaxed text-ink-soft">{compare.honest.body}</p>
            </div>
          </div>
          <QuizButton className="w-full sm:w-auto" />
        </div>
        <p className="mt-4 text-[0.8rem] text-sand/75">{compare.source}</p>
      </div>
    </section>
  );
}
