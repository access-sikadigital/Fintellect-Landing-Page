import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { quizSteps } from "@/lib/content";

/**
 * Receives a completed quiz.
 *  1. Validates it (and drops honeypot-filled bot submissions silently).
 *  2. Forwards it as JSON to LEAD_WEBHOOK_URL (CRM / Zapier / Make / GoHighLevel).
 *  3. Sends a Lead event to the Meta Conversions API, deduplicated against the
 *     browser pixel's Lead event through the shared event_id.
 */

const allowed = new Map(quizSteps.flatMap((s) => (s.kind === "choice" ? [[s.id, new Set(s.options)] as const] : [])));

const sha256 = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function normalisePhone(raw: string) {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("61")) d = `0${d.slice(2)}`;
  return /^0[2-478]\d{8}$/.test(d) ? d : null;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Bots fill the hidden field; pretend it worked.
  if (clean(body.company)) return NextResponse.json({ ok: true });

  const contactIn = (body.contact ?? {}) as Record<string, unknown>;
  const name = clean(contactIn.name, 120);
  const email = clean(contactIn.email, 200).toLowerCase();
  const phone = normalisePhone(clean(contactIn.phone, 40));
  if (name.length < 2 || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Missing or invalid contact details" }, { status: 422 });
  }

  const answersIn = (body.answers ?? {}) as Record<string, unknown>;
  const answers: Record<string, string> = {};
  for (const [id, options] of allowed) {
    const v = clean(answersIn[id]);
    if (v && options.has(v)) answers[id] = v;
  }

  const attrIn = (body.attribution ?? {}) as Record<string, unknown>;
  const attribution: Record<string, string> = {};
  for (const [k, v] of Object.entries(attrIn)) {
    if (/^[a-z_]{2,20}$/.test(k)) attribution[k] = clean(v, 500);
  }

  const eventId = clean(body.eventId, 80) || crypto.randomUUID();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined;
  const userAgent = req.headers.get("user-agent") || undefined;

  const lead = {
    source: "ATO debt landing page",
    submittedAt: new Date().toISOString(),
    name,
    firstName: name.split(/\s+/)[0],
    phone,
    email,
    answers,
    attribution,
    eventId,
  };

  const tasks: Promise<unknown>[] = [];

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    tasks.push(
      fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) }).then((r) => {
        if (!r.ok) throw new Error(`Lead webhook responded ${r.status}`);
      }),
    );
  } else {
    // No CRM connected yet: keep the lead in the server logs so it isn't lost.
    console.warn("[lead] LEAD_WEBHOOK_URL is not set. Lead received:", JSON.stringify(lead));
  }

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const capiToken = process.env.META_CAPI_TOKEN;
  if (pixelId && capiToken) {
    const [fn, ...rest] = name.toLowerCase().split(/\s+/);
    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "website",
          event_source_url: attribution.page,
          user_data: {
            em: [sha256(email)],
            ph: [sha256(`61${phone.slice(1)}`)],
            fn: [sha256(fn)],
            ...(rest.length ? { ln: [sha256(rest[rest.length - 1])] } : {}),
            country: [sha256("au")],
            client_ip_address: ip,
            client_user_agent: userAgent,
            fbp: attribution.fbp,
            fbc: attribution.fbc,
          },
          custom_data: { content_name: "ATO debt quiz", content_category: answers.atoDebt },
        },
      ],
      ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
    };
    tasks.push(
      fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(capiToken)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(async (r) => {
        if (!r.ok) console.error("[lead] Meta CAPI error", r.status, await r.text());
      }),
    );
  }

  const results = await Promise.allSettled(tasks);
  const webhookFailed = webhook && results[0]?.status === "rejected";
  if (webhookFailed) {
    console.error("[lead] Webhook failed:", (results[0] as PromiseRejectedResult).reason, JSON.stringify(lead));
    return NextResponse.json({ ok: false, error: "Could not save your details" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
