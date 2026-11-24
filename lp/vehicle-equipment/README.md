# Fintellect — Vehicle & Equipment landing page

Live: https://fintellect-lp-vehicle-equipment.vercel.app (Vercel project `fintellect-lp-vehicle-equipment`, Root Directory `lp/vehicle-equipment`).

Self-contained Next.js app copied from the ATO Debt page (repo root), which is the template. Same design, sections,
quiz component, tracking and funnel; only the words, the quiz questions and the theme images change.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run lint && npm run build
```

## Sources

- **Copy:** Google Doc "Fintellect – Business Lending Landing Pages & Quizzes", tab "Vehicle & Equipment",
  restructured into the ATO page's sections. Page: `src/components/latest/LatestLanding.tsx`.
- **Quiz:** GHL quiz code "Quiz code – Vehicle & Equipment (paste into GHL) v2". Questions, options and flags:
  `src/lib/quiz.ts` (shared by the quiz and `/api/lead`). "Under 6 months" trading is Review, not an exit;
  "6 – 12 months" isn't flagged (asset finance suits newer businesses). Review answers never block booking.

## Funnel

`/` (landing + quiz) → `/calendar-booking` (Robert's GHL calendar `8RpEpjHvlXdqKf6jyLGN`, prefilled) →
`/calendar-booking/thank-you` (fires `Schedule`, pixel + CAPI relay). Every completed quiz goes to the calendar,
even if saving the lead fails (one retry, then carries on). Only a 422 (bad name/email/phone) stops the visitor.

## Lead payload (`/api/lead`, version 3)

POSTed to `LEAD_WEBHOOK_URL` as flat JSON. Same keys as the GHL quiz's FIELD_MAP so one GHL mapping covers both:
`first_name`, `last_name`, `email`, `phone` (+61…), `loan_type` ("Vehicle & equipment"), `loan_amount`,
`detail_1` ("What are you buying? …"), `detail_2` ("New or used? …"), `monthly_revenue`, `trading_time`,
`business_name`, `abn`, `state`, `property_owner`, `credit_history`, `outcome` (Good fit / Review), `utm_*`.
Extras: `asset_type`, `asset_condition`, `quiz_summary`, `tags` (`vehicle-equipment-quiz`, `meta-ads`,
`good-fit`/`review`, `no-property`, `private-sale`), `fbclid`, `landing_page`, `referrer`, `event_id`.
Without `LEAD_WEBHOOK_URL` the lead is only written to the Vercel function logs.

## Env vars (Vercel project)

| Var | Status |
| --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | Set: `2584270148685362` |
| `NEXT_PUBLIC_SITE_URL` | Set: `https://fintellect-lp-vehicle-equipment.vercel.app` |
| `LEAD_WEBHOOK_URL` | **Not set.** GHL inbound webhook (same Landing Page webhook as ATO, or a new one) |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`, `NEXT_PUBLIC_BING_VERIFICATION` | Not set (accounts not created yet) |

Server-side `Lead`/`Schedule` go through the shared CAPI relay `https://fintellect-capi.vercel.app/api/capi`
(see `relayConversion` in `src/lib/track.ts`); no token needed in this project.

## Before ads run (TO CONFIRM)

1. **Case study is a placeholder** (Bendigo plumber, $140K, two utes). Made up for layout. The page labels it
   "Illustrative example only". Robert to supply a real, de-identified deal, then remove the label.
2. Robert to confirm the FAQ line "some lenders look at ABNs under 12 months old".
3. Robert to confirm the badges (award name, who gave it, year) and the Google rating/profile link.
4. John Sikalias's review carries a disclosure line (Sika Digital runs Fintellect's marketing). Check wording.
5. Images that need a real, on-theme photo (reused neutral ones for now):
   - How it works band: `images/ato/route-business-loan.jpg` (generic handshake)
   - Case study background: `images/ato/how-it-works-handshake.jpg` (has a small house model)
   - "From a dealer" route card: `images/ato/how-it-works-handshake.jpg`
   - "Private sale" route card and hero: `images/ve/hero-tradie-van.jpg` (stock, used twice)
   - Final CTA: `images/ve/final-cta-town.jpg` (aerial of a regional town)
6. GHL calendar redirect: the calendar sends every booking to the ATO thank-you page, so `Schedule` for this
   page fires on the ATO domain. Needs a fix in GHL (see PR).
