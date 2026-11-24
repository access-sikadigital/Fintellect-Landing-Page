# Fintellect landing pages (one folder per page)

The repo root is the **ATO Debt** page (Vercel project `fintellect-landing-page`, live at
https://fintellect-lp-ato-debt.vercel.app). It is the template for every other page.

Each other page is a self-contained Next.js app in its own folder, deployed as its own Vercel
project with **Root Directory** set to that folder:

| Page | Folder | Vercel project / URL |
|---|---|---|
| Cash Flow | `lp/cash-flow` | fintellect-lp-cash-flow.vercel.app |
| Expansion | `lp/expansion` | fintellect-lp-expansion.vercel.app |
| Stock & Supplies | `lp/stock-supplies` | fintellect-lp-stock-supplies.vercel.app |
| Vehicle & Equipment | `lp/vehicle-equipment` | fintellect-lp-vehicle-equipment.vercel.app |
| Consolidate Debt | `lp/consolidate-debt` | fintellect-lp-consolidate-debt.vercel.app |

Funnel steps on every page: `/` (landing + quiz) → `/calendar-booking` → `/calendar-booking/thank-you`.
The root app ignores `lp/**` in tsconfig and eslint, so a page folder never breaks the ATO build.
Only edit your own folder; shared fixes go to the root first, then get copied across.
