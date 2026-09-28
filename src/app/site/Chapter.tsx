"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { Mark } from "./brand/Brand";
import s from "./Chapter.module.css";

type Props = {
  eyebrow: string;
  /** One string, or the title's lines as they should break (each line rises on its own). */
  title: string | readonly string[];
  sub?: string;
  /** The heading's id, for a section's aria-labelledby. */
  id?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

/**
 * A chapter opener: an eyebrow, a big title that reveals line by line (each line rises out of its
 * own mask as it enters), a thin chrome rule that draws under it (the A's crossbar), the mark stamped before the eyebrow like a
 * hallmark on silver, and an optional line of sub.
 *
 * The server renders plain, readable text, and that is also the finished state. Where the browser
 * has scroll-driven animations (animation-timeline: view()), CSS alone scrubs the reveal to the
 * scroll. Elsewhere the component adds a class that hides the lines only if the opener is still
 * below the fold, and an IntersectionObserver reveals them once. Reduced motion: shown immediately.
 */
export function Chapter({ eyebrow, title, sub, id, as: Tag = "h2", className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const lines = typeof title === "string" ? [title] : title;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()")) return;
    // Never hide what is already on screen (or scrolled past): only an opener still below the fold
    // gets the entrance.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    el.classList.add(s.io);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add(s.in);
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <header ref={ref} className={className ? `${s.chapter} ${className}` : s.chapter}>
      <p className={s.eyebrow}>
        <Mark tone="current" className={s.hallmark} />
        {eyebrow}
      </p>
      <Tag id={id} className={s.title}>
        {lines.map((line, i) => (
          <span key={i} className={s.line} style={{ "--i": i } as CSSProperties}>
            <span className={s.inner}><span className="chrome-type">{line}</span></span>
            {i < lines.length - 1 ? " " : null}
          </span>
        ))}
      </Tag>
      <span className={s.rule} aria-hidden="true" />
      {sub ? <p className={s.sub}>{sub}</p> : null}
    </header>
  );
}
