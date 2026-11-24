"use client";

import { useEffect } from "react";
import { matchUser, newEventId, relayConversion, track } from "@/lib/track";
import { loadContact } from "@/lib/funnel";

const SENT_KEY = "ft-schedule-sent";

/**
 * Fires the Meta "Schedule" conversion once per visit: the browser pixel plus a server-side
 * copy through the CAPI relay, sharing one event_id so Meta counts it once.
 * A refresh of the thank-you page doesn't count a second booking.
 */
export function ScheduleTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SENT_KEY)) return;
      sessionStorage.setItem(SENT_KEY, "1");
    } catch {
      /* storage blocked: fire anyway */
    }
    const eventId = newEventId();
    // Quiz contact from this visit; falls back to any contact details GHL adds to the redirect URL
    const contact = loadContact();
    try {
      const q = new URLSearchParams(window.location.search);
      for (const k of ["first_name", "last_name", "email", "phone"] as const) {
        const v = q.get(k);
        if (!contact[k] && v) contact[k] = v.slice(0, 200);
      }
    } catch {
      /* ignore */
    }
    // The pixel snippet loads after hydration: wait for fbq (up to ~5s) so the event isn't dropped
    let tries = 0;
    const fire = () => {
      if (typeof (window as unknown as { fbq?: unknown }).fbq === "function" || tries++ > 25) {
        matchUser(contact);
        track("Schedule", { content_name: "Expansion lending review" }, eventId);
      } else {
        setTimeout(fire, 200);
      }
    };
    fire();
    relayConversion("Schedule", eventId, contact, { content_name: "Expansion lending review" });
  }, []);
  return null;
}
