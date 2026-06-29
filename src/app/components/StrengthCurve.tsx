"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./StrengthCurve.module.css";

/* ──────────────────────────────────────────────────────────────────────
   THE STRENGTH CURVE
   A scrubbable, illustrative record of an e1RM grind across ~12 sessions:
   a believable upward climb with one small deload dip near the end. The
   line is drawn in cosmic silver (silver IS the text), fading dim -> bright
   as the record accrues, lifted by a faint white bloom. The PEAK session
   wears the single --signal emerald dot (the PR, the one earned moment). A
   draggable playhead (pointer + touch + keyboard) tracks a vertical
   readout line and surfaces that session's e1RM in big tabular numerals
   with a white-bloom shadow, with the delta-from-start fired in --signal
   emerald only when it is a genuine positive gain (an earned accent, never
   decoration); otherwise silver.

   Motion law: only transform / opacity / clip-path animate. The entrance
   sweep is a clip-path reveal; the playhead moves by transform. Honors
   prefers-reduced-motion. SSR-guarded throughout.
   ────────────────────────────────────────────────────────────────────── */

// Illustrative e1RM (lbs) across 12 sessions: a grind up, a deload dip at
// session 9, then a new peak. Not real user data, clearly a sample.
const SERIES = [
  225, 235, 240, 250, 255, 268, 275, 285, 272, 290, 300, 312,
];

// SVG viewBox geometry. We draw in a fixed coordinate space and let CSS
// scale it responsively, so all the math below is resolution-independent.
const VB_W = 1000;
const VB_H = 420;
const PAD_X = 56;
const PAD_TOP = 64;
const PAD_BOTTOM = 56;

type Pt = { x: number; y: number; v: number };

