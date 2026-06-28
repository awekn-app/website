import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// Type system, self-hosted via next/font (zero layout shift, no render-blocking
// @import). Inter is THE app typeface (constants/colors.ts + the app's whole UI),
// at light weights, with the loved Instrument Serif italic for signature words.
// Every numeral is Inter with tabular-nums (the app never uses a mono).
const display = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const SITE = "https://awekn.com";
const APP_STORE = "https://apps.apple.com/in/app/awekn-lifting-gym-log-diet/id6762414034";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "awekn . Lifting, Gym Log & Diet",
  description:
    "A chronicle of every rep, every meal, every day you return to the iron. Bodybuilding and powerlifting, an honest consistency score, offline-first, on your device first and kept there forever.",
  keywords: [
    "workout tracker", "gym log", "bodybuilding app", "powerlifting app",
    "lifting tracker", "workout log", "diet tracker", "macro tracker",
    "strength tracker", "e1RM", "DOTS", "consistency score",
  ],
  applicationName: "awekn",
  authors: [{ name: "awekn" }],
  alternates: { canonical: SITE },
  openGraph: {
    title: "awekn . Lifting, Gym Log & Diet",
    description:
      "Training is a kind of devotion. A chronicle of every rep, every meal, every day you return to the iron.",
    type: "website",
    url: SITE,
    siteName: "awekn",
  },
  twitter: {
    card: "summary_large_image",
    title: "awekn . Lifting, Gym Log & Diet",
    description: "Training is a kind of devotion.",
  },
  appleWebApp: { capable: true, title: "awekn", statusBarStyle: "black-translucent" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0C0C0C",
  colorScheme: "dark",
};

// JSON-LD: a SoftwareApplication so the listing can rich-snippet in search.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "awekn",
  applicationCategory: "HealthApplication",
  operatingSystem: "iOS",
  description:
    "Bodybuilding and powerlifting tracker with an honest consistency score, offline-first and private.",
  url: SITE,
  downloadUrl: APP_STORE,
  offers: {
    "@type": "Offer",
    price: "5.99",
    priceCurrency: "USD",
    description: "awekn Pro, 7-day free trial. Prices vary by region.",
  },
  publisher: { "@type": "Organization", name: "awekn", url: SITE },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
