"use client";

import { useEffect, useRef } from "react";
import s from "./Progress.module.css";

/**
 * The reading hairline: 2 px at the very top, silver, with an ember tip at its head. It appears once
 * the hero has scrolled away and fills from there to the end of the page. One passive scroll
 * listener and one requestAnimationFrame write a single custom property; no React state per frame,
 * and the bar and its tip move by transform only (scaleX for the fill, translateX for the tip, so
 * the tip is never stretched).
 */
export function Progress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let start = 0;
    let span = 1;
    let on = false;

    const measure = () => {
      const hero = document.getElementById("top");
      start = hero ? hero.getBoundingClientRect().bottom + window.scrollY : window.innerHeight;
      span = Math.max(1, document.documentElement.scrollHeight - window.innerHeight - start);
    };
    const paint = () => {
      raf = 0;
      const y = window.scrollY;
      const p = Math.min(1, Math.max(0, (y - start) / span));
      el.style.setProperty("--p", p.toFixed(4));
      const show = y >= start - 1;
      if (show !== on) {
        on = show;
        el.classList.toggle(s.on, show);
      }
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
    // The page grows as rooms and fonts settle; keep the span honest.
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", remeasure);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={s.progress} aria-hidden="true">
      <span className={s.fill} />
      <span className={s.head}>
        <span className={s.tip} />
      </span>
    </div>
  );
}
