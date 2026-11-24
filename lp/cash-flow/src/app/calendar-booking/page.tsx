import type { Metadata } from "next";
import { FunnelCard, FunnelHero, FunnelPage } from "@/components/latest/FunnelChrome";
import { BookingCalendar } from "@/components/latest/BookingCalendar";

export const metadata: Metadata = {
  title: "Book your lending review | Fintellect",
  description: "Pick a time for a 15-minute phone call with Robert about covering your cash flow gap.",
};

/** Funnel step 2 (/calendar-booking): the GoHighLevel calendar, pre-filled from the quiz. */
export default function BookPage() {
  return (
    <FunnelPage>
      <FunnelHero
        eyebrow="Last step"
        title={
          <>
            Book your 15-minute <em style={{ fontStyle: "normal", fontWeight: "inherit", color: "#9FD3A8" }}>lending review.</em>
          </>
        }
        intro="Pick a time for a phone call with Robert. He'll go through which lenders could cover your cash flow gap and what that might look like for your business. No obligation."
      />
      <FunnelCard>
        <BookingCalendar />
      </FunnelCard>
    </FunnelPage>
  );
}
