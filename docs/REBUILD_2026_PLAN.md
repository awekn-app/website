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
1. Tokens, fonts, layout shell, legal pages moved over, `/support`, sitemap, robots, smart banner.
2. The hero: poster, carve shader, badge, sticky bar.
3. The rooms, one at a time: set, fuel, scale, steps, journal, plates, climb. Each is tested at
   375px on a real phone viewport before the next.
4. The arc, everything else, disciplines, vows, pricing, footer.
5. The performance pass (Lighthouse mobile), the reduced-motion pass, the a11y pass, and the OG
   image.
6. A preview deploy (a branch), a founder verdict, then main (production).

## 6. Status
- Planned. It starts after the app work (H4 and F1) is done, per the master list.
