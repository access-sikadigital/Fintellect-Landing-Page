# Fintellect — Expansion landing page

Live: https://fintellect-lp-expansion.vercel.app (Vercel project `fintellect-lp-expansion`, Root Directory `lp/expansion`).

A copy of the ATO Debt page (repo root) with the Expansion copy and quiz. Design, colours, fonts and layout are
identical; only words, the quiz and theme-specific images differ. Shared fixes go to the root first, then get copied here.

```bash
cd lp/expansion
npm ci
npm run dev        # http://localhost:3000
npm run build && npm run lint
```

## Where things live

- **Page copy:** `src/components/latest/LatestLanding.tsx` (from the Google Doc "Fintellect – Business Lending Landing Pages & Quizzes", tab "Expansion").
- **Quiz questions, options, Review flags:** `src/lib/expansionQuiz.ts` (ported from the GHL Expansion quiz doc). Quiz UI: `src/components/latest/LatestQuiz.tsx`.
- **Lead endpoint:** `src/app/api/lead/route.ts` (version 3 payload).
- **Funnel:** `/` → `/calendar-booking` (GHL calendar `8RpEpjHvlXdqKf6jyLGN`) → `/calendar-booking/thank-you` (fires `Schedule`).

## Quiz and leads

Amount slider ("How much do you need to grow?") → what's the money for (`detail_1`) → monthly revenue → time trading →
how far along is the plan (`detail_2`) → own property → credit issues → business (ABN lookup) → name + email → mobile.

- Every completed quiz goes to the calendar. `outcome` (Good fit / Review) is sent to GHL and Meta but never blocks booking.
  Review answers: revenue under $6k, trading under 12 months, defaults/judgments/bankruptcy. (The GHL quiz exits on
  "Under 6 months"; here it's Review only.)
- If saving the lead fails (webhook down, network), the visitor still reaches the calendar. Only a 422 (a detail to fix) stops them.
- GHL webhook payload uses the GHL quiz's field names: `loan_type` ("Expansion"), `loan_amount`, `monthly_revenue`,
  `trading_time`, `detail_1` / `detail_2` ("Question Answer", same as the GHL quiz), `property_owner`, `credit_history`,
  `business_name`, `abn`, `state`, `outcome`, plus `expansion_purpose`, `expansion_plan_stage`, contact, UTMs, `fbclid`, `event_id`.
- Tags: `expansion-quiz`, `meta-ads`, `good-fit` or `review`, `no-property`.

## Env vars (Vercel project `fintellect-lp-expansion`)

| Env var | Status |
| --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | `2584270148685362` (set) |
| `NEXT_PUBLIC_SITE_URL` | `https://fintellect-lp-expansion.vercel.app` (set) |
| `LEAD_WEBHOOK_URL` | **Not set.** Until it is, leads only go to the Vercel logs. |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_GSC_VERIFICATION` | Not set (accounts still to be created). |

Meta: `PageView`, `QuizStart`, `QuizStep`, `Lead` (+ `QualifiedLead` for good fits) and `Schedule` via the pixel, and
`Lead` / `QualifiedLead` / `Schedule` server-side through the CAPI relay `https://fintellect-capi.vercel.app/api/capi`
(shared `event_id`). All events are mirrored to GTM's `dataLayer` (`fl_lead`, `fl_schedule`, ...).

## Before ads run (TO CONFIRM)

1. **Case study is a placeholder.** The café example is made up (from the copy doc). It's labelled "Example" and
   "Illustrative example only, not a real client". Replace with a real, de-identified client Robert approves.
2. **Images needed:** hero (`/images/expansion/hero-business-owner.jpg`) and final CTA (`/images/expansion/final-cta-suburbs.jpg`)
   are neutral stand-ins. The ATO crest photos were removed.
3. **Thank-you redirect:** the GHL calendar redirects every booking to the ATO thank-you page, so `Schedule` won't fire
   on this site's thank-you page until that's fixed in GHL.
4. Robert to confirm his bio (same as the ATO page).
