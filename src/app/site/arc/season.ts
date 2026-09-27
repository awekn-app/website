/**
 * THE SEASON (the arc's data, 2026-09-27). One deterministic 12-week recomposition, 84 days, built
 * with the app's own maths so every number the arc shows is one the app would show for the same
 * log. Pure: no Date, no Math.random (a seeded mulberry32), so the server and the client compute
 * the same arrays and the page never hydrates differently.
 *
 *  - Bodyweight: week 1 at maintenance, then a 0.5% a week cut from day 8. Morning weigh-ins carry
 *    the water a real scale shows: a glycogen drop in the first days of the cut, the weekend's salt
 *    and carbs on Sunday and Monday mornings, and day-to-day noise (AR(1), about 0.3 kg). A few
 *    mornings are missed.
 *  - The trend is lib/bodyweight/trend.ts: missing days linearly interpolated, an EWMA with a 7 day
 *    time constant (alpha = 1 - e^(-1/7)) seeded from the median of the first three readings,
 *    rounded to 0.01 kg. kg a week is the trend now minus the trend 7 days earlier (the first day's
 *    trend while the history is shorter than a week, as the app's weightSummary does).
 *  - Strength: one top set a week per lift (squat Monday, bench Tuesday, deadlift Thursday). The
 *    e1RM is lib/pr/e1rm.ts: Brzycki up to 5 reps, Epley from 6 to 10. A deload in week 8, records
 *    after it. A record is a session e1RM above every earlier one.
 *  - Work: hard sets per session on a 4 day upper/lower split (about 14 a muscle a week over 5
 *    muscle groups, so 65 to 77 a week), about half in the deload week.
 *  - Fuel: calories around the target (maintenance in week 1, 2,300 from the cut), weekends
 *    higher; protein against a 170 g target, a hit from 160 g.
 */

export const DAYS = 84;
export const WEEKS = 12;
/** Day index the cut starts on (week 2, day 1); week 1 is maintenance. */
export const CUT_START = 7;
/** The deload week (1-based). */
export const DELOAD_WEEK = 8;
export const DELOAD_START = (DELOAD_WEEK - 1) * 7;
export const START_WEIGHT = 84.0;
/** The planned rate of loss, as a share of bodyweight a week. */
export const CUT_RATE = 0.005;
/** The goal band on the bodyweight track (kg). */
export const GOAL_BAND: [number, number] = [79, 80];
export const KCAL_MAINTENANCE = 2850;
export const KCAL_TARGET = 2300;
/** Half the width of the calorie target band. */
export const KCAL_BAND = 100;
export const PROTEIN_TARGET = 170;
/** A protein day counts as hit from this many grams. */
export const PROTEIN_HIT = 160;

/** The app's trend constant (lib/bodyweight/trend.ts TREND_ALPHA). */
export const TREND_ALPHA = 1 - Math.exp(-1 / 7);

export type Lift = "squat" | "bench" | "deadlift";
export const LIFTS: Lift[] = ["squat", "bench", "deadlift"];
export const LIFT_NAME: Record<Lift, string> = { squat: "Squat", bench: "Bench", deadlift: "Deadlift" };
/** Weekday each lift's top set lands on (0 is Monday). */
export const LIFT_DOW: Record<Lift, number> = { squat: 0, bench: 1, deadlift: 3 };

export interface Session { lift: Lift; day: number; week: number; weight: number; reps: number; e1rm: number; record: boolean }
export interface RecordEvent { lift: Lift; day: number; weight: number; reps: number; e1rm: number }

