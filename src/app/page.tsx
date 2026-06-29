'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import LiquidWordmark from './components/LiquidWordmark';
import HeroBarbell from './components/HeroBarbell';
import LiveSet from './components/LiveSet';
import StrengthCurve from './components/StrengthCurve';
import ConsistencyStreak from './components/ConsistencyStreak';
import PlateLoader from './components/PlateLoader';
import RpeCalculator from './components/RpeCalculator';
import DotsGauge from './components/DotsGauge';
import TracksGrid from './components/TracksGrid';
import LiquidGlass from './components/LiquidGlass';
import { useMotion } from './lib/useMotion';

// The living "pool of light" aurora (additive white + one emerald breath) is
// client-only and loads after paint, so the painted .bg-fallback field + the
// content show instantly. Pure CSS drift (no WebGL); self-gates to the static
// field on phones / reduced-motion. Mirrors the app's CosmicBackground ambient.
const CosmicBackground = dynamic(() => import('./components/CosmicBackground'), {
  ssr: false,
});

// The year training heatmap - the app's signature 365-day grid. A meaningful,
// animated, interactive instrument (cells sweep in left-to-right, hover/focus/
// tap reads a day, arrow keys navigate). Pure CSS transforms, no WebGL. Lazy +
// client-only so it loads after paint; self-gates to a static paint on
// reduced-motion. Replaces the old decorative steel ring.
const YearHeatmap = dynamic(() => import('./components/YearHeatmap'), {
  ssr: false,
});

const APP_STORE =
  'https://apps.apple.com/in/app/awekn-lifting-gym-log-diet/id6762414034';

// The Apple logo glyph used on every iOS CTA.
function AppleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 21.99 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 21.99C7.79 22.03 6.8 20.68 5.96 19.47C4.25 16.56 2.93 11.3 4.7 7.72C5.57 5.94 7.36 4.86 9.28 4.84C10.56 4.82 11.78 5.72 12.57 5.72C13.36 5.72 14.83 4.62 16.4 4.8C17.07 4.83 18.87 5.08 20.01 6.72C19.89 6.79 17.34 8.28 17.37 11.26C17.4 14.77 20.56 15.87 20.59 15.88C20.56 15.96 20.09 17.6 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
    </svg>
  );
}

