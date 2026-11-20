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

## Funnel

Live at `https://fintellect-lp-ato-debt.vercel.app` (naming: `fintellect-lp-<product>.vercel.app`, split tests `-2`, `-3`).

Landing page (`/`) → calendar booking (`/calendar-booking`) → thank you (`/calendar-booking/thank-you`). Old `/book` and `/thank-you` URLs redirect to these.

- **Everyone books:** all completed quizzes go to `/calendar-booking` with name, email, phone (+61…) and the UTMs/fbclid in the URL, "Review" answers included. `/enquiry-thank-you` is parked for when Review leads should skip the calendar. Every completed quiz fires `Lead` (pixel + CAPI) with `lead_outcome` = `good_fit` or `review`; good fits also fire custom `QualifiedLead`.
- **/calendar-booking:** Robert's GoHighLevel calendar widget (`src/components/latest/BookingCalendar.tsx`), pre-filled from the quiz. GHL creates the appointment against the same contact the quiz webhook created, so bookings, workflows and attribution stay in GHL. Calendar ID: `src/lib/funnel.ts`, override with `NEXT_PUBLIC_GHL_CALENDAR_ID`.
- **/calendar-booking → /calendar-booking/thank-you:** set by the calendar in GHL (Calendar settings → after booking → Redirect URL). It must point to `https://<site>/calendar-booking/thank-you`.
- **/calendar-booking/thank-you:** fires Meta `Schedule` once per visit (pixel + Conversions API, shared event_id).
- **Conversions API:** `Lead` and `Schedule` go server-side through the existing relay `https://fintellect-capi.vercel.app/api/capi` (Vercel project `fintellect-capi`, which holds the CAPI token; the GHL pages use it too). See `relayConversion` in `src/lib/track.ts`.

## Leads and tracking

| Env var | What it does |
| --- | --- |
| `LEAD_WEBHOOK_URL` | GoHighLevel Inbound Webhook (workflow trigger). Each completed quiz is POSTed as flat JSON: `first_name`, `last_name`, `full_name`, `email`, `phone` (+61…), `phone_local`, `ato_debt_amount`, `ato_status`, `owns_property`, `property_value`, `mortgage_owing`, `time_trading`, `business_structure`, `lodgements_up_to_date`, `state`, `quiz_summary`, `tags`, `utm_*`, `fbclid`, `landing_page`, `referrer`, `event_id`. If the webhook fails the visitor sees an error and can retry. Set in `.env.local` and in the host (e.g. Vercel) env vars. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Loads the Meta Pixel: `PageView`, `QuizStart`, `QuizStep` (custom) and `Lead`. |
| `META_CAPI_TOKEN` | Sends a server-side `Lead` to the Conversions API with hashed email/phone, deduplicated with the pixel via a shared `event_id`. |
| `META_TEST_EVENT_CODE` | Optional, for testing in Events Manager. Remove for live. |
| `NEXT_PUBLIC_GHL_CALENDAR_ID` | Optional. GHL calendar shown on `/calendar-booking` (defaults to Robert's lending review calendar). |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container (`GTM-XXXXXXX`). Funnel events are pushed to `dataLayer` as `fl_lead`, `fl_qualifiedlead`, `fl_schedule`, `fl_quizstart`, `fl_quizstep` (with `event_id`, `lead_outcome`). |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 (`G-XXXXXXXXXX`), loaded directly. Sends `generate_lead`, `qualify_lead`, `schedule_appointment`, `quiz_start`. Use this **or** a GA4 tag inside GTM, not both, or GA4 counts twice. |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID. |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Google Search Console HTML-tag verification code (the `content` value only). |
| `NEXT_PUBLIC_BING_VERIFICATION` | Bing Webmaster Tools `msvalidate.01` code (the `content` value only). |
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
