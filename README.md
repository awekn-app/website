# awekn.com

The marketing website for **awekn** — a premium app for serious lifters (bodybuilding + powerlifting), live on the App Store. Separate repo from the mobile app (`/Users/areeb/awekn`).

Live: https://awekn.com · App Store: https://apps.apple.com/in/app/awekn-lifting-gym-log-diet/id6762414034

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**, deployed on **Vercel** (push `main` -> production; push a branch -> a preview deploy).
- **Typography:** **Inter** (the app's typeface, light weights, tabular numerals) + **Instrument Serif** italic for signature words, self-hosted via `next/font`.
- **WebGL / 3D:** `three` + `@react-three/fiber` (v9) for the `SteelScene` machined-ring (poster fallback on phones).
- **Motion:** `gsap` (power-on + scroll-linked reveals) + `lenis` (smooth scroll).
- Analytics: `@vercel/analytics` + `@vercel/speed-insights` (cookieless).

## Design — matched to the app

The site wears the iOS/Android app's identity so the two feel like one world (see `constants/colors.ts` in the app repo and `docs/WEBSITE_APP_THEME_MATCH_PLAN.md`):

- **Near-black `#0C0C0C` canvas** (the app's dark theme), never pure black, never colored fog.
- **Depth from light, not color:** an additive near-white "pool of light" behind the hero (`CosmicBackground` + the static `.bg-fallback`), plus one faint emerald breath. A colored halo on near-black reads as a dark hole, so every glow is additive white/emerald.
- **Emerald `#34D399` is the one accent** (the app's universal signal: streaks, active rings, dots, completion, the scroll bar). Amber `#E0B054` is the rare second signal. No red, no purple, no gold.
- **Silver + white bloom** on hero type (the app's 3-layer text-shadow + silver-sheen wordmark). Lowercase wordmark, positive tracking.

**Mobile-first:** the aurora and the 3D steel scene create *no WebGL context* on phones / low-end / reduced-motion devices — they drop to the painted `.bg-fallback` field / CSS posters so a phone stays fast.

Key interactive pieces (in `src/app/components/`): `LiveSet` (an operable workout set-row), `StrengthCurve` (a scrubbable e1RM chart), `ConsistencyOrb`, `SteelScene` (3D, poster fallback), `LiquidGlass` (real Apple-style refraction), `LiquidWordmark` (silver-sheen), `CosmicBackground` (the living pool-of-light aurora). Motion lives in `src/app/lib/useMotion.ts`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (must pass before deploy)
```

## Routes

`/` (homepage) · `/privacy` · `/terms` · `/delete-account` · `/opengraph-image` (generated OG card).
