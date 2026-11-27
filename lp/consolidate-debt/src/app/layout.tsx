import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { fraunces, inter } from "@/lib/fonts";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { AttributionCapture } from "@/components/providers/AttributionCapture";
import "./globals.css";

const title = "Five lenders, five due dates. Make it one. | Fintellect";
const description =
  "Roll short-term loans, cards, the overdraft and old finance into one business loan with one repayment you can plan around. Answer a few questions to see if it could work for you.";

export const metadata: Metadata = {
  // Share images (og:image) need an absolute public URL; fall back to the live domain, never localhost
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://fintellect-lp-consolidate-debt.vercel.app"),
  title,
  description,
  // Paid-traffic landing page: keep it out of search results so it doesn't compete with the main site.
  robots: { index: false, follow: false },
  // Search Console and Bing Webmaster Tools ownership (HTML tag method); only rendered when set
  verification: {
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION } } : {}),
  },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Fintellect",
    title,
    description,
    images: [{ url: "/images/lp/hero-debts.jpg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#012412",
};

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
/** Google Tag Manager container (GTM-XXXXXXX) and Microsoft Clarity project ID. Each loads only when set. */
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;
/** Google Analytics 4 measurement ID (G-XXXXXXXXXX), loaded directly with gtag. Leave unset if GA4 is set up inside GTM instead. */
const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        {gtmId && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
          </noscript>
        )}
        <AttributionCapture />
        <SmoothScroll>{children}</SmoothScroll>
        {gtmId && (
          <Script id="gtm" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
        )}
        {gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}');`}
            </Script>
          </>
        )}
        {clarityId && (
          <Script id="clarity" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");`}
          </Script>
        )}
        {pixelId && (
          <>
            {/* Advanced matching: once the quiz contact is in this visit's storage (booking + thank-you pages), the
                pixel starts with it. Otherwise it starts empty so matchUser() in src/lib/track.ts can add it at Lead. */}
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');var u={};try{var c=JSON.parse(sessionStorage.getItem('ft-contact')||'{}'),l=function(v){return v?String(v).trim().toLowerCase():''},i=localStorage.getItem('ft-vid');if(c.email||c.phone){if(c.email)u.em=l(c.email);if(c.phone)u.ph=String(c.phone).replace(/\\D/g,'');if(c.first_name)u.fn=l(c.first_name);if(c.last_name)u.ln=l(String(c.last_name).trim().split(/\\s+/).pop());if(i)u.external_id=i}}catch(x){}fbq('init','${pixelId}',u);fbq('track','PageView');`}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img height="1" width="1" style={{ display: "none" }} alt="" src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`} />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
