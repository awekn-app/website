"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./RpeCalculator.module.css";

/* ════════════════════════════════════════════════════════════════════════
   THE RPE CALCULATOR - an operable autoregulation instrument.

   You enter what you actually lifted (weight x reps, at a felt RPE) and the
   panel reads back your estimated one-rep max, the way a competitive
   powerlifter back-solves a top single from a sub-maximal set. It is not a
   screenshot. Drag or step the weight, tap a rep count, tap an RPE, and the
   big silver readout eases to the new e1RM via requestAnimationFrame while the
   thin track fills to the corresponding % of 1RM.

   Math is a faithful port of /Users/areeb/awekn/utils/rpe-chart.ts:
     - RPE_TABLE (percent of 1RM by reps 1-10 x RPE 6-10 in 0.5 steps),
       the Tuchscherer / RTS standard.
     - getPercentage(reps, rpe): clamp reps 1-10, snap rpe to nearest 0.5.
     - calculateE1RM(weight, reps, rpe) = weight / (pct / 100), rounded 1dp.

   Brand law honoured:
     - everything is silver / white / near-black. NO emerald: this is a
       calculator, not an earned moment. (No PR flourish added.)
     - every numeral is --font-numeral (Inter), tabular-nums.
     - the hero e1RM carries the cosmic-bloom white text-shadow.
     - transform / opacity only (60fps). reduced-motion snaps, no raf ramp.
     - keyboard operable: weight is role="slider" (arrows scrub, Home/End to
       the rails); reps + RPE are radio-grouped chips (arrows move, Enter sets).
   ════════════════════════════════════════════════════════════════════════ */

// ── ported math (no cross-repo import) ─────────────────────────────────────
// RPE_TABLE[reps][rpe] = percentage of 1RM. Reps 1-10, RPE 6-10 in 0.5 steps.
const RPE_TABLE: Record<number, Record<number, number>> = {
  1: { 10: 100, 9.5: 98, 9: 96, 8.5: 94, 8: 92, 7.5: 89, 7: 86, 6.5: 84, 6: 82 },
  2: { 10: 95, 9.5: 93, 9: 92, 8.5: 89, 8: 87, 7.5: 85, 7: 82, 6.5: 80, 6: 78 },
  3: { 10: 92, 9.5: 90, 9: 88, 8.5: 86, 8: 84, 7.5: 81, 7: 79, 6.5: 77, 6: 75 },
  4: { 10: 89, 9.5: 87, 9: 85, 8.5: 83, 8: 81, 7.5: 79, 7: 76, 6.5: 74, 6: 72 },
  5: { 10: 86, 9.5: 84, 9: 82, 8.5: 80, 8: 78, 7.5: 75, 7: 73, 6.5: 71, 6: 69 },
  6: { 10: 83, 9.5: 81, 9: 79, 8.5: 77, 8: 75, 7.5: 73, 7: 71, 6.5: 69, 6: 67 },
  7: { 10: 80, 9.5: 78, 9: 76, 8.5: 74, 8: 72, 7.5: 70, 7: 68, 6.5: 66, 6: 64 },
  8: { 10: 77, 9.5: 75, 9: 73, 8.5: 71, 8: 69, 7.5: 67, 7: 65, 6.5: 63, 6: 61 },
  9: { 10: 74, 9.5: 72, 9: 70, 8.5: 68, 8: 66, 7.5: 64, 7: 62, 6.5: 60, 6: 58 },
  10: { 10: 71, 9.5: 69, 9: 67, 8.5: 65, 8: 63, 7.5: 61, 7: 59, 6.5: 57, 6: 55 },
};

const RPE_VALUES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];
const REP_RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function getPercentage(reps: number, rpe: number): number | null {
  const clampedReps = Math.max(1, Math.min(10, Math.round(reps)));
  const row = RPE_TABLE[clampedReps];
  if (!row) return null;
  const snappedRpe = Math.round(rpe * 2) / 2;
  return row[snappedRpe] ?? null;
}

function calculateE1RM(weight: number, reps: number, rpe: number): number | null {
  const pct = getPercentage(reps, rpe);
  if (!pct || pct === 0) return null;
  return Math.round((weight / (pct / 100)) * 10) / 10;
}

