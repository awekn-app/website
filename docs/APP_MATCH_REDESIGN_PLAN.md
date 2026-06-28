# awekn.com — App-Match Redesign Plan

**Date:** 2026-06-28
**Goal (founder):** "the website's theme and color is totally different from our app. Make the website match it, or even improve it."
**Owner:** Areeb / autonomous build by Claude

---

## 1. The diagnosis (why it feels "totally different")

I read both codebases (app `/Users/areeb/awekn`, site `/Users/areeb/awekn-website`) and ran a 2-agent deep audit.

| | The app (what you actually ship) | The site today ("THE INSTRUMENT") |
|---|---|---|
| Canvas | near-black / charcoal `#0C0C0C`–`#141414`, faintly lit pool | pure `#000` + **purple→blood-red nebula** shader |
| Brand accent | **emerald `#34D399`** is the constant signal (consistency underline, week strip, completion check, PR-green). Default `graphite` theme adds an orange `#FF6B35` pop. | **blood-red `#B5384C`** on every CTA, ring, dot, scroll bar. Green is literally banned in the CSS header. |
| Display type | giant Inter-300 number, **silver sheen** (`#FFFFFF→#CDCED8`) + white bloom | silver wordmark (✅ already right) |
| Feel | clean instrument panel, cool near-black, emerald-as-earned | cosmic silver + red, warm-gold residue in places |

**Conclusion:** the site is structurally the *same idea* as the app (dark, glass, mono readouts, live operable instruments, emerald-as-earned) but **chromatically a different brand.** The single biggest offender is the **blood-red accent + purple/red background fog.** This is a recolor + faithful-port job, not a rebuild. The expensive engineering (WebGL gating, error boundaries, fallbacks, reduced-motion, a11y, mobile breakpoints) all stays.

---

## 2. The target palette (the swap)

Kill red + purple. Cool + flatten the canvas to the app. Promote emerald.

```
--void / canvas      #0B0B0D  (near-black, app-true; was #000 + color fog)
--surface glass      rgba(16,16,24, .46)  (cool near-black — matches app GlassCard veil)
--text / silver      #E9EAF0  (keep — the app's silver-sheen display color)
--text-dim           #9A9BA6  (keep)
--accent  EMERALD    #34D399  ← replaces blood-red #B5384C everywhere it's a signal
--accent-deep        #10B981  (pressed / gradient end)
--cta-primary        #F5F5F5 white  (matches app primary button; emerald reserved for accent/active)
--pr-gold            #E0B054  (rare — the PR badge only, exactly like the app)
background pool      faint cool-white top-left + a whisper of emerald low — NO red, NO purple
```

Display numbers/wordmark keep the **silver sheen** (it's app-accurate). Emerald becomes the live signal. White is the primary button fill. Gold appears only on a "NEW PR" moment.

---

## 3. Section-by-section (recolor + the two real changes)

Mostly recolor. Two sections get a real upgrade so the site shows the *actual* app, not invented props.

1. **Hero** — keep the liquid silver wordmark. Recolor CTAs (primary white, ghost emerald-hairline), emerald scroll cue.
2. **01 · The Record** — ConsistencyOrb: **KEEP** (already the app's language). Recolor the 3-up readout; streak value already emerald. ✅ strongest asset.
3. **02 · Two Disciplines** — BB/PL glass cards: drop the blood-red BB tag/bullets → emerald (BB) vs bare silver (PL). De-warm.
4. **The Steel (3D)** — recolor the red rim light → emerald/cool-white. **Plus:** consider swapping the generic spinning steel ring for a 3D treatment of a real app surface (it's decorative + only loosely tied to the product). At minimum recolor; ideally earn its weight.
5. **03 · The Set** — LiveSet (the real app SetRow, interactive): **KEEP** — emerald completion already matches. De-warm its brown-black card → cool near-black.
6. **04 · Strength** — StrengthCurve: keep; recolor the blood-red peak dot → emerald; cool the value chip.
7. **Pricing** — annual active ring red → emerald; CTA red → white/emerald. Numbers keep counting up. $34.99/yr + $5.99/mo, 7-day trial (locked pricing).
8. **Private by design** — recolor only.
9. **Closing** — giant wordmark; CTA red → white "Download on iOS"; emerald oath accent.
10. **Footer** — recolor only.
11. **Legal (privacy/terms/delete-account)** — recolor the legacy `.legal-*`/`.nav` to match.
12. **OG image + favicon** — re-tune off the red/purple ember → near-black + emerald so link previews stop advertising the wrong brand.

---

## 4. Component verdicts (from the audit)

- **KEEP wholesale:** `LiquidGlass` (cool near-black + silver already), `ConsistencyOrb`, `LiveSet` (de-warm card), `LiquidWordmark`.
- **RESTYLE (recolor constants):** `CosmicBackground` (shader colors → near-black + emerald/cool, drop red), `StrengthCurve` (peak dot), `SteelScene` (rim light; consider replace).
- **The atmosphere:** flatten to app-true near-black with a faint *neutral* off-center pool (a centered/colored halo is the AI tell — the app deliberately avoids it).

---

## 5. Build sequence

1. Branch `feature/site-app-match` off `main` (don't touch live `main` until verified).
2. Recolor the token layer in `globals.css` (`--gold`/`--blood`/`--champagne` → emerald/silver/white) — this alone flips ~80% of the site since everything references tokens.
3. Recolor the JS color constants: `CosmicBackground` shader stops, `SteelScene` rim, `StrengthCurve` peak, `LiveSet`/`StrengthCurve` warm card bg → cool.
4. De-warm + polish the two "real app" sections (LiveSet, Strength).
5. Regenerate OG image + favicon palette.
6. `npm run build` clean, then visual QA on desktop + mobile (reduced-motion + no-WebGL fallbacks), zero horizontal scroll.
7. Show you a local preview before any deploy. You approve → merge → Vercel.

---

## 6. The one decision I need from you (everything else I'll decide)

The app shows **two** accent stories and I want to match the one you actually want front-and-center:

- **Emerald `#34D399`** — the constant across every app theme + the signature home surface (consistency, completion, streak). Cleanest, most unmistakably "awekn." **(my recommendation)**
- **Orange `#FF6B35`** — the literal accent of the app's *default* `graphite` theme (what a fresh install shows on buttons/active states), with emerald kept as the earned-signal.

I recommend **emerald-forward** (black + silver + emerald, white CTAs, gold only on PRs). But this is the one hard-to-reverse call, so I'm checking before I recolor the whole site.
