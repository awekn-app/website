import { useId } from "react";
import type { CSSProperties } from "react";
import { MARK_VIEW, MARK_W, MARK_H, MARK_SHELL, MARK_KEY, WORD_VIEW, WORD_W, WORD_H, WORD_A, WORD_REST } from "./paths";

/**
 * The brand in code (docs/BRAND_REVAMP_PLAN_2026-09-28.md): the A mark (THE logo) and the Awekn
 * wordmark (branding, the mark as its first letter), as inline SVG so they stay sharp at any size and
 * take any finish:
 *   chrome: the polished metal of the founder's files (a lit face, a cool dark band, a bright return)
 *           with a thin bright bevel on the edges;
 *   white / ink / current: flat, for small sizes, light grounds and anything that inherits a colour.
 * Server-safe (useId is fine in a server component); no client JS.
 */
type Tone = "chrome" | "white" | "ink" | "current";

type Props = {
  tone?: Tone;
  className?: string;
  style?: CSSProperties;
  /** the accessible name; omit for a decorative use (it is then hidden from assistive tech) */
  title?: string;
};

const FLAT: Record<Exclude<Tone, "chrome">, string> = { white: "#FFFFFF", ink: "#050506", current: "currentColor" };

/** the chrome gradient + bevel defs, one set per SVG (ids are unique per instance) */
export function ChromeDefs({ id, w, h, angle = "diag" }: { id: string; w: number; h: number; angle?: "diag" | "down" }) {
  // in the SVG's own space, so the light is one continuous sheet across every piece
  const x2 = angle === "diag" ? w * 0.86 : w * 0.18;
  return (
    <defs>
      <linearGradient id={`${id}-face`} gradientUnits="userSpaceOnUse" x1={w * 0.08} y1="0" x2={x2} y2={h}>
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.2" stopColor="#E6E8EC" />
        <stop offset="0.36" stopColor="#F8F9FA" />
        <stop offset="0.56" stopColor="#B3B6BE" />
        <stop offset="0.72" stopColor="#DCDEE3" />
        <stop offset="0.88" stopColor="#9C9FA8" />
        <stop offset="1" stopColor="#CFD1D6" />
      </linearGradient>
      <linearGradient id={`${id}-bevel`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w * 0.7} y2={h}>
        <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.25" />
        <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.6" />
      </linearGradient>
    </defs>
  );
}

function a11y(title?: string) {
  return title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const, focusable: "false" as const };
}

/** The A mark: two pieces, the shell and the key, that lock together. */
export function Mark({ tone = "chrome", className, style, title }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const fill = tone === "chrome" ? `url(#${id}-face)` : FLAT[tone];
  const bevel = tone === "chrome" ? { stroke: `url(#${id}-bevel)`, strokeWidth: 3 } : null;
  return (
    <svg viewBox={MARK_VIEW} className={className} style={style} {...a11y(title)}>
      {tone === "chrome" ? <ChromeDefs id={id} w={MARK_W} h={MARK_H} /> : null}
      <path d={MARK_SHELL} fill={fill} {...bevel} />
      <path d={MARK_KEY} fill={fill} {...bevel} />
    </svg>
  );
}

/** The Awekn wordmark: the mark as the A, then "wekn". */
export function Wordmark({ tone = "chrome", className, style, title }: Props) {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const fill = tone === "chrome" ? `url(#${id}-face)` : FLAT[tone];
  const bevel = tone === "chrome" ? { stroke: `url(#${id}-bevel)`, strokeWidth: 2 } : null;
  return (
    <svg viewBox={WORD_VIEW} className={className} style={style} {...a11y(title)}>
      {tone === "chrome" ? <ChromeDefs id={id} w={WORD_W} h={WORD_H} angle="down" /> : null}
      <path d={WORD_A} fill={fill} {...bevel} />
      <path d={WORD_REST} fill={fill} fillRule="evenodd" {...bevel} />
    </svg>
  );
}
