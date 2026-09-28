# awekn.com: the app on show, the heat back in, and a site that holds on a phone (plan, 2026-09-28)

The founder, after the chrome brand went live: "Add very high quality phone screens on top of the
website, accurate in-app screens across the site (several), with mock data filled in, every screen
and feature shown accurately and creatively. Fix the lots of unpolished issues (words and letters are
getting cut). It does not give a gym, fitness, very high quality premium and modern vibe. Add the
orange we use in the app where it looks good, never forced. A piece of art that stays in the mind and
makes people want the app. The site is not optimised for mobile and keeps glitching: the best
engineering. Plan, work, then make it live."

## 1. The idea: forged
Chrome is the finished metal (the brand). ORANGE IS THE HEAT: the work that forges it. So the app's
ember #FF5712 comes back as heat, only where effort happens: the molten glow under the forged mark,
the key that seats white-hot and cools to chrome, a record, a live "now" dot, a chapter number, the
reading hairline's tip, the one lit word of a line. Chrome stays the brand and the primary action.
Completion green stays for a finished set. Never an orange fill for decoration.

## 2. The app, on show (real screens, not drawings)
- Capture: the real app in the iOS Simulator (iPhone 17 Pro, 3x, 1206 x 2622), dark theme, the orange
  accent, the QA account's full season of data (81 workouts, 160 weigh-ins, 695 food logs,
  supplements, cardio, records, notes), a clean 9:41 status bar, Expo Go's tools button hidden.
  Screens: Home, a live workout with a record, the tracker (bodyweight trend, strength), nutrition,
  supplements, cardio, the journal, exercise analytics, community. Converted to AVIF/WebP by
  next/image with exact sizes.
- A CSS iPhone (no device photo): a brushed-titanium chrome rim, the Dynamic Island, true screen
  radius, a glass glare, a soft floor shadow. One component (site/Phone.tsx), GPU-cheap.
- Where they go:
  1. The hero: the chrome A forges behind, the phone (Home) rises in front of it, two floating
     live chips around it (a record in ember, the weight trend).
  2. "Inside the app" (new, after the problem): the full tour. Desktop: one sticky phone whose screen
     changes as each feature's words pass (crossfade, opacity only). Phone: each feature is its own
     block with its own phone, no sticky tricks.
  3. Each room chapter opens with a fanned pair of phones for that chapter (the work, the body, the
     proof).
  4. The download close: three phones fanned around the mark.

## 3. The gym in it
- A kinetic line band between sections: "Every set. Every meal. Every rep." in heavy Lexend, one word
  in heat, on a knurled-steel texture (the barbell grip's diamond pattern), a slow marquee that
  stops for reduced motion.
- Heavier, tighter display type; numbers in tabular Hanken; real training copy on the phones.

## 4. Polish: nothing cut, nothing cramped
- `.chrome-type`: no repeating 1lh band (it painted a fresh gradient onto descenders); give every
  clipped headline box room for Lexend's deep descenders (padding + matching negative margin),
  line-heights of 1.08+ where a gradient clips text.
- Chapter line masks: enough padding for descenders.
- Every room at 320, 375, 390, 430 px: no overflow, 44 px targets, no numbers leaving cards.

## 5. Mobile engineering: no glitches
- No per-frame CSS filters: the arc's mark crossfades two static layers (opacity only) instead of a
  blur/brightness scrub; the forge's shadow is a separate static layer, never a filter over the
  animating sweep; the Problem scraps fall without a blur scrub on phones.
- Only transform/opacity animate; the footer sheen moves a masked layer by transform.
- iOS: `overflow-x: clip` on html and body plus fixing the elements wider than the viewport; the fixed
  travelling light off on touch devices; ScrollTrigger `ignoreMobileResize` and no refresh on the
  address bar; stable heights (no vh jumps).
- Findings of a code audit (background agent) applied item by item.
- Verify on real mobile WebKit: Safari in the iOS Simulator against the dev server, plus Chrome at
  320/375/430 and 1440, both motion settings, no console errors, a production build.

## 6. Ship
Commit, fast-forward main (live on awekn.com, the founder's standing permission), verify the live
routes, update the docs and memory.

## Status (2026-09-28): DONE and live
- Screens: 16 real captures in public/app/*.webp (1206 x 2622, WebP q90; next/image serves AVIF/WebP,
  `images.qualities` [75, 90]). The QA account's local simulator database was given one natural
  season for them (a Python generator, local only, rows marked synced so nothing uploaded): 95 PPL
  sessions with progressive overload, noise, bad days, a deload week, periodic heavy singles and
  triples, realistic RPE; a food diary with swings and missed days; steps, water, Sunday runs; a clean
  weigh-in cut 84 -> 79 kg with a 76 kg goal (set in the app); a three-day trip gap in August. Gym
  screens lead (founder: most visitors are gym people, not powerlifters).
- site/Phone.tsx: the CSS iPhone 17 Pro (titanium rim, bezel, island, glare, screen glow; cqw units;
  a `screens` stack that crossfades by opacity).
- Hero: the forged A (key seats white-hot and cools; a molten glow; no filter on the animating SVG),
  the Home phone rising out of it (LCP, transform-only entrance), three live chips from the same data,
  a stage tilt with depth on fine pointers (site/HeroStage.tsx).
- site/ShowcaseArt.tsx: the band (Every set / Every rep in heat / ..., knurled steel strips) and the
  wall (every screen on a tilted wall behind "Start carving."); loops run only while on screen.
- site/AppTour.tsx: Inside the app, 8 steps (log, session, lift, muscles, weight, food, cardio,
  consistency): a sticky crossfading phone on wide screens, a native swipe row on phones.
- Heat: --heat #FF5712 (--ember aliases it). Rooms use the app's orange (primary buttons, the record
  flare, journal field, steps ring and bars, fuel ring), the year's light, the reading hairline's tip,
  the hero's live dot and glow. Chrome stays the brand and the store button.
- Polish: chrome-type paints descenders (padding + negative margin, a periodic per-line gradient),
  gradients live on inline spans (never on an animating box); the audit's fixes (no per-frame filters
  in the arc/problem/forge, the footer sheen by transform, no-op backdrop blurs removed, the travelling
  light off on touch, 320 px overflow in the arc and steps, 44 px footer links, year field reads layout
  in rAF, overflow-x clip on html/body); `upgrade-insecure-requests` production-only (Safari upgraded
  http://localhost CSS in the simulator).
- Verified in iPhone Safari (the iOS Simulator) and Chrome at 1440, no console errors, build clean.

## Round 2 (2026-09-28, founder: "the wall of screens on the very top too, the words changed; very premium and modern, best on mobile")
- The hero is now the wall (site/Hero.tsx): WallBackdrop (shared with the closing wall, ShowcaseArt.tsx)
  with 5 columns on wide screens and 3 on phones, drifting; on a fine pointer it leans toward the
  pointer (HeroTilt); where scroll-driven animations exist it sinks back as the page scrolls (transform
  and opacity on the wrapper only). In front, centred: the forged A (seats white-hot, cools), the live
  dot, "Carved, not given.", a new line ("The training log that reads your work back to you..."), the
  store key plus "See inside the app", and three honest facts (13 trackers, works offline, no ads).
- The closing wall stays with its own words ("Start carving.", "Everything above, in your pocket").
- The phone-in-front-of-the-A hero with floating chips is gone (on a phone the chips covered the
  screen they described).
- Rooms matched to the app: the rest ring, the scale's lit weigh-in and the climb's newest best in heat.
