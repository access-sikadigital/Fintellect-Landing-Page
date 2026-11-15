/**
 * Contact-detail rules shared by the quiz (browser) and /api/lead (server),
 * so both sides accept and reject exactly the same input.
 *
 *  - Name:  letters only (any language), plus spaces, hyphens and apostrophes
 *           for names like "Mary-Jane O'Brien". No digits or symbols.
 *  - Phone: Australian mobiles only. 04xx xxx xxx, +61 4xx xxx xxx or 61 4xx xxx xxx.
 *  - Email: a real address shape (local@domain.tld), with a "did you mean" for common typos.
 */

export type Check = { ok: true; value: string } | { ok: false; error: string };

/* ---------------- Name ---------------- */

/** Strip anything that isn't a letter, space, hyphen or apostrophe as the visitor types. */
export const sanitiseName = (v: string) =>
  v
    .replace(/[^\p{L}\p{M}\s'’-]/gu, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^\s+/, "")
    .slice(0, 60);

export function checkName(raw: string): Check {
  const v = raw.trim().replace(/\s+/g, " ").replace(/’/g, "'");
  if (!v) return { ok: false, error: "Please enter your name." };
  if (/[^\p{L}\p{M}\s'-]/u.test(v)) return { ok: false, error: "Please use letters only in your name." };
  if (!/^\p{L}/u.test(v) || /['-]{2,}|[\s'-]$/u.test(v)) return { ok: false, error: "Please check your name." };
  if (v.replace(/[^\p{L}]/gu, "").length < 2) return { ok: false, error: "Please enter your full name." };
  if (v.length > 60) return { ok: false, error: "That name is a little long. Please shorten it." };
  return { ok: true, value: v };
}

export function splitName(name: string) {
  const parts = name.trim().split(/\s+/);
  const cap = (s: string) => s.replace(/(^|[\s'-])(\p{L})/gu, (_, a: string, b: string) => a + b.toUpperCase());
  return { firstName: cap(parts[0] ?? ""), lastName: cap(parts.slice(1).join(" ")) };
}

/* ---------------- Australian mobile ---------------- */

/** Keep only characters a phone number can contain. */
export const sanitisePhone = (v: string) => v.replace(/[^\d\s+()-]/g, "").slice(0, 18);

/** Reduce any accepted format to 10 national digits (04XXXXXXXX), or return the raw digits. */
function nationalDigits(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("0061")) d = d.slice(4);
  else if (d.startsWith("61")) d = d.slice(2);
  if (d.length === 9 && !d.startsWith("0")) d = `0${d}`;
  return d;
}

export function checkAuMobile(raw: string): Check {
  const v = raw.trim();
  if (!v) return { ok: false, error: "Please enter your mobile number." };
  const plus = v.startsWith("+");
  if (plus && !/^\+\s*\(?61/.test(v)) return { ok: false, error: "Please use an Australian mobile number (+61 or 04)." };
  const d = nationalDigits(v);
  if (/^0[2378]/.test(d) && d.length === 10)
    return { ok: false, error: "That looks like a landline. Please enter your mobile (starts with 04)." };
  if (!d.startsWith("04")) return { ok: false, error: "Australian mobiles start with 04, e.g. 0412 345 678." };
  if (d.length !== 10) return { ok: false, error: "Australian mobiles have 10 digits, e.g. 0412 345 678." };
  if (/^04(\d)\1{7}$/.test(d)) return { ok: false, error: "Please enter your real mobile number." };
  return { ok: true, value: d };
}

/** 0412345678 -> "0412 345 678" (for display after the field loses focus). */
export const formatAuMobile = (d: string) => `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
/** 0412345678 -> "+61412345678" (E.164, for the CRM and Meta). */
export const toE164 = (d: string) => `+61${d.slice(1)}`;

/* ---------------- Email ---------------- */

export const sanitiseEmail = (v: string) => v.replace(/\s/g, "").slice(0, 254);

const LOCAL = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const LABEL = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const TLD = /^[A-Za-z]{2,24}$/;

export function checkEmail(raw: string): Check {
  const v = raw.trim().toLowerCase();
  if (!v) return { ok: false, error: "Please enter your email address." };
  const at = v.lastIndexOf("@");
  if (at < 0) return { ok: false, error: "Your email needs an @, e.g. name@gmail.com." };
  if (v.indexOf("@") !== at) return { ok: false, error: "Your email can only have one @." };
  const local = v.slice(0, at);
  const domain = v.slice(at + 1);
  if (!local) return { ok: false, error: "Please add the part before the @." };
  if (!domain) return { ok: false, error: "Please add the part after the @, e.g. gmail.com." };
  if (local.length > 64 || v.length > 254 || !LOCAL.test(local))
    return { ok: false, error: "Please check the part before the @." };
  const labels = domain.split(".");
  if (labels.length < 2 || !labels.every((l) => LABEL.test(l)) || !TLD.test(labels[labels.length - 1]))
    return { ok: false, error: "Please check the part after the @, e.g. gmail.com." };
  return { ok: true, value: v };
}

/** Common domain typos -> the address the visitor most likely meant. */
const DOMAIN_FIX: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com", "gnail.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmail.cm": "gmail.com", "gmail.om": "gmail.com", "gmail.com.au": "gmail.com",
  "hotmial.com": "hotmail.com", "hotmai.com": "hotmail.com", "hotmail.co": "hotmail.com", "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com", "outlook.co": "outlook.com", "outlook.con": "outlook.com",
  "yahoo.co": "yahoo.com", "yahoo.con": "yahoo.com", "yaho.com": "yahoo.com", "yahoo.com.a": "yahoo.com.au",
  "icloud.co": "icloud.com", "icoud.com": "icloud.com", "iclod.com": "icloud.com",
  "bigpond.co": "bigpond.com", "bigpond.con": "bigpond.com", "bigpnd.com": "bigpond.com",
};

export function suggestEmail(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  const at = v.lastIndexOf("@");
  if (at < 1) return null;
  const domain = v.slice(at + 1);
  let fixed = DOMAIN_FIX[domain];
  if (!fixed && domain.endsWith(".con")) fixed = `${domain.slice(0, -4)}.com`;
  if (!fixed && domain.endsWith(".com.a")) fixed = `${domain}u`;
  return fixed ? `${v.slice(0, at)}@${fixed}` : null;
}
