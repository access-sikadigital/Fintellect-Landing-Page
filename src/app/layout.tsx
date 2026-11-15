import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { fraunces, inter } from "@/lib/fonts";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const title = "Owe the ATO? Your home could pay it out in one go | Fintellect";
const description =
  "ATO interest compounds daily and is no longer tax-deductible. If you own property, using your equity to clear the balance could take the pressure off. Check if it fits you in about a minute.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title,
  description,
  // Paid-traffic landing page: keep it out of search results so it doesn't compete with the main site.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Fintellect",
    title,
    description,
    images: [{ url: "/images/hero-home-equity.webp" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#012412",
};

const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${fraunces.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        {pixelId && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
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
