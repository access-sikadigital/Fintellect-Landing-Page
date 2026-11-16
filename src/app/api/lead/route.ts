import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { NO_PROPERTY, quizSteps } from "@/lib/content";
import { checkAuMobile, checkEmail, checkName, formatAuMobile, splitName, toE164 } from "@/lib/validation";
import { AMOUNT, ATO_STEPS, LOAN_TYPE, STATES, cleanAbn, fmtAbn, money, optText, outcomeFor, type ChoiceKey } from "@/lib/atoQuiz";

/**
 * Receives a completed quiz.
 *  1. Re-validates everything with the same rules as the browser (src/lib/validation.ts)
 *     and silently drops honeypot-filled bot submissions.
 *  2. POSTs the lead to LEAD_WEBHOOK_URL: the GoHighLevel "Inbound Webhook" workflow trigger.
 *     The payload is flat (one key per field) so every value is easy to map in GHL.
 *  3. Sends a Lead event to the Meta Conversions API, deduplicated against the
 *     browser pixel's Lead event through the shared event_id.
 */

const steps = quizSteps.flatMap((s) => (s.kind === "choice" ? [s] : []));
const allowed = new Map(steps.map((s) => [s.id, new Set(s.options)] as const));

/** Quiz step id -> payload key in GHL (snake_case, readable in the workflow mapper). */
const ANSWER_KEYS: Record<string, string> = {
  atoDebt: "ato_debt_amount",
  atoStatus: "ato_status",
  property: "owns_property",
  propertyValue: "property_value",
  mortgage: "mortgage_owing",
  trading: "time_trading",
  structure: "business_structure",
  lodgements: "lodgements_up_to_date",
  state: "state",
};

const sha256 = (v: string) => createHash("sha256").update(v.trim().toLowerCase()).digest("hex");
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

  // The LATEST design's quiz (amount slider, revenue, ABN lookup...) sends version 3
  if (body.version === 3) return handleV3(body, req);

  const contactIn = (body.contact ?? {}) as Record<string, unknown>;
  const name = checkName(clean(contactIn.name, 120));
  const phone = checkAuMobile(clean(contactIn.phone, 40));
  const email = checkEmail(clean(contactIn.email, 254));
  if (!name.ok || !phone.ok || !email.ok) {
    const error = !name.ok ? name.error : !phone.ok ? phone.error : !email.ok ? email.error : "";
    return NextResponse.json({ ok: false, error }, { status: 422 });
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

  const { firstName, lastName } = splitName(name.value);
  const eventId = clean(body.eventId, 80) || crypto.randomUUID();
  const phoneE164 = toE164(phone.value);

  const tags = ["ato-debt-quiz", "meta-ads"];
  if (answers.property === NO_PROPERTY) tags.push("no-property");
  if (answers.atoStatus === "I've had a director penalty notice") tags.push("dpn");

  // Flat payload for the GHL Inbound Webhook trigger
  const lead: Record<string, string> = {
    source: "ATO debt landing page",
    submitted_at: new Date().toISOString(),
    full_name: [firstName, lastName].filter(Boolean).join(" "),
    first_name: firstName,
    last_name: lastName,
    email: email.value,
    phone: phoneE164, // +61412345678
    phone_local: formatAuMobile(phone.value), // 0412 345 678
    country: "AU",
    ...Object.fromEntries(Object.entries(ANSWER_KEYS).map(([id, key]) => [key, answers[id] ?? ""])),
    quiz_summary: steps
      .filter((s) => answers[s.id])
      .map((s) => `${s.question} → ${answers[s.id]}`)
      .join("\n"),
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

  const meta = sendToMetaCapi({ email: email.value, phoneE164, firstName, lastName, eventId, answers, attribution }, req);

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    // No CRM connected: keep the lead in the server logs so it isn't lost.
    console.warn("[lead] LEAD_WEBHOOK_URL is not set. Lead received:", JSON.stringify(lead));
    await meta;
    return NextResponse.json({ ok: true });
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
    return NextResponse.json({ ok: false, error: "Could not save your details." }, { status: 502 });
  }

  await meta;
  return NextResponse.json({ ok: true });
}

/* ------------------------------------------------------------------ */
/* Meta Conversions API                                                */
/* ------------------------------------------------------------------ */

type CapiLead = {
  email: string;
  phoneE164: string;
  firstName: string;
  lastName: string;
  eventId: string;
  answers: Record<string, string>;
  attribution: Record<string, string>;
};

async function sendToMetaCapi(lead: CapiLead, req: NextRequest) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const capiToken = process.env.META_CAPI_TOKEN;
  if (!pixelId || !capiToken) return;
  const payload = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: lead.eventId,
        action_source: "website",
        event_source_url: lead.attribution.page,
        user_data: {
          em: [sha256(lead.email)],
          ph: [sha256(lead.phoneE164.replace(/\D/g, ""))],
          fn: [sha256(lead.firstName)],
          ...(lead.lastName ? { ln: [sha256(lead.lastName.split(/\s+/).pop() ?? "")] } : {}),
          country: [sha256("au")],
          client_ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || undefined,
          client_user_agent: req.headers.get("user-agent") || undefined,
          fbp: lead.attribution.fbp,
          fbc: lead.attribution.fbc,
        },
        custom_data: { content_name: "ATO debt quiz", content_category: lead.answers.atoDebt },
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
    if (!r.ok) console.error("[lead] Meta CAPI error", r.status, await r.text());
  } catch (e) {
    console.error("[lead] Meta CAPI failed", e);
  }
}

/* ------------------------------------------------------------------ */
/* Version 3: the LATEST design's ATO debt quiz                        */
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
  for (const s of ATO_STEPS) {
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

  const tags = ["ato-debt-quiz", "meta-ads", outcome === "Good fit" ? "good-fit" : "review"];
  if (answers.property_owner === "No") tags.push("no-property");
  if (answers.detail_1 === "Director penalty or garnishee notice") tags.push("dpn");

  const asked = ATO_STEPS.filter((s) => s.type === "choice" && answers[s.key as ChoiceKey]);
  const lead: Record<string, string> = {
    source: "ATO debt landing page",
    quiz: "ATO Debt quiz (v3)",
    submitted_at: new Date().toISOString(),
    full_name: `${firstName} ${lastName}`,
    first_name: firstName,
    last_name: lastName,
    email: email.value,
    phone: phoneE164,
    phone_local: formatAuMobile(phone.value),
    country: "AU",
    state,
    // existing GHL fields (same keys as before, so the current workflow mapping keeps working)
    ato_debt_amount: money(amount),
    ato_status: answers.detail_1 ?? "",
    owns_property: answers.property_owner ?? "",
    time_trading: answers.trading_time ?? "",
    lodgements_up_to_date: answers.detail_2 ?? "",
    property_value: "",
    mortgage_owing: "",
    business_structure: "",
    // new in this quiz
    monthly_revenue: answers.monthly_revenue ?? "",
    credit_history: answers.credit_history ?? "",
    business_name: businessName,
    abn,
    loan_type: LOAN_TYPE,
    outcome,
    quiz_summary: [
      `Roughly how much do you owe the ATO? → ${money(amount)}`,
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

  // Like the design: the Lead conversion only fires for "Good fit" answers
  const meta =
    outcome === "Good fit"
      ? sendToMetaCapi({ email: email.value, phoneE164, firstName, lastName, eventId, answers: { atoDebt: LOAN_TYPE }, attribution }, req)
      : Promise.resolve();

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
