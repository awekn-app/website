'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Short oath-like phrases, scrolling. Not feature names.
  const oaths = [
    'lift in silence',
    'the iron remembers',
    'show up again',
    'every rep counted',
    'every day kept',
    'the body is a ledger',
    'the record is forever',
    'training is devotion',
  ];

  return (
    <>
      <div className="vignette" aria-hidden />

      {/* ═════════ NAV ═════════ */}
      <nav className="nav">
        <a href="#" className="nav-logo">awekn</a>
        <div className="nav-links">
          <a href="#journal">Journal</a>
          <a href="#ascent">Strength</a>
          <a href="#modes">Modes</a>
          <a href="#download" className="nav-cta">Get the app</a>
        </div>
      </nav>

      {/* ═════════ HERO ═════════ */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-kicker">For those who return</span>
          <h1 className="hero-headline">
            Training is a kind of <span className="serif">devotion</span>.
          </h1>
          <p className="hero-tagline">
            A chronicle of every rep, every meal, every day you return to the iron. Written on your device first. Kept there forever.
          </p>
          <div className="hero-buttons">
            <a href="#download" className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.82 11.78 5.72 12.57 5.72C13.36 5.72 14.83 4.62 16.4 4.8C17.07 4.83 18.87 5.08 20.01 6.72C19.89 6.79 17.34 8.28 17.37 11.26C17.4 14.77 20.56 15.87 20.59 15.88C20.56 15.96 20.09 17.6 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
              </svg>
              Download for iOS
            </a>
            <a href="#download" className="btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
              </svg>
              Android
            </a>
          </div>
        </div>

        <div className="hero-right">
          <div className="phone phone-xl">
            <div className="phone-screen">
              <img src="/screens/journal.jpg" alt="awekn journal" />
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ OATH MARQUEE ═════════ */}
      <section className="marquee" aria-hidden>
        <div className="marquee-track">
          {[...oaths, ...oaths].map((item, i) => (
            <span key={i} className="marquee-item">{item}</span>
          ))}
        </div>
      </section>

      {/* ═════════ 01 . THE CYCLE ═════════ */}
      <section className="section">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">I</span>The cycle</div>
          <h2 className="section-title">
            A climb you <span className="serif">earn</span> back.
          </h2>
          <p className="section-subtitle">
            Splits as cycles. Push, Pull, Legs. Complete. Skip. Reset. The structure you trust, tracked with intent you can see.
          </p>
        </div>
        <div className="split phone-right reveal">
          <div>
            <ul className="line-list">
              <li>Custom splits with unlimited days and active-rest days</li>
              <li>Smart defaults carried over from the last session</li>
              <li>Skip, complete, undo, reset on a long-press</li>
              <li>Calendar of every day you trained, with dots on the streak</li>
            </ul>
            <div className="stat-row">
              <div className="stat">
                <span className="stat-label">The kit</span>
                <span className="stat-value">PPL . Arnold . Upper/Lower . 3/4/5-day . Custom</span>
              </div>
            </div>
          </div>
          <div className="split-phone">
            <div className="phone phone-l">
              <div className="phone-screen">
                <img src="/screens/home-bb.jpg" alt="awekn 5 day split" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ 02 . THE JOURNAL ═════════ */}
      <section className="section" id="journal">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">II</span>The journal</div>
          <h2 className="section-title">
            Every day you showed up. <span className="serif">Kept</span>.
          </h2>
          <p className="section-subtitle">
            A chronicle of the work. The heatmap shows the months you held the line. Tap any day and every lift, meal, PR, photo, and note appears as one vertical scroll.
          </p>
        </div>
        <div className="split phone-left reveal">
          <div className="split-phone">
            <div className="phone phone-l">
              <div className="phone-screen">
                <img src="/screens/journal.jpg" alt="awekn journal heatmap and timeline" />
              </div>
            </div>
          </div>
          <div>
            <div className="stat-row" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
              <div className="stat">
                <span className="stat-label">The streak</span>
                <span className="stat-value accent">4 days</span>
              </div>
              <div className="stat">
                <span className="stat-label">The volume</span>
                <span className="stat-value">75.9k kg</span>
              </div>
              <div className="stat">
                <span className="stat-label">The records</span>
                <span className="stat-value">3</span>
              </div>
            </div>
            <ul className="line-list">
              <li>Activity heatmap across the last months</li>
              <li>Per-day hero on the date, with the signature glow</li>
              <li>Every feature, one vertical scroll per day</li>
              <li>Full-screen photo viewer with swipe navigation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═════════ 03 . THE ASCENT ═════════ */}
      <section className="section" id="ascent">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">III</span>The ascent</div>
          <h2 className="section-title">
            Your strength, <span className="serif">plotted</span> in full.
          </h2>
          <p className="section-subtitle">
            Every exercise tells a curve. Every session is a point on it. Over weeks, over months, you see the line rise. Or stall. You'll know either way.
          </p>
        </div>
        <div className="split phone-right reveal">
          <div>
            <ul className="line-list">
              <li>Push Day analytics with the strength curve across every session</li>
              <li>Per-exercise detail: peak vs latest, session count, max-weight graph</li>
              <li>Best sets ranked by weight times reps</li>
              <li>Date ranges from two weeks to all time</li>
            </ul>
            <div className="stat-row">
              <div className="stat">
                <span className="stat-label">Tricep Pushdown</span>
                <span className="stat-value accent">+11 kg</span>
              </div>
              <div className="stat">
                <span className="stat-label">Across sessions</span>
                <span className="stat-value">9</span>
              </div>
            </div>
          </div>
          <div className="split-phone">
            <div className="cascade">
              <div className="phone phone-m back">
                <div className="phone-screen">
                  <img src="/screens/analytics-day.jpg" alt="push day analytics" />
                </div>
              </div>
              <div className="phone phone-m front">
                <div className="phone-screen">
                  <img src="/screens/analytics-exercise.jpg" alt="tricep pushdown detail" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ 04 . THE FUEL ═════════ */}
      <section className="hero-phone-section reveal">
        <div className="eyebrow"><span className="eyebrow-num">IV</span>The fuel</div>
        <h2 className="section-title">
          <span className="serif">2,663</span>
          <span className="dim" style={{ fontSize: '0.42em', verticalAlign: 'super', marginLeft: 14, letterSpacing: 2 }}>KCAL</span>
        </h2>
        <p className="section-subtitle">
          Calories weighed. Macros counted. Water, fiber, and anything else you measure. Every meal entered, plotted across the day you lived.
        </p>
        <div className="hero-phone-frame glow-emerald">
          <div className="phone phone-xl">
            <div className="phone-screen">
              <img src="/screens/calories.jpg" alt="awekn calories screen" />
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ 05 . THE BODY ═════════ */}
      <section className="section">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">V</span>The body</div>
          <h2 className="section-title">
            <span className="serif">65.5</span> <span className="dim" style={{ fontSize: '0.55em' }}>kg</span>
          </h2>
          <p className="section-subtitle">
            Weight, body-fat, the trajectory toward your target. A rolling average that smooths the noise. Every weighing a waypoint on the climb. Or the cut.
          </p>
        </div>
        <div className="split phone-left reveal">
          <div className="split-phone">
            <div className="phone phone-l">
              <div className="phone-screen">
                <img src="/screens/weight.jpg" alt="awekn body weight" />
              </div>
            </div>
          </div>
          <div>
            <div className="stat-row" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
              <div className="stat">
                <span className="stat-label">Target</span>
                <span className="stat-value">75 kg</span>
              </div>
              <div className="stat">
                <span className="stat-label">Toward it</span>
                <span className="stat-value accent">87%</span>
              </div>
              <div className="stat">
                <span className="stat-label">Rolling seven</span>
                <span className="stat-value">67.3 kg</span>
              </div>
            </div>
            <ul className="line-list">
              <li>Lose, gain, or maintain with color-coded progress</li>
              <li>Body-fat percentage alongside the weight</li>
              <li>Seven and thirty day rolling averages</li>
              <li>Every weighing in full history, with deltas</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═════════ 06 . THE REST OF THE RECORD ═════════ */}
      <section className="section">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">VI</span>The rest of the record</div>
          <h2 className="section-title">
            Photos. Measurements. <span className="dim">Cardio. Notes. Records.</span>
          </h2>
          <p className="section-subtitle">
            One tracker with tabs for every dimension of the work. Tap the tab, log the thing, move on. Nothing to hunt for.
          </p>
        </div>
        <div className="tracker-grid">
          <div className="tracker-tile reveal">
            <div className="phone phone-s">
              <div className="phone-screen"><img src="/screens/media.jpg" alt="progress photos" /></div>
            </div>
            <div className="tracker-tile-caption">Photos</div>
          </div>
          <div className="tracker-tile reveal" style={{ transitionDelay: '0.08s' }}>
            <div className="phone phone-s">
              <div className="phone-screen"><img src="/screens/prs.jpg" alt="personal records" /></div>
            </div>
            <div className="tracker-tile-caption">Records</div>
          </div>
          <div className="tracker-tile reveal" style={{ transitionDelay: '0.16s' }}>
            <div className="phone phone-s">
              <div className="phone-screen"><img src="/screens/notes.jpg" alt="training notes" /></div>
            </div>
            <div className="tracker-tile-caption">Notes</div>
          </div>
          <div className="tracker-tile reveal" style={{ transitionDelay: '0.24s' }}>
            <div className="phone phone-s">
              <div className="phone-screen"><img src="/screens/measure.jpg" alt="body measurements" /></div>
            </div>
            <div className="tracker-tile-caption">Measurements</div>
          </div>
          <div className="tracker-tile reveal" style={{ transitionDelay: '0.32s' }}>
            <div className="phone phone-s">
              <div className="phone-screen"><img src="/screens/cardio.jpg" alt="cardio tracking" /></div>
            </div>
            <div className="tracker-tile-caption">Cardio</div>
          </div>
        </div>
      </section>

      {/* ═════════ 07 . TWO DISCIPLINES ═════════ */}
      <section className="section" id="modes">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">VII</span>Two disciplines</div>
          <h2 className="section-title">
            For the <span className="serif">sculptor</span>. <span className="dim">For the</span> <span className="serif">titan</span>.
          </h2>
          <p className="section-subtitle">
            Switch with one tap. Each mode built for how you actually train, not a compromise between both.
          </p>
        </div>
        <div className="modes-split">
          <div className="mode-card bb reveal">
            <span className="mode-badge">Bodybuilding</span>
            <h3 className="mode-title">Build the physique.</h3>
            <p className="mode-sub">The sculptor's tools. Splits, volume, strength curves, supersets, the exercise library.</p>
            <ul className="mode-features">
              <li>Split presets, cycle tracking, skip, complete, undo</li>
              <li>120+ exercise library with bodyweight toggle</li>
              <li>Drag-and-drop reorder and supersets</li>
              <li>Volume tracking and session deltas</li>
            </ul>
            <div className="mode-phone-wrap">
              <div className="phone phone-m">
                <div className="phone-screen">
                  <img src="/screens/home-bb.jpg" alt="bodybuilding home" />
                </div>
              </div>
            </div>
          </div>
          <div className="mode-card pl reveal" style={{ transitionDelay: '0.1s' }}>
            <span className="mode-badge">Powerlifting</span>
            <h3 className="mode-title">Chase the total.</h3>
            <p className="mode-sub">The titan's kit. Maxes, rolling e1RM, scoring, meet planning, red-light memory, daily readiness.</p>
            <ul className="mode-features">
              <li>S/B/D maxes with rolling e1RM and a trends graph</li>
              <li>RPE per set. DOTS, Wilks, IPF GL scoring</li>
              <li>Meet planner with attempts and red-light memory</li>
              <li>Plate calculator, warm-up generator, daily readiness</li>
            </ul>
            <div className="mode-phone-wrap">
              <div className="phone phone-m">
                <div className="phone-screen">
                  <img src="/screens/home-pl.jpg" alt="powerlifting home" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ 08 . THE RHYTHM ═════════ */}
      <section className="section">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">VIII</span>The rhythm</div>
          <h2 className="section-title">
            The set, the rep, the <span className="serif">next</span>.
          </h2>
          <p className="section-subtitle">
            Weight in one tap. Reps in another. Check the set, move on. The timer keeps the rest. The moment is brief. The record is forever.
          </p>
        </div>
        <div className="split phone-right reveal">
          <div>
            <ul className="line-list">
              <li>Weight, reps, RPE in a single row per set</li>
              <li>Warm-up, working, drop, failure, and AMRAP markers</li>
              <li>Every set from every session, preserved for as long as you lift</li>
              <li>Resume any workout exactly where you left off</li>
            </ul>
            <div className="stat-row">
              <div className="stat">
                <span className="stat-label">Live</span>
                <span className="stat-value">Push Day . #11</span>
              </div>
              <div className="stat">
                <span className="stat-label">Then</span>
                <span className="stat-value">Archived forever</span>
              </div>
            </div>
          </div>
          <div className="split-phone">
            <div className="cascade">
              <div className="phone phone-m back">
                <div className="phone-screen">
                  <img src="/screens/session.jpg" alt="session archived forever" />
                </div>
              </div>
              <div className="phone phone-m front">
                <div className="phone-screen">
                  <img src="/screens/active-workout.jpg" alt="active workout with sets being completed" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════ 09 . YOURS ═════════ */}
      <section className="section tight">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">IX</span>Yours</div>
          <h2 className="section-title">
            The vault stays <span className="serif">with you</span>.
          </h2>
          <p className="section-subtitle">
            Every rep, every meal, every photo. Stored on your device first. Synced to the cloud quietly when you're online. Never stranded.
          </p>
        </div>
        <div className="split phone-left reveal">
          <div className="split-phone">
            <div className="phone phone-l">
              <div className="phone-screen">
                <img src="/screens/home-calendar.jpg" alt="home calendar with workout dots" />
              </div>
            </div>
          </div>
          <div>
            <div className="stat-row" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
              <div className="stat">
                <span className="stat-label">On device</span>
                <span className="stat-value">Local SQLite</span>
              </div>
              <div className="stat">
                <span className="stat-label">In the cloud</span>
                <span className="stat-value">Every two minutes</span>
              </div>
              <div className="stat">
                <span className="stat-label">Across</span>
                <span className="stat-value">iOS, Android, any</span>
              </div>
            </div>
            <ul className="line-list">
              <li>Works fully offline, mid-workout, mid-flight</li>
              <li>Calendar of every trained day, dots on the streak</li>
              <li>Per-user secure cloud for photos</li>
              <li>Sign in with Apple, Google, or email</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═════════ MANIFESTO ═════════ */}
      <section className="manifesto-section">
        <h2 className="manifesto-quote reveal">
          Built <span className="serif">different</span>.<br />
          <span className="dim">No feeds. No coaches. No distractions.</span>
        </h2>
        <p className="manifesto-body reveal">
          Just the work. The numbers. The return. Every rep counted. Every gain visible. Nothing in between.
        </p>
      </section>

      {/* ═════════ FAQ ═════════ */}
      <section className="section">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Frequently asked</div>
          <h2 className="section-title" style={{ margin: '0 auto' }}>Questions worth asking.</h2>
        </div>
        <div className="faq-list">
          {[
            { q: 'Does it work offline?', a: 'Yes. Every read and write hits your device first. Cloud sync happens in the background when you have internet. Log workouts on a plane and everything syncs when you land.' },
            { q: 'How do I sign in?', a: 'Email and password, Sign in with Apple, or Sign in with Google. Any of the three. Your choice.' },
            { q: 'Can one account train both ways?', a: 'Yes. Switch modes with one tap on the home screen. Bodybuilding has split presets and volume. Powerlifting has RPE, scoring, meet planning, and a setup profile for the lifts.' },
            { q: 'Where are my photos stored?', a: 'In your own folder inside a secure cloud bucket. Each photo is compressed to 1920px before upload. Delete on the device removes the cloud copy.' },
            { q: 'Does my data move across devices?', a: 'Yes. Workouts, weight, photos, notes, records, measurements, cardio. Sign in on any device and everything appears.' },
            { q: 'What themes do I get?', a: 'Eight. Dark, Cosmic Blue, Obsidian Gold, Midnight Sage, Graphite, Light, Dune, Baddie. Plus System. Each tuned end-to-end, not recolored.' },
          ].map((item, i) => (
            <details key={i} className="faq-item reveal" style={{ transitionDelay: `${i * 0.04}s` }}>
              <summary className="faq-question">{item.q}</summary>
              <p className="faq-answer">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ═════════ CLOSING ═════════ */}
      <section className="closing" id="download">
        <h2 className="closing-wordmark">awekn</h2>
        <p className="closing-sub">Begin the record.</p>
        <div className="closing-buttons">
          <a href="#" className="btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.82 11.78 5.72 12.57 5.72C13.36 5.72 14.83 4.62 16.4 4.8C17.07 4.83 18.87 5.08 20.01 6.72C19.89 6.79 17.34 8.28 17.37 11.26C17.4 14.77 20.56 15.87 20.59 15.88C20.56 15.96 20.09 17.6 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
            </svg>
            iOS
          </a>
          <a href="#" className="btn-ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
            </svg>
            Android
          </a>
        </div>
      </section>

      {/* ═════════ FOOTER ═════════ */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">awekn</div>
            <p>A chronicle of every rep, every meal, every day you return to the iron.</p>
          </div>
          <div className="footer-col">
            <h4>The app</h4>
            <a href="#journal">Journal</a>
            <a href="#ascent">Strength</a>
            <a href="#modes">Modes</a>
            <a href="#download">Download</a>
          </div>
          <div className="footer-col">
            <h4>Reach</h4>
            <a href="mailto:areeb@awekn.com">Contact</a>
            <a href="https://www.instagram.com/awekn.app" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} awekn</span>
          <span>For those who return.</span>
        </div>
      </footer>
    </>
  );
}
