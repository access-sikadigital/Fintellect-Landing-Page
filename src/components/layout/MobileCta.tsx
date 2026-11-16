"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { cta, site } from "@/lib/content";
import { useScrollToQuiz } from "@/components/providers/SmoothScroll";
import { ArrowIcon } from "@/components/ui/primitives";

/**
 * Phones only: a floating glass dock pinned to the bottom of the screen.
 * A status line (live dot, time, licence) sits above a bright call-to-action button
 * whose sheen sweeps every few seconds. It slides up once the visitor has scrolled past
 * the quiz, and tucks away whenever the quiz or the final call to action is on screen.
 * Tapping it glides the page back up to the quiz.
 */
export function MobileCta({ label = cta, status = "About a minute" }: { label?: string; status?: string } = {}) {
  const [show, setShow] = useState(false);
  const scrollToQuiz = useScrollToQuiz();

  useEffect(() => {
    const quiz = document.getElementById("quiz");
    const final = document.getElementById("final-cta");
    if (!quiz) return;
    const state = { quizVisible: true, pastQuiz: false, finalVisible: false };
    const update = () => setShow(state.pastQuiz && !state.quizVisible && !state.finalVisible);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === quiz) {
          state.quizVisible = e.isIntersecting;
          state.pastQuiz = e.boundingClientRect.top < 0;
        } else {
          state.finalVisible = e.isIntersecting;
        }
      }
      update();
    });
    io.observe(quiz);
    if (final) io.observe(final);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={clsx(
        "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 transition-[transform,opacity] duration-700 ease-[var(--ease-spring)] sm:hidden",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0",
      )}
      inert={!show}
    >
      <div className="on-dark rounded-[1.6rem] bg-ink p-1.5 shadow-[0_24px_50px_-12px_rgba(1,36,18,0.65),0_0_0_1px_rgba(251,254,238,0.08)]">
        <div className="flex items-center justify-between px-3 pb-1.5 pt-1 text-[0.72rem] font-medium text-offwhite">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint/70" />
              <span className="relative inline-flex size-2 rounded-full bg-mint" />
            </span>
            {status}
          </span>
          <span>Australian Credit Licence {site.acl}</span>
        </div>

        <a
          href="#quiz"
          onClick={(e) => {
            e.preventDefault();
            scrollToQuiz();
          }}
          className="group relative flex min-h-[3.5rem] items-center justify-between gap-3 overflow-hidden rounded-[1.25rem] bg-offwhite py-2 pl-5 pr-2 text-ink transition-transform duration-200 active:scale-[0.98]"
        >
          {/* periodic sheen */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 motion-safe:animate-[sheen_4.5s_ease-in-out_1.2s_infinite]"
          />
          <span className="relative text-[1.02rem] font-semibold tracking-[-0.01em]">{label}</span>
          <span className="relative grid size-11 shrink-0 place-items-center rounded-[0.95rem] bg-ink text-offwhite">
            <ArrowIcon className="size-4 -rotate-90 transition-transform duration-300 group-active:-translate-y-0.5" />
          </span>
        </a>
      </div>
    </div>
  );
}
