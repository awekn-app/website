"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./ConsistencyStreak.module.css";

/* ════════════════════════════════════════════════════════════════════════
   THE CONSISTENCY STREAK - the clear, operable habit card.

   This REPLACES the abstract ConsistencyOrb. The orb's percentage ring read
   as a riddle ("very difficult to understand"); this is a concrete calendar
   month a stranger reads in one second: a big legible STREAK number up top,
   then a real 7-column month grid where TRAINED days are lit silver discs and
   rest / future days are dim hollow outlines. You SEE the pattern of work.

   Two things you can do, the way the app feels:
     1. READ - the lit days are the record. The shape of the month is the
        whole story; no decoding a ring required.
     2. WRITE - tap (or click, or keyboard Enter/Space) any reached day to
        toggle it trained. The fill scales + fades in, and the streak number
        and the plain-English summary line update LIVE. Drag across cells to
        paint several at once.

   Brand + motion law (matches LiveSet):
     - cosmic silver (--champagne) IS every lit day + all the chrome. The ONE
       earned signal, --signal emerald, appears ONLY when a full calendar week
       (a 7-day row, all trained) is kept: that row's weekday dots take a faint
       emerald tint as the reward. Nothing else is ever emerald.
     - every numeral is --font-numeral, tabular-nums.
     - transform / opacity only (60fps). reduced-motion snaps, no ramp.
     - pointer + touch + keyboard operable (roving tabindex, arrow-navigate,
       Enter/Space toggles), aria-pressed cells, aria-live streak. SSR-guarded.

   The data is illustrative - a strong-but-human month: a clean opening week
   kept whole (the emerald reward), an honest mid-month slip, a climb back.
   ════════════════════════════════════════════════════════════════════════ */

const WEEKDAYS = ["s", "m", "t", "w", "t", "f", "s"] as const;

// An illustrative 30-day month that starts on a Wednesday (3 leading blanks),
// so the grid shows real calendar shape. "Today" is day 21 - the live edge;
// days after it are the faint, not-yet-reached future.
const DAYS_IN_MONTH = 30;
const START_WEEKDAY = 3; // 0 = Sunday ... the 1st falls on a Wednesday
const TODAY = 21; // the live edge (1-based day-of-month)

// The seeded record up to today. Index 0 == day 1. `true` = trained.
// Built so the FIRST FULL CALENDAR WEEK (the Sun-Sat row spanning days 5-11)
// is kept whole - that row earns the one emerald tint. Then an honest slip
// around days 13-14, and a strong climb back into the current streak.
function buildSeed(): boolean[] {
  // day-of-month (1-based) -> trained
  const trained = new Set<number>([
    1, 2, 3, 4, // opening Wed-Sat
    5, 6, 7, 8, 9, 10, 11, // <- the kept full week (Sun..Sat) = emerald reward
    12, // strong into the next week
    // 13, 14 missed (the honest slip)
    15, 16, 17, 18, 19, 20, 21, // the climb back -> a live 7-day streak
  ]);
  const arr = new Array<boolean>(DAYS_IN_MONTH).fill(false);
  for (let d = 1; d <= DAYS_IN_MONTH; d++) arr[d - 1] = trained.has(d);
  return arr;
}

