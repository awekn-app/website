import type { NextConfig } from "next";
import path from "node:path";

// SEC-16 (2026-09-24): security headers on every response. The site had none: /reset-password
// holds a live recovery token in the page and could be framed (clickjacking), and nothing
// restricted where scripts could load from or where data could be sent.
// Next's App Router hydrates with inline scripts, so script-src keeps 'unsafe-inline' (a
// nonce-based CSP needs per-request middleware; tracked as a follow-up). Everything else is
// tight: no framing, no plugins, data only to our Supabase project.
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  // production only: Safari applies it to http://localhost too (Chrome exempts localhost), which
  // upgraded the dev server's CSS to https and left the page unstyled in the iOS Simulator
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  // the app screens (public/app, real captures at 3x): AVIF first, WebP after, at 90 so the UI's
  // hairlines and small type stay crisp on a retina phone
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
  },
  // Pin the workspace root to THIS folder. A stray package-lock.json in the
  // home dir made Turbopack infer /Users/areeb as the root, which crashed HMR
  // in a reload loop ("Resource path needs to be on project filesystem").
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
