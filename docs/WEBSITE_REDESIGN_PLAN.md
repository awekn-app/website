# awekn.com — world-class rebuild: plan of record

**Status:** awaiting founder approval (plan-first). Date: 2026-06-15.
**Method:** 3 research passes (7-repo deep-read + current-site audit + world-class benchmarks → effects + heavy-but-fast architecture → a design-council vote). Grounded in the seven founder-supplied references (`docs/DESIGN_SKILLS.md`).

---

## The winning direction: **THE INSTRUMENT**

> awekn.com is not a page *about* the app — it is the app's own instrument panel running **live in the browser.** You land in a near-black cosmic void; the panel powers on (numbers climb under tension, hairline gold rules draw themselves, the liquid-metal `awekn` wordmark ignites from dim to champagne). From there the page is a sequence of real instrument readouts rebuilt faithfully from the live app, set on Apple liquid-glass over a deep cosmic gradient, scored to a single barbell-load motif that climbs 20→180 kg down the page edge.

**Why it won the vote** (judged across world-class / brand-fit / heavy-but-fast / uses-all-7):

| Direction | World-class | Brand-fit | Heavy-but-fast | Uses all 7 |
|---|---|---|---|---|
| The Forge (scroll = load the bar) | 9 | 7 | 6 | 9 |
| The Living Record (3D scrub ribbon) | 9 | 8 | 6 | 8 |
| **THE INSTRUMENT (winner)** | **8** | **10** | **8** | **9** |

The Instrument won on the two lenses that actually separate world-class from templated: **brand-fit** and **feasibility**. It is the only direction grounded in the app's *real* color tokens (verified in `constants/colors.ts`: pure black + champagne-gold-as-text + emerald #34D399 as the completion/PR signal). The Forge's ember/heat palette actively *fights* that truth. And its owned centerpiece is HTML/CSS on glass — no scroll-jacked 3D physics warring with iPhone scroll — so it is **60fps on iPhone by construction.**

**Grafted from the runners-up:** the power-on "numbers materialize from the void" hero (from The Living Record); a lightweight scrubbable strength curve (SVG playhead, not 3D); the existing statue assets as devotional texture; the closing-wordmark final ignition + a thin barbell-load progress rail down the page edge (from The Forge, as a transform-only motif, not a physics sim).

---

## The owned centerpiece: **THE LIVE SET**

The single highest-leverage, world-class move (exactly what the adversarial critique demanded): the app's **real SetRow component, rebuilt in the browser and operable.** One Bench Press card, Push Day #11, three set rows with a PREVIOUS column. You **scrub the weight in 2.5 kg steps and tap the check** — and it runs the app's *exact* completion transition: border + fill animate to emerald #34D399, the outline check swaps to the sharp checkmark, e1RM ticks up, the strength curve gains a point. Not a 3D toy, not a JPEG — the actual app component. Nobody else has this.

---

## How all seven repos combine (none dropped)

