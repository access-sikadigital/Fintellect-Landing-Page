import { footer, site } from "@/lib/content";
import { Logo } from "@/components/ui/primitives";

/** Centred footer: logo, then the licence and disclaimer, then © and the legal links. */
export function Footer() {
  return (
    <footer className="on-dark bg-ink pb-28 text-center text-sand/80 sm:pb-14">
      <div className="container-x border-t border-white/10 pt-12">
        <div className="flex justify-center">
          <Logo tone="light" />
        </div>

        <div className="mx-auto mt-8 max-w-4xl space-y-3 border-t border-white/10 pt-8 text-[0.86rem] leading-relaxed">
          <p className="font-medium text-offwhite">{footer.lines[0]}</p>
          <p>{footer.lines[1]}</p>
        </div>

        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-3 border-t border-white/10 pt-6 text-[0.84rem]">
          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href={site.privacyHref} target="_blank" rel="noopener" className="text-offwhite underline-offset-4 transition-colors hover:text-mint hover:underline">
              Privacy Policy
            </a>
            <a href={site.termsHref} target="_blank" rel="noopener" className="text-offwhite underline-offset-4 transition-colors hover:text-mint hover:underline">
              Credit guide
            </a>
          </nav>
          <p className="text-sand/60">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
