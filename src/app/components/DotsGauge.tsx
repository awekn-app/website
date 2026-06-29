"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./DotsGauge.module.css";

/* ════════════════════════════════════════════════════════════════════════
   THE DOTS GAUGE - a strength-score instrument, not a screenshot.

   You drag your bodyweight and your SBD total, flip male / female, and a
   bright-silver needle eases across a 180-degree arc to the live DOTS score.
   The big number sits under the dial in Inter tabular with the brand cosmic
   bloom; the classification band word reads in silver below it.

   The math is a faithful port of the app's powerlifting scorer at
   /Users/areeb/awekn/utils/pl-scoring.ts: the gender-specific 4th-degree
   polynomial denominator, score = total * (500 / denom), the male/female
   bodyweight clamps, plus lbToKg / kgToLb. A score is not an earned moment,
   so there is NO emerald anywhere here: needle, active arc and number are all
   silver / white / near-black, per the brand law.

   Motion law: transform / opacity only. The needle rotates by transform; the
   number ramps via requestAnimationFrame. Honors prefers-reduced-motion
   (snaps, no ramp). Both inputs are role="slider", pointer-drag + arrow-key
   operable, touch-action handled. SSR-guarded. No em-dashes.
   ════════════════════════════════════════════════════════════════════════ */

type Gender = "male" | "female";

/* ── DOTS math, ported verbatim from utils/pl-scoring.ts ── */
const DOTS_COEFFS = {
  male: {
    a: -0.000001093,
    b: 0.0007391293,
    c: -0.1918759221,
    d: 24.0900756,
    e: -307.75076,
  },
  female: {
    a: -0.0000010706,
    b: 0.0005158568,
    c: -0.1126655495,
    d: 13.6175032,
    e: -57.96288,
  },
} as const;

function calculateDOTS(bw: number, total: number, gender: Gender): number {
  // male 40-210, female 40-150 (same clamps as the app)
  const clampedBw =
    gender === "male"
      ? Math.max(40, Math.min(210, bw))
      : Math.max(40, Math.min(150, bw));
  const c = DOTS_COEFFS[gender];
  const denom =
    c.a * clampedBw ** 4 +
    c.b * clampedBw ** 3 +
    c.c * clampedBw ** 2 +
    c.d * clampedBw +
    c.e;
  if (denom <= 0) return 0;
  return Math.round(total * (500 / denom) * 100) / 100;
}

function lbToKg(lb: number): number {
  return lb * 0.453592;
}
function kgToLb(kg: number): number {
  return kg / 0.453592;
}

/* ── classification bands (illustrative thresholds) ── */
type Band = { min: number; max: number; label: string };
const BANDS: Band[] = [
  { min: 0, max: 200, label: "Beginner" },
  { min: 200, max: 300, label: "Intermediate" },
  { min: 300, max: 400, label: "Advanced" },
  { min: 400, max: Infinity, label: "Elite" },
];
function bandFor(score: number): string {
  return (BANDS.find((b) => score >= b.min && score < b.max) ?? BANDS[0]).label;
}

/* ── gauge range. The arc maps 0 -> GAUGE_MAX across 180deg. We tick at
   the band thresholds (200/300/400) so the dial is legible against bands. */
const GAUGE_MAX = 600; // a comfortable ceiling above Elite (400)
const BAND_TICKS = [0, 200, 300, 400, GAUGE_MAX];

/* ── input domains, kept in kg internally, displayed per the unit toggle ── */
const BW_MIN_KG = 40;
const BW_MAX_KG = 200;
const BW_STEP_KG = 0.5;

const TOTAL_MIN_KG = 100;
const TOTAL_MAX_KG = 1200;
const TOTAL_STEP_KG = 2.5;

type Unit = "kg" | "lb";

