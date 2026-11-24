# Fintellect — Stock & Supplies landing page

Live: https://fintellect-lp-stock-supplies.vercel.app (Vercel project `fintellect-lp-stock-supplies`, Root Directory `lp/stock-supplies`).

A copy of the ATO Debt page (repo root) with the same design, colours, fonts and layout. Only the words, the quiz and the
theme-specific images changed. Shared fixes go to the root first, then get copied here.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm run lint
```

## Where things live

- **Page copy:** `src/components/latest/LatestLanding.tsx`. Source: Google Doc "Fintellect – Business Lending Landing Pages & Quizzes", tab "Stock & Supplies".
- **Quiz:** questions, options and Review flags in `src/lib/stockQuiz.ts`, ported from the GHL quiz "Quiz code – Stock & Supplies (paste into GHL) v2".
  `loan_type` = "Stock & supplies"; `detail_1` = "What's the stock for?", `detail_2` = "How do you pay suppliers now?".
  The GHL version ends the quiz on "Under 6 months" trading; here that's a Review flag, because every lead goes to the calendar.
- **Lead endpoint:** `src/app/api/lead/route.ts` (version 3 payload only). Sends GHL quiz field names (`loan_type`, `loan_amount`,
  `detail_1`, `detail_2`, `monthly_revenue`, `trading_time`, `property_owner`, `credit_history`, `business_name`, `abn`, `state`, `outcome`, `utm_*`)
  plus `owns_property`, `time_trading`, `quiz_summary`, `tags` (`stock-supplies-quiz`, `good-fit`/`review`, `no-property`).
- **Funnel:** `/` → `/calendar-booking` (GHL calendar `8RpEpjHvlXdqKf6jyLGN`) → `/calendar-booking/thank-you` (fires `Schedule`).
  Every completed quiz books, Review included, and reaches the calendar even if saving the lead fails.
- **Tracking:** same as the ATO page: Meta Pixel (`PageView`, `QuizStart`, `QuizStep`, `Lead`, `QualifiedLead`, `Schedule`), CAPI relay
  `https://fintellect-capi.vercel.app/api/capi`, and `dataLayer` events (`fl_lead`, `fl_qualifiedlead`, `fl_schedule`...). See the root README for every env var.

## Env vars (Vercel)

| Var | Status |
| --- | --- |
| `NEXT_PUBLIC_META_PIXEL_ID` | `2584270148685362` |
| `NEXT_PUBLIC_SITE_URL` | `https://fintellect-lp-stock-supplies.vercel.app` |
| `LEAD_WEBHOOK_URL` | **Not set.** Until it is, leads only go to the Vercel logs. |
| `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_ID`, `NEXT_PUBLIC_GSC_VERIFICATION` | Not set (accounts to be created). |

## Before ads run (TO CONFIRM)

1. **Case study is a placeholder** (Melbourne wholesaler, $220K trade finance). It's from the copy doc, made up for layout, and labelled
   "Example for illustration only. Not a real client." on the page. Swap in a real, de-identified client Robert approves, then remove the label.
   The copy doc's "6% saved" figure was left out (unverified savings figure).
2. **Images that need a real one:** hero background and final call-to-action background (the ATO page used ATO building photos, removed here;
   now neutral handshake stand-ins), and the case study background (mortgage paperwork stand-in).
3. Robert to confirm his bio (same as the ATO page).
4. GHL calendar redirect: the calendar sends every booking to the ATO thank-you page, so bookings from this page don't fire `Schedule` here.