// The Android robot silhouette, drawn quiet - it never lights up (inert).
function AndroidGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
    </svg>
  );
}

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  useMotion(rootRef);

  return (
    <main ref={rootRef}>
      {/* ── background layers (z below content) ── */}
      <div className="bg-fallback" aria-hidden />
      <CosmicBackground />
      <div className="cursor-glow" aria-hidden />
      <div className="grain" aria-hidden />

      {/* thin scroll-progress indicator, scaled 0 -> 1 across the page */}
      <div className="ix-progress" aria-hidden>
        <span className="ix-progress-bar" />
      </div>

      {/* ════════════ NAV - REAL liquid-glass pill ════════════ */}
      <LiquidGlass
        as="nav"
        className="ix-nav"
        radius={100}
        intensity={0.42}
        mobileBreakpoint={900}
      >
        <a href="#top" className="ix-nav-brand">awekn</a>
        <ol className="ix-nav-index" aria-label="Sections">
          <li>
            <a href="#showcase">
              <span className="ix-nav-num">01</span>See it work
            </a>
          </li>
          <li>
            <a href="#tracks">
              <span className="ix-nav-num">02</span>Everything
            </a>
          </li>
          <li>
            <a href="#disciplines">
              <span className="ix-nav-num">03</span>Disciplines
            </a>
          </li>
          <li>
            <a href="#year">
              <span className="ix-nav-num">04</span>The year
            </a>
          </li>
        </ol>
        <a
          href={APP_STORE}
          target="_blank"
          rel="noopener noreferrer"
          className="ix-nav-cta"
          data-magnetic
        >
          Get the app
        </a>
      </LiquidGlass>

      {/* ════════════ HERO ════════════ */}
      <header className="ix-hero" id="top">
        <span className="hero-eyebrow ix-eyebrow">
          <span className="ix-eyebrow-dot" aria-hidden />
          Now on the App Store
          <span className="ix-eyebrow-sep">·</span>
          <span className="ix-mono">iOS</span>
        </span>

        <div className="wordmark-wrap ix-hero-mark">
          <LiquidWordmark text="awekn" />
        </div>

        <div className="ix-hero-barbell reveal" aria-hidden>
          <HeroBarbell />
        </div>

        <p className="hero-sub ix-hero-sub">
          lift, eat, recover. <span className="ix-serif">track</span> all of it.
        </p>

        <ul className="ix-hero-breadth" aria-label="What awekn tracks">
          <li>workouts</li>
          <li>cardio</li>
          <li>macros</li>
          <li>supplements</li>
          <li>peptides</li>
          <li>prs</li>
          <li>consistency</li>
        </ul>

        <div className="hero-cta ix-hero-cta">
          <a
            href={APP_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="ix-btn ix-btn-gold"
            data-magnetic
          >
            <AppleGlyph />
            Download on iOS
          </a>
          <button
            type="button"
            className="ix-btn ix-btn-ghost"
            aria-disabled="true"
            disabled
          >
            <AndroidGlyph />
            Android, coming soon
          </button>
        </div>

        <p className="ix-hero-price">
          <span className="ix-mono">7 days free</span>, then $34.99/yr. everything
          included. cancel anytime.
        </p>

        <a href="#showcase" className="ix-scroll-cue" aria-label="See it work">
          <span className="ix-scroll-line" aria-hidden />
          <span className="ix-scroll-word">see it work</span>
        </a>
      </header>

      {/* ════════════ 01 · SEE IT WORK - the interactive proof, right up top ════════════ */}
      <section className="ix-section ix-showcase" id="showcase">
        <div className="ix-section-head reveal">
          <span className="ix-eyebrow">
            <span className="ix-index-num">01</span>See it work
          </span>
          <h2 className="ix-display">
            drive it <span className="ix-serif">yourself</span>
          </h2>
          <p className="ix-lede">
            These are the real instruments from the app, running right here. Log a
            set, load a bar, read your month, score a total. Drag, tap, scrub.
            None of it is a mockup.
          </p>
        </div>

        <div className="ix-showcase-stack">
          <div className="ix-showcase-lead reveal">
            <LiveSet />
          </div>
          <div className="ix-showcase-lead reveal">
            <PlateLoader />
          </div>
          <div className="ix-showcase-pair">
            <div className="ix-showcase-cell reveal">
              <ConsistencyStreak />
            </div>
            <div
              className="ix-showcase-cell reveal"
              style={{ transitionDelay: '0.08s' }}
            >
              <DotsGauge />
            </div>
          </div>
          <div className="ix-showcase-pair">
            <div className="ix-showcase-cell reveal">
              <RpeCalculator />
            </div>
            <div
              className="ix-showcase-cell reveal"
              style={{ transitionDelay: '0.08s' }}
            >
              <StrengthCurve />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════ 02 · EVERYTHING IN ONE LOG - the breadth ════════════ */}
      <section className="ix-section ix-tracks" id="tracks">
        <div className="ix-section-head reveal">
          <span className="ix-eyebrow">
            <span className="ix-index-num">02</span>Everything in one log
          </span>
          <h2 className="ix-display">
            not just <span className="ix-serif">workouts</span>
          </h2>
          <p className="ix-lede">
            awekn tracks the whole of your training. Lifting and cardio, diet and
            supplements, the private stuff, every PR, and the consistency under
            all of it. One app, one log, on your device first.
          </p>
        </div>

        <div className="ix-tracks-stage reveal">
          <TracksGrid />
        </div>
      </section>

      {/* ════════════ 02 · TWO DISCIPLINES - REAL liquid-glass cards ════════════ */}
      <section className="ix-section ix-disciplines" id="disciplines">
        <div className="ix-section-head reveal">
          <span className="ix-eyebrow">
            <span className="ix-index-num">02</span>Two disciplines
          </span>
          <h2 className="ix-display">
            one log, <span className="ix-serif">two ways</span> to train
          </h2>
          <p className="ix-lede">
            Switch with a tap. Each discipline is built for how that lifter
            actually works, not a compromise stretched to cover both.
          </p>
        </div>

        <div className="ix-discipline-pair">
          <LiquidGlass
            as="article"
            className="ix-card ix-card-bb reveal"
            intensity={0.5}
          >
            <span className="ix-card-tag">Bodybuilding</span>
            <h3 className="ix-card-title">Build the physique.</h3>
            <p className="ix-card-copy">
              Splits as cycles. Push, pull, legs, repeat. Volume that
              accumulates, supersets that chain, a strength curve under every
              exercise. The sculptor watches the shape come in, set by set.
            </p>
            <ul className="ix-card-list">
              <li>Custom splits, cycle tracking, skip and undo</li>
              <li>A 120-exercise library with a bodyweight toggle</li>
              <li>Per-exercise volume and session deltas</li>
              <li>Supersets and drag-to-reorder</li>
            </ul>
          </LiquidGlass>

          <LiquidGlass
            as="article"
            className="ix-card ix-card-pl reveal"
            intensity={0.4}
            style={{ transitionDelay: '0.08s' }}
          >
            <span className="ix-card-tag">Powerlifting</span>
            <h3 className="ix-card-title">Chase the total.</h3>
            <p className="ix-card-copy">
              Squat, bench, deadlift, and the number under them. Rolling e1RM,
              RPE per set, DOTS and Wilks, a meet planner that remembers every
              red light. Austere by design. The total is the only ornament.
            </p>
            <ul className="ix-card-list">
              <li>S/B/D maxes with rolling e1RM and trend lines</li>
              <li>RPE per set, DOTS, Wilks, IPF GL scoring</li>
              <li>Meet planner with attempts and red-light memory</li>
              <li>Plate math, warm-up generator, daily readiness</li>
            </ul>
          </LiquidGlass>
        </div>
      </section>

      {/* ════════════ THE YEAR - the 365-day training heatmap ════════════ */}
      <section className="ix-year-band" id="year" aria-label="A year of training">
        <div className="ix-year-copy reveal">
          <span className="ix-eyebrow ix-year-eyebrow">
            <span className="ix-index-num">·</span>The year
          </span>
          <p className="ix-year-line">
            every day, <span className="ix-serif">counted</span>.
          </p>
          <p className="ix-year-note">
            one square per day, the whole year on one screen. the grid is the
            record.
          </p>
        </div>
        <div className="ix-year-stage reveal">
          <YearHeatmap />
        </div>
      </section>

      {/* (the set / strength / workshop cards now live in the SEE IT WORK
          showcase above; their old standalone sections were removed in v3) */}

      {/* (pricing is no longer a standalone bottom section in v3; it is folded
          into the hero sub-line and the closing CTA below) */}

      {/* ════════════ PRIVATE / OFFLINE-FIRST ════════════ */}
      <section className="ix-section ix-private">
        <div className="ix-section-head reveal">
          <span className="ix-eyebrow">
            <span className="ix-index-num">·</span>Private by design
          </span>
          <h2 className="ix-display">
            the record is <span className="ix-serif">yours</span>
          </h2>
        </div>

        <ul className="ix-vows reveal">
          <li className="ix-vow">
            <span className="ix-vow-mark" aria-hidden />
            <div>
              <h3 className="ix-vow-title">On your device first</h3>
              <p className="ix-vow-copy">
                Every read and write hits local storage before anything else.
                Log a full session on a plane. It syncs when you land.
              </p>
            </div>
          </li>
          <li className="ix-vow">
            <span className="ix-vow-mark" aria-hidden />
            <div>
              <h3 className="ix-vow-title">Encrypted in transit</h3>
              <p className="ix-vow-copy">
                Your data moves over encrypted channels to a private,
                per-user store gated so only you can read your own rows.
              </p>
            </div>
          </li>
          <li className="ix-vow">
            <span className="ix-vow-mark" aria-hidden />
            <div>
              <h3 className="ix-vow-title">Never sold</h3>
              <p className="ix-vow-copy">
                No ads, no data brokers, no model training on your lifts.
                There is nothing to sell, because we never built that door.
              </p>
            </div>
          </li>
          <li className="ix-vow">
            <span className="ix-vow-mark" aria-hidden />
            <div>
              <h3 className="ix-vow-title">Yours to export or delete</h3>
              <p className="ix-vow-copy">
                Take a full copy whenever you want. Delete your account and
                everything goes with it. No retention games.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* ════════════ CLOSING ════════════ */}
      <section className="ix-closing reveal" id="download">
        <div className="ix-closing-mark" data-parallax="0.06">
          <LiquidWordmark text="awekn" />
        </div>
        <p className="ix-closing-line">
          start the <span className="ix-serif">record</span>.
        </p>
        <a
          href={APP_STORE}
          target="_blank"
          rel="noopener noreferrer"
          className="ix-btn ix-btn-gold ix-closing-cta"
          data-magnetic
        >
          <AppleGlyph />
          Download on iOS
        </a>
        <p className="ix-closing-price">
          <span className="ix-mono">7 days free</span>, then{' '}
          <span className="ix-mono">$34.99</span>/yr or{' '}
          <span className="ix-mono">$5.99</span>/mo. everything included, no tiers.
        </p>
        <p className="ix-closing-fine">cancel anytime · prices vary by region</p>
      </section>

      {/* ════════════ FOOTER ════════════ */}
      <footer className="ix-footer">
        <div className="ix-footer-grid">
          <div className="ix-footer-brand">
            <div className="ix-footer-mark">awekn</div>
            <p className="ix-footer-tag">For those who return.</p>
          </div>
          <nav className="ix-footer-col" aria-label="The app">
            <h4>The app</h4>
            <a href="#showcase">See it work</a>
            <a href="#tracks">Everything</a>
            <a href="#disciplines">Disciplines</a>
            <a href="#year">The year</a>
          </nav>
          <nav className="ix-footer-col" aria-label="Reach">
            <h4>Reach</h4>
            <a href="mailto:areeb@awekn.com">Contact</a>
            <a
              href="https://www.instagram.com/awekn.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </nav>
          <nav className="ix-footer-col" aria-label="Legal">
            <h4>Legal</h4>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
            <a href="/delete-account">Delete account</a>
          </nav>
        </div>
        <div className="ix-footer-bottom">
          <span>&copy; {new Date().getFullYear()} awekn · Venex Labs</span>
          <span>the iron remembers</span>
        </div>
      </footer>
    </main>
  );
}
