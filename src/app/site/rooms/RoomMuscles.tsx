"use client";

import { useState, type CSSProperties } from "react";
import { Room, roomStyles as r, useReducedMotion, useRoomLive } from "./Room";
import s from "./RoomMuscles.module.css";

/* ── the app's volume engine, mirrored (awekn lib/splits/volume.ts) ──
 * A working set counts one set for each PRIMARY muscle of its exercise and half a set for each
 * secondary (fractional volume). A muscle's week is judged against the 10 to 20 set band. */

type Muscle = "chest" | "back" | "shoulders" | "quads" | "hamstrings" | "glutes" | "biceps" | "triceps" | "calves";
const MUSCLES: Muscle[] = ["chest", "back", "shoulders", "quads", "hamstrings", "glutes", "biceps", "triceps", "calves"];
/** Singular muscle names take "is"; the rest are plural ("hamstrings are"). */
const SINGULAR = new Set<Muscle>(["chest", "back"]);
const BAND: [number, number] = [10, 20];
/** The bar scale: a little past the top of the band so "over" has somewhere to go. */
const SCALE = 24;

type Ex = { name: string; sets: number; primary: Muscle[]; secondary: Muscle[] };
type WorkoutId = "push" | "pull" | "legs";
type Workout = { id: WorkoutId; name: string; exercises: Ex[] };

/** Already in the week: Monday's upper day and Tuesday's lower day. */
const SEED: Ex[] = [
  { name: "Bench press", sets: 4, primary: ["chest"], secondary: ["triceps", "shoulders"] },
  { name: "Barbell row", sets: 4, primary: ["back"], secondary: ["biceps"] },
  { name: "Overhead press", sets: 3, primary: ["shoulders"], secondary: ["triceps"] },
  { name: "Lat pulldown", sets: 3, primary: ["back"], secondary: ["biceps"] },
  { name: "Dumbbell curl", sets: 3, primary: ["biceps"], secondary: [] },
  { name: "Triceps pushdown", sets: 3, primary: ["triceps"], secondary: [] },
  { name: "Back squat", sets: 4, primary: ["quads"], secondary: ["glutes"] },
  { name: "Romanian deadlift", sets: 3, primary: ["hamstrings"], secondary: ["glutes"] },
  { name: "Leg extension", sets: 3, primary: ["quads"], secondary: [] },
  { name: "Standing calf raise", sets: 4, primary: ["calves"], secondary: [] },
];

const WORKOUTS: Workout[] = [
  {
    id: "push",
    name: "Push",
    exercises: [
      { name: "Bench press", sets: 4, primary: ["chest"], secondary: ["triceps", "shoulders"] },
      { name: "Incline dumbbell press", sets: 3, primary: ["chest"], secondary: ["shoulders", "triceps"] },
      { name: "Overhead press", sets: 3, primary: ["shoulders"], secondary: ["triceps"] },
      { name: "Lateral raise", sets: 4, primary: ["shoulders"], secondary: [] },
      { name: "Triceps pushdown", sets: 3, primary: ["triceps"], secondary: [] },
    ],
  },
  {
    id: "pull",
    name: "Pull",
    exercises: [
      { name: "Pull-up", sets: 4, primary: ["back"], secondary: ["biceps"] },
      { name: "Barbell row", sets: 4, primary: ["back"], secondary: ["biceps"] },
      { name: "Seated cable row", sets: 3, primary: ["back"], secondary: ["biceps"] },
      { name: "Face pull", sets: 3, primary: ["shoulders"], secondary: ["back"] },
      { name: "Dumbbell curl", sets: 3, primary: ["biceps"], secondary: [] },
      { name: "Hammer curl", sets: 2, primary: ["biceps"], secondary: [] },
    ],
  },
  {
    id: "legs",
    name: "Legs",
    exercises: [
      { name: "Back squat", sets: 4, primary: ["quads"], secondary: ["glutes"] },
      { name: "Romanian deadlift", sets: 4, primary: ["hamstrings"], secondary: ["glutes"] },
      { name: "Leg press", sets: 3, primary: ["quads"], secondary: ["glutes"] },
      { name: "Lying leg curl", sets: 3, primary: ["hamstrings"], secondary: [] },
      { name: "Hip thrust", sets: 3, primary: ["glutes"], secondary: ["hamstrings"] },
      { name: "Seated calf raise", sets: 3, primary: ["calves"], secondary: [] },
      { name: "Standing calf raise", sets: 3, primary: ["calves"], secondary: [] },
    ],
  },
];

type Counts = Record<Muscle, number>;

