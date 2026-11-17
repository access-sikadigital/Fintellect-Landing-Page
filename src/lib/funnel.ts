/**
 * Funnel: landing page (/) → calendar booking (/book) → thank you (/thank-you).
 * For now every lead books (Review leads included). /enquiry-thank-you is kept for when the funnel is
 * tightened and Review leads should skip the calendar.
 *
 * The calendar on /book is the GoHighLevel booking widget, so the appointment, the contact
 * and every GHL workflow and attribution report stay in GHL. After a booking, the widget sends
 * the whole tab to the calendar's "Redirect URL" (set in GHL → Calendars → the calendar →
 * Forms & payment → After booking). For the funnel to finish on /thank-you, that calendar's
 * Redirect URL must be https://<this site>/thank-you.
 */

/** GHL calendar shown on /book. Override per environment with NEXT_PUBLIC_GHL_CALENDAR_ID. */
export const GHL_CALENDAR_ID = process.env.NEXT_PUBLIC_GHL_CALENDAR_ID || "8RpEpjHvlXdqKf6jyLGN";
export const GHL_WIDGET_URL = `https://api.leadconnectorhq.com/widget/booking/${GHL_CALENDAR_ID}`;
export const GHL_EMBED_SCRIPT = "https://link.msgsndr.com/js/form_embed.js";

export const BOOK_PATH = "/book";
/** Where "Review" leads land (answers that need a closer look before booking). */
export const ENQUIRY_THANKS_PATH = "/enquiry-thank-you";

/** Query params passed from the quiz to /book and on to the GHL widget (prefill + attribution). */
export const PREFILL_KEYS = ["first_name", "last_name", "email", "phone"] as const;
export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"] as const;

export type FunnelContact = { first_name?: string; last_name?: string; email?: string; phone?: string };

const CONTACT_KEY = "ft-contact";

/** Keeps the quiz contact for this visit so /thank-you can send a well-matched Schedule event to Meta. */
export function saveContact(c: FunnelContact) {
  try {
    sessionStorage.setItem(CONTACT_KEY, JSON.stringify(c));
  } catch {
    /* storage blocked */
  }
}

export function loadContact(): FunnelContact {
  try {
    return JSON.parse(sessionStorage.getItem(CONTACT_KEY) || "{}") as FunnelContact;
  } catch {
    return {};
  }
}
