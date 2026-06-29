"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./TracksGrid.module.css";

/* ════════════════════════════════════════════════════════════════════════
   THE BREADTH - the all-in-one value, made concrete.

   awekn is not a workout logger with a calorie tab bolted on. It tracks a LOT:
   strength, cardio, macros, supplements, peptides, the body itself, every PR,
   consistency, and a full powerlifting meet engine. This grid makes that
   instantly legible: a premium bento of nine tracks, each a silver-glass card
   with a drawn line-art glyph (never an emoji, never an icon font), a lowercase
   title, and a one-line sub a stranger understands in a second.

   Brand law honoured (black + silver + cosmic, NOT green):
     - cosmic silver (--champagne / --gold-dim) is the glyph + text + ALL chrome.
       There is NO --signal emerald here and NO other color - a breadth grid is
       not an "earned moment", so it stays purely silver / white / near-black.
     - Inter type, lowercase labels, every glyph is inline SVG line-art at
       1.5-2px strokes (currentColor, no fills).
     - the only motion is a quiet transform/opacity entrance stagger + a
       pointer:fine hover lift. Reduced-motion snaps everything visible.
     - SSR-guarded IntersectionObserver, keyboard/pointer agnostic (static
       content), no em-dashes.

   GRID: 3 columns (bento, two feature cells span 2) -> 2 columns at 880px ->
   1 column at 540px. Breakpoints live in TracksGrid.module.css.
   ════════════════════════════════════════════════════════════════════════ */

type Track = {
  key: string;
  title: string;
  sub: string;
  glyph: React.ReactNode;
};

/* Shared SVG frame: 28x28 viewBox, silver line-art via currentColor, 1.7px
   strokes with round joins. Each glyph genuinely draws its thing. */
