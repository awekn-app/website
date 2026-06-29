"use client";

import { useId } from "react";
import styles from "./HeroBarbell.module.css";

/* ════════════════════════════════════════════════════════════════════════
   THE HERO BARBELL - a still, weighty, premium hero graphic.

   NOT interactive. ONE long olympic barbell, LOADED HEAVY: a long bare knurled
   centre shaft (the grip), then a thick stack of SIX machined silver plates per
   side pushed out toward the ends, locked on with spring collars. It must read
   "barbell loaded to the max", hardcore, NOT a dumbbell. Centred in the cosmic
   pool of light.

   It speaks the SAME machined-metal language as PlateLoader.tsx:
     - silver linear-gradient plate faces, a thin dark inner edge for depth,
       a faint top specular cap, a center bore shadow line.
     - olympic sleeves (horizontal-cylinder shading) + spring collars (inner +
       outer) + a long central knurled shaft with thin vertical hatching.

   Why long + 6 plates: a short bar with plates clustered near the centre reads
   as a DUMBBELL. A LONG bare centre + a thick plate wall out on each sleeve
   reads, unmistakably, as a fully-loaded olympic barbell.

   Brand law honoured (black + silver + cosmic, NOT green):
     - strictly silver / white / near-black. NO emerald: a hero barbell is
       chrome, not an earned moment, so the rare --signal stays unspent.
     - the bloom is additive WHITE only (a colored halo on near-black reads as
       a dark hole), an ellipse pool of light cradling the bar.
     - motion is transform / opacity only: a slow ~7s sheen sweep (a moving
       white highlight masked to the steel) + a gentle ~6s float. Pure CSS.
     - reduced-motion: everything snaps static, no sheen, no float.
     - gradient / mask ids namespaced with useId() so multiple instances and
       SSR hydration never collide.

   Natural aspect ratio is 1160 x 392 (~2.96:1). preserveAspectRatio keeps it
   crisp from ~320px to ~1160px wide.
   ════════════════════════════════════════════════════════════════════════ */

type Props = { className?: string };

// the viewBox - long and shallow, an olympic barbell laid flat.
const VB_W = 1160;
const VB_H = 392;
const CX = VB_W / 2;
const CY = VB_H / 2;

// ── geometry (mirrors PlateLoader's vocabulary, scaled for a long hero bar) ──
const SHAFT_HALF = 176; // half the LONG central knurled grip (so 352 of bare bar)
const COLLAR_W = 16; // inner spring-collar ring width (shaft -> plates)
const COLLAR_OUT_W = 14; // outer spring-collar ring width (locks the load on)
const SLEEVE_LEN = 310; // each loadable sleeve length
const PLATE_GAP = 4; // gap between adjacent discs (tight = stacked heavy)

// a HEAVY, maxed load: six machined plates per side, biggest inboard, a near-
// flat wall of steel with a gentle outer taper. h = disc diameter, w = disc
// thickness (thick = heavy). The stack fills most of the bar's height.
type PlateSpec = { h: number; w: number };
const STACK: PlateSpec[] = [
  { h: 300, w: 44 }, // inboard - the big plate
  { h: 300, w: 42 },
  { h: 298, w: 42 },
  { h: 292, w: 40 },
  { h: 262, w: 38 },
  { h: 214, w: 34 }, // outboard - the smaller change plate
];

