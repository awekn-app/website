"use client";

import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Room, roomStyles as r, useReducedMotion, useRoomLive } from "./Room";
import s from "./RoomScale.module.css";

/**
 * The scale: thirteen days of real-looking weigh-ins as grey dots, the trend as one white line,
 * and today's reading as the lit mark you can drag (or nudge with the discs and arrow keys). The
 * dot jumps a kilo; the trend moves a few hundredths. That gap is the whole point of the room.
 *
 * The maths mirrors the app's one-truth trend (lib/bodyweight/trend.ts in the app repo): an EWMA
 * with a 7-day time constant (alpha = 1 - e^(-1/7)), seeded from the median of the first three
 * readings, rounded to 0.01 kg; the week's change is the trend now minus the trend 7 days before
 * (weightSummary), and the pace words come from paceVerdict's cut band (0.5 to 1.0 % a week).
 */

const PAST = [83.1, 83.6, 82.9, 83.0, 82.4, 82.9, 82.6, 82.1, 82.5, 81.9, 82.3, 81.7, 81.9];
const TODAY = 81.4;
/** Within 2.4 kg of the running trend, so the app's outlier rule (3% of the trend) keeps every value. */
const MIN = 80.0;
const MAX = 84.0;

const ALPHA = 1 - Math.exp(-1 / 7);
const round2 = (n: number) => Math.round(n * 100) / 100;
const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v));

/** lib/bodyweight/trend.ts trendSeries on a gap-free daily series (no interpolation needed). */
function trendOf(ws: number[]): number[] {
  const seed = [...ws.slice(0, 3)].sort((a, b) => a - b);
  let t = seed.length === 3 ? seed[1] : ws[0];
  return ws.map((w) => {
    t = t + ALPHA * (w - t);
    return round2(t);
  });
}

/** weightSummary's change (trend now minus the trend 7 days before) and paceVerdict for a cut. */
function rateLine(tr: number[]): string {
  const now = tr[tr.length - 1];
  const change = round2(now - tr[tr.length - 8]);
  if (Math.abs(change) < 0.05) return "Level this week";
  if (change > 0) return `Up ${change.toFixed(1)} kg this week`;
  const pct = (change / now) * 100;
  const pace = pct < -1.0 ? "a fast cut" : pct <= -0.5 ? "a steady cut" : "a gentle cut";
  return `Down ${Math.abs(change).toFixed(1)} kg this week, ${pace}`;
}

// the chart, in viewBox units (the svg scales to the card's width)
const W = 320;
const H = 176;
const L = 8;
const RX = 282;
const TOP = 14;
const BOT = 146;
const LO = 79.8;
const HI = 84.2;
const N = PAST.length + 1;
const X = (i: number) => L + (i * (RX - L)) / (N - 1);
const Y = (v: number) => TOP + ((HI - v) / (HI - LO)) * (BOT - TOP);
const GRID = [81, 82, 83];

const pathOf = (tr: number[]) => tr.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(" ");
const SEED_TREND = trendOf([...PAST, TODAY]);

