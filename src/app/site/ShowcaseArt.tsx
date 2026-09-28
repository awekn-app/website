"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Phone } from "./Phone";
import type { Screen } from "./Phone";
import { Mark } from "./brand/Brand";
import s from "./ShowcaseArt.module.css";

/** Adds `data-run` while the element is on screen, so its CSS loops only play when they can be seen. */
function useRunWhileVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.setAttribute("data-run", "");
      else el.removeAttribute("data-run");
    }, { rootMargin: "120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

const WORDS: readonly { text: string; style: "solid" | "outline" | "heat" }[] = [
  { text: "Every set", style: "solid" },
  { text: "Every rep", style: "heat" },
  { text: "Every meal", style: "outline" },
  { text: "Every weigh-in", style: "solid" },
  { text: "Every record", style: "outline" },
];

/**
 * THE BAND: the gym in one line. Heavy display type between two strips of barbell knurling, moving
 * slowly sideways (transform only, and only while on screen); still for reduced motion.
 */
export function Band() {
  const ref = useRunWhileVisible<HTMLDivElement>();
  const run = (
    <>
      {WORDS.map((w) => (
        <span key={w.text} className={s.item}>
          <span className={`${s.word} ${s[w.style]}`}>{w.text}</span>
          <Mark tone="current" className={s.sep} />
        </span>
      ))}
    </>
  );
  return (
    <div className={s.band} ref={ref} role="img" aria-label="Every set, every rep, every meal, every weigh-in, every record.">
      <div className={s.knurl} />
      <div className={s.track} aria-hidden="true">
        <div className={s.run}>{run}</div>
        <div className={s.run}>{run}</div>
      </div>
      <div className={s.knurl} />
    </div>
  );
}

const COLUMNS: readonly (readonly Screen[])[] = [
  ["weight", "session", "calories", "supplements", "records"],
  ["home", "muscles", "deadlift", "journal", "food"],
  ["active", "cardio", "consistency", "squat", "workout"],
];

/**
 * The wall itself: app screens on one tilted plane, columns drifting in opposite directions, looping
 * only while on screen (transform only; still for reduced motion). Decorative: the real screens are
 * in the tour with their words. `className` sizes and places it for its room.
 */
export function WallBackdrop({ columns = COLUMNS, className, sizes = "(min-width: 900px) 220px, 32vw" }: { columns?: readonly (readonly Screen[])[]; className?: string; sizes?: string }) {
  const ref = useRunWhileVisible<HTMLDivElement>();
  return (
    <div className={`${s.wall} ${className ?? ""}`} ref={ref} aria-hidden="true">
      {columns.map((col, c) => (
        <div key={c} className={`${s.col} ${c % 2 === 1 ? s.down : s.up}`}>
          {[0, 1].map((copy) => (
            <div key={copy} className={s.colRun}>
              {col.map((sc, i) => (
                <Phone key={`${copy}-${sc}-${i}`} screen={sc} sizes={sizes} className={s.wallPhone} decorative />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** THE WALL, closing the page: every screen behind the closing line. */
export function Wall({ children }: { children: ReactNode }) {
  return (
    <div className={s.wallRoom}>
      <WallBackdrop />
      <div className={s.veil} aria-hidden="true" />
      <div className={s.front}>{children}</div>
    </div>
  );
}
