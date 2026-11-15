"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { steps } from "@/lib/content";
import { QuizButton } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/Reveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Four steps on a track. The track fills with scroll and each step "lights up" as it's reached.
 * Desktop: horizontal track. Phones: vertical track down the left.
 */
export function HowItWorks() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 1024px)", mobile: "(max-width: 1023.98px)", motion: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
          const items = gsap.utils.toArray<HTMLElement>(".s-item");
          if (!motion) {
            items.forEach((el) => el.classList.add("is-on"));
            gsap.set(".s-fill", { scaleX: 1, scaleY: 1 });
            return;
          }
          gsap.fromTo(
            ".s-fill",
            desktop ? { scaleX: 0, scaleY: 1 } : { scaleY: 0, scaleX: 1 },
            {
              ...(desktop ? { scaleX: 1 } : { scaleY: 1 }),
              ease: "none",
              scrollTrigger: { trigger: ".s-track", start: desktop ? "top 75%" : "top 65%", end: desktop ? "bottom 45%" : "bottom 55%", scrub: 0.6 },
            },
          );
          items.forEach((el, i) => {
            ScrollTrigger.create({
              trigger: desktop ? ".s-track" : el,
              start: desktop ? `top+=${i * 40} 72%` : "top 62%",
              onEnter: () => el.classList.add("is-on"),
              onLeaveBack: () => el.classList.remove("is-on"),
            });
          });
          gsap.from(items, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".s-track", start: "top 85%", once: true },
          });
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="how-title" className="bg-cream py-20 sm:py-28 lg:py-32 2xl:py-40">
      <div className="container-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SplitHeading id="how-title" className="h-section">
            {steps.title}
          </SplitHeading>
          <div className="hidden lg:block">
            <QuizButton />
          </div>
        </div>

        <ol className="s-track relative mt-14 grid gap-10 pl-14 lg:mt-20 lg:grid-cols-4 lg:gap-8 lg:pl-0 lg:pt-16 2xl:mt-24 2xl:gap-14">
          {/* Track */}
          <span aria-hidden className="absolute bottom-2 left-[1.4rem] top-2 w-[2px] rounded-pill bg-line lg:bottom-auto lg:left-0 lg:right-0 lg:top-[1.4rem] lg:h-[2px] lg:w-auto" />
          <span
            aria-hidden
            className="s-fill absolute bottom-2 left-[1.4rem] top-2 w-[2px] origin-top rounded-pill bg-green lg:bottom-auto lg:left-0 lg:right-0 lg:top-[1.4rem] lg:h-[2px] lg:w-auto lg:origin-left"
          />

          {steps.items.map((s, i) => (
            <li key={s.title} className="s-item group relative">
              <span
                aria-hidden
                className="absolute -left-14 top-0 grid size-[2.8rem] place-items-center rounded-full border-2 border-line bg-cream font-serif text-[1.25rem] text-ink-mute transition-[background-color,border-color,color,transform] duration-500 ease-[var(--ease-spring)] group-[.is-on]:scale-110 group-[.is-on]:border-green group-[.is-on]:bg-green group-[.is-on]:text-offwhite lg:-top-16 lg:left-0"
              >
                {i + 1}
              </span>
              <p className="sr-only">Step {i + 1}</p>
              <h3 className="h-card pt-2 transition-colors duration-500 lg:pt-4">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 lg:hidden">
          <QuizButton className="w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
