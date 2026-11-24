import { NextResponse, type NextRequest } from "next/server";
import { sendToMetaCapi } from "@/lib/metaCapi";
import { checkAuMobile, checkEmail, checkName, formatAuMobile, splitName, toE164 } from "@/lib/validation";
import { AMOUNT, LOAN_TYPE, QUIZ_STEPS, STATES, cleanAbn, detailValue, fmtAbn, money, optText, outcomeFor, type ChoiceKey } from "@/lib/expansionQuiz";

/**
 * Receives a completed Expansion quiz (version 3, same contract as the ATO page's quiz).
 *  1. Re-validates everything with the same rules as the browser (src/lib/validation.ts)
 *     and silently drops honeypot-filled bot submissions.
 *  2. POSTs the lead to LEAD_WEBHOOK_URL: the GoHighLevel "Inbound Webhook" workflow trigger.
 *     The payload is flat (one key per field) so every value is easy to map in GHL.
 *  3. Sends a Lead event to the Meta Conversions API (only if META_CAPI_TOKEN is set), deduplicated
 *     against the browser pixel's Lead event through the shared event_id. The browser also sends the
 *     Lead through the CAPI relay (src/lib/track.ts), which is the live server-side path.
 * The quiz moves on to the calendar whatever this returns (except a 422 the visitor can fix).
 */

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function parseAttribution(raw: unknown) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries((raw ?? {}) as Record<string, unknown>)) {
    if (/^[a-z_]{2,20}$/.test(k)) out[k] = clean(v, 500);
  }
  return out;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field; pretend it worked.
  if (clean(body.company)) return NextResponse.json({ ok: true });
  if (body.version !== 3) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const c = (body.contact ?? {}) as Record<string, unknown>;
  const first = clean(c.first_name, 40);
  const last = clean(c.last_name, 40);
  const name = checkName(`${first} ${last}`);
  const phone = checkAuMobile(clean(c.phone, 40));
  const email = checkEmail(clean(c.email, 254));
  if (!first || !last || !name.ok || !phone.ok || !email.ok) {
    const error = !first || !last ? "Please add your first and last name." : !name.ok ? name.error : !phone.ok ? phone.error : !email.ok ? email.error : "";
    return NextResponse.json({ ok: false, error }, { status: 422 });
  }

  // Answers: only values that exist in the quiz are accepted
  const ain = (body.answers ?? {}) as Record<string, unknown>;
  const answers: Partial<Record<ChoiceKey, string>> = {};
  for (const s of QUIZ_STEPS) {
    if (s.type !== "choice") continue;
    const v = clean(ain[s.key]);
    if (v && s.opts.some((o) => optText(o) === v)) answers[s.key] = v;
  }
  const amt = Number(ain.loan_amount);
  const amount = Number.isFinite(amt) ? Math.min(AMOUNT.max, Math.max(AMOUNT.min, Math.round(amt / AMOUNT.step) * AMOUNT.step)) : AMOUNT.start;

  const b = (body.business ?? {}) as Record<string, unknown>;
  const businessName = clean(b.name, 160);
  const abn = cleanAbn(clean(b.abn, 20)) ?? "";
  const state = STATES.includes(clean(b.state, 4)) ? clean(b.state, 4) : "";

  const attribution = parseAttribution(body.attribution);
  const eventId = clean(body.eventId, 80) || crypto.randomUUID();
  const { firstName, lastName } = splitName(name.value);
  const phoneE164 = toE164(phone.value);
  const outcome = outcomeFor(answers);

  const tags = ["expansion-quiz", "meta-ads", outcome === "Good fit" ? "good-fit" : "review"];
  if (answers.property_owner === "No") tags.push("no-property");

  const asked = QUIZ_STEPS.filter((s) => s.type === "choice" && answers[s.key as ChoiceKey]);
  const lead: Record<string, string> = {
    source: "Expansion landing page",
    quiz: "Expansion quiz (v3)",
    submitted_at: new Date().toISOString(),
    full_name: `${firstName} ${lastName}`,
    first_name: firstName,
    last_name: lastName,
    email: email.value,
    phone: phoneE164,
    phone_local: formatAuMobile(phone.value),
    country: "AU",
    state,
    // Same field names as the GHL quiz (FIELD_MAP in the Expansion quiz code)
    loan_type: LOAN_TYPE,
    loan_amount: money(amount),
    monthly_revenue: answers.monthly_revenue ?? "",
    trading_time: answers.trading_time ?? "",
    detail_1: detailValue("detail_1", answers.detail_1),
    detail_2: detailValue("detail_2", answers.detail_2),
    property_owner: answers.property_owner ?? "",
    credit_history: answers.credit_history ?? "",
    business_name: businessName,
    abn,
    outcome,
    // Plain answers to the two Expansion questions, for reporting
    expansion_purpose: answers.detail_1 ?? "",
    expansion_plan_stage: answers.detail_2 ?? "",
    quiz_summary: [
      `How much do you need to grow? → ${money(amount)}`,
      ...asked.map((s) => `${s.q} → ${answers[s.key as ChoiceKey]}`),
      `Business → ${businessName || "-"}${abn ? ` (ABN ${fmtAbn(abn)})` : ""}${state ? `, ${state}` : ""}`,
      `Outcome → ${outcome}`,
    ].join("\n"),
    tags: tags.join(","),
    utm_source: attribution.utm_source ?? "",
    utm_medium: attribution.utm_medium ?? "",
    utm_campaign: attribution.utm_campaign ?? "",
    utm_content: attribution.utm_content ?? "",
    utm_term: attribution.utm_term ?? "",
    fbclid: attribution.fbclid ?? "",
    landing_page: attribution.page ?? "",
    referrer: attribution.referrer ?? "",
    event_id: eventId,
  };

  // Every completed quiz is a Lead (matches the browser pixel's Lead event)
  const meta = sendToMetaCapi(
    {
      eventName: "Lead",
      eventId,
      email: email.value,
      phoneE164,
      firstName,
      lastName,
      attribution,
      customData: { content_name: "Expansion quiz", content_category: LOAN_TYPE, lead_outcome: outcome === "Good fit" ? "good_fit" : "review" },
    },
    req,
  );

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    // No CRM connected: keep the lead in the server logs so it isn't lost.
    console.warn("[lead] LEAD_WEBHOOK_URL is not set. Lead received:", JSON.stringify(lead));
    await meta;
    return NextResponse.json({ ok: true, outcome });
  }
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}: ${(await res.text()).slice(0, 300)}`);
  } catch (e) {
    await meta;
    console.error("[lead] Webhook failed, lead NOT saved:", e, JSON.stringify(lead));
    return NextResponse.json({ ok: false, error: "Could not save your details. Please try again." }, { status: 502 });
  }
  await meta;
  return NextResponse.json({ ok: true, outcome });
}
