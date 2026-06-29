# awekn.com - the hero barbell, reimagined CINEMATIC + AGGRESSIVE

Date: 2026-06-30
Founder ask (verbatim intent): the hero barbell near the awekn wordmark is good but calm. Make it CINEMATIC, AGGRESSIVE, "out of this world", a feeling. Whoever sees it should go "wow", and feel the urge to go lift something that heavy. Reimagine + redesign it. Think deeper, plan, execute.

## Where it is now
`HeroBarbell.tsx` - a long, loaded olympic bar (long knurled centre, 6 machined silver plates per side, collars, end caps) in a soft pool of light, with a slow ~7s sheen sweep + a gentle ~6s float. Premium and clean, but CALM. Not aggressive, not cinematic, no "wow".

## What makes it WOW (the cinematic + aggressive toolkit, all SVG + CSS, no WebGL)
The aggression must come from LIGHT, WEIGHT, and MOTION - never color (brand law: black + silver + cosmic, additive white/silver light only, no green).

1. Theatrical lighting (cinema):
   - A hard overhead SPOTLIGHT cone / volumetric god-rays raking down onto the steel.
   - Deep vignette + higher contrast so the bar reads HOT and sculpted against the dark.
   - A hot specular hit + a lens-flare style star on the brightest plate edge.
2. Weight (heavy / loaded):
   - The bar visibly WHIPS / bows under the load (the classic "this is heavy" signal). Plates follow the bent axis.
   - A heavy, dark grounding shadow; the whole thing sits with mass.
3. Atmosphere (out of this world):
   - Chalk dust / star-dust drifting up through the light beam.
   - A charged cosmic energy field: a pulsing power aura around the loaded sleeves, faint.
4. Aggressive motion:
   - A hard, FAST blade-sheen that rakes across the steel like light off a knife (not the slow gentle sweep).
   - A dramatic ENTRANCE on load: the loaded bar drops/settles into the spotlight with a subtle impact shake + a dust kick + a light flash. First impression = power.
   - Charged micro-tension (a tight, weighty pulse) instead of a soft float.

## Constraints (unchanged, enforced)
Drop-in (`use client`, default export, optional `className`, no props, wide SVG ~2.7-3:1, scales 320..1160px). Pure SVG + CSS only - no WebGL, no new deps. Black + silver + cosmic, additive white light, NO green / NO color. prefers-reduced-motion = a still, lit, dramatic frame (no shake/float/sheen). Namespaced ids (useId). No em-dashes. MOBILE-FIRST: must look cinematic AND stay fast + non-janky on a phone (heavy filters gated / simplified on small screens), and the hero must still fit one view.

## Approach (design-shotgun, then converge)
1. A workflow explores 3 BOLD cinematic directions in parallel, each a complete drop-in variant component:
   - A "The Spotlight Lift" - theatrical overhead spotlight + god-rays + chalk dust + vignette + hot specular star; bar bows under load.
   - B "Charged Monolith" - the bar as a charged cosmic object: a pulsing energy aura, faint power arcs, star-dust, intensified cosmic pool. It hums with power.
   - C "Loaded & Bending" - maximal weight + aggression: a pronounced bar whip/bend, a hard fast blade-sheen, a slam-settle entrance with a dust kick + shake. Raw heavy.
2. Render all 3 on a temporary internal compare route, screenshot, judge.
3. Pick the strongest direction and GRAFT the best ideas from the others into one final `HeroBarbell.tsx` (keep the loaded-bar geometry that already reads as a real barbell).
4. Refine + verify at desktop AND mobile via the Claude_Preview MCP (no overflow, fits the hero, fast, reduced-motion safe), clean build, no em-dashes.
5. Deploy to main (Vercel) + sync all docs/memory ([[feedback_sync_everything]]).

## Status: ABANDONED the SVG, PIVOTED to a real photo (2026-06-30)

The founder rejected every SVG/vector cinematic barbell: "it's looking like AI... not polished, totally fake... very bad. I told you to make it look very very heavy with real barbell plates, a very brutal effect, a raw feeling." THE LESSON: a vector/SVG/CSS illustration ALWAYS reads as "designed / CGI / AI", and the glossy chrome + god-rays + lens-flares + glowing auras are precisely the AI-slop tells. No amount of SVG polish makes "real / brutal / raw". REAL needs a real PHOTOGRAPH.

### What shipped instead - the REAL TITAN hero
The project already had real, brutal, isolated-on-black statue photography in `public/` (`statue-atlas.jpg`, `statue-back.jpg`, `statue-hammer.jpg`, `statue-pillar.jpg`) - the founder's own aesthetic, unused in code. Atlas straining under a crushing boulder IS "lift something impossibly heavy", far more real + brutal than any barbell drawing. Per the founder's "do what's best":
- Generated `public/statue-atlas-cut.png` with Pillow: alpha curved from the photo's OWN luminance (`alpha = level(L, 14, 78)`, rgb = contrast-boosted L), so the pure-black background becomes truly TRANSPARENT and the lit marble stays solid, trimmed to the figure. This is the key trick: a figure-on-black photo -> a clean cutout that composites onto the dark hero with NO box, NO mask, NO blend-mode hacks (mix-blend-mode: screen was a no-op - the cosmic bg is in a separate stacking context).
- Replaced the SVG `HeroBarbell` in the hero with `.ix-hero-figure` (a background-image of the cutout, high-contrast B&W for brutal, a soft cosmic halo behind). Atlas emerges from the black, crowned by the awekn wordmark.
- Deleted ALL the barbell SVG components (HeroBarbell, HeroBarbellLoaded, HeroBarbellSpotlight, HeroBarbellMonolith) + the /cine compare route.
- Verified desktop (1280) + mobile (375): no box, no overflow, value-prop + CTA above the fold, clean build, no em-dashes. Why ImageMagick failed: not installed; used Pillow. Stock barbell photos were all busy gym scenes with competitor logos (Rogue, Xenios) - not hero-grade, another reason the statue won.

The cutout technique (luminance -> alpha via Pillow) is reusable for ANY figure-on-black photo, including a real loaded-barbell shot later if the founder wants a literal barbell.
