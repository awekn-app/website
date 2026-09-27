"use client";

import { useState, type CSSProperties } from "react";
import { Room, roomStyles as r, useReducedMotion, useRoomLive } from "./Room";
import s from "./RoomPlates.module.css";

/* ── the app's plate maths, mirrored (awekn lib/powerlifting/plate.ts, GYM_KG) ── */

const BAR = 20;
const ALL_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25];
const NO_SMALL = [25, 20, 15, 10, 5, 2.5];
const MIN = 20;
const MAX = 250;
const STEP = 2.5;

/** Greedy per-side fill, heaviest first, never over the per-side target. */
function fillPerSide(perSide: number, plates: number[]): { sum: number; list: number[] } {
  let sum = 0;
  const list: number[] = [];
  for (const p of plates) {
    while (sum + p <= perSide + 1e-9) {
      sum += p;
      list.push(p);
    }
  }
  return { sum, list };
}

/** The nearest total this bar and these plates can actually make (a tie goes lighter). */
function roundToLoadable(target: number, plates: number[]): number {
  if (target <= BAR) return BAR;
  const { sum } = fillPerSide((target - BAR) / 2, plates);
  const min = plates[plates.length - 1];
  const under = BAR + 2 * sum;
  const over = BAR + 2 * (sum + min);
  return Math.abs(under - target) <= Math.abs(over - target) ? under : over;
}

/** The plates on one side for the nearest loadable total. */
function platesPerSide(total: number, plates: number[]): number[] {
  const loadable = roundToLoadable(total, plates);
  return loadable <= BAR ? [] : fillPerSide((loadable - BAR) / 2, plates).list;
}

const fmt = (v: number) => String(Math.round(v * 100) / 100);

/** "2 × 20, 1 × 10, 1 × 2.5" */
function perSideWords(list: number[]): string {
  if (list.length === 0) return "Bar only";
  const groups: { p: number; n: number }[] = [];
  for (const p of list) {
    const last = groups[groups.length - 1];
    if (last && last.p === p) last.n++;
    else groups.push({ p, n: 1 });
  }
  return groups.map((g) => `${g.n} × ${fmt(g.p)}`).join(", ");
}

/* plate geometry (svg units): heavier is taller and thicker; tone runs graphite to silver */
const SPEC: Record<number, { h: number; w: number; fill: string }> = {
  25: { h: 132, w: 15, fill: "#E9EAF0" },
  20: { h: 124, w: 13, fill: "#C7C7CC" },
  15: { h: 110, w: 12, fill: "#A1A1A6" },
  10: { h: 94, w: 10, fill: "#8E8E93" },
  5: { h: 72, w: 8, fill: "#737378" },
  2.5: { h: 56, w: 7, fill: "#5E5E63" },
  1.25: { h: 44, w: 6, fill: "#4C4C51" },
};
const GAP = 1.5;
const VB_W = 360;
const VB_H = 150;
const MID = VB_H / 2;
const COLLAR_L = 104; // the inner collar on each side; plates stack outward from here
const COLLAR_R = VB_W - COLLAR_L;

const SEED = 100;

/**
 * Room 02, plates. Drag to a target (or step it, or use the keys) and the app's plate maths loads
 * the bar per side, heaviest first; each plate that changes drops on with a small spring. Turn the
 * 1.25 kg plates off and it says when a weight can't be made exactly.
 */
