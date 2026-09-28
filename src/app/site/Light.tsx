"use client";

import { useEffect, useRef } from "react";
import s from "./Light.module.css";

/**
 * One travelling source. A very soft white glow (the light that falls on the chrome), fixed behind the content, that drifts down the
 * viewport (and sways a little) as the story is read, so each section feels lit by the same light
 * passing through. It stays dark over the hero (the hero has its own carve light) and fades in
 * after it. Transform and opacity only, one passive scroll listener, one requestAnimationFrame.
 * Off under reduced motion (the CSS hides it and no listener is added).
 *
 * The layer sits at z-index -1, under every section. A negative layer paints under in-flow block
 * backgrounds, so an opaque body background would hide it: while mounted, and only if the root
 * element already paints the same ground, the body's own background is cleared (and restored on
 * unmount). Nothing changes on screen but the light.
 */
export function Light() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // off on touch screens: a viewport-sized fixed layer under a transparent body costs a phone memory
    // and jumps with the address bar; the CSS hides the frame there too
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;

    const body = document.body;
    const prevBg = body.style.background;
    const rootBg = getComputedStyle(document.documentElement).backgroundColor;
    const bodyBg = getComputedStyle(body).backgroundColor;
    if (rootBg === bodyBg && !/rgba\(.*,\s*0\)$/.test(rootBg)) body.style.background = "transparent";

    let raf = 0;
    let heroEnd = 0;
    let span = 1;
    let vh = window.innerHeight;
    let vw = window.innerWidth;

    const measure = () => {
      vh = window.innerHeight;
      vw = window.innerWidth;
      const hero = document.getElementById("top");
      heroEnd = hero ? hero.getBoundingClientRect().bottom + window.scrollY : vh;
      span = Math.max(1, document.documentElement.scrollHeight - vh);
    };
    const paint = () => {
      raf = 0;
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, y / span));
      // From just under the fold of the hero to near the foot of the viewport, with a slow sway.
      const ty = vh * (0.15 + 0.7 * p);
      const tx = vw * (0.5 + 0.22 * Math.sin(p * Math.PI * 3.2));
      // Dark over the hero, full once it is gone, a little quieter at the very end.
      const into = Math.min(1, Math.max(0, (y - heroEnd * 0.55) / (heroEnd * 0.45 || 1)));
      const o = into * (1 - 0.35 * Math.max(0, (p - 0.9) / 0.1));
      el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
      el.style.opacity = o.toFixed(3);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const remeasure = () => {
      measure();
      schedule();
    };

    measure();
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", remeasure, { passive: true });
    const ro = new ResizeObserver(remeasure);
    ro.observe(body);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
      body.style.background = prevBg;
    };
  }, []);

  return (
    <div className={s.frame} aria-hidden="true">
      <div ref={ref} className={s.light} />
    </div>
  );
}
