"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./PlateLoader.module.css";

/* ════════════════════════════════════════════════════════════════════════
   THE PLATE LOADER - the tactile, operable centerpiece.

   This is the app's real barbell plate-math, rebuilt to run in the browser as
   a machined instrument. It is not a picture of a barbell. You drag across the
   bar (or tap +/-, or arrow-key) to set a target; the greedy per-side fill
   runs live and the exact plates spin ON/OFF a silver olympic sleeve, largest
   inboard, mirrored on both ends. A big silver readout blooms the total.

   Math ported faithfully (NOT imported) from
   /Users/areeb/awekn/utils/plate-calculator.ts:
     PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25]
     PLATES_LB = [45, 35, 25, 10, 5, 2.5]
     BAR_KG = 20, BAR_LB = 45
     remaining = (target - bar) / 2 per side, greedy descending fill,
     totalWeight = bar + actualPerSide * 2, formatPlates() summary.

   Brand law honoured:
     - pure silver / white / near-black. NO emerald here: loading a bar is not
       an earned moment, so the rare --signal stays unspent.
     - every numeral is --font-numeral, tabular-nums.
     - transform / opacity only on the moving plates (60fps); reduced-motion
       snaps them with no scale/spin ramp.
     - the bar track is role="slider", keyboard operable (arrows / Home / End),
       pointer-drag with touch-action:none so the page never fights the scrub.
   ════════════════════════════════════════════════════════════════════════ */

type Unit = "kg" | "lb";

const PLATES_KG = [25, 20, 15, 10, 5, 2.5, 1.25];
const PLATES_LB = [45, 35, 25, 10, 5, 2.5];
const BAR_KG = 20;
const BAR_LB = 45;

// the loadable grid: a step is one "smallest pair" - kg 2.5/side = 5 total,
// lb 5/side = 10 total - exactly what the +/- stepper and arrow keys nudge by.
const STEP_TOTAL: Record<Unit, number> = { kg: 5, lb: 10 };
const MAX_TOTAL: Record<Unit, number> = { kg: 260, lb: 585 };

type PerSide = { plate: number; count: number };
type PlateResult = {
  barWeight: number;
  perSide: PerSide[];
  totalWeight: number;
  unit: Unit;
};

// ── the faithful greedy port ───────────────────────────────────────────────
function calculatePlates(targetWeight: number, unit: Unit): PlateResult {
  const barWeight = unit === "kg" ? BAR_KG : BAR_LB;
  const plates = unit === "kg" ? PLATES_KG : PLATES_LB;

  if (targetWeight <= barWeight) {
    return { barWeight, perSide: [], totalWeight: barWeight, unit };
  }

  let remaining = (targetWeight - barWeight) / 2; // per side
  const perSide: PerSide[] = [];

  for (const plate of plates) {
    if (remaining >= plate) {
      const count = Math.floor(remaining / plate);
      perSide.push({ plate, count });
      remaining -= plate * count;
    }
  }

  const actualPerSide = perSide.reduce((s, p) => s + p.plate * p.count, 0);
  const totalWeight = barWeight + actualPerSide * 2;
  return { barWeight, perSide, totalWeight, unit };
}

// formatPlates-style per-side summary, e.g. "25 + 15 + 5 + 2.5 per side".
// We expand counts (so 2x20 reads "20 + 20") since the bar shows discs, not "2×".
function formatPerSide(result: PlateResult): string {
  if (result.perSide.length === 0) return "bar only";
  const discs: number[] = [];
  for (const p of result.perSide) {
    for (let i = 0; i < p.count; i++) discs.push(p.plate);
  }
  return discs.map(fmtNum).join(" + ") + " per side";
}

// tidy a value: drop a trailing .0 (45 not 45.0) but keep 2.5 / 1.25.
function fmtNum(v: number): string {
  const r = Math.round(v * 100) / 100;
  return Number.isInteger(r) ? String(r) : String(r);
}

