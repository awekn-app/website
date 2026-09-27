# awekn.com, rebuilt from scratch (plan, 2026-09-27)

The founder's brief:
- Scrap the site and rebuild it as a work of art that tells a story and is inspirational.
- Fill it with live interactions: log a set, complete steps, add food, track bodyweight.
- Bring much-improved versions of the app's onboarding live cards.
- Use animation, motion graphics and three.js. Make it very modern and premium, matching the app's
  vibe (obsidian void, graphite, one ember accent, Liquid Glass).
- Mobile first.

Research:
- Awwwards and FWA winners 2025-26: Lando Norris (SOTY), Igloo Inc, Oryzo, Cartier W&W, Oura,
  WHOOP, Linear, Lusion, Active Theory, Opal, Apple's pinned product pages.
- Apple and Google badge and device-frame rules.
- R3F, GSAP and Lenis performance guidance.
- An audit of this repo.

## 1. What must survive (non-negotiable)
- `/privacy` and `/terms`: the app links to both, so they are hard dependencies.
- `/delete-account`.
- `/reset-password`: live Supabase recovery.
- The global `RecoveryRedirect`.
- `next.config.ts` security headers (the CSP).
- Layout metadata, JSON-LD, Vercel Analytics and Speed Insights.
- `opengraph-image` (restyled).
- Additions:
  - `/support`: Apple wants a Support URL, and there is none today.
  - `sitemap.ts` and `robots.ts`.
  - The `apple-itunes-app` smart banner meta.
  - The Google Play attribution in the footer.

## 2. The story (one idea per viewport, a CTA every ~3 screens)
0. **The carver.** Poster first: the statue photo cutout is the LCP image. A WebGL noise-dissolve
   then "carves" it out of the void (one shader, loaded after LCP).
   - Headline: "Carved, not given." One line under it.
   - The App Store badge above the fold, and a sticky download bar after the hero.
1. **The problem**, one short pinned beat: notes apps, spreadsheets, guesswork. The chaos drops away
   as you scroll.
2. **The arc, day 1 to week 12.** A scroll-scrubbed bodyweight trend line, and the statue sharpening
   alongside it.
3. **The rooms: live demos, one room per pillar**, each a rebuilt onboarding card, pre-seeded so the
   first tap already means something:
   - **The set:** "Bench 100 kg × 5, your best is 97.5". One more rep, and the PR medal fires with
     an ember burst, the one place the accent flares.
   - **Plates:** drag the target and the discs load, with physics as each plate drops on.
   - **Fuel:** tap real foods (dal, paneer, oats, chicken) and the calorie ring and macro bars fill.
   - **The scale:** drag the weigh-ins and the smoothed trend redraws, with kg a week.
   - **Steps:** hold to walk and the ring closes on the goal.
   - **The journal:** tap days and the GitHub-style grid lights up.
   - **The climb:** scrub a season of e1RM with a deload dip and a new peak.
4. **Everything else**: supplements, regimen, splits, cardio GPS, photos, notes, community, told as
   a fast sequence, not a card grid.
5. **Bodybuilding and powerlifting**, two disciplines. The PL room stays restrained: DOTS and
   attempts, no cosmic bloom.
6. **Private by design** (the vows).
7. **Proof**: only real numbers (the App Store rating when there is one). Never invented
   testimonials.
8. **Pricing**: free tier, $5.99/mo, $34.99/yr, 7 days free. Then download.

