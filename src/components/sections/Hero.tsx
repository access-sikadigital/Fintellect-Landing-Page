"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { hero } from "@/lib/content";
import { Quiz } from "@/components/quiz/Quiz";
import { BrandIcon, CheckIcon } from "@/components/ui/primitives";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

/**
 * Photo hero. A broker meeting with a model house on the desk ("your home could pay it
 * out") fills the background, graded into the
 * brand's dark green so the headline stays readable. Wide screens use three zones
 * (headline | the house | quiz) so the photo's subject is never hidden behind content,
 * with two glass "outcome" cards floating beside it.
 *
 * Motion: slow settle-in zoom on load, parallax drift on scroll, headline words rise
 * from a mask, hand-drawn underline, cards float in and gently bob.
 * Phones: the photo sits behind the headline and fades into ink before the quiz.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".h-words", { type: "words", mask: "words" });
        gsap.set(split.masks, { paddingBlock: "0.1em", marginBlock: "-0.1em", paddingInline: "0.05em", marginInline: "-0.05em" });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        // transform + opacity only: both run on the GPU compositor, so the intro stays at 60fps
        tl.fromTo(".h-photo", { scale: 1.16, opacity: 0.6 }, { scale: 1.04, opacity: 1, duration: 2.4, ease: "power3.out" }, 0)
          .from(".h-eyebrow", { y: 16, opacity: 0, duration: 0.9 }, 0.3)
          .from(split.words, { yPercent: 115, duration: 1.25, stagger: 0.055 }, 0.4)
          .fromTo(".h-scribble path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 1.1)
          .from(".h-sub", { y: 22, opacity: 0, duration: 1 }, 0.9)
          .from(".h-tick", { x: -14, opacity: 0, duration: 0.8, stagger: 0.08 }, 1.1)
          .from(".h-quiz", { y: 60, opacity: 0, duration: 1.4 }, 0.6)
          .from(".h-chip", { y: 34, opacity: 0, scale: 0.92, duration: 1.2, stagger: 0.18 }, 1.4)
          .from(".h-shape", { scale: 0, opacity: 0, duration: 1.4, stagger: 0.1, ease: "back.out(1.4)" }, 0.8);

        // Scroll: photo drifts slower than the page, copy fades, shapes and cards drift at their own speeds
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to(".h-photo-wrap", { yPercent: 14, ease: "none", scrollTrigger: st });
        gsap.to(".h-copy", { yPercent: -8, opacity: 0.35, ease: "none", scrollTrigger: st });
        gsap.to(".h-chip", { yPercent: (i) => (i ? -90 : -140), ease: "none", scrollTrigger: st });
        gsap.to(".h-shape", { yPercent: (i) => (i % 2 ? -70 : 50), rotate: (i) => (i % 2 ? 12 : -8), ease: "none", scrollTrigger: st });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      aria-labelledby="hero-title"
      className="on-dark grain grain-light relative overflow-hidden bg-ink pb-16 pt-24 text-offwhite sm:pb-24 sm:pt-28 xl:flex xl:min-h-[max(100svh,52rem)] xl:items-center xl:pb-24 xl:pt-28"
    >
      {/* ---------- Background photo ---------- */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[46rem] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_50%,transparent_96%)] sm:h-[52rem] xl:inset-y-0 xl:left-[6%] xl:h-auto xl:[mask-image:none]">
        <div className="h-photo-wrap absolute inset-0 will-change-transform">
          <div className="h-photo absolute inset-0 origin-[50%_35%] scale-[1.04] will-change-transform">
            <Image
              src="/images/hero-home-equity.webp"
              alt=""
              fill
              priority
              quality={90}
              sizes="100vw"
              className="object-cover object-[52%_55%] xl:object-[50%_60%]"
            />
          </div>
        </div>
        {/* The green brand grade is baked into the image file (no live blend layers, which are costly while it moves) */}
      </div>

      {/* Legibility layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* phones / tablets: dark wash that fades to solid ink before the quiz */}
        <div className="absolute inset-x-0 top-0 h-[46rem] bg-[linear-gradient(to_bottom,rgba(1,36,18,0.6)_0%,rgba(1,36,18,0.72)_35%,rgba(1,36,18,0.9)_62%,#012412_92%)] sm:h-[52rem] xl:hidden" />
        {/* wide screens: dark behind the headline, open over the owner, deeper again behind the quiz */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,#012412_0%,rgba(1,36,18,0.94)_22%,rgba(1,36,18,0.72)_38%,rgba(1,36,18,0.12)_52%,rgba(1,36,18,0.1)_60%,rgba(1,36,18,0.55)_74%,rgba(1,36,18,0.8)_100%)] xl:block" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_bottom,rgba(1,36,18,0.75)_0%,transparent_22%,transparent_68%,#012412_100%)] xl:block" />
        {/* soft green light behind the quiz */}
        <div className="absolute -right-24 top-1/3 size-[34rem] glow [--glow:rgba(32,105,67,0.6)]" />
      </div>

      {/* Brand graphic elements */}
      <span aria-hidden className="h-shape pointer-events-none absolute right-[-4rem] top-24 hidden size-56 rounded-full border-[1.5px] border-sage/35 xl:block" />
      <span aria-hidden className="h-shape pointer-events-none absolute -left-14 top-[30rem] size-28 rounded-full bg-sage/20 sm:size-40 xl:hidden" />

      {/* Floating outcome cards beside the house (wide screens) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
        <div className="h-chip absolute left-[43%] top-[36%]">
          <div className="flex items-center gap-3 rounded-2xl bg-offwhite py-3 pl-3 pr-5 text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] motion-safe:animate-[bob_6s_ease-in-out_infinite]">
            <span className="grid size-10 place-items-center rounded-xl bg-green text-offwhite">
              <CheckIcon className="size-5" />
            </span>
            <span>
              <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">ATO balance</span>
              <span className="block font-serif text-[1.15rem] leading-tight text-ink">Paid out in full</span>
            </span>
          </div>
        </div>
        <div className="h-chip absolute bottom-[11%] left-[37%]">
          <div className="flex items-center gap-3 rounded-2xl bg-offwhite py-3 pl-3 pr-5 text-ink shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] motion-safe:animate-[bob_7s_ease-in-out_-2.5s_infinite]">
            <span className="grid size-10 place-items-center rounded-xl bg-green text-offwhite">
              <BrandIcon name="home-1" className="size-5" />
            </span>
            <span>
              <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">One loan</span>
              <span className="block font-serif text-[1.15rem] leading-tight text-ink">One repayment</span>
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Content ---------- */}
      <div className="container-x relative grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-12 xl:grid-cols-[minmax(0,31rem)_1fr_minmax(0,27rem)] xl:items-center xl:gap-10 2xl:grid-cols-[minmax(0,38rem)_1fr_minmax(0,29rem)] 2xl:gap-14">
        <div className="h-copy lg:col-span-6 lg:pt-6 xl:col-span-1 xl:pt-0">
          <p className="h-eyebrow inline-flex items-center gap-2 rounded-pill bg-sand px-3.5 py-1.5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-green" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="h-hero mt-6 max-w-[15ch] [text-shadow:0_2px_30px_rgba(1,36,18,0.5)] xl:text-[clamp(3.3rem,1rem+2.9vw,4.4rem)] 2xl:text-[4.6rem]">
            <span className="h-words">{hero.titleLead} </span>
            <span className="relative inline-block whitespace-nowrap text-mint">
              <span className="h-words">{hero.titleAccent}</span>
              <svg aria-hidden viewBox="0 0 320 24" preserveAspectRatio="none" className="h-scribble absolute -bottom-[0.14em] left-0 h-[0.16em] w-full text-mint/70">
                <path d="M4 16C64 7 170 3 316 10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" pathLength={1} strokeDasharray="1" />
              </svg>
            </span>
          </h1>
          {/* Tablet+: intro under the headline. Phones get it below the quiz, so the form comes first. */}
          <p className="h-sub lead mt-6 hidden max-w-[38rem] text-sand/90 lg:block 2xl:mt-8">{hero.sub}</p>

          <ul className="mt-8 hidden flex-col gap-3 lg:flex">
            {hero.ticks.map((t) => (
              <li key={t} className="h-tick flex items-center gap-3 text-[1rem] text-offwhite">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-mint/15 text-mint ring-1 ring-mint/30">
                  <CheckIcon className="size-3.5" />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="h-quiz lg:col-span-6 xl:col-span-1 xl:col-start-3">
          <Quiz />
        </div>

        {/* Phones/tablets: the "why" sits below the quiz, then the ticks */}
        <div className="flex gap-4 rounded-card bg-cream p-5 text-ink lg:hidden">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-mint">
            <BrandIcon name="percent" className="size-5" />
          </span>
          <p className="text-[0.98rem] leading-relaxed text-ink-soft">{hero.sub}</p>
        </div>
        <ul className="-mt-2 flex flex-col gap-3 lg:hidden">
          {hero.ticks.map((t) => (
            <li key={t} className="flex items-center gap-3 text-[0.98rem] text-offwhite">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-mint/15 text-mint ring-1 ring-mint/30">
                <CheckIcon className="size-3.5" />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