/** Sets per muscle (primary 1, secondary 0.5, a muscle never counted twice for one set). */
function setsPerMuscle(exercises: Ex[]): Counts {
  const m = Object.fromEntries(MUSCLES.map((k) => [k, 0])) as Counts;
  for (const ex of exercises) {
    const prim = new Set(ex.primary);
    for (const p of prim) m[p] += ex.sets;
    for (const q of new Set(ex.secondary)) if (!prim.has(q)) m[q] += ex.sets * 0.5;
  }
  for (const k of MUSCLES) m[k] = Math.round(m[k] * 2) / 2;
  return m;
}

const countsFor = (done: WorkoutId[]) =>
  setsPerMuscle([...SEED, ...WORKOUTS.filter((w) => done.includes(w.id)).flatMap((w) => w.exercises)]);

const stateOf = (n: number) => (n < BAND[0] ? "under" : n > BAND[1] ? "over" : "in");
const label = (m: Muscle) => m.charAt(0).toUpperCase() + m.slice(1);
const fmt = (n: number) => String(Math.round(n * 2) / 2);
const setTotal = (w: Workout) => w.exercises.reduce((a, e) => a + e.sets, 0);
const TOTAL_SEED = SEED.reduce((a, e) => a + e.sets, 0);

function names(list: Muscle[]): string {
  const words = list.map((m, i) => (i === 0 ? label(m) : m));
  if (words.length <= 1) return words.join("");
  return `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}
const verb = (list: Muscle[], one: string, many: string) => (list.length === 1 && SINGULAR.has(list[0]) ? one : many);

type Last = { id: WorkoutId; added: boolean; key: number } | null;

/** The payoff line: what just moved, then the one thing the week still needs. */
function statusLine(done: WorkoutId[], counts: Counts, last: Last): string {
  const parts: string[] = [];
  if (last) {
    const w = WORKOUTS.find((x) => x.id === last.id)!;
    const prevDone = last.added ? done.filter((d) => d !== last.id) : [...done, last.id];
    const prev = countsFor(prevDone);
    if (last.added) {
      const entered = MUSCLES.filter((m) => prev[m] < BAND[0] && counts[m] >= BAND[0] && counts[m] <= BAND[1]);
      parts.push(
        entered.length
          ? `${names(entered)} ${verb(entered, "is", "are")} in the growth range.`
          : `${w.name} logged, ${setTotal(w)} sets.`,
      );
    } else {
      const left = MUSCLES.filter((m) => prev[m] >= BAND[0] && counts[m] < BAND[0]);
      parts.push(left.length ? `${w.name} removed. ${names(left)} ${verb(left, "drops", "drop")} under 10.` : `${w.name} removed.`);
    }
  }

  const over = MUSCLES.filter((m) => counts[m] > BAND[1]);
  const under = MUSCLES.filter((m) => counts[m] < BAND[0]).sort((a, b) => counts[a] - counts[b]);
  if (over.length) {
    parts.push(`${names([over[0]])} ${verb([over[0]], "is", "are")} over 20, more than most people recover from.`);
  } else if (under.length) {
    const m = under[0];
    const helps = WORKOUTS.filter((w) => !done.includes(w.id))
      .map((w) => ({ w, n: setsPerMuscle(w.exercises)[m] }))
      .filter((x) => x.n > 0)
      .sort((a, b) => b.n - a.n)[0];
    parts.push(`${label(m)} ${verb([m], "is", "are")} under 10${helps ? `, one more ${helps.w.name.toLowerCase()} day` : ""}.`);
  } else {
    parts.push("Every muscle is in the growth range. That is a full week.");
  }
  return parts.join(" ");
}

/**
 * The muscles room. The week's hard sets per muscle as sorted bars against the 10 to 20 band,
 * counted exactly the way the app counts them. Tap a workout to log its sets; tap it again to
 * take them back out. The bars grow and re-sort by transform, so nothing reflows.
 */
export function RoomMuscles({ index = "", flip }: { index?: string; flip?: boolean } = {}) {
  const live = useRoomLive("muscles");
  const reduced = useReducedMotion();
  const [done, setDone] = useState<WorkoutId[]>([]);
  const [last, setLast] = useState<Last>(null);
  const [preview, setPreview] = useState<WorkoutId>("push");

  const counts = countsFor(done);
  // the app's order: most sets first, then by name
  const sorted = [...MUSCLES].sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  const rank = Object.fromEntries(sorted.map((m, i) => [m, i])) as Record<Muscle, number>;
  const total = TOTAL_SEED + WORKOUTS.filter((w) => done.includes(w.id)).reduce((a, w) => a + setTotal(w), 0);
  const status = statusLine(done, counts, last);
  const shown = WORKOUTS.find((w) => w.id === preview)!;

  const toggle = (id: WorkoutId) => {
    const added = !done.includes(id);
    setDone(added ? [...done, id] : done.filter((d) => d !== id));
    setLast({ id, added, key: (last?.key ?? 0) + 1 });
    setPreview(id);
  };

  const reset = () => {
    setDone([]);
    setLast(null);
    setPreview("push");
  };

  const bandStyle = {
    "--b0": String(BAND[0] / SCALE),
    "--bw": String((BAND[1] - BAND[0]) / SCALE),
    "--rows": String(MUSCLES.length),
  } as CSSProperties;

  return (
    <Room
      id="muscles"
      index={index}
      flip={flip}
      name="Muscles"
      title="Every muscle, counted."
      sub="Hard sets per muscle this week, against the range that grows it. Log a workout and watch the week fill in."
      note="Counted like the app: a primary muscle 1 set, a secondary half."
      onReset={reset}
    >
      <div className={`${r.card} ${live ? "" : s.paused} ${reduced ? s.still : ""}`}>
        <div className={s.head}>
          <div className={s.headWords}>
            <span className={s.title}>This week</span>
            <span className={s.dim}>Upper on Monday and lower on Tuesday are in.</span>
          </div>
          <span className={`${s.total} ${r.num}`}>
            {total}
            <span className={s.unit}> hard sets</span>
          </span>
        </div>

        <div className={s.chart} style={bandStyle} aria-hidden="true">
          <div className={s.scale}>
            <span className={`${s.tick} ${s.tickLo} ${r.num}`}>{BAND[0]}</span>
            <span className={`${s.tick} ${s.tickHi} ${r.num}`}>{BAND[1]}</span>
          </div>
          <div className={s.rows}>
            <span className={s.band} />
            {MUSCLES.map((m) => {
              const n = counts[m];
              return (
                <div
                  key={m}
                  className={`${s.row} ${s[stateOf(n)]}`}
                  style={{ transform: `translateY(calc(${rank[m]} * var(--row)))` }}
                >
                  <span className={s.name}>{label(m)}</span>
                  <span className={s.track}>
                    <span className={s.bar} style={{ width: `${(Math.min(n, SCALE) / SCALE) * 100}%` }} />
                  </span>
                  <span className={`${s.count} ${r.num}`}>{fmt(n)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <ol className="sr-only" aria-label="Hard sets per muscle this week, most first">
          {sorted.map((m) => (
            <li key={m}>
              {label(m)}, {fmt(counts[m])} sets, {stateOf(counts[m]) === "in" ? "in the 10 to 20 range" : `${stateOf(counts[m])} the range`}
            </li>
          ))}
        </ol>

        <div className={s.legend} aria-hidden="true">
          <span className={s.swatch} />
          <span>10 to 20 sets a week, the range that grows a muscle</span>
        </div>

        <div className={s.chips} role="group" aria-label="Log a workout">
          {WORKOUTS.map((w) => {
            const on = done.includes(w.id);
            return (
              <button
                key={w.id}
                type="button"
                className={`${s.chip} ${on ? s.on : ""} ${r.press}`}
                aria-pressed={on}
                aria-label={on ? `${w.name} logged, ${setTotal(w)} sets. Tap to remove it.` : `Log ${w.name.toLowerCase()}, ${setTotal(w)} sets`}
                onClick={() => toggle(w.id)}
              >
                <span className={s.chipName}>
                  {on && (
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M3 7.4 L5.8 10 L11 4.4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {w.name}
                </span>
                <span className={`${s.chipSets} ${r.num}`}>{setTotal(w)} sets</span>
              </button>
            );
          })}
        </div>

        <div className={`${r.well} ${s.list}`}>
          <div className={s.listHead}>
            <span className={s.listTitle}>{shown.name}</span>
            <span className={s.dim}>{done.includes(shown.id) ? "Logged. Tap again to undo." : "Tap to log it."}</span>
          </div>
          <ul className={s.exercises}>
            {shown.exercises.map((e) => (
              <li key={e.name} className={s.ex}>
                <span className={s.exName}>{e.name}</span>
                <span className={`${s.exSets} ${r.num}`}>{e.sets} sets</span>
              </li>
            ))}
          </ul>
        </div>

        <p className={s.status} role="status" aria-live="polite">
          <span key={last?.key ?? 0} className={last != null && !reduced ? s.rise : undefined}>
            {status}
          </span>
        </p>
      </div>
    </Room>
  );
}
