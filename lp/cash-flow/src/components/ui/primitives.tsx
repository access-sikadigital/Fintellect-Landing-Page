"use client";

import Image from "next/image";
import clsx from "clsx";
import type { ReactNode } from "react";
import { useScrollToQuiz } from "@/components/providers/SmoothScroll";
import { cta } from "@/lib/content";

/** Primary call to action: scrolls to the quiz. Ink pill with a green arrow chip. */
export function QuizButton({ tone = "ink", className, children = cta }: { tone?: "ink" | "light"; className?: string; children?: ReactNode }) {
  const scrollToQuiz = useScrollToQuiz();
  return (
    <a
      href="#quiz"
      onClick={(e) => {
        e.preventDefault();
        scrollToQuiz();
      }}
      className={clsx(
        "group relative inline-flex min-h-14 max-w-full items-center justify-center gap-3 overflow-hidden rounded-pill py-2 pl-6 pr-2 text-center text-[1rem] font-semibold leading-tight transition-[background-color,box-shadow,transform] duration-300 active:scale-[0.98]",
        tone === "ink"
          ? "bg-ink text-offwhite shadow-[0_14px_30px_-16px_rgba(1,36,18,0.7)] hover:bg-green-600"
          : "bg-offwhite text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,0.6)] hover:bg-white",
        className,
      )}
    >
      {/* sheen sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/15 opacity-0 transition-[left,opacity] duration-700 ease-[var(--ease-out-soft)] group-hover:left-[120%] group-hover:opacity-100"
      />
      <span className="relative">{children}</span>
      <span
        className={clsx(
          "relative grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300",
          tone === "ink" ? "bg-green text-offwhite group-hover:bg-offwhite group-hover:text-ink" : "bg-ink text-offwhite group-hover:bg-green",
        )}
      >
        <ArrowIcon className="size-4 transition-transform duration-300 group-hover:-rotate-45" />
      </span>
    </a>
  );
}

/** Brand label: small caps line with the logomark's dot as a bullet. */
export function Eyebrow({ children, tone = "ink", className }: { children: ReactNode; tone?: "ink" | "light"; className?: string }) {
  return (
    <p className={clsx("eyebrow", tone === "ink" ? "text-ink-soft" : "text-offwhite/75", className)}>
      <span aria-hidden className={clsx("size-2 rounded-full", tone === "ink" ? "bg-green" : "bg-mint")} />
      {children}
    </p>
  );
}

/** Brand line icon from /public/brand/icons, recoloured with currentColor via CSS mask. */
export function BrandIcon({ name, className }: { name: string; className?: string }) {
  return <span aria-hidden className={clsx("icon-mask", className)} style={{ ["--icon" as string]: `url(/brand/icons/${name}.svg)` }} />;
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M3 8h10m0 0L8.5 3.5M13 8l-4.5 4.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path d="m5 10.5 3.2 3L15 6.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CrossIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden className={className}>
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

/** Official logomark + wordmark SVGs, unchanged (guidelines prohibit recolouring the logo). */
export function Logo({ tone = "light", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center gap-3", className)}>
      <Image src={`/brand/logo/logomark-${tone}.svg`} alt="" width={677} height={800} unoptimized priority className="h-8 w-auto sm:h-9" />
      <Image src={`/brand/logo/wordmark-${tone}.svg`} alt="Fintellect" width={800} height={50} unoptimized priority className="h-[0.7rem] w-auto sm:h-[0.8rem]" />
    </span>
  );
}

/** Brand graphic element: the house shape from the guidelines. */
export function HouseShape({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 125 130" className={className}>
      <path d="M125 62.4V124.8a5.2 5.2 0 0 1-5.2 5.2H5.2A5.2 5.2 0 0 1 0 124.8V62.4a5.2 5.2 0 0 1 1.7-3.8L58.9 1.4a5.2 5.2 0 0 1 7.2 0l57.2 57.2a5.2 5.2 0 0 1 1.7 3.8Z" fill="currentColor" />
    </svg>
  );
}