function prefersReduced(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// A filled, sharp tick used inside a lit cell - the same completion glyph
// grammar as LiveSet (Ionicons checkmark-sharp). Tiny, decorative, hidden.
function CellCheck() {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" aria-hidden="true">
      <path
        d="M4.6 12.3L9.6 17.6L19.6 6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export default function ConsistencyStreak() {
  // The month as a flat trained-state array (index 0 == day 1).
  const [days, setDays] = useState<boolean[]>(buildSeed);

  // reduced-motion flag (drives the CSS instrument-vs-theatre split).
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // ── derived readouts ─────────────────────────────────────────────────────
  // A day is "reached" if it's on or before today (you can only log the past
  // and today, not the future).
  const isReached = useCallback((day: number) => day <= TODAY, []);

  // Current streak: consecutive trained days counting back from today.
  const streak = useMemo(() => {
    let s = 0;
    for (let d = TODAY; d >= 1; d--) {
      if (days[d - 1]) s++;
      else break;
    }
    return s;
  }, [days]);

  // Summary: trained days vs days elapsed through today.
  const trainedSoFar = useMemo(() => {
    let n = 0;
    for (let d = 1; d <= TODAY; d++) if (days[d - 1]) n++;
    return n;
  }, [days]);

  // Which calendar week-rows are fully kept (all 7 cells trained). Those rows
  // earn the single emerald tint. A row is "full" only when every one of its
  // seven day-cells exists in this month AND is trained (leading/trailing
  // blank cells disqualify a row, by design - a partial week is not a kept
  // week).
  const fullWeeks = useMemo(() => {
    const set = new Set<number>();
    const rows = Math.ceil((START_WEEKDAY + DAYS_IN_MONTH) / 7);
    for (let row = 0; row < rows; row++) {
      let allTrained = true;
      for (let col = 0; col < 7; col++) {
        const day = row * 7 + col - START_WEEKDAY + 1;
        if (day < 1 || day > DAYS_IN_MONTH || !days[day - 1]) {
          allTrained = false;
          break;
        }
      }
      if (allTrained) set.add(row);
    }
    return set;
  }, [days]);

  // ── toggle a single reached day ──────────────────────────────────────────
  const toggleDay = useCallback(
    (day: number) => {
      if (!isReached(day)) return; // future days are not loggable
      setDays((prev) => {
        const next = [...prev];
        next[day - 1] = !next[day - 1];
        return next;
      });
    },
    [isReached],
  );

  // ── drag-to-paint across cells ───────────────────────────────────────────
  // On pointer-down we capture whether we're painting ON or OFF (the inverse
  // of the first cell's state), then every cell the pointer enters is set to
  // that target. Touch uses pointer events so it works on phones too.
  const paintTarget = useRef<boolean | null>(null);
  const paintingPointer = useRef<number | null>(null);
  const [painting, setPainting] = useState(false);

  const paintDay = useCallback(
    (day: number) => {
      if (!isReached(day) || paintTarget.current == null) return;
      const target = paintTarget.current;
      setDays((prev) => {
        if (prev[day - 1] === target) return prev;
        const next = [...prev];
        next[day - 1] = target;
        return next;
      });
    },
    [isReached],
  );

  const onCellPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>, day: number) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      if (!isReached(day)) return;
      // start a paint stroke whose target is the inverse of this cell
      paintTarget.current = !days[day - 1];
      paintingPointer.current = e.pointerId;
      setPainting(true);
      paintDay(day);
    },
    [days, isReached, paintDay],
  );

  const onCellPointerEnter = useCallback(
    (day: number) => {
      if (paintTarget.current == null) return;
      paintDay(day);
    },
    [paintDay],
  );

  // End the stroke anywhere (cells don't capture the pointer, so we listen on
  // window for the up/cancel to be robust if the pointer leaves the grid).
  useEffect(() => {
    if (!painting) return;
    const end = () => {
      paintTarget.current = null;
      paintingPointer.current = null;
      setPainting(false);
    };
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [painting]);

  // ── keyboard: roving focus across the grid ───────────────────────────────
  // One cell is in the tab order at a time (roving tabindex); arrows move
  // focus by one day or one week, Enter/Space toggles.
  const [focusDay, setFocusDay] = useState(1);
  const cellRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const focusCell = useCallback((day: number) => {
    const clamped = Math.min(DAYS_IN_MONTH, Math.max(1, day));
    setFocusDay(clamped);
    cellRefs.current.get(clamped)?.focus();
  }, []);

  const onCellKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, day: number) => {
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          focusCell(day + 1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          focusCell(day - 1);
          break;
        case "ArrowDown":
          e.preventDefault();
          focusCell(day + 7);
          break;
        case "ArrowUp":
          e.preventDefault();
          focusCell(day - 7);
          break;
        case "Home":
          e.preventDefault();
          focusCell(1);
          break;
        case "End":
          e.preventDefault();
          focusCell(DAYS_IN_MONTH);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          toggleDay(day);
          break;
        default:
          break;
      }
    },
    [focusCell, toggleDay],
  );

  // ── build the leading-blank + day cells for the 7-col grid ───────────────
  type Slot = { kind: "blank"; key: string } | { kind: "day"; day: number };
  const slots: Slot[] = useMemo(() => {
    const out: Slot[] = [];
    for (let i = 0; i < START_WEEKDAY; i++)
      out.push({ kind: "blank", key: `b${i}` });
    for (let d = 1; d <= DAYS_IN_MONTH; d++) out.push({ kind: "day", day: d });
    return out;
  }, []);

  // a slot's calendar-row index (for the emerald full-week tint)
  const rowOf = useCallback((slotIndex: number) => Math.floor(slotIndex / 7), []);

  return (
    <div
      className={`${styles.shell} ${reduced ? styles.reduced : ""}`}
      aria-label="Monthly training calendar, interactive"
    >
      <div className={styles.card}>
        {/* ── header: eyebrow + the big legible streak number ── */}
        <header className={styles.head}>
          <div className={styles.headLeft}>
            <p className={styles.eyebrow}>this month</p>
            <h3 className={styles.title}>training streak</h3>
          </div>
          <div
            className={styles.streak}
            aria-live="polite"
            aria-label={`${streak} day streak`}
          >
            <span className={styles.streakNum}>{streak}</span>
            <span className={styles.streakUnit}>day streak</span>
          </div>
        </header>

        {/* ── weekday header row ── */}
        <div className={styles.weekHead} aria-hidden="true">
          {WEEKDAYS.map((w, i) => (
            <span key={i} className={styles.weekday}>
              {w}
            </span>
          ))}
        </div>

        {/* ── the month grid: the hero. tap / drag / keyboard ── */}
        <div
          className={`${styles.grid} ${painting ? styles.gridPainting : ""}`}
          role="group"
          aria-label="Days of the month. Use arrow keys to move, Enter or Space to toggle a day trained."
        >
          {slots.map((slot, idx) => {
            if (slot.kind === "blank") {
              return <span key={slot.key} className={styles.blank} aria-hidden="true" />;
            }
            const day = slot.day;
            const trained = days[day - 1];
            const reached = isReached(day);
            const future = !reached;
            const today = day === TODAY;
            const weekEarned = fullWeeks.has(rowOf(idx));

            const cls = [
              styles.cell,
              trained ? styles.cellTrained : styles.cellRest,
              future ? styles.cellFuture : "",
              today ? styles.cellToday : "",
              weekEarned ? styles.cellEarned : "",
            ]
              .filter(Boolean)
              .join(" ");

            const stateWord = future ? "future" : trained ? "trained" : "rest";
            return (
              <button
                key={day}
                type="button"
                ref={(el) => {
                  if (el) cellRefs.current.set(day, el);
                  else cellRefs.current.delete(day);
                }}
                className={cls}
                // roving tabindex: exactly one cell is tabbable
                tabIndex={day === focusDay ? 0 : -1}
                aria-pressed={trained}
                aria-disabled={future || undefined}
                aria-label={`day ${day}, ${stateWord}${today ? ", today" : ""}`}
                onPointerDown={(e) => onCellPointerDown(e, day)}
                onPointerEnter={() => onCellPointerEnter(day)}
                onKeyDown={(e) => onCellKey(e, day)}
                onFocus={() => setFocusDay(day)}
              >
                <span className={styles.cellDisc}>
                  <span className={styles.cellGlyph}>
                    <CellCheck />
                  </span>
                </span>
                <span className={styles.cellNum}>{day}</span>
              </button>
            );
          })}
        </div>

        {/* ── plain-English summary, updates live ── */}
        <p className={styles.summary} aria-live="polite">
          trained <span className={styles.summaryNum}>{trainedSoFar}</span> of{" "}
          <span className={styles.summaryNum}>{TODAY}</span> days so far
        </p>

        {/* honest caption */}
        <p className={styles.caption}>
          illustrative record · tap or drag a day to log it
        </p>
      </div>
    </div>
  );
}
