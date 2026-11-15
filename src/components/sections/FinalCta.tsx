"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { finalCta, site } from "@/lib/content";
import { ArrowIcon, BrandIcon, CheckIcon, QuizButton } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/Reveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Closing call to action. An aerial photo of suburban homes ("your property") fills the section;
 * a soft cream glow in the centre holds the centred copy, so the photo shows all around the edges.
 * A floating card on the photo ties it to the offer. Slow zoom as it scrolls through.
 */
export function FinalCta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".fc-photo img", { scale: 1.15 }, { scale: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(".fc-rise", { y: 30, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
        gsap.from(".fc-card", { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", delay: 0.5, scrollTrigger: { trigger: root.current, start: "top 60%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="final-cta" aria-labelledby="final-title" className="relative overflow-hidden bg-cream">
      {/* Full-bleed photo */}
      <div aria-hidden className="fc-photo absolute inset-0">
        <Image src="/images/final-suburbs.webp" alt="" fill quality={90} sizes="100vw" className="object-cover object-[50%_60%]" />
        <div className="absolute inset-0 bg-ink/10" />
      </div>

      {/* Cream glow that holds the centred copy (wider and stronger on phones) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_50%,var(--color-cream)_0%,var(--color-cream)_42%,rgba(243,242,229,0.88)_58%,rgba(243,242,229,0.35)_78%,rgba(243,242,229,0)_100%)] max-md:bg-[radial-gradient(ellipse_150%_52%_at_50%_50%,var(--color-cream)_0%,var(--color-cream)_48%,rgba(243,242,229,0.6)_72%,rgba(243,242,229,0)_100%)]"
      />
      {/* gentle fade at the top so the section meets the green FAQ softly */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream/70 to-transparent" />

      <div className="container-x relative py-40 text-center sm:py-36 lg:py-44 2xl:py-52">
        <div className="mx-auto max-w-4xl">
          <p className="fc-rise eyebrow justify-center text-ink-soft">
            <span aria-hidden className="size-2 rounded-full bg-green" />
            About a minute
          </p>
          <SplitHeading id="final-title" className="h-section mx-auto mt-5 max-w-[18ch]">
            {finalCta.title}
          </SplitHeading>
          <p className="fc-rise lead mx-auto mt-6 max-w-xl text-ink-soft">{finalCta.sub}</p>
          <div className="fc-rise mt-10">
            <QuizButton />
          </div>
          <ul className="fc-rise mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.9rem] font-medium text-ink-soft">
            {["Licensed broker", `Australian Credit Licence ${site.acl}`, "Access to 40+ lenders"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <CheckIcon className="size-4 text-green" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Floating card on the photo (desktop) */}
      <div className="fc-card absolute bottom-[12%] right-[6%] hidden xl:block">
        <div className="flex items-center gap-4 rounded-2xl bg-paper p-4 pr-5 shadow-[0_30px_60px_-24px_rgba(1,36,18,0.6)] motion-safe:animate-[bob_7s_ease-in-out_infinite]">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-green text-offwhite">
            <BrandIcon name="home-1" className="size-5" />
          </span>
          <div>
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">Your home&rsquo;s equity</p>
            <p className="mt-0.5 flex items-center gap-2 font-serif text-[1.25rem] leading-tight text-ink">
              <ArrowIcon className="size-4 shrink-0 text-green" />
              ATO balance paid in full
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
