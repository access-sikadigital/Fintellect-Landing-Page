"use client";

import { useEffect, useRef } from "react";
import { attribution } from "@/lib/track";
import { ATTRIBUTION_KEYS, GHL_CALENDAR_ID, GHL_EMBED_SCRIPT, GHL_WIDGET_URL, PREFILL_KEYS, THANK_YOU_PATH } from "@/lib/funnel";

/**
 * The GoHighLevel booking widget. GHL creates the appointment and matches it to the contact the
 * quiz already sent through the webhook (same email and phone), so bookings, workflows and
 * attribution all live in GHL. form_embed.js resizes the iframe and hands the page's query
 * string (prefill + UTMs) to the widget.
 *
 * GHL takes a booking's attribution from this page's URL, so the UTMs and fbclid must be on it. The quiz
 * already adds them to the /calendar-booking link; if they're missing (e.g. the page was reopened without
 * them) they're put back from this session's ft-attribution before the GHL script loads.
 */
export function BookingCalendar() {
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const here = new URLSearchParams(window.location.search);
    const stored = attribution(); // UTMs and fbclid from the landing page visit, kept for this session
    let missing = false;
    for (const k of ATTRIBUTION_KEYS) {
      if (!here.get(k) && stored[k]) {
        here.set(k, stored[k]);
        missing = true;
      }
    }
    if (missing) window.history.replaceState(window.history.state, "", `${window.location.pathname}?${here}${window.location.hash}`);
    const u = new URL(GHL_WIDGET_URL);
    for (const k of PREFILL_KEYS) {
      const v = here.get(k);
      if (v) u.searchParams.set(k, v);
    }
    for (const k of ATTRIBUTION_KEYS) {
      const v = here.get(k) || stored[k];
      if (v) u.searchParams.set(k, v);
    }
    // Set once on the client (the query string only exists in the browser); form_embed.js picks the iframe up from its id
    if (frame.current) frame.current.src = u.toString();
    // Load form_embed.js only now, once the page URL and the iframe src both carry the attribution
    if (!document.querySelector(`script[src="${GHL_EMBED_SCRIPT}"]`)) {
      const s = document.createElement("script");
      s.src = GHL_EMBED_SCRIPT;
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  // GHL posts ["msgsndr-booking-complete", {...}] to this page just before it sends the top window to
  // the calendar's redirect URL. That redirect is shared by every landing page (one calendar), so we
  // navigate to *this* page's thank-you first. Our navigation is issued later, so it wins.
  useEffect(() => {
    let done = false;
    const onMessage = (e: MessageEvent) => {
      if (done || !frame.current || e.source !== frame.current.contentWindow) return;
      if (!Array.isArray(e.data) || e.data[0] !== "msgsndr-booking-complete") return;
      done = true;
      window.location.href = THANK_YOU_PATH;
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <>
      <div style={{ minHeight: "720px", position: "relative" }}>
        <iframe
          ref={frame}
          id={`${GHL_CALENDAR_ID}_booking`}
          title="Book a time with Robert"
          className="fl-ghl-frame"
          scrolling="no"
          style={{ width: "100%", minHeight: "720px", border: "none", overflow: "hidden", display: "block" }}
        />
      </div>
    </>
  );
}
