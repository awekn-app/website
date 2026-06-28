# awekn.com -> App-Theme Match ("same world as the app")

Date: 2026-06-29
Branch: `feature/site-app-match` (continue here, then merge to `main` -> Vercel deploys)
Goal: make awekn.com look and feel like a seamless extension of the iOS/Android app. Open the app, open the site: same canvas, same light, same green, same type, same soul.

## The problem (verified, not guessed)

1. The LIVE site (`main`, deployed) is still the OLD identity: blood-red `#B5384C` + purple/indigo nebula + warm gold + Space Grotesk + a saturated always-on ShaderGradient water-plane. That is NOT the app.
2. The "app-match" recolor (`ebf024b`) was never merged and is shallow: it only re-aliased token NAMES (`--gold`/`--blood` -> emerald) so colors flipped, but the deeper feel did not: wrong canvas value, wrong type family, wrong atmosphere model, wrong text ramp.

## Root-cause of "the gradient/feel is different"

The app does NOT use colored fog. Verified in `constants/colors.ts`, `components/ui/CosmicBackground.tsx`, and the approved v1.0.13 home mockup `mockups/home-machined-instrument/v4.html`:

- Canvas is near-black (`#0C0C0C` dark / `#141414` graphite), never pure black, never tinted.
- Depth comes from LIGHT, not color: an additive near-white radial "pool of light" sits behind the hero (`rgba(255,255,255,.12) -> .035 -> transparent`, off-center, plus a faint warm `rgba(255,176,120,.06)`). The hard law in the app: a colored halo on near-black reads as a dark hole, so atmosphere = additive white light only.
- Chroma is carried by EMERALD `#34D399` (the app's universal signal: rings, dots, completion, streak, the online dot) and by a 3-layer WHITE text-shadow bloom on hero type.
- The site does the opposite (colored nebula, red, gold), which is exactly why it feels foreign.

## Design thesis (the fix, in one line)

Port the app's "cosmic instrument-panel" design system to the web: near-black canvas, additive white pool-of-light, emerald as the single accent, white-bloom + silver-sheen hero type, Inter light with tabular numerals, glass reserved to one focal surface. Kill red, purple, gold, Space Grotesk, JetBrains Mono, and the saturated nebula.

## Exact token spec (app-true, from constants/colors.ts dark + the mockup)

- `--bg #0C0C0C`, `--bg-deep #070709`, surfaces `#161616` / `#1F1F1F`
- Text ramp (the app's exact ladder): display/primary `#FFFFFF`, body `#D4D4D4`, secondary `#737373`, tertiary `#454545`
- `--accent / --emerald #34D399`; emerald gradient fill deep->bright `#27B384 -> #3EE0A6` (mockup); emerald glow `0 0 14px rgba(52,211,153,.45)`
- `--amber #E0B054` (the app warning/"behind" signal, reserved second accent / PR moment)
- Border `rgba(255,255,255,0.05)`, hairline `rgba(255,255,255,0.06)`
- Bloom (the brand signature): outer `rgba(255,255,255,.10)` r40, mid `rgba(255,255,255,.22)` r18, core `rgba(255,255,255,.45)` r12 (app DESIGN_LANGUAGE values)
- CTA: white fill `#F5F5F5` + near-black ink `#0C0C0C` (the app's primary button), emerald only on signals/links
- Legacy aliases kept for stability and remapped to the above: `--gold -> #34D399`, `--blood -> #34D399`, `--champagne / --silver -> #FFFFFF/#E9EAF0`, `--indigo -> removed/neutral`. This auto-flips the ~80 `var(--gold)/var(--champagne)` usages in the instrument module CSS.

## File-by-file changes

1. `src/app/globals.css` (the leverage point):
   - Rewrite `:root` to the exact token spec above (canvas, text ramp, emerald, amber, bloom, CTA).
   - Replace `.bg-fallback` with the app atmosphere: near-black base + 1 to 2 additive near-white radial pools of light (off-center, like CosmicBackground `cx 34% cy 6%`) + the faint warm pool. No colored stops.
   - Remove the render-blocking top-of-file Google Fonts `@import` (Inter is self-hosted via next/font instead).
   - Recolor `.ix-*` classes: CTAs to white-fill primary + emerald signals, scroll-progress bar emerald, hairlines to app values, card frames to the PremiumCard recipe (`linear-gradient(160deg,rgba(255,255,255,.10),rgba(255,255,255,.03))` + `box-shadow:0 16px 44px rgba(0,0,0,.42),inset 0 0 0 .5px rim,inset 0 1px 0 rgba(255,255,255,.08)` + top sheen).
   - Selection stays emerald `rgba(52,211,153,.28)` (already correct).

2. `src/app/layout.tsx` (typography = half the "feel"):
   - Swap display font Space Grotesk -> Inter (weights 300/400/500/600), keep Instrument Serif (italic emphasis), drop JetBrains Mono and route `--font-numeral` to Inter with `font-variant-numeric: tabular-nums` (the app uses Inter tabular-nums for every number, never a mono).
   - Keep `themeColor #0C0C0C`, dark colorScheme.

3. `src/app/components/CosmicBackground.tsx`:
   - Replace the saturated/near-black ShaderGradient water-plane with the app's additive light model. Mobile-first: render pure-CSS additive radial pools (no WebGL) by default; the existing capability gate stays so we never ship a GL context to phones. Net effect: faster, app-true, "depth from light."

4. Hero (the SHOCK centerpiece) - `src/app/components/LiquidWordmark.tsx` + page hero:
   - Silver-sheen masked wordmark/number using the app's v1.0.13 immersive-hero recipe: `background: linear-gradient(176deg,#ffffff,#eff0f5 46%,#cbccd6 100%)` clipped to the text + the 3-layer white bloom, sitting over an additive white pool of light. Lowercase, wide letter-spacing. This is literally the app's newest hero on the web.

5. Instruments (`LiveSet`, `ConsistencyOrb`, `StrengthCurve`, `SteelScene`) + their module CSS:
   - These already read `var(--gold)/var(--champagne)`, so the token remap flips them to emerald/silver. Pass over each to confirm app-true: emerald `#34D399` for completion/earned/active, deep->bright emerald for fills, amber `#E0B054` only for "behind", white bloom on the big readouts, no red/gold left. SteelScene rim -> emerald/silver (the one machined-instrument 3D moment, matches the app's machined-instrument home).

6. `src/app/components/LiquidGlass.tsx`: keep as the ONE reserved glass surface (nav + maybe the pricing focal card), matching the app's discipline that glass is rare. Everything else uses the PremiumCard recipe.

7. Sweep: remove every `#B5384C`, indigo/purple, warm-gold, Space Grotesk, JetBrains reference across `src/app/**`. Update `README.md` to the app-match identity (it still documents blood-red).

## What will make you go "that is the app"

- The hero wordmark is the app's silver-sheen bloomed type over a near-white pool of light (not a metal-liquid red thing).
- The whole page breathes on near-black with additive white light, exactly like opening the app's home.
- Emerald is the only color that ever lights up (rings, dots, the scroll bar, completion), the app's signal language.
- Inter light + tabular numerals everywhere, lowercase wordmark: the app's typographic fingerprint.
- Cards have the app's real machined depth (gradient frame + top sheen + deep shadow), not flat web cards.

## Verification (no guessing)

- `npm run build` clean.
- Headless screenshot pass of every section at desktop + mobile widths; compare side by side against the app's home mockup `v4.html` and the app palette. Iterate until it reads as the same world.
- Mobile-first check: no WebGL context on phones / reduced-motion (founder rule, ~90% iPhone traffic); CSS posters stand in.
- No em-dashes, no emojis, lowercase wordmark, "Awekn" capital A in prose.

## Ship

- Commit on `feature/site-app-match`, merge to `main`, push -> Vercel auto-deploys awekn.com. (Founder confirms before merge to main.)

## Status: BUILT + VERIFIED (2026-06-29)

Done on `feature/site-app-match`: tokens rewritten to the exact app palette (`#0C0C0C`
canvas, app silver text ramp, emerald `#34D399` the one accent, amber `#E0B054`
reserved); `.bg-fallback` replaced with the additive pool-of-light + one emerald
breath; `CosmicBackground` rewritten from the WebGL ShaderGradient to a CSS
aurora-of-light (mobile-safe, no WebGL); fonts swapped Space Grotesk + JetBrains Mono
-> Inter (Inter tabular numerals); display type lightened toward the app heroes;
SteelScene de-indigo'd (neutral near-black + emerald/silver); README + comments synced.
`npm run build` clean (TypeScript pass, 8/8 static pages). Verified in-browser at
desktop 1280 + mobile 375 (hero pool-of-light + silver-sheen wordmark, the emerald
streak readout, BB-emerald / PL-austere discipline cards, emerald-ringed annual
pricing card + white iOS CTA). NOT merged to `main` (founder presses go-live).

## Out of scope (this pass)

- New sections/copy, testimonials, Android download wiring (Android not public yet), the SteelScene "make it a real app surface" idea. This pass is purely making the existing site wear the app's skin, flawlessly.
