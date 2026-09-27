"use client";

import { useEffect, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Room, roomStyles as r, useReducedMotion, useRoomLive } from "./Room";
import s from "./RoomSteps.module.css";

/**
 * Room 05, steps. Hold the round button and the day walks: steps accrue on a requestAnimationFrame
 * loop that speeds up gently while held, and the ring closes on the goal. The maths mirror the app:
 * a 10,000 default goal and the progress rules of lib/cardio/stepsGoal.ts (floored percent while
 * short, "over" once past it), distance at a 0.76 m stride, and the Tracker's week of columns.
 * The loop only runs while the room is on screen; with reduced motion each press adds 500 steps.
 */

const GOAL = 10000;
const SEED = 6420;
const MAX = 30000;
const STRIDE_M = 0.76;
/** Mon to Sat, seeded; Sunday is today. */
const WEEK = [8240, 11306, 5980, 9712, 12480, 7355];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Locale-free thousands (toLocaleString can differ between server and browser). */
const fmt = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const km = (steps: number) => ((steps * STRIDE_M) / 1000).toFixed(2);

// the ring geometry (viewBox units)
const R = 88;

export function RoomSteps() {
  const live = useRoomLive("steps");
  const reduced = useReducedMotion();
  const [steps, setSteps] = useState(SEED);
  const [holding, setHolding] = useState(false);

  // the walk: accrue while held, accelerating from about 300 to 1,600 steps a second
  useEffect(() => {
    if (!holding || !live || reduced) return;
    let raf = 0;
    const t0 = performance.now();
    let last = t0;
    let carry = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const held = (now - t0) / 1000;
      carry += Math.min(1600, 300 + 500 * held) * dt;
      const whole = Math.floor(carry);
      if (whole > 0) {
        carry -= whole;
        setSteps((v) => Math.min(MAX, v + whole));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [holding, live, reduced]);

  const start = () => {
    if (reduced) {
      setSteps((v) => Math.min(MAX, v + 500));
      return;
    }
    setHolding(true);
  };
  const stop = () => setHolding(false);

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (e.repeat) return;
    start();
  };
  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    stop();
  };

  const reset = () => {
    setHolding(false);
    setSteps(SEED);
  };

  // lib/cardio/stepsGoal.ts: floor while short so 99.9% never reads 100% beside "1 to go"
  const hit = steps >= GOAL;
  const fraction = Math.min(steps / GOAL, 1);
  const pct = hit ? Math.round((steps / GOAL) * 100) : Math.floor((steps / GOAL) * 100);
  const toGo = Math.max(0, GOAL - steps);
  const over = Math.max(0, steps - GOAL);

  // the week: bars from zero, the goal as a hairline, the scale grows if today outwalks it
  const week = [...WEEK, steps];
  const top = Math.max(13000, ...week) * 1.04;
  const weekSaid =
    WEEK.map((v, i) => `${DAY_NAMES[i]} ${fmt(v)}`).join(", ") + `, today ${fmt(steps)}. Goal ${fmt(GOAL)}.`;

  return (
    <Room
      id="steps"
      index="07"
      name="Steps"
      title="Every step counts toward the day."
      sub="Hold to walk. The ring closes on your goal."
      note="Steps from Apple Health, counted once."
      onReset={reset}
    >
      <div className={r.card}>
        <div className={s.top}>
          <span className={s.label}>Today</span>
          <span className={`${s.dim} ${r.num}`}>Goal {fmt(GOAL)}</span>
        </div>

        <div className={`${s.ringWrap} ${hit ? s.closed : ""} ${reduced ? s.still : ""}`}>
          <svg className={s.ring} viewBox="0 0 200 200" aria-hidden="true">
            <circle className={s.track} cx="100" cy="100" r={R} />
            <circle
              className={`${s.arc} ${holding ? "" : s.ease}`}
              cx="100"
              cy="100"
              r={R}
              pathLength={100}
              strokeDasharray={`${(fraction * 100).toFixed(2)} 100`}
            />
          </svg>
          <div className={s.readout}>
            <span className={`${s.count} ${r.num}`}>{fmt(steps)}</span>
            <span className={`${s.dim} ${r.num}`}>steps, {pct}%</span>
          </div>
        </div>

        <div className={s.controls}>
          <div className={`${r.well} ${s.stat}`}>
            <span className={s.statLabel}>Distance</span>
            <span className={`${s.statValue} ${r.num}`}>
              {km(steps)}
              <span className={s.unit}> km</span>
            </span>
          </div>

          <button
            type="button"
            className={`${s.hold} ${holding ? s.held : ""} ${r.press}`}
            aria-label="Hold to walk"
            aria-describedby="steps-hint"
            onPointerDown={onPointerDown}
            onPointerUp={stop}
            onPointerCancel={stop}
            onPointerLeave={stop}
            onLostPointerCapture={stop}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onBlur={stop}
            onContextMenu={(e) => e.preventDefault()}
          >
            <span aria-hidden="true">{holding ? "Walking" : "Hold to walk"}</span>
          </button>

          <div className={`${r.well} ${s.stat}`}>
            <span className={s.statLabel}>{hit ? "Over" : "To go"}</span>
            <span className={`${s.statValue} ${r.num}`}>{fmt(hit ? over : toGo)}</span>
          </div>
        </div>

        <p id="steps-hint" className={s.hidden}>
          Press and hold, or hold Space. {reduced ? "Each press adds 500 steps." : ""}
        </p>

        <div className={`${r.well} ${s.weekWell}`}>
          <div className={s.weekHead}>
            <span className={s.statLabel}>This week</span>
            <span className={s.dim}>The line is your goal</span>
          </div>
          <div className={s.cols} role="img" aria-label={`Steps this week: ${weekSaid}`}>
            <span className={s.goalLayer} aria-hidden="true">
              <span className={s.goalLine} style={{ bottom: `${((GOAL / top) * 100).toFixed(2)}%` }} />
            </span>
            {week.map((v, i) => {
              const today = i === week.length - 1;
              return (
                <div key={i} className={s.col} aria-hidden="true">
                  <div className={s.barBox}>
                    <span
                      className={`${s.bar} ${today ? s.today : ""}`}
                      style={{ transform: `scaleY(${(v / top).toFixed(4)})` }}
                    />
                  </div>
                  <span className={`${s.day} ${today ? s.dayToday : ""}`}>{DAYS[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className={`${s.status} ${hit ? s.statusHit : ""}`} role="status" aria-live="polite">
          {hit ? (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <circle cx="9" cy="9" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.5 9.3 L7.9 11.6 L12.6 6.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Goal reached. The ring is closed.</span>
            </>
          ) : (
            <span>Hold the button to close the ring.</span>
          )}
        </p>
      </div>
    </Room>
  );
}
