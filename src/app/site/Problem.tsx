"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./Problem.module.css";

/** The scraps of a lifter's week, as they really get written down. Deterministic tilt and offset. */
const SCRAPS = [
  { text: "bench 95 x 5 x 3?? or was it 97.5", tilt: -2.2, shift: 0 },
  { text: "protein: probably enough", tilt: 1.6, shift: 22 },
  { text: "weight 82.4 (after lunch, doesn't count)", tilt: -0.8, shift: 4 },
  { text: "wk 3   82.9   ??   81.7   #REF!", tilt: 1.2, shift: 30 },
  { text: "leg day... skipped? moved to thu", tilt: -1.7, shift: 12 },
  { text: "creatine 5g (did i take it)", tilt: 2.3, shift: 36 },
] as const;

/** The scrub only runs where it can breathe; this exact query also gates the tall track in the CSS. */
const MOTION = "(prefers-reduced-motion: no-preference) and (min-height: 521px)";

/**
 * THE PROBLEM (story beat 1). A lifter's week lives in scraps: a notes app, a spreadsheet row, a
 * guess. The section holds on screen in a sticky stage while the scroll crosses each scrap out and
 * lets it fall away (transform and opacity only: no per-frame blur, which phones re-rasterise), until one clean line is left. The server render is the finished
 * state (scraps struck through, the clean line showing), which is also what reduced motion and
 * no-JS see; GSAP only takes over inside the motion query and reverts to that state on cleanup.
 */
export function Problem() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(root);

    mm.add(MOTION, () => {
      root.classList.add(s.live);

      const papers = Array.from(root.querySelectorAll<HTMLElement>("[data-paper]"));
      const phrases = Array.from(root.querySelectorAll<HTMLElement>("[data-phrase]"));
      const after = Array.from(root.querySelectorAll<HTMLElement>("[data-after]"));

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });

      papers.forEach((paper, i) => {
        const strike = paper.querySelector<HTMLElement>("[data-strike]");
        const text = paper.querySelector<HTMLElement>("[data-text]");
        const at = 0.04 + i * 0.085;
        const side = i % 2 === 0 ? -1 : 1;
        if (strike) tl.fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: 0.06, ease: "power1.inOut" }, at);
        if (text) tl.fromTo(text, { opacity: 1 }, { opacity: 0.5, duration: 0.06 }, at);
        tl.fromTo(
          paper,
          { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 },
          {
            x: side * (10 + i * 2),
            y: 72 + i * 6,
            rotation: side * (6 + (i % 3) * 3),
            scale: 0.94,
            opacity: 0,
            duration: 0.13,
            ease: "power2.in",
          },
          at + 0.07,
        );
      });

      phrases.forEach((phrase, i) => {
        tl.fromTo(
          phrase,
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" },
          0.62 + i * 0.06,
        );
      });
      tl.fromTo(after, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" }, 0.82);
      // a short hold on the clean line before the stage lets go
      tl.to({}, { duration: 0.08 }, 0.92);

      return () => root.classList.remove(s.live);
    });

    // the track's start moves if the hero's type reflows once the font lands
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });

    return () => {
      alive = false;
      mm.revert();
    };
  }, []);

  return (
    <section className={s.problem} id="problem" ref={rootRef} aria-labelledby="problem-title">
      <div className={s.track} ref={trackRef}>
        <div className={s.stage}>
          <header className={s.head}>
            <p className={s.eyebrow}>The problem</p>
            <h2 className={`${s.title} chrome-type`} id="problem-title">A notes app, a spreadsheet and a guess.</h2>
          </header>

          <div className={s.board}>
            <ul className={s.scraps} aria-hidden="true">
              {SCRAPS.map((scrap) => (
                <li
                  key={scrap.text}
                  className={s.scrap}
                  style={{ "--tilt": `${scrap.tilt}deg`, "--shift": `${scrap.shift}px` } as CSSProperties}
                >
                  <span className={s.paper} data-paper="">
                    <span className={s.text} data-text="">{scrap.text}</span>
                    <span className={s.strike} data-strike="" />
                  </span>
                </li>
              ))}
            </ul>
            <p className="sr-only">
              Training kept in scattered notes, a spreadsheet and half-remembered numbers, all of it crossed out.
            </p>

            <div className={s.clean}>
              <p className={s.line}>
                <span className={s.phrase} data-phrase="">One place.</span>{" "}
                <span className={s.phrase} data-phrase="">One line.</span>{" "}
                <span className={s.phrase} data-phrase="">Yours.</span>
              </p>
              <p className={s.after} data-after="">
                Every set, meal and weigh-in, written once and read back as a trend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
