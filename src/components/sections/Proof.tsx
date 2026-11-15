import Image from "next/image";
import { proof } from "@/lib/content";
import { BrandIcon } from "@/components/ui/primitives";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";

/** Case study (slot until Robert supplies a real one) + "You deal with Robert". */
export function Proof() {
  const c = proof.caseStudy;
  return (
    <section aria-labelledby="robert-title" className="bg-paper py-20 sm:py-28 lg:py-32 2xl:py-40">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16 2xl:gap-28">
        {/* Case study */}
        <div className="lg:col-span-6">
          <SplitHeading className="h-sub">{proof.caseTitle}</SplitHeading>
          <Reveal className="mt-8">
            <article className="relative overflow-hidden rounded-card bg-ink p-7 text-offwhite sm:p-9">
              <div aria-hidden className="absolute -bottom-20 -right-20 size-64 glow [--glow:rgba(32,105,67,0.65)]" />
              <div aria-hidden className="absolute -right-10 -top-10 size-40 rounded-full border-[1.5px] border-sage/30" />
              {c.placeholder && (
                <p className="relative mb-6 inline-flex items-center gap-2 rounded-pill bg-[#f6e3bf] px-3 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-amber">
                  Placeholder · Robert to supply
                </p>
              )}
              <p className="eyebrow relative text-offwhite">
                <span className="size-2 rounded-full bg-mint" />
                Client story
              </p>
              <p className="relative mt-3 font-serif text-[1.6rem] leading-tight">{c.where}</p>
              <dl className="relative mt-8 grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-3">
                {c.metrics.map((m) => (
                  <div key={m.label} className="bg-ink-800 p-5">
                    <dt className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-offwhite/90">{m.label}</dt>
                    <dd className="mt-2 font-serif text-[1.45rem] leading-tight text-offwhite">{m.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="relative mt-6 text-[0.9rem] text-offwhite/90">{c.note}</p>
            </article>
          </Reveal>
        </div>

        {/* Robert */}
        <div className="lg:col-span-6">
          <SplitHeading id="robert-title" className="h-sub">
            {proof.robertTitle}
          </SplitHeading>
          <Reveal as="ul" className="mt-8 flex flex-col" stagger={0.08}>
            {proof.robertPoints.map((p) => (
              <li key={p.text} className="group flex items-start gap-5 border-b border-line py-5 first:border-t">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sand-soft text-green transition-[background-color,color,transform] duration-500 ease-[var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-105 group-hover:bg-green group-hover:text-offwhite">
                  <BrandIcon name={p.icon} className="size-5" />
                </span>
                <p className="pt-2.5 text-[1.05rem] leading-relaxed">{p.text}</p>
              </li>
            ))}
          </Reveal>
          <Reveal className="mt-8">
            <div className="flex items-center gap-4 rounded-card bg-sand-soft p-4 pr-6">
              <Image src="/brand/logo/profile-green.png" alt="" width={112} height={112} className="size-14 rounded-full" />
              <div>
                <p className="font-serif text-[1.25rem] leading-tight">Robert</p>
                <p className="text-[0.9rem] text-ink-soft">Your broker at Fintellect</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
