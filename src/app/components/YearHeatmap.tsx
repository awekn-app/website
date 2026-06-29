"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./YearHeatmap.module.css";

/* ════════════════════════════════════════════════════════════════════════
   THE YEAR - a full year of training on one screen.

   This replaces the decorative steel ring with the app's signature artifact:
   a 365-day training heatmap. A GitHub-style grid, 7 weekday rows x 53 week
   columns of small rounded cells. Each cell's brightness reads how hard you
   trained that day, mapped to a SINGLE-HUE silver alpha ladder:
     level 0 = a faint silver track (a rest day / no session)
     levels 1..4 = silver brightening toward near-white (harder days)

   It is meaningful, animated and live:
     - on entry (IntersectionObserver) the cells FILL ON in a left-to-right
       sweep, staggered by week-column (transform + opacity only, 60fps).
       reduced-motion paints them all instantly.
     - hover / focus / tap reads that day in a silver caption
       ("mar 3 - 2 sessions" or "rest day"), and the cell highlights.
     - keyboard: arrow-navigate the grid, the caption updates via aria-live.
     - a live, honest count: "247 days trained this year".

   Brand law honoured (black + silver + cosmic, NOT green):
     - cosmic silver (--champagne) IS every cell, label, count and caption.
       The alpha ladder is the ONLY way intensity is shown - one hue, never
       a rainbow scale.
     - --signal emerald is the ONE earned signal: a PERFECT WEEK (a column
       trained all 7 days) carries a faint emerald glow. Nothing else is
       emerald - not chrome, not labels, not tracks.
     - every numeral is --font-numeral, tabular-nums.
     - SSR-guarded; honors prefers-reduced-motion.
     - the grid is horizontally scrollable on narrow screens (touch-action
       pan-x), so it never breaks the page.

   Seed data is realistic-illustrative: a believable lifting year with build
   blocks, streaks, a deload week and a couple of gaps. Labelled "illustrative".
   ════════════════════════════════════════════════════════════════════════ */

const WEEKS = 53; // 53 week-columns covers a full 365/366-day year
const DAYS = 7; // mon..sun rows
const TOTAL = WEEKS * DAYS;

const MONTH_LABELS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
// weekday rows: we show only mon / wed / fri to keep the gutter quiet
const WEEKDAY_ROWS = ["mon", "", "wed", "", "fri", "", ""];

type Cell = {
  level: 0 | 1 | 2 | 3 | 4; // 0 = rest, 1..4 = session intensity
  sessions: number; // 0..3 sessions logged that day
  monthIdx: number; // 0..11, which calendar month this day falls in
  dayOfMonth: number; // 1..31
};

