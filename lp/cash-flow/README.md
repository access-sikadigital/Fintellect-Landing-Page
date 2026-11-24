# Fintellect — Cash Flow landing page

Live: https://fintellect-lp-cash-flow.vercel.app (Vercel project `fintellect-lp-cash-flow`, Root Directory `lp/cash-flow`).

Self-contained copy of the ATO Debt page (repo root). Same design, layout, quiz component, tracking and funnel;
only the words, quiz and theme images change.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run lint
```

## Sources

- Copy: Google Doc "Fintellect – Business Lending Landing Pages & Quizzes", tab "Cash Flow", restructured into the ATO page's sections.
- Quiz: "Quiz code – Cash Flow (paste into GHL) v2" (latest GHL version). Ported to `src/lib/quiz.ts`.

## Where things live

- Page: `src/components/latest/LatestLanding.tsx`
- Quiz steps, review flags, outcome: `src/lib/quiz.ts` (`LOAN_TYPE = "Cash flow"`)
- Quiz UI: `src/components/latest/LatestQuiz.tsx`
- Lead endpoint: `src/app/api/lead/route.ts` (v3 payload only)
- Funnel: `/` → `/calendar-booking` (GHL calendar `8RpEpjHvlXdqKf6jyLGN`) → `/calendar-booking/thank-you` (fires Schedule)

## Quiz rules

- Every completed quiz goes to the calendar. Outcome (`Good fit` / `Review`) is sent to GHL and Meta only.
- Review answers: revenue under $6k, trading under 12 months, defaults/judgments/bankruptcy.
- The GHL quiz also ends the quiz on "Under 6 months" trading (exit). Not applied here, so those leads still book (marked Review).
- If saving the lead fails, the visitor still reaches the calendar.

## Lead webhook payload (GHL)

Flat JSON, same keys as the GHL Cash Flow quiz's FIELD_MAP: `first_name`, `last_name`, `full_name`, `email`, `phone` (+61…),
`phone_local`, `loan_type` ("Cash flow"), `loan_amount`, `detail_1` ("What's putting pressure on cash flow? …"),
`detail_2` ("How soon do you need the funds? …"), `monthly_revenue`, `trading_time`, `property_owner`, `credit_history`,
`business_name`, `abn`, `state`, `outcome`, `quiz_summary`, `tags` (`cash-flow-quiz`, `meta-ads`, `good-fit`/`review`,
`no-property`, `urgent`), `utm_*`, `fbclid`, `landing_page`, `referrer`, `event_id`.

## Env vars (Vercel)

| Env var | Status |
| --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | Set (2584270148685362) |
| `NEXT_PUBLIC_SITE_URL` | Set (https://fintellect-lp-cash-flow.vercel.app) |
| `LEAD_WEBHOOK_URL` | **Not set.** Until it is, leads only go to the Vercel logs. |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`, `NEXT_PUBLIC_BING_VERIFICATION` | Not set (accounts to be created) |

CAPI goes through the shared relay `https://fintellect-capi.vercel.app/api/capi` (`src/lib/track.ts`), same as the ATO page.

## Before ads run (TO CONFIRM)

1. Case study is a **placeholder** (Geelong landscaper, $80K line of credit). It is labelled as one on the page. Replace with a real, de-identified deal.
2. Images that need a real, on-theme photo: hero (`fit-business-owner.webp`), case study background (`ato/route-business-loan.jpg`), final call to action (`final-suburbs.webp`).
3. Robert to confirm bio, badges and that "No credit score impact" is accurate for the quiz.
4. GHL calendar redirect: the calendar currently sends every booking to the ATO thank-you page, so Schedule fires on the ATO site, not this one.
