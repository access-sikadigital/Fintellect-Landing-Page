"use client";

import clsx from "clsx";
import { callPrep } from "@/lib/content";
import { BrandIcon, CheckIcon, QuizButton } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/Reveal";
import { useInView } from "@/components/ui/useInView";

/**
 * "Five things to have handy for your 15-minute call."
 * Left: a checklist whose boxes tick one by one as it scrolls in.
 * Right: a sticky ink card with a 15-minute ring that fills, and the four things the call covers.
 */
export function CallPrep() {
  const [listRef, listIn] = useInView<HTMLOListElement>(0.2);
  const [cardRef, cardIn] = useInView<HTMLDivElement>(0.3);

  return (
    <section aria-labelledby="prep-title" className="bg-paper py-20 sm:py-28 lg:py-32 2xl:py-40">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16 2xl:gap-24">
        {/* Checklist */}
        <div className="lg:col-span-7">
          <p className="eyebrow text-ink-soft">
            <span aria-hidden className="size-2 rounded-full bg-green" />
            {callPrep.eyebrow}
          </p>
          <SplitHeading id="prep-title" className="h-section mt-5">
            {callPrep.title}
          </SplitHeading>

          <ol ref={listRef} className="mt-10 flex flex-col gap-3 sm:mt-12">
            {callPrep.items.map((it, i) => (
              <li
                key={it.title}
                className={clsx(
                  "group flex items-center gap-4 rounded-card bg-canvas p-4 ring-1 ring-line transition-[opacity,transform,box-shadow] duration-700 ease-[var(--ease-out-soft)] hover:shadow-[0_18px_40px_-28px_rgba(1,36,18,0.5)] sm:gap-5 sm:p-5",
                  listIn ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0",
                )}
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sand-soft text-green transition-colors duration-500 group-hover:bg-green group-hover:text-offwhite sm:size-14">
                  <BrandIcon name={it.icon} className="size-5 sm:size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-[1.2rem] leading-snug text-ink sm:text-[1.4rem]">{it.title}</h3>
                  <p className="mt-0.5 text-[0.95rem] leading-snug text-ink-soft">{it.body}</p>
                </div>
                {/* tick box */}
                <span
                  aria-hidden
                  className={clsx(
                    "grid size-8 shrink-0 place-items-center rounded-xl border-2 transition-[background-color,border-color] duration-500",
                    listIn ? "border-green bg-green text-offwhite" : "border-line bg-paper text-transparent",
                  )}
                  style={{ transitionDelay: `${600 + i * 260}ms` }}
                >
                  <CheckIcon className={clsx("size-4 transition-transform duration-500 ease-[var(--ease-spring)]", listIn ? "scale-100" : "scale-0")} />
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* What the call covers */}
        <div className="lg:col-span-5">
          <div ref={cardRef} className="on-dark grain grain-light relative overflow-hidden rounded-card bg-ink p-7 text-offwhite sm:p-9 lg:sticky lg:top-28">
            <span aria-hidden className="absolute -right-20 -top-20 size-64 glow [--glow:rgba(32,105,67,0.7)]" />
            <div className="relative flex items-center gap-5">
              {/* 15-minute ring */}
              <span className="relative grid size-24 shrink-0 place-items-center">
                <svg viewBox="0 0 100 100" aria-hidden className="absolute inset-0 -rotate-90">
                  <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(251,254,238,0.12)" strokeWidth="6" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    fill="none"
                    stroke="var(--color-mint)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    pathLength={1}
                    strokeDasharray="1"
                    className="transition-[stroke-dashoffset] duration-[1600ms] ease-[var(--ease-out-soft)]"
                    style={{ strokeDashoffset: cardIn ? 0 : 1 }}
                  />
                </svg>
                <span className="text-center leading-none">
                  <span className="block font-serif text-[1.9rem]">15</span>
                  <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-offwhite">min</span>
                </span>
              </span>
              <h3 className="font-serif text-[clamp(1.5rem,1.2rem+1vw,2rem)] leading-tight">{callPrep.agenda.title}</h3>
            </div>

            <ol className="relative mt-8 flex flex-col">
              {callPrep.agenda.points.map((p, i) => (
                <li
                  key={p}
                  className={clsx(
                    "relative flex gap-4 pb-6 transition-[opacity,transform] duration-700 last:pb-0",
                    cardIn ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                  )}
                  style={{ transitionDelay: `${400 + i * 150}ms` }}
                >
                  {/* connector */}
                  {i < callPrep.agenda.points.length - 1 && <span aria-hidden className="absolute bottom-0 left-[0.9rem] top-9 w-px bg-white/15" />}
                  <span className="grid size-[1.8rem] shrink-0 place-items-center rounded-full bg-white/10 font-serif text-[0.95rem] text-mint ring-1 ring-white/15">{i + 1}</span>
                  <span className="pt-0.5 text-[1.05rem] leading-snug text-offwhite">{p}</span>
                </li>
              ))}
            </ol>

            <p className="relative mt-8 border-t border-white/10 pt-5 text-[0.92rem] text-offwhite">{callPrep.agenda.footnote}</p>
            <div className="relative mt-6">
              <QuizButton tone="light" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
