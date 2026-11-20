/**
 * Meta Pixel helpers. Every call is a no-op when the pixel isn't configured
 * (NEXT_PUBLIC_META_PIXEL_ID unset) or blocked by the browser.
 */

type Fbq = (...args: unknown[]) => void;

function fbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const f = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof f === "function" ? f : null;
}

/** Mirrors every funnel event into GTM's dataLayer (event names: fl_lead, fl_schedule, fl_quizstart...). */
function dataLayerPush(event: string, params?: Record<string, unknown>, eventID?: string) {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: `fl_${event.toLowerCase()}`, ...(params ?? {}), ...(eventID ? { event_id: eventID } : {}) });
  } catch {
    /* ignore */
  }
}

/**
 * Google Analytics 4 (direct gtag, when NEXT_PUBLIC_GA_MEASUREMENT_ID is set): funnel events are sent
 * under GA4's recommended lead-generation names so they can be marked as key events in GA4.
 */
const GA4_EVENTS: Record<string, string> = {
  Lead: "generate_lead",
  QualifiedLead: "qualify_lead",
  Schedule: "schedule_appointment",
  QuizStart: "quiz_start",
  QuizStep: "quiz_step",
  QuizNotFit: "quiz_not_fit",
};
function ga4(event: string, params?: Record<string, unknown>, eventID?: string) {
  if (typeof window === "undefined") return;
  try {
    const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
    if (typeof g !== "function") return;
    g("event", GA4_EVENTS[event] ?? event.toLowerCase(), { ...(params ?? {}), ...(eventID ? { event_id: eventID } : {}) });
  } catch {
    /* ignore */
  }
}

export function track(event: string, params?: Record<string, unknown>, eventID?: string) {
  fbq()?.("track", event, params ?? {}, eventID ? { eventID } : undefined);
  dataLayerPush(event, params, eventID);
  ga4(event, params, eventID);
}

export function trackCustom(event: string, params?: Record<string, unknown>, eventID?: string) {
  fbq()?.("trackCustom", event, params ?? {}, eventID ? { eventID } : undefined);
  dataLayerPush(event, params, eventID);
  ga4(event, params, eventID);
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const VISITOR_KEY = "ft-vid";
const FBC_KEY = "ft-fbc";

/**
 * First-party visitor id, sent to Meta as external_id with every conversion (pixel and CAPI) so the
 * browser and server copies tie to the same person. Created on first use and kept in localStorage.
 */
export function visitorId(): string | undefined {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = newEventId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

/**
 * Browser-side advanced matching: re-initialises the pixel with the visitor's details so the next
 * pixel event carries them (Meta hashes them in the browser). Call just before a conversion.
 * Meta only accepts this when the pixel was initialised without user data, so layout.tsx initialises
 * it empty unless the quiz contact is already known (then it passes the same fields itself).
 */
export function matchUser(contact: { first_name?: string; last_name?: string; email?: string; phone?: string } = {}) {
  const f = fbq();
  if (!f || !PIXEL_ID) return;
  const lower = (v?: string) => v?.trim().toLowerCase() || undefined;
  const ud: Record<string, string> = {};
  const set = (k: string, v?: string) => {
    if (v) ud[k] = v;
  };
  set("em", lower(contact.email));
  set("ph", contact.phone?.replace(/\D/g, "") || undefined);
  set("fn", lower(contact.first_name));
  set("ln", lower(contact.last_name?.split(/\s+/).pop()));
  set("external_id", visitorId());
  if (Object.keys(ud).length) f("init", PIXEL_ID, ud);
}

export function newEventId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

/** UTM tags, fbclid and the Meta browser cookies, captured once per visit. */
export function attribution(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"]) {
      const v = params.get(key);
      if (v) out[key] = v.slice(0, 200);
    }
    const stored = sessionStorage.getItem("ft-attribution");
    const merged = { ...(stored ? JSON.parse(stored) : {}), ...out };
    sessionStorage.setItem("ft-attribution", JSON.stringify(merged));
    Object.assign(out, merged);
  } catch {
    /* storage blocked: use what's in the URL */
  }
  const cookie = (name: string) => document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))?.[1];
  const fbp = cookie("_fbp");
  const fbc = cookie("_fbc") ?? clickId(out.fbclid);
  if (fbp) out.fbp = fbp;
  if (fbc) out.fbc = fbc;
  out.page = window.location.href.split("#")[0];
  if (document.referrer) out.referrer = document.referrer.slice(0, 300);
  return out;
}

/** fbc built from the ad click's fbclid, kept with its first-seen time so every event sends the same value. */
function clickId(fbclid?: string): string | undefined {
  if (!fbclid) return undefined;
  try {
    const stored = localStorage.getItem(FBC_KEY);
    if (stored && stored.endsWith(`.${fbclid}`)) return stored;
    const fbc = `fb.1.${Date.now()}.${fbclid}`;
    localStorage.setItem(FBC_KEY, fbc);
    return fbc;
  } catch {
    return `fb.1.${Date.now()}.${fbclid}`;
  }
}

/**
 * Server-side copy of a conversion via Fintellect's Conversions API relay (Vercel project
 * "fintellect-capi", which holds the CAPI token; the GHL funnel pages use the same relay).
 * Sent from the browser, like the GHL pages, so the relay sees the visitor's IP and user agent.
 * Raw contact details go in; the relay hashes them. Shares the pixel's event_id, so Meta counts it once.
 */
export const CAPI_RELAY = "https://fintellect-capi.vercel.app/api/capi";

export function relayConversion(
  eventName: string,
  eventId: string,
  contact: { first_name?: string; last_name?: string; email?: string; phone?: string } = {},
  customData: Record<string, unknown> = {},
) {
  try {
    const a = attribution();
    const user = {
      em: contact.email,
      ph: contact.phone,
      fn: contact.first_name,
      ln: contact.last_name,
      email: contact.email,
      phone: contact.phone,
      first_name: contact.first_name,
      last_name: contact.last_name,
      fbp: a.fbp,
      fbc: a.fbc,
      external_id: visitorId(),
      client_user_agent: navigator.userAgent,
    };
    void fetch(CAPI_RELAY, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href.split("#")[0],
        action_source: "website",
        ...user,
        user_data: user,
        custom_data: customData,
      }),
    }).catch(() => {});
  } catch {
    /* never block the visitor on tracking */
  }
}
