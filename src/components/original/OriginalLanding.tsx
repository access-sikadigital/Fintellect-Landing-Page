import Image from "next/image";
import clsx from "clsx";
import { MobileCta } from "@/components/layout/MobileCta";
import { proof, site } from "@/lib/content";
import { OriginalQuiz } from "./OriginalQuiz";
import { QuizLink } from "./QuizLink";
import s from "./original.module.css";

/**
 * The landing page exactly as designed in the original artifact
 * (claude.ai/artifact/3z1egLsC2YBXoWztpGndL6 → project/Main.dc.html).
 * Motion is limited to Lenis smooth scrolling (layout provider) and the quiz's step transitions.
 *
 * Additions on request: the hero photo (the artifact has none), the pain cards as 3 + 2,
 * and the phones-only sticky button at the bottom of the screen (MobileCta).
 *
 * Copy differences from the artifact, all from earlier client decisions:
 *  - "About two minutes" → "About a minute".
 *  - The case study placeholder is filled with the sample deal from content.ts (proof.caseStudy).
 *  - Footer links point to the real privacy policy and credit guide.
 */

function Tick({ color, size = 20, align }: { color: string; size?: number; align?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={s.check}
      style={align ? { marginTop: 3 } : undefined}
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

const pains = [
  { t: "The interest never stops", p: "The ATO charges interest on the overdue balance, and it compounds daily. The longer it sits, the bigger it gets." },
  { t: "You can't claim it anymore", p: "From 1 July 2025, ATO interest charges are no longer tax-deductible. Every dollar of interest now costs you a full dollar." },
  { t: "Payment plans squeeze cashflow", p: "ATO plans are usually short, so the monthly hit lands on top of wages, suppliers and your own bills." },
  {
    t: "It can follow you",
    p: "Business tax debts of $100,000+ that are over 90 days overdue can be reported to credit bureaus if you're not engaging with the ATO. That makes the next loan harder to get.",
  },
  { t: "And it comes home with you", p: "The letters, the reminders, the late nights doing the numbers." },
];

const steps = [
  { t: "Answer a few questions", p: "Your ATO balance, your property and your business. It takes about a minute." },
  { t: "Talk it through with Robert", p: "A 15-minute call with a licensed broker who works with business owners. He'll tell you straight whether it's an option." },
  { t: "We shortlist the lenders that fit", p: "Access to 40+ lenders, including ones that work with self-employed borrowers. We shortlist the ones that fit you." },
  { t: "The ATO gets paid out", p: "When the loan settles, the ATO balance is paid in full." },
];

const faqs = [
  { q: "What if I'm already on an ATO payment plan?", a: "You can still pay the balance out. The plan ends once the ATO is paid in full." },
  { q: "What if I've received a director penalty notice?", a: "These are time-sensitive. Speak to your accountant straight away, and tell Robert on the call so he knows the timeframe." },
  {
    q: "Do my tax returns and BAS need to be up to date?",
    a: "Most lenders want lodgements up to date or close to it. Tell us where you're at in the quiz and Robert will explain your options.",
  },
  {
    q: "Is the interest on the new loan tax-deductible?",
    a: "It depends on how the money is used and how your business is set up. Your accountant can confirm. We don't give tax advice.",
  },
  { q: "How long does it take?", a: "It depends on the lender, the valuation and your paperwork. Robert will give you a realistic timeframe on the call." },
  { q: "How is Robert paid?", a: "Brokers are usually paid by the lender. Robert will walk you through it in his credit guide before anything goes ahead." },
];

export function OriginalLanding() {
  const cs = proof.caseStudy;
  return (
    <div className={s.page}>
      <header className={s.header}>
        <div className={clsx(s.container, s.headerRow)}>
          <div className={clsx(s.serif, s.logo)}>Fintellect</div>
          <div className={s.licence}>Licensed broker · ACL {site.acl}</div>
        </div>
      </header>

      <main id="main">
        {/* ---------- Hero + quiz ---------- */}
        <section className={s.hero} aria-labelledby="hero-title">
          <div aria-hidden className={s.heroMedia}>
            <Image src="/images/hero-home-equity.webp" alt="" fill priority quality={85} sizes="100vw" className={s.heroImg} />
            <div className={s.heroShade} />
          </div>
          <div className={clsx(s.container, s.heroRow, s.heroRowLayer)}>
            <div className={s.heroCopy}>
              <div className={s.eyebrow}>For business owners with ATO debt</div>
              <h1 id="hero-title" className={clsx(s.serif, s.h1)}>
                Owe the ATO? Your home could pay it out in one go.
              </h1>
              <p className={s.heroSub}>
                ATO interest compounds every day, and since July 2025 you can&apos;t claim it as a tax deduction. If you own property, using your
                equity to clear the balance could take the pressure off. Answer a few questions to see if it fits you.
              </p>
              <div className={s.ticks}>
                <div className={s.tick}>
                  <Tick color="#9fd3b0" />
                  For business owners who own property
                </div>
                <div className={s.tick}>
                  <Tick color="#9fd3b0" />
                  Talk to a licensed broker, not a call centre
                </div>
                <div className={s.tick}>
                  <Tick color="#9fd3b0" />
                  About a minute
                </div>
              </div>
            </div>
            <OriginalQuiz />
          </div>
        </section>

        {/* ---------- Pain ---------- */}
        <section className={s.section}>
          <div className={s.container}>
            <h2 className={clsx(s.serif, s.h2)}>Carrying an ATO debt costs more than it used to</h2>
            <p className={s.lead}>If any of this sounds familiar, you&apos;re not alone.</p>
            <div className={s.cards}>
              {pains.map((c) => (
                <div key={c.t} className={s.card}>
                  <h3 className={s.cardTitle}>{c.t}</h3>
                  <p className={s.cardText}>{c.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Solution ---------- */}
        <section className={s.sectionSand}>
          <div className={clsx(s.container, s.split)}>
            <div className={s.splitMain}>
              <h2 className={clsx(s.serif, s.solutionTitle)}>Clear the ATO through your home loan</h2>
              <p className={s.solutionText}>
                If your property has enough equity, we may be able to restructure your lending to release some of it and pay the ATO balance in
                full. You&apos;re left with one loan and one repayment, spread over a longer term, at a home loan interest rate instead of the
                ATO&apos;s interest charge.
              </p>
              <div className={s.points}>
                {[
                  "The ATO balance is paid out in full. No payment plan, no collection letters.",
                  "One repayment you can plan around, instead of the ATO plan on top of everything else.",
                  "More room in your monthly cashflow to run the business.",
                ].map((t) => (
                  <div key={t} className={s.point}>
                    <Tick color="#206943" size={22} />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={s.honest}>
              <h3 className={clsx(s.serif, s.honestTitle)}>The honest part</h3>
              <p className={s.honestText}>
                This isn&apos;t right for everyone. Your home becomes security for the debt, and a longer term can mean more interest overall.
                That&apos;s why Robert looks at your whole position first, and why we suggest running it past your accountant before you go ahead.
              </p>
            </div>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section className={s.section}>
          <div className={s.container}>
            <h2 className={clsx(s.serif, s.h2Plain)}>How it works</h2>
            <div className={s.steps}>
              {steps.map((st, i) => (
                <div key={st.t} className={s.step}>
                  <div className={clsx(s.serif, s.stepNum)}>{i + 1}</div>
                  <h3 className={s.stepTitle}>{st.t}</h3>
                  <p className={s.cardText}>{st.p}</p>
                </div>
              ))}
            </div>
            <QuizLink className={s.cta}>Check if this works for me</QuizLink>
          </div>
        </section>

        {/* ---------- Fit ---------- */}
        <section className={s.sectionWhite}>
          <div className={s.container}>
            <h2 className={clsx(s.serif, s.h2Plain)}>Is this for you?</h2>
            <div className={s.fitGrid}>
              <div className={s.fitYes}>
                <h3 className={s.fitTitleYes}>This could work if you</h3>
                <ul className={s.list}>
                  <li>run a business or work as a sole trader with an ATO debt</li>
                  <li>own a home or investment property with equity in it</li>
                  <li>have been trading for at least 12 months</li>
                  <li>want the ATO paid out, not just a longer payment plan</li>
                </ul>
              </div>
              <div className={s.fitNo}>
                <h3 className={s.fitTitleNo}>This isn&apos;t for you if you</h3>
                <ul className={s.list}>
                  <li>don&apos;t own property</li>
                  <li>have only just started your business</li>
                  <li>want a quick unsecured loan with no questions asked</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Proof ---------- */}
        <section className={s.section}>
          <div className={clsx(s.container, s.proofRow)}>
            <div className={s.splitMain}>
              <h2 className={clsx(s.serif, s.proofTitle)}>What it looked like for one client</h2>
              <div className={s.caseCard}>
                <div className={s.caseTag}>Client example</div>
                <p className={s.caseWhere}>{cs.where}</p>
                <p className={s.cardText}>
                  {cs.metrics.map((m) => `${m.label}: ${m.value}`).join(" · ")}. {cs.note}
                </p>
              </div>
            </div>
            <div className={s.splitSide}>
              <h2 className={clsx(s.serif, s.proofTitle)}>You deal with Robert, start to finish</h2>
              <ul className={s.listLoose}>
                <li>A licensed broker, not a lead-referral site. Your details aren&apos;t sold on to a list of lenders.</li>
                <li>Works with self-employed and business-owner lending every day.</li>
                <li>Straight answers on the first call, including when it&apos;s not the right move.</li>
                <li>Access to 40+ lenders. We shortlist the ones that fit you.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className={s.sectionWhiteTop}>
          <div className={s.faqWrap}>
            <h2 className={clsx(s.serif, s.faqTitle)}>Questions business owners ask</h2>
            <div>
              {faqs.map((f) => (
                <div key={f.q} className={s.faqItem}>
                  <h3 className={s.faqQ}>{f.q}</h3>
                  <p className={s.faqA}>{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section id="final-cta" className={s.final}>
          <div className={s.finalWrap}>
            <h2 className={clsx(s.serif, s.finalTitle)}>Every month the ATO balance sits there, it costs you more</h2>
            <p className={s.finalSub}>Find out if your property can clear it.</p>
            <QuizLink className={s.ctaLight}>Check if this works for me</QuizLink>
          </div>
        </section>
      </main>

      <footer className={s.footer}>
        <div className={clsx(s.container, s.footerText)}>
          <p>Fintel Group (VIC) Pty Ltd trading as Fintellect · Australian Credit Licence {site.acl}</p>
          <p>
            General information only. It doesn&apos;t consider your objectives, financial situation or needs, and isn&apos;t tax or financial
            advice. Speak to your accountant about your tax position. Lending criteria, fees and charges apply. Your property is used as security
            for the loan.
          </p>
          <p>
            <a href={site.privacyHref} target="_blank" rel="noopener">
              Privacy Policy
            </a>{" "}
            ·{" "}
            <a href={site.termsHref} target="_blank" rel="noopener">
              Credit Guide
            </a>
          </p>
        </div>
      </footer>

      {/* Phones: sticky "Check if this works for me" dock at the bottom of the screen */}
      <MobileCta />
    </div>
  );
}
