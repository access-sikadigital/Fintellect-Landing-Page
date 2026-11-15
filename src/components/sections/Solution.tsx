"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { solution } from "@/lib/content";
import { BrandIcon, CheckIcon } from "@/components/ui/primitives";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";

const debts = [
  { icon: "calendar", label: "ATO payment plan", note: "Short term, on top of everything else" },
  { icon: "percent", label: "ATO interest charge", note: "Compounding daily, no longer deductible" },
];

/** "Clear the ATO through your home loan", with a Now / After restructure illustration. */
export function Solution() {
  const [after, setAfter] = useState(false);
  const touched = useRef(false);
  const visual = useRef<HTMLDivElement>(null);

  // Play the merge once, the first time the illustration is properly in view
  useEffect(() => {
    const el = visual.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !touched.current) {
          t = setTimeout(() => !touched.current && setAfter(true), 900);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, []);

  const pick = (v: boolean) => {
    touched.current = true;
    setAfter(v);
  };

  return (
    <section aria-labelledby="solution-title" className="relative overflow-hidden bg-paper py-20 sm:py-28 lg:py-32 2xl:py-40">
      <div aria-hidden className="pointer-events-none absolute -right-24 top-16 size-72 rounded-full border-[1.5px] border-sage/50" />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16 2xl:gap-28">
        <div className="lg:col-span-6">
          <p className="eyebrow text-ink-soft">
            <span aria-hidden className="size-2 rounded-full bg-green" />
            The option
          </p>
          <SplitHeading id="solution-title" className="h-section mt-5">
            {solution.title}
          </SplitHeading>
          <Reveal>
            <p className="lead mt-6 text-ink/85">{solution.body}</p>
          </Reveal>
          <Reveal as="ul" className="mt-8 flex flex-col gap-4" stagger={0.1}>
            {solution.points.map((p) => (
              <li key={p} className="flex items-start gap-4 text-[1.05rem] leading-relaxed">
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-green text-offwhite">
                  <CheckIcon className="size-4" />
                </span>
                {p}
              </li>
            ))}
          </Reveal>
        </div>

        <Reveal className="flex flex-col gap-5 lg:col-span-6" stagger={0.12}>
          {/* Illustration */}
          <div ref={visual} className="rounded-card bg-canvas p-5 shadow-[0_30px_60px_-35px_rgba(1,36,18,0.35)] ring-1 ring-line sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">Your repayments</p>
              <div role="group" aria-label="Compare now and after" className="relative grid grid-cols-2 rounded-pill bg-sand-soft p-1">
                <span
                  aria-hidden
                  className={clsx("absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-pill bg-ink transition-transform duration-500 ease-[var(--ease-out-soft)]", after && "translate-x-full")}
                />
                {["Now", "After"].map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={after === (i === 1)}
                    onClick={() => pick(i === 1)}
                    className={clsx("relative z-10 rounded-pill px-4 py-1.5 text-[0.85rem] font-semibold transition-colors duration-300", after === (i === 1) ? "text-offwhite" : "text-ink-soft hover:text-ink")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col" aria-live="polite">
              {/*
                Home loan row (always there; becomes the single repayment).
                The "ATO paid in full" badge sits under the text rather than beside it,
                so on phones the title and note keep the full width instead of squeezing.
              */}
              <div
                className={clsx(
                  "relative overflow-hidden rounded-2xl p-4 transition-[background-color,box-shadow] duration-700 ease-[var(--ease-out-soft)] sm:p-5",
                  after ? "bg-ink text-offwhite shadow-[0_20px_40px_-20px_rgba(1,36,18,0.7)]" : "bg-sand-soft text-ink",
                )}
              >
                {/* soft green glow once it becomes the single repayment */}
                <span aria-hidden className={clsx("pointer-events-none absolute -right-12 -top-12 size-36 glow [--glow:rgba(32,105,67,0.75)] transition-opacity duration-700", after ? "opacity-100" : "opacity-0")} />

                <div className="relative flex items-start gap-4">
                  <span className={clsx("grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-700", after ? "bg-green text-offwhite" : "bg-paper text-green")}>
                    <BrandIcon name="home-1" className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[1.02rem] font-semibold leading-snug">{after ? "One home loan repayment" : "Home loan repayment"}</p>
                    <p className={clsx("mt-0.5 text-[0.88rem] leading-snug transition-colors duration-700", after ? "text-offwhite/90" : "text-ink-mute")}>
                      {after ? "Longer term, at a home loan interest rate" : "Your current loan"}
                    </p>
                    <div className={clsx("grid transition-[grid-template-rows,opacity,margin] duration-500 ease-[var(--ease-out-soft)]", after ? "mt-3 grid-rows-[1fr] opacity-100 delay-300" : "mt-0 grid-rows-[0fr] opacity-0")}>
                      <div className="overflow-hidden">
                        <span className="inline-flex items-center gap-1.5 rounded-pill bg-mint px-3 py-1 text-[0.8rem] font-semibold text-ink">
                          <CheckIcon className="size-3.5" />
                          ATO paid in full
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {debts.map((d, i) => (
                <div
                  key={d.label}
                  className={clsx(
                    "grid transition-[grid-template-rows,opacity,transform,margin] duration-700 ease-[var(--ease-out-soft)]",
                    after ? "mt-0 -translate-y-6 scale-95 grid-rows-[0fr] opacity-0" : "mt-3 grid-rows-[1fr] opacity-100",
                  )}
                  style={{ transitionDelay: after ? `${i * 90}ms` : `${(1 - i) * 90}ms` }}
                  aria-hidden={after}
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-4 rounded-2xl border-[1.5px] border-dashed border-[#d9b98a] bg-[#fdf6ea] p-4">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-paper text-amber">
                        <BrandIcon name={d.icon} className="size-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{d.label}</p>
                        <p className="text-[0.88rem] text-ink-mute">{d.note}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[0.78rem] text-ink-mute">Illustration only. Whether it works depends on your equity, income and lender criteria.</p>
          </div>

          {/* The honest part */}
          <div className="relative overflow-hidden rounded-card bg-cream p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-full bg-ink text-offwhite">
                <BrandIcon name="help" className="size-5" />
              </span>
              <h3 className="h-card">{solution.honest.title}</h3>
            </div>
            <p className="mt-4 leading-relaxed text-ink-soft">{solution.honest.body}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
