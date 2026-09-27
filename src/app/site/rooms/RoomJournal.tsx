"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Room, roomStyles as r, useReducedMotion } from "./Room";
import s from "./RoomJournal.module.css";

/**
 * Room 06, the journal. The app's journal grid (components/journal/JournalGrid.tsx): a column per
 * week, a row per weekday from Monday, newest on the right, a square's light is how much of the day
 * was logged, today wears a ring. Seeded from a small integer hash so server and browser agree, and
 * dated from a fixed anchor (Sun 27 Sep 2026), never the clock. Tap a square to log or clear it;
 * the streak and the month count use the app's journalStats rules. Arrow keys move across the grid.
 * The app lights its squares in the accent; the site keeps them white, four steps of light.
 */

const DAY = 86_400_000;
const ANCHOR = Date.UTC(2026, 8, 27);
const WEEKS = 18;
/** On a narrow card the oldest weeks step aside so a square stays about 16px. */
const NARROW_HIDDEN = 3;
const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ROW_LABEL = ["", "T", "", "T", "", "S", ""];

type Cell = { key: number; label: string; month: number; future: boolean; today: boolean };

/** A small integer hash to [0, 1): deterministic, the same on the server and in the browser. */
function hash(n: number) {
  let h = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

// the field: WEEKS columns, the last one holding the anchor day
const anchorDow = new Date(ANCHOR).getUTCDay();
const START = ANCHOR - ((anchorDow + 6) % 7) * DAY - 7 * (WEEKS - 1) * DAY;
const CELLS: Cell[] = Array.from({ length: WEEKS * 7 }, (_, i) => {
  const t = START + i * DAY;
  const d = new Date(t);
  return {
    key: t,
    label: `${WD[d.getUTCDay()]} ${d.getUTCDate()} ${MON[d.getUTCMonth()]}`,
    month: d.getUTCMonth(),
    future: t > ANCHOR,
    today: t === ANCHOR,
  };
});
const TODAY = CELLS.findIndex((c) => c.today);
const ANCHOR_MONTH = new Date(ANCHOR).getUTCMonth();
/** A month name over the week each month begins (the app's rule: its Monday falls on the 1st to 7th). */
const MONTHS = Array.from({ length: WEEKS }, (_, c) => {
  const d = new Date(START + c * 7 * DAY);
  return d.getUTCDate() <= 7 ? MON[d.getUTCMonth()] : "";
});

/**
 * A believable season: heavy days (Mon, Thu) nearly always, Sunday mostly rest, one quiet week away,
 * and a run of twelve days up to yesterday so today is the square that extends the streak.
 */
const P_BY_ROW = [0.92, 0.8, 0.55, 0.88, 0.8, 0.68, 0.28];
const SEED: number[] = CELLS.map((c, i) => {
  if (c.future || c.today) return 0;
  const back = TODAY - i;
  if (back === 13) return 0;
  const row = i % 7;
  const week = Math.floor(i / 7);
  const bump = row === 0 || row === 3 ? 1 : 0;
  const lv = Math.min(4, 1 + Math.floor(hash(i + 977) * 3.4) + bump);
  if (back >= 1 && back <= 12) return Math.max(2, lv);
  const p = week === 6 ? 0.12 : P_BY_ROW[row];
  return hash(i) < p ? lv : 0;
});

/** Current run (ending today, or yesterday while today is open) and logged days this month. */
function stats(levels: number[]) {
  let run = 0;
  for (let i = levels[TODAY] > 0 ? TODAY : TODAY - 1; i >= 0 && levels[i] > 0; i--) run++;
  let month = 0;
  CELLS.forEach((c, i) => {
    if (!c.future && c.month === ANCHOR_MONTH && levels[i] > 0) month++;
  });
  return { run, month };
}
const MONTH_DAYS = new Date(ANCHOR).getUTCDate();

export function RoomJournal() {
  const reduced = useReducedMotion();
  const [levels, setLevels] = useState<number[]>(SEED);
  const [focus, setFocus] = useState(TODAY);
  const [pop, setPop] = useState<{ i: number; n: number } | null>(null);
  const [said, setSaid] = useState("");
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const { run, month } = stats(levels);

  const toggle = (i: number) => {
    const next = levels.slice();
    const on = next[i] === 0;
    next[i] = on ? SEED[i] || 3 : 0;
    const after = stats(next);
    setLevels(next);
    setPop((p) => ({ i, n: (p?.n ?? 0) + 1 }));
    setSaid(
      `${CELLS[i].label} ${on ? "logged" : "cleared"}. Streak ${after.run} ${after.run === 1 ? "day" : "days"}, ${after.month} this month.`,
    );
  };

  // roving focus: up and down walk the week, left and right jump a week
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowUp: -1, ArrowDown: 1, ArrowLeft: -7, ArrowRight: 7 };
    let to: number | null = null;
    if (e.key in step) to = focus + step[e.key];
    else if (e.key === "Home") to = focus - (focus % 7);
    else if (e.key === "End") to = focus - (focus % 7) + 6;
    if (to === null) return;
    e.preventDefault();
    const el = refs.current[to];
    // a hidden (narrow) or absent square is a wall
    if (!el || el.offsetParent === null) return;
    setFocus(to);
    el.focus();
  };

  const reset = () => {
    setLevels(SEED);
    setPop(null);
    setSaid("Reset to the seeded weeks.");
  };

  return (
    <Room
      id="journal"
      index="09"
      name="The journal"
      title="Every day you showed up, as a field of light."
      sub="Tap a day to log it. Watch the weeks fill in."
      note="The app's journal grid, the same one on your Tracker."
      onReset={reset}
    >
      <div className={r.card}>
        <div className={s.facts}>
          <div className={s.fact}>
            <span className={s.factLabel}>Current streak</span>
            <span className={s.factValue}>
              <span className={`${s.big} ${r.num}`}>{run}</span>
              <span className={s.unit}>{run === 1 ? "day" : "days"}</span>
            </span>
          </div>
          <div className={s.fact}>
            <span className={s.factLabel}>This month</span>
            <span className={s.factValue}>
              <span className={`${s.big} ${r.num}`}>{month}</span>
              <span className={`${s.unit} ${r.num}`}>of {MONTH_DAYS}</span>
            </span>
          </div>
        </div>

        <div className={s.field}>
          <div className={s.months} aria-hidden="true">
            {MONTHS.map((m, c) => (
              <span key={c} className={`${s.month} ${c < NARROW_HIDDEN ? s.old : ""}`}>
                {m}
              </span>
            ))}
          </div>
          <div className={s.body}>
            <div className={s.rows} aria-hidden="true">
              {ROW_LABEL.map((l, i) => (
                <span key={i} className={s.rowLabel}>
                  {l}
                </span>
              ))}
            </div>
            <div className={s.grid} role="group" aria-label={`Journal, the last ${WEEKS} weeks. Arrow keys move between days.`} onKeyDown={onKeyDown}>
              {CELLS.map((c, i) => {
                const old = Math.floor(i / 7) < NARROW_HIDDEN;
                if (c.future) return <span key={c.key} className={`${s.cell} ${s.future} ${old ? s.old : ""}`} aria-hidden="true" />;
                const lv = levels[i];
                const popped = !reduced && pop?.i === i ? (pop.n % 2 ? s.popA : s.popB) : "";
                return (
                  <button
                    key={c.key}
                    ref={(el) => {
                      refs.current[i] = el;
                    }}
                    type="button"
                    tabIndex={i === focus ? 0 : -1}
                    className={`${s.cell} ${s[`l${lv}`]} ${c.today ? s.today : ""} ${old ? s.old : ""} ${popped}`}
                    aria-pressed={lv > 0}
                    aria-label={`${c.label}${c.today ? ", today" : ""}, ${lv > 0 ? "logged" : "not logged"}`}
                    onClick={() => toggle(i)}
                    onFocus={() => setFocus(i)}
                  />
                );
              })}
            </div>
          </div>
          <div className={s.legend} aria-hidden="true">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className={`${s.swatch} ${s[`l${l}`]}`} />
            ))}
            <span>More</span>
          </div>
        </div>

        <p className={s.status} role="status" aria-live="polite">
          {said || "Today is still open. Tap it to keep the run going."}
        </p>
      </div>
    </Room>
  );
}
