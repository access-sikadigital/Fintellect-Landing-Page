"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Fades and lifts its direct children into view as they enter the viewport.
 * Reduced motion: rendered static.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  stagger = 0.09,
  y = 32,
  start = "top 85%",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  stagger?: number;
  y?: number;
  start?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current!.children, {
          y,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger,
          scrollTrigger: { trigger: ref.current, start, once: true },
        });
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Section heading whose words rise out of a mask as it enters the viewport. */
export function SplitHeading({ children, className, id, as: Tag = "h2" }: { children: string; className?: string; id?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const words = ref.current!.querySelectorAll(".sw-in");
        gsap.from(words, {
          yPercent: 110,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.045,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref },
  );
  const words = children.split(" ");
  return (
    <Tag ref={ref} id={id} className={className} aria-label={children}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="-my-[0.12em] inline-block overflow-hidden py-[0.12em] align-top">
          <span className="sw-in inline-block">{w}</span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}
