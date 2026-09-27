/**
 * THE INSTRUMENT'S GEOMETRY (the arc, 2026-09-27). Pure: the four tracks' scales, the paths drawn
 * at any pixel size, and the length tables that let a line's stroke-dashoffset end exactly at the
 * playhead. The annotation layout (solved once, at the smallest size a track is ever drawn, so no
 * label ever overlaps a line or another label at any larger size) is arc/annotate.ts, run offline by
 * scripts/arc-precompute.mjs into annotations.generated.ts: the page only reads the result.
 */

import { DAYS, LIFTS, SEASON, GOAL_BAND, KCAL_BAND, setsThisWeek, weekOf, type Lift } from "./season";

export { ANNOTATIONS } from "./annotations.generated";

export type TrackId = "weight" | "strength" | "work" | "fuel";

export interface TrackSpec {
  id: TrackId;
  min: number;
  max: number;
  /** At most three hairlines, labelled at the right edge. */
  grid: { v: number; label: string }[];
  /** The SVG's size before the client measures it (the server render stretches it to fit). */
  nominalH: number;
  /** The smallest plot this track is ever drawn at (px); the annotation layout is solved here. */
  minH: number;
}

/** The narrowest plot (a 320 px phone less the 20 px gutters and the 34 px label column). */
export const MIN_W = 246;
export const NOMINAL_W = 600;

export const TRACKS: Record<TrackId, TrackSpec> = {
  weight: {
    id: "weight",
    min: 77.6,
    max: 85.6,
    grid: [{ v: 80, label: "80" }, { v: 82, label: "82" }, { v: 84, label: "84" }],
    nominalH: 110,
    minH: 56,
  },
  strength: {
    id: "strength",
    min: 50,
    max: 240,
    grid: [{ v: 100, label: "100" }, { v: 150, label: "150" }, { v: 200, label: "200" }],
    nominalH: 150,
    minH: 84,
  },
  work: {
    id: "work",
    min: 0,
    max: 112,
    grid: [{ v: 30, label: "30" }, { v: 60, label: "60" }, { v: 90, label: "90" }],
    nominalH: 90,
    minH: 44,
  },
  fuel: {
    id: "fuel",
    min: 1650,
    max: 3350,
    grid: [{ v: 2000, label: "2,000" }, { v: 2500, label: "2,500" }, { v: 3000, label: "3,000" }],
    nominalH: 90,
    minH: 44,
  },
};

/** Fractions of the plot: day 0 at the left edge, day 83 at the right. */
export const fx = (day: number) => day / (DAYS - 1);
export const fy = (track: TrackId, v: number) => {
  const t = TRACKS[track];
  return 1 - (v - t.min) / (t.max - t.min);
};
export const pctY = (track: TrackId, v: number) => `${(fy(track, v) * 100).toFixed(3)}%`;

/** Protein hits sit on a row near the bottom of the fuel track. */
const PROTEIN_ROW = TRACKS.fuel.min + 0.08 * (TRACKS.fuel.max - TRACKS.fuel.min);
/** A week's column spans this share of its seven days. */
const COLUMN_SHARE = 0.62;
export const colCenter = (w: number) => w * 7 + 3;
export const colHalf = (7 * COLUMN_SHARE) / 2;

/* ── polylines with an arc-length table ── */

export interface Poly { xs: number[]; ys: number[]; cum: number[]; total: number; d: string }

const n2 = (v: number) => (Math.round(v * 100) / 100).toString();

export function poly(xs: number[], ys: number[]): Poly {
  const cum = [0];
  let d = `M${n2(xs[0])} ${n2(ys[0])}`;
  for (let i = 1; i < xs.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]));
    d += `L${n2(xs[i])} ${n2(ys[i])}`;
  }
  return { xs, ys, cum, total: cum[cum.length - 1], d };
}

/** Index of the segment holding x (x-monotone lines), and how far along it. */
function seg(p: Poly, x: number): { i: number; u: number } {
  const { xs } = p;
  if (x <= xs[0]) return { i: 0, u: 0 };
  const last = xs.length - 1;
  if (x >= xs[last]) return { i: last - 1, u: 1 };
  let lo = 0;
  let hi = last;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (xs[mid] <= x) lo = mid;
    else hi = mid;
  }
  return { i: lo, u: (x - xs[lo]) / (xs[lo + 1] - xs[lo]) };
}

/** The drawn length of a line up to x: the stroke-dashoffset that ends it exactly there. */
export function lenAtX(p: Poly, x: number): number {
  if (x <= p.xs[0]) return 0;
  const { i, u } = seg(p, x);
  return p.cum[i] + (p.cum[i + 1] - p.cum[i]) * u;
}
export function yAtX(p: Poly, x: number): number {
  const { i, u } = seg(p, x);
  return p.ys[i] + (p.ys[i + 1] - p.ys[i]) * u;
}