export function RoomPlates() {
  const live = useRoomLive("plates");
  const reduced = useReducedMotion();

  const [state, setState] = useState({ target: SEED, small: true, from: platesPerSide(SEED, ALL_PLATES) });
  const { target, small } = state;
  const set = small ? ALL_PLATES : NO_SMALL;
  const side = platesPerSide(target, set);
  const loaded = roundToLoadable(target, set);
  const exact = Math.abs(loaded - target) < 1e-9;

  // the first slot that changed drops first; the rest follow it outward
  let firstNew = state.from.findIndex((p, i) => side[i] !== p);
  if (firstNew === -1) firstNew = state.from.length;

  const apply = (next: { target?: number; small?: boolean }) =>
    setState((prev) => {
      const t = Math.min(MAX, Math.max(MIN, next.target ?? prev.target));
      const sm = next.small ?? prev.small;
      return { target: t, small: sm, from: platesPerSide(prev.target, prev.small ? ALL_PLATES : NO_SMALL) };
    });

  const reset = () => setState({ target: SEED, small: true, from: platesPerSide(SEED, ALL_PLATES) });

  const pct = ((target - MIN) / (MAX - MIN)) * 100;
  const words = perSideWords(side);

  // plate rects for one side, x measured outward from the collar
  let x = 0;
  const discs = side.map((p, i) => {
    const sp = SPEC[p];
    const at = x;
    x += sp.w + GAP;
    return { p, i, at, ...sp };
  });

  return (
    <Room
      id="plates"
      index="02"
      name="Plates"
      flip
      title="Say the weight. See the bar."
      sub="Drag to a target and the plates load themselves, heaviest first, both sides."
      note="The app's plate maths, per side."
      onReset={reset}
    >
      <div className={`${r.card} ${live ? "" : s.paused}`}>
        <div className={s.readout}>
          <button type="button" className={`${r.disc} ${r.press}`} aria-label="2.5 kg lighter" disabled={target <= MIN} onClick={() => apply({ target: target - STEP })}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8 H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className={s.total}>
            <span className={`${s.big} ${r.num}`}>{fmt(target)}</span>
            <span className={s.unit}>kg on the bar</span>
          </div>
          <button type="button" className={`${r.disc} ${r.press}`} aria-label="2.5 kg heavier" disabled={target >= MAX} onClick={() => apply({ target: target + STEP })}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8 H13 M8 3 V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={`${r.well} ${s.stage}`}>
          <svg className={s.bar} viewBox={`0 0 ${VB_W} ${VB_H}`} role="img" aria-label={`Barbell loaded to ${fmt(loaded)} kg: ${words.toLowerCase()} per side`}>
            <defs>
              <linearGradient id="plates-sheen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
                <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity="0.32" />
              </linearGradient>
              <linearGradient id="plates-steel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8E8E93" />
                <stop offset="0.5" stopColor="#C7C7CC" />
                <stop offset="1" stopColor="#5E5E63" />
              </linearGradient>
            </defs>
            {/* the shaft, the collars and the sleeves */}
            <rect x={COLLAR_L} y={MID - 2.5} width={COLLAR_R - COLLAR_L} height={5} rx={2.5} fill="url(#plates-steel)" />
            <rect x={8} y={MID - 5} width={COLLAR_L - 8} height={10} rx={3} fill="url(#plates-steel)" />
            <rect x={COLLAR_R} y={MID - 5} width={VB_W - 8 - COLLAR_R} height={10} rx={3} fill="url(#plates-steel)" />
            <rect x={COLLAR_L - 1} y={MID - 12} width={6} height={24} rx={2} fill="#A1A1A6" />
            <rect x={COLLAR_R - 5} y={MID - 12} width={6} height={24} rx={2} fill="#A1A1A6" />

            {discs.map((d) => {
              const drop = !reduced && d.i >= firstNew;
              const style = { "--k": d.i - firstNew } as CSSProperties;
              const key = `${d.i}-${d.p}`;
              const y = MID - d.h / 2;
              return [
                <g key={`l-${key}`} className={drop ? s.drop : undefined} style={style}>
                  <rect x={COLLAR_L - 1 - d.at - d.w} y={y} width={d.w} height={d.h} rx={3} fill={d.fill} />
                  <rect x={COLLAR_L - 1 - d.at - d.w} y={y} width={d.w} height={d.h} rx={3} fill="url(#plates-sheen)" />
                </g>,
                <g key={`r-${key}`} className={drop ? s.drop : undefined} style={style}>
                  <rect x={COLLAR_R + 1 + d.at} y={y} width={d.w} height={d.h} rx={3} fill={d.fill} />
                  <rect x={COLLAR_R + 1 + d.at} y={y} width={d.w} height={d.h} rx={3} fill="url(#plates-sheen)" />
                </g>,
              ];
            })}
          </svg>
        </div>

        <div className={s.range}>
          <input
            type="range"
            className={s.slider}
            min={MIN}
            max={MAX}
            step={STEP}
            value={target}
            onChange={(e) => apply({ target: Number(e.currentTarget.value) })}
            aria-label="Target weight"
            aria-valuetext={`${fmt(target)} kg`}
            style={{ "--p": `${pct}%` } as CSSProperties}
          />
          <div className={`${s.scale} ${r.num}`} aria-hidden="true">
            <span>{MIN} kg</span>
            <span>{MAX} kg</span>
          </div>
        </div>

        <div className={s.foot}>
          <div className={s.perSide} role="status" aria-live="polite" aria-atomic="true">
            <span className={s.label}>Per side</span>
            <span className={`${s.list} ${r.num}`}>{words}</span>
            <span className={`${s.line} ${r.num} ${exact ? "" : s.warn}`}>
              {exact
                ? loaded === BAR
                  ? "Just the 20 kg bar."
                  : `Exact: the 20 kg bar and ${fmt((loaded - BAR) / 2)} kg a side.`
                : `${fmt(target)} kg can't be made exactly. Nearest is ${fmt(loaded)} kg.`}
            </span>
          </div>
          <button
            type="button"
            className={`${r.chip} ${r.press} ${s.toggle}`}
            aria-pressed={small}
            onClick={() => apply({ small: !small })}
          >
            <span className={`${s.dot} ${small ? s.on : ""}`} aria-hidden="true" />
            1.25 kg plates
          </button>
        </div>
      </div>
    </Room>
  );
}