/* ── SVG geometry (fixed coordinate space, CSS scales it) ── */
const VB_W = 1000;
const VB_H = 600;
const CX = 500;
const CY = 500; // arc baseline sits low so the number can live above it
const R_OUT = 400; // outer arc radius
const R_TRACK = 360; // the silver track radius
const R_TICK_IN = 322; // inner end of a tick
const R_LABEL = 286; // band-threshold numerals
const NEEDLE_LEN = 322;
const NEEDLE_TAIL = 46;

// Convert a 0..1 fraction across the dial into an angle, then a point.
// 0 -> 180deg (left), 1 -> 0deg (right), sweeping the top semicircle.
function frac(score: number): number {
  return Math.max(0, Math.min(1, score / GAUGE_MAX));
}
function angleFor(f: number): number {
  // degrees, measured so that f=0 is at 180 and f=1 is at 0
  return 180 - f * 180;
}
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}
// Describe an arc path between two fractions on radius r (left-to-right sweep).
function arcPath(r: number, f0: number, f1: number): string {
  const a0 = angleFor(f0);
  const a1 = angleFor(f1);
  const p0 = polar(CX, CY, r, a0);
  const p1 = polar(CX, CY, r, a1);
  // always the minor-arc direction for a <=180deg span; sweep-flag 1 = clockwise
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${r} ${r} 0 0 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}

