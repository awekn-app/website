"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import s from "./Arc.module.css";
import {
  DAYS,
  WEEKS,
  LIFTS,
  LIFT_NAME,
  SEASON,
  CUT_START,
  DELOAD_WEEK,
  GOAL_BAND,
  KCAL_MAINTENANCE,
  KCAL_TARGET,
  PROTEIN_HIT,
  PROTEIN_TARGET,
  weekOf,
  dayOfWeek,
  scaleAt,
  sessionAt,
  litLiftAt,
  totalAt,
  setsThisWeek,
  avg4At,
  type Lift,
} from "./arc/season";
import {
  TRACKS,
  NOMINAL_W,
  ANNOTATIONS,
  GOAL,
  fx,
  pctY,
  lenAtX,
  yAtX,
  weightGeo,
  strengthGeo,
  workGeo,
  fuelGeo,
  type Poly,
  type TrackId,
  type WeightGeo,
  type StrengthGeo,
  type WorkGeo,
  type FuelGeo,
} from "./arc/instrument";

/* ── the finished state (day 84), which the server renders and reduced motion keeps ── */

const L = DAYS - 1;
const TRACK_IDS: TrackId[] = ["weight", "strength", "work", "fuel"];

interface Geo { weight: WeightGeo; strength: StrengthGeo; work: WorkGeo; fuel: FuelGeo }
const nominal = (id: TrackId) => ({ w: NOMINAL_W, h: TRACKS[id].nominalH });
const SSR_GEO: Geo = {
  weight: weightGeo(NOMINAL_W, TRACKS.weight.nominalH),
  strength: strengthGeo(NOMINAL_W, TRACKS.strength.nominalH),
  work: workGeo(NOMINAL_W, TRACKS.work.nominalH),
  fuel: fuelGeo(NOMINAL_W, TRACKS.fuel.nominalH),
};

/* ── formatting (no locale APIs: the server and the client must print the same) ── */

const thousands = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const MINUS = "−";
const signed = (v: number) => `${v < 0 ? MINUS : v > 0 ? "+" : ""}${Math.abs(v).toFixed(2)}`;
const pct = (f: number) => `${(f * 100).toFixed(3)}%`;
const LETTER: Record<Lift, string> = { squat: "S", bench: "B", deadlift: "D" };

/** Every live number the instrument prints, read at one day. */
function readAt(d: number): Record<string, string> {
  const lifts = Object.fromEntries(LIFTS.map((l) => [l, sessionAt(l, d).e1rm.toFixed(1)]));
  return {
    when: `Week ${weekOf(d)}, day ${dayOfWeek(d)}`,
    scale: scaleAt(d).toFixed(1),
    trend: SEASON.trend[d].toFixed(1),
    rate: signed(SEASON.kgPerWeek[d]),
    total: totalAt(d).toFixed(1),
    sets: setsThisWeek(d).toString(),
    avg4: avg4At(d).toFixed(1),
    kcal: thousands(SEASON.kcal[d]),
    protein: SEASON.protein[d].toString(),
    ...lifts,
  };
}
const END = readAt(L);

/** The widest text each live number can print, so its width is reserved and nothing shifts. */
const SIZER: Record<string, string> = {
  when: "Week 12, day 7",
  scale: "00.0",
  trend: "00.0",
  rate: `${MINUS}0.00`,
  total: "000.0",
  sets: "00",
  avg4: "00.0",
  kcal: "0,000",
  protein: "000",
  squat: "000.0",
  bench: "000.0",
  deadlift: "000.0",
};

function Live({ k }: { k: string }) {
  return (
    <span className={s.num}>
      <span className={s.sizer} aria-hidden="true">{SIZER[k]}</span>
      <span className={s.liveText} data-live={k}>{END[k]}</span>
    </span>
  );
}

/* ── the story, in words, from the same numbers ── */

const first = <T,>(a: T[]) => a[0];
const trendStart = SEASON.trend[0];
const trendEnd = SEASON.trend[L];
const goalDay = SEASON.trend.findIndex((t) => t <= GOAL_BAND[1]);
const avgRate = (SEASON.trend[CUT_START] - trendEnd) / ((L - CUT_START) / 7);
const records = SEASON.records.length;
const hardWeeks = SEASON.weeklySets.filter((_, w) => w + 1 !== DELOAD_WEEK);
const setsMin = Math.min(...hardWeeks);
const setsMax = Math.max(...hardWeeks);
const deloadSets = SEASON.weeklySets[DELOAD_WEEK - 1];
const hits = SEASON.proteinHit.filter(Boolean).length;
const liftSpan = (l: Lift) =>
  `${first(SEASON.sessions[l]).e1rm.toFixed(1)} to a best of ${Math.max(...SEASON.sessions[l].map((x) => x.e1rm)).toFixed(1)} kg`;
