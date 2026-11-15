"use client";

import clsx from "clsx";
import { structure } from "@/lib/content";
import { BrandIcon, CheckIcon, QuizButton } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/Reveal";
import { useInView } from "@/components/ui/useInView";

/**
 * "Whose debt is it?" on the cream band. One debt, two paths: a dark node at the top branches
 * (drawn on scroll) into a sole-trader card and a company-director card. DPN points get a caution mark.
 */
export function Structure() {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);

  return (
    <section aria-labelledby="structure-title" className="grain relative overflow-hidden bg-cream py-20 sm:py-28 lg:py-32 2xl:py-40">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 size-[40rem] -translate-x-1/2 -translate-y-1/2 glow [--glow:rgba(134,174,140,0.45)]" />
      <div aria-hidden className="pointer-events-none absolute -left-24 bottom-24 size-72 rounded-full border-[1.5px] border-sage/40" />

      <div className="container-x relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="eyebrow justify-center text-ink-soft">
            <span aria-hidden className="size-2 rounded-full bg-green" />
            {structure.eyebrow}
          </p>
          <SplitHeading id="structure-title" className="h-section mt-5">
            {structure.title}
          </SplitHeading>
        </div>

        <div ref={ref} className="mx-auto mt-12 max-w-6xl sm:mt-16">
          {/* Root node + branch */}
          <div className="flex flex-col items-center">
            <span
              className={clsx(
                "inline-flex items-center gap-2 rounded-pill bg-ink px-4 py-2 text-[0.9rem] font-semibold text-offwhite shadow-[0_14px_30px_-14px_rgba(1,36,18,0.6)] transition-[opacity,transform] duration-700",
                inView ? "scale-100 opacity-100" : "scale-90 opacity-0",
              )}
            >
              <BrandIcon name="receipt" className="size-4 text-mint" />
              Your ATO debt
            </span>
            <svg
              viewBox="0 0 1000 110"
              preserveAspectRatio="none"
              aria-hidden
              className="hidden h-24 w-full transition-[clip-path] duration-[1100ms] ease-[var(--ease-out-soft)] md:block"
              style={{ clipPath: inView ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", transitionDelay: inView ? "300ms" : "0ms" }}
            >
              <path d="M500 0 V40 Q500 55 485 55 H265 Q250 55 250 70 V110" fill="none" stroke="rgba(32,105,67,0.5)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="6 6" />
              <path d="M500 0 V40 Q500 55 515 55 H735 Q750 55 750 70 V110" fill="none" stroke="rgba(32,105,67,0.5)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="6 6" />
            </svg>
            <span aria-hidden className="h-8 w-px bg-green/40 md:hidden" />
          </div>

          {/* Two paths */}
          <div className="grid gap-4 md:grid-cols-2 md:gap-6">
            {structure.cards.map((c, ci) => (
              <article
                key={c.tag}
                className={clsx(
                  "group relative overflow-hidden rounded-card bg-paper p-6 shadow-[0_30px_60px_-40px_rgba(1,36,18,0.45)] ring-1 ring-line transition-[opacity,transform,box-shadow] duration-700 ease-[var(--ease-out-soft)] hover:shadow-[0_36px_70px_-36px_rgba(1,36,18,0.55)] sm:p-8",
                  inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                )}
                style={{ transitionDelay: `${700 + ci * 150}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 rounded-pill bg-green px-3 py-1 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-offwhite">{c.tag}</span>
                  <span className="grid size-11 place-items-center rounded-2xl bg-sand-soft text-green transition-colors duration-500 group-hover:bg-ink group-hover:text-mint">
                    <BrandIcon name={c.icon} className="size-5" />
                  </span>
                </div>
                <h3 className="mt-6 font-serif text-[clamp(1.6rem,1.3rem+1vw,2.2rem)] leading-tight text-ink">{c.title}</h3>
                <ul className="mt-6 flex flex-col gap-3.5 border-t border-line pt-6">
                  {c.points.map((p) => {
                    const caution = /director penalty notice/i.test(p);
                    return (
                      <li key={p} className="flex items-start gap-3 text-[1rem] leading-snug">
                        <span
                          aria-hidden
                          className={clsx(
                            "mt-px grid size-6 shrink-0 place-items-center rounded-full font-serif text-[0.8rem] font-semibold",
                            caution ? "bg-[#f6e3bf] text-amber" : "bg-sage-soft text-green",
                          )}
                        >
                          {caution ? "!" : <CheckIcon className="size-3.5" />}
                        </span>
                        <span className={clsx(caution ? "font-medium text-ink" : "text-ink-soft")}>{p}</span>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>

          {/* Trust / partnership */}
          <div className="mt-6 flex flex-col items-start gap-5 rounded-card bg-paper/70 p-5 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="flex items-center gap-3 text-[1rem] text-ink-soft">
              <BrandIcon name="user-group" className="size-5 shrink-0 text-green" />
              {structure.more}
            </p>
            <QuizButton className="w-full shrink-0 sm:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