- **react-three-fiber** — ONE shared `<Canvas>` (client component, `dynamic(ssr:false)`, `frameloop="demand"`, DPR clamp 1.5 desktop / 1 mobile) hosting only: the ShaderGradient backdrop, the calorie gauge, and specular bloom. Never a second canvas (Safari's ~16-context ceiling).
- **ShaderGradient** — the deep cosmic backdrop behind all glass, mounted *inside* the shared canvas. `color1 #05060f` near-black base + deep indigo `#171448` + one low-brightness champagne stop. `lazyLoad` on, `pixelDensity 1`, plane geometry, grain off, static poster fallback on mobile / reduced-motion.
- **liquid-logo** — the `awekn` wordmark as liquid metal, in exactly two places: HERO (dim → ignites to champagne on power-on) and CLOSING (re-ignites once). Vendored locally behind a client-only boundary.
- **liquid-glass-js** — the Apple liquid-glass surfaces: the nav pill, the Two Disciplines cards, the Live Set card, and the pricing surface. `backdrop-filter` fallback is the *primary* path; the SVG-displacement refraction is progressive enhancement (Safari/Firefox-safe).
- **Emil Kowalski** — the motion law: two easings (`--ease-out cubic-bezier(0.23,1,0.32,1)`, `--ease-emphatic cubic-bezier(0.16,1,0.3,1)` for anything "climbing under tension"); animate only transform/opacity/clip-path; `scale(0.97)` on every `:active`; stiff damped springs, no bounce/elastic; reduced-motion honored.
- **Impeccable** — the OKLCH token system derived from the real Obsidian Gold ramp; register = BRAND; double-bezel depth; glass reserved for instrument cards (not glass-everywhere); a /20 quality audit as a ship gate.
- **Taste** — the aesthetic gates enforced at build: high variance but no 3 consecutive zigzag splits; eyebrow count ≤ ceil(sections/3); one accent; real screenshots mandatory; **zero fabricated testimonials**; anti-AI-slop pre-flight.

---

## Palette (grounded in the app's real Obsidian Gold theme)

- **Void/base:** `#000000` canvas · `#05060f` gradient base · `#0D0B06` warm near-black card surface (the exact app surface).
- **Cosmic bloom:** deep indigo `#171448` + one low champagne stop.
- **Gold = rare typographic punctuation, never a fill:** primary `#D4AF37` (CTA bg + active pricing border only) · champagne `#E4C77A` as the main TEXT color (gold *is* the text, as in the app) · `#B89C5A` dim text.
- **Emerald `#34D399` is NOT a second accent** — it is an earned signal, fired only where the app fires it (set completion / PR).

## Typography

- **Display:** ban Inter as the display face. A grotesque-with-character (PP Neue Montreal *or* Cabinet Grotesk class), self-hosted via `next/font/local`.
- **Editorial:** keep Instrument Serif *italic* on signature words ("devotion", "sculptor", "titan", "kept") — a loved part of the current DNA.
- **Mono:** Geist Mono / JetBrains Mono class for ALL numerals/stats with `tabular-nums` — the instrument-readout edge.

## Motion

Two easings only; transform/opacity/clip-path only; `scale(0.97)` on every pressable (the real check button uses 0.94→1 to match the app); stiff damped springs; rAF DOM counters for number ticks (never re-rendering WebGL text); intersection-gated reveals.

---

## Site architecture (17 beats + routes)

`00` NAV (persistent, App Store CTA) · `01` HERO / POWER-ON · `02` OATH MARQUEE (CSS) · `03` **THE LIVE SET — centerpiece** · `04` TWO DISCIPLINES (BB/PL, statue texture, PL stays austere) · `05` THE JOURNAL (heatmap, "the iron remembers") · `06` THE ASCENT (scrubbable curve) · `07` THE FUEL (calorie gauge, the one r3f-lit moment) · `08` THE BODY · `09` THE REST OF THE RECORD (tracker grid) · `10` THE RHYTHM (active-workout) · `11` YOURS (offline-first) · `12` **PRICING (NEW)** $34.99/yr pre-selected + $5.99/mo + 7-day trial, single CTA · `13` MANIFESTO · `14` FAQ (`<details>`, +1 pricing Q) · `15` CLOSING WORDMARK (liquid-metal, final ignition) · `16` FOOTER.
**Routes:** new `/support`; keep `/privacy` `/terms` `/delete-account`; add `metadataBase` + JSON-LD `SoftwareApplication` + a real OG image (app UI, not text).

---

## Tech stack & dependencies

Keep: Next 16.2.1, React 19.2.4, Vercel, the React Compiler, `@vercel/analytics` + `speed-insights`.
**Add:** `three` (^0.169+), `@react-three/fiber@^9` (v9 is the React-19/Next-16 requirement — v8 will not work), `@react-three/drei@^9`, `@shadergradient/react`. **Vendor locally** (don't depend on churning published APIs): `liquid-logo` and `liquid-glass-js`, each behind a client-only boundary.
**Remove:** `mongoose` + `src/lib/mongodb.ts` + `src/models/WaitlistUser.ts` + the waitlist server action + `MONGODB_URI`; the create-next-app `page.module.css` cruft; ~11 MB of unused public assets.

## Performance budget (heavy AND fast)

Targets: **LCP < 2.5s · INP < 200ms · CLS < 0.05 · 60fps proven on a real iPhone first** (mobile-first; ~90% of traffic is iPhone-Safari). The LCP path is **WebGL-free** (static text + a cooled-wordmark poster + self-hosted fonts; all `three` is `dynamic(ssr:false)`, out of the critical bundle). Exactly two WebGL surfaces (the shared canvas + the gradient inside it). `frameloop="demand"` (GPU sleeps when idle). Everything below the fold is intersection-gated; the canvas mounts on first scroll intent and unmounts when its beats leave the viewport. Static poster + reduced-motion fallbacks throughout.

---

## Build phases

- **Phase 0 — Cleanup + foundation:** remove dead waitlist/MongoDB code + ~11 MB unused assets; stand up the OKLCH token system, the grotesque/mono fonts, the Emil easing tokens. *(The dead-download-button fix already shipped live 2026-06-15.)*
- **Phase 1 — SEO / compliance / conversion infra:** `metadataBase`, JSON-LD, real OG image, `/support` route, App Store badge. (Ship-blocking, low-risk, high-value.)
- **Phase 2 — Static skeleton re-skin:** rebuild the page on the new tokens + type + easing; liquid-glass cards (backdrop-filter fallback primary).
- **Phase 3 — The owned centerpiece (THE LIVE SET):** the real SetRow rebuilt, the exact emerald completion, scrub + check.
- **Phase 4 — The shared r3f canvas + ShaderGradient** (prototype the child-mount first — the riskiest integration).
- **Phase 5 — Power-on hero + liquid-logo** ignite.
- **Phase 6 — Second interactive (scrubbable curve) + the barbell-load scroll rail.**
- **Phase 7 — Audit + prove:** Impeccable /20 + Taste anti-slop pre-flight as ship gates; LCP/INP/CLS measured on a real iPhone.

> **Phases 0–3 deliver ~80% of the world-class value** (cleanup + SEO + pricing + the re-skin + the owned centerpiece) and are the load-bearing wins. The heavy WebGL (4–6) layers spectacle on top of an already-excellent, fast base.

---

## Open questions for the founder (decisions that change what I build)

1. **Display typeface:** PP Neue Montreal (paid license) vs Cabinet Grotesk (free, Fontshare) vs another grotesque. Biggest single visual-identity lever.
2. **Testimonials:** ship with **zero** (the safe default the critique recommends), or do you have **one real** App Store / user quote to feature? (No fabricated quotes.)
3. **Android buttons:** keep them visibly "coming soon", or hide Android entirely until the Play listing ships? (Recommendation: hide until live.)
4. **Seeded numbers** in the centerpiece/curve labeled "illustrative record" (not a real user) — OK? (Recommendation: yes.)
5. **Pricing display:** USD only on-page ($5.99/mo, $34.99/yr) with a "prices vary by region" line, or geo-aware? (Recommendation: USD + note.)
6. **Scope/sequencing:** ship Phases 0–3 first (the fast, load-bearing 80%), then layer the heavy WebGL (4–6)? Or build it all before any deploy?