export default function StrengthCurve() {
  const uid = useId().replace(/[:]/g, "");
  const strokeGradId = `sc-stroke-${uid}`;
  const fillGradId = `sc-fill-${uid}`;
  const glowId = `sc-glow-${uid}`;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);

  // Active session index (the playhead). Starts at the peak so the readout
  // opens on the strongest number (the record's high-water mark).
  const peakIndex = useMemo(
    () => SERIES.indexOf(Math.max(...SERIES)),
    [],
  );
  const [active, setActive] = useState(peakIndex);
  const [reduced, setReduced] = useState(false);
  const [entered, setEntered] = useState(false);

  // ── geometry: map each session to a point in the viewBox ──────────────
  const { points, pathD, areaD, minV, maxV } = useMemo(() => {
    const minV = Math.min(...SERIES);
    const maxV = Math.max(...SERIES);
    const span = maxV - minV || 1;
    const innerW = VB_W - PAD_X * 2;
    const innerH = VB_H - PAD_TOP - PAD_BOTTOM;

    const points: Pt[] = SERIES.map((v, i) => {
      const x = PAD_X + (innerW * i) / (SERIES.length - 1);
      // pad the vertical range slightly so the peak/trough never kiss edges
      const t = (v - minV) / span;
      const y = PAD_TOP + innerH * (1 - t);
      return { x, y, v };
    });

    // Smooth the line with a Catmull-Rom -> cubic-bezier conversion. Tension
    // kept gentle so it reads as an honest grind, not a marketing swoosh.
    const d = catmullRom(points, 0.5);
    const area = `${d} L ${points[points.length - 1].x.toFixed(2)} ${(
      VB_H - PAD_BOTTOM
    ).toFixed(2)} L ${points[0].x.toFixed(2)} ${(VB_H - PAD_BOTTOM).toFixed(
      2,
    )} Z`;

    return { points, pathD: d, areaD: area, minV, maxV };
  }, []);

  const startV = SERIES[0];
  const activePt = points[active];
  const activeV = SERIES[active];
  const delta = activeV - startV;
  const isPeak = active === peakIndex;

  // ── reduced-motion + entrance ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      setEntered(true);
      return;
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);

    // Reveal once the element is in view (or immediately if reduced).
    const el = svgRef.current;
    if (mq.matches || !el || typeof IntersectionObserver === "undefined") {
      setEntered(true);
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setEntered(true);
            io.disconnect();
          }
        },
        { threshold: 0.35 },
      );
      io.observe(el);
      return () => {
        mq.removeEventListener?.("change", apply);
        io.disconnect();
      };
    }
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // ── pointer scrubbing ─────────────────────────────────────────────────
  // Map an absolute clientX to the nearest session index using the live
  // bounding box (so it stays correct across responsive scaling).
  const indexFromClientX = useCallback(
    (clientX: number): number => {
      const el = svgRef.current;
      if (!el) return active;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) return active;
      // viewBox x for the pointer, clamped to the plotted region
      const ratio = (clientX - rect.left) / rect.width;
      const vbX = ratio * VB_W;
      const innerW = VB_W - PAD_X * 2;
      const tt = Math.min(1, Math.max(0, (vbX - PAD_X) / innerW));
      return Math.round(tt * (SERIES.length - 1));
    },
    [active],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      draggingRef.current = true;
      pointerIdRef.current = e.pointerId;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        /* capture is best-effort */
      }
      setActive(indexFromClientX(e.clientX));
    },
    [indexFromClientX],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!draggingRef.current) return;
      setActive(indexFromClientX(e.clientX));
    },
    [indexFromClientX],
  );

  const endDrag = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    draggingRef.current = false;
    if (pointerIdRef.current != null) {
      try {
        e.currentTarget.releasePointerCapture(pointerIdRef.current);
      } catch {
        /* no-op */
      }
      pointerIdRef.current = null;
    }
  }, []);

  // ── keyboard scrubbing ────────────────────────────────────────────────
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<SVGSVGElement>) => {
      let next: number | null = null;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          next = Math.min(SERIES.length - 1, active + 1);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          next = Math.max(0, active - 1);
          break;
        case "Home":
          next = 0;
          break;
        case "End":
          next = SERIES.length - 1;
          break;
        default:
          return;
      }
      if (next != null) {
        e.preventDefault();
        setActive(next);
      }
    },
    [active],
  );

  // playhead transform (x). Pure transform => compositor-only move.
  const playheadX = activePt.x;
  const readoutFlip = active > SERIES.length - 4; // keep label on-screen

  return (
    <figure className={styles.wrap} aria-labelledby={`${uid}-cap`}>
      <div className={styles.frame}>
        {/* Big numeric readout: the sacred number, tabular numerals. */}
        <div
          className={styles.readout}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className={styles.readoutTop}>
            <span className={styles.sessionTag}>
              session{" "}
              <span className={styles.sessionNum}>
                {String(active + 1).padStart(2, "0")}
              </span>
            </span>
            {isPeak ? <span className={styles.peakTag}>peak</span> : null}
          </div>
          <div className={styles.e1rm}>
            <span className={styles.e1rmNum}>{activeV}</span>
            <span className={styles.e1rmUnit}>lb e1rm</span>
          </div>
          <div
            className={`${styles.delta} ${
              delta > 0 ? styles.deltaUp : ""
            }`.trim()}
          >
            {delta > 0 ? "+" : delta < 0 ? "" : "±"}
            <span className={styles.deltaNum}>{Math.abs(delta) || 0}</span>{" "}
            <span className={styles.deltaLabel}>since the first record</span>
          </div>
        </div>

        <svg
          ref={svgRef}
          className={`${styles.svg} ${entered ? styles.entered : ""} ${
            reduced ? styles.reduced : ""
          }`}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
          role="slider"
          tabIndex={0}
          aria-valuemin={minV}
          aria-valuemax={maxV}
          aria-valuenow={activeV}
          aria-valuetext={`Session ${active + 1} of ${SERIES.length}, ${activeV} pounds estimated one-rep max`}
          aria-label="Scrub the illustrative strength curve across sessions"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
        >
          <defs>
            {/* Stroke fades dim silver -> bright silver -> white as the record
               accrues left to right, so the most recent grind reads brightest. */}
            <linearGradient id={strokeGradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--silver-dim)" stopOpacity="0.5" />
              <stop offset="55%" stopColor="var(--silver)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--white)" stopOpacity="1" />
            </linearGradient>
            {/* Area fill: a whisper of white under the line, never a flood. */}
            <linearGradient id={fillGradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--white)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--white)" stopOpacity="0" />
            </linearGradient>
            <filter
              id={glowId}
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* faint baseline + a couple of hairline guides */}
          <line
            className={styles.baseline}
            x1={PAD_X}
            y1={VB_H - PAD_BOTTOM}
            x2={VB_W - PAD_X}
            y2={VB_H - PAD_BOTTOM}
          />

          {/* the warmth under the curve */}
          <path
            className={styles.area}
            d={areaD}
            fill={`url(#${fillGradId})`}
          />

          {/* the curve itself, revealed via clip-path sweep on entrance */}
          <g className={styles.lineGroup}>
            <path
              className={styles.line}
              d={pathD}
              fill="none"
              stroke={`url(#${strokeGradId})`}
              filter={`url(#${glowId})`}
            />
          </g>

          {/* every session node: quiet dots */}
          {points.map((p, i) => (
            <circle
              key={i}
              className={`${styles.node} ${
                i === active ? styles.nodeActive : ""
              }`}
              cx={p.x}
              cy={p.y}
              r={i === active ? 7 : 3.2}
            />
          ))}

          {/* the PEAK: the single --signal emerald dot (the PR) */}
          <circle
            className={styles.peakDot}
            cx={points[peakIndex].x}
            cy={points[peakIndex].y}
            r={6.5}
          />

          {/* ── the playhead: vertical readout line + marker ─────────── */}
          <g
            className={styles.playhead}
            style={{ transform: `translateX(${playheadX}px)` }}
          >
            <line
              className={styles.playLine}
              x1={0}
              y1={PAD_TOP - 18}
              x2={0}
              y2={VB_H - PAD_BOTTOM}
            />
            <circle
              className={styles.playDot}
              cx={0}
              cy={activePt.y}
              r={9}
            />
            <circle
              className={styles.playCore}
              cx={0}
              cy={activePt.y}
              r={3.4}
            />
            {/* the floating value chip riding the playhead */}
            <g
              className={styles.chip}
              style={{
                transform: `translate(${readoutFlip ? -64 : 12}px, ${
                  activePt.y - 34
                }px)`,
              }}
            >
              <rect
                className={styles.chipBg}
                x={0}
                y={0}
                width={52}
                height={24}
                rx={6}
              />
              <text className={styles.chipText} x={26} y={16}>
                {activeV}
              </text>
            </g>
          </g>
        </svg>
      </div>

      <figcaption id={`${uid}-cap`} className={styles.caption}>
        <span className={styles.capDot} />
        illustrative record . drag the line to read any session
      </figcaption>
    </figure>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   catmullRom: build a smooth SVG cubic-bezier path through the points.
   Gentle tension; clamped endpoints so the line starts/ends exactly on
   the first/last session rather than overshooting (no marketing swoosh).
   ────────────────────────────────────────────────────────────────────── */
function catmullRom(pts: Pt[], tension: number): string {
  if (pts.length < 2) return "";
  const k = tension;
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;

    const c1x = p1.x + ((p2.x - p0.x) / 6) * k;
    const c1y = p1.y + ((p2.y - p0.y) / 6) * k;
    const c2x = p2.x - ((p3.x - p1.x) / 6) * k;
    const c2y = p2.y - ((p3.y - p1.y) / 6) * k;

    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(
      2,
    )} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}
