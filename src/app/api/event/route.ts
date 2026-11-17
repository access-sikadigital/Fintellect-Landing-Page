import { NextResponse, type NextRequest } from "next/server";
import { sendToMetaCapi } from "@/lib/metaCapi";
import { checkAuMobile, checkEmail, toE164 } from "@/lib/validation";

/**
 * Server-side copy of a funnel conversion (currently only "Schedule", fired on /thank-you),
 * deduplicated against the browser pixel through the shared event_id.
 */

const ALLOWED = new Set(["Schedule"]);
const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const eventName = clean(body.event, 40);
  const eventId = clean(body.eventId, 80);
  if (!ALLOWED.has(eventName) || !eventId) return NextResponse.json({ ok: false }, { status: 400 });

  const attribution: Record<string, string> = {};
  for (const [k, v] of Object.entries((body.attribution ?? {}) as Record<string, unknown>)) {
    if (/^[a-z_]{2,20}$/.test(k)) attribution[k] = clean(v, 500);
  }
  // Contact details are optional: only well-formed values are hashed and sent
  const c = (body.contact ?? {}) as Record<string, unknown>;
  const email = checkEmail(clean(c.email, 254));
  const phone = checkAuMobile(clean(c.phone, 40));

  await sendToMetaCapi(
    {
      eventName,
      eventId,
      email: email.ok ? email.value : undefined,
      phoneE164: phone.ok ? toE164(phone.value) : undefined,
      firstName: clean(c.first_name, 40) || undefined,
      lastName: clean(c.last_name, 40) || undefined,
      attribution,
      customData: { content_name: "ATO debt lending review" },
    },
    req,
  );
  return NextResponse.json({ ok: true });
}