const bestBench = SEASON.records.filter((r) => r.lift === "bench").pop();

const ARIA: Record<TrackId, string> = {
  weight: `Bodyweight over twelve weeks: daily weigh-ins and the trend, which falls from ${trendStart.toFixed(1)} to ${trendEnd.toFixed(1)} kilograms and reaches the ${GOAL_BAND[0]} to ${GOAL_BAND[1]} kilogram goal band in week ${weekOf(goalDay)}.`,
  strength: `Estimated one rep max from each week's top set: squat ${liftSpan("squat")}, bench ${liftSpan("bench")}, deadlift ${liftSpan("deadlift")}, with ${records} records and a dip in the week ${DELOAD_WEEK} deload.`,
  work: `Hard sets a week, ${setsMin} to ${setsMax}, with ${deloadSets} in the week ${DELOAD_WEEK} deload, and the four week average as a line.`,
  fuel: `Daily calories against the target, ${thousands(KCAL_MAINTENANCE)} in week 1 and ${thousands(KCAL_TARGET)} from the cut, higher at weekends, with protein hit on ${hits} of ${DAYS} days.`,
};

const STORY =
  `Twelve weeks of one simulated log, drawn with the app's own maths. ` +
  `Bodyweight: week 1 at maintenance, then a cut from day ${CUT_START + 1}. The trend falls from ${trendStart.toFixed(1)} to ${trendEnd.toFixed(1)} kg, ` +
  `${(trendStart - trendEnd).toFixed(1)} kg in all, about ${avgRate.toFixed(2)} kg a week, and reaches the goal band in week ${weekOf(goalDay)}. ` +
  `Strength, as the estimated one rep max of each week's top set: squat ${liftSpan("squat")}, bench ${liftSpan("bench")}` +
  (bestBench ? ` (${bestBench.weight} kg for ${bestBench.reps} in week ${weekOf(bestBench.day)})` : "") +
  `, deadlift ${liftSpan("deadlift")}; ${records} records, and a deload in week ${DELOAD_WEEK}. ` +
  `The total goes from ${totalAt(0).toFixed(1)} to ${totalAt(L).toFixed(1)} kg. ` +
  `Work: ${setsMin} to ${setsMax} hard sets a week, ${deloadSets} in the deload. ` +
  `Fuel: a ${thousands(KCAL_TARGET)} kcal target from the cut, weekends higher, and protein of ${PROTEIN_HIT} g or more (the target is ${PROTEIN_TARGET} g) on ${hits} of ${DAYS} days.`;

/** The scrub only runs where it can breathe; this exact query also gates the tall track in the CSS. */
const MOTION = "(prefers-reduced-motion: no-preference) and (min-height: 521px)";

/** Writes into the text node React rendered, so React's own node stays the one in the DOM. */
function setText(el: HTMLElement, value: string) {
  const node = el.firstChild;
  if (node && node.nodeType === Node.TEXT_NODE) node.nodeValue = value;
  else el.textContent = value;
}

const translate = (x: number, y: number) => `translate(${x.toFixed(2)} ${y.toFixed(2)})`;

/* ── small pieces of markup ── */

function Grid({ id }: { id: TrackId }) {
  return (
    <>
      {TRACKS[id].grid.map((g) => (
        <line key={g.v} className={s.grid} x1="0" x2="100%" y1={pctY(id, g.v)} y2={pctY(id, g.v)} />
      ))}
    </>
  );
}

function Labels({ id }: { id: TrackId }) {
  return (
    <div className={s.labels} aria-hidden="true">
      {TRACKS[id].grid.map((g) => (
        <span key={g.v} className={s.label} style={{ top: pctY(id, g.v) }}>
          {g.label}
        </span>
      ))}
    </div>
  );
}

function Notes({ id }: { id: TrackId }) {
  return (
    <>
      {ANNOTATIONS.filter((a) => a.track === id).map((a) => (
        <span
          key={a.id}
          data-ann={a.day}
          className={`${s.ann} ${a.anchor === "end" ? s.annEnd : ""} ${id === "strength" ? s.annRecord : ""}`}
          style={{ left: pct(a.x), top: pct(a.top) }}
          aria-hidden="true"
        >
          {a.text}
        </span>
      ))}
    </>
  );
}