/* ── deterministic seed data ────────────────────────────────────────────
   A small seeded PRNG so the "year" is stable across renders / SSR (no
   hydration mismatch) yet looks organically varied. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildYear(): Cell[] {
  const rnd = mulberry32(20260629);
  const cells: Cell[] = [];

  // Map a flat day index (0..364) onto a calendar month/day, starting Jan 1.
  let monthIdx = 0;
  let dayOfMonth = 1;
  const advanceDate = () => {
    dayOfMonth += 1;
    if (dayOfMonth > MONTH_DAYS[monthIdx]) {
      dayOfMonth = 1;
      monthIdx = Math.min(11, monthIdx + 1);
    }
  };

  // A training "mesocycle" shape: training-load rises across a ~5-week block,
  // then a deload week, repeating. Plus a couple of intentional gap weeks
  // (travel / illness) where the lifter went dark.
  const gapWeeks = new Set([7, 8, 34]); // weeks that go (mostly) dark
  const deloadWeeks = new Set([5, 11, 17, 24, 30, 38, 45]); // lighter weeks
  // The rare PERFECT weeks: the lifter trained all 7 days (weekends included).
  // Kept to a genuine handful across the year so the earned emerald stays rare.
  const perfectWeeksSeed = new Set([14, 27, 41]); // 3 across 53 weeks

  for (let i = 0; i < TOTAL; i += 1) {
    const week = Math.floor(i / DAYS);
    const dow = i % DAYS; // 0 = mon .. 6 = sun
    const perfect = perfectWeeksSeed.has(week);

    // base weekly intent: how many days/how hard this week tends to be
    let weekBias = 0.62;
    if (gapWeeks.has(week)) weekBias = 0.08;
    else if (deloadWeeks.has(week)) weekBias = 0.42;
    else if (perfect) weekBias = 0.8;
    // a gentle seasonal swell (stronger spring + autumn blocks)
    weekBias += 0.12 * Math.sin((week / WEEKS) * Math.PI * 2);

    // most lifters rest the weekend; a perfect week trains straight through.
    // Weekend rest is decoupled from weekBias (a hard week still rests sunday),
    // so ordinary weeks land at ~4-5 trained days and a full 7/7 column only
    // happens on the seeded perfect weeks - keeping the earned emerald rare.
    // Weekday rest does scale a little with how light the week is.
    const weekdayRest = 0.14 * (1.2 - weekBias);
    const dowRest = dow === 6 ? 0.82 : dow === 5 ? 0.58 : weekdayRest;

    const roll = rnd();
    const isRest = perfect ? false : roll < dowRest;

    let level: Cell["level"] = 0;
    let sessions = 0;
    if (!isRest) {
      sessions = 1;
      // a heavy day can carry an extra accessory session
      if (rnd() < weekBias * 0.4) sessions = 2;
      if (rnd() < weekBias * 0.08) sessions = 3;
      // intensity tier from the week bias + a little noise
      const intensity = weekBias + (rnd() - 0.5) * 0.4;
      if (deloadWeeks.has(week)) level = 1;
      else if (intensity > 0.78) level = 4;
      else if (intensity > 0.6) level = 3;
      else if (intensity > 0.4) level = 2;
      else level = 1;
    }

    cells.push({ level, sessions, monthIdx, dayOfMonth });
    advanceDate();
  }

  // Guard the earned signal: any NON-seeded week that happened to fill all 7
  // days by chance gets its sunday turned back into a rest day, so a perfect
  // (fully-trained) column - and its emerald glow - only ever appears on the
  // intentional perfect weeks. The live "days trained" count stays honest
  // because it is derived from these same cells after this pass.
  for (let w = 0; w < WEEKS; w += 1) {
    if (perfectWeeksSeed.has(w)) continue;
    let full = true;
    for (let d = 0; d < DAYS; d += 1) {
      if (cells[w * DAYS + d].level === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      const sun = cells[w * DAYS + 6]; // sunday is row index 6
      sun.level = 0;
      sun.sessions = 0;
    }
  }

  return cells;
}

// A perfect week = a week-column where all 7 days were trained (level > 0).
function isPerfectWeek(cells: Cell[], week: number): boolean {
  for (let d = 0; d < DAYS; d += 1) {
    if (cells[week * DAYS + d].level === 0) return false;
  }
  return true;
}

// Month-label anchors: the column where each month first appears, so labels
// sit above roughly the right place along the top.
function monthAnchors(cells: Cell[]): { week: number; label: string }[] {
  const seen = new Set<number>();
  const out: { week: number; label: string }[] = [];
  for (let w = 0; w < WEEKS; w += 1) {
    const m = cells[w * DAYS].monthIdx; // the month at the top of this column
    if (!seen.has(m)) {
      seen.add(m);
      out.push({ week: w, label: MONTH_LABELS[m] });
    }
  }
  return out;
}

function captionFor(cell: Cell | null): string {
  if (!cell) return "hover a day to read it";
  const label = `${MONTH_LABELS[cell.monthIdx]} ${cell.dayOfMonth}`;
  if (cell.level === 0) return `${label} - rest day`;
  const n = cell.sessions;
  return `${label} - ${n} ${n === 1 ? "session" : "sessions"}`;
}

function prefersReduced(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function YearHeatmap() {
  const cells = useMemo(buildYear, []);
  const anchors = useMemo(() => monthAnchors(cells), [cells]);
  const perfectWeeks = useMemo(() => {
    const s = new Set<number>();
    for (let w = 0; w < WEEKS; w += 1) if (isPerfectWeek(cells, w)) s.add(w);
    return s;
  }, [cells]);

  // The honest live count: distinct days trained (level > 0).
  const daysTrained = useMemo(
    () => cells.reduce((n, c) => n + (c.level > 0 ? 1 : 0), 0),
    [cells],
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(false);

  // active = the day currently being read (hover / focus / keyboard).
  const [active, setActive] = useState<number | null>(null);

  // ── reduced-motion + entrance sweep ─────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      setEntered(true);
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);

    const el = gridRef.current;
    if (mq.matches || !el || typeof IntersectionObserver === "undefined") {
      setEntered(true);
      return () => mq.removeEventListener?.("change", apply);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      mq.removeEventListener?.("change", apply);
      io.disconnect();
    };
  }, []);

  // ── keyboard navigation across the grid ─────────────────────────────────
  // Roving over a flat index; index = week * 7 + dayOfWeek.
  const moveActive = useCallback(
    (delta: number, axis: "week" | "day") => {
      setActive((cur) => {
        const base = cur ?? 0;
        const week = Math.floor(base / DAYS);
        const day = base % DAYS;
        let nextWeek = week;
        let nextDay = day;
        if (axis === "week") nextWeek = week + delta;
        else nextDay = day + delta;
        if (nextWeek < 0 || nextWeek >= WEEKS) return cur;
        if (nextDay < 0 || nextDay >= DAYS) return cur;
        return nextWeek * DAYS + nextDay;
      });
    },
    [],
  );

  const onGridKey = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          moveActive(1, "week");
          break;
        case "ArrowLeft":
          e.preventDefault();
          moveActive(-1, "week");
          break;
        case "ArrowDown":
          e.preventDefault();
          moveActive(1, "day");
          break;
        case "ArrowUp":
          e.preventDefault();
          moveActive(-1, "day");
          break;
        case "Home":
          e.preventDefault();
          setActive(0);
          break;
        case "End":
          e.preventDefault();
          setActive(TOTAL - 1);
          break;
        default:
          break;
      }
    },
    [moveActive],
  );

  // keep the focused cell scrolled into view inside the scroller
  useEffect(() => {
    if (active == null) return;
    const el = gridRef.current?.querySelector<HTMLElement>(
      `[data-idx="${active}"]`,
    );
    el?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  const activeCell = active != null ? cells[active] : null;
  const caption = captionFor(activeCell);

  return (
    <div className={styles.shell} aria-label="Year training heatmap, interactive">
      {/* ── header: title + the honest live count ── */}
      <div className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.eyebrow}>the year</span>
          <h3 className={styles.title}>
            a full year of training, one screen
          </h3>
        </div>
        <div className={styles.countWrap} aria-hidden="true">
          <span className={styles.countNum}>{daysTrained}</span>
          <span className={styles.countLabel}>days trained this year</span>
        </div>
      </div>

      {/* ── the scroller (pan-x on touch; never breaks the page) ── */}
      <div className={styles.scroller}>
        <div className={styles.plot}>
          {/* month labels along the top */}
          <div className={styles.months} aria-hidden="true">
            {anchors.map((a) => (
              <span
                key={`${a.label}-${a.week}`}
                className={styles.month}
                style={{ gridColumn: a.week + 2 }}
              >
                {a.label}
              </span>
            ))}
          </div>

          <div className={styles.body}>
            {/* weekday labels down the left */}
            <div className={styles.weekdays} aria-hidden="true">
              {WEEKDAY_ROWS.map((w, i) => (
                <span key={i} className={styles.weekday}>
                  {w}
                </span>
              ))}
            </div>

            {/* the grid itself */}
            <div
              ref={gridRef}
              className={`${styles.grid} ${entered ? styles.entered : ""} ${
                reduced ? styles.reduced : ""
              }`}
              role="grid"
              tabIndex={0}
              aria-label="365 day training grid. Arrow keys move between days."
              onKeyDown={onGridKey}
              onFocus={() => setActive((a) => a ?? 0)}
              onPointerLeave={() => setActive(null)}
            >
              {Array.from({ length: WEEKS }, (_, w) => {
                const perfect = perfectWeeks.has(w);
                return (
                  <div
                    key={w}
                    className={`${styles.col} ${perfect ? styles.colPerfect : ""}`}
                    style={
                      {
                        "--col": w,
                      } as React.CSSProperties
                    }
                  >
                    {Array.from({ length: DAYS }, (_, d) => {
                      const idx = w * DAYS + d;
                      const cell = cells[idx];
                      const isActive = active === idx;
                      return (
                        <button
                          key={d}
                          type="button"
                          data-idx={idx}
                          tabIndex={-1}
                          className={`${styles.cell} ${
                            isActive ? styles.cellActive : ""
                          } ${perfect ? styles.cellPerfect : ""}`}
                          data-level={cell.level}
                          style={
                            {
                              "--row": d,
                            } as React.CSSProperties
                          }
                          aria-label={captionFor(cell)}
                          onPointerEnter={() => setActive(idx)}
                          onPointerDown={() => setActive(idx)}
                          onFocus={() => setActive(idx)}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── footer: live caption (aria-live) + the silver legend ── */}
      <div className={styles.foot}>
        <p className={styles.caption} aria-live="polite">
          {caption}
        </p>

        <div className={styles.legend} aria-hidden="true">
          <span className={styles.legendLabel}>less</span>
          <span className={styles.legendCell} data-level={0} />
          <span className={styles.legendCell} data-level={1} />
          <span className={styles.legendCell} data-level={2} />
          <span className={styles.legendCell} data-level={3} />
          <span className={styles.legendCell} data-level={4} />
          <span className={styles.legendLabel}>more</span>
        </div>
      </div>

      <p className={styles.note}>
        illustrative year · hover, focus or tap a day · arrow keys navigate
      </p>
    </div>
  );
}
