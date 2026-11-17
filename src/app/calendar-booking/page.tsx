import type { Metadata } from "next";
import { FunnelCard, FunnelHero, FunnelPage } from "@/components/latest/FunnelChrome";
import { BookingCalendar } from "@/components/latest/BookingCalendar";

export const metadata: Metadata = {
  title: "Book your free lending review | Fintellect",
  description: "Pick a time for a free 15-minute phone call with Robert about clearing your ATO debt.",
};

/** Funnel step 2 (/calendar-booking): the GoHighLevel calendar, pre-filled from the quiz. */
export default function BookPage() {
  return (
    <FunnelPage>
      <FunnelHero
        eyebrow="Last step"
        title={
          <>
            Book your free 15-minute <em style={{ fontStyle: "normal", fontWeight: "inherit", color: "#9FD3A8" }}>lending review.</em>
          </>
        }
        intro="Pick a time for a phone call with Robert. He'll go through which lenders could clear your ATO debt and what that might look like for your business. No credit check and no obligation."
      />
      <FunnelCard>
        <BookingCalendar />
      </FunnelCard>
    </FunnelPage>
  );
}
