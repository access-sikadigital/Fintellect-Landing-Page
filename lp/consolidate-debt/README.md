# Fintellect: Consolidate Debt landing page

Meta-ads landing page for business owners juggling several business debts. Built by Sika Digital.
Self-contained Next.js app, copied from the ATO Debt page at the repo root (same design, tracking and funnel);
only the words, the quiz and the theme images differ.

- **Live:** https://fintellect-lp-consolidate-debt.vercel.app
- **Vercel project:** `fintellect-lp-consolidate-debt` (Root Directory `lp/consolidate-debt`)

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run lint
```

## Where things live

- **Page copy:** `src/components/latest/LatestLanding.tsx`. Source: Google Doc "Fintellect – Business Lending Landing Pages & Quizzes", tab "6. Consolidate Debt", restructured into the ATO page's sections.
- **Quiz questions:** `src/lib/quiz.ts`, ported from the GHL quiz doc "Quiz code – Consolidate Debt (paste into GHL) v2". `loan_type` = "Consolidate debt", `detail_1` = "What debts are you juggling?", `detail_2` = "Are repayments up to date right now?".
- **Quiz UI:** `src/components/latest/LatestQuiz.tsx` (same as the ATO page).
- **Lead endpoint:** `src/app/api/lead/route.ts` (v3 handler only).

## Funnel

`/` (landing + quiz) → `/calendar-booking` (Robert's GHL calendar `8RpEpjHvlXdqKf6jyLGN`) → `/calendar-booking/thank-you` (fires `Schedule`).

- **Everyone books.** Every completed quiz goes to the calendar. The outcome (`Good fit` / `Review`) is sent to GHL and Meta (`lead_outcome`) but never blocks booking. The GHL quiz ends early on "Under 6 months" trading; here that answer is a Review flag instead.
- If saving the lead fails (webhook down, 5xx, network), the visitor still reaches the calendar. Only a 422 (a detail they need to fix) stops them.
- Lead payload to GHL uses the GHL quiz field names: `loan_type`, `loan_amount`, `detail_1`, `detail_2` ("Question Answer"), `debts_juggling`, `repayments_up_to_date`, `monthly_revenue`, `trading_time`, `property_owner`, `credit_history`, `business_name`, `abn`, `state`, `outcome`, contact fields, `quiz_summary`, `tags`, UTMs, `fbclid`, `event_id`.
- Tracking is identical to the ATO page: Meta Pixel (`PageView`, `QuizStart`, `QuizStep`, `Lead`, `QualifiedLead`, `Schedule`), the CAPI relay `https://fintellect-capi.vercel.app/api/capi`, and GTM `dataLayer` events (`fl_lead`, `fl_qualifiedlead`, `fl_schedule`, `fl_quizstart`, `fl_quizstep`).

## Env vars (Vercel project `fintellect-lp-consolidate-debt`)

| Env var | Status |
| --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | Set (`2584270148685362`) |
| `NEXT_PUBLIC_SITE_URL` | Set (`https://fintellect-lp-consolidate-debt.vercel.app`) |
| `LEAD_WEBHOOK_URL` | **Not set.** GHL inbound webhook. Until it's set, leads only go to the Vercel logs. |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`, `NEXT_PUBLIC_BING_VERIFICATION` | Not set (accounts not created yet). Each loads only when set. |
| `META_CAPI_TOKEN`, `META_TEST_EVENT_CODE`, `NEXT_PUBLIC_GHL_CALENDAR_ID` | Optional, not set (CAPI goes through the relay; calendar defaults to Robert's). |

## Before ads run (TO CONFIRM)

1. **Case study is a placeholder** (Dandenong freight business, $260K, $22.5K → $9.8K). It is made up and shown with a red "Placeholder" label. Robert to supply a real, de-identified deal or the section is removed.
2. **Images needing a real photo:** hero (`public/images/lp/hero-debts.jpg`, stock couple reviewing bills) and final call-to-action background (`final-cta-suburbs.jpg`, stock aerial). Other images are shared with the ATO page.
3. Robert to confirm his bio.
4. **Thank-you redirect:** Robert's GHL calendar redirects every booking to the ATO page's thank-you URL, so bookings from this page don't land on this page's `/calendar-booking/thank-you` and its `Schedule` event doesn't fire here.