export function RoomScale() {
  const live = useRoomLive("scale");
  const reduced = useReducedMotion();
  const [today, setToday] = useState(TODAY);
  const [dragging, setDragging] = useState(false);
  const [announce, setAnnounce] = useState("");

  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const endRef = useRef<SVGCircleElement>(null);
  const gapRef = useRef<SVGLineElement>(null);
  const grab = useRef(0);
  const shown = useRef(SEED_TREND);
  // the first paint is the seed; after that the line is drawn frame by frame (never by React)
  const [initialPath] = useState(() => pathOf(SEED_TREND));

  const trend = trendOf([...PAST, today]);
  const now = trend[N - 1];
  const rate = rateLine(trend);
  const moved = round1(Math.abs(today - TODAY));
  const trendMoved = round2(Math.abs(now - SEED_TREND[N - 1]));

  // the trend eases to its new shape in about 250 ms; instant off screen or with reduced motion
  useLayoutEffect(() => {
    const to = trendOf([...PAST, today]);
    const draw = (tr: number[]) => {
      shown.current = tr;
      const y = Y(tr[N - 1]).toFixed(1);
      pathRef.current?.setAttribute("d", pathOf(tr));
      endRef.current?.setAttribute("cy", y);
      gapRef.current?.setAttribute("y2", y);
    };
    const from = shown.current;
    if (reduced || !live) {
      draw(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 250);
      const e = 1 - Math.pow(1 - k, 3);
      draw(from.map((v, i) => v + (to[i] - v) * e));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [today, live, reduced]);

  function speak(v: number) {
    const tr = trendOf([...PAST, v]);
    setAnnounce(`Weigh-in ${v.toFixed(1)} kg. Trend ${tr[N - 1].toFixed(1)} kg. ${rateLine(tr)}.`);
  }
  function set(v: number, say = true) {
    const next = round1(clamp(v));
    setToday(next);
    if (say) speak(next);
  }

  /** the weight under a pointer, from the svg's rendered box */
  function valueAt(clientY: number) {
    const box = svgRef.current?.getBoundingClientRect();
    if (!box || box.height === 0) return today;
    const y = ((clientY - box.top) / box.height) * H;
    return HI - ((y - TOP) / (BOT - TOP)) * (HI - LO);
  }
  function onDown(e: PointerEvent<SVGGElement>) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    grab.current = valueAt(e.clientY) - today;
    setDragging(true);
  }
  function onMove(e: PointerEvent<SVGGElement>) {
    if (!dragging) return;
    set(valueAt(e.clientY) - grab.current, false);
  }
  function onUp(e: PointerEvent<SVGGElement>) {
    if (!dragging) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
    speak(today);
  }
  function onKey(e: KeyboardEvent<SVGGElement>) {
    const step: Record<string, number> = { ArrowUp: 0.1, ArrowRight: 0.1, ArrowDown: -0.1, ArrowLeft: -0.1, PageUp: 0.5, PageDown: -0.5 };
    if (e.key in step) set(today + step[e.key]);
    else if (e.key === "Home") set(MIN);
    else if (e.key === "End") set(MAX);
    else return;
    e.preventDefault();
  }
  function reset() {
    set(TODAY);
  }

  const tx = X(N - 1);
  const ty = Y(today);

  return (
    <Room
      id="scale"
      index="04"
      name="The scale"
      flip
      title="The scale lies. The trend doesn't."
      sub="Water swings a day by a kilo. Awekn reads the line underneath."
      note="The app's own trend maths."
      onReset={reset}
    >
      <div className={r.card}>
        <div className={s.head}>
          <div className={s.hero}>
            <span className={s.big}>{now.toFixed(1)}</span>
            <span className={s.unit}>kg trend</span>
          </div>
          <span className={s.rate}>{rate}</span>
        </div>

        <svg
          ref={svgRef}
          className={s.chart}
          viewBox={`0 0 ${W} ${H}`}
          role="group"
          aria-label="Weigh-ins as dots, the trend as a line"
        >
          {GRID.map((g) => (
            <g key={g} aria-hidden="true">
              <line className={s.grid} x1={L} x2={RX + 4} y1={Y(g)} y2={Y(g)} />
              <text className={s.axis} x={W - 2} y={Y(g) + 4} textAnchor="end">
                {g}
              </text>
            </g>
          ))}
          <text className={s.axis} x={L} y={H - 6} aria-hidden="true">
            13 days ago
          </text>
          <text className={s.axis} x={tx} y={H - 6} textAnchor="middle" aria-hidden="true">
            Today
          </text>

          {PAST.map((w, i) => (
            <circle key={i} className={s.dot} cx={X(i)} cy={Y(w)} r="3.2" aria-hidden="true" />
          ))}

          {/* the gap between today's reading and the line underneath it: water, mostly */}
          <line ref={gapRef} className={s.gap} x1={tx} x2={tx} y1={ty} y2={Y(SEED_TREND[N - 1])} aria-hidden="true" />
          <path
            ref={pathRef}
            className={s.trend}
            d={initialPath}
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          />
          <circle ref={endRef} className={s.end} cx={tx} cy={Y(SEED_TREND[N - 1])} r="3.5" aria-hidden="true" />

          <g
            className={`${s.handle} ${dragging ? s.dragging : live && !reduced ? s.idle : ""}`}
            role="slider"
            tabIndex={0}
            aria-label="Today's weigh-in, drag or use the arrow keys"
            aria-orientation="vertical"
            aria-valuemin={MIN}
            aria-valuemax={MAX}
            aria-valuenow={today}
            aria-valuetext={`${today.toFixed(1)} kg`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey}
          >
            <circle className={s.focus} cx={tx} cy={ty} r="15" />
            <circle className={s.halo} cx={tx} cy={ty} r="11" />
            <circle className={s.lit} cx={tx} cy={ty} r="5" />
            <circle className={s.hit} cx={tx} cy={ty} r="26" />
          </g>
        </svg>

        <div className={s.today}>
          <span className={s.todayLabel}>Today&apos;s weigh-in</span>
          <div className={s.stepper}>
            <button
              type="button"
              className={`${r.disc} ${r.press}`}
              aria-label="0.1 kg lighter"
              onClick={() => set(today - 0.1)}
              disabled={today <= MIN}
            >
              <span aria-hidden="true">&minus;</span>
            </button>
            <span className={s.todayValue} aria-hidden="true">
              {today.toFixed(1)}
            </span>
            <button
              type="button"
              className={`${r.disc} ${r.press}`}
              aria-label="0.1 kg heavier"
              onClick={() => set(today + 0.1)}
              disabled={today >= MAX}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </div>

      <p className={s.payoff}>
        {moved >= 0.1
          ? `The dot moved ${moved.toFixed(1)} kg. The trend moved ${trendMoved.toFixed(2)} kg. That is the point.`
          : "Push today's number around: the dot jumps, the trend barely moves. That is the point."}
      </p>
      <span className="sr-only" role="status" aria-live="polite">
        {announce}
      </span>
    </Room>
  );
}
