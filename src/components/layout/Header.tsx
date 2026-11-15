"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { site } from "@/lib/content";
import { ArrowIcon, Logo } from "@/components/ui/primitives";
import { useScrollToQuiz } from "@/components/providers/SmoothScroll";

/**
 * Landing-page header: logo, licence and one action. No navigation, so nothing leaks traffic away.
 * Transparent over the hero, then a frosted ink bar once scrolled.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const scrollToQuiz = useScrollToQuiz();

  useEffect(() => {
    // Phones: header isn't fixed, so it never needs the scrolled (frosted) state
    const onScroll = () => setScrolled(window.scrollY > 24 && window.innerWidth >= 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={clsx(
        // Phones: scrolls away with the page (the sticky bottom button carries the action). Tablet+: fixed.
        "on-dark absolute inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 sm:fixed",
        scrolled ? "bg-ink/95 shadow-[0_1px_0_rgba(251,254,238,0.08)]" : "bg-transparent",
      )}
    >
      <div className={clsx("container-x flex items-center justify-between gap-4 transition-[height] duration-500", scrolled ? "h-16" : "h-[4.5rem] lg:h-20")}>
        <a href="#top" aria-label="Fintellect, back to top" className="shrink-0">
          <Logo tone="light" />
        </a>
        <div className="flex items-center gap-5">
          <p className="hidden items-center gap-2 text-[0.86rem] text-sand/85 lg:flex">
            <span aria-hidden className="size-1.5 rounded-full bg-mint" />
            Licensed broker · Australian Credit Licence {site.acl}
          </p>
          <a
            href="#quiz"
            onClick={(e) => {
              e.preventDefault();
              scrollToQuiz();
            }}
            // Always visible from tablet up (client request). Phones use the sticky bottom bar instead.
            className="group hidden items-center gap-2 whitespace-nowrap rounded-pill bg-offwhite py-2 pl-4 pr-2 text-[0.88rem] font-semibold text-ink shadow-[0_10px_24px_-14px_rgba(0,0,0,0.6)] transition-[background-color,transform] duration-300 hover:bg-white active:scale-[0.98] sm:inline-flex"
          >
            Check if this works
            <span className="grid size-7 place-items-center rounded-full bg-green text-offwhite transition-colors duration-300 group-hover:bg-ink">
              <ArrowIcon className="size-3.5 transition-transform duration-300 group-hover:-rotate-45" />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
