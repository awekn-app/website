"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Room, roomStyles as r, useReducedMotion, useRoomLive } from "./Room";
import s from "./RoomRoute.module.css";

/**
 * The route room. A 5 km loop draws itself as the run plays or as the slider scrubs it: a white
 * head, pace dots every 250 m (brighter is faster, no colour), and the splits table filling in as
 * each kilometre passes. The run is generated once, deterministically, at module load: a smooth
 * loop for the path and a pace curve over distance (a steady middle and a faster last kilometre),
 * integrated to time. Splits are counted the way the app's recorder counts them
 * (awekn lib/cardio/gps/recorder.ts accumulateSplits: moving seconds per 1000 m), and pace and
 * time are formatted like lib/cardio/gps/pace.ts (formatPace, formatDuration).
 */

const TAU = Math.PI * 2;
const RUN_M = 5000;
const KM = 5;

/* ── the path: a loop around a park, sampled evenly in its parameter ── */
const SAMPLES = 720;
function loopPoint(t: number): [number, number] {
  const a = t + Math.PI / 2; // start at the bottom of the loop
  return [
    160 + 116 * Math.cos(a) + 20 * Math.cos(2 * a + 0.8) + 6 * Math.sin(5 * a) + 5 * Math.sin(3 * a + 0.5),
    112 + 76 * Math.sin(a) + 14 * Math.sin(2 * a + 0.3) + 5 * Math.cos(4 * a + 1),
  ];
}
const PTS: [number, number][] = Array.from({ length: SAMPLES + 1 }, (_, i) => loopPoint((i / SAMPLES) * TAU));
/** Distance along the route (m) at each sample, from the polyline's own length. */
const DIST: number[] = (() => {
  const len = [0];
  for (let i = 1; i < PTS.length; i++) {
    len.push(len[i - 1] + Math.hypot(PTS[i][0] - PTS[i - 1][0], PTS[i][1] - PTS[i - 1][1]));
  }
  const total = len[len.length - 1];
  return len.map((l) => (l / total) * RUN_M);
})();
const PATH = "M" + PTS.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");

function pointAt(d: number): [number, number] {
  const m = Math.min(RUN_M, Math.max(0, d));
  let lo = 0;
  let hi = DIST.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (DIST[mid] <= m) lo = mid;
    else hi = mid;
  }
  const span = DIST[hi] - DIST[lo] || 1;
  const f = (m - DIST[lo]) / span;
  return [PTS[lo][0] + (PTS[hi][0] - PTS[lo][0]) * f, PTS[lo][1] + (PTS[hi][1] - PTS[lo][1]) * f];
}

/* ── the pace: seconds per km over distance, integrated to time on a 5 m grid ── */
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const paceAt = (d: number) =>
  303 + 10 * Math.sin((TAU * d) / 1700 + 0.4) + 6 * Math.sin((TAU * d) / 620 + 2.2) - 15 * smooth(3900, 4800, d);
const GRID = 5;
const TIME: number[] = (() => {
  const t = [0];
  for (let k = 1; k <= RUN_M / GRID; k++) t.push(t[k - 1] + (paceAt((k - 0.5) * GRID) * GRID) / 1000);
  return t;
})();
const TOTAL_S = TIME[TIME.length - 1];
const timeAt = (d: number) => {
  const x = Math.min(RUN_M, Math.max(0, d)) / GRID;
  const k = Math.min(TIME.length - 2, Math.floor(x));
  return TIME[k] + (TIME[k + 1] - TIME[k]) * (x - k);
};
function distAt(t: number): number {
  const m = Math.min(TOTAL_S, Math.max(0, t));
  let lo = 0;
  let hi = TIME.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (TIME[mid] <= m) lo = mid;
    else hi = mid;
  }
  const span = TIME[hi] - TIME[lo] || 1;
  return (lo + (m - TIME[lo]) / span) * GRID;
}

/** Seconds for each whole kilometre (a 1000 m split's time is its pace per km). */
const SPLITS = Array.from({ length: KM }, (_, i) => timeAt((i + 1) * 1000) - timeAt(i * 1000));
const FASTEST = SPLITS.indexOf(Math.min(...SPLITS));
const NEGATIVE = FASTEST === KM - 1;

