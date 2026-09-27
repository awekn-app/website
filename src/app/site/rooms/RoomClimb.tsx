"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Room, roomStyles as r } from "./Room";
import s from "./RoomClimb.module.css";

/**
 * Room 07, the climb. Twelve weeks of bench (three sessions a week) as one line: every session is a
 * grey dot at its estimated 1RM, the running record is a white staircase, a deload dips in weeks 9
 * and 10, and the last session is the new peak. The estimate is the app's own (lib/pr/e1rm.ts:
 * Brzycki to 5 reps, Epley 6 to 10). Scrub with a pointer across the chart (a horizontal drag on
 * touch, so a vertical swipe still scrolls the page) or with the range under it. The chart draws at
 * its real pixel width so the 11px labels stay 11px.
 */

const DAY = 86_400_000;
/** Mon 6 Jul 2026: sessions on Monday, Wednesday and Saturday of each week. */
const FIRST_MONDAY = Date.UTC(2026, 6, 6);
const SESSION_DAY = [0, 2, 5];
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The season, as logged: top sets of 3, 8 and 5, deload in weeks 9 and 10, a new peak to close. */
const SETS: [number, number][] = [
  [92.5, 3], [75, 8], [87.5, 5], [95, 3], [77.5, 8], [90, 5],
  [97.5, 3], [77.5, 8], [90, 5], [97.5, 3], [80, 8], [92.5, 5],
  [100, 3], [80, 8], [92.5, 5], [100, 3], [82.5, 8], [95, 5],
  [102.5, 3], [82.5, 8], [95, 5], [102.5, 3], [85, 8], [95, 5],
  [87.5, 3], [72.5, 8], [82.5, 5], [92.5, 3], [75, 8], [85, 5],
  [100, 3], [80, 8], [92.5, 5], [105, 3], [85, 8], [102.5, 5],
];

/** lib/pr/e1rm.ts: Brzycki at 1 to 5 reps, Epley at 6 to 10. */
function e1rm(w: number, reps: number) {
  if (reps <= 1) return w;
  if (reps <= 5) return (w * 36) / (37 - reps);
  return w * (1 + reps / 30);
}

type Session = { date: string; weight: number; reps: number; e1: number; best: number; pr: boolean };
const SESSIONS: Session[] = (() => {
  let best = 0;
  return SETS.map(([weight, reps], i) => {
    const d = new Date(FIRST_MONDAY + (Math.floor(i / 3) * 7 + SESSION_DAY[i % 3]) * DAY);
    const e1 = e1rm(weight, reps);
    const pr = e1 > best + 1e-9;
    if (pr) best = e1;
    return { date: `${WD[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`, weight, reps, e1, best, pr };
  });
})();
const N = SESSIONS.length;
const LAST = N - 1;
const FIRST_E1 = SESSIONS[0].e1;

// the y domain, padded, and at most three round gridlines inside it
const LO = Math.floor((Math.min(...SESSIONS.map((x) => x.e1)) - 3) / 5) * 5;
const HI = Math.ceil((Math.max(...SESSIONS.map((x) => x.e1)) + 3) / 5) * 5;
const TICKS = [10, 20, 30, 40].map((k) => Math.ceil(LO / 10) * 10 + k - 10).filter((v) => v > LO && v < HI).slice(0, 3);

const H = 190;
const PAD_L = 10;
const PAD_R = 40;
const PAD_T = 14;
const PAD_B = 24;

const kg = (v: number) => (Math.round(v * 10) / 10).toFixed(1);
const load = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

