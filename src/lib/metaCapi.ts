import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Server-side Meta Conversions API event, deduplicated against the browser pixel
 * through the shared event_id. No-op unless NEXT_PUBLIC_META_PIXEL_ID and META_CAPI_TOKEN are set.
 */

const sha256 = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

export type CapiEvent = {
  eventName: string;
  eventId: string;
  email?: string;
  phoneE164?: string;
  firstName?: string;
  lastName?: string;
  attribution: Record<string, string>;
  customData?: Record<string, unknown>;
};

export async function sendToMetaCapi(ev: CapiEvent, req: NextRequest) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const capiToken = process.env.META_CAPI_TOKEN;
  if (!pixelId || !capiToken) return;
  const payload = {
    data: [
      {
        event_name: ev.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: ev.eventId,
        action_source: "website",
        event_source_url: ev.attribution.page,
        user_data: {
          ...(ev.email ? { em: [sha256(ev.email)] } : {}),
          ...(ev.phoneE164 ? { ph: [sha256(ev.phoneE164.replace(/\D/g, ""))] } : {}),
          ...(ev.firstName ? { fn: [sha256(ev.firstName)] } : {}),
          ...(ev.lastName ? { ln: [sha256(ev.lastName.split(/\s+/).pop() ?? "")] } : {}),
          country: [sha256("au")],
          client_ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
          client_user_agent: req.headers.get("user-agent") || undefined,
          fbp: ev.attribution.fbp,
          fbc: ev.attribution.fbc,
        },
        ...(ev.customData ? { custom_data: ev.customData } : {}),
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };
  try {
    const r = await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(capiToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000),
    });
    if (!r.ok) console.error(`[capi] ${ev.eventName} error`, r.status, await r.text());
  } catch (e) {
    console.error(`[capi] ${ev.eventName} failed`, e);
  }
}
