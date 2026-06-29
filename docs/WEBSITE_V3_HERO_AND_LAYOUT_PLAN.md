# awekn.com v3 - clear hero, above-the-fold interactive, real meaning

Date: 2026-06-29
Builds on the live black + silver + cosmic site. Founder feedback (2026-06-29), verbatim intent:

1. The hero line "Training is a kind of devotion" does NOT say what the app does. Need a clear one-liner: awekn is an all-in-one fitness log (lifting, cardio, diet/macros, supplements, peptides/regimen, PRs, consistency). A first-time visitor must instantly get "this tracks my whole training life," no "what is this?".
2. The hero/wordmark does not fill the space. Add premium gym-equipment graphics/effects (barbell, dumbbell, plates) so the fitness context is obvious and the top feels crafted.
3. The interactive cards are scattered ("here and there"). Users do not scroll to the bottom. The best cards must live near the TOP, premium-arranged, space used well, best-UX-first.
4. The ConsistencyOrb card is hard to understand. Reimagine it for clarity (a habit/streak a person reads in one second).
5. The SteelScene torus ring signifies nothing. Remove it. Replace with something MEANINGFUL + animated + interactive.
6. The DOTS strength-score gauge looks buggy / unpolished. Fix and polish it.
7. Pricing dumped at the bottom is not clever. Rethink it (subtle + creative); put something better in that space.

Standing law: black + silver + cosmic, emerald only as a rare earned micro-signal. Premium, aesthetic, modern, mobile-flawless. No em-dashes. Lowercase awekn wordmark, "Awekn" in prose.

## The value-prop one-liner (the most important words on the site)

Lead line (replaces "devotion"), candidates, picking the clearest:
- "everything that makes you stronger, in one log."  <- lead choice (poetic but clear)
- supported by a BREADTH STRIP directly under it so there is zero ambiguity:
  `workouts · cardio · macros · supplements · peptides · prs · consistency`
The strip names the categories explicitly; the line gives it soul. Together: instantly clear it is all-in-one, not just a workout logger.
(Alt leads kept in reserve: "the whole of your training, in one app." / "lift, eat, recover. track all of it.")

## New page architecture (above-the-fold-first)

1. HERO (reimagined): the silver-sheen `awekn` wordmark, balanced by a premium machined BARBELL graphic (silver plates, a slow sheen-sweep + soft float, the cosmic pool of light behind it) so the top reads unmistakably "serious lifting" and fills the space. The clear value-prop line + the breadth strip + a Download-on-iOS CTA with a quiet "7 days free" under it. Optional faint floating equipment glyphs (plate, dumbbell) for depth.
2. SEE IT WORK (immediately, the proof, high above the fold of section 2): one tight, premium showcase of the best OPERABLE cards so a visitor experiences the app in the first screen or two: LiveSet (log a set), PlateLoader (load the bar), the reimagined Consistency, the polished DOTS, RpeCalculator. A clean bento/grid, not four spread-out sections. This consolidates today's scattered record/set/strength/workshop sections into one strong interactive moment near the top.
3. EVERYTHING IN ONE LOG (clarity on breadth): a premium grid of what awekn tracks, each with a small tasteful glyph: workouts (BB + PL), cardio + steps, macros + calories, supplements, peptides / regimen, body weight + photos, PRs + e1RM, consistency + streaks, DOTS / Wilks / meets. So the all-in-one value is concrete.
4. TWO DISCIPLINES (BB / PL): keep (it is good and explains the two modes).
5. A YEAR ON ONE SCREEN (replaces the steel ring): a meaningful, animated, interactive 365-day training heatmap (the app's signature). Cells light silver as the year fills / on hover-scrub; "a full year of training, one screen." Meaningful, not decoration.
6. PRIVATE BY DESIGN: keep (trust).
7. PRICING (rethought, not a bottom dump): a single compact, elegant price woven into the closing CTA ("start 7 days free, then $34.99/yr, cancel anytime"), plus a small "everything included, no tiers" line. No standalone bottom pricing section. The freed space goes to the strong close.
8. CLOSING CTA + FOOTER: keep, with the subtle price.

## What gets built / changed

NEW or reimagined components (built to the instrument quality bar, all silver/cosmic, drag+keyboard+touch+reduced-motion, no WebGL, no new deps, real app math):
- HeroBarbell: a premium machined barbell graphic for the hero (reuses PlateLoader's plate rendering language; a sheen-sweep + soft float; not interactive, a hero visual).
- ConsistencyStreak (reimagines ConsistencyOrb): a dead-clear habit card. A readable month grid / week strip where trained days are lit, a big legible streak number, "you trained N of M this month", drag/tap to fill a day and watch the streak move. Clarity over the abstract ring.
- YearHeatmap (replaces SteelScene): the 365-day heatmap, hover/scrub a day, cells animate-fill silver, one rare emerald for a perfect week.
- TracksGrid: the "everything in one log" breadth showcase (mostly CSS + inline SVG glyphs).

DIRECT edits (owned for coherence):
- page.tsx: full re-architecture to the order above; remove the SteelScene section; consolidate the interactive cards into the SEE IT WORK showcase near the top; new hero; pricing folded into the close.
- globals.css: hero + showcase + tracks-grid + close section styling; remove now-unused section styles.
- DotsGauge: polish pass (cleaner gauge ends, needle, score legibility, slider feel; fix the "buggy" look).
- Copy: the value-prop line + breadth strip + pricing line.

## Approach + verification

- A workflow builds HeroBarbell, ConsistencyStreak, YearHeatmap, TracksGrid in parallel to strict specs; I own the page re-architecture, copy, DOTS polish, and pricing.
- Verify EVERY change in-browser at desktop + mobile via the Claude_Preview MCP; operate each instrument (the math must stay correct); confirm no console errors, clean build, no em-dashes, no green chrome.
- This is a big creative change: build it, verify it, SHOW the founder (screenshots) before deploying to main. Deploy on his go.

## Self-questions (founder: "question yourself in everything")
- Does the first screen make a stranger instantly understand awekn is all-in-one fitness? (the line + strip + barbell must.)
- Is every interactive card reachable without deep scrolling? (showcase near the top.)
- Does each card explain itself in one second? (reimagined consistency, polished DOTS.)
- Is anything on the page decoration with no meaning? (steel ring removed; everything earns its place.)
- Is it flawless on a phone? (verify 375px, no overflow, tappable, fast.)

## Status: SHIPPED (2026-06-29)

All of the above built and verified, deployed to awekn.com.
- Hero: "Training is a kind of devotion" removed; now "lift, eat, recover. track all of it." + breadth strip + the `HeroBarbell` graphic + a folded price. Fits one view on desktop and mobile.
- `ConsistencyStreak` (clear calendar + streak) replaced `ConsistencyOrb`. `YearHeatmap` replaced the `SteelScene` ring. `TracksGrid` added ("everything in one log"). All interactive cards consolidated into the "see it work" showcase right after the hero. Pricing folded into hero + close (no standalone section).
- DOTS gauge polished (de-squished viewBox 280 -> 430, removed the arc-end tick "arrows").
- Mobile-first verified at 375px (no overflow, CTA in view); desktop hero CTA brought into the fold by tightening the barbell.
- Clean build (8/8 pages), no console errors, no em-dashes. Built via a 4-agent component workflow + direct page restructure. `ConsistencyOrb.tsx` + `SteelScene.tsx` retired (unused on disk).
