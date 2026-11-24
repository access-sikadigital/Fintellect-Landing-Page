"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Ctx = { scrollToQuiz: (offset?: number) => void };
const SmoothCtx = createContext<Ctx>({ scrollToQuiz: () => {} });

/** Scrolls to the quiz and moves keyboard focus into it. */
export const useScrollToQuiz = () => useContext(SmoothCtx).scrollToQuiz;

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so Lenis and every
 * ScrollTrigger share one animation frame. Skipped for prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  // Keep ScrollTrigger positions in sync when the page height changes (fonts, images, accordions, quiz steps).
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastHeight = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const h = document.documentElement.scrollHeight;
        if (Math.abs(h - lastHeight) < 2) return;
        lastHeight = h;
        lenisRef.current?.resize();
        ScrollTrigger.refresh();
      }, 150);
    });
    ro.observe(document.querySelector("main") ?? document.body);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      clearTimeout(timer);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      prevent: (node: HTMLElement) => node.hasAttribute?.("data-lenis-prevent"),
    });
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current = lenis;

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToQuiz = useCallback((customOffset?: number) => {
    const target = document.getElementById("quiz");
    if (!target) return;
    const focus = () => target.querySelector<HTMLElement>("[data-quiz-focus]")?.focus({ preventScroll: true });
    // Phones have no fixed header, so the quiz can sit near the top edge
    const w = window.innerWidth;
    const offset = customOffset ?? (w < 640 ? -16 : w < 1024 ? -84 : -110);
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    const distance = Math.abs(top - window.scrollY);
    if (lenisRef.current) {
      // Smooth glide; longer trips take a little longer, eased out so it lands softly
      lenisRef.current.scrollTo(top, {
        duration: Math.min(1.8, 0.9 + distance / 4000),
        easing: (t) => 1 - Math.pow(1 - t, 4),
        onComplete: focus,
      });
    } else {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
      setTimeout(focus, reduced ? 0 : 700);
    }
  }, []);

  return <SmoothCtx.Provider value={{ scrollToQuiz }}>{children}</SmoothCtx.Provider>;
}