## 2b. Palette decision
- The site went emerald on 2026-06-28, when emerald was the app's signature.
- The app was re-skinned to EMBER on 2026-09-10: orange light (#FF5712) on an obsidian void, graphite
  cards, Liquid Glass.
- This brief says "match our app vibe", so the rebuilt site follows ember:
  - Obsidian #0B0B0D, graphite surfaces.
  - White numbers, grey secondary.
  - Ember #FF5712 as the one accent.
  - The app's in-workout completion green only on a completed set.
- Never gold, never blood-red, never the purple nebula.

## 3. Craft laws
- Monochrome restraint: white numbers, grey secondary. Ember (#FF5712) only on the primary CTA,
  the PR moment and one status.
- Hanken Grotesk, sentence case, no em-dashes, no emojis. The wordmark is lowercase "awekn".
- Show the real app UI without a device frame (Apple forbids modified or 3D bezels). Use official
  store badges only, never animated. App Store first, both the same size, 40px or more tall.
- Demos:
  - Respond in under 100 ms, with a spring press at 0.96.
  - Count-ups in tabular figures, and reserved widths so nothing shifts.
  - Touch targets of 44px or more, `touch-action: pan-y`, and never trap the scroll.
  - One live at a time; pause the ones off screen.
  - A reset control, a keyboard and ARIA path, and "this is the real app" beside the badge after
    each payoff.

## 4. Stack (the existing Next 16 repo, rebuilt)
- **R3F + drei** only for the hero carve and one showcase, through `next/dynamic` with `ssr:false`,
  mounted when in view.
  - `dpr={[1,2]}`, `PerformanceMonitor`, `frameloop="demand"` when idle.
  - Assets: KTX2 / Meshopt.
- **GSAP ScrollTrigger** for pinned chapters (pins no longer than 150vh on phones). **Lenis** only on
  fine pointers; native scroll on iOS.
- **Motion** for the demos' springs. CSS scroll-driven animations for simple reveals.
- **Rive** is optional, for the PR medal and checkmarks. Otherwise SVG plus Motion.
- **Budget** (mobile, 4x CPU): LCP under 2.5 s, INP under 200 ms, CLS under 0.1, first-load JS
  under 200 KB gzipped, three.js after LCP.
- **Low-end and Save-Data** (4 cores or fewer, 4 GB or less, no WebGL2): the poster plus CSS only.
- **`prefers-reduced-motion`**: no pins, scrubs or shader; crossfades, and the demos still work.
- **Keep the logic** of the existing instruments (e1RM, plates, DOTS, RPE); restyle everything.
- **Delete** SteelScene and ConsistencyOrb, the unused shadergradient, the legacy token aliases and
  the monolithic `globals.css` (the legal styles move to their own file).

## 5. Build order
0. Design first (founder rule): the hero and three rooms as mobile artboards in /design, then
   implement to match.
1. Tokens, fonts, layout shell, legal pages moved over, `/support`, sitemap, robots, smart banner.
2. The hero: poster, carve shader, badge, sticky bar.
3. The rooms, one at a time: set, fuel, scale, steps, journal, plates, climb. Each is tested at
   375px on a real phone viewport before the next.
4. The arc, everything else, disciplines, vows, pricing, footer.
5. The performance pass (Lighthouse mobile), the reduced-motion pass, the a11y pass, and the OG
   image.
6. Built on branch `rebuild/2026` (a Vercel preview). Merging to main is production, only after the
   founder's verdict on the preview (his standing rule for the big redesign).

## 6. Status
- Design (step 0) done 2026-09-27: https://claude.ai/artifact/5DRnsf4npVmkGQYTJwgJtJ (private canvas).
  It has the phone hero, three rooms that work (the set, fuel, the scale), the whole scroll as a
  storyboard, and a desktop hero.
- Build (2026-09-27, branch `rebuild/2026`, Vercel preview only, never merged without the founder):
  - Foundation: ember tokens, Hanken Grotesk, layout metadata with the smart banner, `/support`,
    sitemap and robots, the legal pages kept.
  - Hero: the statue poster as the LCP image, plus `site/HeroCarve.tsx`, a WebGL chisel of ember
    light that sweeps the statue once with dust from its edges, then a pointer rim light. three.js
    loads after idle, only on capable devices (skips reduced motion, Save-Data, under 4 cores or
    4 GB, no WebGL2). Premultiplied light on a transparent canvas (a blend mode fails inside the
    figure's isolated group).
  - Problem and Arc: sticky, scroll-scrubbed beats with GSAP ScrollTrigger (no pins); the finished
    state renders without JS and under reduced motion.
  - Seven rooms in `site/rooms/`, all on the shared `Room` frame (`useRoomLive(id)` pauses a room
    off screen), each mirroring the app's real maths:
    set (the records engine, lib/pr), plates (lib/powerlifting/plate), fuel (real rows from the
    food DB), scale (lib/bodyweight/trend EWMA), steps (the 10,000 goal), journal (JournalGrid),
    climb (a season of e1RM with a scrub).
  - Old instruments, `useMotion`, R3F, shadergradient and Lenis removed. The OG image restyled.
  - Verified at 375px and 1280px in the dev preview; `npm run build` passes, every route static.
- 2026-09-27 later: every production route checked on the rebuild (/, /privacy, /terms,
  /delete-account, /reset-password, /support, sitemap, robots, OG all 200); the legal pages are
  byte-identical to main, and every old branch (backups, instrument, app-match) is fully contained.
  /reset-password restyled to ember and sentence case (logic untouched). Flipped rooms give the
  instrument the wide column on desktop.
- LIVE on awekn.com 2026-09-27: the founder approved the preview; main fast-forwarded to
  rebuild/2026 (d6f2498), Vercel production deploy succeeded, all nine routes 200 on the live domain.
- Open: the official App Store badge (a founder download), a Lighthouse mobile pass on the
  preview, a real-iPhone check of the carve, the steps hold and the scale drag.
