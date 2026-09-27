import Image from "next/image";
import { StoreButton } from "./StoreButton";
import { HeroCarve } from "./HeroCarve";
import s from "./Hero.module.css";

/**
 * THE CARVER. The statue is the first thing painted (the LCP image, a plain <img> through
 * next/image with priority), rising out of the void in an ember light. The words sit on the dark
 * below it on a phone and beside it on a wide screen. Motion is CSS only here: the WebGL carve
 * (site/HeroCarve) is layered on top after the page is interactive, never blocking the paint.
 */
export function Hero() {
  return (
    <header className={s.hero} id="top">
      <nav className={s.nav} aria-label="Main">
        <a href="#top" className={s.wordmark} aria-label="Awekn, back to the top">awekn</a>
        <div className={s.links}>
          <a href="#try" className={s.link}>Try it</a>
          <a href="#everything" className={s.link}>Everything</a>
          <a href="#pricing" className={s.link}>Pricing</a>
          <a href="#download" className={s.cta}>Get the app</a>
        </div>
      </nav>

      <div className={s.stage}>
        <div className={s.glow} aria-hidden="true" />
        <div className={s.figure}>
          <Image
            src="/statue-atlas-cut.png"
            alt="Atlas, carved in stone"
            width={580}
            height={950}
            priority
            sizes="(min-width: 900px) 520px, 82vw"
            className={s.statue}
          />
          <HeroCarve />
        </div>
        <div className={s.fade} aria-hidden="true" />
      </div>

      <div className={s.copy}>
        <p className={s.eyebrow}>For people who lift</p>
        <h1 className={s.title}>
          <span className={s.line}>Carved,</span>
          <span className={s.line}>not given.</span>
        </h1>
        <p className={s.sub}>
          Every set, every meal, every weigh-in, in one place that shows you the shape you are making.
        </p>
        <div className={s.actions}>
          <StoreButton size="lg" />
          <p className={s.note}>Free to start. Pro is 7 days free.</p>
        </div>
      </div>

      <a href="#problem" className={s.cue} aria-label="Scroll to the story">
        <span>Scroll</span>
        <span className={s.cueLine} aria-hidden="true" />
      </a>
    </header>
  );
}
