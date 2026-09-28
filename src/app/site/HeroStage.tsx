"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/**
 * The hero's lean: on a fine pointer the wall tilts a few degrees toward the pointer (writes --rx and
 * --ry on this element; the CSS applies them). One passive listener, one requestAnimationFrame that
 * stops when it settles, transform only. Phones and reduced motion: still.
 */
export function HeroTilt({ children, className }: { children: ReactNode; className?: string }) {
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
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
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
    <div className={className} ref={ref} aria-hidden="true">
      {children}
    </div>
  );
}
