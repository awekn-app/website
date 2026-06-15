"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./LiveSet.module.css";

/* ════════════════════════════════════════════════════════════════════════
   THE LIVE SET — the owned, operable centerpiece.

   This is the app's real workout SetRow, rebuilt to run in the browser. It is
   not a screenshot. You drag the weight, hit the round check, and the exact
   in-app completion grammar fires: the row border + fill ease to --emerald, the
   outline check swaps to a filled sharp checkmark, a soft 0.97 -> 1 pulse runs,
   and the header e1RM ticks up via requestAnimationFrame.

   Brand law honoured:
     - gold (--champagne) IS the text in instrument contexts; --emerald is the
       EARNED signal, fired ONLY on completion (never decoration).
     - every numeral is --font-numeral (JetBrains Mono), tabular-nums.
     - transform / opacity / clip-path only (60fps). scale(0.97) on :active.
     - reduced-motion: snap, no animation, no raf ramp.
     - keyboard operable (arrows scrub weight, space/enter complete), SSR-guarded.

   Faithful to /Users/areeb/awekn/components/workout/SetRow.tsx:
     - PREVIOUS column in muted mono, the true U+00D7 multiplication sign.
     - set-number badge fills emerald + white numeral on completion.
     - completed row gets the rgba(52,211,153,…) wash + rounded inset.
     - 44x44 round check, checkmark -> checkmark-sharp swap.
   ════════════════════════════════════════════════════════════════════════ */

const STEP = 2.5; // kg per scrub step — the app's plate-math increment
const MIN_W = 20; // an empty bar floor
const MAX_W = 360; // a sane ceiling so a runaway drag never breaks layout
const PX_PER_STEP = 8; // horizontal pixels of drag per 2.5 kg

type Row = {
  id: number;
  prev: string; // the muted "last time" reference, already formatted
  weight: number;
  reps: number;
  done: boolean;
};

const INITIAL_ROWS: Row[] = [
  { id: 1, prev: "100 × 5", weight: 100, reps: 5, done: false },
  { id: 2, prev: "100 × 5", weight: 102.5, reps: 5, done: false },
  { id: 3, prev: "102.5 × 3", weight: 105, reps: 3, done: false },
];

// Epley. weight * (1 + reps / 30). The single source of truth for the readout.
function epley(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}

