"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Room, roomStyles as r, useReducedMotion, useRoomLive } from "./Room";
import s from "./RoomSet.module.css";

/* ── the app's record engine, mirrored (awekn lib/pr/e1rm.ts + lib/pr/records.ts) ── */

/** Estimated 1RM: the actual weight for a single, Brzycki to 5 reps, Epley 6 and up. */
function e1rm(kg: number, reps: number): number {
  if (!(kg > 0) || !(reps >= 1)) return 0;
  if (reps <= 1) return kg;
  if (reps <= 5) return (kg * 36) / (37 - reps);
  return kg * (1 + reps / 30);
}
/** Past 10 reps the estimate is a soft extrapolation, and a soft estimate never claims a record. */
const confident = (reps: number) => reps <= 10;
/** A record must beat the old best by a real margin: 0.5% of it, and at least 0.25 kg. */
const beats = (v: number, prev: number) => v > prev + Math.max(0.25, prev * 0.005);
/** An estimate reads to the plate (2.5 kg), everywhere. */
const toPlate = (v: number) => Math.round(v / 2.5) * 2.5;

const fmt = (v: number) => String(Math.round(v * 100) / 100);

const SEED = { kg: 100, reps: 5, best: { kg: 97.5, reps: 5 } };
const MIN_KG = 20;
const MAX_KG = 300;
const MAX_REPS = 15;

type Logged = { id: number; n: number; kg: number; reps: number; e: number; pr: boolean };
type Payoff =
  | { kind: "pr"; key: number; kg: number; reps: number; e: number; up: number }
  | { kind: "solid"; key: number; text: string }
  | null;

/** The smallest next set that would be a record: one more rep first, then a heavier bar. */
function nextRecord(kg: number, reps: number, best: number): string | null {
  for (let n = reps + 1; n <= 10; n++) if (beats(e1rm(kg, n), best)) return `${fmt(kg)} kg × ${n}`;
  if (!confident(reps)) return null;
  for (let w = kg + 2.5; w <= MAX_KG; w += 2.5) if (beats(e1rm(w, reps), best)) return `${fmt(w)} kg × ${reps}`;
  return null;
}

/** Counts a number up to its target on requestAnimationFrame; snaps when `run` is false. */
function useCountUp(target: number, run: boolean) {
  const [shown, setShown] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (!run) return;
    const start = from.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 360);
      const v = start + (target - start) * (1 - Math.pow(1 - p, 3));
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);
  return run ? shown : target;
}

/* the burst, seeded (never Math.random in render) */
const SPARKS = Array.from({ length: 16 }, (_, i) => ({
  a: i * 22.5 + [4, -6, 9, -3, 7, -8, 2, -5][i % 8],
  d: [58, 44, 66, 50, 38, 62, 47, 55][i % 8],
  t: (i % 4) * 22,
  long: i % 3 === 0,
}));

/**
 * Room 01, the set. Load the bar, add a rep, log it: the app's record engine decides, and a new
 * best fires the medal and the ember burst (the one place the accent flares). Every logged set
 * floods completion green like the app's set row.
 */
