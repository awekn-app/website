import type { CSSProperties } from "react";
import { Chapter } from "./Chapter";
import { YearField } from "./YearField";
import { FOLD, YEAR } from "./YearData";
import type { YearDay } from "./YearData";
import s from "./Year.module.css";

/* The poster's own space: a 12-unit pitch, 10-unit squares, 7 rows. */
const PITCH = 12;
const CELL = 10;
const VB_H = 7 * PITCH - (PITCH - CELL);
/** The journal's four steps of light (white instead of the app's accent), and the empty well. */
const LIGHT = [0.05, 0.2, 0.38, 0.62, 0.92] as const;

/**
 * The year in two halves (weeks 0 to 26, then 27 to 52). On a phone they stack, so a square is
 * about ten pixels instead of six; from 900 px they sit side by side as one 53-week strip.
 */
const HALVES = [
  [0, FOLD],
  [FOLD, YEAR.weeks],
].map(([from, to]) => {
  const cols = to - from;
  const width = cols * PITCH - (PITCH - CELL);
  const days = YEAR.days.filter((d) => d.week >= from && d.week < to);
  // Month labels: the month in progress at the half's first column, then each month's first
  // column, dropping a label that would sit against the next one.
  const inHalf = YEAR.months.filter((m) => m.week > from && m.week < to);
  const lead = [...YEAR.months].reverse().find((m) => m.week <= from);
  const all = lead ? [{ week: from, label: lead.label }, ...inHalf] : inHalf;
  const months = all.filter((m, k) => k === all.length - 1 || all[k + 1].week - m.week >= 3);
  return {
    key: from,
    from,
    width,
    months: months.map((m) => ({ label: m.label, left: (((m.week - from) * PITCH) / width) * 100 })),
    byLevel: LIGHT.map((_, lv) => days.filter((d) => d.level === lv)),
  };
});

const { daysTrained, longestStreak, bestWeek } = YEAR.stats;

/**
 * THE YEAR. A year of training as a field of days: a column per week, a row per weekday, each
 * square as bright as the day's tonnage (quartiles, the journal's grammar). The server renders the
 * heatmap as SVG; it is the whole picture for reduced motion, low-end devices and no JS. On a
 * capable device YearField lays the same grid out in perspective in three.js, each block rising to
 * its day's volume as the section scrolls in, and the poster crossfades away once the first frame is
 * drawn. The readouts are computed from the same record (YearData.ts), never typed in.
 */
export function Year() {
  return (
    <section id="year" className={s.year} aria-labelledby="year-title">
      <Chapter
        eyebrow="The year"
        title={["A year of", "showing up."]}
        sub="One square a day. One light week in six holds the streak. An empty one breaks it."
        id="year-title"
      />

      <div className={s.body}>
        <figure className={s.figure}>
          <div className={s.stage}>
            <div
              className={s.poster}
              role="img"
              aria-label={`A year of training, one square a day: ${daysTrained} of 365 days trained, the longest weekly streak ${longestStreak} weeks, the best week ${bestWeek} sessions.`}
            >
              {HALVES.map((h) => (
                <div key={h.key} className={s.half} style={{ "--u": h.width } as CSSProperties}>
                  <div className={s.months}>
                    {h.months.map((m) => (
                      <span key={m.label} className={s.month} style={{ left: `${m.left.toFixed(3)}%` }}>
                        {m.label}
                      </span>
                    ))}
                  </div>
                  <svg className={s.heat} viewBox={`0 0 ${h.width} ${VB_H}`} aria-hidden="true">
                    {h.byLevel.map((days, lv) => (
                      <g key={lv} fill="#fff" fillOpacity={LIGHT[lv]}>
                        {days.map((d: YearDay) => (
                          <rect key={d.i} x={(d.week - h.from) * PITCH} y={d.dow * PITCH} width={CELL} height={CELL} rx={2.4} />
                        ))}
                      </g>
                    ))}
                  </svg>
                </div>
              ))}
            </div>
            <YearField />
          </div>
          <figcaption className={s.caption}>
            <span>A sample year, drawn to the app&apos;s own streak rules.</span>
            <span className={s.legend} aria-hidden="true">
              Less
              {LIGHT.map((o, i) => (
                <i key={i} className={s.swatch} style={{ background: `rgba(255, 255, 255, ${o})` }} />
              ))}
              More
            </span>
          </figcaption>
        </figure>

        <dl className={s.readouts}>
          <div className={s.readout}>
            <dt className={s.label}>Days trained</dt>
            <dd className={s.value}>{daysTrained}</dd>
          </div>
          <div className={s.readout}>
            <dt className={s.label}>Longest streak</dt>
            <dd className={s.value}>
              {longestStreak}
              <span className={s.unit}> weeks</span>
            </dd>
          </div>
          <div className={s.readout}>
            <dt className={s.label}>Best week</dt>
            <dd className={s.value}>
              {bestWeek}
              <span className={s.unit}> sessions</span>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
