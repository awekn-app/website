"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Room, roomStyles as r, useReducedMotion, useRoomLive } from "./Room";
import s from "./RoomFuel.module.css";

/**
 * Fuel: tap real foods and the day fills in. The ring (the one ember status in this room) closes
 * on 2,400 kcal, three silver bars fill toward 160 P / 260 C / 70 F, and the last four foods sit
 * in a list with their own remove, so a mis-tap is one tap to undo. Breakfast is pre-logged so
 * the ring is never empty at first sight.
 *
 * Every number is the app's own: per-100 g values from assets/food/awekn-foods.db (the shipped
 * food database), scaled to a real serving the way components/food/ServingSelector.tsx does it
 * (kcal rounded to a whole number, macros to 0.1 g).
 */

const GOAL = { kcal: 2400, p: 160, c: 260, f: 70 };
const MAX_ENTRIES = 40;

/** per 100 g, as stored in the app's database: kcal, protein, carbs, fat */
type Per100 = readonly [number, number, number, number];
type Part = { per100: Per100; grams: number };
type Food = { id: string; name: string; serving: string; kcal: number; p: number; c: number; f: number };

/** ServingSelector's scaling: kcal to a whole number, macros to 0.1 g, then parts summed. */
function food(id: string, name: string, serving: string, parts: Part[]): Food {
  let kcal = 0, p = 0, c = 0, f = 0;
  for (const { per100, grams } of parts) {
    const k = grams / 100;
    kcal += Math.round(per100[0] * k);
    p += Math.round(per100[1] * k * 10) / 10;
    c += Math.round(per100[2] * k * 10) / 10;
    f += Math.round(per100[3] * k * 10) / 10;
  }
  return { id, name, serving, kcal, p, c, f };
}

// rows in assets/food/awekn-foods.db (id: name, per 100 g)
const TOOR_DAL: Per100 = [85, 5.0, 11.0, 2.5]; //          100011632 Dal (toor), cooked
const RICE: Per100 = [131, 2.8, 31.1, 0.4]; //              100008770 Rice, white, cooked
const PANEER_TIKKA: Per100 = [93.8, 5.1, 8.0, 4.5]; //      100000354 Paneer shaslik/tikka (INDB)
const OATS: Per100 = [379, 13.2, 67.7, 6.5]; //             100004119 Oats, rolled (dry)
const WHEY: Per100 = [387.1, 77.4, 9.7, 3.2]; //            100011613 Gold Standard 100% Whey
const CHICKEN: Per100 = [148, 32.0, 0.0, 2.2]; //           100007112 Chicken breast, grilled (skinless)
const BANANA: Per100 = [97, 0.7, 22.7, 0.3]; //             100004854 Banana
const EGG_BOILED: Per100 = [143, 12.4, 1.0, 10.0]; //       100002784 Egg, boiled

const FOODS: Food[] = [
  food("oats", "Oats with whey", "40 g oats, 1 scoop", [{ per100: OATS, grams: 40 }, { per100: WHEY, grams: 31 }]),
  food("dal", "Dal and rice", "1 katori each", [{ per100: TOOR_DAL, grams: 150 }, { per100: RICE, grams: 150 }]),
  food("paneer", "Paneer tikka", "1 plate", [{ per100: PANEER_TIKKA, grams: 439 }]),
  food("chicken", "Chicken breast", "200 g, grilled", [{ per100: CHICKEN, grams: 200 }]),
  food("eggs", "Eggs", "2 boiled", [{ per100: EGG_BOILED, grams: 100 }]),
  food("banana", "Banana", "1 medium", [{ per100: BANANA, grams: 118 }]),
];
const BY_ID = new Map(FOODS.map((x) => [x.id, x]));

type Entry = { id: number; food: string };
type Float = { id: number; food: string; kcal: number };
/** breakfast already logged */
const SEED: Entry[] = [{ id: 0, food: "oats" }];

const R = 56;
const C = 2 * Math.PI * R;
const fmt = (v: number) => Math.abs(Math.round(v)).toLocaleString("en-US");

