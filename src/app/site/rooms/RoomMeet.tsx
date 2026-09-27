"use client";

import { useState } from "react";
import { Room, roomStyles as r, useReducedMotion, useRoomLive } from "./Room";
import s from "./RoomMeet.module.css";

/* ── the app's meet engine, mirrored ──
 * DOTS: awekn utils/pl-scoring.ts calculateDOTS (the coefficients below, copied exactly), which
 *   awekn lib/powerlifting/scoring.ts wraps; the tiers are its dotsClassification, and "total for a
 *   target score" is its totalForTarget (DOTS is linear in total, so the inversion is exact).
 * The plan: awekn lib/powerlifting/attempts.ts planAttempts (opener, second and third as a share of
 *   the reference max, bench on smaller jumps), rounded to a loadable IPF bar like plate.ts
 *   roundToLoadable (20 kg bar, 2.5 kg collars, 1.25 kg smallest plate: every 2.5 kg from 25). */

const DOTS_MALE = { a: -0.000001093, b: 0.0007391293, c: -0.1918759221, d: 24.0900756, e: -307.75076 };

/** The per-kg DOTS coefficient at a bodyweight (male, clamped 40 to 210 kg as the app does). */
function dotsCoeff(bw: number): number {
  const x = Math.max(40, Math.min(210, bw));
  const c = DOTS_MALE;
  const denom = c.a * x ** 4 + c.b * x ** 3 + c.c * x ** 2 + c.d * x + c.e;
  return denom > 0 ? 500 / denom : 0;
}
const calculateDOTS = (bw: number, total: number) => Math.round(total * dotsCoeff(bw) * 100) / 100;

const TIERS: [number, string][] = [
  [200, "novice"],
  [300, "intermediate"],
  [400, "advanced"],
  [500, "elite"],
  [600, "world class"],
];
function dotsClassification(dots: number): string {
  if (dots < 200) return "beginner";
  if (dots < 300) return "novice";
  if (dots < 400) return "intermediate";
  if (dots < 500) return "advanced";
  if (dots < 600) return "elite";
  return "world class";
}

const BAR_MIN = 25;
const STEP = 2.5;
const MAX_KG = 500;
function roundToLoadable(kg: number): number {
  if (kg <= BAR_MIN) return BAR_MIN;
  const under = BAR_MIN + Math.floor((kg - BAR_MIN) / STEP + 1e-9) * STEP;
  const over = under + STEP;
  return Math.abs(under - kg) <= Math.abs(over - kg) ? under : over;
}

type LiftId = "squat" | "bench" | "deadlift";
const LIFTS: { id: LiftId; name: string; ref: number; pct: [number, number, number] }[] = [
  { id: "squat", name: "Squat", ref: 200, pct: [0.9, 0.96, 1.02] },
  { id: "bench", name: "Bench press", ref: 130, pct: [0.91, 0.96, 1.01] },
  { id: "deadlift", name: "Deadlift", ref: 230, pct: [0.9, 0.96, 1.03] },
];
const ATTEMPT = ["Opener", "Second", "Third"];
const BW = 83;

type Attempt = { kg: number; made: boolean };
type Plan = Record<LiftId, Attempt[]>;

const seedPlan = (): Plan =>
  Object.fromEntries(LIFTS.map((l) => [l.id, l.pct.map((p) => ({ kg: roundToLoadable(l.ref * p), made: true }))])) as Plan;

const fmt = (n: number) => String(Math.round(n * 100) / 100);
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
const bestOf = (a: Attempt[]) => a.reduce<number | null>((m, x) => (x.made && (m == null || x.kg > m) ? x.kg : m), null);

/**
 * The meet room, kept quiet. Three attempts a lift on 2.5 kg steppers (a later attempt never
 * drops below an earlier one, as on the platform), tap an attempt for good lift or no lift, and
 * the best made lift, the total and DOTS at 83 kg update at once. A lift with no good attempt
 * means no total, exactly as at a meet.
 */
