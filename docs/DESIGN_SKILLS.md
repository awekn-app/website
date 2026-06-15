# awekn website — design skills & effect libraries

The seven founder-supplied references that drive the awekn.com world-class rebuild (2026-06-15).
The rule: **combine all seven**, keep it **animation/effect-heavy yet best-in-world fast**, and
**match awekn's dark cosmic instrument-panel theme** (serious lifters; austere, monastic voice;
lowercase `awekn` wordmark; no em-dashes; no emojis).

## Three design skills (judgment + craft)

| # | Skill | Repo | Role |
|---|-------|------|------|
| 1 | Emil Kowalski — design engineering | https://github.com/emilkowalski/skill | Motion + interaction craft: easing curves, durations, spring physics, the micro-details that read hand-crafted, not AI. |
| 2 | Impeccable (Paul Bakaus) | https://github.com/pbakaus/impeccable | Design-token SYSTEM (OKLCH ramps), register = BRAND, a /20 quality audit, depth language, anti-glassmorphism-by-default. |
| 3 | Taste (Leonxlnx) | https://github.com/Leonxlnx/taste-skill | Aesthetic GATES: VARIANCE/MOTION/DENSITY dials, anti-repetition, one-accent rule, real images, kill fake testimonials, anti-AI-slop pre-flight. |

## Four effect / graphics libraries (visual firepower)

| # | Library | Repo | Role |
|---|---------|------|------|
| 4 | react-three-fiber | https://github.com/pmndrs/react-three-fiber | The 3D/WebGL foundation (hero scenes, scroll-linked camera, the interactive centerpiece). |
| 5 | ShaderGradient | https://github.com/ruucm/shadergradient | Animated cosmic gradient backdrops, themed to near-black + deep indigo/violet bloom. |
| 6 | liquid-logo | https://github.com/paper-design/liquid-logo | The `awekn` wordmark as liquid metal (WebGL shader). |
| 7 | liquid-glass-js | https://github.com/dashersw/liquid-glass-js | Apple liquid-glass for nav / cards / paywall surfaces (SVG displacement + backdrop-filter). |

## How they combine (the pipeline)

**Taste reads the room and gates the exits → Impeccable builds the auditable token system inside those gates → Emil makes everything inside the system move like machined hardware.** The four effect libraries supply the heavy visuals; the three skills keep "heavy" from becoming "gaudy" and on-theme.

## Non-negotiable lessons (from the adversarial critique)

- The "graphite + one gold accent" look is the most over-produced premium-dark template. Be genuinely original; the accent color is not the differentiator.
- Invent the hero mechanic **from lifting** (load / mass / a rep cycle / numbers climbing under tension), not from a SaaS reference (no "Linear move", no cursor-parallax floating phone).
- **One owned, lifting-native interactive centerpiece** nobody else has (e.g. a scrubbable strength curve, a tap-to-complete-a-set with the real app component) — the single highest-leverage move toward world-class.
- **Kill fabricated testimonials** (AI-slop + an App Store liability). Zero, or one real quote.
- Resolve the brand to **monastic-iron** (austere, near-monochrome, gold as rare typographic punctuation), not gold-luxury-watch.
- **Mobile-first** (~90% of an iOS app's landing traffic is iPhone); prove 60fps on a real iPhone, enhance up to desktop.
- Heavy **and** fast: intersection-gated WebGL, DPR caps, static poster fallbacks on mobile + reduced-motion, code-split three.js. Targets: LCP < 2.5s, INP < 200ms.

The full plan of record lives in `docs/WEBSITE_REDESIGN_PLAN.md`.
