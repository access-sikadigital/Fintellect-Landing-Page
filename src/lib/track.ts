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

export function track(event: string, params?: Record<string, unknown>, eventID?: string) {
  fbq()?.("track", event, params ?? {}, eventID ? { eventID } : undefined);
  dataLayerPush(event, params, eventID);
}

export function trackCustom(event: string, params?: Record<string, unknown>) {
  fbq()?.("trackCustom", event, params ?? {});
  dataLayerPush(event, params);
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
  const fbc = cookie("_fbc") ?? (out.fbclid ? `fb.1.${Date.now()}.${out.fbclid}` : undefined);
  if (fbp) out.fbp = fbp;
  if (fbc) out.fbc = fbc;
  out.page = window.location.href.split("#")[0];
  if (document.referrer) out.referrer = document.referrer.slice(0, 300);
  return out;
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
