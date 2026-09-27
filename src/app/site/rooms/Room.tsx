"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import s from "./Room.module.css";

/**
 * The frame every room is built in: the words on one side, the live instrument on the other.
 * `useRoomLive()` is true only while the room is on screen, so a room pauses its loops and
 * springs when it scrolls away (one live at a time, docs/REBUILD_2026_PLAN.md craft laws).
 */
const LiveContext = createContext(false);
export const useRoomLive = () => useContext(LiveContext);

/** True when the viewer asked for less motion; rooms still work, they just skip the flourish. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(q.matches);
    on();
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function Room({
  id,
  index,
  name,
  title,
  sub,
  note,
  onReset,
  flip,
  children,
}: {
  id: string;
  /** "01", "02"... */
  index: string;
  name: string;
  title: string;
  sub: string;
  /** The small line beside Reset: what is real about this demo. */
  note: string;
  onReset: () => void;
  /** Put the words on the right on wide screens (rooms alternate). */
  flip?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: "-10% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} id={id} className={`${s.room} ${flip ? s.flip : ""}`} aria-labelledby={`${id}-title`}>
      <div className={s.head}>
        <p className={s.eyebrow}>
          {index} · {name}
        </p>
        <h2 className={s.title} id={`${id}-title`}>
          {title}
        </h2>
        <p className={s.sub}>{sub}</p>
      </div>
      <div className={s.body}>
        <LiveContext.Provider value={live}>{children}</LiveContext.Provider>
        <div className={s.foot}>
          <span className={s.note}>{note}</span>
          <button type="button" className={`${s.reset} ${s.press}`} onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

export { s as roomStyles };
