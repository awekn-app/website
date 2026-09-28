"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import s from "./Hero.module.css";

/**
 * The hero's stage: the forged A behind, the phone rising in front of it, the live chips floating
 * nearest. On a fine pointer the whole stage tilts toward the pointer and the layers part a little
 * (they sit at different depths), like objects on a plinth. One passive pointer listener, one
 * requestAnimationFrame that stops when it settles, transform only. Phones and reduced motion: still.
 */
export function HeroStage({ children }: { children: ReactNode }) {
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
      x += (tx - x) * 0.07;
      y += (ty - y) * 0.07;
      el.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
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
    <div className={s.stage} ref={ref}>
      <div className={s.tilt}>{children}</div>
    </div>
  );
}

/** A live number floating by the phone, read from the same screen the phone shows. */
export function Chip({ label, value, unit, sub, heat, className }: { label: string; value: string; unit?: string; sub?: string; heat?: boolean; className?: string }) {
  return (
    <div className={`${s.chip} ${heat ? s.chipHeat : ""} ${className ?? ""}`} aria-hidden="true">
      <span className={s.chipLabel}>
        {heat ? <span className={s.chipDot} /> : null}
        {label}
      </span>
      <span className={s.chipValue}>
        {value}
        {unit ? <span className={s.chipUnit}> {unit}</span> : null}
      </span>
      {sub ? <span className={s.chipSub}>{sub}</span> : null}
    </div>
  );
}
