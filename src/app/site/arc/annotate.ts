/**
 * THE ANNOTATION SOLVER (the arc). Offline only: scripts/arc-precompute.mjs runs it and writes the
 * answer to annotations.generated.ts, so no browser ever pays for the search (it cost 18 to 42 ms of
 * module load on an M-series laptop, far more on a mid Android). Nothing on the page imports this.
 *
 * Each track's labels are laid out at the track's smallest size (MIN_W by its minH): each label
 * tries the side of its day with more room first, then every height from nearest its point outwards,
 * and takes the first spot clear of every line, dot, column and earlier label (with a margin). A
 * spot clear at the smallest size stays clear at any larger one, since the label's share of the plot
 * only shrinks.
 */

import { DAYS, WEEKS, LIFTS, SEASON, EVENTS, LIFT_NAME } from "./season";
import {
  MIN_W,
  TRACKS,
  colCenter,
  colHalf,
  fuelGeo,
  fx,
  fy,
  strengthGeo,
  weightGeo,
  workGeo,
  yAtX,
  type Annotation,
  type Poly,
  type TrackId,
} from "./instrument";

const LABEL_H = 13;
const CHAR_W = 6.3;
const MARGIN = 2.5;
const labelW = (text: string) => text.length * CHAR_W + 8;
const fmtKg = (v: number) => (Number.isInteger(v) ? v.toString() : v.toFixed(1));

type Box = [number, number, number, number];
interface Obstacles { lines: Poly[]; dots: [number, number, number][]; boxes: Box[] }
interface Spec { id: string; day: number; text: string; near: number }

function obstaclesFor(track: TrackId, w: number, h: number): Obstacles {
  if (track === "weight") {
    const g = weightGeo(w, h);
    const X = (d: number) => fx(d) * w;
    const dots: [number, number, number][] = [];
    SEASON.weighIns.forEach((v, d) => {
      if (v != null) dots.push([X(d), fy("weight", v) * h, 1.5]);
    });
    return { lines: [g.trend], dots, boxes: [] };
  }
  if (track === "strength") {
    const g = strengthGeo(w, h);
    return { lines: LIFTS.map((l) => g.lines[l]), dots: [], boxes: [] };
  }
  if (track === "work") {
    const g = workGeo(w, h);
    const boxes: Box[] = SEASON.weeklySets.map((v, wk) => [
      fx(colCenter(wk) - colHalf) * w,
      fy("work", v) * h,
      fx(colCenter(wk) + colHalf) * w,
      h,
    ]);
    return { lines: [g.avg], dots: [], boxes };
  }
  const g = fuelGeo(w, h);
  return { lines: [g.kcal], dots: [], boxes: [] };
}

function clear(box: Box, ob: Obstacles, placed: Box[]): boolean {
  const [x0, y0, x1, y1] = box;
  const a = y0 - MARGIN;
  const b = y1 + MARGIN;
  for (const p of ob.lines) {
    for (let x = x0 - MARGIN; x <= x1 + MARGIN; x += 1) {
      if (x < p.xs[0] || x > p.xs[p.xs.length - 1]) continue;
      const y = yAtX(p, x);
      if (y >= a && y <= b) return false;
    }
  }
  for (const [cx, cy, r] of ob.dots) {
    if (cx + r >= x0 - MARGIN && cx - r <= x1 + MARGIN && cy + r >= a && cy - r <= b) return false;
  }
  for (const [bx0, by0, bx1, by1] of [...ob.boxes, ...placed]) {
    if (bx1 >= x0 - MARGIN && bx0 <= x1 + MARGIN && by1 >= a && by0 <= b) return false;
  }
  return true;
}

function layout(track: TrackId, specs: Spec[], misses: string[]): Annotation[] {
  const w = MIN_W;
  const h = TRACKS[track].minH;
  const ob = obstaclesFor(track, w, h);
  const placed: Box[] = [];
  const out: Annotation[] = [];
  for (const spec of specs) {
    const x = fx(spec.day) * w;
    const lw = labelW(spec.text);
    const nearY = fy(track, spec.near) * h;
    const anchors: ("start" | "end")[] = x / w < 0.55 ? ["start", "end"] : ["end", "start"];
    const heights: number[] = [];
    for (let y = LABEL_H / 2; y <= h - LABEL_H / 2; y += 0.5) heights.push(y);
    heights.sort((p, q) => Math.abs(p - nearY) - Math.abs(q - nearY));
    let chosen: { box: Box; anchor: "start" | "end"; y: number } | null = null;
    for (const anchor of anchors) {
      const bx0 = anchor === "start" ? x : x - lw;
      const bx1 = anchor === "start" ? x + lw : x;
      if (bx0 < 0 || bx1 > w) continue;
      for (const y of heights) {
        const box: Box = [bx0, y - LABEL_H / 2, bx1, y + LABEL_H / 2];
        if (clear(box, ob, placed)) {
          chosen = { box, anchor, y };
          break;
        }
      }
      if (chosen) break;
    }
    if (!chosen) {
      // the script fails on any miss: the top edge on the roomier side, only so the solve completes
      const anchor = anchors[0];
      const y = LABEL_H / 2;
      chosen = { box: [anchor === "start" ? x : x - lw, 0, anchor === "start" ? x + lw : x, LABEL_H], anchor, y };
      misses.push(spec.id);
    }
    placed.push(chosen.box);
    out.push({ id: spec.id, track, day: spec.day, text: spec.text, x: fx(spec.day), top: chosen.y / h, anchor: chosen.anchor });
  }
  return out;
}

/** Solves every annotation; `misses` names any label that found no clear spot (the script fails on one). */
export function solveAnnotations(): { annotations: Annotation[]; misses: string[] } {
  const misses: string[] = [];
  const sq = EVENTS.squatRecord;
  const bn = EVENTS.benchRecord;
  const down = SEASON.trend[0] - SEASON.trend[DAYS - 1];
  const annotations = [
    ...layout("weight", [
      { id: "cut", day: EVENTS.cutStart, text: "Cut starts", near: SEASON.trend[EVENTS.cutStart] },
      { id: "end", day: EVENTS.end, text: `Week ${WEEKS}, ${down.toFixed(1)} kg down`, near: SEASON.trend[EVENTS.end] },
    ], misses),
    ...layout("strength", [
      { id: "squat", day: sq.day, text: `New ${LIFT_NAME[sq.lift].toLowerCase()} record`, near: sq.e1rm },
      { id: "bench", day: bn.day, text: `${LIFT_NAME[bn.lift]} ${fmtKg(bn.weight)} kg x ${bn.reps}, a record`, near: bn.e1rm },
    ], misses),
    ...layout("work", [
      { id: "deload", day: EVENTS.deloadStart, text: "Deload", near: SEASON.weeklySets[EVENTS.deloadStart / 7] },
    ], misses),
  ];
  return { annotations, misses };
}