/** A dot as a zero-length round-capped subpath: stays round under any stretch of the SVG. */
const dot = (x: number, y: number) => `M${n2(x)} ${n2(y)}h0.01`;

/** Cumulative subpath strings: prefixes[d] holds every dot on or before day d. */
function prefixes(items: { day: number; part: string }[]): string[] {
  const out: string[] = [];
  let acc = "";
  let k = 0;
  for (let d = 0; d < DAYS; d++) {
    while (k < items.length && items[k].day <= d) acc += items[k++].part;
    out.push(acc);
  }
  return out;
}

/* ── each track at a pixel size ── */

export interface WeightGeo { trend: Poly; dots: string[] }
export interface StrengthGeo { lines: Record<Lift, Poly>; records: string[] }
/** Work: per day, the finished weeks' columns, the current week's column so far, its top point. */
export interface WorkGeo { done: string[]; current: string[]; avg: Poly; top: { x: number; y: number }[] }
export interface FuelGeo { kcal: Poly; protein: string[]; band: string }

const days = Array.from({ length: DAYS }, (_, d) => d);

export function weightGeo(w: number, h: number): WeightGeo {
  const X = (d: number) => fx(d) * w;
  const Y = (v: number) => fy("weight", v) * h;
  const trend = poly(days.map(X), SEASON.trend.map(Y));
  const items: { day: number; part: string }[] = [];
  SEASON.weighIns.forEach((v, d) => {
    if (v != null) items.push({ day: d, part: dot(X(d), Y(v)) });
  });
  return { trend, dots: prefixes(items) };
}

export function strengthGeo(w: number, h: number): StrengthGeo {
  const X = (d: number) => fx(d) * w;
  const Y = (v: number) => fy("strength", v) * h;
  const lines = {} as Record<Lift, Poly>;
  for (const lift of LIFTS) lines[lift] = poly(days.map(X), SEASON.liftDaily[lift].map(Y));
  const records = prefixes(SEASON.records.map((r) => ({ day: r.day, part: dot(X(r.day), Y(r.e1rm)) })));
  return { lines, records };
}

export function workGeo(w: number, h: number): WorkGeo {
  const X = (d: number) => fx(d) * w;
  const Y = (v: number) => fy("work", v) * h;
  const rect = (wk: number, sets: number) => {
    const x0 = X(colCenter(wk) - colHalf);
    const x1 = X(colCenter(wk) + colHalf);
    return `M${n2(x0)} ${n2(h)}V${n2(Y(sets))}H${n2(x1)}V${n2(h)}Z`;
  };
  let acc = "";
  const done: string[] = [];
  const current: string[] = [];
  const top: { x: number; y: number }[] = [];
  for (let d = 0; d < DAYS; d++) {
    const wk = weekOf(d) - 1;
    if (d % 7 === 0 && wk > 0) acc += rect(wk - 1, SEASON.weeklySets[wk - 1]);
    const now = setsThisWeek(d);
    done.push(acc);
    current.push(now > 0 ? rect(wk, now) : "");
    top.push({ x: X(colCenter(wk)), y: Y(now) });
  }
  const avg = poly(
    SEASON.avg4.map((_, wk) => X(colCenter(wk))),
    SEASON.avg4.map((v) => Y(v)),
  );
  return { done, current, avg, top };
}

export function fuelGeo(w: number, h: number): FuelGeo {
  const X = (d: number) => fx(d) * w;
  const Y = (v: number) => fy("fuel", v) * h;
  const kcal = poly(days.map(X), SEASON.kcal.map(Y));
  const protein = prefixes(
    days.filter((d) => SEASON.proteinHit[d]).map((d) => ({ day: d, part: dot(X(d), Y(PROTEIN_ROW)) })),
  );
  // the target band steps down where the cut starts (between day 6 and day 7)
  let band = "";
  let from = 0;
  for (let d = 1; d <= DAYS; d++) {
    if (d === DAYS || SEASON.kcalTarget[d] !== SEASON.kcalTarget[from]) {
      const t = SEASON.kcalTarget[from];
      const x0 = from === 0 ? 0 : X(from - 0.5);
      const x1 = d === DAYS ? w : X(d - 0.5);
      band += `M${n2(x0)} ${n2(Y(t + KCAL_BAND))}H${n2(x1)}V${n2(Y(t - KCAL_BAND))}H${n2(x0)}Z`;
      from = d;
    }
  }
  return { kcal, protein, band };
}

/** The goal band on the weight track, as fractions (drawn with percentages, no measuring needed). */
export const GOAL = { top: fy("weight", GOAL_BAND[1]), bottom: fy("weight", GOAL_BAND[0]) };

/* ── annotations ── */

export interface Annotation {
  id: string;
  track: TrackId;
  day: number;
  text: string;
  /** Where the label sits: its tick at x (a fraction of the plot), its centre at top (a fraction). */
  x: number;
  top: number;
  anchor: "start" | "end";
}