const SV = {
  width: 26,
  height: 26,
  viewBox: "0 0 28 28",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/* (1) workouts - a loaded barbell (sleeve + two plates each side) */
function GlyphBarbell() {
  return (
    <svg className={styles.glyph} {...SV}>
      <line x1="2.5" y1="14" x2="25.5" y2="14" />
      <line x1="5" y1="9.5" x2="5" y2="18.5" />
      <line x1="7.5" y1="8" x2="7.5" y2="20" />
      <line x1="23" y1="9.5" x2="23" y2="18.5" />
      <line x1="20.5" y1="8" x2="20.5" y2="20" />
    </svg>
  );
}

/* (2) cardio + steps - a running figure mid-stride */
function GlyphRunner() {
  return (
    <svg className={styles.glyph} {...SV}>
      <circle cx="17.5" cy="5.5" r="2.2" />
      <path d="M16.5 9.5L11.5 12.5L14 15.5L12.5 21.5" />
      <path d="M14 15.5L18.5 16.5L20.5 21" />
      <path d="M11.5 12.5L7.5 11.5" />
      <path d="M16.5 9.5L20.5 11" />
    </svg>
  );
}

/* (3) macros + calories - a flame over a plate baseline (food energy) */
function GlyphFlame() {
  return (
    <svg className={styles.glyph} {...SV}>
      <path d="M14 4.5C14 4.5 9 8.5 9 13.5C9 16.8 11.2 19 14 19C16.8 19 19 16.8 19 13.5C19 11.8 18 10.5 18 10.5C18 12 17 12.8 16.2 12.8C16.2 9.5 14 4.5 14 4.5Z" />
      <line x1="6" y1="23" x2="22" y2="23" />
    </svg>
  );
}

/* (4) supplements - a two-tone capsule with the seam line */
function GlyphCapsule() {
  return (
    <svg className={styles.glyph} {...SV}>
      <rect x="5.5" y="9.5" width="17" height="9" rx="4.5" transform="rotate(-32 14 14)" />
      <line x1="11.5" y1="17.4" x2="16.5" y2="10.6" />
    </svg>
  );
}

/* (5) peptides / regimen - a tasteful, compliant vial + syringe (no labels) */
function GlyphVial() {
  return (
    <svg className={styles.glyph} {...SV}>
      {/* vial */}
      <path d="M8.5 4.5H13.5" />
      <path d="M9.5 4.5V8.5L8 11V22.5C8 23.3 8.7 24 9.5 24H12.5C13.3 24 14 23.3 14 22.5V11L12.5 8.5V4.5" />
      <line x1="8" y1="15.5" x2="14" y2="15.5" />
      {/* syringe */}
      <path d="M17 13L24 6" />
      <path d="M19.5 9.5L21.5 11.5" />
      <path d="M15.5 14.5L17.5 16.5" />
      <line x1="16" y1="16" x2="14.8" y2="17.2" />
    </svg>
  );
}

/* (6) body - a balance scale (weight + measurements) */
function GlyphScale() {
  return (
    <svg className={styles.glyph} {...SV}>
      <rect x="5" y="6" width="18" height="16" rx="3" />
      <path d="M10.5 22V18.5C10.5 16.6 12 15 14 15C16 15 17.5 16.6 17.5 18.5V22" />
      <line x1="14" y1="6" x2="14" y2="9.5" />
      <circle cx="14" cy="11" r="1.4" />
    </svg>
  );
}

/* (7) PRs + e1RM - a rising data plot with an arrowhead (every lift, plotted) */
function GlyphChart() {
  return (
    <svg className={styles.glyph} {...SV}>
      <path d="M4 22V4" />
      <path d="M4 22H24" />
      <polyline points="6.5,18 11,14 14.5,16 22,7" />
      <polyline points="18.5,7 22,7 22,10.5" />
    </svg>
  );
}

/* (8) consistency + streaks - a flame kept honest (a steady streak) */
function GlyphStreak() {
  return (
    <svg className={styles.glyph} {...SV}>
      <path d="M14 3.5C14 3.5 8.5 7.5 8.5 13.5C8.5 17.6 11 21 14 21C17 21 19.5 17.6 19.5 13.5C19.5 11.2 18.5 9.5 18.5 9.5C18.5 11.5 17.3 12.5 16.3 12.5C16.3 8.5 14 3.5 14 3.5Z" />
      <path d="M14 21V25" />
      <path d="M11 24H17" />
    </svg>
  );
}

/* (9) powerlifting - a winner's podium (meets, DOTS, attempts) */
function GlyphPodium() {
  return (
    <svg className={styles.glyph} {...SV}>
      <rect x="10" y="8" width="8" height="16" rx="1" />
      <rect x="2.5" y="14" width="7.5" height="10" rx="1" />
      <rect x="18" y="12" width="7.5" height="12" rx="1" />
      <path d="M14 4.5L15 6.5L17 6.8L15.5 8.3L15.9 10.3L14 9.3L12.1 10.3L12.5 8.3L11 6.8L13 6.5Z" />
    </svg>
  );
}

const TRACKS: Track[] = [
  {
    key: "workouts",
    title: "workouts",
    sub: "splits, supersets, BB and PL",
    glyph: <GlyphBarbell />,
  },
  {
    key: "cardio",
    title: "cardio + steps",
    sub: "synced from apple health and health connect",
    glyph: <GlyphRunner />,
  },
  {
    key: "macros",
    title: "macros + calories",
    sub: "food search, daily goals",
    glyph: <GlyphFlame />,
  },
  {
    key: "supplements",
    title: "supplements",
    sub: "daily stack, adherence kept",
    glyph: <GlyphCapsule />,
  },
  {
    key: "peptides",
    title: "peptides / regimen",
    sub: "fully private, no preset names",
    glyph: <GlyphVial />,
  },
  {
    key: "body",
    title: "body",
    sub: "weight, measurements, progress photos",
    glyph: <GlyphScale />,
  },
  {
    key: "prs",
    title: "prs + e1rm",
    sub: "every lift, plotted over time",
    glyph: <GlyphChart />,
  },
  {
    key: "consistency",
    title: "consistency + streaks",
    sub: "kept honest, never inflated",
    glyph: <GlyphStreak />,
  },
  {
    key: "powerlifting",
    title: "powerlifting",
    sub: "dots, wilks, meets and attempts",
    glyph: <GlyphPodium />,
  },
];

export default function TracksGrid() {
  // entrance stagger: cells rest offset, then ride in once the grid scrolls
  // into view. SSR-guarded + reduced-motion aware (snaps shown immediately).
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setShown(true);
      return;
    }
    const node = gridRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div className={styles.shell} aria-label="Everything awekn tracks">
      <div className={styles.grid} ref={gridRef}>
        {TRACKS.map((t, i) => (
          <article
            key={t.key}
            className={styles.cell}
            data-shown={shown ? "true" : "false"}
            style={{ ["--enter-delay" as string]: `${i * 45}ms` }}
          >
            <span className={styles.glyphTile}>{t.glyph}</span>
            <div className={styles.copy}>
              <h3 className={styles.title}>{t.title}</h3>
              <p className={styles.sub}>{t.sub}</p>
            </div>
          </article>
        ))}
      </div>
      <p className={styles.caption}>one log for all of it</p>
    </div>
  );
}