export default function HeroBarbell({ className }: Props) {
  const uid = useId();
  const id = (name: string) => `hb-${uid}-${name}`;

  // place the left stack outward from the inner collar; mirror to the right.
  const leftStart = CX - SHAFT_HALF - COLLAR_W; // inner end of the left sleeve
  let cursor = leftStart;
  const placed = STACK.map((spec, i) => {
    const x = cursor - spec.w; // disc occupies [x, x + w]
    cursor = x - PLATE_GAP;
    return { ...spec, x, i };
  });
  const outerPlateX = placed[placed.length - 1].x; // outermost (left) plate edge

  // sleeve x-origins (left/right), used for the sleeves + end caps.
  const sleeves = [-1, 1].map((side) => {
    const inner =
      side < 0 ? CX - SHAFT_HALF - COLLAR_W : CX + SHAFT_HALF + COLLAR_W;
    const x = side < 0 ? inner - SLEEVE_LEN : inner;
    return { side, x };
  });

  // one machined disc, drawn from the shared metal vocabulary.
  const renderDisc = (x: number, spec: PlateSpec, keyName: string) => {
    const { h, w } = spec;
    const y = CY - h / 2;
    const r = Math.min(11, w / 2);
    return (
      <g key={keyName} className={styles.steel}>
        {/* the machined face */}
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={r}
          fill={`url(#${id("disc")})`}
          stroke="#23242B"
          strokeWidth={1}
        />
        {/* thin dark inner edge for depth */}
        <rect
          x={x + 2.4}
          y={y + 5}
          width={Math.max(1, w - 4.8)}
          height={h - 10}
          rx={Math.max(3, r - 2)}
          fill="none"
          stroke="#15161B"
          strokeWidth={1}
          opacity={0.55}
        />
        {/* faint top specular cap */}
        <rect
          x={x + 1.6}
          y={y + 2.4}
          width={w - 3.2}
          height={Math.min(28, h * 0.16)}
          rx={Math.max(3, r - 1)}
          fill={`url(#${id("spec")})`}
          opacity={0.85}
        />
        {/* center bore shadow line (the hole, in profile) */}
        <rect x={x} y={CY - 9} width={w} height={18} fill="#000000" opacity={0.16} />
      </g>
    );
  };

  // a spring collar (inner or outer), drawn at a given x with a given height.
  const renderCollar = (x: number, w: number, halfH: number, keyName: string) => (
    <g key={keyName}>
      <rect
        x={x}
        y={CY - halfH}
        width={w}
        height={halfH * 2}
        rx={5}
        fill={`url(#${id("shaft")})`}
      />
      <rect
        x={x + 1.5}
        y={CY - halfH + 1}
        width={4}
        height={halfH * 2 - 2}
        rx={2}
        fill="#FFFFFF"
        opacity={0.3}
      />
    </g>
  );

  return (
    <div className={`${styles.wrap}${className ? ` ${className}` : ""}`}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="img"
        aria-label="A long olympic barbell loaded heavy, six machined silver plates per side, resting in a pool of light."
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* machined silver disc face - vertical light, dark core, top spec */}
          <linearGradient id={id("disc")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F6F7FC" />
            <stop offset="13%" stopColor="#D2D3DD" />
            <stop offset="48%" stopColor="#8E8F9A" />
            <stop offset="85%" stopColor="#54555F" />
            <stop offset="100%" stopColor="#34353E" />
          </linearGradient>
          {/* the silver sleeve gradient (horizontal-cylinder shading) */}
          <linearGradient id={id("sleeve")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E6E7EF" />
            <stop offset="30%" stopColor="#ABACB8" />
            <stop offset="56%" stopColor="#76777F" />
            <stop offset="100%" stopColor="#3A3B44" />
          </linearGradient>
          {/* the knurled shaft gradient */}
          <linearGradient id={id("shaft")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D9DAE2" />
            <stop offset="34%" stopColor="#999AA6" />
            <stop offset="60%" stopColor="#646571" />
            <stop offset="100%" stopColor="#313239" />
          </linearGradient>
          {/* soft white specular blob at each disc's top edge */}
          <linearGradient id={id("spec")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          {/* the additive WHITE pool of light cradling the bar */}
          <radialGradient id={id("pool")} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.13" />
            <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          {/* a soft grounding shadow beneath the bar */}
          <radialGradient id={id("shadow")} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* the travelling sheen: a tilted soft-white band. We slide a wide
             rect carrying this gradient across the steel, clipped to the metal
             silhouette via the mask below, so light sweeps only on the bar. */}
          <linearGradient id={id("sheen")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
            <stop offset="58%" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* the mask = the full metal silhouette in white, so the sheen rect
             is revealed only where steel exists. */}
          <mask
            id={id("metalMask")}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={VB_W}
            height={VB_H}
          >
            <rect x="0" y="0" width={VB_W} height={VB_H} fill="#000" />
            {/* sleeves */}
            {sleeves.map(({ side, x }) => (
              <rect
                key={`m-sleeve-${side}`}
                x={x}
                y={CY - 17}
                width={SLEEVE_LEN}
                height={34}
                rx={7}
                fill="#fff"
              />
            ))}
            {/* shaft (incl. inner collars) */}
            <rect
              x={CX - SHAFT_HALF - COLLAR_W}
              y={CY - 15}
              width={(SHAFT_HALF + COLLAR_W) * 2}
              height={30}
              rx={7}
              fill="#fff"
            />
            {/* discs (left + mirrored right) */}
            {placed.map((p) => {
              const r = Math.min(11, p.w / 2);
              const rightX = 2 * CX - p.x - p.w;
              return (
                <g key={`m-disc-${p.i}`}>
                  <rect x={p.x} y={CY - p.h / 2} width={p.w} height={p.h} rx={r} fill="#fff" />
                  <rect x={rightX} y={CY - p.h / 2} width={p.w} height={p.h} rx={r} fill="#fff" />
                </g>
              );
            })}
          </mask>
        </defs>

        {/* ── the cosmic pool of light behind the bar ── */}
        <ellipse cx={CX} cy={CY - 8} rx={VB_W * 0.5} ry={150} fill={`url(#${id("pool")})`} />

        {/* the gentle-float group carries the whole instrument */}
        <g className={styles.float}>
          {/* grounding shadow on the floor of the pool */}
          <ellipse cx={CX} cy={CY + 130} rx={430} ry={24} fill={`url(#${id("shadow")})`} />

          {/* ── the two loadable sleeves + end caps ── */}
          {sleeves.map(({ side, x }) => (
            <g key={`sleeve-${side}`}>
              <rect
                x={x}
                y={CY - 16}
                width={SLEEVE_LEN}
                height={32}
                rx={7}
                fill={`url(#${id("sleeve")})`}
              />
              {/* sleeve top specular hairline */}
              <rect
                x={x}
                y={CY - 15}
                width={SLEEVE_LEN}
                height={5}
                rx={2.5}
                fill="#FFFFFF"
                opacity={0.24}
              />
              {/* a few sleeve detail rings near the cap */}
              {[0.08, 0.16, 0.24].map((t, k) => {
                const rx = side < 0 ? x + SLEEVE_LEN * t : x + SLEEVE_LEN * (1 - t);
                return (
                  <line
                    key={`ring-${side}-${k}`}
                    x1={rx}
                    y1={CY - 15}
                    x2={rx}
                    y2={CY + 15}
                    stroke="#26272E"
                    strokeWidth={1}
                    opacity={0.3}
                  />
                );
              })}
              {/* sleeve end cap */}
              <rect
                x={side < 0 ? x - 11 : x + SLEEVE_LEN}
                y={CY - 22}
                width={11}
                height={44}
                rx={4}
                fill={`url(#${id("shaft")})`}
              />
            </g>
          ))}

          {/* ── inner spring collars (shaft -> plates) ── */}
          {[-1, 1].map((side) =>
            renderCollar(
              side < 0 ? CX - SHAFT_HALF - COLLAR_W : CX + SHAFT_HALF,
              COLLAR_W,
              34,
              `collar-in-${side}`,
            ),
          )}

          {/* ── outer spring collars (lock the load on the sleeve) ── */}
          {[-1, 1].map((side) => {
            const lx = outerPlateX - PLATE_GAP - COLLAR_OUT_W; // left outer collar
            const x = side < 0 ? lx : 2 * CX - lx - COLLAR_OUT_W;
            return renderCollar(x, COLLAR_OUT_W, 28, `collar-out-${side}`);
          })}

          {/* ── the long central knurled shaft ── */}
          <g>
            <rect
              x={CX - SHAFT_HALF}
              y={CY - 15}
              width={SHAFT_HALF * 2}
              height={30}
              rx={6}
              fill={`url(#${id("shaft")})`}
            />
            {/* knurl hatching: thin vertical strokes across the long grip */}
            {Array.from({ length: 60 }).map((_, i) => {
              const kx = CX - SHAFT_HALF + 8 + i * ((SHAFT_HALF * 2 - 16) / 59);
              return (
                <line
                  key={`knurl-${i}`}
                  x1={kx}
                  y1={CY - 11}
                  x2={kx}
                  y2={CY + 11}
                  stroke="#23242B"
                  strokeWidth={1}
                  opacity={0.5}
                />
              );
            })}
            {/* shaft top specular */}
            <rect
              x={CX - SHAFT_HALF + 4}
              y={CY - 14}
              width={SHAFT_HALF * 2 - 8}
              height={4}
              rx={2}
              fill="#FFFFFF"
              opacity={0.2}
            />
          </g>

          {/* ── the plates: left stack + mirrored right stack ── */}
          {placed.map((p) => {
            const rightX = 2 * CX - p.x - p.w;
            return (
              <g key={`plate-${p.i}`}>
                {renderDisc(p.x, p, `L-${p.i}`)}
                {renderDisc(rightX, p, `R-${p.i}`)}
              </g>
            );
          })}

          {/* ── the travelling sheen, clipped to the metal silhouette ── */}
          <g mask={`url(#${id("metalMask")})`} className={styles.sheenLayer}>
            <rect
              className={styles.sheen}
              x={-VB_W}
              y={0}
              width={VB_W}
              height={VB_H}
              fill={`url(#${id("sheen")})`}
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
