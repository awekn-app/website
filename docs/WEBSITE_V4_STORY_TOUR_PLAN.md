# awekn.com v4 - the story tour + a premium breadth section

Date: 2026-06-30
Founder feedback on the live v3 site (verbatim intent):
1. The "everything in one log" tracks grid "looks very shit" / lazy. The app is premium; the site must look premium too. Fix anything else that looks lazy.
2. The live-interaction cards are "all in one place without any story." Be a STORYTELLER: introduce each interaction, then deliver it. Talk about it, then show it.
3. Think deeply from every angle; craft the whole site better.

## Why it looks lazy right now (root causes, verified in code)
- `.ix-tracks { text-align: center }` cascades INTO the grid cards, centering each card's title+sub - so the glyph sits top-left while the text floats center: visually broken.
- `.cell { min-height: 168px; ... } .copy { margin-top: auto }` pushes the text to the bottom of a tall card, leaving a big dead gap under the glyph. Empty boxes.
- Two `wide` cells span 2 columns with the same tiny content, so they look even emptier and the grid reads accidental, not intentional.
- The showcase is a 6-card dump under one heading: no narrative, no invitation to touch, no hierarchy.

## A. The interactive tour (replaces the showcase grid-dump)
Turn the instruments into a guided, scrollytelling product tour. Each instrument is a "beat": a number, a headline (one serif-accent word), one or two sentences of story, and a small "try it" hint - then the LIVE card beside it. Alternating split on desktop (copy <-> card), stacked on mobile (copy above card). The first beat sits right under the hero so an interaction is visible immediately.

- Intro: "01 · See it work / the app, in your hands" - not screenshots, the real instruments, touch them.
- Beat 1 - LiveSet: "log a set, watch it count." Drag the weight, hit the check, e1RM moves live. Hint: drag the weight, tap the check.
- Beat 2 - PlateLoader: "load the bar, exactly." Target in, plates per side out, biggest first. Hint: set the weight.
- Beat 3 - StrengthCurve: "your strength, plotted." Every session a point; the line rises or stalls. Hint: scrub the line.
- Beat 4 - ConsistencyStreak: "keep the streak honest." A real calendar + a streak that never inflates; a whole week earns its mark. Hint: tap a day.
- Beat 5 - "and the math, in your hands": RpeCalculator + DotsGauge as a paired close (RPE -> e1RM, DOTS total). Drag anything.

Copy is premium, plain, a little soul, no em-dashes. Each beat invites a touch (the founder wants people to USE the cards).

## B. "Everything in one log" - premium redesign
Kill the empty-box look. New cards: a COMPACT, content-filled tile - an app-style IconTile (glyph in a gradient-bordered rounded square) on the LEFT, title + sub stacked LEFT-ALIGNED to its right, vertically centered, consistent size (drop the random wide spans), real depth (surface + hairline + hover lift + glyph glow). A tidy, dense 3-col matrix (2-col mid, 1-col phone). Reads intentional and premium, like the app's own dashboard tiles. Fix the text-align leak (force left inside the grid).

## C. Polish pass
Screenshot every section at desktop + mobile; fix any other lazy spacing/composition (disciplines, the year band, private, close). Tighten rhythm, ensure each section feels crafted.

## Brand + rules (unchanged, enforced)
Black + silver + cosmic. Emerald only as a rare earned signal inside an instrument (a completed set, a kept week, a PR dot). No green chrome, no other color. No em-dashes anywhere. Lowercase `awekn` wordmark, `Awekn` in prose. MOBILE-FIRST (most visitors are on a phone): verify 375px, no overflow, tappable, fast.

## Approach + verification
Direct build with screenshot verification at desktop + mobile (design fidelity; the founder will scrutinize). The instrument components themselves are unchanged - this is about PRESENTATION (story) + the breadth redesign + polish. Then deploy to main (Vercel), and sync all docs/memory ([[feedback_sync_everything]]).

## Status: SHIPPED (2026-06-30)

Built and verified at desktop + mobile, deployed to awekn.com.
- The showcase grid-dump is gone. SEE IT WORK is now a guided tour: a section intro, then 4 alternating story beats (LiveSet "log a set, watch it count" / PlateLoader "load the bar, exactly" / StrengthCurve "your strength, plotted" / ConsistencyStreak "keep the streak honest"), each with a number + headline + a line of story + a "try it" hint beside the live card, then a paired "and the math, in your hands" close (RpeCalculator + DotsGauge). Copy on the left, card on the right, alternating; stacked copy-above-card on mobile.
- The breadth grid was rebuilt from empty floating-content boxes into a tidy, dense 3-up matrix of COMPACT cards: an app-style IconTile glyph left, title + sub left-aligned beside it, consistent size, real depth + hover. Fixed the `text-align:center` leak (the cause of the centered floating text) and dropped the random wide spans. 3 -> 2 (760px) -> 1 (480px) columns.
- Section numbering aligned to the nav (01 tour, 02 everything, 03 disciplines, 04 the year).
- Verified: desktop tour beats + math pair, the redesigned grid, mobile stacking (no overflow at 375px), disciplines/year/close unchanged-and-clean. Clean build (8/8), no em-dashes, no green chrome. The instrument components themselves were untouched - this was presentation (story) + the breadth redesign + polish.