export function RoomMeet({ index = "", flip }: { index?: string; flip?: boolean } = {}) {
  const live = useRoomLive("meet");
  const reduced = useReducedMotion();
  const [plan, setPlan] = useState<Plan>(seedPlan);

  const nudge = (lift: LiftId, i: number, d: number) => {
    const a = plan[lift].map((x) => ({ ...x }));
    const floor = i === 0 ? BAR_MIN : a[i - 1].kg;
    a[i].kg = Math.min(MAX_KG, Math.max(floor, a[i].kg + d));
    for (let j = i + 1; j < a.length; j++) a[j].kg = Math.max(a[j].kg, a[j - 1].kg);
    setPlan({ ...plan, [lift]: a });
  };
  const flipMade = (lift: LiftId, i: number) => {
    setPlan({ ...plan, [lift]: plan[lift].map((x, j) => (j === i ? { ...x, made: !x.made } : x)) });
  };
  const reset = () => setPlan(seedPlan());

  const bests = LIFTS.map((l) => bestOf(plan[l.id]));
  const bombed = LIFTS.filter((_, i) => bests[i] == null);
  const total = bombed.length ? null : bests.reduce<number>((a, b) => a + (b ?? 0), 0);
  const dots = total == null ? null : calculateDOTS(BW, total);
  const tier = dots == null ? null : dotsClassification(dots);

  let status: string;
  if (total == null || dots == null) {
    const names = bombed.map((l) => l.name.toLowerCase()).join(" and ");
    status = `No good lift on ${names}, so no total. Tap an attempt to make it a good lift.`;
  } else {
    const next = TIERS.find(([t]) => t > dots);
    if (next) {
      // lib/powerlifting/scoring.ts totalForTarget, rounded up to the next loadable 2.5 kg
      const need = Math.ceil(next[0] / dotsCoeff(BW) / STEP) * STEP;
      status = `${fmt(total)} kg total, ${dots.toFixed(2)} DOTS, ${tier}. ${fmt(need - total)} kg more reaches ${next[0]}, ${next[1]}.`;
    } else {
      status = `${fmt(total)} kg total, ${dots.toFixed(2)} DOTS. World class.`;
    }
  }

  return (
    <Room
      id="meet"
      index={index}
      flip={flip}
      name="Meet day"
      title="Meet day, planned."
      sub="Three attempts a lift. The total and your DOTS update as you choose."
      note="DOTS from the app's own formula and coefficients."
      onReset={reset}
    >
      <div className={`${r.card} ${live ? "" : s.paused} ${reduced ? s.still : ""}`}>
        <div className={s.head}>
          <span className={s.title}>Attempts</span>
          <span className={s.dim}>Tap an attempt for good lift or no lift</span>
        </div>

        <div className={s.cols} aria-hidden="true">
          {ATTEMPT.map((a) => (
            <span key={a} className={s.colLabel}>
              {a}
            </span>
          ))}
        </div>

        {LIFTS.map((l, li) => {
          const best = bests[li];
          return (
            <div key={l.id} className={s.lift} role="group" aria-label={l.name}>
              <div className={s.liftHead}>
                <span className={s.liftName}>{l.name}</span>
                <span className={`${s.best} ${best == null ? s.bombed : ""} ${r.num}`}>
                  {best == null ? "No good lift" : `Best ${fmt(best)} kg`}
                </span>
              </div>
              <div className={s.attempts}>
                {plan[l.id].map((a, i) => {
                  const floor = i === 0 ? BAR_MIN : plan[l.id][i - 1].kg;
                  return (
                    <div key={i} className={s.attempt}>
                      <button
                        type="button"
                        className={`${s.kg} ${a.made ? s.made : s.missed} ${r.press}`}
                        aria-pressed={a.made}
                        aria-label={`${l.name} ${ATTEMPT[i].toLowerCase()}, ${fmt(a.kg)} kg, ${a.made ? "good lift" : "no lift"}. Tap to mark it ${a.made ? "no lift" : "a good lift"}.`}
                        onClick={() => flipMade(l.id, i)}
                      >
                        <span className={`${s.kgNum} ${r.num}`}>{fmt(a.kg)}</span>
                        <span className={s.lights} aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                      </button>
                      <div className={s.step}>
                        <button
                          type="button"
                          className={`${s.half} ${r.press}`}
                          aria-label={`${l.name} ${ATTEMPT[i].toLowerCase()} 2.5 kg lighter`}
                          disabled={a.kg - STEP < floor}
                          onClick={() => nudge(l.id, i, -STEP)}
                        >
                          <Minus />
                        </button>
                        <button
                          type="button"
                          className={`${s.half} ${r.press}`}
                          aria-label={`${l.name} ${ATTEMPT[i].toLowerCase()} 2.5 kg heavier`}
                          disabled={a.kg + STEP > MAX_KG}
                          onClick={() => nudge(l.id, i, STEP)}
                        >
                          <Plus />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className={s.sum}>
          <div className={`${r.well} ${s.stat}`}>
            <span className={s.statLabel}>Total</span>
            <span className={`${s.statValue} ${r.num}`}>
              {total == null ? "--" : fmt(total)}
              <span className={s.unit}> kg</span>
            </span>
          </div>
          <div className={`${r.well} ${s.stat}`}>
            <span className={s.statLabel}>DOTS</span>
            <span className={`${s.statValue} ${r.num}`}>{dots == null ? "--" : dots.toFixed(2)}</span>
            <span className={s.tier}>{tier ? cap(tier) : "No total"}</span>
          </div>
          <div className={`${r.well} ${s.stat}`}>
            <span className={s.statLabel}>Bodyweight</span>
            <span className={`${s.statValue} ${r.num}`}>
              {BW}
              <span className={s.unit}> kg</span>
            </span>
          </div>
        </div>

        <p className={s.status} role="status" aria-live="polite">
          {status}
        </p>
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
