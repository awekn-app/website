import { StoreButton } from "./StoreButton";
import { Forge } from "./Forge";
import { Phone } from "./Phone";
import { HeroStage, Chip } from "./HeroStage";
import { Wordmark } from "./brand/Brand";
import s from "./Hero.module.css";

/**
 * THE FORGE, with the app in it (docs/SHOWCASE_POLISH_PLAN_2026-09-28.md). The chrome A locks
 * together and seats white-hot; the phone (the real Home screen) rises out of it; two live numbers
 * from that same screen float beside it. On a phone the words come first and the stage follows,
 * peeking from below them; on a wide screen, side by side. The phone's screen is the LCP image
 * (priority, painted at once: only its transform animates).
 */
export function Hero() {
  return (
    <header className={s.hero} id="top">
      <nav className={s.nav} aria-label="Main">
        <a href="#top" className={s.brand} aria-label="Awekn, back to the top">
          <Wordmark className={s.wordmark} />
        </a>
        <div className={s.links}>
          <a href="#inside" className={s.link}>The app</a>
          <a href="#try" className={s.link}>Try it</a>
          <a href="#pricing" className={s.link}>Pricing</a>
          <a href="#download" className={s.cta}>Get the app</a>
        </div>
      </nav>

      <div className={s.body}>
        <div className={s.copy}>
          <p className={s.eyebrow}>
            <span className={s.live} aria-hidden="true" />
            For people who lift
          </p>
          <h1 className={`${s.title} display`}>
            <span className={s.line}><span className="chrome-type">Carved,</span></span>
            <span className={s.line}><span className="chrome-type">not given.</span></span>
          </h1>
          <p className={s.sub}>
            Every set, every meal, every weigh-in, in one place that shows you the shape you are making.
          </p>
          <div className={s.actions}>
            <StoreButton size="lg" />
            <p className={s.note}>Free to start. Pro is 7 days free.</p>
          </div>
        </div>

        <HeroStage>
          <div className={s.forgeWrap}>
            <Forge />
          </div>
          <div className={s.phoneWrap}>
            <Phone screen="home" priority glow="heat" sizes="(min-width: 900px) 300px, 66vw" />
          </div>
          <Chip className={s.chipA} heat label="New record" value="180" unit="kg x 5" sub="Deadlift, this morning" />
          <Chip className={s.chipB} label="Trend weight" value="79.6" unit="kg" sub="Down 3.5 kg in 3 months" />
          <Chip className={s.chipC} label="Hard sets, September" value="424" unit="sets" sub="Back led the month" />
        </HeroStage>
      </div>

      <a href="#problem" className={s.cue} aria-label="Scroll to the story">
        <span>Scroll</span>
        <span className={s.cueLine} aria-hidden="true" />
      </a>
    </header>
  );
}
