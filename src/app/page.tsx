'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import LiquidWordmark from './components/LiquidWordmark';
import LiveSet from './components/LiveSet';
import StrengthCurve from './components/StrengthCurve';
import { useMotion } from './lib/useMotion';

// The living cosmic ShaderGradient is client-only WebGL; load it after paint so
// the CSS fallback gradient + the content show instantly, then the shader streams in.
const CosmicBackground = dynamic(() => import('./components/CosmicBackground'), {
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

// The Android robot silhouette, drawn quiet — it never lights up (inert).
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

      {/* ════════════ NAV — liquid-glass pill ════════════ */}
      <nav className="ix-nav">
        <a href="#top" className="ix-nav-brand">awekn</a>
        <ol className="ix-nav-index" aria-label="Sections">
          <li>
            <a href="#record">
              <span className="ix-nav-num">01</span>The record
            </a>
          </li>
          <li>
            <a href="#disciplines">
              <span className="ix-nav-num">02</span>Two disciplines
            </a>
          </li>
          <li>
            <a href="#set">
              <span className="ix-nav-num">03</span>The set
            </a>
          </li>
          <li>
            <a href="#pricing">
              <span className="ix-nav-num">04</span>Pricing
            </a>
          </li>
        </ol>
        <a
          href={APP_STORE}
          target="_blank"
          rel="noopener noreferrer"
          className="ix-nav-cta"
        >
          Get the app
        </a>
      </nav>

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

        <p className="hero-sub ix-hero-sub">
          Training is a kind of <span className="ix-serif">devotion</span>.
        </p>

        <div className="hero-cta ix-hero-cta">
          <a
            href={APP_STORE}
            target="_blank"
            rel="noopener noreferrer"
            className="ix-btn ix-btn-gold"
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

        <a href="#record" className="ix-scroll-cue" aria-label="Scroll to begin">
          <span className="ix-scroll-line" aria-hidden />
          <span className="ix-scroll-word">begin the record</span>
        </a>
      </header>

      {/* ════════════ 01 · THE RECORD ════════════ */}
      <section className="ix-section ix-record" id="record">
        <div className="ix-section-head reveal">
          <span className="ix-eyebrow">
            <span className="ix-index-num">01</span>The record
          </span>
          <h2 className="ix-display">
            the iron <span className="ix-serif">remembers</span>
          </h2>
          <p className="ix-lede">
            Every session you keep is written down and never overwritten. The
            consistency you build, the streak you hold, the volume you move. A
            ledger of the work, kept honest by the numbers.
          </p>
        </div>

        <div className="ix-readout-grid reveal">
          <figure className="ix-stat">
            <figcaption className="ix-stat-label">Consistency</figcaption>
            <div className="ix-stat-value">
              <span className="ix-stat-num">87</span>
              <span className="ix-stat-unit">%</span>
            </div>
            <p className="ix-stat-note">days kept, this month</p>
          </figure>
          <figure className="ix-stat ix-stat-streak">
            <figcaption className="ix-stat-label">Current streak</figcaption>
            <div className="ix-stat-value">
              <span className="ix-stat-num">14</span>
              <span className="ix-stat-unit">days</span>
            </div>
            <p className="ix-stat-note">since you last missed</p>
          </figure>
          <figure className="ix-stat">
            <figcaption className="ix-stat-label">Volume moved</figcaption>
            <div className="ix-stat-value">
              <span className="ix-stat-num">75.9</span>
              <span className="ix-stat-unit">k kg</span>
            </div>
            <p className="ix-stat-note">across the last thirty days</p>
          </figure>
          <p className="ix-readout-caption">illustrative record</p>
        </div>
      </section>

      {/* ════════════ 02 · TWO DISCIPLINES ════════════ */}
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
          <article className="ix-card ix-card-bb reveal">
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
          </article>

          <article
            className="ix-card ix-card-pl reveal"
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
          </article>
        </div>
      </section>

      {/* ════════════ 03 · THE SET — the operable centerpiece ════════════ */}
      <section className="ix-section ix-set" id="set">
        <div className="ix-section-head ix-set-head reveal">
          <span className="ix-eyebrow">
            <span className="ix-index-num">03</span>The set
          </span>
          <h2 className="ix-display">
            log it like you <span className="ix-serif">mean it</span>
          </h2>
          <p className="ix-lede">
            This is the real row from the app, running right here. Drag the
            weight, hit the check, and watch the estimate climb. The moment is
            brief. The record is forever.
          </p>
        </div>

        <div className="ix-set-stage reveal">
          <LiveSet />
        </div>
      </section>

      {/* ════════════ 04 · STRENGTH ════════════ */}
      <section className="ix-section ix-strength">
        <div className="ix-section-head reveal">
          <span className="ix-eyebrow">
            <span className="ix-index-num">04</span>Strength
          </span>
          <h2 className="ix-display">
            your strength, <span className="ix-serif">plotted</span> in full
          </h2>
          <p className="ix-lede">
            Every exercise tells a curve. Every session is a point on it. Over
            weeks, the line rises, or it stalls. Either way, you will know.
          </p>
        </div>

        <div className="ix-strength-stage reveal">
          <StrengthCurve />
        </div>
      </section>

      {/* ════════════ PRICING ════════════ */}
      <section className="ix-section ix-pricing" id="pricing">
        <div className="ix-section-head ix-pricing-head reveal">
          <span className="ix-eyebrow">
            <span className="ix-index-num">·</span>Pricing
          </span>
          <h2 className="ix-display">
            one price, <span className="ix-serif">no maze</span>
          </h2>
          <p className="ix-lede">
            Everything is included. No tiers, no upsells, no ads. Seven days
            free, then a single subscription. Cancel any time.
          </p>
        </div>

        <div className="ix-price-pair reveal">
          <article className="ix-price ix-price-active" aria-label="Annual plan, pre-selected">
            <header className="ix-price-head">
              <span className="ix-price-name">Annual</span>
              <span className="ix-price-flag">7-day free trial</span>
            </header>
            <div className="ix-price-amount">
              <span className="ix-price-currency">$</span>
              <span className="ix-price-num">34.99</span>
              <span className="ix-price-cycle">/ yr</span>
            </div>
            <p className="ix-price-note">
              <span className="ix-mono">$2.92</span> a month, billed once a
              year. The way most lifters stay.
            </p>
            <a
              href={APP_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="ix-btn ix-btn-gold ix-price-cta"
            >
              <AppleGlyph />
              Start the free trial
            </a>
          </article>

          <article className="ix-price" aria-label="Monthly plan">
            <header className="ix-price-head">
              <span className="ix-price-name">Monthly</span>
            </header>
            <div className="ix-price-amount">
              <span className="ix-price-currency">$</span>
              <span className="ix-price-num">5.99</span>
              <span className="ix-price-cycle">/ mo</span>
            </div>
            <p className="ix-price-note">
              Billed every month. Same app, same access, more flexibility.
            </p>
            <a
              href={APP_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="ix-btn ix-btn-ghost ix-price-cta"
            >
              Choose monthly
            </a>
          </article>
        </div>

        <p className="ix-price-fine reveal">
          7-day free trial on both. Prices shown in USD; prices vary by region.
        </p>
      </section>

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
        <div className="ix-closing-mark">
          <LiquidWordmark text="awekn" />
        </div>
        <p className="ix-closing-line">
          Begin the <span className="ix-serif">record</span>.
        </p>
        <a
          href={APP_STORE}
          target="_blank"
          rel="noopener noreferrer"
          className="ix-btn ix-btn-gold ix-closing-cta"
        >
          <AppleGlyph />
          Download on iOS
        </a>
        <p className="ix-closing-fine">
          7-day free trial · prices vary by region
        </p>
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
            <a href="#record">The record</a>
            <a href="#disciplines">Disciplines</a>
            <a href="#set">The set</a>
            <a href="#pricing">Pricing</a>
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
