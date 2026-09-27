"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./Arc.module.css";

/* ── the twelve weeks (deterministic: day 1 is index 0, week 12 is index 12) ── */
const WEEKS = 12;
const BODYWEIGHT = [84.0, 83.6, 83.1, 82.8, 82.5, 82.0, 81.6, 81.2, 80.8, 80.3, 79.9, 79.4, 79.0];
const E1RM = [100.0, 101.5, 103.5, 105.0, 106.5, 108.5, 110.0, 112.5, 113.5, 115.0, 116.5, 118.5, 120.0];

/* ── the chart's own space ── */
const VB_W = 360;
const VB_H = 190;
const X0 = 30;
const X1 = 330;
const Y_TOP = 16;
const Y_BOT = 174;
const Y_MID = (Y_TOP + Y_BOT) / 2;

/** Bodyweight reads 84 kg on the top gridline and 79 kg on the bottom one. */
const bwY = (v: number) => Y_TOP + ((84 - v) / 5) * (Y_BOT - Y_TOP);
/** Estimated 1RM reads 100 kg on the bottom gridline and 120 kg on the top one. */
const rmY = (v: number) => Y_BOT - ((v - 100) / 20) * (Y_BOT - Y_TOP);

const GRID = [
  { y: Y_TOP, bw: "84", rm: "120" },
  { y: Y_MID, bw: "81.5", rm: "110" },
  { y: Y_BOT, bw: "79", rm: "100" },
];

type Pt = { x: number; y: number };
type Seg = { p0: Pt; c1: Pt; c2: Pt; p1: Pt; start: number; cum: number[] };
type Line = { d: string; segs: Seg[]; total: number; end: Pt };

const SAMPLES = 24;

function bezier(seg: Seg, u: number): Pt {
  const v = 1 - u;
  const a = v * v * v;
  const b = 3 * v * v * u;
  const c = 3 * v * u * u;
  const e = u * u * u;
  return {
    x: a * seg.p0.x + b * seg.c1.x + c * seg.c2.x + e * seg.p1.x,
    y: a * seg.p0.y + b * seg.c1.y + c * seg.c2.y + e * seg.p1.y,
  };
}

/**
 * A smooth line through the weekly points (Catmull-Rom as cubic Beziers). The points are evenly
 * spaced in x, so x runs linearly in each segment's parameter: time t sits exactly at u = t - i.
 * Each segment carries a sampled arc-length table, so the draw-in (stroke-dashoffset) ends exactly
 * at the week the counter shows.
 */
