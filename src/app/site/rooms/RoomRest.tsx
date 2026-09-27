"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Room, roomStyles as r, useReducedMotion, useRoomLive } from "./Room";
import s from "./RoomRest.module.css";

/**
 * The rest room. A ring that empties as the rest burns down, like the app's rest timer
 * (awekn components/workout/RestTimer.tsx: remaining over total, digits as m:ss, a skip), with
 * fifteen-second nudges either way. The countdown runs on requestAnimationFrame only while the
 * room is on screen; the last three seconds pulse the ring (not with reduced motion); at zero the
 * next set slides in with the completion tick. Space starts or pauses, the arrow keys nudge.
 */

const PLANNED = 120;
const STEP = 15;
const MIN_S = 15;
const MAX_S = 600;
const NEXT = { lift: "Bench press", kg: 100, reps: 5, set: 3, of: 4 };

type Phase = "idle" | "running" | "paused" | "done";

/** m:ss, the app's formatDuration for anything under an hour. */
const mmss = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;

export function RoomRest({ index = "", flip }: { index?: string; flip?: boolean } = {}) {
  const live = useRoomLive("rest");
  const reduced = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [planned, setPlanned] = useState(PLANNED);
  const [total, setTotal] = useState(PLANNED * 1000);
  const [rem, setRemState] = useState(PLANNED * 1000);
  // the loop's source of truth; state mirrors it for the render
  const remRef = useRef(PLANNED * 1000);
  const setRem = (ms: number) => {
    remRef.current = ms;
    setRemState(ms);
  };

  useEffect(() => {
    if (phase !== "running" || !live) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // a long gap (a hidden tab) never eats the rest in one frame
      const dt = Math.min(100, now - last);
      last = now;
      const next = Math.max(0, remRef.current - dt);
      remRef.current = next;
      setRemState(next);
      if (next <= 0) {
        setPhase("done");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, live]);

  const toggle = () => {
    if (phase === "running") setPhase("paused");
    else if (phase === "done") {
      setTotal(planned * 1000);
      setRem(planned * 1000);
      setPhase("running");
    } else setPhase("running");
  };

  const nudge = (d: number) => {
    if (phase === "done") return;
    if (phase === "idle") {
      const p = Math.min(MAX_S, Math.max(MIN_S, planned + d));
      setPlanned(p);
      setTotal(p * 1000);
      setRem(p * 1000);
      return;
    }
    const n = Math.min(MAX_S * 1000, Math.max(0, remRef.current + d * 1000));
    setRem(n);
    if (n <= 0) setPhase("done");
    else setTotal((t) => Math.max(t, n));
  };

  const skip = () => {
    setRem(0);
    setPhase("done");
  };

  const reset = () => {
    setPhase("idle");
    setPlanned(PLANNED);
    setTotal(PLANNED * 1000);
    setRem(PLANNED * 1000);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const onButton = (e.target as HTMLElement).tagName === "BUTTON";
    if (e.key === " " && !onButton) {
      e.preventDefault();
      toggle();
    } else if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      nudge(STEP);
    } else if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      nudge(-STEP);
    }
  };

  const secs = Math.ceil(rem / 1000);
  const fraction = total > 0 ? Math.min(1, Math.max(0, rem / total)) : 0;
  const pulsing = phase === "running" && secs <= 3 && secs > 0 && !reduced;
  const primaryLabel = phase === "running" ? "Pause" : phase === "paused" ? "Resume" : phase === "done" ? "Rest again" : "Start";
  const state = phase === "running" ? "Resting" : phase === "paused" ? "Paused" : phase === "done" ? "Rest done" : "Ready";
  const nextLine = `${NEXT.lift}, ${NEXT.kg} kg × ${NEXT.reps}`;

  return (
    <Room
      id="rest"
      index={index}
      flip={flip}
      name="Rest"
      title="Rest like it's part of the set."
      sub="A timer that knows your next set. Tap to add fifteen seconds."
      note="The app's rest timer, one set ahead."
      onReset={reset}
    >
      <div
        className={`${r.card} ${s.group} ${live ? "" : s.paused}`}
        role="group"
        aria-label="Rest timer"
        aria-describedby="rest-keys"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div className={s.head}>
          <div className={s.headWords}>
            <span className={s.lift}>{NEXT.lift}</span>
            <span className={`${s.dim} ${r.num}`}>
              Rest before set {NEXT.set} of {NEXT.of}
            </span>
          </div>
          <button type="button" className={`${r.chip} ${r.press} ${s.skip}`} onClick={skip} disabled={phase === "done"} aria-label="Skip the rest">
            Skip
          </button>
        </div>

        <div className={`${s.ringWrap} ${pulsing ? s.last : ""} ${phase === "running" ? "" : s.ease}`}>
          <svg className={s.ring} viewBox="0 0 200 200" aria-hidden="true">
            <circle className={s.track} cx="100" cy="100" r="88" />
            <circle
              className={s.arc}
              cx="100"
              cy="100"
              r="88"
              pathLength={100}
              strokeDasharray={`${(fraction * 100).toFixed(3)} 100`}
              opacity={fraction > 0.0005 ? 1 : 0}
            />
          </svg>
          {pulsing && <span key={secs} className={s.pulse} aria-hidden="true" />}
          <div className={s.readout}>
            <span className={`${s.time} ${r.num}`} role="timer" aria-label={`${secs} seconds of rest left`}>
              {mmss(secs)}
            </span>
            <span className={`${s.dim} ${r.num}`}>
              {state}, of {mmss(Math.round(total / 1000))}
            </span>
          </div>
        </div>

        <div className={s.controls}>
          <button
            type="button"
            className={`${s.nudge} ${r.press} ${r.num}`}
            aria-label="Take 15 seconds off"
            disabled={phase === "done" || (phase === "idle" && planned <= MIN_S)}
            onClick={() => nudge(-STEP)}
          >
            −15 s
          </button>
          <button type="button" className={`${r.primary} ${r.press} ${s.go}`} onClick={toggle}>
            {primaryLabel}
          </button>
          <button
            type="button"
            className={`${s.nudge} ${r.press} ${r.num}`}
            aria-label="Add 15 seconds"
            disabled={phase === "done" || (phase === "idle" && planned >= MAX_S)}
            onClick={() => nudge(STEP)}
          >
            +15 s
          </button>
        </div>
        <p id="rest-keys" className={s.keys}>
          Space starts or pauses. The arrow keys add or take 15 seconds.
        </p>

        <div className={s.slot} role="status" aria-live="polite" aria-atomic="true">
          {phase === "done" ? (
            <div className={`${s.next} ${reduced ? "" : s.slide}`}>
              <svg className={s.tick} width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                <circle cx="14" cy="14" r="13" fill="var(--done)" />
                <path d="M8.4 14.6 L12.2 18.3 L19.8 10.3" fill="none" stroke="#0B0B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className={s.nextWords}>
                <span className={`${s.nextTitle} ${r.num}`}>Next: {nextLine.charAt(0).toLowerCase() + nextLine.slice(1)}</span>
                <span className={`${s.dim} ${r.num}`}>
                  Set {NEXT.set} of {NEXT.of}. Same weight as last time, go when you are ready.
                </span>
              </div>
            </div>
          ) : (
            <p className={`${s.idle} ${r.num}`}>
              <span className={s.upNext}>Up next</span>
              <span>{nextLine}</span>
            </p>
          )}
        </div>
      </div>
    </Room>
  );
}