export function RoomSet() {
  const live = useRoomLive("set");
  const reduced = useReducedMotion();

  const [kg, setKg] = useState(SEED.kg);
  const [reps, setReps] = useState(SEED.reps);
  const [best, setBest] = useState(SEED.best);
  const [sets, setSets] = useState<Logged[]>([]);
  const [count, setCount] = useState(0);
  const [payoff, setPayoff] = useState<Payoff>(null);

  const bestE = e1rm(best.kg, best.reps);
  const shownE = useCountUp(toPlate(e1rm(kg, reps)), live && !reduced);

  const nudgeKg = (d: number) => {
    setKg((k) => Math.min(MAX_KG, Math.max(MIN_KG, k + d)));
    setPayoff(null);
  };
  const nudgeReps = (d: number) => {
    setReps((n) => Math.min(MAX_REPS, Math.max(1, n + d)));
    setPayoff(null);
  };

  const log = () => {
    const e = e1rm(kg, reps);
    const pr = confident(reps) && beats(e, bestE);
    const n = count + 1;
    setCount(n);
    setSets((prev) => [...prev, { id: n, n, kg, reps, e, pr }].slice(-3));
    if (pr) {
      setBest({ kg, reps });
      setPayoff({ kind: "pr", key: n, kg, reps, e: toPlate(e), up: Math.round((e - bestE) * 10) / 10 });
      return;
    }
    let text: string;
    if (!confident(reps)) {
      text = `Logged ${fmt(kg)} kg × ${reps}. Past 10 reps the estimate is too soft to count as a record.`;
    } else {
      const toGo = Math.max(0.5, Math.ceil((bestE + Math.max(0.25, bestE * 0.005) - e) * 2) / 2);
      const next = nextRecord(kg, reps, bestE);
      text = `Logged ${fmt(kg)} kg × ${reps}. Not a record yet: ${fmt(toGo)} kg of estimated 1RM to go.${next ? ` ${next} would do it.` : ""}`;
    }
    setPayoff({ kind: "solid", key: n, text });
  };

  const reset = () => {
    setKg(SEED.kg);
    setReps(SEED.reps);
    setBest(SEED.best);
    setSets([]);
    setCount(0);
    setPayoff(null);
  };

  return (
    <Room
      id="set"
      index="01"
      name="The set"
      title="One more rep is a record."
      sub="Your best bench is 97.5 kg for 5. Load the bar, add a rep, log it."
      note="This is the real app's record engine."
      onReset={reset}
    >
      <div className={`${s.stack} ${live ? "" : s.paused}`}>
        <div className={r.card}>
          <div className={s.head}>
            <span className={s.lift}>Bench press</span>
            <span className={`${s.best} ${r.num}`}>
              Best {fmt(best.kg)} kg × {best.reps}
            </span>
          </div>

          {sets.length > 0 && (
            <ol className={s.rows} aria-label="Logged sets">
              {sets.map((row, i) => {
                const newest = i === sets.length - 1 && row.n === count;
                return (
                  <li
                    key={row.id}
                    className={`${s.row} ${newest && !reduced ? s.fresh : ""} ${newest && count <= 3 && !reduced ? s.grow : ""}`}
                  >
                    <span className={s.flood} aria-hidden="true" />
                    <span className={`${s.badge} ${r.num}`} aria-hidden="true">
                      {row.n}
                    </span>
                    <span className={`${s.rowSet} ${r.num}`}>
                      <span className="sr-only">Set {row.n}, </span>
                      {fmt(row.kg)} kg × {row.reps}
                      {row.pr && <span className={s.prTag}>PR</span>}
                    </span>
                    <span className={`${s.rowE} ${r.num}`}>
                      <span className={s.eWord}>e1RM </span>
                      {fmt(toPlate(row.e))}
                    </span>
                    <svg className={s.tick} width="26" height="26" viewBox="0 0 26 26" role="img" aria-label="Completed">
                      <circle cx="13" cy="13" r="12" fill="var(--done)" />
                      <path d="M7.8 13.6 L11.3 17 L18.4 9.6" fill="none" stroke="#0B0B0D" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </li>
                );
              })}
            </ol>
          )}

          <div className={s.steppers}>
            <div className={`${r.well} ${s.field}`}>
              <span className={s.label}>Weight (kg)</span>
              <span className={`${s.value} ${r.num}`}>{fmt(kg)}</span>
              <div className={s.pair}>
                <button type="button" className={`${r.disc} ${r.press}`} aria-label="2.5 kg lighter" disabled={kg <= MIN_KG} onClick={() => nudgeKg(-2.5)}>
                  <Minus />
                </button>
                <button type="button" className={`${r.disc} ${r.press}`} aria-label="2.5 kg heavier" disabled={kg >= MAX_KG} onClick={() => nudgeKg(2.5)}>
                  <Plus />
                </button>
              </div>
            </div>
            <div className={`${r.well} ${s.field}`}>
              <span className={s.label}>Reps</span>
              <span className={`${s.value} ${r.num}`}>{reps}</span>
              <div className={s.pair}>
                <button type="button" className={`${r.disc} ${r.press}`} aria-label="One rep fewer" disabled={reps <= 1} onClick={() => nudgeReps(-1)}>
                  <Minus />
                </button>
                <button type="button" className={`${r.disc} ${r.press}`} aria-label="One rep more" disabled={reps >= MAX_REPS} onClick={() => nudgeReps(1)}>
                  <Plus />
                </button>
              </div>
            </div>
          </div>

          <div className={s.eRow}>
            <span className={s.eLabel}>Estimated 1RM</span>
            <span className={`${s.eValue} ${r.num}`}>
              {fmt(Math.round(shownE * 2) / 2)} kg
            </span>
          </div>

          <button type="button" className={`${r.primary} ${r.press}`} onClick={log}>
            Log set
          </button>
        </div>

        <div className={s.slot} role="status" aria-live="polite" aria-atomic="true">
          {payoff?.kind === "pr" ? (
            <div key={payoff.key} className={`${s.pr} ${reduced ? "" : s.flare}`}>
              <div className={s.medalWrap}>
                {!reduced && (
                  <span className={s.burst} aria-hidden="true">
                    <span className={s.ring} />
                    {SPARKS.map((p, i) => (
                      <span
                        key={i}
                        className={`${s.spark} ${p.long ? s.streak : ""}`}
                        style={{ "--a": `${p.a}deg`, "--d": `${p.d}px`, "--t": `${p.t}ms` } as CSSProperties}
                      />
                    ))}
                  </span>
                )}
                <svg className={s.medal} width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
                  <circle cx="24" cy="30" r="13" fill="none" stroke="var(--ember)" strokeWidth="2.5" />
                  <path d="M17 4 L24 17 L31 4" fill="none" stroke="var(--ember)" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M24 24 L26 28.5 L31 29 L27.2 32.2 L28.4 37 L24 34.4 L19.6 37 L20.8 32.2 L17 29 L22 28.5 Z" fill="var(--ember)" />
                </svg>
              </div>
              <div className={s.words}>
                <span className={s.prTitle}>New record</span>
                <span className={`${s.prLine} ${r.num}`}>
                  {fmt(payoff.kg)} kg × {payoff.reps} · est. 1RM {fmt(payoff.e)} kg, up {fmt(payoff.up)} kg
                </span>
              </div>
            </div>
          ) : payoff?.kind === "solid" ? (
            <div key={payoff.key} className={`${s.solid} ${reduced ? "" : s.rise}`}>
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className={s.solidTick}>
                <circle cx="11" cy="11" r="10" fill="var(--done)" />
                <path d="M6.5 11.5 L9.5 14.5 L15.5 8" fill="none" stroke="#0B0B0D" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={`${s.solidText} ${r.num}`}>{payoff.text}</span>
            </div>
          ) : (
            <p className={s.idle} aria-hidden="true">Log it, and the record engine decides.</p>
          )}
        </div>
      </div>
    </Room>
  );
}

function Minus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8 H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function Plus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8 H13 M8 3 V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