function buildLine(values: number[], toY: (v: number) => number): Line {
  const pts = values.map((v, i) => ({ x: X0 + (i / WEEKS) * (X1 - X0), y: toY(v) }));
  const tangent = (i: number): Pt => {
    const prev = pts[Math.max(0, i - 1)];
    const next = pts[Math.min(pts.length - 1, i + 1)];
    const span = i === 0 || i === pts.length - 1 ? 1 : 2;
    return { x: (next.x - prev.x) / span, y: (next.y - prev.y) / span };
  };
  const segs: Seg[] = [];
  let total = 0;
  let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const m0 = tangent(i);
    const m1 = tangent(i + 1);
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const c1 = { x: p0.x + m0.x / 3, y: p0.y + m0.y / 3 };
    const c2 = { x: p1.x - m1.x / 3, y: p1.y - m1.y / 3 };
    const seg: Seg = { p0, c1, c2, p1, start: total, cum: [0] };
    let prev = p0;
    let len = 0;
    for (let k = 1; k <= SAMPLES; k++) {
      const q = bezier(seg, k / SAMPLES);
      len += Math.hypot(q.x - prev.x, q.y - prev.y);
      seg.cum.push(len);
      prev = q;
    }
    total += len;
    segs.push(seg);
    d += ` C${c1.x.toFixed(2)} ${c1.y.toFixed(2)} ${c2.x.toFixed(2)} ${c2.y.toFixed(2)} ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
  }
  return { d, segs, total, end: pts[pts.length - 1] };
}

const BW_LINE = buildLine(BODYWEIGHT, bwY);
const RM_LINE = buildLine(E1RM, rmY);

function locate(t: number) {
  const i = Math.min(Math.floor(t), WEEKS - 1);
  return { i, u: Math.min(1, Math.max(0, t - i)) };
}
function pointAt(line: Line, t: number): Pt {
  const { i, u } = locate(t);
  return bezier(line.segs[i], u);
}
function lengthAt(line: Line, t: number): number {
  const { i, u } = locate(t);
  const seg = line.segs[i];
  const k = u * SAMPLES;
  const j = Math.min(Math.floor(k), SAMPLES - 1);
  return seg.start + seg.cum[j] + (seg.cum[j + 1] - seg.cum[j]) * (k - j);
}
function valueAt(values: number[], t: number): number {
  const { i, u } = locate(t);
  return values[i] + (values[i + 1] - values[i]) * u;
}
const weekLabel = (t: number) => (t < 0.5 ? "Day 1" : `Week ${Math.round(t)}`);
const pct = (v: number, of: number) => `${((v / of) * 100).toFixed(3)}%`;

/** The scrub only runs where it can breathe; this exact query also gates the tall track in the CSS. */
const MOTION = "(prefers-reduced-motion: no-preference) and (min-height: 521px)";

/** Writes into the text node React rendered, so React's own node stays the one in the DOM. */
function setText(el: HTMLElement, value: string) {
  const node = el.firstChild;
  if (node && node.nodeType === Node.TEXT_NODE) node.nodeValue = value;
  else el.textContent = value;
}

/**
 * THE ARC (story beat 2): day 1 to week 12. A tall track holds a sticky stage while the scroll
 * scrubs time: the bodyweight trend (white) drifts down, the estimated 1RM (ember, the one accent
 * here) climbs, the week counter and both numbers follow, and the statue behind sharpens from a
 * blur into stone. Every frame writes to refs, text nodes and one CSS variable, never React state.
 * The server render is week 12 (finished lines, crisp statue), which is also what reduced motion
 * and no-JS see.
 */
export function Arc() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const statueRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const bwPathRef = useRef<SVGPathElement>(null);
  const rmPathRef = useRef<SVGPathElement>(null);
  const bwHeadRef = useRef<SVGGElement>(null);
  const rmHeadRef = useRef<SVGGElement>(null);
  const cursorRef = useRef<SVGLineElement>(null);
  const weekRef = useRef<HTMLSpanElement>(null);
  const bwValRef = useRef<HTMLSpanElement>(null);
  const rmValRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const statue = statueRef.current;
    const svg = svgRef.current;
    const bwPath = bwPathRef.current;
    const rmPath = rmPathRef.current;
    const bwHead = bwHeadRef.current;
    const rmHead = rmHeadRef.current;
    const cursor = cursorRef.current;
    const weekEl = weekRef.current;
    const bwEl = bwValRef.current;
    const rmEl = rmValRef.current;
    if (!root || !track || !statue || !svg || !bwPath || !rmPath || !bwHead || !rmHead || !cursor || !weekEl || !bwEl || !rmEl) {
      return;
    }

    // chart units per CSS pixel: keeps the strokes at 2px and the end marks one size at any width
    let k = VB_W / (svg.clientWidth || VB_W);
    let live = false;
    let current = WEEKS;
    let lastWeek = "";
    let lastBw = "";
    let lastRm = "";

    const render = (t: number) => {
      current = t;
      const week = weekLabel(t);
      if (week !== lastWeek) setText(weekEl, (lastWeek = week));
      const bw = valueAt(BODYWEIGHT, t).toFixed(1);
      if (bw !== lastBw) setText(bwEl, (lastBw = bw));
      const rm = valueAt(E1RM, t).toFixed(1);
      if (rm !== lastRm) setText(rmEl, (lastRm = rm));

      const bp = pointAt(BW_LINE, t);
      const rp = pointAt(RM_LINE, t);
      bwHead.style.transform = `translate(${bp.x.toFixed(2)}px, ${bp.y.toFixed(2)}px) scale(${k.toFixed(4)})`;
      rmHead.style.transform = `translate(${rp.x.toFixed(2)}px, ${rp.y.toFixed(2)}px) scale(${k.toFixed(4)})`;

      if (!live) return;
      bwPath.style.strokeDashoffset = (BW_LINE.total - lengthAt(BW_LINE, t)).toFixed(2);
      rmPath.style.strokeDashoffset = (RM_LINE.total - lengthAt(RM_LINE, t)).toFixed(2);
      cursor.style.transform = `translateX(${(bp.x - X1).toFixed(2)}px)`;
      statue.style.setProperty("--p", (t / WEEKS).toFixed(3));
    };

    const ro = new ResizeObserver(() => {
      const w = svg.clientWidth;
      if (!w) return;
      k = VB_W / w;
      svg.style.setProperty("--k", k.toFixed(4));
      render(current);
    });
    ro.observe(svg);

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(root);

    mm.add(MOTION, () => {
      live = true;
      root.classList.add(s.live);
      bwPath.style.strokeDasharray = `${BW_LINE.total.toFixed(2)} ${BW_LINE.total.toFixed(2)}`;
      rmPath.style.strokeDasharray = `${RM_LINE.total.toFixed(2)} ${RM_LINE.total.toFixed(2)}`;
      render(0);

      // a short hold at day 1 and at week 12, time scrubs in between
      const toWeeks = (p: number) => Math.min(1, Math.max(0, (p - 0.05) / 0.85)) * WEEKS;
      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.5 },
        onUpdate: () => render(toWeeks(proxy.p)),
      });

      return () => {
        live = false;
        root.classList.remove(s.live);
        for (const path of [bwPath, rmPath]) {
          path.style.removeProperty("stroke-dasharray");
          path.style.removeProperty("stroke-dashoffset");
        }
        cursor.style.removeProperty("transform");
        statue.style.removeProperty("--p");
        render(WEEKS);
      };
    });

    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });

    return () => {
      alive = false;
      ro.disconnect();
      mm.revert();
    };
  }, []);

  const bwEnd = BW_LINE.end;
  const rmEnd = RM_LINE.end;

  return (
    <section className={s.arc} id="arc" ref={rootRef} aria-labelledby="arc-title">
      <div className={s.track} ref={trackRef}>
        <div className={s.stage}>
          <div className={s.statue} ref={statueRef} aria-hidden="true">
            <Image
              src="/statue-atlas-cut.png"
              alt=""
              width={580}
              height={950}
              sizes="(min-width: 900px) 520px, 78vw"
              className={s.statueImg}
            />
          </div>

          <div className={s.copy}>
            <p className={s.eyebrow}>The arc</p>
            <h2 className={s.title} id="arc-title">Day 1 to week 12.</h2>
            <p className={s.sub}>
              Log it every day and twelve weeks become one picture: the scale drifting down, the bar going up.
            </p>

            <div className={s.readout}>
              <p className={s.week}>
                <span className={s.weekSizer} aria-hidden="true">Week 12</span>
                <span className={s.weekLive} ref={weekRef}>Week 12</span>
              </p>
              <ul className={s.legend}>
                <li className={s.key}>
                  <span className={s.keyName}>
                    <span className={`${s.swatch} ${s.swatchBw}`} aria-hidden="true" />
                    Bodyweight, the trend
                  </span>
                  <span className={s.value}>
                    <span className={s.num} ref={bwValRef}>{BODYWEIGHT[WEEKS].toFixed(1)}</span>
                    <span className={s.unit}> kg</span>
                  </span>
                </li>
                <li className={s.key}>
                  <span className={s.keyName}>
                    <span className={`${s.swatch} ${s.swatchRm}`} aria-hidden="true" />
                    Estimated 1RM
                  </span>
                  <span className={s.value}>
                    <span className={s.num} ref={rmValRef}>{E1RM[WEEKS].toFixed(1)}</span>
                    <span className={s.unit}> kg</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <figure className={s.figure}>
            <div className={s.plot}>
              <svg
                ref={svgRef}
                className={s.chart}
                viewBox={`0 0 ${VB_W} ${VB_H}`}
                role="img"
                aria-label="Twelve weeks of one log: the bodyweight trend falls from 84 to 79 kilograms while the estimated one rep max rises from 100 to 120 kilograms."
              >
                {GRID.map((g) => (
                  <line key={g.y} className={s.grid} x1={X0} x2={X1} y1={g.y} y2={g.y} />
                ))}
                <line ref={cursorRef} className={s.cursor} x1={X1} x2={X1} y1={Y_TOP - 8} y2={Y_BOT + 8} />
                <path ref={bwPathRef} className={`${s.line} ${s.bw}`} d={BW_LINE.d} />
                <path ref={rmPathRef} className={`${s.line} ${s.rm}`} d={RM_LINE.d} />
                <g ref={bwHeadRef} transform={`translate(${bwEnd.x} ${bwEnd.y})`}>
                  <circle className={s.bwDot} r={3.5} />
                </g>
                <g ref={rmHeadRef} transform={`translate(${rmEnd.x} ${rmEnd.y})`}>
                  <circle className={s.rmHalo} r={10} />
                  <circle className={s.rmDot} r={4} />
                </g>
              </svg>
              <div className={s.labels} aria-hidden="true">
                {GRID.map((g) => (
                  <span key={`bw${g.y}`} className={`${s.label} ${s.labelLeft}`} style={{ top: pct(g.y, VB_H) }}>
                    {g.bw}
                  </span>
                ))}
                {GRID.map((g) => (
                  <span key={`rm${g.y}`} className={`${s.label} ${s.labelRight}`} style={{ top: pct(g.y, VB_H) }}>
                    {g.rm}
                  </span>
                ))}
              </div>
            </div>
            <div className={s.axis} aria-hidden="true" style={{ paddingInline: pct(X0, VB_W) }}>
              <span>Day 1</span>
              <span>Week 12</span>
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}