function prefersReduced(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Tidy a value: at most one decimal, drop trailing .0
function fmt1(v: number): string {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}
// Round to the unit's display grid for a clean readout.
function displayWeight(kg: number, unit: Unit): number {
  if (unit === "kg") return Math.round(kg * 2) / 2; // 0.5 grid
  return Math.round(kgToLb(kg)); // whole lb
}

export default function DotsGauge() {
  const uid = useId().replace(/[:]/g, "");
  const trackGradId = `dg-track-${uid}`;
  const activeGradId = `dg-active-${uid}`;
  const needleGlowId = `dg-needleglow-${uid}`;

  const [gender, setGender] = useState<Gender>("male");
  const [unit, setUnit] = useState<Unit>("kg");
  // canonical state is always kg
  const [bwKg, setBwKg] = useState<number>(90); // ~198 lb
  const [totalKg, setTotalKg] = useState<number>(500); // a believable raw SBD

  // live DOTS for the inputs
  const dots = useMemo(
    () => calculateDOTS(bwKg, totalKg, gender),
    [bwKg, totalKg, gender],
  );
  const band = useMemo(() => bandFor(dots), [dots]);

  /* ── needle + number ramp (raf, transform/opacity only) ── */
  const [needleDeg, setNeedleDeg] = useState<number>(() => angleFor(frac(dots)));
  const [scoreDisplay, setScoreDisplay] = useState<number>(dots);
  const needleTarget = useRef<number>(angleFor(frac(dots)));
  const scoreTarget = useRef<number>(dots);
  const rafId = useRef<number | null>(null);

  const ramp = useCallback(() => {
    if (prefersReduced()) {
      setNeedleDeg(needleTarget.current);
      setScoreDisplay(scoreTarget.current);
      return;
    }
    if (rafId.current != null) cancelAnimationFrame(rafId.current);
    const tick = () => {
      let stillNeedle = false;
      let stillScore = false;
      setNeedleDeg((cur) => {
        const t = needleTarget.current;
        const d = t - cur;
        if (Math.abs(d) < 0.05) return t;
        stillNeedle = true;
        return cur + d * 0.18; // stiff damped, no overshoot
      });
      setScoreDisplay((cur) => {
        const t = scoreTarget.current;
        const d = t - cur;
        if (Math.abs(d) < 0.05) return t;
        stillScore = true;
        return cur + d * 0.18;
      });
      if (stillNeedle || stillScore) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        rafId.current = null;
      }
    };
    rafId.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    needleTarget.current = angleFor(frac(dots));
    scoreTarget.current = dots;
    ramp();
  }, [dots, ramp]);

  useEffect(() => {
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  /* ── pointer drag scrubbing for each slider ──
     We scrub by horizontal travel along the rendered track width, so a full
     sweep across the control spans the whole domain. */
  const drag = useRef<{
    which: "bw" | "total";
    pointerId: number;
    startX: number;
    startVal: number;
    width: number;
  } | null>(null);
  const [activeDrag, setActiveDrag] = useState<"bw" | "total" | null>(null);

  const onTrackDown = useCallback(
    (e: React.PointerEvent, which: "bw" | "total") => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture?.(e.pointerId);
      const rect = el.getBoundingClientRect();
      // jump-to-position on the first press, then drag-refine
      const f = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const startVal = which === "bw" ? jumpBw(f) : jumpTotal(f);
      drag.current = {
        which,
        pointerId: e.pointerId,
        startX: e.clientX,
        startVal,
        width: rect.width,
      };
      setActiveDrag(which);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const jumpBw = useCallback((f: number) => {
    const v = snapKg(
      BW_MIN_KG + f * (BW_MAX_KG - BW_MIN_KG),
      BW_STEP_KG,
      BW_MIN_KG,
      BW_MAX_KG,
    );
    setBwKg(v);
    return v;
  }, []);
  const jumpTotal = useCallback((f: number) => {
    const v = snapKg(
      TOTAL_MIN_KG + f * (TOTAL_MAX_KG - TOTAL_MIN_KG),
      TOTAL_STEP_KG,
      TOTAL_MIN_KG,
      TOTAL_MAX_KG,
    );
    setTotalKg(v);
    return v;
  }, []);

  const onTrackMove = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    const dx = e.clientX - d.startX;
    if (d.which === "bw") {
      const span = BW_MAX_KG - BW_MIN_KG;
      const next = d.startVal + (dx / d.width) * span;
      setBwKg(snapKg(next, BW_STEP_KG, BW_MIN_KG, BW_MAX_KG));
    } else {
      const span = TOTAL_MAX_KG - TOTAL_MIN_KG;
      const next = d.startVal + (dx / d.width) * span;
      setTotalKg(snapKg(next, TOTAL_STEP_KG, TOTAL_MIN_KG, TOTAL_MAX_KG));
    }
  }, []);

  const endDrag = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    drag.current = null;
    setActiveDrag(null);
  }, []);

  /* ── keyboard on each slider ── */
  const bump = useCallback(
    (which: "bw" | "total", dir: 1 | -1, big: boolean) => {
      if (which === "bw") {
        const step = big ? BW_STEP_KG * 20 : BW_STEP_KG;
        setBwKg((v) => snapKg(v + dir * step, BW_STEP_KG, BW_MIN_KG, BW_MAX_KG));
      } else {
        const step = big ? TOTAL_STEP_KG * 8 : TOTAL_STEP_KG;
        setTotalKg((v) =>
          snapKg(v + dir * step, TOTAL_STEP_KG, TOTAL_MIN_KG, TOTAL_MAX_KG),
        );
      }
    },
    [],
  );

  const onKey = useCallback(
    (e: React.KeyboardEvent, which: "bw" | "total") => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          bump(which, 1, false);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          bump(which, -1, false);
          break;
        case "PageUp":
          e.preventDefault();
          bump(which, 1, true);
          break;
        case "PageDown":
          e.preventDefault();
          bump(which, -1, true);
          break;
        case "Home":
          e.preventDefault();
          if (which === "bw") setBwKg(BW_MIN_KG);
          else setTotalKg(TOTAL_MIN_KG);
          break;
        case "End":
          e.preventDefault();
          if (which === "bw") setBwKg(BW_MAX_KG);
          else setTotalKg(TOTAL_MAX_KG);
          break;
        default:
          break;
      }
    },
    [bump],
  );

  /* ── derived render values ── */
  const f = frac(dots);
  // the active arc fills from 0 to the current score fraction
  const activeArc = useMemo(() => arcPath(R_TRACK, 0, Math.max(f, 0.001)), [f]);
  const trackArc = useMemo(() => arcPath(R_TRACK, 0, 1), []);

  const scoreWhole = Math.round(scoreDisplay);
  const scoreFrac = Math.abs(scoreDisplay - scoreWhole);
  // show one decimal only while it is meaningfully non-integer (clean readout)
  const scoreText =
    scoreFrac > 0.04 ? scoreDisplay.toFixed(1) : String(scoreWhole);

  const bwShown = displayWeight(bwKg, unit);
  const totalShown = displayWeight(totalKg, unit);
  const unitLabel = unit;

  // fraction along each domain (for the slider thumbs)
  const bwFrac = (bwKg - BW_MIN_KG) / (BW_MAX_KG - BW_MIN_KG);
  const totalFrac = (totalKg - TOTAL_MIN_KG) / (TOTAL_MAX_KG - TOTAL_MIN_KG);

  return (
    <div className={styles.shell} aria-label="DOTS strength-score gauge, interactive">
      <div className={styles.card}>
        {/* ── header ── */}
        <header className={styles.head}>
          <div className={styles.headLeft}>
            <p className={styles.eyebrow}>strength score</p>
            <h3 className={styles.title}>DOTS</h3>
          </div>

          {/* male / female toggle */}
          <div
            className={styles.genderToggle}
            role="group"
            aria-label="Lifter category"
          >
            <button
              type="button"
              className={`${styles.genderBtn} ${gender === "male" ? styles.genderOn : ""}`}
              aria-pressed={gender === "male"}
              onClick={() => setGender("male")}
            >
              male
            </button>
            <button
              type="button"
              className={`${styles.genderBtn} ${gender === "female" ? styles.genderOn : ""}`}
              aria-pressed={gender === "female"}
              onClick={() => setGender("female")}
            >
              female
            </button>
          </div>
        </header>

        {/* ── the gauge ── */}
        <div className={styles.gaugeWrap}>
          <svg
            className={styles.gauge}
            viewBox={`0 0 ${VB_W} 430`}
            role="img"
            aria-hidden="true"
            preserveAspectRatio="xMidYMin meet"
          >
            <defs>
              {/* the resting track: faint silver, brighter toward the right */}
              <linearGradient id={trackGradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(233,234,240,0.10)" />
                <stop offset="55%" stopColor="rgba(233,234,240,0.16)" />
                <stop offset="100%" stopColor="rgba(233,234,240,0.26)" />
              </linearGradient>
              {/* the active arc: brighter silver -> white, lit */}
              <linearGradient id={activeGradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(154,155,166,0.85)" />
                <stop offset="70%" stopColor="rgba(233,234,240,0.96)" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
              <filter
                id={needleGlowId}
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
              >
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* the whole dial is drawn in CY=500 space; shift it up into the
                viewBox by translating, so the semicircle fills the 280-tall box */}
            <g transform={`translate(0, ${-(CY - R_OUT) + 8})`}>
              {/* resting track */}
              <path
                d={trackArc}
                className={styles.trackArc}
                stroke={`url(#${trackGradId})`}
              />

              {/* band-segment hairlines on the track (subtle separators) */}
              {BAND_TICKS.map((t) => {
                const tf = frac(t);
                const aDeg = angleFor(tf);
                const pOut = polar(CX, CY, R_TRACK + 14, aDeg);
                const pIn = polar(CX, CY, R_TICK_IN, aDeg);
                return (
                  <line
                    key={`tick-${t}`}
                    x1={pOut.x.toFixed(2)}
                    y1={pOut.y.toFixed(2)}
                    x2={pIn.x.toFixed(2)}
                    y2={pIn.y.toFixed(2)}
                    className={styles.majorTick}
                  />
                );
              })}

              {/* minor ticks every 50 points */}
              {Array.from({ length: GAUGE_MAX / 50 + 1 }, (_, i) => i * 50)
                .filter((t) => !BAND_TICKS.includes(t))
                .map((t) => {
                  const tf = frac(t);
                  const aDeg = angleFor(tf);
                  const pOut = polar(CX, CY, R_TRACK + 8, aDeg);
                  const pIn = polar(CX, CY, R_TRACK - 8, aDeg);
                  return (
                    <line
                      key={`minor-${t}`}
                      x1={pOut.x.toFixed(2)}
                      y1={pOut.y.toFixed(2)}
                      x2={pIn.x.toFixed(2)}
                      y2={pIn.y.toFixed(2)}
                      className={styles.minorTick}
                    />
                  );
                })}

              {/* threshold numerals (200 / 300 / 400) */}
              {[200, 300, 400].map((t) => {
                const tf = frac(t);
                const aDeg = angleFor(tf);
                const p = polar(CX, CY, R_LABEL, aDeg);
                return (
                  <text
                    key={`lab-${t}`}
                    x={p.x.toFixed(2)}
                    y={p.y.toFixed(2)}
                    className={styles.tickLabel}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {t}
                  </text>
                );
              })}

              {/* the active arc fills to the score */}
              <path
                d={activeArc}
                className={styles.activeArc}
                stroke={`url(#${activeGradId})`}
              />

              {/* the needle. Rotated via the SVG transform attribute about the
                  EXPLICIT hub point (CX, CY). Doing it this way (rather than CSS
                  transform-origin) makes the pivot independent of the parent
                  group's translate, so the needle sweeps cleanly about the hub.
                  The raf-driven angle eases the value; transform is the only
                  animated property. */}
              <g
                className={styles.needleGroup}
                transform={`rotate(${(-needleDeg).toFixed(3)}, ${CX}, ${CY})`}
              >
                <line
                  x1={CX - NEEDLE_TAIL}
                  y1={CY}
                  x2={CX + NEEDLE_LEN}
                  y2={CY}
                  className={styles.needle}
                  filter={`url(#${needleGlowId})`}
                />
                <circle cx={CX} cy={CY} r={18} className={styles.hubOuter} />
                <circle cx={CX} cy={CY} r={7} className={styles.hubInner} />
              </g>
            </g>
          </svg>

          {/* the big DOTS number + band, layered over the dial centre */}
          <div
            className={styles.readout}
            aria-live="polite"
            aria-label={`DOTS score ${scoreWhole}, ${band}`}
          >
            <span className={styles.scoreNum}>{scoreText}</span>
            <span className={styles.bandWord}>{band}</span>
          </div>
        </div>

        {/* ── inputs ── */}
        <div className={styles.controls}>
          {/* unit toggle sits with the inputs */}
          <div className={styles.unitRow}>
            <span className={styles.unitLabel}>units</span>
            <div
              className={styles.unitToggle}
              role="group"
              aria-label="Weight units"
            >
              <button
                type="button"
                className={`${styles.unitBtn} ${unit === "kg" ? styles.unitOn : ""}`}
                aria-pressed={unit === "kg"}
                onClick={() => setUnit("kg")}
              >
                kg
              </button>
              <button
                type="button"
                className={`${styles.unitBtn} ${unit === "lb" ? styles.unitOn : ""}`}
                aria-pressed={unit === "lb"}
                onClick={() => setUnit("lb")}
              >
                lb
              </button>
            </div>
          </div>

          {/* bodyweight slider */}
          <Control
            label="bodyweight"
            valueText={`${fmt1(bwShown)}`}
            unit={unitLabel}
            frac={bwFrac}
            active={activeDrag === "bw"}
            ariaMin={Math.round(
              unit === "kg" ? BW_MIN_KG : kgToLb(BW_MIN_KG),
            )}
            ariaMax={Math.round(
              unit === "kg" ? BW_MAX_KG : kgToLb(BW_MAX_KG),
            )}
            ariaNow={Math.round(bwShown)}
            ariaValueText={`${fmt1(bwShown)} ${unitLabel}`}
            onDown={(e) => onTrackDown(e, "bw")}
            onMove={onTrackMove}
            onUp={endDrag}
            onKey={(e) => onKey(e, "bw")}
            onDec={() => bump("bw", -1, false)}
            onInc={() => bump("bw", 1, false)}
            styles={styles}
          />

          {/* SBD total slider */}
          <Control
            label="sbd total"
            valueText={`${fmt1(totalShown)}`}
            unit={unitLabel}
            frac={totalFrac}
            active={activeDrag === "total"}
            ariaMin={Math.round(
              unit === "kg" ? TOTAL_MIN_KG : kgToLb(TOTAL_MIN_KG),
            )}
            ariaMax={Math.round(
              unit === "kg" ? TOTAL_MAX_KG : kgToLb(TOTAL_MAX_KG),
            )}
            ariaNow={Math.round(totalShown)}
            ariaValueText={`${fmt1(totalShown)} ${unitLabel}`}
            onDown={(e) => onTrackDown(e, "total")}
            onMove={onTrackMove}
            onUp={endDrag}
            onKey={(e) => onKey(e, "total")}
            onDec={() => bump("total", -1, false)}
            onInc={() => bump("total", 1, false)}
            styles={styles}
          />
        </div>

        <p className={styles.caption}>
          illustrative bands (beginner, intermediate, advanced, elite) · drag
          bodyweight and total
        </p>
      </div>
    </div>
  );
}

