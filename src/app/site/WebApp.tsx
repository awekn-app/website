import s from "./WebApp.module.css";
import { WEB_APP, LOGIN } from "../lib/links";

/**
 * The web app (app.awekn.com) in a browser window: the same record on a big screen. The window is
 * the opensourceui browser-frame idea (MIT, github.com/bidyut10/opensourceui), rebuilt dark in the
 * site's materials: a machined bar, three quiet lights, the address, and the real web app inside.
 */
export function WebApp() {
  return (
    <section className={s.room} id="web" aria-labelledby="web-title">
      <div className={s.words}>
        <p className={s.eyebrow}>On the web, too</p>
        <h2 className={`${s.title} chrome-type`} id="web-title">Your record, on a big screen.</h2>
        <p className={s.line}>
          Plan the week, read the trends, log a session from your desk. The same account as your phone,
          at app.awekn.com.
        </p>
        <a className={s.cta} href={LOGIN}>
          Open the web app <span aria-hidden="true">→</span>
        </a>
      </div>
      <figure className={s.window}>
        <div className={s.bar} aria-hidden="true">
          <span className={s.lights}><i /><i /><i /></span>
          <span className={s.address}>
            <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2h.5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h.5Zm1.5 0h4V5a2 2 0 1 0-4 0v2Z" fill="currentColor" /></svg>
            {WEB_APP.replace("https://", "")}
          </span>
        </div>
        <picture>
          <source media="(max-width: 700px)" srcSet="/app/web-home-880.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.shot} src="/app/web-home.webp" width={1440} height={900} loading="lazy" decoding="async"
            alt="The Awekn web app's home: this week's working sets against your usual, the next workout with last time's numbers, your training rhythm and recent records." />
        </picture>
      </figure>
    </section>
  );
}
