"use client";

import type { CSSProperties, ReactNode } from "react";
import { useScrollToQuiz } from "@/components/providers/SmoothScroll";

/** "Check if this works for me": glides up to the quiz with Lenis and focuses the current question. */
export function QuizLink({ className, style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const scrollToQuiz = useScrollToQuiz();
  return (
    <a
      href="#quiz"
      className={className}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        scrollToQuiz(-24);
      }}
    >
      {children}
    </a>
  );
}
