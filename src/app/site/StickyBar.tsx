"use client";

import { useEffect, useState } from "react";
import { APP_STORE } from "../lib/links";
import { Mark } from "./brand/Brand";
import s from "./StickyBar.module.css";

/**
 * The download bar that rises from the bottom once the hero has scrolled away, and steps aside at
 * the closing download section (never two download keys on one screen). A thumb's reach on a phone.
 */
export function StickyBar() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("top");
    const end = document.getElementById("download");
    if (!hero || !end) return;
    let heroGone = false;
    let atEnd = false;
    const update = () => setShow(heroGone && !atEnd);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) heroGone = !e.isIntersecting;
        if (e.target === end) atEnd = e.isIntersecting;
      }
      update();
    }, { threshold: 0 });
    io.observe(hero);
    io.observe(end);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`${s.bar} ${show ? s.on : ""}`} aria-hidden={!show}>
      <Mark className={s.mark} />
      <span className={s.line}>Free to start</span>
      <a className={s.cta} href={APP_STORE} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1}>
        Get the app
      </a>
    </div>
  );
}
