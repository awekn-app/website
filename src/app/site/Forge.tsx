import { useId } from "react";
import { ChromeDefs } from "./brand/Brand";
import { MARK_VIEW, MARK_W, MARK_H, MARK_SHELL, MARK_KEY } from "./brand/paths";
import s from "./Forge.module.css";

/**
 * THE FORGE (docs/BRAND_REVAMP_PLAN_2026-09-28.md, heat added in SHOWCASE_POLISH_PLAN_2026-09-28.md):
 * the A mark in chrome. The shell rises out of the dark, the key slides up its diagonal and seats into
 * the crossbar notch WHITE-HOT (the app's orange heat), then cools to chrome while a molten glow
 * settles under the metal; a light crosses it now and then.
 *
 * Server-rendered SVG + CSS: the assembled, cooled mark is the no-JS and reduced-motion state. No CSS
 * filter sits on the animating SVG (the shadow is its own static layer), so a phone never re-rasterises
 * a blur while the light moves.
 */
export function Forge() {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");

  return (
    <div className={s.forge} aria-hidden="true">
      <div className={s.heat} />
      <div className={s.shadow} />
      <svg viewBox={MARK_VIEW} className={s.mark}>
        <ChromeDefs id={id} w={MARK_W} h={MARK_H} />
        <defs>
          <clipPath id={`${id}-clip`}>
            <path d={MARK_SHELL} />
            <path d={MARK_KEY} />
          </clipPath>
          <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
            {/* a real reflection: a dark band runs ahead of the bright line and trails behind it */}
            <stop offset="0.2" stopColor="#000000" stopOpacity="0" />
            <stop offset="0.36" stopColor="#000000" stopOpacity="0.26" />
            <stop offset="0.46" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="0.5" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="0.54" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="0.64" stopColor="#000000" stopOpacity="0.14" />
            <stop offset="0.8" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={`${id}-hot`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFD2B8" />
            <stop offset="0.45" stopColor="#FF7A3D" />
            <stop offset="1" stopColor="#FF5712" />
          </linearGradient>
        </defs>
        <g className={s.shell}>
          <path d={MARK_SHELL} fill={`url(#${id}-face)`} stroke={`url(#${id}-bevel)`} strokeWidth="3" />
        </g>
        <g className={s.key}>
          <path d={MARK_KEY} fill={`url(#${id}-face)`} stroke={`url(#${id}-bevel)`} strokeWidth="3" />
          {/* the key seats white-hot, then cools to chrome */}
          <path className={s.hot} d={MARK_KEY} fill={`url(#${id}-hot)`} />
        </g>
        {/* the light that crosses the metal: clipped to the mark, moved by transform only */}
        <g clipPath={`url(#${id}-clip)`}>
          <g transform="skewX(-24)">
            <rect className={s.sweep} x="-420" y="-200" width="420" height="1200" fill={`url(#${id}-sheen)`} />
          </g>
        </g>
      </svg>
    </div>
  );
}