// ── weight scrubbing constants ─────────────────────────────────────────────
const KG_STEP = 2.5; // the app's plate-math increment in kg
const LB_STEP = 5; // standard plate increment in lb
const MIN_KG = 20; // an empty bar floor (kg)
const MAX_KG = 360; // a sane kg ceiling so a runaway drag never breaks layout
const KG_PER_LB = 0.45359237;
const PX_PER_STEP = 9; // horizontal pixels of drag per one step

type Unit = "kg" | "lb";

// reps-in-reserve label for each RPE (10 = 0 left, 6 = ~4 left).
function reserveLabel(rpe: number): string {
  const left = 10 - rpe;
  if (left <= 0) return "max";
  if (left === 1) return "1 left";
  // halves render cleanly: "1.5 left", "2 left", etc.
  const r = Number.isInteger(left) ? String(left) : left.toFixed(1);
  return `${r} left`;
}

// Tidy a number to at most one decimal, dropping a trailing .0.
function fmtNum(v: number): string {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

// step / floor / ceiling for the active unit
function unitStep(unit: Unit): number {
  return unit === "kg" ? KG_STEP : LB_STEP;
}
function unitMin(unit: Unit): number {
  return unit === "kg" ? MIN_KG : Math.round((MIN_KG / KG_PER_LB) / LB_STEP) * LB_STEP; // ~45
}
function unitMax(unit: Unit): number {
  return unit === "kg" ? MAX_KG : Math.round((MAX_KG / KG_PER_LB) / LB_STEP) * LB_STEP; // ~795
}

// snap to the unit grid, then clamp to the unit rails
function clampWeight(v: number, unit: Unit): number {
  const step = unitStep(unit);
  const snapped = Math.round(v / step) * step;
  return Math.min(unitMax(unit), Math.max(unitMin(unit), snapped));
}

function prefersReduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function RpeCalculator() {
  const [unit, setUnit] = useState<Unit>("kg");
  const [weight, setWeightState] = useState(140); // kg, illustrative starting load
  const [reps, setReps] = useState(5);
  const [rpe, setRpe] = useState(8);

  // The hero e1RM eases to its target via raf. We hold the displayed number in
  // state and the target in a ref so the ramp never re-binds.
  const [e1rmDisplay, setE1rmDisplay] = useState(0);
  const e1rmTarget = useRef(0);
  const rafId = useRef<number | null>(null);

  // drag bookkeeping kept in a ref so pointermove never re-renders the binding
  const drag = useRef<{
    startX: number;
    startWeight: number;
    pointerId: number;
    moved: boolean;
  } | null>(null);
  const [scrubbing, setScrubbing] = useState(false);

  // weight is stored canonically in kg; convert on read/write for lb
  const displayWeight = unit === "kg" ? weight : weight / KG_PER_LB;
  const pct = getPercentage(reps, rpe) ?? 0;
  const e1rmKg = calculateE1RM(weight, reps, rpe) ?? 0;
  const e1rmDisplayTarget = unit === "kg" ? e1rmKg : e1rmKg / KG_PER_LB;

  // ── e1RM raf ramp ────────────────────────────────────────────────────────
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
        if (Math.abs(delta) < 0.1) {
          rafId.current = null;
          return target;
        }
        // stiff damped approach, no overshoot - a decelerating settle
        const next = cur + delta * 0.18;
        rafId.current = requestAnimationFrame(tick);
        return next;
      });
    };
    rafId.current = requestAnimationFrame(tick);
  }, []);

  // retarget whenever any input (or the unit) changes
  useEffect(() => {
    e1rmTarget.current = e1rmDisplayTarget;
    animateE1rm();
  }, [e1rmDisplayTarget, animateE1rm]);

  useEffect(() => {
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  // ── weight mutation (canonical kg) ─────────────────────────────────────────
  // setWeightInUnit takes a value in the CURRENT unit, clamps it on that grid,
  // then stores the kg equivalent.
  const setWeightInUnit = useCallback(
    (valInUnit: number, u: Unit) => {
      const clamped = clampWeight(valInUnit, u);
      setWeightState(u === "kg" ? clamped : clamped * KG_PER_LB);
    },
    [],
  );

  const bumpWeight = useCallback(
    (dir: 1 | -1) => {
      const cur = unit === "kg" ? weight : weight / KG_PER_LB;
      setWeightInUnit(cur + dir * unitStep(unit), unit);
    },
    [unit, weight, setWeightInUnit],
  );

  const toRail = useCallback(
    (which: "min" | "max") => {
      setWeightInUnit(which === "min" ? unitMin(unit) : unitMax(unit), unit);
    },
    [unit, setWeightInUnit],
  );

  // ── unit toggle: convert + re-snap onto the new grid ───────────────────────
  const toggleUnit = useCallback(
    (next: Unit) => {
      if (next === unit) return;
      // re-snap the canonical kg value onto the new unit's grid for clean steps
      const valInNext = next === "kg" ? weight : weight / KG_PER_LB;
      setWeightInUnit(valInNext, next);
      setUnit(next);
    },
    [unit, weight, setWeightInUnit],
  );

  // ── pointer scrubbing on the weight ────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      drag.current = {
        startX: e.clientX,
        startWeight: unit === "kg" ? weight : weight / KG_PER_LB,
        pointerId: e.pointerId,
        moved: false,
      };
      setScrubbing(true);
    },
    [unit, weight],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.pointerId) return;
      const dx = e.clientX - d.startX;
      if (Math.abs(dx) > 3) d.moved = true;
      const steps = Math.round(dx / PX_PER_STEP);
      setWeightInUnit(d.startWeight + steps * unitStep(unit), unit);
    },
    [unit, setWeightInUnit],
  );

  const endDrag = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    drag.current = null;
    setScrubbing(false);
  }, []);

  // ── keyboard on the weight slider ──────────────────────────────────────────
  const onWeightKey = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          bumpWeight(1);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          bumpWeight(-1);
          break;
        case "Home":
          e.preventDefault();
          toRail("min");
          break;
        case "End":
          e.preventDefault();
          toRail("max");
          break;
        default:
          break;
      }
    },
    [bumpWeight, toRail],
  );

  // ── keyboard on the rep / rpe chip groups (roving radio) ───────────────────
  const onRepKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setReps((r) => Math.min(10, r + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setReps((r) => Math.max(1, r - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setReps(1);
    } else if (e.key === "End") {
      e.preventDefault();
      setReps(10);
    }
  }, []);

  const onRpeKey = useCallback((e: React.KeyboardEvent) => {
    const idx = RPE_VALUES.indexOf(rpe);
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setRpe(RPE_VALUES[Math.min(RPE_VALUES.length - 1, idx + 1)]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setRpe(RPE_VALUES[Math.max(0, idx - 1)]);
    } else if (e.key === "Home") {
      e.preventDefault();
      setRpe(RPE_VALUES[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      setRpe(RPE_VALUES[RPE_VALUES.length - 1]);
    }
  }, [rpe]);

  const e1rmWhole = Math.round(e1rmDisplay);
  const e1rmFrac = fmtNum(e1rmDisplay); // unused for hero, kept for aria
  const pctWidth = Math.max(0, Math.min(100, pct)); // the % of 1RM bar fill

  return (
    <div className={styles.shell} aria-label="RPE to estimated one rep max calculator, interactive">
      <div className={styles.card}>
        {/* ── header + the live e1RM hero readout ── */}
        <header className={styles.head}>
          <div className={styles.headLeft}>
            <p className={styles.kicker}>autoregulation</p>
            <h3 className={styles.title}>
              rpe <span className={styles.titleSerif}>e1RM</span>
            </h3>
          </div>
          <div className={styles.unitToggle} role="group" aria-label="Weight unit">
            <button
              type="button"
              className={`${styles.unitBtn} ${unit === "kg" ? styles.unitOn : ""}`}
              aria-pressed={unit === "kg"}
              onClick={() => toggleUnit("kg")}
            >
              kg
            </button>
            <button
              type="button"
              className={`${styles.unitBtn} ${unit === "lb" ? styles.unitOn : ""}`}
              aria-pressed={unit === "lb"}
              onClick={() => toggleUnit("lb")}
            >
              lb
            </button>
          </div>
        </header>

        {/* ── the hero readout ── */}
        <div
          className={styles.hero}
          aria-live="polite"
          aria-label={`Estimated one rep max ${e1rmFrac} ${unit === "kg" ? "kilograms" : "pounds"}, at ${pct} percent of one rep max`}
        >
          <span className={styles.heroLabel}>estimated 1rm</span>
          <span className={styles.heroValue}>
            <span className={styles.heroNum}>{e1rmWhole || "-"}</span>
            <span className={styles.heroUnit}>{unit}</span>
          </span>
          <span className={styles.heroSub}>
            at <span className={styles.heroSubNum}>{pct}%</span> of 1rm
          </span>

          {/* the thin silver % of 1RM track (the value is stated above as
              "at NN% of 1rm", so the bar stays clean with no end label) */}
          <div className={styles.track} aria-hidden="true">
            <span
              className={styles.trackFill}
              style={{ transform: `scaleX(${pctWidth / 100})` }}
            />
          </div>
        </div>

        {/* ── WEIGHT: scrub + stepper ── */}
        <section className={styles.control}>
          <div className={styles.controlHead}>
            <span className={styles.controlLabel}>weight</span>
            <span className={styles.controlHint}>drag or step</span>
          </div>
          <div className={`${styles.weightWrap} ${scrubbing ? styles.weightScrub : ""}`}>
            <button
              type="button"
              className={styles.step}
              aria-label={`Decrease weight by ${unitStep(unit)} ${unit}`}
              onClick={() => bumpWeight(-1)}
            >
              {"−"}
            </button>

            <span
              role="slider"
              tabIndex={0}
              aria-label="Weight lifted"
              aria-valuemin={unitMin(unit)}
              aria-valuemax={unitMax(unit)}
              aria-valuenow={Math.round(displayWeight * 10) / 10}
              aria-valuetext={`${fmtNum(displayWeight)} ${unit === "kg" ? "kilograms" : "pounds"}`}
              className={styles.weight}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onKeyDown={onWeightKey}
            >
              <span className={styles.weightNum}>{fmtNum(displayWeight)}</span>
              <span className={styles.weightUnit}>{unit}</span>
            </span>

            <button
              type="button"
              className={styles.step}
              aria-label={`Increase weight by ${unitStep(unit)} ${unit}`}
              onClick={() => bumpWeight(1)}
            >
              +
            </button>
          </div>
        </section>

        {/* ── REPS: chip row 1-10 ── */}
        <section className={styles.control}>
          <div className={styles.controlHead}>
            <span className={styles.controlLabel}>reps</span>
            <span className={styles.controlHint}>{reps} done</span>
          </div>
          <div
            className={styles.chips}
            role="radiogroup"
            aria-label="Reps completed"
            onKeyDown={onRepKey}
          >
            {REP_RANGE.map((r) => {
              const on = r === reps;
              return (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  className={`${styles.chip} ${on ? styles.chipOn : ""}`}
                  onClick={() => setReps(r)}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── RPE: chip row 6-10 with reps-in-reserve label ── */}
        <section className={styles.control}>
          <div className={styles.controlHead}>
            <span className={styles.controlLabel}>rpe</span>
            <span className={styles.controlHint}>{reserveLabel(rpe)}</span>
          </div>
          <div
            className={`${styles.chips} ${styles.chipsRpe}`}
            role="radiogroup"
            aria-label="Rate of perceived exertion"
            onKeyDown={onRpeKey}
          >
            {RPE_VALUES.map((v) => {
              const on = v === rpe;
              return (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={`RPE ${fmtNum(v)}, ${reserveLabel(v)}`}
                  tabIndex={on ? 0 : -1}
                  className={`${styles.chip} ${styles.chipRpe} ${on ? styles.chipOn : ""}`}
                  onClick={() => setRpe(v)}
                >
                  {fmtNum(v)}
                </button>
              );
            })}
          </div>
        </section>

        {/* honest caption */}
        <p className={styles.caption}>
          illustrative set · tuchscherer rpe chart · drag the weight, tap reps and rpe
        </p>
      </div>
    </div>
  );
}
