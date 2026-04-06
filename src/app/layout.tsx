import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "awekn — Track. Log. Analyse. Conquer.",
  description: "The only workout tracker built for serious lifters. Bodybuilding and Powerlifting modes. Offline-first. Cross-device sync. Advanced analytics.",
  keywords: "workout tracker, gym app, bodybuilding, powerlifting, fitness tracker, workout log, exercise tracker",
  openGraph: {
    title: "awekn — Track. Log. Analyse. Conquer.",
    description: "The only workout tracker built for serious lifters.",
    type: "website",
    url: "https://awekn.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