/* ── a single labelled slider control (squat-bracket stepper + drag track) ── */
function Control(props: {
  label: string;
  valueText: string;
  unit: string;
  frac: number;
  active: boolean;
  ariaMin: number;
  ariaMax: number;
  ariaNow: number;
  ariaValueText: string;
  onDown: (e: React.PointerEvent) => void;
  onMove: (e: React.PointerEvent) => void;
  onUp: (e: React.PointerEvent) => void;
  onKey: (e: React.KeyboardEvent) => void;
  onDec: () => void;
  onInc: () => void;
  styles: { readonly [k: string]: string };
}) {
  const {
    label,
    valueText,
    unit,
    frac,
    active,
    ariaMin,
    ariaMax,
    ariaNow,
    ariaValueText,
    onDown,
    onMove,
    onUp,
    onKey,
    onDec,
    onInc,
    styles: s,
  } = props;
  const pct = Math.max(0, Math.min(100, frac * 100));
  return (
    <div className={s.control}>
      <div className={s.controlTop}>
        <span className={s.controlLabel}>{label}</span>
        <span className={s.controlValue}>
          <span className={s.controlNum}>{valueText}</span>
          <span className={s.controlUnit}>{unit}</span>
        </span>
      </div>

      <div className={s.sliderRow}>
        <button
          type="button"
          className={s.step}
          aria-label={`Decrease ${label}`}
          onClick={onDec}
        >
          {"−"}
        </button>

        <div
          className={`${s.track} ${active ? s.trackActive : ""}`}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={ariaMin}
          aria-valuemax={ariaMax}
          aria-valuenow={ariaNow}
          aria-valuetext={ariaValueText}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={onKey}
        >
          <span className={s.trackFill} style={{ width: `${pct}%` }} />
          <span
            className={s.thumb}
            style={{ left: `${pct}%` }}
            aria-hidden="true"
          />
        </div>

        <button
          type="button"
          className={s.step}
          aria-label={`Increase ${label}`}
          onClick={onInc}
        >
          +
        </button>
      </div>
    </div>
  );
}

/* snap a kg value to its grid then clamp */
function snapKg(v: number, step: number, min: number, max: number): number {
  const snapped = Math.round(v / step) * step;
  // kill floating dust from the multiply
  const clean = Math.round(snapped * 100) / 100;
  return Math.min(max, Math.max(min, clean));
}
