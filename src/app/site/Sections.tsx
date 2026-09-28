import { StoreButton } from "./StoreButton";
import { SUPPORT_EMAIL, INSTAGRAM } from "../lib/links";
import { Mark, Wordmark } from "./brand/Brand";
import { Wall } from "./ShowcaseArt";
import s from "./Sections.module.css";

/** The rest of the trackers, told as a sequence (a card grid reads as a spec sheet). */
const EVERYTHING: { name: string; line: string }[] = [
  { name: "Supplements", line: "The stack, ticked off. A reminder that sounds like a person." },
  { name: "Regimen", line: "Every dose and every site, on its own schedule." },
  { name: "Splits", line: "Your week as a cycle, and the sets each muscle got." },
  { name: "Records", line: "Every rep max, found for you. A typo never becomes a record." },
  { name: "Cardio and steps", line: "GPS routes, and your minutes toward 150 a week." },
  { name: "Measurements", line: "The tape, check-in by check-in." },
  { name: "Photos", line: "Then and now, lined up by pose." },
  { name: "Notes", line: "A cue you write on a lift comes back the next time you train it." },
  { name: "The journal", line: "Every day you showed up, as a field of light." },
  { name: "Community", line: "People who lift. Workouts as posts, never ads." },
];

export function Everything() {
  return (
    <section className={s.section} id="everything" aria-labelledby="everything-title">
      <p className={s.eyebrow}>Everything else</p>
      <h2 className={`${s.title} chrome-type`} id="everything-title">Thirteen trackers. One habit.</h2>
      <ol className={s.list}>
        {EVERYTHING.map((e) => (
          <li key={e.name} className={s.item}>
            <span className={s.itemName}>{e.name}</span>
            <span className={s.itemLine}>{e.line}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Disciplines() {
  return (
    <section className={s.section} aria-labelledby="disciplines-title">
      <p className={s.eyebrow}>Two disciplines</p>
      <h2 className={`${s.title} chrome-type`} id="disciplines-title">Built for how you train.</h2>
      <div className={s.pair}>
        <article className={s.card}>
          <Mark tone="white" className={s.hallmark} />
          <h3 className={s.cardTitle}>Bodybuilding</h3>
          <p className={s.cardLine}>Splits as cycles, hard sets per muscle against the range that grows, the bodyweight trend and the photos that prove it.</p>
        </article>
        <article className={s.card}>
          <Mark tone="white" className={s.hallmark} />
          <h3 className={s.cardTitle}>Powerlifting</h3>
          <p className={s.cardLine}>RPE and e1RM from every set, a training block, attempt selection and meet day, DOTS and IPF points.</p>
        </article>
      </div>
    </section>
  );
}

const VOWS = [
  "No ads, and your data is never sold.",
  "It lives on your phone first and works with no signal. It syncs when you are back.",
  "Export it, or delete your account and everything with it, any time.",
] as const;

export function Vows() {
  return (
    <section className={s.section} aria-labelledby="vows-title">
      <p className={s.eyebrow}>Private by design</p>
      <h2 className={`${s.title} chrome-type`} id="vows-title">Your training is yours.</h2>
      <ul className={s.vows}>
        {VOWS.map((v) => (
          <li key={v}>
            <Mark tone="current" className={s.vowMark} />
            {v}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Pricing() {
  return (
    <section className={s.section} id="pricing" aria-labelledby="pricing-title">
      <p className={s.eyebrow}>Pricing</p>
      <h2 className={`${s.title} chrome-type`} id="pricing-title">Free to start.</h2>
      <div className={s.priceCard}>
        <Mark tone="white" className={s.hallmark} />
        <p className={s.priceLead}>Log everything for free. Pro unlocks the deeper analysis.</p>
        <p className={s.price}><span className="num">$34.99</span><span className={s.per}> a year</span></p>
        <p className={s.priceNote}>or <span className="num">$5.99</span> a month. 7 days free. Prices vary by region.</p>
      </div>
    </section>
  );
}

export function Download() {
  return (
    <section className={s.downloadRoom} id="download" aria-labelledby="download-title">
      <Wall>
        <Mark className={s.downloadMark} />
        <h2 className={`${s.big} chrome-type`} id="download-title">Start carving.</h2>
        <p className={s.downloadLine}>Everything above, in your pocket, today.</p>
        <StoreButton size="lg" showAndroid />
      </Wall>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className={s.footer}>
      <nav className={s.footLinks} aria-label="Footer">
        <a href="/support">Support</a>
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/delete-account">Delete account</a>
        <a href={`mailto:${SUPPORT_EMAIL}`}>Contact</a>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">Instagram</a>
      </nav>
      <p className={s.legal}>
        © {new Date().getFullYear()} Awekn · Venex Labs. Apple, the Apple logo and App Store are trademarks of Apple Inc.
        Google Play is a trademark of Google LLC.
      </p>
      {/* the wordmark, monumental, edge to edge, sinking into the floor; a light crosses the metal as
          it comes into view */}
      <div className={s.giant} aria-hidden="true">
        <Wordmark className={s.giantWord} />
        <span className={s.giantSheen} />
      </div>
      <p className="sr-only">Awekn</p>
    </footer>
  );
}