// Tidy a kg value to at most one decimal, dropping a trailing .0 so the
// readout stays mono-clean ("100" not "100.0", but "102.5" stays).
function fmtKg(v: number): string {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

function clampWeight(v: number): number {
  // snap to the 2.5 grid, then clamp
  const snapped = Math.round(v / STEP) * STEP;
  return Math.min(MAX_W, Math.max(MIN_W, snapped));
}

function prefersReduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* The two checkmark glyphs, drawn as SVG so we control the exact stroke/fill.
   Outline = the un-done state (thin stroke). Sharp = the completed state
   (a filled, heavier tick), mirroring Ionicons checkmark -> checkmark-sharp. */
function CheckOutline() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M5 12.5L10 17.5L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CheckSharp() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M4.5 12.2L9.6 17.6L19.6 6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export default function LiveSet() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);

  // The header e1RM is the running BEST across completed sets — that is what
  // the app surfaces (your top working estimate today). It animates toward its
  // target via raf when a set lands.
  const [e1rmDisplay, setE1rmDisplay] = useState(0);
  const e1rmTarget = useRef(0);
  const rafId = useRef<number | null>(null);

  // Drag bookkeeping, kept in a ref so pointermove never re-binds.
  const drag = useRef<{
    rowId: number;
    startX: number;
    startWeight: number;
    pointerId: number;
    moved: boolean;
  } | null>(null);
  const [scrubbingId, setScrubbingId] = useState<number | null>(null);

  // ── e1RM raf ramp ──────────────────────────────────────────────────────
  const animateE1rm = useCallback(() => {
    if (prefersReduced()) {
      setE1rmDisplay(e1rmTarget.current);
      return;
    }
    if (rafId.current != null) cancelAnimationFrame(rafId.current);
    const tick = () => {
      setE1rmDisplay((cur) => {
        const target = e1rmTarget.current;
        const delta = target - cur;
        if (Math.abs(delta) < 0.15) {
          rafId.current = null;
          return target;
        }
        // stiff damped approach — no overshoot, just a decelerating climb
        const next = cur + delta * 0.16;
        rafId.current = requestAnimationFrame(tick);
        return next;
      });
    };
    rafId.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // Recompute the best-completed e1RM whenever rows change, then ramp to it.
  const retarget = useCallback(
    (next: Row[]) => {
      const best = next
        .filter((r) => r.done)
        .reduce((m, r) => Math.max(m, epley(r.weight, r.reps)), 0);
      e1rmTarget.current = best;
      animateE1rm();
    },
    [animateE1rm],
  );

  // ── mutate weight (scrub / buttons / keyboard) ─────────────────────────
  const setWeight = useCallback((id: number, w: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, weight: clampWeight(w) } : r)),
    );
  }, []);

  const bumpWeight = useCallback(
    (id: number, dir: 1 | -1) => {
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, weight: clampWeight(r.weight + dir * STEP) } : r,
        ),
      );
    },
    [],
  );

  // ── completion: the app's exact toggle ─────────────────────────────────
  const toggleComplete = useCallback(
    (id: number) => {
      setRows((prev) => {
        const next = prev.map((r) =>
          r.id === id ? { ...r, done: !r.done } : r,
        );
        retarget(next);
        return next;
      });
    },
    [retarget],
  );

  // ── pointer scrubbing ──────────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent, row: Row) => {
      // ignore right-click / non-primary
      if (e.button !== 0 && e.pointerType === "mouse") return;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      drag.current = {
        rowId: row.id,
        startX: e.clientX,
        startWeight: row.weight,
        pointerId: e.pointerId,
        moved: false,
      };
      setScrubbingId(row.id);
    },
    [],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.pointerId) return;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 3) d.moved = true;
      const steps = Math.round(dx / PX_PER_STEP);
      setWeight(d.rowId, d.startWeight + steps * STEP);
    },
    [setWeight],
  );

  const endDrag = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    drag.current = null;
    setScrubbingId(null);
  }, []);

  // ── keyboard on the weight readout ─────────────────────────────────────
  const onWeightKey = useCallback(
    (e: React.KeyboardEvent, id: number) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        bumpWeight(id, 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        bumpWeight(id, -1);
      }
    },
    [bumpWeight],
  );

  const e1rmWhole = Math.round(e1rmDisplay);

  return (
    <div className={styles.shell} aria-label="Live workout set, interactive">
      {/* the liquid-glass card */}
      <div className={styles.card}>
        {/* ── card header: exercise + the live e1RM readout ── */}
        <header className={styles.head}>
          <div className={styles.headLeft}>
            <p className={styles.session}>Push Day · #11</p>
            <h3 className={styles.exercise}>Bench Press</h3>
          </div>
          <div
            className={styles.readout}
            aria-live="polite"
            aria-label={`Estimated one rep max ${e1rmWhole} kilograms`}
          >
            <span className={styles.readoutLabel}>e1RM</span>
            <span className={styles.readoutValue}>
              <span className={styles.readoutNum}>{e1rmWhole || "—"}</span>
              <span className={styles.readoutUnit}>kg</span>
            </span>
          </div>
        </header>

        {/* ── column legend ── */}
        <div className={styles.legend} aria-hidden="true">
          <span className={styles.legSet}>SET</span>
          <span className={styles.legPrev}>PREVIOUS</span>
          <span className={styles.legWeight}>KG</span>
          <span className={styles.legReps}>REPS</span>
          <span className={styles.legCheck} />
        </div>

        {/* ── the three set rows ── */}
        <ul className={styles.rows}>
          {rows.map((row) => {
            const isScrub = scrubbingId === row.id;
            return (
              <li
                key={row.id}
                className={`${styles.row} ${row.done ? styles.rowDone : ""}`}
                data-pulse={row.done ? "on" : undefined}
              >
                {/* set number badge */}
                <span
                  className={styles.setBadge}
                  aria-hidden="true"
                >
                  {row.id}
                </span>

                {/* PREVIOUS reference column */}
                <span className={styles.prev} title="Last session">
                  {row.prev}
                </span>

                {/* scrubbable weight */}
                <div
                  className={`${styles.weightWrap} ${isScrub ? styles.weightScrub : ""}`}
                >
                  <button
                    type="button"
                    className={styles.step}
                    aria-label={`Decrease set ${row.id} weight by ${STEP} kilograms`}
                    onClick={() => bumpWeight(row.id, -1)}
                  >
                    −
                  </button>

                  <span
                    role="slider"
                    tabIndex={0}
                    aria-label={`Set ${row.id} weight`}
                    aria-valuemin={MIN_W}
                    aria-valuemax={MAX_W}
                    aria-valuenow={row.weight}
                    aria-valuetext={`${fmtKg(row.weight)} kilograms`}
                    className={styles.weight}
                    onPointerDown={(e) => onPointerDown(e, row)}
                    onPointerMove={onPointerMove}
                    onPointerUp={endDrag}
                    onPointerCancel={endDrag}
                    onKeyDown={(e) => onWeightKey(e, row.id)}
                  >
                    {fmtKg(row.weight)}
                  </span>

                  <button
                    type="button"
                    className={styles.step}
                    aria-label={`Increase set ${row.id} weight by ${STEP} kilograms`}
                    onClick={() => bumpWeight(row.id, 1)}
                  >
                    +
                  </button>
                </div>

                {/* the multiplication sign */}
                <span className={styles.times} aria-hidden="true">
                  {"×"}
                </span>

                {/* reps */}
                <span className={styles.reps} aria-label={`${row.reps} reps`}>
                  {row.reps}
                </span>

                {/* the 44x44 round check */}
                <button
                  type="button"
                  className={styles.check}
                  aria-pressed={row.done}
                  aria-label={
                    row.done
                      ? `Mark set ${row.id} incomplete`
                      : `Complete set ${row.id}`
                  }
                  onClick={() => toggleComplete(row.id)}
                >
                  <span className={styles.checkGlyph}>
                    {row.done ? <CheckSharp /> : <CheckOutline />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* honest caption */}
        <p className={styles.caption}>
          illustrative record · drag the weight, then complete a set
        </p>
      </div>
    </div>
  );
}