/**
 * THE ARC (story beat 2): day 1 to week 12, as the instrument the app keeps. One simulated season
 * (arc/season.ts, the app's own trend and e1RM maths) drawn as four tracks on one time axis:
 * bodyweight, strength, work and fuel. A tall track holds a sticky stage while the scroll moves a
 * playhead through the 84 days: every line draws exactly to it, each track lights its value there,
 * annotations arrive on their day and the readout reads it, while the statue behind sharpens.
 * Every frame writes to attributes, text nodes and CSS variables, never React state. The server
 * render is the finished season, which is also what reduced motion and no-JS see.
 */
export function Arc() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const statueRef = useRef<HTMLDivElement>(null);
  const tracksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const statue = statueRef.current;
    const tracksEl = tracksRef.current;
    if (!root || !track || !statue || !tracksEl) return;

    const svg = {} as Record<TrackId, SVGSVGElement>;
    root.querySelectorAll<SVGSVGElement>("svg[data-track]").forEach((el) => {
      svg[el.dataset.track as TrackId] = el;
    });
    const el = (id: TrackId, name: string) => svg[id]?.querySelector<SVGPathElement>(`[data-el="${name}"]`) ?? null;
    const trendEl = el("weight", "trend");
    const dotsEl = el("weight", "dots");
    const litWeight = el("weight", "lit");
    const liftEls = LIFTS.map((l) => el("strength", `line-${l}`));
    const liftLits = LIFTS.map((l) => el("strength", `lit-${l}`));
    const recordsEl = el("strength", "records");
    const doneEl = el("work", "done");
    const currentEl = el("work", "current");
    const avgEl = el("work", "avg");
    const litWork = el("work", "lit");
    const kcalEl = el("fuel", "kcal");
    const proteinEl = el("fuel", "protein");
    const bandEl = el("fuel", "band");
    const litFuel = el("fuel", "lit");
    const parts = [trendEl, dotsEl, litWeight, ...liftEls, ...liftLits, recordsEl, doneEl, currentEl, avgEl, litWork, kcalEl, proteinEl, bandEl, litFuel];
    if (TRACK_IDS.some((id) => !svg[id]) || parts.some((p) => !p)) return;
    const need = <T,>(v: T | null) => v as T;

    const texts = new Map<string, HTMLElement[]>();
    root.querySelectorAll<HTMLElement>("[data-live]").forEach((node) => {
      const k = node.dataset.live ?? "";
      texts.set(k, [...(texts.get(k) ?? []), node]);
    });
    const printed = new Map<string, string>();
    const notes = Array.from(root.querySelectorAll<HTMLElement>("[data-ann]")).map((node) => ({ node, day: Number(node.dataset.ann) }));
    const swatches = Array.from(root.querySelectorAll<HTMLElement>("[data-lift]"));

    const geo: Geo = { ...SSR_GEO };
    const size = Object.fromEntries(TRACK_IDS.map((id) => [id, nominal(id)])) as Record<TrackId, { w: number; h: number }>;
    let live = false;
    let current = L;
    let lastDay = -1;

    /** The lines that draw to the playhead, each with its track and its current geometry. */
    const lines = (): [SVGPathElement, Poly, TrackId][] => [
      [need(trendEl), geo.weight.trend, "weight"],
      ...LIFTS.map((l, i): [SVGPathElement, Poly, TrackId] => [need(liftEls[i]), geo.strength.lines[l], "strength"]),
      [need(avgEl), geo.work.avg, "work"],
      [need(kcalEl), geo.fuel.kcal, "fuel"],
    ];
    // one dash the line's length, then a longer gap: an offset past the start hides even the cap
    const dash = () => {
      for (const [path, p] of lines()) path.style.strokeDasharray = `${p.total.toFixed(2)} ${(p.total + 10).toFixed(2)}`;
    };

    /** Redraws a track at its measured pixel size (1 viewBox unit = 1 px, so strokes stay 2 px). */
    const measure = (id: TrackId): boolean => {
      const node = svg[id];
      const w = node.clientWidth;
      const h = node.clientHeight;
      if (!w || !h || (w === size[id].w && h === size[id].h)) return false;
      size[id] = { w, h };
      node.setAttribute("viewBox", `0 0 ${w} ${h}`);
      if (id === "weight") {
        geo.weight = weightGeo(w, h);
        need(trendEl).setAttribute("d", geo.weight.trend.d);
      } else if (id === "strength") {
        geo.strength = strengthGeo(w, h);
        LIFTS.forEach((l, i) => need(liftEls[i]).setAttribute("d", geo.strength.lines[l].d));
      } else if (id === "work") {
        geo.work = workGeo(w, h);
        need(avgEl).setAttribute("d", geo.work.avg.d);
      } else {
        geo.fuel = fuelGeo(w, h);
        need(kcalEl).setAttribute("d", geo.fuel.kcal.d);
        need(bandEl).setAttribute("d", geo.fuel.band);
      }
      return true;
    };

    const render = (t: number) => {
      current = t;
      const d = Math.min(L, Math.max(0, Math.floor(t + 1e-6)));
      const f = fx(t);

      if (live) {
        for (const [path, p, id] of lines()) {
          const len = lenAtX(p, f * size[id].w);
          path.style.strokeDashoffset = (len > 0.01 ? p.total - len : p.total + 4).toFixed(2);
        }
        tracksEl.style.setProperty("--t", (t / L).toFixed(4));
        statue.style.setProperty("--p", (t / L).toFixed(3));
      }

      // each track's value at the playhead, lit on its line
      const xw = f * size.weight.w;
      need(litWeight).setAttribute("transform", translate(xw, yAtX(geo.weight.trend, xw)));
      const xs = f * size.strength.w;
      LIFTS.forEach((l, i) => need(liftLits[i]).setAttribute("transform", translate(xs, yAtX(geo.strength.lines[l], xs))));
      const xf = f * size.fuel.w;
      need(litFuel).setAttribute("transform", translate(xf, yAtX(geo.fuel.kcal, xf)));

      if (d === lastDay) return;
      lastDay = d;

      need(dotsEl).setAttribute("d", geo.weight.dots[d]);
      need(recordsEl).setAttribute("d", geo.strength.records[d]);
      need(doneEl).setAttribute("d", geo.work.done[d]);
      need(currentEl).setAttribute("d", geo.work.current[d]);
      const top = geo.work.top[d];
      need(litWork).setAttribute("transform", translate(top.x, top.y));
      need(proteinEl).setAttribute("d", geo.fuel.protein[d]);

      const lit = litLiftAt(d);
      LIFTS.forEach((l, i) => {
        need(liftEls[i]).classList.toggle(s.lit, l === lit);
        need(liftLits[i]).classList.toggle(s.lit, l === lit);
      });
      for (const sw of swatches) sw.classList.toggle(s.lit, sw.dataset.lift === lit);
      for (const n of notes) n.node.classList.toggle(s.annOff, d < n.day);

      const values = readAt(d);
      for (const [k, nodes] of texts) {
        const v = values[k];
        if (v === undefined || printed.get(k) === v) continue;
        printed.set(k, v);
        for (const node of nodes) setText(node, v);
      }
    };

    const relayout = () => {
      let changed = false;
      for (const id of TRACK_IDS) if (measure(id)) changed = true;
      if (!changed) return;
      if (live) dash();
      lastDay = -1;
      render(current);
    };
    relayout();
    const ro = new ResizeObserver(relayout);
    for (const id of TRACK_IDS) ro.observe(svg[id]);

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia(root);

    mm.add(MOTION, () => {
      live = true;
      root.classList.add(s.live);
      dash();
      lastDay = -1;
      render(0);

      // a short hold on day 1 and on the last day; time scrubs in between
      const toDay = (p: number) => Math.min(1, Math.max(0, (p - 0.04) / 0.9)) * L;
      const proxy = { p: 0 };
      gsap.to(proxy, {
        p: 1,
        ease: "none",
        scrollTrigger: { trigger: track, start: "top top", end: "bottom bottom", scrub: 0.5 },
        onUpdate: () => render(toDay(proxy.p)),
      });

      return () => {
        live = false;
        root.classList.remove(s.live);
        for (const [path] of lines()) {
          path.style.removeProperty("stroke-dasharray");
          path.style.removeProperty("stroke-dashoffset");
        }
        tracksEl.style.removeProperty("--t");
        statue.style.removeProperty("--p");
        lastDay = -1;
        render(L);
      };
    });

    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });

    return () => {
      alive = false;
      ro.disconnect();
      mm.revert();
    };
  }, []);

  const g = SSR_GEO;
  const endX = (id: TrackId) => nominal(id).w;
  const litEnd = litLiftAt(L);
  const workTop = g.work.top[L];

  return (
    <section className={s.arc} id="arc" ref={rootRef} aria-labelledby="arc-title">
      <div className={s.track} ref={trackRef}>
        <div className={s.stage}>
          <div className={s.statue} ref={statueRef} aria-hidden="true">
            <Image
              src="/statue-atlas-cut.png"
              alt=""
              width={580}
              height={950}
              sizes="(min-width: 900px) 520px, 78vw"
              className={s.statueImg}
            />
          </div>

          <div className={s.copy}>
            <div className={s.words}>
              <p className={s.eyebrow}>The arc</p>
              <h2 className={s.title} id="arc-title">Day 1 to week 12.</h2>
              <p className={s.sub}>
                Log it every day and twelve weeks become one instrument: the scale drifting down, the bar going up, the work and the food that did it.
              </p>
            </div>

            <div className={s.readout}>
              <p className={s.when}>
                <Live k="when" />
              </p>
              <dl className={s.cells}>
                <div className={s.cell}>
                  <dt>Scale<span className={s.more}>, this morning</span></dt>
                  <dd><Live k="scale" /><span className={s.unit}>kg</span></dd>
                </div>
                <div className={s.cell}>
                  <dt>Trend<span className={s.more}>, the true weight</span></dt>
                  <dd><Live k="trend" /><span className={s.unit}>kg</span></dd>
                </div>
                <div className={s.cell}>
                  <dt>Total<span className={s.more}>, S + B + D e1RM</span></dt>
                  <dd><Live k="total" /><span className={s.unit}>kg</span></dd>
                </div>
                <div className={s.cell}>
                  <dt>Sets<span className={s.more}>, hard, this week</span></dt>
                  <dd><Live k="sets" /></dd>
                </div>
                <div className={s.cell}>
                  <dt>Kcal<span className={s.more}>, today</span></dt>
                  <dd><Live k="kcal" /></dd>
                </div>
              </dl>
            </div>
          </div>

          <figure className={s.figure}>
            <div className={s.tracks} ref={tracksRef}>
              {/* bodyweight */}
              <div className={`${s.row} ${s.rowWeight}`}>
                <div className={s.head}>
                  <p className={s.name}>Bodyweight <span className={s.unitName}>kg</span></p>
                  <p className={s.vals}>
                    <span className={s.valName}>trend</span> <Live k="trend" />
                    <span className={s.sep} aria-hidden="true" />
                    <Live k="rate" /> <span className={s.valName}>kg/wk</span>
                  </p>
                </div>
                <div className={s.body}>
                  <div className={s.plot}>
                    <span className={s.playhead} aria-hidden="true" />
                    <svg
                      className={s.svg}
                      data-track="weight"
                      viewBox={`0 0 ${NOMINAL_W} ${TRACKS.weight.nominalH}`}
                      preserveAspectRatio="none"
                      role="img"
                      aria-label={ARIA.weight}
                    >
                      <rect className={s.band} x="0" width="100%" y={pct(GOAL.top)} height={pct(GOAL.bottom - GOAL.top)} />
                      <Grid id="weight" />
                      <path data-el="dots" className={s.weighIns} d={g.weight.dots[L]} />
                      <path data-el="trend" className={`${s.line} ${s.trend}`} d={g.weight.trend.d} />
                      <path
                        data-el="lit"
                        className={`${s.mark} ${s.markWeight}`}
                        d="M0 0h0.01"
                        transform={translate(endX("weight"), g.weight.trend.ys[L])}
                      />
                    </svg>
                    <Notes id="weight" />
                  </div>
                  <Labels id="weight" />
                </div>
              </div>

              {/* strength */}
              <div className={`${s.row} ${s.rowStrength}`}>
                <div className={s.head}>
                  <p className={s.name}>Strength <span className={s.unitName}>e1RM kg</span></p>
                  <p className={s.vals}>
                    {LIFTS.map((l) => (
                      <span key={l} className={`${s.liftVal} ${s[`sw_${l}`]} ${l === litEnd ? s.lit : ""}`} data-lift={l}>
                        <span className={s.swatch} aria-hidden="true" />
                        <span className={s.valName} title={LIFT_NAME[l]}>{LETTER[l]}</span> <Live k={l} />
                      </span>
                    ))}
                  </p>
                </div>
                <div className={s.body}>
                  <div className={s.plot}>
                    <span className={s.playhead} aria-hidden="true" />
                    <svg
                      className={s.svg}
                      data-track="strength"
                      viewBox={`0 0 ${NOMINAL_W} ${TRACKS.strength.nominalH}`}
                      preserveAspectRatio="none"
                      role="img"
                      aria-label={ARIA.strength}
                    >
                      <Grid id="strength" />
                      {LIFTS.map((l) => (
                        <path
                          key={l}
                          data-el={`line-${l}`}
                          className={`${s.line} ${s.liftLine} ${s[`lift_${l}`]} ${l === litEnd ? s.lit : ""}`}
                          d={g.strength.lines[l].d}
                        />
                      ))}
                      <path data-el="records" className={s.records} d={g.strength.records[L]} />
                      {LIFTS.map((l) => (
                        <path
                          key={l}
                          data-el={`lit-${l}`}
                          className={`${s.mark} ${s.markLift} ${s[`lift_${l}`]} ${l === litEnd ? s.lit : ""}`}
                          d="M0 0h0.01"
                          transform={translate(endX("strength"), g.strength.lines[l].ys[L])}
                        />
                      ))}
                    </svg>
                    <Notes id="strength" />
                  </div>
                  <Labels id="strength" />
                </div>
              </div>

              {/* work */}
              <div className={`${s.row} ${s.rowWork}`}>
                <div className={s.head}>
                  <p className={s.name}>Work <span className={s.unitName}>hard sets a week</span></p>
                  <p className={s.vals}>
                    <Live k="sets" /> <span className={s.valName}>this week</span>
                    <span className={s.sep} aria-hidden="true" />
                    <span className={s.valName}>4-wk avg</span> <Live k="avg4" />
                  </p>
                </div>
                <div className={s.body}>
                  <div className={s.plot}>
                    <span className={s.playhead} aria-hidden="true" />
                    <svg
                      className={s.svg}
                      data-track="work"
                      viewBox={`0 0 ${NOMINAL_W} ${TRACKS.work.nominalH}`}
                      preserveAspectRatio="none"
                      role="img"
                      aria-label={ARIA.work}
                    >
                      <Grid id="work" />
                      <path data-el="done" className={s.columns} d={g.work.done[L]} />
                      <path data-el="current" className={s.columnNow} d={g.work.current[L]} />
                      <path data-el="avg" className={`${s.line} ${s.avg}`} d={g.work.avg.d} />
                      <path
                        data-el="lit"
                        className={`${s.mark} ${s.markWork}`}
                        d="M0 0h0.01"
                        transform={translate(workTop.x, workTop.y)}
                      />
                    </svg>
                    <Notes id="work" />
                  </div>
                  <Labels id="work" />
                </div>
              </div>

              {/* fuel */}
              <div className={`${s.row} ${s.rowFuel}`}>
                <div className={s.head}>
                  <p className={s.name}>Fuel <span className={s.unitName}>kcal</span></p>
                  <p className={s.vals}>
                    <Live k="kcal" /> <span className={s.valName}>today</span>
                    <span className={s.sep} aria-hidden="true" />
                    <span className={s.valName}>protein</span> <Live k="protein" /> <span className={s.valName}>g</span>
                  </p>
                </div>
                <div className={s.body}>
                  <div className={s.plot}>
                    <span className={s.playhead} aria-hidden="true" />
                    <svg
                      className={s.svg}
                      data-track="fuel"
                      viewBox={`0 0 ${NOMINAL_W} ${TRACKS.fuel.nominalH}`}
                      preserveAspectRatio="none"
                      role="img"
                      aria-label={ARIA.fuel}
                    >
                      <path data-el="band" className={s.band} d={g.fuel.band} />
                      <Grid id="fuel" />
                      <path data-el="kcal" className={`${s.line} ${s.kcal}`} d={g.fuel.kcal.d} />
                      <path data-el="protein" className={s.protein} d={g.fuel.protein[L]} />
                      <path
                        data-el="lit"
                        className={`${s.mark} ${s.markFuel}`}
                        d="M0 0h0.01"
                        transform={translate(endX("fuel"), g.fuel.kcal.ys[L])}
                      />
                    </svg>
                  </div>
                  <Labels id="fuel" />
                </div>
              </div>

              <div className={s.axis} aria-hidden="true">
                <div className={s.axisWeeks}>
                  {Array.from({ length: WEEKS }, (_, w) => (
                    <span key={w} className={s.tick} style={{ left: pct(fx(w * 7 + 3)) }}>
                      {w + 1}
                    </span>
                  ))}
                </div>
                <span className={s.axisUnit}>week</span>
              </div>
            </div>
          </figure>

          <p className="sr-only">{STORY}</p>
        </div>
      </div>
    </section>
  );
}
