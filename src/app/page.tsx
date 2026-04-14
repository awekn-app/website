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

  const marqueeItems = [
    'bodybuilding',
    'powerlifting',
    'offline-first',
    'journal timeline',
    'activity heatmap',
    'strength graphs',
    'calorie tracking',
    'body weight goals',
    'cross-device sync',
    'progress photos',
    'daily readiness',
    'meet planner',
    'RPE chart',
    '8 themes',
    'apple + google sign in',
  ];

  return (
    <>
      <div className="vignette" aria-hidden />

      {/* ═══════ NAV ═══════ */}
      <nav className="nav">
        <a href="#" className="nav-logo">awekn</a>
        <div className="nav-links">
          <a href="#journal">Journal</a>
          <a href="#strength">Strength</a>
          <a href="#modes">Modes</a>
          <a href="#download" className="nav-cta">Get the app</a>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-kicker">Built for serious lifters</span>
          <h1 className="hero-headline">
            Every lift.<br />
            Every meal.<br />
            <span className="gradient">Every day.</span>
          </h1>
          <p className="hero-tagline">
            A workout tracker with the aesthetic of a premium watch app. Built around a single signature design system. Quiet, fast, offline-first.
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
          <div className="hero-meta">
            <span>Offline-first</span>
            <span className="dot" />
            <span>Cross-device sync</span>
            <span className="dot" />
            <span>Bodybuilding + powerlifting</span>
          </div>
        </div>

        <div className="hero-right">
          <div className="phone phone-xl">
            <div className="phone-screen">
              <img src="/screens/journal.jpg" alt="awekn journal screen showing activity heatmap and daily timeline" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ MARQUEE ═══════ */}
      <section className="marquee" aria-hidden>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">{item}</span>
          ))}
        </div>
      </section>

      {/* ═══════ 01 . EVERY WORKOUT (BB HOME + SPLIT) ═══════ */}
      <section className="section">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">01</span>The core loop</div>
          <h2 className="section-title">
            Your split, <span className="serif">remembered</span>.
          </h2>
          <p className="section-subtitle">
            Cycle tracking built into the home screen. Tap a day to train. Skip, complete, or reset anytime. Your streak picks up exactly where you left off.
          </p>
        </div>
        <div className="split phone-right reveal">
          <div>
            <ul className="line-list">
              <li>Custom splits with unlimited days and active-rest days</li>
              <li>Smart defaults pulled from your last session</li>
              <li>Skip, complete, undo, and reset with a long-press</li>
              <li>A calendar of every day you trained, with dots on streak days</li>
            </ul>
            <div className="stat-row">
              <div className="stat">
                <span className="stat-label">Splits</span>
                <span className="stat-value">PPL, Arnold, Upper/Lower, Bro, 3/4/5-day, custom</span>
              </div>
            </div>
          </div>
          <div className="split-phone">
            <div className="phone phone-l">
              <div className="phone-screen">
                <img src="/screens/home-bb.jpg" alt="awekn bodybuilding home screen with 5 Day Split cycle tracking" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 02 . JOURNAL (MVP, biggest moment) ═══════ */}
      <section className="section" id="journal">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">02</span>The journal</div>
          <h2 className="section-title">
            A timeline <span className="dim">of every day you showed up.</span>
          </h2>
          <p className="section-subtitle">
            Not a dashboard of numbers. A journal. Activity heatmap, then tap any day to see the full story. Workouts, meals, PRs, photos, measurements, cardio, notes. Unified.
          </p>
        </div>
        <div className="split phone-left reveal">
          <div className="split-phone">
            <div className="phone phone-l">
              <div className="phone-screen">
                <img src="/screens/journal.jpg" alt="awekn journal tab with activity heatmap and daily timeline" />
              </div>
            </div>
          </div>
          <div>
            <div className="stat-row" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
              <div className="stat">
                <span className="stat-label">Streak</span>
                <span className="stat-value accent">4 days</span>
              </div>
              <div className="stat">
                <span className="stat-label">This week</span>
                <span className="stat-value">15 workouts</span>
              </div>
              <div className="stat">
                <span className="stat-label">Volume</span>
                <span className="stat-value">75.9k kg</span>
              </div>
              <div className="stat">
                <span className="stat-label">PRs</span>
                <span className="stat-value">3</span>
              </div>
            </div>
            <ul className="line-list">
              <li>Activity heatmap across the last 84 days</li>
              <li>Per-day cosmic hero on the date with signature glow</li>
              <li>Every entry from every feature in one vertical scroll</li>
              <li>Fullscreen photo viewer with swipe navigation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════ 03 . STRENGTH GRAPHS (cascading phones) ═══════ */}
      <section className="section" id="strength">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">03</span>Strength, visualized</div>
          <h2 className="section-title">
            Every chart, <span className="serif">earned</span>.
          </h2>
          <p className="section-subtitle">
            Strength progression per exercise. Volume deltas session over session. Best sets ranked. Exercise sparklines. 2-week to all-time filters.
          </p>
        </div>
        <div className="split phone-right reveal">
          <div>
            <ul className="line-list">
              <li>Push Day analytics with strength curves across every session</li>
              <li>Per-exercise detail: peak vs latest, sessions count, max-weight graph</li>
              <li>Best sets ranked by weight times reps</li>
              <li>Date-range filters from 2 weeks to all time</li>
            </ul>
            <div className="stat-row">
              <div className="stat">
                <span className="stat-label">Tricep Pushdown</span>
                <span className="stat-value accent">+11 kg</span>
              </div>
              <div className="stat">
                <span className="stat-label">Sessions</span>
                <span className="stat-value">9</span>
              </div>
            </div>
          </div>
          <div className="split-phone">
            <div className="cascade">
              <div className="phone phone-m back">
                <div className="phone-screen">
                  <img src="/screens/analytics-day.jpg" alt="awekn push day analytics with strength progression chart" />
                </div>
              </div>
              <div className="phone phone-m front">
                <div className="phone-screen">
                  <img src="/screens/analytics-exercise.jpg" alt="awekn tricep pushdown exercise detail with max weight graph" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 04 . CALORIES (cosmic hero moment, centered) ═══════ */}
      <section className="hero-phone-section reveal">
        <div className="eyebrow"><span className="eyebrow-num">04</span>Fuel consciously</div>
        <h2 className="section-title">
          <span className="serif">2,663</span>
          <span className="dim" style={{ fontSize: '0.45em', verticalAlign: 'super', marginLeft: 12, letterSpacing: 2 }}>KCAL</span>
        </h2>
        <p className="section-subtitle">
          Calorie + macro logging with protein, carbs, fats, fiber, water, and custom macros. Daily goal ring. Graph any metric across any range.
        </p>
        <div className="hero-phone-frame glow-emerald">
          <div className="phone phone-xl">
            <div className="phone-screen">
              <img src="/screens/calories.jpg" alt="awekn calories screen with 2663 kcal cosmic hero and macro progress" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 05 . BODY WEIGHT ═══════ */}
      <section className="section">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">05</span>Your body, tracked</div>
          <h2 className="section-title">
            <span className="serif">65.5</span> <span className="dim" style={{ fontSize: '0.55em' }}>kg</span>
          </h2>
          <p className="section-subtitle">
            Weight, body-fat, goal progress, 7 and 30 day rolling averages. Log once, see your trajectory across the whole program.
          </p>
        </div>
        <div className="split phone-left reveal">
          <div className="split-phone">
            <div className="phone phone-l">
              <div className="phone-screen">
                <img src="/screens/weight.jpg" alt="awekn body weight screen with cosmic hero number and target progress" />
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
                <span className="stat-label">Progress</span>
                <span className="stat-value accent">87%</span>
              </div>
              <div className="stat">
                <span className="stat-label">7-day avg</span>
                <span className="stat-value">67.3 kg</span>
              </div>
            </div>
            <ul className="line-list">
              <li>Lose, gain, or maintain targeting with color-coded progress</li>
              <li>Body-fat percentage logging alongside weight</li>
              <li>7-day and 30-day rolling averages</li>
              <li>Full history with deltas and trend arrows</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════ 06 . EVERYTHING ELSE (tracker tab grid) ═══════ */}
      <section className="section">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">06</span>Everything else</div>
          <h2 className="section-title">
            Photos, measurements, <span className="dim">cardio, notes, PRs.</span>
          </h2>
          <p className="section-subtitle">
            One tracker with tabs across every dimension of your training. Tap the tab, log the thing, move on.
          </p>
        </div>
        <div className="tracker-grid">
          <div className="tracker-tile reveal">
            <div className="phone phone-s">
              <div className="phone-screen"><img src="/screens/media.jpg" alt="awekn progress photos" /></div>
            </div>
            <div className="tracker-tile-caption">Progress photos</div>
          </div>
          <div className="tracker-tile reveal" style={{ transitionDelay: '0.08s' }}>
            <div className="phone phone-s">
              <div className="phone-screen"><img src="/screens/prs.jpg" alt="awekn personal records" /></div>
            </div>
            <div className="tracker-tile-caption">Personal records</div>
          </div>
          <div className="tracker-tile reveal" style={{ transitionDelay: '0.16s' }}>
            <div className="phone phone-s">
              <div className="phone-screen"><img src="/screens/notes.jpg" alt="awekn training notes" /></div>
            </div>
            <div className="tracker-tile-caption">Notes</div>
          </div>
          <div className="tracker-tile reveal" style={{ transitionDelay: '0.24s' }}>
            <div className="phone phone-s">
              <div className="phone-screen"><img src="/screens/measure.jpg" alt="awekn body measurements" /></div>
            </div>
            <div className="tracker-tile-caption">Measurements</div>
          </div>
          <div className="tracker-tile reveal" style={{ transitionDelay: '0.32s' }}>
            <div className="phone phone-s">
              <div className="phone-screen"><img src="/screens/cardio.jpg" alt="awekn cardio tracking" /></div>
            </div>
            <div className="tracker-tile-caption">Cardio</div>
          </div>
        </div>
      </section>

      {/* ═══════ 07 . TWO MODES ═══════ */}
      <section className="section" id="modes">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">07</span>Two modes</div>
          <h2 className="section-title">
            Bodybuilding. <span className="dim">Powerlifting.</span>
          </h2>
          <p className="section-subtitle">
            Switch with one tap. Each purpose-built for how you actually train.
          </p>
        </div>
        <div className="modes-split">
          <div className="mode-card bb reveal">
            <span className="mode-badge">Bodybuilding</span>
            <h3 className="mode-title">Build the physique</h3>
            <p className="mode-sub">Splits, volume, and a strength chart for every exercise you have ever done.</p>
            <ul className="mode-features">
              <li>Split presets, cycle tracking, skip/complete/undo</li>
              <li>120+ exercise library with bodyweight toggle</li>
              <li>Drag-and-drop reorder and supersets</li>
              <li>Volume tracking and session deltas</li>
            </ul>
            <div className="mode-phone-wrap">
              <div className="phone phone-m">
                <div className="phone-screen">
                  <img src="/screens/home-bb.jpg" alt="bodybuilding home with 5 day split" />
                </div>
              </div>
            </div>
          </div>
          <div className="mode-card pl reveal" style={{ transitionDelay: '0.1s' }}>
            <span className="mode-badge">Powerlifting</span>
            <h3 className="mode-title">Chase the total</h3>
            <p className="mode-sub">Meet planning, attempt selection, rolling e1RM, lift setup profile, and a red-light memory.</p>
            <ul className="mode-features">
              <li>S/B/D maxes with rolling e1RM and trends graph</li>
              <li>RPE per set, DOTS, Wilks, IPF GL scoring</li>
              <li>Meet planner with attempt selections and red-light memory</li>
              <li>Plate calculator, warm-up generator, daily readiness</li>
            </ul>
            <div className="mode-phone-wrap">
              <div className="phone phone-m">
                <div className="phone-screen">
                  <img src="/screens/home-pl.jpg" alt="powerlifting home with SBD maxes and tools" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 08 . SESSION DETAIL (log fast) ═══════ */}
      <section className="section tight">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">08</span>Log in seconds</div>
          <h2 className="section-title">
            Tap. Done. <span className="dim">Next set.</span>
          </h2>
        </div>
        <div className="split phone-right reveal">
          <div>
            <ul className="line-list">
              <li>Sets, reps, weight, and RPE in one row each</li>
              <li>Warmup, working, drop, failure, and amrap markers</li>
              <li>Every set from every session, searchable forever</li>
              <li>Resume any workout exactly where you left off</li>
            </ul>
          </div>
          <div className="split-phone">
            <div className="phone phone-l">
              <div className="phone-screen">
                <img src="/screens/session.jpg" alt="awekn session detail showing sets and reps per exercise" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ 09 . CALENDAR + SYNC (offline-first) ═══════ */}
      <section className="section tight">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">09</span>Offline first</div>
          <h2 className="section-title">
            Your data stays <span className="serif">with you</span>.
          </h2>
          <p className="section-subtitle">
            Every read and write hits your device first. Cloud sync happens in the background when you have internet. A calendar of every trained day with dots on your streak.
          </p>
        </div>
        <div className="split phone-left reveal">
          <div className="split-phone">
            <div className="phone phone-l">
              <div className="phone-screen">
                <img src="/screens/home-calendar.jpg" alt="awekn home calendar with workout dots" />
              </div>
            </div>
          </div>
          <div>
            <div className="stat-row" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
              <div className="stat">
                <span className="stat-label">Storage</span>
                <span className="stat-value">Local SQLite</span>
              </div>
              <div className="stat">
                <span className="stat-label">Sync</span>
                <span className="stat-value">Every 2 min in background</span>
              </div>
              <div className="stat">
                <span className="stat-label">Devices</span>
                <span className="stat-value">iOS, Android, any</span>
              </div>
            </div>
            <ul className="line-list">
              <li>Works fully offline, even mid-workout on a plane</li>
              <li>Calendar of every trained day with visible dots</li>
              <li>Per-user secure cloud photos</li>
              <li>Sign in with Apple, Google, or email</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══════ MANIFESTO ═══════ */}
      <section className="manifesto-section">
        <h2 className="manifesto-quote reveal">
          Built <span className="serif">different</span>.<br />
          <span className="dim">No feeds. No coaches. No distractions.</span>
        </h2>
        <p className="manifesto-body reveal">
          Just your lifts, your numbers, your progress. Tracked with precision. Shown with clarity. Every rep counted. Every gain visible.
        </p>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="section">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Frequently asked</div>
          <h2 className="section-title" style={{ margin: '0 auto' }}>Questions worth asking.</h2>
        </div>
        <div className="faq-list">
          {[
            { q: 'Does it work offline?', a: 'Yes. Every read and write hits your device first. Cloud sync happens automatically in the background when you have internet. You can log workouts on a plane and everything syncs when you land.' },
            { q: 'How do I sign in?', a: 'Email plus password, Sign in with Apple, or Sign in with Google. Any of the three. Your choice.' },
            { q: 'Can one account use both bodybuilding and powerlifting?', a: 'Yes. Switch modes with one tap on the home screen. Each mode has its own purpose-built features. BB has split presets and volume tracking. PL has RPE, scoring calculators, meet planning, and the lift setup profile.' },
            { q: 'Where are my photos stored?', a: 'Per-user folders in a secure cloud bucket. Each photo is compressed to 1920px before upload. Delete on the device removes the cloud copy.' },
            { q: 'Does my data sync across devices?', a: 'Yes. Workouts, weight, photos, notes, PRs, measurements, cardio. Sign in on any device and everything appears.' },
            { q: 'What themes do I get?', a: 'Eight. Dark, Cosmic Blue, Obsidian Gold, Midnight Sage, Graphite, Light, Dune, Baddie. Plus System. All tuned end-to-end, not recolored.' },
          ].map((item, i) => (
            <details key={i} className="faq-item reveal" style={{ transitionDelay: `${i * 0.04}s` }}>
              <summary className="faq-question">{item.q}</summary>
              <p className="faq-answer">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ═══════ CLOSING ═══════ */}
      <section className="closing" id="download">
        <h2 className="closing-wordmark">awekn</h2>
        <p className="closing-sub">Available on iOS and Android.</p>
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

      {/* ═══════ FOOTER ═══════ */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">awekn</div>
            <p>Track. Log. Analyse. Conquer. A workout tracker with the aesthetic of a premium watch app.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#journal">Journal</a>
            <a href="#strength">Strength</a>
            <a href="#modes">Modes</a>
            <a href="#download">Download</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
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
          <span>For lifters who do not quit.</span>
        </div>
      </footer>
    </>
  );
}