// snap a free target onto the loadable grid for the unit, then clamp.
function snap(target: number, unit: Unit): number {
  const step = STEP_TOTAL[unit];
  const bar = unit === "kg" ? BAR_KG : BAR_LB;
  // grid is bar + k*step (an empty bar is always loadable)
  const k = Math.round((target - bar) / step);
  const snapped = bar + Math.max(0, k) * step;
  return Math.min(MAX_TOTAL[unit], Math.max(bar, snapped));
}

// kg <-> lb conversion, then re-snapped to the destination unit's grid so the
// toggle always lands on a genuinely loadable bar.
function convert(total: number, from: Unit, to: Unit): number {
  if (from === to) return total;
  const raw = from === "kg" ? total * 2.2046226218 : total / 2.2046226218;
  return snap(raw, to);
}

// ── plate geometry: a stable visual identity per denomination ───────────────
// HEIGHT scales with denomination (heavier = taller disc, real olympic feel).
// Each plate keeps a fixed silver tone + width so a 20 always looks like a 20
// regardless of unit. Heights are tuned per unit so the sets read distinctly.
type PlateSpec = { h: number; w: number; tone: number }; // h,w in SVG units, tone 0..1

const SPEC_KG: Record<number, PlateSpec> = {
  25: { h: 168, w: 17, tone: 0.96 },
  20: { h: 150, w: 16, tone: 0.9 },
  15: { h: 132, w: 15, tone: 0.84 },
  10: { h: 112, w: 14, tone: 0.78 },
  5: { h: 90, w: 12, tone: 0.72 },
  2.5: { h: 70, w: 11, tone: 0.66 },
  1.25: { h: 54, w: 10, tone: 0.6 },
};
const SPEC_LB: Record<number, PlateSpec> = {
  45: { h: 168, w: 17, tone: 0.96 },
  35: { h: 146, w: 16, tone: 0.88 },
  25: { h: 126, w: 14.5, tone: 0.8 },
  10: { h: 104, w: 13, tone: 0.74 },
  5: { h: 84, w: 11.5, tone: 0.68 },
  2.5: { h: 66, w: 10.5, tone: 0.62 },
};

function specFor(plate: number, unit: Unit): PlateSpec {
  const table = unit === "kg" ? SPEC_KG : SPEC_LB;
  return table[plate] ?? { h: 60, w: 10, tone: 0.6 };
}

// a stable key per physical disc so React keeps identity across re-fills and
// only the truly-new discs spin in (and removed discs spin out).
type Disc = { key: string; plate: number; idx: number };

function discsFromResult(result: PlateResult): Disc[] {
  const out: Disc[] = [];
  for (const p of result.perSide) {
    for (let i = 0; i < p.count; i++) {
      out.push({ key: `${p.plate}-${i}`, plate: p.plate, idx: i });
    }
  }
  return out;
}

