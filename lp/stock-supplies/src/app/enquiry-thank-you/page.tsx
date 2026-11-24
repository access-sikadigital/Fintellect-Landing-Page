import type { Metadata } from "next";
import { FunnelCard, FunnelHero, FunnelPage } from "@/components/latest/FunnelChrome";

export const metadata: Metadata = {
  title: "Thanks, we've got your details | Fintellect",
  description: "Robert will review your answers and be in touch.",
};

const steps = [
  "Robert reviews your answers and works out which lenders are likely to look at your situation.",
  "He'll call you on the mobile you gave us to talk it through.",
  "Keep an eye on your phone and email in the meantime.",
];

/**
 * Quiz leads whose answers need a closer look ("Review") land here instead of the booking page.
 * The Lead is already in GHL (webhook) and Meta (pixel + CAPI) from the quiz submit; this page gives
 * the step its own URL so it can be tracked and reported on.
 */
export default function EnquiryThankYouPage() {
  return (
    <FunnelPage>
      <FunnelHero
        eyebrow="Thanks, we've got your details"
        title={
          <>
            Robert will take a <em style={{ fontStyle: "normal", fontWeight: "inherit", color: "#9FD3A8" }}>closer look.</em>
          </>
        }
        intro="A few of your answers mean the right lender takes a bit more working out. Robert will review your details and be in touch."
      />
      <FunnelCard maxWidth="720px" padding="clamp(28px, 5vw, 44px) clamp(22px, 5vw, 44px)">
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#206943", color: "#FBFEEE", fontSize: "26px", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 0 22px" }} aria-hidden="true">
          ✓
        </div>
        <h2 style={{ fontWeight: "600", fontSize: "clamp(24px, 3vw, 30px)", lineHeight: "1.2", letterSpacing: "-0.015em", margin: "0 0 22px" }}>What happens next</h2>
        <ol style={{ listStyle: "none", padding: "0", margin: "0", display: "flex", flexDirection: "column", gap: "16px" }}>
          {steps.map((s, k) => (
            <li key={s} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <span style={{ flex: "0 0 32px", height: "32px", borderRadius: "50%", background: "#012412", color: "#FBFEEE", fontWeight: "600", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>{k + 1}</span>
              <span style={{ fontSize: "16.5px", color: "#2f3d34", paddingTop: "4px" }}>{s}</span>
            </li>
          ))}
        </ol>
        <p style={{ margin: "28px 0 0", paddingTop: "22px", borderTop: "1px solid #E2E6D1", fontSize: "16.5px", fontWeight: "600" }}>Talk soon.</p>
      </FunnelCard>
    </FunnelPage>
  );
}