/** Pace dots every 250 m, at the middle of each stretch; brighter is faster. */
const DOT_M = 250;
const DOTS = (() => {
  const raw = Array.from({ length: RUN_M / DOT_M }, (_, i) => {
    const pace = (timeAt((i + 1) * DOT_M) - timeAt(i * DOT_M)) / (DOT_M / 1000);
    const [x, y] = pointAt((i + 0.5) * DOT_M);
    return { at: (i + 1) * DOT_M, pace, x, y };
  });
  const lo = Math.min(...raw.map((d) => d.pace));
  const hi = Math.max(...raw.map((d) => d.pace));
  return raw.map((d) => ({ ...d, o: 0.28 + 0.72 * ((hi - d.pace) / (hi - lo || 1)) }));
})();
const KM_MARKS = Array.from({ length: KM - 1 }, (_, i) => {
  const [x, y] = pointAt((i + 1) * 1000);
  return { km: i + 1, x, y };
});
const START = pointAt(0);

/** m:ss (lib/cardio/gps/pace.ts formatPace and formatDuration under an hour). */
const mmss = (sec: number) => {
  const t = Math.max(0, Math.round(sec));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};
const formatPace = (secPerKm: number) => (Number.isFinite(secPerKm) && secPerKm > 0 && secPerKm < 99 * 60 ? mmss(secPerKm) : "--:--");

/** The whole run plays in twelve seconds. */
const PLAY_S = 12;
const TOTAL_WHOLE = Math.round(TOTAL_S);