export function RoomFuel() {
  const [eaten, setEaten] = useState<Entry[]>(SEED);
  const [floats, setFloats] = useState<Float[]>([]);
  const nextId = useRef(1);
  const listRef = useRef<HTMLUListElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);

  const foods = eaten.map((e) => BY_ID.get(e.food)!);
  const sum = (k: "kcal" | "p" | "c" | "f") => foods.reduce((a, x) => a + x[k], 0);
  const kcal = sum("kcal");
  const remaining = GOAL.kcal - kcal;
  const over = remaining < 0;
  const frac = Math.min(1, kcal / GOAL.kcal);
  const full = frac >= 1;

  const macros = [
    { name: "Protein", v: sum("p"), goal: GOAL.p },
    { name: "Carbs", v: sum("c"), goal: GOAL.c },
    { name: "Fat", v: sum("f"), goal: GOAL.f },
  ];

  const status =
    kcal === 0
      ? "Nothing eaten yet. Tap a food."
      : over
        ? `Over by ${fmt(-remaining)} kcal. One day is noise, the week is what counts.`
        : remaining === 0
          ? "Right on 2,400 kcal."
          : `${fmt(kcal)} of 2,400 kcal eaten, ${Math.round(sum("p"))} g protein.`;

  function add(f: Food) {
    if (eaten.length >= MAX_ENTRIES) return;
    const id = nextId.current++;
    setEaten((e) => [...e, { id, food: f.id }]);
    setFloats((fl) => [...fl, { id, food: f.id, kcal: f.kcal }]);
  }
  function remove(id: number) {
    refocus.current = true;
    setEaten((e) => e.filter((x) => x.id !== id));
  }
  function reset() {
    setEaten([]);
    setFloats([]);
  }

  // a removed row takes its button with it: hand focus to the next remove, else the first food
  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    const next = listRef.current?.querySelector<HTMLButtonElement>("button") ?? chipsRef.current?.querySelector<HTMLButtonElement>("button");
    next?.focus();
  }, [eaten]);

  const recent = eaten.slice(-4).reverse();
  const earlier = eaten.length - recent.length;

  return (
    <Room
      id="fuel"
      index="03"
      name="Fuel"
      title="Eat like you train."
      sub="13,000 foods, dal to protein oats. Tap what you ate."
      note="Real foods from the app's database."
      onReset={reset}
    >
      <div className={r.card}>
        <div className={s.top}>
          <div className={s.ring}>
            <svg viewBox="0 0 132 132" width="132" height="132" role="img" aria-label={`${kcal} of ${GOAL.kcal} kcal eaten`}>
              <circle className={s.track} cx="66" cy="66" r={R} fill="none" strokeWidth="10" />
              <circle
                className={`${s.arc} ${full ? s.arcFull : ""}`}
                cx="66"
                cy="66"
                r={R}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={C.toFixed(2)}
                strokeDashoffset={(C * (1 - frac)).toFixed(2)}
                transform="rotate(-90 66 66)"
                style={{ opacity: kcal > 0 ? 1 : 0 }}
              />
            </svg>
            <div className={s.center} aria-hidden="true">
              <CountUp value={remaining} className={s.big} />
              <span className={s.unit}>{over ? "kcal over" : "kcal left"}</span>
            </div>
          </div>
          <div className={s.macros}>
            {macros.map((m) => (
              <div key={m.name} className={s.macro}>
                <div className={s.macroHead}>
                  <span className={s.macroName}>{m.name}</span>
                  <span className={s.macroVal}>
                    {Math.round(m.v)} / {m.goal} g
                  </span>
                </div>
                <div
                  className={s.bar}
                  role="meter"
                  aria-label={m.name}
                  aria-valuemin={0}
                  aria-valuemax={m.goal}
                  aria-valuenow={Math.min(m.goal, Math.round(m.v))}
                  aria-valuetext={`${Math.round(m.v)} of ${m.goal} g`}
                >
                  <div className={s.fill} style={{ transform: `scaleX(${Math.min(1, m.v / m.goal)})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className={s.status} role="status" aria-live="polite">
          {status}
        </p>
      </div>

      <div className={s.add}>
        <span className={s.label} id="fuel-add">
          Tap to add
        </span>
        <div className={s.chips} ref={chipsRef} role="group" aria-labelledby="fuel-add">
          {FOODS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`${r.chip} ${r.press} ${s.chip}`}
              onClick={() => add(f)}
              disabled={eaten.length >= MAX_ENTRIES}
              aria-label={`Add ${f.name.toLowerCase()}, ${f.serving}, ${f.kcal} kcal`}
            >
              {f.name}
              <span className={s.chipKcal}>{f.kcal}</span>
              {floats
                .filter((x) => x.food === f.id)
                .map((x) => (
                  <span
                    key={x.id}
                    className={s.float}
                    aria-hidden="true"
                    onAnimationEnd={() => setFloats((fl) => fl.filter((y) => y.id !== x.id))}
                  >
                    +{x.kcal}
                  </span>
                ))}
            </button>
          ))}
        </div>
      </div>

      <div className={s.day}>
        {recent.length === 0 ? (
          <p className={s.empty}>An empty day. Tap a food to log it.</p>
        ) : (
          <ul className={s.list} ref={listRef} aria-label="Eaten today, latest first">
            {recent.map((e) => {
              const f = BY_ID.get(e.food)!;
              return (
                <li key={e.id} className={s.row}>
                  <span className={s.rowName}>
                    {f.name}
                    <span className={s.rowServing}>{f.serving}</span>
                  </span>
                  <span className={s.rowKcal}>{f.kcal} kcal</span>
                  <button type="button" className={`${s.remove} ${r.press}`} onClick={() => remove(e.id)} aria-label={`Remove ${f.name.toLowerCase()}`}>
                    <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {earlier > 0 && <p className={s.more}>{earlier === 1 ? "1 earlier today" : `${earlier} earlier today`}</p>}
      </div>
    </Room>
  );
}

/**
 * A number that counts to its new value (ease-out, about half a second) in tabular figures. The
 * text is written straight to the node each frame, so the room never re-renders mid-count; off
 * screen or with reduced motion it lands instantly.
 */
function CountUp({ value, className }: { value: number; className?: string }) {
  const live = useRoomLive("fuel");
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [first] = useState(() => fmt(value));
  const shown = useRef(value);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const from = shown.current;
    const to = value;
    if (reduced || !live || from === to) {
      shown.current = to;
      el.textContent = fmt(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 520);
      shown.current = from + (to - from) * (1 - Math.pow(1 - k, 3));
      el.textContent = fmt(shown.current);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, live, reduced]);

  return (
    <span ref={ref} className={className}>
      {first}
    </span>
  );
}
