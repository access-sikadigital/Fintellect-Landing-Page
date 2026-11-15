"use client";

import { useState } from "react";
import clsx from "clsx";
import { faq } from "@/lib/content";
import { ArrowIcon, PlusIcon, QuizButton } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/Reveal";

const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * FAQ on the green band, as a question index + reading panel.
 * Desktop: numbered questions as a clean index on the green (white text, hairline dividers);
 * the selected one gets a mint marker. A sticky cream panel on the right shows the answer large
 * (section uses overflow-clip, not overflow-hidden, so the sticky panel keeps working),
 * sliding in on change. Phones: a light accordion whose answers open in cream cards.
 */
export function Faq() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const item = faq.items[active];

  return (
    <section aria-labelledby="faq-title" className="on-dark grain grain-light relative overflow-clip bg-ink py-20 text-offwhite sm:py-28 lg:py-32 2xl:py-40">
      <div aria-hidden className="glow absolute -left-40 -top-20 size-[44rem] [--glow:rgba(32,105,67,0.55)]" />

      <div className="container-x relative">
        {/* Heading row */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-sand/75">
              <span aria-hidden className="size-2 rounded-full bg-mint" />
              Straight answers
            </p>
            <SplitHeading id="faq-title" className="h-section mt-5">
              {faq.title}
            </SplitHeading>
          </div>
          <p className="max-w-sm text-[1rem] leading-relaxed text-offwhite/85 lg:pb-3 lg:text-right">
            {faq.items.length} questions business owners ask before they talk to Robert.
          </p>
        </div>

        {/* ---------- Desktop: index + reading panel ---------- */}
        <div className="mt-14 hidden gap-12 lg:grid lg:grid-cols-12 2xl:mt-20 2xl:gap-20">
          <div role="tablist" aria-orientation="vertical" aria-label="Questions" className="lg:col-span-5">
            {faq.items.map((q, i) => {
              const isActive = active === i;
              return (
                <button
                  key={q.q}
                  role="tab"
                  type="button"
                  id={`faq-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls="faq-panel"
                  onClick={() => setActive(i)}
                  className={clsx(
                    "group relative flex w-full items-center gap-5 border-b border-white/12 py-5 pl-5 text-left transition-colors duration-300 first:border-t",
                    isActive ? "text-offwhite" : "text-offwhite/70 hover:text-offwhite",
                  )}
                >
                  {/* active marker */}
                  <span aria-hidden className={clsx("absolute inset-y-3 left-0 w-[3px] origin-center rounded-pill bg-mint transition-transform duration-500 ease-[var(--ease-out-soft)]", isActive ? "scale-y-100" : "scale-y-0")} />
                  <span className={clsx("w-7 shrink-0 font-serif text-[0.95rem] tabular-nums transition-colors duration-300", isActive ? "text-mint" : "text-offwhite/45")}>{num(i)}</span>
                  <span className="flex-1 font-serif text-[1.18rem] leading-snug 2xl:text-[1.3rem]">{q.q}</span>
                  <ArrowIcon
                    className={clsx(
                      "size-4 shrink-0 transition-[opacity,transform] duration-300",
                      isActive ? "translate-x-0 text-mint opacity-100" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60",
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            <div
              id="faq-panel"
              role="tabpanel"
              aria-labelledby={`faq-tab-${active}`}
              className="relative overflow-hidden rounded-card bg-cream p-10 text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,0.7)] lg:sticky lg:top-28 2xl:p-14"
            >
              <span aria-hidden className="glow absolute -right-24 -top-24 size-80 [--glow:rgba(159,211,176,0.55)]" />
              <div key={active} className="relative motion-safe:animate-[step-in-next_0.55s_var(--ease-out-soft)]">
                <p className="font-serif text-[4.5rem] leading-none text-green/25">{num(active)}</p>
                <h3 className="mt-4 font-serif text-[clamp(1.8rem,1.3rem+1.4vw,2.6rem)] leading-[1.12] text-ink">{item.q}</h3>
                <p className="mt-6 max-w-2xl text-[1.15rem] leading-relaxed text-ink-soft 2xl:text-[1.25rem]">{item.a}</p>
              </div>
              <div className="relative mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-ink/10 pt-7">
                <p className="text-[0.98rem] text-ink-soft">
                  Still unsure? <span className="font-semibold text-ink">Ask Robert on the 15-minute call.</span>
                </p>
                <QuizButton />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Phones / tablets: accordion ---------- */}
        <ul className="mt-10 lg:hidden">
          {faq.items.map((q, i) => {
            const isOpen = open === i;
            return (
              <li key={q.q} className="border-b border-white/12 first:border-t">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-m-${i}`}
                    id={`faq-mq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 py-5 text-left"
                  >
                    <span className={clsx("w-7 shrink-0 font-serif text-[0.95rem] tabular-nums", isOpen ? "text-mint" : "text-offwhite/45")}>{num(i)}</span>
                    <span className="flex-1 font-serif text-[1.2rem] leading-snug text-offwhite">{q.q}</span>
                    <span
                      className={clsx(
                        "grid size-9 shrink-0 place-items-center rounded-full transition-[transform,background-color,color] duration-500 ease-[var(--ease-out-soft)]",
                        isOpen ? "rotate-45 bg-mint text-ink" : "bg-offwhite text-ink",
                      )}
                    >
                      <PlusIcon className="size-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-m-${i}`}
                  role="region"
                  aria-labelledby={`faq-mq-${i}`}
                  className={clsx("grid transition-[grid-template-rows] duration-500 ease-[var(--ease-out-soft)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
                >
                  <div className="overflow-hidden">
                    <p className="mb-5 rounded-2xl bg-cream p-5 leading-relaxed text-ink-soft">{q.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-8 lg:hidden">
          <QuizButton tone="light" className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
