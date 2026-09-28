"use client";

import { useEffect, useId, useRef } from "react";
import { ChromeDefs } from "./brand/Brand";
import { MARK_VIEW, MARK_W, MARK_H, MARK_SHELL, MARK_KEY } from "./brand/paths";
import s from "./Forge.module.css";

/**
 * THE FORGE (docs/BRAND_REVAMP_PLAN_2026-09-28.md): the A mark, huge, in chrome. The shell rises out
 * of the dark, the key slides up its diagonal and seats into the crossbar notch with a small settle,
 * it flashes as it seats, and one bright light sweeps across the metal; after that a slower light passes
 * now and then, and on a fine pointer the mark tilts toward it like a real object on a plinth.
 *
 * The choreography is CSS on server-rendered SVG, so the assembled mark is the no-JS and reduced-motion
 * state. JS only adds the tilt (one passive pointer listener, one requestAnimationFrame, transform only).
 */
export function Forge() {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--rx", `${(-y * 7).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 10).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(50 + x * 30).toFixed(1)}%`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      tx = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth) * 2 - 1));
      ty = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight) * 2 - 1));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={s.forge} ref={ref} aria-hidden="true">
      <div className={s.beam} />
      <div className={s.plinth}>
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
          </defs>
          <g className={s.shell}>
            <path d={MARK_SHELL} fill={`url(#${id}-face)`} stroke={`url(#${id}-bevel)`} strokeWidth="3" />
          </g>
          <g className={s.key}>
            <path d={MARK_KEY} fill={`url(#${id}-face)`} stroke={`url(#${id}-bevel)`} strokeWidth="3" />
            {/* the instant it seats, the key flashes white */}
            <path className={s.flash} d={MARK_KEY} fill="#FFFFFF" />
          </g>
          {/* the light that crosses the metal: clipped to the mark, moved by transform only */}
          <g clipPath={`url(#${id}-clip)`}>
            <g transform="skewX(-24)">
              <rect className={s.sweep} x="-420" y="-200" width="420" height="1200" fill={`url(#${id}-sheen)`} />
            </g>
          </g>
        </svg>
        {/* the polished floor gives it back, faint */}
        <svg viewBox={MARK_VIEW} className={s.reflection}>
          <path d={MARK_SHELL} fill={`url(#${id}-face)`} />
          <path d={MARK_KEY} fill={`url(#${id}-face)`} />
        </svg>
        <div className={s.floor} />
      </div>
    </div>
  );
}
