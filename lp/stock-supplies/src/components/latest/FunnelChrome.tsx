/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import { site } from "@/lib/content";
import "./latest.css";

/**
 * Shared page frame for the funnel steps after the landing page (/book, /thank-you):
 * the landing page's dark hero band and header, and its footer, so every step looks like one site.
 */

const font = "var(--font-inter), Inter, -apple-system, 'Segoe UI', Roboto, sans-serif";

export function FunnelPage({ children }: { children: ReactNode }) {
  return (
    <div className="fl-latest" style={{ fontFamily: font, color: "#012412", background: "#FBFEEE", fontSize: "17px", lineHeight: "1.55", overflowX: "hidden", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {children}
      <LatestFooter />
    </div>
  );
}

/** Dark band with the landing page's header, a headline block, and room for a card to overlap its bottom edge. */
export function FunnelHero({ eyebrow, title, intro }: { eyebrow?: ReactNode; title: ReactNode; intro?: ReactNode }) {
  return (
    <section style={{ position: "relative", background: "#012412", color: "#FBFEEE", overflow: "hidden" }}>
      <svg aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", opacity: ".14" }}>
        <g fill="none" stroke="#9FD3A8" strokeWidth="1">
          <path d="M-50 720 C 200 640, 380 780, 640 700 S 1100 560, 1500 640"></path>
          <path d="M-50 640 C 210 560, 390 700, 650 620 S 1110 480, 1500 560"></path>
          <path d="M-50 560 C 230 480, 410 620, 670 540 S 1130 400, 1500 480"></path>
          <path d="M-50 480 C 250 400, 430 540, 690 460 S 1150 320, 1500 400"></path>
          <path d="M-50 400 C 270 320, 450 460, 710 380 S 1170 240, 1500 320"></path>
        </g>
      </svg>
      <header style={{ position: "relative", padding: "0 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", minHeight: "72px", padding: "12px 0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", borderBottom: "1px solid rgba(226,230,209,.12)" }}>
          <img src="/images/ato/logo-fintellect-white.png" alt="Fintellect" style={{ display: "block", height: "16px", width: "auto", maxWidth: "60vw" }} />
          <span className="fl-acl" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#E2E6D1" }}>
            <span className="fl-live" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#9FD3A8" }}></span>Licensed broker · ACL 515382
          </span>
        </div>
      </header>
      <div style={{ position: "relative", maxWidth: "860px", margin: "0 auto", padding: "clamp(36px, 6vw, 64px) 20px clamp(120px, 14vw, 160px)", textAlign: "center" }}>
        {eyebrow && <div style={{ fontSize: "13px", fontWeight: "700", letterSpacing: ".12em", textTransform: "uppercase", color: "#9FD3A8", marginBottom: "14px" }}>{eyebrow}</div>}
        <h1 style={{ fontFamily: font, fontWeight: "600", fontSize: "clamp(34px, 4.4vw, 56px)", lineHeight: "1.06", letterSpacing: "-0.025em", margin: "0" }}>{title}</h1>
        {intro && <p style={{ fontSize: "clamp(17px, 2vw, 19px)", lineHeight: "1.6", color: "#E2E6D1", margin: "20px auto 0", maxWidth: "640px" }}>{intro}</p>}
      </div>
    </section>
  );
}

/** White card that overlaps the bottom of the hero band. */
export function FunnelCard({ children, maxWidth = "1080px", padding = "0" }: { children: ReactNode; maxWidth?: string; padding?: string }) {
  return (
    <main style={{ position: "relative", flex: "1 0 auto", padding: "0 16px clamp(56px, 8vw, 96px)" }}>
      <div style={{ position: "relative", maxWidth, margin: "clamp(-120px, -12vw, -96px) auto 0", background: "#FFFFFF", borderRadius: "22px", border: "1px solid #E2E6D1", boxShadow: "0 30px 70px rgba(1,36,18,.18)", padding, overflow: "hidden" }}>
        {children}
      </div>
    </main>
  );
}

/** The landing page's footer, unchanged. */
export function LatestFooter() {
  return (
    <footer style={{ background: "#012412", color: "#E2E6D1", padding: "clamp(40px, 5vw, 56px) 20px clamp(32px, 4vw, 44px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px", paddingBottom: "28px", borderBottom: "1px solid rgba(226,230,209,.18)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img loading="lazy" decoding="async" src="/images/ato/logo-fintellect-footer.png" alt="Fintellect" style={{ display: "block", height: "72px", width: "auto" }} />
          </div>
          <div style={{ display: "flex", gap: "24px", fontSize: "14px", flexWrap: "wrap" }}>
            <a href={site.privacyHref} target="_blank" rel="noopener" style={{ color: "#E2E6D1" }}>Privacy Policy</a>
            <a href={site.termsHref} target="_blank" rel="noopener" style={{ color: "#E2E6D1" }}>Credit Guide</a>
          </div>
        </div>
        <p style={{ fontSize: "13px", lineHeight: "1.65", color: "#B9C2AD", margin: "24px 0 0", maxWidth: "920px" }}>Fintellect is a trading name of Fintel Group (VIC) Pty Ltd, Australian Credit Licence 515382. Fintellect is an independent broker. The information on this page is general only and doesn&apos;t take into account your objectives, financial situation or needs. All finance is subject to lender approval, terms and conditions, fees and charges.</p>
      </div>
    </footer>
  );
}
