# awekn.com

The marketing website for **awekn** - a premium app for serious lifters (bodybuilding + powerlifting), live on the App Store. Separate repo from the mobile app (`/Users/areeb/awekn`).

Live: https://awekn.com · App Store: https://apps.apple.com/in/app/awekn-lifting-gym-log-diet/id6762414034

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**, deployed on **Vercel** (push `main` -> production; push a branch -> a preview deploy).
- **Typography:** **Inter** (the app's typeface, light weights, tabular numerals) + **Instrument Serif** italic for signature words, self-hosted via `next/font`.
- **No WebGL on the page:** the atmosphere and every instrument are pure CSS/SVG, so a phone stays fast and never janks. (`three`/`@react-three/fiber` linger as deps but the old 3D steel ring was retired for the year heatmap.)
- **Motion:** `gsap` (power-on + scroll-linked reveals) + `lenis` (smooth scroll).
- Analytics: `@vercel/analytics` + `@vercel/speed-insights` (cookieless).

## Design - matched to the app

The site wears the iOS/Android app's identity so the two feel like one world (see `constants/colors.ts` in the app repo and `docs/WEBSITE_APP_THEME_MATCH_PLAN.md`):

- **Near-black `#0C0C0C` canvas** (the app's dark theme), never pure black, never colored fog.
- **Depth from light, not color:** an additive near-white "pool of light" behind the hero (`CosmicBackground` + the static `.bg-fallback`), plus one faint emerald breath. A colored halo on near-black reads as a dark hole, so every glow is additive white/emerald.
- **Silver / white is the one accent for ALL chrome** (scroll bar, dots, nav, tags, the active price ring, links). Black + silver + cosmic is the signature, NOT green. Emerald `#34D399` survives only as a rare EARNED micro-signal inside the interactive cards (a completed set, a kept week, a PR dot). No red, no purple, no gold, no green chrome.
- **Silver + white bloom** on hero type (the app's 3-layer text-shadow + silver-sheen wordmark). Lowercase wordmark, positive tracking.

**Mobile-first (the priority - most visitors are on a phone):** no WebGL anywhere; the aurora is CSS and self-gates to the static painted `.bg-fallback` field on phones / reduced-motion. The hero sizes to its content, the barbell + breadth strip tighten, and the showcase pairs go single-column, so the whole top lands cleanly on a phone.

**Page structure** (`src/app/page.tsx`, v4): hero (silver wordmark + a REAL statue cutout - `.ix-hero-figure` paints `public/statue-atlas-cut.png`, Atlas straining under a crushing boulder, emerging from the black - the value-prop "lift, eat, recover. track all of it." + a breadth strip + a folded price) -> **see it work** = a guided, operable TOUR: 4 alternating story beats (each instrument introduced with a number + headline + a line of story + a "try it" hint, beside its live card), then a paired "and the math, in your hands" close -> **everything in one log** (`TracksGrid`, a compact premium tile matrix) -> two disciplines -> **the year** (`YearHeatmap`) -> private -> closing (+ price). The tour + breadth grid are the v4 rework (v3 dumped the cards in one grid with no story; v3 breadth cards looked empty). Pricing is folded into the hero/close, not a standalone section.

Operable instruments (`src/app/components/`, real app math, silver/cosmic, drag + keyboard + touch, no WebGL): `LiveSet` (log a set, live e1RM), `PlateLoader` (load a barbell, exact plate math), `ConsistencyStreak` (a clear calendar-month streak; replaced the abstract `ConsistencyOrb`), `DotsGauge` (DOTS score gauge), `RpeCalculator` (RPE -> e1RM), `StrengthCurve` (scrubbable e1RM chart), `YearHeatmap` (365-day grid; replaced the old `SteelScene` ring). Plus `LiquidGlass` (Apple-style refraction), `LiquidWordmark` (silver-sheen), `CosmicBackground` (CSS pool-of-light aurora). Motion: `src/app/lib/useMotion.ts`. The HERO image is a REAL photograph, not a vector: `public/statue-atlas-cut.png` is `statue-atlas.jpg` with its black background baked out to transparent (alpha curved from the photo's own luminance, via Pillow) so it composites onto the dark hero with no box. The lesson: vector/SVG always reads "AI / fake" for things that need to look real and brutal - use a real photo cut out on transparency. The old `HeroBarbell*` SVGs, `ConsistencyOrb.tsx`, `SteelScene.tsx` are retired/deleted.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (must pass before deploy)
```

## Routes

`/` (homepage) · `/privacy` · `/terms` · `/delete-account` · `/opengraph-image` (generated OG card).
