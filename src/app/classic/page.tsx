import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCta } from "@/components/layout/MobileCta";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Pain } from "@/components/sections/Pain";
import { Solution } from "@/components/sections/Solution";
import { Compare } from "@/components/sections/Compare";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CallPrep } from "@/components/sections/CallPrep";
import { Fit } from "@/components/sections/Fit";
import { Structure } from "@/components/sections/Structure";
import { Proof } from "@/components/sections/Proof";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";

/**
 * Section order follows the questions a visitor asks, in order:
 * Is this for me? (Hero) → What is it costing me? (Pain) → What's the option? (Solution)
 * → Is it actually better? (Compare) → What happens? (HowItWorks) → What do I need? (CallPrep)
 * → Do I qualify? (Fit) → Does my set-up matter? (Structure) → Who am I dealing with? (Proof)
 * → Anything else? (FAQ) → Go (FinalCta).
 */
/** The previous custom design, kept at /classic. The home page now uses the original artifact design. */
export default function ClassicPage() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Marquee />
        <Pain />
        <Solution />
        <Compare />
        <HowItWorks />
        <CallPrep />
        <Fit />
        <Structure />
        <Proof />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
