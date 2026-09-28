"use client";

import { useEffect, useRef, useState } from "react";
import { Phone } from "./Phone";
import type { Screen } from "./Phone";
import s from "./AppTour.module.css";

/**
 * INSIDE THE APP (docs/SHOWCASE_POLISH_PLAN_2026-09-28.md): the real app, screen by screen, the gym
 * first (the founder: most people who come are gym people, not powerlifters). Every number on these
 * screens is one season of one lifter, consistent from screen to screen: the deadlift record on the
 * session is the one on the lift's chart.
 *
 * Wide screens: the words scroll, one phone stays (sticky) and crossfades to each step's screen as
 * the step reaches the middle (an IntersectionObserver sets the index; opacity only). Phones: a
 * native swipe row, one step per card with its own phone, no sticky tricks, nothing to glitch.
 */
type Step = { screen: Screen; kicker: string; title: string; body: string; facts: readonly string[] };

const STEPS: readonly Step[] = [
  {
    screen: "active",
    kicker: "Log",
    title: "Two taps a set.",
    body: "Last time's weight and reps are already filled in. Tick the set and it turns green, and the rest timer starts on its own.",
    facts: ["Warm-ups, drop sets, supersets", "Last time beside every set", "Works with no signal"],
  },
  {
    screen: "session",
    kicker: "Every session",
    title: "Read back like a coach would.",
    body: "Volume against last time, every set measured against its own best, and the record marked right where it happened.",
    facts: ["6,596 kg, 18 sets, 1h 6m", "Outlines show last time", "Records found for you"],
  },
  {
    screen: "deadlift",
    kicker: "Every lift",
    title: "Its own story, set by set.",
    body: "An estimated max from every set you log, the staircase of your bests, and the rep maxes still there to claim.",
    facts: ["Estimated 1RM from any set", "Rep maxes 1 to 10", "A typo never becomes a record"],
  },
  {
    screen: "muscles",
    kicker: "Muscles",
    title: "See what you actually trained.",
    body: "Hard sets per muscle for the week, the month or the year, against the 10 to 20 sets that grow a muscle.",
    facts: ["Front and back", "Most and least trained", "Custom exercises count too"],
  },
  {
    screen: "weight-chart",
    kicker: "Bodyweight",
    title: "Your real weight, not today's number.",
    body: "A trend drawn through the daily noise, your pace per week, and how far the goal really is.",
    facts: ["Trend, not scale noise", "Pace per week", "Goal and body fat"],
  },
  {
    screen: "calories",
    kicker: "Food",
    title: "Calories and protein, without the busywork.",
    body: "Your targets for the day, the foods you eat most one tap away, and a kitchen of 13,000 foods that knows dal and paneer.",
    facts: ["Protein first", "Your usual foods", "Indian staples built in"],
  },
  {
    screen: "cardio",
    kicker: "Cardio and steps",
    title: "The walking counts too.",
    body: "Minutes toward the 150 a week that keep you healthy, your steps as a week of bars, runs and walks with a GPS route.",
    facts: ["150 minutes a week", "Steps from Apple Health", "GPS runs and walks"],
  },
  {
    screen: "journal",
    kicker: "Consistency",
    title: "Every day you showed up.",
    body: "Training, food, water, supplements and steps, one field of heat. The streak forgives a light week and never a missing one.",
    facts: ["A year at a glance", "Habits and streaks", "One tap to any day"],
  },
];
const SCREENS = STEPS.map((st) => st.screen);

export function AppTour() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // only the wide layout reads the index (on a phone every card carries its own screen)
    const wide = window.matchMedia("(min-width: 900px)");
    let io: IntersectionObserver | null = null;
    const attach = () => {
      io?.disconnect();
      if (!wide.matches) return;
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
          }
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      list.querySelectorAll<HTMLElement>("[data-i]").forEach((el) => io!.observe(el));
    };
    attach();
    wide.addEventListener("change", attach);
    return () => {
      io?.disconnect();
      wide.removeEventListener("change", attach);
    };
  }, []);

  return (
    <section className={s.tour} id="inside" aria-labelledby="inside-title">
      <header className={s.head}>
        <p className={s.eyebrow}>Inside the app</p>
        <h2 className={`${s.title} display`} id="inside-title">
          <span className="chrome-type">Everything you lift, logged.</span>{" "}
          <span className={s.titleHeat}>Everything you log, read.</span>
        </h2>
        <p className={s.lede}>Real screens, straight from the app, filled with one lifter&apos;s sample season.</p>
      </header>

      <div className={s.grid}>
        <div className={s.stickyCol} aria-hidden="true">
          <div className={s.sticky}>
            <Phone screen={SCREENS[0]} screens={SCREENS} active={active} glow="heat" sizes="320px" className={s.bigPhone} decorative />
            <p className={s.counter}>
              <span className={s.counterNow}>{String(active + 1).padStart(2, "0")}</span> / {String(STEPS.length).padStart(2, "0")}
            </p>
          </div>
        </div>

        <ol className={s.steps} ref={listRef}>
          {STEPS.map((st, i) => (
            <li key={st.screen} className={`${s.step} ${i === active ? s.stepOn : ""}`} data-i={i}>
              <Phone screen={st.screen} sizes="(min-width: 900px) 1px, 70vw" glow="none" className={s.inlinePhone} />
              <div className={s.words}>
                <p className={s.kicker}>
                  <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                  {st.kicker}
                </p>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p className={s.body}>{st.body}</p>
                <ul className={s.facts}>
                  {st.facts.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <p className={s.swipe} aria-hidden="true">Swipe for more</p>
    </section>
  );
}
