import type { Metadata } from "next";
import { FunnelCard, FunnelHero, FunnelPage } from "@/components/latest/FunnelChrome";
import { ScheduleTracker } from "@/components/latest/ScheduleTracker";

export const metadata: Metadata = {
  title: "You're booked | Fintellect",
  description: "Your free 15-minute lending review with Robert is booked.",
};

const steps = [
  "Robert will call you at your booked time, so keep an eye on your phone.",
  "We've emailed your confirmation with the details, and we'll send reminders closer to the time.",
  "Jot down any questions. It's a straight, no-pressure chat about where you stand with the ATO and your real options.",
];

/** Funnel step 3: GHL's calendar redirects here after a booking. Fires the Schedule conversion. */
export default function ThankYouPage() {
  return (
    <FunnelPage>
      <ScheduleTracker />
      <FunnelHero
        eyebrow="You're booked"
        title={
          <>
            Your lending review <em style={{ fontStyle: "normal", fontWeight: "inherit", color: "#9FD3A8" }}>is locked in.</em>
          </>
        }
        intro="Nice work. Here's what happens next."
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
        <p style={{ margin: "28px 0 0", paddingTop: "22px", borderTop: "1px solid #E2E6D1", fontSize: "16.5px", fontWeight: "600" }}>That&apos;s it. Talk soon.</p>
      </FunnelCard>
    </FunnelPage>
  );
}
