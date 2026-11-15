# Fintellect — ATO debt landing page

Meta-ads landing page for business owners with ATO debt. Built by Sika Digital.

Next.js 16 · Tailwind CSS v4 · GSAP (ScrollTrigger, SplitText) + Lenis smooth scroll.
Brand tokens, fonts, logos and icons come from `fintellect-v2` (Fintellect Brand Guidelines 2026).

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
npm run build && npm start
```

## Where things live

- **All copy:** `src/lib/content.ts` (page sections + quiz steps).
- **Quiz:** `src/components/quiz/Quiz.tsx`. Step 1 is from the design; steps 2–10 are drafts (TO CONFIRM).
  Choosing "No, I don't own property" skips the two property questions.
- **Lead endpoint:** `src/app/api/lead/route.ts`.
- **Form validation:** `src/lib/validation.ts` (shared by the quiz and the server): name = letters, spaces, hyphens, apostrophes only; phone = Australian mobile only (04…, +61 4…); email = full address check plus typo suggestions (gmial.com → gmail.com).
- **Sections:** `src/components/sections/`.

## Leads and tracking

| Env var | What it does |
| --- | --- |
| `LEAD_WEBHOOK_URL` | GoHighLevel Inbound Webhook (workflow trigger). Each completed quiz is POSTed as flat JSON: `first_name`, `last_name`, `full_name`, `email`, `phone` (+61…), `phone_local`, `ato_debt_amount`, `ato_status`, `owns_property`, `property_value`, `mortgage_owing`, `time_trading`, `business_structure`, `lodgements_up_to_date`, `state`, `quiz_summary`, `tags`, `utm_*`, `fbclid`, `landing_page`, `referrer`, `event_id`. If the webhook fails the visitor sees an error and can retry. Set in `.env.local` and in the host (e.g. Vercel) env vars. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Loads the Meta Pixel: `PageView`, `QuizStart`, `QuizStep` (custom) and `Lead`. |
| `META_CAPI_TOKEN` | Sends a server-side `Lead` to the Conversions API with hashed email/phone, deduplicated with the pixel via a shared `event_id`. |
| `META_TEST_EVENT_CODE` | Optional, for testing in Events Manager. Remove for live. |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for social share images. |

UTM tags and `fbclid` are captured on arrival and sent with the lead.

The page is set to `noindex` because it's a paid-traffic page. Change `robots` in `src/app/layout.tsx` if it should be indexed.

## Before launch (TO CONFIRM)

1. Quiz questions 2–10 and their answer ranges (Robert).
2. Case study: `content.ts → proof.caseStudy` holds SAMPLE figures (electrical contractor, $184,000). The page says it's a real deal, so swap in Robert's real, de-identified deal before ads run.
3. A photo of Robert for the "You deal with Robert" card (the logomark is used for now).
4. Footer links point to fintellect.com.au's privacy policy and credit guide (the design said "Terms & Conditions").
5. ATO interest rate: `content.ts → gic` shows 11.51% p.a. (Oct–Dec 2026). It changes every quarter. Next change 1 Jan 2027, published mid-December.
6. Director penalty notices and super: Payday Super started 1 July 2026. Get an accountant to confirm the DPN "lockdown" rules for super before adding more detail.

Copy research (15 Nov 2026): competitor teardown of 10 AU pages plus a fact-check against ato.gov.au, ASIC RG 234 (June 2026) and Moneysmart. The credit licence is written in full ("Australian Credit Licence 515382") because RG 234 requires it.
