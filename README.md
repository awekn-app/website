# awekn.com

The marketing website for **awekn** — a premium app for serious lifters (bodybuilding + powerlifting), live on the App Store. Separate repo from the mobile app (`/Users/areeb/awekn`).

Live: https://awekn.com · App Store: https://apps.apple.com/in/app/awekn-lifting-gym-log-diet/id6762414034

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**, deployed on **Vercel** (push `main` → production; push a branch → a preview deploy).
- **WebGL / 3D:** `three` + `@react-three/fiber` (v9) + `@shadergradient/react` (the living cosmic gradient + the 3D steel scene).
- **Motion:** `gsap` (power-on + scroll-linked reveals) + `lenis` (smooth scroll).
- Analytics: `@vercel/analytics` + `@vercel/speed-insights` (cookieless).

## Design — "THE INSTRUMENT"

A from-scratch, effect-heavy rebuild themed to awekn's **cosmic** brand: **silver + black + a little blood-red** (`#B5384C`), never gold. Emerald (`#34D399`) is reserved for set-completion only. The wordmark is thin + silver. See `docs/WEBSITE_REDESIGN_PLAN.md` and `docs/DESIGN_SKILLS.md` (the 7 design references that drive it).

**Mobile-first:** the full-screen ShaderGradient and the 3D steel scene create *no WebGL context* on phones / low-end / reduced-motion devices — they drop to painted/CSS posters so a phone stays fast.

Key interactive pieces (in `src/app/components/`): `LiveSet` (an operable workout set-row), `StrengthCurve` (a scrubbable e1RM chart), `ConsistencyOrb`, `SteelScene` (3D), `LiquidGlass` (real Apple-style refraction), `LiquidWordmark`, `CosmicBackground`. Motion lives in `src/app/lib/useMotion.ts`.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (must pass before deploy)
```

## Routes

`/` (homepage) · `/privacy` · `/terms` · `/delete-account` · `/opengraph-image` (generated OG card).