/* ── maths ── */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A standard normal draw (Box-Muller) from the seeded generator. */
function gauss(rand: () => number): number {
  const u = Math.max(rand(), 1e-9);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const round1 = (n: number) => Math.round(n * 10) / 10;
const round2 = (n: number) => Math.round(n * 100) / 100;
const median = (a: number[]) => {
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Estimated 1RM, the app's formula (no RPE logged): Brzycki up to 5 reps, Epley from 6 to 10. */
export function e1rm(weight: number, reps: number): number {
  if (reps <= 1) return weight;
  if (reps <= 5) return (weight * 36) / (37 - reps);
  return weight * (1 + reps / 30);
}

/**
 * The app's trend over one reading a day (null = no weigh-in): linear interpolation across missed
 * days, then the EWMA seeded from the median of the first three readings, rounded to 0.01 kg.
 */
export function trendOf(readings: (number | null)[], alpha = TREND_ALPHA): number[] {
  const kept = readings.map((v, d) => ({ d, v })).filter((x): x is { d: number; v: number } => x.v != null);
  if (kept.length === 0) return [];
  const filled = readings.map((v, d) => {
    if (v != null) return v;
    let prev: { d: number; v: number } | null = null;
    let next: { d: number; v: number } | null = null;
    for (const k of kept) {
      if (k.d < d) prev = k;
      else if (k.d > d) { next = k; break; }
    }
    if (prev && next) return prev.v + ((d - prev.d) / (next.d - prev.d)) * (next.v - prev.v);
    return (prev ?? next ?? kept[0]).v;
  });
  let trend = median(kept.slice(0, 3).map((k) => k.v));
  return filled.map((v) => {
    trend = trend + alpha * (v - trend);
    return round2(trend);
  });
}

/* ── the programme: one top set a week per lift, week 8 the deload ── */

const TOP_SETS: Record<Lift, [number, number][]> = {
  squat: [[135, 5], [137.5, 4], [137.5, 5], [140, 4], [140, 5], [142.5, 4], [142.5, 4], [117.5, 5], [142.5, 5], [145, 4], [145, 5], [147.5, 5]],
  bench: [[92.5, 5], [92.5, 5], [95, 4], [95, 5], [97.5, 4], [97.5, 5], [97.5, 5], [80, 5], [100, 3], [100, 4], [100, 5], [102.5, 4]],
  deadlift: [[165, 5], [167.5, 4], [170, 4], [170, 5], [172.5, 4], [172.5, 5], [175, 4], [145, 5], [177.5, 5], [180, 4], [180, 4], [180, 5]],
};

/** Planned hard sets per session: Monday lower, Tuesday upper, Thursday lower, Friday upper. */
const SESSION_SETS: [number, number][] = [[0, 17], [1, 18], [3, 16], [4, 18]];
/** The weekly build: sets added to each session, week 1 to 12 (week 8 is replaced by the deload). */
const WEEK_ADD = [-2, -1, 0, 0, 1, 1, 2, 0, -1, 0, 1, 1];

function build() {
  const rand = mulberry32(0x5eed12);

  /* bodyweight */
  const perDay = Math.pow(1 - CUT_RATE, 1 / 7);
  const missed = new Set<number>();
  while (missed.size < 5) {
    const d = 3 + Math.floor(rand() * 76);
    if (d !== CUT_START) missed.add(d);
  }
  const tissue: number[] = [];
  const weighIns: (number | null)[] = [];
  let noise = 0;
  for (let d = 0; d < DAYS; d++) {
    const dow = d % 7;
    tissue.push(d < CUT_START ? START_WEIGHT : tissue[d - 1] * perDay);
    // glycogen and its water leave in the first days of a deficit
    const glycogen = d < CUT_START ? 0 : -0.6 * (1 - Math.exp(-(d - CUT_START + 1) / 2.5));
    // Saturday and Sunday eat higher: Sunday and Monday mornings read heavier
    const weekend = dow === 6 || dow === 0 ? (d < CUT_START ? 0.2 : 0.35) : 0;
    noise = 0.55 * noise + 0.24 * gauss(rand);
    const scale = round1(tissue[d] + glycogen + weekend + noise);
    weighIns.push(missed.has(d) ? null : scale);
  }
  const trend = trendOf(weighIns);
  const kgPerWeek = trend.map((t, d) => round2(t - trend[Math.max(0, d - 7)]));

  /* strength */
  const sessions: Record<Lift, Session[]> = { squat: [], bench: [], deadlift: [] };
  const records: RecordEvent[] = [];
  for (const lift of LIFTS) {
    let best = -Infinity;
    TOP_SETS[lift].forEach(([weight, reps], i) => {
      const value = e1rm(weight, reps);
      const record = i > 0 && value > best + 1e-9;
      if (value > best) best = value;
      const day = i * 7 + LIFT_DOW[lift];
      sessions[lift].push({ lift, day, week: i + 1, weight, reps, e1rm: round2(value), record });
      if (record) records.push({ lift, day, weight, reps, e1rm: round2(value) });
    });
  }
  records.sort((a, b) => a.day - b.day);
  /** Each lift per day for the line: straight between sessions, flat before the first and after the last. */
  const liftDaily = {} as Record<Lift, number[]>;
  for (const lift of LIFTS) {
    const ss = sessions[lift];
    liftDaily[lift] = Array.from({ length: DAYS }, (_, d) => {
      if (d <= ss[0].day) return ss[0].e1rm;
      const last = ss[ss.length - 1];
      if (d >= last.day) return last.e1rm;
      const j = ss.findIndex((x) => x.day > d);
      const a = ss[j - 1];
      const b = ss[j];
      return a.e1rm + ((d - a.day) / (b.day - a.day)) * (b.e1rm - a.e1rm);
    });
  }

  /* work */
  const setsByDay = new Array<number>(DAYS).fill(0);
  for (let w = 0; w < WEEKS; w++) {
    for (const [dow, base] of SESSION_SETS) {
      const jitter = Math.round((rand() - 0.5) * 2.4);
      const n = w + 1 === DELOAD_WEEK ? Math.round(base * 0.55) : base + WEEK_ADD[w] + jitter;
      setsByDay[w * 7 + dow] = n;
    }
  }
  const weeklySets = Array.from({ length: WEEKS }, (_, w) => setsByDay.slice(w * 7, w * 7 + 7).reduce((x, y) => x + y, 0));
  /** The 4-week average as of each week (fewer weeks at the start). */
  const avg4 = weeklySets.map((_, w) => {
    const win = weeklySets.slice(Math.max(0, w - 3), w + 1);
    return Math.round((win.reduce((x, y) => x + y, 0) / win.length) * 10) / 10;
  });

  /* fuel */
  const kcalTarget: number[] = [];
  const kcal: number[] = [];
  const protein: number[] = [];
  for (let d = 0; d < DAYS; d++) {
    const dow = d % 7;
    const target = d < CUT_START ? KCAL_MAINTENANCE : KCAL_TARGET;
    const weekend = dow === 5 || dow === 6;
    kcalTarget.push(target);
    const k = target + (weekend ? (d < CUT_START ? 150 : 320) + 110 * gauss(rand) : 65 * gauss(rand));
    kcal.push(Math.round(k / 10) * 10);
    protein.push(Math.round(weekend ? 158 + 13 * gauss(rand) : 176 + 9 * gauss(rand)));
  }
  const proteinHit = protein.map((p) => p >= PROTEIN_HIT);

  return { weighIns, trend, kgPerWeek, sessions, records, liftDaily, setsByDay, weeklySets, avg4, kcal, kcalTarget, protein, proteinHit };
}

export const SEASON = build();

/* ── reading the season at a day ── */

export const weekOf = (d: number) => Math.floor(d / 7) + 1;
export const dayOfWeek = (d: number) => (d % 7) + 1;

/** The most recent weigh-in on or before the day. */
export function scaleAt(d: number): number {
  for (let i = d; i >= 0; i--) {
    const v = SEASON.weighIns[i];
    if (v != null) return v;
  }
  return SEASON.trend[0];
}

/** The latest session of a lift on or before the day (the first session before it has one). */
export function sessionAt(lift: Lift, d: number): Session {
  const ss = SEASON.sessions[lift];
  let out = ss[0];
  for (const x of ss) if (x.day <= d) out = x;
  return out;
}

/** The lift trained most recently (the one the strength track lights). */
export function litLiftAt(d: number): Lift {
  let lit: Lift = "squat";
  let at = -1;
  for (const lift of LIFTS) {
    const x = sessionAt(lift, d);
    if (x.day <= d && x.day > at) {
      at = x.day;
      lit = lift;
    }
  }
  return lit;
}

/** Squat + bench + deadlift, each lift's latest e1RM. */
export const totalAt = (d: number) => LIFTS.reduce((sum, lift) => sum + sessionAt(lift, d).e1rm, 0);

/** Hard sets from the start of the day's week through the day. */
export function setsThisWeek(d: number): number {
  let n = 0;
  for (let i = Math.floor(d / 7) * 7; i <= d; i++) n += SEASON.setsByDay[i];
  return n;
}

/** The 4-week average as of the last completed week (week 1's own total until then). */
export function avg4At(d: number): number {
  const w = weekOf(d);
  const done = d % 7 === 6 ? w : w - 1;
  return SEASON.avg4[Math.max(0, done - 1)];
}

/* ── derived events, for the annotations ── */

const squatAfterDeload = SEASON.records.find((r) => r.lift === "squat" && r.day > DELOAD_START + 6);
const benchHundred = SEASON.records.find((r) => r.lift === "bench" && r.weight >= 100);

export const EVENTS = {
  cutStart: CUT_START,
  deloadStart: DELOAD_START,
  squatRecord: squatAfterDeload ?? SEASON.records[SEASON.records.length - 1],
  benchRecord: benchHundred ?? SEASON.records[SEASON.records.length - 1],
  end: DAYS - 1,
};
