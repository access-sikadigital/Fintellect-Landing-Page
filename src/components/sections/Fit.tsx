"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { fit } from "@/lib/content";
import { CheckIcon, CrossIcon } from "@/components/ui/primitives";
import { SplitHeading } from "@/components/ui/Reveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** "Is this for you?": a portrait with a slow parallax, then the yes / no lists. */
export function Fit() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(".f-photo img", { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: ".f-photo", start: "top bottom", end: "bottom top", scrub: true } });
        gsap.fromTo(
          ".f-photo",
          { clipPath: "inset(12% 8% 12% 8% round 1.75rem)" },
          { clipPath: "inset(0% 0% 0% 0% round 1.75rem)", ease: "none", scrollTrigger: { trigger: ".f-photo", start: "top 95%", end: "top 40%", scrub: 0.6 } },
        );
        gsap.utils.toArray<HTMLElement>(".f-list").forEach((list) => {
          gsap.from(list.querySelectorAll("li"), {
            x: -16,
            opacity: 0,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.08,
            scrollTrigger: { trigger: list, start: "top 85%", once: true },
          });
          gsap.from(list.querySelectorAll(".f-mark"), {
            scale: 0,
            duration: 0.5,
            ease: "back.out(2.5)",
            stagger: 0.08,
            delay: 0.15,
            scrollTrigger: { trigger: list, start: "top 85%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="fit-title" className="on-dark grain grain-light relative overflow-hidden bg-ink py-20 text-offwhite sm:py-28 lg:py-32 2xl:py-40">
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 size-[40rem] glow [--glow:rgba(32,105,67,0.55)]" />
      <div className="container-x relative grid gap-10 lg:grid-cols-12 lg:gap-14 2xl:gap-20">
        <div className="f-photo relative min-h-[22rem] overflow-hidden rounded-card ring-1 ring-white/10 lg:col-span-5 lg:min-h-0">
          <Image src="/images/fit-business-owner.webp" alt="A self-employed business owner sitting in the doorway of his work van" fill quality={90} sizes="(min-width: 1024px) 40vw, 100vw" className="scale-[1.18] object-cover object-[58%_50%]" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgba(1,36,18,0.7),transparent_45%)]" />
          <p className="absolute bottom-6 left-6 right-6 inline-flex w-fit items-center gap-2 rounded-pill bg-offwhite px-4 py-2 text-[0.88rem] font-semibold text-ink">
            <span aria-hidden className="size-1.5 rounded-full bg-green" />
            For business owners who own property
          </p>
        </div>

        <div className="lg:col-span-7">
          <p className="eyebrow text-sand/70">
            <span aria-hidden className="size-2 rounded-full bg-mint" />
            Check the fit
          </p>
          <SplitHeading id="fit-title" className="h-section mt-5">
            {fit.title}
          </SplitHeading>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {/* the "yes" list is the bright card */}
            <div className="relative overflow-hidden rounded-card bg-offwhite p-7 text-ink sm:p-8">
              <span aria-hidden className="absolute -right-12 -top-12 size-40 glow [--glow:rgba(159,211,176,0.7)]" />
              <h3 className="h-card relative text-green">{fit.yes.title}</h3>
              <ul className="f-list relative mt-5 flex flex-col gap-3.5">
                {fit.yes.items.map((t) => (
                  <li key={t} className="flex items-start gap-3 font-medium leading-relaxed">
                    <span className="f-mark mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-green text-offwhite">
                      <CheckIcon className="size-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-card bg-cream p-7 text-ink sm:p-8">
              <h3 className="h-card text-ink-soft">{fit.no.title}</h3>
              <ul className="f-list mt-5 flex flex-col gap-3.5">
                {fit.no.items.map((t) => (
                  <li key={t} className="flex items-start gap-3 leading-relaxed text-ink-soft">
                    <span className="f-mark mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sand text-ink-soft">
                      <CrossIcon className="size-3.5" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
