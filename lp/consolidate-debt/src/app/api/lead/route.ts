import { NextResponse, type NextRequest } from "next/server";
import { sendToMetaCapi } from "@/lib/metaCapi";
import { checkAuMobile, checkEmail, checkName, formatAuMobile, splitName, toE164 } from "@/lib/validation";
import { AMOUNT, LOAN_TYPE, QUIZ_NAME, QUIZ_STEPS, STATES, cleanAbn, fmtAbn, money, optText, outcomeFor, questionFor, type ChoiceKey } from "@/lib/quiz";

/**
 * Receives a completed quiz.
 *  1. Re-validates everything with the same rules as the browser (src/lib/validation.ts)
 *     and silently drops honeypot-filled bot submissions.
 *  2. POSTs the lead to LEAD_WEBHOOK_URL: the GoHighLevel "Inbound Webhook" workflow trigger.
 *     The payload is flat (one key per field) so every value is easy to map in GHL.
 *  3. Sends a Lead event to the Meta Conversions API, deduplicated against the
 *     browser pixel's Lead event through the shared event_id.
 */

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill the hidden field; pretend it worked.
  if (clean(body.company)) return NextResponse.json({ ok: true });

  // The quiz sends version 3 (same request shape as the ATO page)
  if (body.version === 3) return handleV3(body, req);
  return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
}

/** Lead event for the Conversions API (same payload as before the helper moved to src/lib/metaCapi.ts). */
type CapiLead = {
  email: string;
  phoneE164: string;
  firstName: string;
  lastName: string;
  eventId: string;
  attribution: Record<string, string>;
};

const sendLeadToCapi = (lead: CapiLead, req: NextRequest) =>
  sendToMetaCapi(
    {
      eventName: "Lead",
      eventId: lead.eventId,
      email: lead.email,
      phoneE164: lead.phoneE164,
      firstName: lead.firstName,
      lastName: lead.lastName,
      attribution: lead.attribution,
      customData: { content_name: QUIZ_NAME, content_category: LOAN_TYPE },
    },
    req,
  );

/* ------------------------------------------------------------------ */
/* Version 3: the Consolidate Debt quiz                                */
/* ------------------------------------------------------------------ */

function parseAttribution(raw: unknown) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries((raw ?? {}) as Record<string, unknown>)) {
    if (/^[a-z_]{2,20}$/.test(k)) out[k] = clean(v, 500);
  }
  return out;
}

async function handleV3(body: Record<string, unknown>, req: NextRequest) {
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

  const tags = ["consolidate-debt-quiz", "meta-ads", outcome === "Good fit" ? "good-fit" : "review"];
  if (answers.property_owner === "No") tags.push("no-property");
  if (answers.detail_1 === "ATO debt") tags.push("ato-debt");
  if (answers.detail_2 === "Behind on most of them") tags.push("repayments-behind");

  const asked = QUIZ_STEPS.filter((s) => s.type === "choice" && answers[s.key as ChoiceKey]);
  const lead: Record<string, string> = {
    source: "Consolidate Debt landing page",
    quiz: "Consolidate Debt quiz (v3)",
    submitted_at: new Date().toISOString(),
    full_name: `${firstName} ${lastName}`,
    first_name: firstName,
    last_name: lastName,
    email: email.value,
    phone: phoneE164,
    phone_local: formatAuMobile(phone.value),
    country: "AU",
    state,
    // Same field names as the GHL quiz (FIELD_MAP), so one GHL workflow can map every landing page
    loan_type: LOAN_TYPE,
    loan_amount: money(amount),
    // detail_1 / detail_2 hold "Question Answer", like the GHL quiz; the _answer keys hold the answer alone
    detail_1: answers.detail_1 ? `${questionFor("detail_1")} ${answers.detail_1}` : "",
    detail_2: answers.detail_2 ? `${questionFor("detail_2")} ${answers.detail_2}` : "",
    debts_juggling: answers.detail_1 ?? "",
    repayments_up_to_date: answers.detail_2 ?? "",
    monthly_revenue: answers.monthly_revenue ?? "",
    trading_time: answers.trading_time ?? "",
    property_owner: answers.property_owner ?? "",
    credit_history: answers.credit_history ?? "",
    business_name: businessName,
    abn,
    outcome,
    quiz_summary: [
      `${QUIZ_STEPS[0].q} → ${money(amount)}`,
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
  const meta = sendLeadToCapi({ email: email.value, phoneE164, firstName, lastName, eventId, attribution }, req);

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
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
