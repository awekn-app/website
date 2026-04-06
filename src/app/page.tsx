'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <a href="#" className="nav-logo">awekn</a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#modes">Modes</a>
          <a href="#faq">FAQ</a>
          <a href="#download" className="nav-cta">Download</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/hero-bg.png" alt="awekn" />
          <div className="hero-gradient" />
        </div>
        <div className="hero-content">
          <p className="hero-kicker">Workout Tracker for the Relentless</p>
          <h1 className="hero-headline">Every rep.<br />Every set.<br /><span className="hero-accent">Every conquest.</span></h1>
          <p className="hero-tagline">
            Bodybuilding & Powerlifting. Offline-first. Built for lifters who don&apos;t quit.
          </p>
          <div className="hero-buttons">
            <a href="#download" className="btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.82 11.78 5.72 12.57 5.72C13.36 5.72 14.83 4.62 16.4 4.8C17.07 4.83 18.87 5.08 20.01 6.72C19.89 6.79 17.34 8.28 17.37 11.26C17.4 14.77 20.56 15.87 20.59 15.88C20.56 15.96 20.09 17.6 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
              App Store
            </a>
            <a href="#download" className="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z"/></svg>
              Google Play
            </a>
          </div>
        </div>
        <div className="hero-scroll">
          <span className="hero-scroll-line" />
          Scroll
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="trust-bar">
        <div className="trust-inner">
          <div className="trust-item">
            <span className="trust-number">120+ Built-in</span>
            <span className="trust-label">Exercises + custom</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-number">Offline-first</span>
            <span className="trust-label">Syncs when you're online</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-number">2 Modes</span>
            <span className="trust-label">BB + Powerlifting</span>
          </div>
          <div className="trust-divider" />
          <div className="trust-item">
            <span className="trust-number">Free</span>
            <span className="trust-label">3-day trial, no card</span>
          </div>
        </div>
      </section>

      {/* FEATURE 1: LOG WORKOUTS */}
      <section className="feature-section" id="features">
        <div className="feature-row">
          <div className="feature-img reveal">
            <img src="/statue-back.jpg" alt="Track every rep" />
          </div>
          <div className="feature-text reveal">
            <span className="feature-badge">Core</span>
            <h2>Log workouts in seconds</h2>
            <p className="feature-subtitle">Everything you need to track your lifts. Nothing you don&apos;t.</p>
            <ul className="feature-list">
              <li>Sets, reps, weight — tap and done</li>
              <li>Smart defaults from your last session</li>
              <li>Custom splits with unlimited days</li>
              <li>Resume any workout where you left off</li>
              <li>Mark warmup, working, and drop sets</li>
              <li>Bodyweight exercise toggle</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURE 2: ANALYTICS */}
      <section className="feature-section feature-reverse">
        <div className="feature-row">
          <div className="feature-img reveal">
            <img src="/statue-atlas.jpg" alt="See your progress" />
          </div>
          <div className="feature-text reveal">
            <span className="feature-badge accent">Analytics</span>
            <h2>See exactly how far you&apos;ve come</h2>
            <p className="feature-subtitle">Every number tells your story. Every graph shows your growth.</p>
            <ul className="feature-list">
              <li>Strength progression charts per exercise</li>
              <li>Exercise sparklines and trend arrows</li>
              <li>Session-over-session volume deltas</li>
              <li>Best sets ranked by weight x reps</li>
              <li>Time range filters: 2W to All time</li>
              <li>Personal records auto-tracked</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURE 3: TRACK EVERYTHING */}
      <section className="feature-section">
        <div className="feature-row">
          <div className="feature-img reveal">
            <img src="/statue-hammer.jpg" alt="Track everything" />
          </div>
          <div className="feature-text reveal">
            <span className="feature-badge">Tracker</span>
            <h2>Track more than just workouts</h2>
            <p className="feature-subtitle">Body weight, calories, macros, measurements, cardio, personal records, notes — all in one place.</p>
            <ul className="feature-list">
              <li>Calorie and macro tracking with custom macros</li>
              <li>Body weight with goal-based color coding</li>
              <li>Body measurements with delta indicators</li>
              <li>Cardio: walk, run, sprint, stairs, custom</li>
              <li>Unlimited notes with timestamps</li>
              <li>Graphs and analytics for every metric</li>
            </ul>
          </div>
        </div>
      </section>

      {/* MID-PAGE CTA */}
      <section className="mid-cta">
        <div className="mid-cta-inner reveal">
          <h3>The easiest way to stay consistent in the gym</h3>
          <p>Available on iOS and Android. Free to try.</p>
          <div className="hero-buttons" style={{ marginTop: 24 }}>
            <a href="#download" className="btn-primary">Download Free</a>
          </div>
        </div>
      </section>

      {/* MODES */}
      <section className="modes" id="modes">
        <p className="section-label reveal">Two modes. One app.</p>
        <h2 className="section-title reveal">Bodybuilding & Powerlifting</h2>
        <p className="section-subtitle reveal">Switch between modes with one tap. Each purpose-built for how you train.</p>
        <div className="modes-grid">
          <div className="mode-card mode-bb reveal">
            <img src="/statue-back.jpg" alt="Bodybuilding" />
            <div className="mode-overlay" />
            <div className="mode-content">
              <span className="mode-badge">Bodybuilding</span>
              <h3 className="mode-title">Build the physique</h3>
              <ul className="mode-list">
                <li>Split presets: PPL, Arnold, Upper/Lower, Bro, 3-5 day</li>
                <li>120+ exercise library + custom exercises</li>
                <li>Volume tracking and session analytics</li>
                <li>Cycle tracking with skip, complete, reset</li>
                <li>Exercise history with strength graphs</li>
              </ul>
            </div>
          </div>
          <div className="mode-card mode-pl reveal" style={{ transitionDelay: '0.1s' }}>
            <img src="/statue-atlas.jpg" alt="Powerlifting" />
            <div className="mode-overlay" />
            <div className="mode-content">
              <span className="mode-badge">Powerlifting</span>
              <h3 className="mode-title">Chase the total</h3>
              <ul className="mode-list">
                <li>S/B/D maxes with total display</li>
                <li>RPE logging per set + % of 1RM</li>
                <li>DOTS, Wilks, IPF GL scoring calculator</li>
                <li>Competition tracker with attempt planner</li>
                <li>RPE chart + e1RM + working weight calculator</li>
                <li>Plate calculator with custom bar weight</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CROSS-DEVICE */}
      <section className="feature-section feature-reverse">
        <div className="feature-row">
          <div className="feature-img reveal">
            <img src="/statue-pillar.jpg" alt="Cross-device sync" />
          </div>
          <div className="feature-text reveal">
            <span className="feature-badge accent">Sync</span>
            <h2>Offline-first. Synced everywhere.</h2>
            <p className="feature-subtitle">Your data lives on your device first. Works without internet. Syncs to the cloud automatically when you&apos;re online.</p>
            <ul className="feature-list">
              <li>Works fully offline — log workouts anywhere</li>
              <li>Cross-device sync: iPhone, Android, any device</li>
              <li>Background sync every 2 minutes</li>
              <li>Sign out and back in — data is always there</li>
              <li>Your data is yours. Always.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto reveal">
        <h2 className="manifesto-text">Built different.</h2>
        <p className="manifesto-sub">
          No features you will never use. No social feeds. No AI coaches. No distractions.<br /><br />
          Just your lifts, your numbers, your progress — tracked with precision and shown with clarity. Every rep counted. Every gain visible. Nothing in between.
        </p>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <h2 className="section-title reveal">Questions?</h2>
        <div className="faq-grid">
          {[
            { q: 'Is awekn free?', a: 'You get a 3-day free trial with full access to every feature. No credit card required. After that, choose a plan that works for you.' },
            { q: 'Does it work offline?', a: 'Yes. awekn is offline-first. Every read and write goes to your local device instantly. Cloud sync happens automatically in the background when you have internet.' },
            { q: 'Can I use it for both bodybuilding and powerlifting?', a: 'Yes. Switch between modes with one tap on the home screen. Each mode has purpose-built features — bodybuilding has split presets and volume tracking, powerlifting has RPE, scoring calculators, and meet planning.' },
            { q: 'Will my data sync across devices?', a: 'Yes. Sign in on any device and your data syncs automatically. Works across iPhone and Android.' },
            { q: 'Can I track calories and macros?', a: 'Yes. Full calorie and macro tracking with protein, carbs, fats, fiber, and custom macros. Graphs for every metric.' },
            { q: 'Can I cancel anytime?', a: 'Yes. Cancel your subscription anytime through the App Store or Google Play. You keep access until the end of your billing period.' },
          ].map((item, i) => (
            <details key={i} className="faq-item reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
              <summary className="faq-question">{item.q}</summary>
              <p className="faq-answer">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="download">
        <div className="cta-bg"><img src="/splash.png" alt="" /></div>
        <div className="cta-content reveal">
          <h2 className="cta-title">Ready to awekn?</h2>
          <p className="cta-sub">Available on iOS and Android. Start your free trial today.</p>
          <div className="hero-buttons">
            <a href="#" className="btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.82 11.78 5.72 12.57 5.72C13.36 5.72 14.83 4.62 16.4 4.8C17.07 4.83 18.87 5.08 20.01 6.72C19.89 6.79 17.34 8.28 17.37 11.26C17.4 14.77 20.56 15.87 20.59 15.88C20.56 15.96 20.09 17.6 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/></svg>
              App Store
            </a>
            <a href="#" className="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z"/></svg>
              Google Play
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-col">
            <p className="footer-logo">awekn</p>
            <p className="footer-tagline">Track. Log. Analyse. Conquer.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#modes">Bodybuilding</a>
            <a href="#modes">Powerlifting</a>
            <a href="#download">Download</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="mailto:areeb@awekn.com">Contact</a>
            <a href="https://www.instagram.com/awekn.app" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} awekn. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
