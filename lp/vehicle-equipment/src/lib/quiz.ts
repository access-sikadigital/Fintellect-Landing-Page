/**
 * The Vehicle & Equipment quiz, ported 1:1 from the GoHighLevel quiz code
 * ("Quiz code – Vehicle & Equipment (paste into GHL) v2"): same questions, options and flags.
 * Shared by the quiz component (browser) and /api/lead (server), so both accept the same answers.
 *
 * `review: true` marks an answer that sends the lead to "Review" instead of "Good fit".
 * `exit: true` ends the quiz early without sending a lead. Not used on this page: asset finance suits
 * newer businesses, so "Under 6 months" trading is Review (not an exit) and "6 – 12 months" isn't flagged.
 * Review answers don't block booking either; they only mark the lead "Review" in GHL and Meta.
 */

export type Opt = string | { t: string; review?: boolean; exit?: boolean };
export type ChoiceKey = "detail_1" | "monthly_revenue" | "trading_time" | "detail_2" | "property_owner" | "credit_history";

export type QuizStep =
  | { key: "loan_amount"; type: "amount"; q: string; help: string }
  | { key: ChoiceKey; type: "choice"; q: string; help: string; opts: Opt[]; two?: boolean }
  | { key: "business"; type: "business"; q: string; help: string }
  | { key: "contact"; type: "contact"; q: string; help: string }
  | { key: "phone"; type: "phone"; q: string; help: string };

/** Loan type label: the red pill on step 1, GHL's loan_type field and the Meta content_category. */
export const LOAN_TYPE = "Vehicle & equipment";
/** Source name used by the GHL quiz for this lending type (kept the same so GHL reports line up). */
export const QUIZ_SOURCE = "Vehicle & Equipment quiz";
export const AMOUNT = { min: 10000, max: 1000000, step: 5000, start: 50000 };
export const STATES = ["VIC", "NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
/** ABN Lookup web services GUID (abr.business.gov.au), from the design's config. */
export const ABR_GUID = "d0e5d8bc-7013-4867-b787-5dca0e5ba826";

export const QUIZ_STEPS: QuizStep[] = [
  { key: "loan_amount", type: "amount", q: "How much is the vehicle or equipment?", help: "Drag to a rough figure. It doesn't need to be exact." },
  {
    key: "detail_1",
    type: "choice",
    q: "What are you buying?",
    help: "",
    opts: ["Ute or van", "Truck or trailer", "Machinery or plant", "Tools, tech or fit-out", "Something else"],
  },
  {
    key: "monthly_revenue",
    type: "choice",
    q: "What's the business's average monthly revenue?",
    help: "Turnover before expenses.",
    opts: [{ t: "Under $6k", review: true }, "$6k – $10k", "$10k – $20k", "$20k – $50k", "$50k – $100k", "$100k+"],
    two: true,
  },
  {
    key: "trading_time",
    type: "choice",
    q: "How long has the business been trading?",
    help: "From when the ABN started trading.",
    opts: [{ t: "Under 6 months", review: true }, "6 – 12 months", "1 – 2 years", "2 – 3 years", "3+ years"],
    two: true,
  },
  {
    key: "detail_2",
    type: "choice",
    q: "New or used?",
    help: "",
    opts: ["New, from a dealer", "Used, from a dealer", "Used, private sale", "Not sure yet"],
  },
  {
    key: "property_owner",
    type: "choice",
    q: "Do you own property?",
    help: "Home or investment. Property can open up more lenders and better terms.",
    opts: ["Yes", "No"],
    two: true,
  },
  {
    key: "credit_history",
    type: "choice",
    q: "Any credit issues in the last two years?",
    help: "Late payments, defaults or judgments. It helps us pick the right lenders.",
    opts: ["None", "A few late payments", { t: "Defaults, judgments or bankruptcy", review: true }],
  },
  {
    key: "business",
    type: "business",
    q: "Find your business",
    help: "Search by business or trading name. We’ll fill in your ABN from the Australian Business Register.",
  },
  { key: "contact", type: "contact", q: "Where should we send your options?", help: "We only use this to contact you about your enquiry." },
  { key: "phone", type: "phone", q: "What's the best mobile to reach you on?", help: "Robert will call from a mobile number." },
];

export const optText = (o: Opt) => (typeof o === "string" ? o : o.t);
export const optReview = (o: Opt) => typeof o !== "string" && !!o.review;

export function money(n: number) {
  return n >= 1000000 ? "$1m+" : "$" + n.toLocaleString("en-AU");
}

/** ABN checksum (ATO algorithm). Returns the 11 digits, "" when empty, or null when invalid. */
export function cleanAbn(v: string): string | null {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  if (d.length !== 11) return null;
  const w = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  let s = 0;
  for (let k = 0; k < 11; k++) s += (+d[k] - (k === 0 ? 1 : 0)) * w[k];
  return s % 89 === 0 ? d : null;
}
export const fmtAbn = (a: string) => {
  const d = String(a || "").replace(/\D/g, "");
  return d.length === 11 ? `${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}` : d;
};

/** "Good fit" unless any picked answer is flagged for review. */
export function outcomeFor(answers: Partial<Record<ChoiceKey, string>>): "Good fit" | "Review" {
  for (const s of QUIZ_STEPS) {
    if (s.type !== "choice") continue;
    const picked = answers[s.key];
    const o = s.opts.find((x) => optText(x) === picked);
    if (o && optReview(o)) return "Review";
  }
  return "Good fit";
}
