import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

/**
 * Lets the other Fintellect landing pages (lp/*, separate Vercel projects) deliver their leads to the
 * same GoHighLevel inbound webhook without each project holding a copy of LEAD_WEBHOOK_URL.
 *
 * Callers send the lead object exactly as they would to the webhook, with header
 * `x-fl-forward-token: <LEAD_FORWARD_TOKEN>`. This route only forwards; it does not touch Meta.
 * Once a project has its own LEAD_WEBHOOK_URL it posts to GHL directly and stops using this.
 */
export const runtime = "nodejs";

const MAX_BYTES = 20_000;

function tokenOk(given: string | null): boolean {
  const expected = process.env.LEAD_FORWARD_TOKEN;
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  if (!tokenOk(req.headers.get("x-fl-forward-token"))) {
    return NextResponse.json({ ok: false, error: "Unauthorised." }, { status: 401 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return NextResponse.json({ ok: false, error: "Too large." }, { status: 413 });

  let lead: unknown;
  try {
    lead = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }
  if (!lead || typeof lead !== "object" || Array.isArray(lead)) {
    return NextResponse.json({ ok: false, error: "Invalid lead." }, { status: 400 });
  }
  const l = lead as Record<string, unknown>;
  if (typeof l.source !== "string" || !/landing page$/i.test(l.source) || (!l.email && !l.phone)) {
    return NextResponse.json({ ok: false, error: "Invalid lead." }, { status: 400 });
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    console.warn("[lead-forward] LEAD_WEBHOOK_URL is not set. Lead received:", raw);
    return NextResponse.json({ ok: false, error: "Webhook not configured." }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
  } catch (e) {
    console.error("[lead-forward] Webhook failed, lead NOT saved:", e, raw);
    return NextResponse.json({ ok: false, error: "Webhook failed." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
