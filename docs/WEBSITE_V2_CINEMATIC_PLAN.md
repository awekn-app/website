# awekn.com v2: more lines, more rooms, more cinema (plan, 2026-09-27 evening)

The founder, on the live rebuild: "I really like the lines moving. Improve it a lot more: more
detailed, more accurate, more lines which make sense. More cards which make sense, more stories,
more effects and dynamic designs, very cinematic, best for user experience. Three.js, animation,
you decide. It must leave a wow factor. Super optimised for mobile (90% of visitors), and improve
desktop too." Permission granted to put it live when done.

Everything in docs/REBUILD_2026_PLAN.md still holds (ember, one accent, Hanken Grotesk, sentence
case, no em-dashes, real maths from the app, 44 px targets, reduced motion, pan-y, one live room
at a time).

## 1. The arc becomes the instrument (the founder's favourite, rebuilt)
One simulated 12-week recomposition, generated deterministically from the app's own maths, drawn
as a stacked instrument that scroll scrubs through time with a playhead:
- Track 1, bodyweight: daily weigh-ins as grey dots, the EWMA trend (alpha 1 - e^(-1/7)) as the white
  line, the goal band, kg a week in the header.
- Track 2, strength: estimated 1RM for squat, bench and deadlift (three lines, grey to white, the
  lit one follows the playhead), record markers where a line steps up, a deload dip in week 8.
- Track 3, work: weekly hard sets as columns from zero, the 4-week average as a line.
- Track 4, fuel: daily calories as a thin line against the target band, protein hits as dots.
- Annotations fade in at their day: "Cut starts", "Bench 100 kg x 5", "Deload", "New squat record".
- The header reads the playhead: date, weight, trend, total, sets, kcal, all tabular with
  reserved widths. On a phone the tracks stack; on desktop they sit beside the words.

## 2. New rooms (each a story beat, each on the app's maths)
- Muscles: sets per muscle this week as sorted bars against the 10 to 20 band; tap a workout to add
  its sets and watch the bars move.
- Rest timer: a ring counting down; tap +15 s; the last 3 seconds pulse; a "next set" payoff.
- The route: a GPS run drawn as a line that draws itself, pace dots, splits per km.
- Meet day (powerlifting, restrained): pick three attempts per lift, the total and DOTS update.
Rooms stay one at a time live, with Reset and a keyboard path.

## 3. Cinema
- Chapter openers: big type that reveals line by line as it enters, with a thin ember rule drawn
  under it (CSS scroll-driven where supported, IntersectionObserver fallback).
- "The year" (three.js): 365 days as an instanced field of small blocks that rise to their
  training volume as you scroll, lit from one ember light; a static SVG heatmap poster first,
  WebGL after idle on capable devices only, paused off screen.
- A scroll progress hairline at the top; section-to-section ember light that travels with the
  story; the sticky download bar stays.
- Desktop: wider compositions (two-column rooms, the arc beside its words, bigger type scale),
  pointer-aware light on the hero.

## 4. Budgets
Mobile first at 375 px: no horizontal scroll, every room usable one-handed, 60 fps scroll on a
mid phone, three.js only after idle, first-load JS kept small (dynamic imports for heavy rooms).
`npm run build` clean; every route 200.

## 5. Order
Branch `v2/cinematic` from main. Arc instrument, new rooms, the year, cinema, then integration,
a full pass at 375 and 1280, then merge to main (production, founder-approved in advance).
