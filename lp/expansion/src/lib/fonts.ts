import localFont from "next/font/local";

/**
 * Brand Guidelines, section 03.
 * Inter — body, CTA, subtitles, labels. Fraunces — titles and quotes.
 * Both ship as variable fonts, so the full weight range comes from one file each.
 */
export const inter = localFont({
  src: [{ path: "../assets/fonts/Inter-Variable.woff2", style: "normal" }],
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

export const fraunces = localFont({
  src: [{ path: "../assets/fonts/Fraunces-Variable.woff2", style: "normal" }],
  variable: "--font-fraunces",
  display: "swap",
  weight: "100 900",
});
