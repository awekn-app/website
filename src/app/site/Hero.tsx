import { StoreButton } from "./StoreButton";
import { Forge } from "./Forge";
import { Wordmark } from "./brand/Brand";
import s from "./Hero.module.css";

/**
 * THE FORGE (docs/BRAND_REVAMP_PLAN_2026-09-28.md). The first thing on the page is the brand itself:
 * the A mark in chrome, its two pieces locking together under one light (site/Forge), the chrome
 * wordmark in the nav, and the line the whole product stands on. On a phone the mark sits above the
 * words; on a wide screen, beside them. The SVG is the first paint (no image to wait for).
 */
export function Hero() {
  return (
    <header className={s.hero} id="top">
      <nav className={s.nav} aria-label="Main">
        <a href="#top" className={s.brand} aria-label="Awekn, back to the top">
          <Wordmark className={s.wordmark} />
        </a>
        <div className={s.links}>
          <a href="#try" className={s.link}>Try it</a>
          <a href="#everything" className={s.link}>Everything</a>
          <a href="#pricing" className={s.link}>Pricing</a>
          <a href="#download" className={s.cta}>Get the app</a>
        </div>
      </nav>

      <div className={s.body}>
        <div className={s.stage}>
          <Forge />
        </div>

        <div className={s.copy}>
          <p className={s.eyebrow}>For people who lift</p>
          <h1 className={`${s.title} display`}>
            <span className={`${s.line} chrome-type`}>Carved,</span>
            <span className={`${s.line} chrome-type`}>not given.</span>
          </h1>
          <p className={s.sub}>
            Every set, every meal, every weigh-in, in one place that shows you the shape you are making.
          </p>
          <div className={s.actions}>
            <StoreButton size="lg" />
            <p className={s.note}>Free to start. Pro is 7 days free.</p>
          </div>
        </div>
      </div>

      <a href="#problem" className={s.cue} aria-label="Scroll to the story">
        <span>Scroll</span>
        <span className={s.cueLine} aria-hidden="true" />
      </a>
    </header>
  );
}