export default function PlateLoader() {
  const [unit, setUnit] = useState<Unit>("kg");
  // target is always a snapped, loadable total for the current unit.
  const [target, setTarget] = useState<number>(100);

  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number } | null>(null);
  const [scrubbing, setScrubbing] = useState(false);

  const result = useMemo(() => calculatePlates(target, unit), [target, unit]);
  const discs = useMemo(() => discsFromResult(result), [result]);
  const summary = useMemo(() => formatPerSide(result), [result]);
  const reactKeyBase = useId();

  const bar = unit === "kg" ? BAR_KG : BAR_LB;
  const min = bar;
  const max = MAX_TOTAL[unit];
  const step = STEP_TOTAL[unit];

  // ── mutate target ─────────────────────────────────────────────────────────
  const setSnapped = useCallback(
    (v: number) => setTarget(snap(v, unit)),
    [unit],
  );

  const bump = useCallback(
    (dir: 1 | -1) => setTarget((t) => snap(t + dir * step, unit)),
    [step, unit],
  );

  // ── unit toggle: convert + re-snap so the loaded bar stays sensible ─────────
  const toggleUnit = useCallback(() => {
    setUnit((u) => {
      const next: Unit = u === "kg" ? "lb" : "kg";
      setTarget((t) => convert(t, u, next));
      return next;
    });
  }, []);

  // ── pointer scrub across the bar/track ──────────────────────────────────────
  const targetFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return target;
      const rect = el.getBoundingClientRect();
      const ratio = (clientX - rect.left) / rect.width;
      const clamped = Math.min(1, Math.max(0, ratio));
      return snap(min + clamped * (max - min), unit);
    },
    [max, min, target, unit],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
      drag.current = { pointerId: e.pointerId };
      setScrubbing(true);
      setTarget(targetFromClientX(e.clientX));
    },
    [targetFromClientX],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.pointerId) return;
      setTarget(targetFromClientX(e.clientX));
    },
    [targetFromClientX],
  );

  const endDrag = useCallback((e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.pointerId) return;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    drag.current = null;
    setScrubbing(false);
  }, []);

  // ── keyboard on the track ──────────────────────────────────────────────────
  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          bump(1);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          bump(-1);
          break;
        case "Home":
          e.preventDefault();
          setTarget(min);
          break;
        case "End":
          e.preventDefault();
          setTarget(max);
          break;
        case "PageUp":
          e.preventDefault();
          setTarget((t) => snap(t + step * 4, unit));
          break;
        case "PageDown":
          e.preventDefault();
          setTarget((t) => snap(t - step * 4, unit));
          break;
        default:
          break;
      }
    },
    [bump, max, min, step, unit],
  );

  // honor reduced-motion for the plate spin (set a flag the SVG reads)
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  const fillRatio = (target - min) / (max - min);

  // ── SVG layout ──────────────────────────────────────────────────────────────
  // a single horizontal barbell, centered. The sleeve holds discs growing
  // outward from the inner collar; we render the LEFT stack and mirror it RIGHT.
  const VB_W = 880;
  const VB_H = 260;
  const cx = VB_W / 2;
  const cy = VB_H / 2;

  const SHAFT_HALF = 70; // half the central knurled shaft length
  const COLLAR_W = 16; // inner collar ring width
  const SLEEVE_LEN = 250; // each loadable sleeve length
  const PLATE_GAP = 2; // gap between adjacent discs

  // compute left-stack disc x-offsets (inner edge of first disc at the collar)
  const leftStart = cx - SHAFT_HALF - COLLAR_W; // inner end of left sleeve
  let cursor = leftStart;
  const placed = discs.map((d) => {
    const spec = specFor(d.plate, unit);
    const x = cursor - spec.w; // disc occupies [x, x+w]
    cursor = x - PLATE_GAP;
    return { ...d, spec, x };
  });

  const totalWhole = fmtNum(target);
  const isBarOnly = result.perSide.length === 0;

  return (
    <div className={styles.shell} aria-label="Barbell plate loader, interactive">
      <div className={styles.card}>
        {/* ── header: title + the big total readout + unit toggle ── */}
        <header className={styles.head}>
          <div className={styles.headLeft}>
            <p className={styles.kicker}>plate math</p>
            <h3 className={styles.title}>Load the bar</h3>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={unit === "lb"}
            aria-label={`Units: ${unit}. Toggle kilograms or pounds.`}
            className={styles.unitToggle}
            onClick={toggleUnit}
          >
            <span
              className={`${styles.unitOpt} ${unit === "kg" ? styles.unitOn : ""}`}
            >
              kg
            </span>
            <span
              className={`${styles.unitOpt} ${unit === "lb" ? styles.unitOn : ""}`}
            >
              lb
            </span>
            <span
              aria-hidden="true"
              className={styles.unitThumb}
              data-unit={unit}
            />
          </button>
        </header>

        {/* ── the big silver total, cosmic-bloomed ── */}
        <div
          className={styles.readout}
          aria-live="polite"
          aria-label={`Total ${totalWhole} ${unit}`}
        >
          <span className={styles.readoutNum}>{totalWhole}</span>
          <span className={styles.readoutUnit}>{unit}</span>
        </div>

        {/* ── the barbell SVG ── */}
        <div className={styles.barWrap}>
          <svg
            className={styles.svg}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="img"
            aria-label={`Barbell loaded to ${totalWhole} ${unit}: ${summary}, bar ${bar} ${unit}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* machined silver disc face - vertical light, dark core, top spec */}
              <linearGradient id={`${reactKeyBase}-disc`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F4F5FA" />
                <stop offset="14%" stopColor="#C9CAD4" />
                <stop offset="50%" stopColor="#8C8D98" />
                <stop offset="86%" stopColor="#5A5B66" />
                <stop offset="100%" stopColor="#3A3B45" />
              </linearGradient>
              {/* the silver sleeve gradient (horizontal cylinder shading) */}
              <linearGradient id={`${reactKeyBase}-sleeve`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E3E4EC" />
                <stop offset="30%" stopColor="#A9AAB6" />
                <stop offset="55%" stopColor="#777884" />
                <stop offset="100%" stopColor="#3F4049" />
              </linearGradient>
              {/* the knurled shaft gradient */}
              <linearGradient id={`${reactKeyBase}-shaft`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D6D7DF" />
                <stop offset="34%" stopColor="#9596A2" />
                <stop offset="60%" stopColor="#646571" />
                <stop offset="100%" stopColor="#34353E" />
              </linearGradient>
              {/* a soft white specular blob used at each disc's top edge */}
              <linearGradient id={`${reactKeyBase}-spec`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>
              {/* faint additive bloom behind the loaded sleeves */}
              <radialGradient id={`${reactKeyBase}-bloom`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.10" />
                <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.03" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* cosmic bloom behind the bar */}
            <ellipse
              cx={cx}
              cy={cy}
              rx={VB_W * 0.46}
              ry={70}
              fill={`url(#${reactKeyBase}-bloom)`}
            />

            {/* ── the two loadable sleeves (left + right) ── */}
            {[-1, 1].map((side) => {
              const inner =
                side < 0 ? cx - SHAFT_HALF - COLLAR_W : cx + SHAFT_HALF + COLLAR_W;
              const x = side < 0 ? inner - SLEEVE_LEN : inner;
              return (
                <g key={`sleeve-${side}`}>
                  <rect
                    x={x}
                    y={cy - 12}
                    width={SLEEVE_LEN}
                    height={24}
                    rx={5}
                    fill={`url(#${reactKeyBase}-sleeve)`}
                  />
                  {/* sleeve top specular hairline */}
                  <rect
                    x={x}
                    y={cy - 11}
                    width={SLEEVE_LEN}
                    height={4}
                    rx={2}
                    fill="#FFFFFF"
                    opacity={0.22}
                  />
                  {/* sleeve end cap */}
                  <rect
                    x={side < 0 ? x - 8 : x + SLEEVE_LEN}
                    y={cy - 16}
                    width={8}
                    height={32}
                    rx={3}
                    fill={`url(#${reactKeyBase}-shaft)`}
                  />
                </g>
              );
            })}

            {/* ── inner collars (the spring-collar rings) ── */}
            {[-1, 1].map((side) => {
              const x =
                side < 0 ? cx - SHAFT_HALF - COLLAR_W : cx + SHAFT_HALF;
              return (
                <g key={`collar-${side}`}>
                  <rect
                    x={x}
                    y={cy - 26}
                    width={COLLAR_W}
                    height={52}
                    rx={4}
                    fill={`url(#${reactKeyBase}-shaft)`}
                  />
                  <rect
                    x={x + 1}
                    y={cy - 25}
                    width={3}
                    height={50}
                    rx={1.5}
                    fill="#FFFFFF"
                    opacity={0.28}
                  />
                </g>
              );
            })}

            {/* ── the central knurled shaft ── */}
            <g>
              <rect
                x={cx - SHAFT_HALF}
                y={cy - 11}
                width={SHAFT_HALF * 2}
                height={22}
                rx={5}
                fill={`url(#${reactKeyBase}-shaft)`}
              />
              {/* knurl hatching: thin vertical strokes */}
              {Array.from({ length: 26 }).map((_, i) => {
                const kx = cx - SHAFT_HALF + 6 + i * ((SHAFT_HALF * 2 - 12) / 25);
                return (
                  <line
                    key={`knurl-${i}`}
                    x1={kx}
                    y1={cy - 8}
                    x2={kx}
                    y2={cy + 8}
                    stroke="#2C2D35"
                    strokeWidth={0.9}
                    opacity={0.5}
                  />
                );
              })}
              {/* shaft top specular */}
              <rect
                x={cx - SHAFT_HALF + 3}
                y={cy - 10}
                width={SHAFT_HALF * 2 - 6}
                height={3}
                rx={1.5}
                fill="#FFFFFF"
                opacity={0.2}
              />
            </g>

            {/* ── the plates: left stack + mirrored right stack ── */}
            {placed.map((p) => {
              const { spec } = p;
              const h = spec.h;
              const w = spec.w;
              const y = cy - h / 2;
              const r = Math.min(7, w / 2);

              const renderPlate = (mirrorX: number, keySuffix: string) => (
                <g
                  key={`${p.key}-${keySuffix}`}
                  className={`${styles.plate} ${reduced ? styles.plateReduced : ""}`}
                  style={
                    {
                      // spin the disc in from the collar (inboard) outward
                      transformOrigin: `${cx}px ${cy}px`,
                      transformBox: "view-box",
                    } as React.CSSProperties
                  }
                >
                  {/* the machined face */}
                  <rect
                    x={mirrorX}
                    y={y}
                    width={w}
                    height={h}
                    rx={r}
                    fill={`url(#${reactKeyBase}-disc)`}
                    stroke="#2A2B33"
                    strokeWidth={0.8}
                  />
                  {/* a thin dark inner edge for depth */}
                  <rect
                    x={mirrorX + 1.4}
                    y={y + 3}
                    width={Math.max(1, w - 2.8)}
                    height={h - 6}
                    rx={Math.max(2, r - 1)}
                    fill="none"
                    stroke="#1B1C22"
                    strokeWidth={0.7}
                    opacity={0.55}
                  />
                  {/* faint top specular cap */}
                  <rect
                    x={mirrorX + 1}
                    y={y + 1.5}
                    width={w - 2}
                    height={Math.min(16, h * 0.16)}
                    rx={Math.max(2, r - 1)}
                    fill={`url(#${reactKeyBase}-spec)`}
                    opacity={0.8}
                  />
                  {/* center bore shadow line */}
                  <rect
                    x={mirrorX}
                    y={cy - 6}
                    width={w}
                    height={12}
                    fill="#000000"
                    opacity={0.14}
                  />
                </g>
              );

              // mirror: right disc x = reflect left disc across cx
              const rightX = 2 * cx - p.x - w;
              return (
                <g key={p.key}>
                  {renderPlate(p.x, "L")}
                  {renderPlate(rightX, "R")}
                </g>
              );
            })}

            {/* bar-only hint when nothing is loaded */}
            {isBarOnly && (
              <text
                x={cx}
                y={cy + 54}
                textAnchor="middle"
                className={styles.barOnlyHint}
                fill="#9A9BA6"
              >
                empty bar
              </text>
            )}
          </svg>
        </div>

        {/* ── the drag track (role=slider) + steppers ── */}
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.step}
            aria-label={`Remove ${step} ${unit} (one pair)`}
            onClick={() => bump(-1)}
          >
            −
          </button>

          <div
            ref={trackRef}
            role="slider"
            tabIndex={0}
            aria-label="Target weight"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={target}
            aria-valuetext={`${totalWhole} ${unit}`}
            className={`${styles.track} ${scrubbing ? styles.trackScrub : ""}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKey}
          >
            <div
              className={styles.trackFill}
              style={{ transform: `scaleX(${fillRatio})` }}
              aria-hidden="true"
            />
            <div
              className={styles.trackThumb}
              style={{ left: `${fillRatio * 100}%` }}
              aria-hidden="true"
            >
              <span className={styles.trackThumbGrip} />
            </div>
          </div>

          <button
            type="button"
            className={styles.step}
            aria-label={`Add ${step} ${unit} (one pair)`}
            onClick={() => bump(1)}
          >
            +
          </button>
        </div>

        {/* ── the per-side breakdown + bar sub ── */}
        <div className={styles.breakdown}>
          <p className={styles.perSide}>{summary}</p>
          <p className={styles.barSub}>
            bar {bar} {unit}
          </p>
        </div>

        {/* honest caption */}
        <p className={styles.caption}>
          illustrative · drag the bar, tap +/-, or arrow-key the target
        </p>
      </div>
    </div>
  );
}
