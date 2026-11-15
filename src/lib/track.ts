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

export function track(event: string, params?: Record<string, unknown>, eventID?: string) {
  fbq()?.("track", event, params ?? {}, eventID ? { eventID } : undefined);
}

export function trackCustom(event: string, params?: Record<string, unknown>) {
  fbq()?.("trackCustom", event, params ?? {});
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