export function RoomRoute({ index = "", flip }: { index?: string; flip?: boolean } = {}) {
  const live = useRoomLive("route");
  const reduced = useReducedMotion();
  const [t, setTState] = useState(0);
  const [playing, setPlaying] = useState(false);
  // the loop's source of truth; state mirrors it for the render
  const tRef = useRef(0);
  const setT = (v: number) => {
    tRef.current = v;
    setTState(v);
  };

  useEffect(() => {
    if (!playing || !live) return;
    let raf = 0;
    let last = performance.now();
    const rate = TOTAL_S / PLAY_S;
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const n = Math.min(TOTAL_S, tRef.current + dt * rate);
      tRef.current = n;
      setTState(n);
      if (n >= TOTAL_S) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, live]);

  const d = distAt(t);
  const finished = t >= TOTAL_S - 0.01;
  const [hx, hy] = pointAt(d);
  const avg = d >= 50 ? t / (d / 1000) : NaN;
  const kmDone = Math.min(KM, Math.floor((d + 0.01) / 1000));

  const play = () => {
    if (reduced) {
      // no motion: each press walks the run on by one whole kilometre
      const next = finished ? 1 : Math.min(KM, kmDone + 1);
      setT(timeAt(next * 1000));
      return;
    }
    if (playing) {
      setPlaying(false);
      return;
    }
    if (finished) setT(0);
    setPlaying(true);
  };

  const reset = () => {
    setPlaying(false);
    setT(0);
  };

  const playLabel = reduced ? (finished ? "Start over" : "Next km") : playing ? "Pause" : finished ? "Replay" : t > 0 ? "Resume" : "Play";
  const status = finished
    ? `5 km in ${mmss(TOTAL_S)}, ${formatPace(TOTAL_S / KM)} /km on average.${NEGATIVE ? " The last kilometre was the fastest: a negative split." : ""}`
    : "Play the run, or drag to scrub it.";

  return (
    <Room
      id="route"
      index={index}
      flip={flip}
      name="The route"
      title="Every run, drawn."
      sub="A 5 km route, the pace per kilometre, the splits."
      note="Splits counted the way the app's run recorder counts them."
      onReset={reset}
    >
      <div className={`${r.card} ${live ? "" : s.paused}`}>
        <div className={s.readouts}>
          <div className={s.stat}>
            <span className={s.label}>Distance</span>
            <span className={`${s.value} ${s.wDist} ${r.num}`}>
              {(d / 1000).toFixed(2)}
              <span className={s.unit}> km</span>
            </span>
          </div>
          <div className={s.stat}>
            <span className={s.label}>Time</span>
            <span className={`${s.value} ${s.wTime} ${r.num}`}>{mmss(t)}</span>
          </div>
          <div className={s.stat}>
            <span className={s.label}>Avg pace</span>
            <span className={`${s.value} ${s.wTime} ${r.num}`}>
              {formatPace(avg)}
              <span className={s.unit}> /km</span>
            </span>
          </div>
        </div>

        <div className={s.map}>
          <svg
            className={s.svg}
            viewBox="0 0 320 224"
            role="img"
            aria-label={`A 5 km loop, ${(d / 1000).toFixed(2)} km run so far`}
          >
            <path className={s.ghost} d={PATH} />
            <path
              className={s.drawn}
              d={PATH}
              pathLength={1000}
              strokeDasharray="1000 1000"
              strokeDashoffset={(1000 * (1 - d / RUN_M)).toFixed(2)}
              opacity={d > 1 ? 1 : 0}
            />
            {DOTS.map((p) => (
              <circle
                key={p.at}
                className={`${s.dot} ${d >= p.at ? s.dotOn : ""}`}
                cx={p.x.toFixed(1)}
                cy={p.y.toFixed(1)}
                r="3.2"
                style={{ "--o": p.o.toFixed(2) } as CSSProperties}
              />
            ))}
            {KM_MARKS.map((k) => (
              <g key={k.km} className={`${s.km} ${d >= k.km * 1000 ? s.kmOn : ""}`}>
                <circle cx={k.x.toFixed(1)} cy={k.y.toFixed(1)} r="7.5" />
                <text x={k.x.toFixed(1)} y={(k.y + 3.3).toFixed(1)} textAnchor="middle">
                  {k.km}
                </text>
              </g>
            ))}
            <circle className={s.start} cx={START[0].toFixed(1)} cy={START[1].toFixed(1)} r="5.5" />
            <circle className={s.halo} cx={hx.toFixed(1)} cy={hy.toFixed(1)} r="11" />
            <circle className={s.head} cx={hx.toFixed(1)} cy={hy.toFixed(1)} r="5" />
          </svg>
        </div>

        <div className={s.scrubRow}>
          <button
            type="button"
            className={`${r.chip} ${r.press} ${s.play}`}
            onClick={play}
            aria-label={playLabel === "Next km" ? "Run the next kilometre" : `${playLabel} the run`}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
            <span>{playLabel}</span>
          </button>
          <input
            className={s.slider}
            type="range"
            min={0}
            max={TOTAL_WHOLE}
            step={1}
            value={Math.min(TOTAL_WHOLE, Math.round(t))}
            aria-label="Scrub the run"
            aria-valuetext={`${(d / 1000).toFixed(2)} km, ${mmss(t)}`}
            style={{ "--p": `${((t / TOTAL_S) * 100).toFixed(2)}%` } as CSSProperties}
            onChange={(e) => {
              setPlaying(false);
              const v = Number(e.target.value);
              setT(v >= TOTAL_WHOLE ? TOTAL_S : v);
            }}
          />
        </div>

        <div className={`${r.well} ${s.splits}`}>
          <div className={s.splitsHead}>
            <span className={s.label}>Splits</span>
            <span className={s.label}>Pace</span>
          </div>
          <ol className={s.splitList}>
            {SPLITS.map((sec, i) => {
              const on = i < kmDone;
              const w = 0.55 + 0.45 * ((Math.max(...SPLITS) - sec) / (Math.max(...SPLITS) - Math.min(...SPLITS) || 1));
              return (
                <li key={i} className={`${s.split} ${on ? s.splitOn : ""}`}>
                  <span className={`${s.splitKm} ${r.num}`}>Km {i + 1}</span>
                  <span className={s.splitTrack} aria-hidden="true">
                    <span className={s.splitBar} style={{ transform: `scaleX(${on ? w.toFixed(3) : 0})` }} />
                  </span>
                  <span className={`${s.splitPace} ${r.num}`}>
                    {on ? formatPace(sec) : "--:--"}
                    <span className={s.unit}> /km</span>
                    {on && finished && i === FASTEST && <span className="sr-only">, fastest</span>}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <p className={`${s.status} ${finished ? s.statusDone : ""}`} role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </Room>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3.5 2.2 L11.8 7 L3.5 11.8 Z" fill="currentColor" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <rect x="3" y="2.2" width="2.8" height="9.6" rx="1" fill="currentColor" />
      <rect x="8.2" y="2.2" width="2.8" height="9.6" rx="1" fill="currentColor" />
    </svg>
  );
}
