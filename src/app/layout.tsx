import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Lexend } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import RecoveryRedirect from "./components/RecoveryRedirect";
import { SITE, APP_STORE, APP_STORE_ID } from "./lib/links";
import "./globals.css";

// The app's typeface (the whole iOS app is set in Hanken Grotesk), self-hosted via next/font:
// no render-blocking request, no layout shift.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

// The display face (docs/BRAND_REVAMP_PLAN_2026-09-28.md): the open face closest to the wordmark's own
// letters (wide, flat-cut w, a level e). Headlines only; the reading text stays Hanken like the app.
const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

const TITLE = "Awekn: Lifting, Gym Log & Diet";
const DESCRIPTION =
  "Carved, not given. Awekn is the training log for people who lift: every set and record, every meal and macro, the bodyweight trend, cardio and steps, supplements and your journal, in one place. Bodybuilding and powerlifting.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "workout tracker", "gym log", "bodybuilding app", "powerlifting app", "lifting tracker",
    "workout log", "macro tracker", "calorie counter", "strength tracker", "e1RM", "DOTS",
    "bodyweight trend",
  ],
  applicationName: "Awekn",
  authors: [{ name: "Awekn" }],
  alternates: { canonical: SITE },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: SITE, siteName: "Awekn" },
  twitter: { card: "summary_large_image", title: TITLE, description: "Carved, not given. The training log for people who lift." },
  // Safari's own "Open in the App Store" banner on iPhone (the one Apple allows; no JS)
  itunes: { appId: APP_STORE_ID },
  appleWebApp: { capable: true, title: "Awekn", statusBarStyle: "black-translucent" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
};

// JSON-LD: a SoftwareApplication so the listing can rich-snippet in search.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Awekn",
  applicationCategory: "HealthApplication",
  operatingSystem: "iOS",
  description: DESCRIPTION,
  url: SITE,
  downloadUrl: APP_STORE,
  offers: {
    "@type": "Offer",
    price: "5.99",
    priceCurrency: "USD",
    description: "Awekn Pro, 7-day free trial. Prices vary by region.",
  },
  publisher: { "@type": "Organization", name: "Awekn", url: SITE },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${hanken.variable} ${lexend.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {/* forwards a password-recovery link that lands on any path to /reset-password: keep global */}
        <RecoveryRedirect />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
