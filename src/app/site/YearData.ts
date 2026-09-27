/**
 * THE YEAR (data). One lifter's 365 days, generated deterministically (a seeded PRNG, never
 * Math.random), so the server poster, the WebGL field and every visit agree to the square.
 *
 * The story it tells: a push, pull, legs split run five or six days a week, Sunday usually off; a
 * Christmas break (two sessions, then an empty week); a return week at reduced load; a sick week in
 * the spring; one deload at 55 % volume in the summer; tonnage creeping up across the year in
 * five-week waves. The readouts are computed from this record with the app's own rules
 * (lib/streaks/streaks.ts in the app: a week with at least T sessions is a hit, a light week of 1 to
 * T - 1 is held within a budget of one per six weeks, an empty week breaks the streak), and the
 * heatmap levels are volume quartiles over the trained days (the journal's four steps of light).
 */

export type Kind = "push" | "pull" | "legs";
export type Level = 0 | 1 | 2 | 3 | 4;

export type YearDay = {
  /** day index, 0 to 364 */
  i: number;
  /** column in the 53 x 7 grid */
  week: number;
  /** row, 0 = Monday to 6 = Sunday */
  dow: number;
  kind: Kind | null;
  /** session tonnage in kg (0 on a rest day) */
  vol: number;
  level: Level;
};

export type YearRecord = {
  days: YearDay[];
  maxVol: number;
  weeks: number;
  stats: { daysTrained: number; longestStreak: number; bestWeek: number };
  /** the column where each month starts (the first column carries the month in progress) */
  months: { week: number; label: string }[];
};

/** On a phone the year folds in two, weeks 0 to 26 above (or behind) weeks 27 to 52. */
export const FOLD = 27;

/** Monday 21 October 2024. The year runs to Monday 20 October 2025. */
const START_UTC = Date.UTC(2024, 9, 21);
const DAYS = 365;
const TARGET = 4;
const SEED = 0x5eed2025;

const HOLIDAY_START = 9; // two sessions, then gone
const HOLIDAY_EMPTY = 10; // the empty week that breaks the streak
const RETURN = 11;
const SICK = 24;
const DELOAD = 33;

const BASE: Record<Kind, number> = { push: 10400, pull: 11600, legs: 15200 };
const SPLIT: Kind[] = ["push", "pull", "legs"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

/** Which weekdays (0 = Monday) are trained in each week. */
function plan(rand: () => number): number[][] {
  const weeks = Math.ceil(DAYS / 7);
  const normal: number[] = [];
  for (let w = 0; w < weeks - 1; w++) {
    if (w !== HOLIDAY_START && w !== HOLIDAY_EMPTY && w !== RETURN && w !== SICK && w !== DELOAD) normal.push(w);
  }
  // Nine of the ordinary weeks lose a day to life (a Fisher-Yates pick, seeded).
  const order = normal.slice();
  for (let k = order.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1));
    [order[k], order[j]] = [order[j], order[k]];
  }
  const fives = new Set(order.slice(0, 9));

  const out: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    if (w === weeks - 1) out.push([0]); // the last column holds one day, a Monday, trained
    else if (w === HOLIDAY_START) out.push([0, 1]);
    else if (w === HOLIDAY_EMPTY) out.push([]);
    else if (w === RETURN || w === DELOAD) out.push([0, 1, 3, 4]);
    else if (w === SICK) out.push([0, 1]);
    else {
      // Sunday off most weeks; now and then the rest day moves to midweek.
      const rest = rand() < 0.8 ? 6 : rand() < 0.5 ? 2 : 3;
      let days = [0, 1, 2, 3, 4, 5, 6].filter((d) => d !== rest);
      if (fives.has(w)) {
        const skip = days[1 + Math.floor(rand() * (days.length - 1))];
        days = days.filter((d) => d !== skip);
      }
      out.push(days);
    }
  }
  return out;
}

/** The longest run of weeks under the app's weekly streak rules. The last, partial week is pending. */
export function longestWeeklyStreak(counts: number[], target: number, heldBudgetPer6 = 1) {
  let best = 0;
  let run = 0;
  let forgiven: number[] = [];
  for (let w = 0; w < counts.length; w++) {
    const c = counts[w];
    if (c >= target) run++;
    else if (c >= 1 && forgiven.filter((f) => w - f < 6).length < heldBudgetPer6) {
      forgiven.push(w);
      run++;
    } else {
      run = 0;
      forgiven = [];
    }
    best = Math.max(best, run);
  }
  return best;
}

function build(): YearRecord {
  const rand = mulberry32(SEED);
  const weekDays = plan(rand);
  const weeks = weekDays.length;
  const days: YearDay[] = [];
  let cycle = 0;
  for (let i = 0; i < DAYS; i++) {
    const week = Math.floor(i / 7);
    const dow = i % 7;
    const trained = weekDays[week].includes(dow);
    let kind: Kind | null = null;
    let vol = 0;
    if (trained) {
      kind = SPLIT[cycle++ % SPLIT.length];
      const growth = 0.84 + 0.22 * (i / (DAYS - 1));
      const wave = 1 + 0.06 * ((week % 5) / 4);
      const noise = 1 + (rand() - 0.5) * 0.16;
      const phase = week === DELOAD ? 0.55 : week === RETURN ? 0.78 : week === SICK ? 0.7 : week === HOLIDAY_START ? 0.9 : 1;
      vol = Math.round((BASE[kind] * growth * wave * noise * phase) / 10) * 10;
    }
    days.push({ i, week, dow, kind, vol, level: 0 });
  }

  // Levels: quartiles of the trained days' tonnage, the four steps of light.
  const vols = days.filter((d) => d.vol > 0).map((d) => d.vol).sort((a, b) => a - b);
  const q = (f: number) => vols[Math.floor(f * (vols.length - 1))];
  const [q1, q2, q3] = [q(0.25), q(0.5), q(0.75)];
  for (const d of days) {
    d.level = d.vol <= 0 ? 0 : d.vol <= q1 ? 1 : d.vol <= q2 ? 2 : d.vol <= q3 ? 3 : 4;
  }

  const counts = weekDays.map((ds) => ds.length);
  const complete = counts.slice(0, DAYS % 7 === 0 ? weeks : weeks - 1);

  const months: { week: number; label: string }[] = [];
  let last = -1;
  for (let w = 0; w < weeks; w++) {
    const m = new Date(START_UTC + w * 7 * 86400000).getUTCMonth();
    if (m !== last) {
      months.push({ week: w, label: MONTHS[m] });
      last = m;
    }
  }
  return {
    days,
    maxVol: vols[vols.length - 1],
    weeks,
    stats: {
      daysTrained: vols.length,
      longestStreak: longestWeeklyStreak(complete, TARGET),
      bestWeek: Math.max(...complete),
    },
    months,
  };
}

export const YEAR: YearRecord = build();
