import Image from "next/image";
import type { CSSProperties } from "react";
import s from "./Phone.module.css";

/**
 * An iPhone 17 Pro, drawn in CSS around a REAL screen of the app (public/app/*.webp: captured from
 * the app itself in the iOS Simulator at 3x, docs/SHOWCASE_POLISH_PLAN_2026-09-28.md). No device
 * photo: a brushed-titanium rim, the black bezel, the Dynamic Island, a glass glare, and the light
 * the screen throws on what is behind it. Every size is relative to the phone's own width (container
 * units), so one component is right at 160 px and at 420 px. Static: nothing here animates.
 */
export type Screen =
  | "home" | "workout" | "active" | "session" | "deadlift" | "squat" | "muscles" | "weight" | "weight-chart"
  | "calories" | "food" | "cardio" | "journal" | "supplements" | "consistency" | "records";

export const SCREEN_ALT: Record<Screen, string> = {
  home: "The awekn Home screen: today's Pull A session, 8,412 steps, 1,661 kcal, supplements and the last session",
  workout: "The Workout tab: the Push Pull Legs split and today's Push A, ready to start",
  active: "Logging a bench press session: warm-ups and working sets ticked green, the rest timer running",
  session: "A Pull A session read back: 6,596 kg of volume, every set against its estimated max, a deadlift record",
  deadlift: "Deadlift analytics: an estimated 1RM of 220 kg, the staircase of bests and the sessions between",
  squat: "Squat analytics: an estimated 1RM of 172.5 kg and its climb over three months",
  muscles: "The muscle map: 424 hard sets in September, back leading the month",
  weight: "The bodyweight tracker: a 79.6 kg trend, down 3.5 kg in three months",
  "weight-chart": "The bodyweight trend chart: weigh-ins around a smooth trend falling toward a 76 kg goal",
  calories: "The calories tracker: 1,661 of 2,400 kcal, 131 g of protein",
  food: "Food intelligence: the most eaten foods over 30 days",
  cardio: "The cardio tracker: 80 of 150 minutes this week, daily steps as bars",
  journal: "The tracker wall: the journal's field of days and this week's muscles",
  supplements: "The supplements tracker: creatine and whey taken, vitamin D3 next",
  consistency: "Consistency: all six habits on track, with streaks",
  records: "Personal records: a new deadlift estimated 1RM and records by month",
};

type Props = {
  screen: Screen;
  /** a stack of screens that crossfade (opacity only); `screen` is then ignored for the image */
  screens?: readonly Screen[];
  /** the visible one of `screens` */
  active?: number;
  /** next/image sizes: the phone's rendered width at each breakpoint */
  sizes: string;
  priority?: boolean;
  /** the light the screen throws behind it */
  glow?: "heat" | "white" | "none";
  className?: string;
  style?: CSSProperties;
  /** decorative copies (the wall) are hidden from assistive tech */
  decorative?: boolean;
};

export function Phone({ screen, screens, active = 0, sizes, priority, glow = "none", className, style, decorative }: Props) {
  return (
    <figure
      className={`${s.phone} ${glow !== "none" ? s[glow] : ""} ${className ?? ""}`}
      style={style}
      aria-hidden={decorative || undefined}
    >
      <div className={s.rim}>
        <div className={s.bezel}>
          <div className={s.screen}>
            {screens ? (
              screens.map((sc, i) => (
                <Image
                  key={sc}
                  src={`/app/${sc}.webp`}
                  alt={i === active && !decorative ? SCREEN_ALT[sc] : ""}
                  aria-hidden={i !== active || undefined}
                  width={1206}
                  height={2622}
                  sizes={sizes}
                  quality={90}
                  className={`${s.img} ${s.layer} ${i === active ? s.on : ""}`}
                />
              ))
            ) : (
              <Image
                src={`/app/${screen}.webp`}
                alt={decorative ? "" : SCREEN_ALT[screen]}
                width={1206}
                height={2622}
                sizes={sizes}
                priority={priority}
                quality={90}
                className={s.img}
              />
            )}
            <span className={s.island} aria-hidden="true" />
            <span className={s.glare} aria-hidden="true" />
          </div>
        </div>
      </div>
    </figure>
  );
}