export function RoomClimb() {
  const [sel, setSel] = useState(LAST);
  const [w, setW] = useState(340);
  const svgRef = useRef<SVGSVGElement>(null);
  const gesture = useRef<{ id: number; x: number; y: number; scrub: boolean } | null>(null);

  // draw at the real pixel width (labels stay 11px, dots stay round)
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const next = Math.round(e.contentRect.width);
      if (next > 0) setW(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const x0 = PAD_L;
  const x1 = w - PAD_R;
  const X = (i: number) => x0 + ((x1 - x0) * i) / LAST;
  const Y = (v: number) => PAD_T + ((HI - v) / (HI - LO)) * (H - PAD_T - PAD_B);

  // the record as a staircase: flat until a session beats it, then straight up
  let stairs = `M ${X(0).toFixed(1)} ${Y(SESSIONS[0].best).toFixed(1)}`;
  for (let i = 1; i < N; i++) {
    if (SESSIONS[i].pr) stairs += ` H ${X(i).toFixed(1)} V ${Y(SESSIONS[i].best).toFixed(1)}`;
  }
  stairs += ` H ${X(LAST).toFixed(1)}`;

  const pick = (clientX: number) => {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * w;
    const i = Math.round(((px - x0) / (x1 - x0)) * LAST);
    setSel(Math.max(0, Math.min(LAST, i)));
  };

  // mouse and pen scrub straight away; a finger scrubs once the drag is clearly sideways
  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const scrub = e.pointerType !== "touch";
    gesture.current = { id: e.pointerId, x: e.clientX, y: e.clientY, scrub };
    if (scrub) {
      e.currentTarget.setPointerCapture(e.pointerId);
      pick(e.clientX);
    }
  };
  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) {
      if (e.pointerType === "mouse") pick(e.clientX);
      return;
    }
    if (!g.scrub) {
      const dx = Math.abs(e.clientX - g.x);
      const dy = Math.abs(e.clientY - g.y);
      if (dy > 10 && dy > dx) {
        gesture.current = null;
        return;
      }
      if (dx > 8 && dx > dy) {
        g.scrub = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      } else return;
    }
    pick(e.clientX);
  };
  const onPointerUp = (e: PointerEvent<SVGSVGElement>) => {
    const g = gesture.current;
    // a tap (no drag) lands the spotlight where it was tapped
    if (g && g.id === e.pointerId && !g.scrub) pick(e.clientX);
    gesture.current = null;
  };
  const onPointerCancel = () => {
    gesture.current = null;
  };

  const cur = SESSIONS[sel];
  const up = cur.e1 - FIRST_E1;
  const said = `${cur.date}, ${load(cur.weight)} kilos for ${cur.reps}, estimated 1RM ${kg(cur.e1)} kilos${cur.pr ? ", a record" : ""}`;

  return (
    <Room
      id="climb"
      index="10"
      flip
      name="The climb"
      title="A season, in one line."
      sub="Scrub twelve weeks of bench. The deload dips, then the new peak."
      note="Estimated 1RM from every set, the app's formula."
      onReset={() => setSel(LAST)}
    >
      <div className={r.card}>
        <div className={s.head}>
          <div className={s.headTop}>
            <span className={s.lift}>Bench press</span>
            <span className={`${s.date} ${r.num}`}>{cur.date}</span>
          </div>
          <div className={s.readout}>
            <span className={`${s.e1} ${r.num}`}>{kg(cur.e1)}</span>
            <span className={s.unit}>kg e1RM</span>
            <span className={`${s.pr} ${cur.pr ? s.prOn : ""}`} aria-hidden={!cur.pr}>
              PR
            </span>
          </div>
          <div className={`${s.line} ${r.num}`}>
            <span className={s.set}>
              {load(cur.weight)} kg × {cur.reps}
            </span>
            <span className={s.delta}>
              {up >= 0 ? "+" : "-"}
              {kg(Math.abs(up))} kg since week 1
            </span>
          </div>
        </div>

        <svg
          ref={svgRef}
          className={s.chart}
          width="100%"
          height={H}
          viewBox={`0 0 ${w} ${H}`}
          role="img"
          aria-label={`Estimated 1RM over ${N} sessions, from ${kg(FIRST_E1)} to ${kg(SESSIONS[LAST].e1)} kilos, with a deload in weeks 9 and 10. Selected: ${said}.`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onLostPointerCapture={onPointerCancel}
        >
          {TICKS.map((t) => (
            <g key={t}>
              <line x1={x0} x2={x1} y1={Y(t)} y2={Y(t)} className={s.grid} />
              <text x={w - 2} y={Y(t)} className={s.tick} textAnchor="end" dominantBaseline="middle">
                {t}
              </text>
            </g>
          ))}
          <text x={x0} y={H - 6} className={s.tick}>
            Week 1
          </text>
          <text x={x1} y={H - 6} className={s.tick} textAnchor="end">
            Week 12
          </text>

          <line x1={X(sel)} x2={X(sel)} y1={PAD_T - 6} y2={H - PAD_B + 4} className={s.spot} />

          {SESSIONS.map((x, i) => (
            <circle key={i} cx={X(i)} cy={Y(x.e1)} r={2.75} className={s.dot} />
          ))}
          <path d={stairs} className={s.stairs} />

          <circle cx={X(sel)} cy={Y(cur.e1)} r={5.5} className={s.mark} />
        </svg>

        <input
          type="range"
          className={s.range}
          min={0}
          max={LAST}
          step={1}
          value={sel}
          onChange={(e) => setSel(Number(e.target.value))}
          aria-label="Session"
          aria-valuetext={said}
        />

        <p className={s.status} role="status" aria-live="polite">
          {cur.pr ? (sel === LAST ? `The new peak: ${kg(cur.e1)} kg.` : `A record that day: ${kg(cur.e1)} kg.`) : ""}
        </p>
      </div>
    </Room>
  );
}
