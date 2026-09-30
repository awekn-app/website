import { StoreButton } from "./StoreButton";
import { LOGIN } from "../lib/links";
import { Forge } from "./Forge";
import { HeroTilt } from "./HeroStage";
import { WallBackdrop } from "./ShowcaseArt";
import type { Screen } from "./Phone";
import { Wordmark } from "./brand/Brand";
import s from "./Hero.module.css";

/** The opening wall: five columns on a wide screen, the first three on a phone. */
const HERO_COLUMNS: readonly (readonly Screen[])[] = [
  ["records", "calories", "weight", "supplements"],
  ["session", "home", "muscles", "journal"],
  ["active", "deadlift", "cardio", "food"],
  ["weight-chart", "workout", "consistency", "squat"],
  ["journal", "session", "calories", "home"],
];

/**
 * THE WALL, OPENING (the founder: "that video on the very top, and at the bottom as well, with the
 * words changed"). The real app, screen after screen, drifting on one tilted wall; the forged A
 * locking together over it, the line ("Every rep, on the record": logged, and chasing records),
 * the key. On a wide screen the wall leans toward the pointer; as the page scrolls away it sinks back into the dark (scroll-driven transform where the browser has
 * it). The words are the LCP (text, painted at once); the screens load behind them.
 */
export function Hero() {
  return (
    <header className={s.hero} id="top">
      <HeroTilt className={s.room}>
        <div className={s.depth}>
          <WallBackdrop columns={HERO_COLUMNS} className={s.wall} sizes="(min-width: 900px) 210px, 30vw" />
        </div>
      </HeroTilt>
      <div className={s.veil} aria-hidden="true" />

      <nav className={s.nav} aria-label="Main">
        <a href="#top" className={s.brand} aria-label="Awekn, back to the top">
          <Wordmark className={s.wordmark} />
        </a>
        <div className={s.links}>
          <a href="#inside" className={s.link}>The app</a>
          <a href="#try" className={s.link}>Try it</a>
          <a href="#everything" className={s.link}>Everything</a>
          <a href={LOGIN} className={s.login}>Log in</a>
          <a href="#download" className={s.cta}>Get the app</a>
        </div>
      </nav>

      <div className={s.front}>
        <div className={s.forge}>
          <Forge />
        </div>
        <p className={s.eyebrow}>
          <span className={s.rule} aria-hidden="true" />
          For people who lift
          <span className={`${s.rule} ${s.ruleEnd}`} aria-hidden="true" />
        </p>
        <h1 className={`${s.title} display`}>
          <span className={s.line}><span className="chrome-type">Every rep,</span></span>
          <span className={s.line}><span className="chrome-type">on the record.</span></span>
        </h1>
        <p className={s.sub}>
          The training log that reads your work back to you: your sets, meals, weigh-ins and records, in one place.
        </p>
        <div className={s.actions}>
          <StoreButton size="lg" />
          <a href="#inside" className={s.peek}>
            See inside the app
            <span className={s.peekArrow} aria-hidden="true" />
          </a>
        </div>
        <ul className={s.proof} aria-label="What you get">
          <li>13 trackers</li>
          <li>Works offline</li>
          <li>No ads, ever</li>
        </ul>
      </div>

      <a href="#problem" className={s.cue} aria-label="Scroll to the story">
        <span className={s.cueLine} aria-hidden="true" />
      </a>
    </header>
  );
}
