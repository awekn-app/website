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
      { threshold: 0.1 },
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const marqueeItems = [
    'bodybuilding',
    'powerlifting',
    'offline-first',
    'cosmic aesthetic',
    '8 themes',
    'per-user cloud photos',
    'journal heatmap',
    'sign in with apple',
    'sign in with google',
    'DOTS · Wilks · IPF GL',
    'meet planner',
    'RPE chart',
    'e1RM trends',
    'split cycles',
    'food search · USDA · OFF',
  ];

  return (
    <>
      {/* Fixed atmospheric backdrop — starfield + corner glows */}
      <div className="cosmos" aria-hidden />

      {/* ───────── NAV ───────── */}
      <nav className="nav">
        <a href="#" className="nav-logo">awekn</a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#themes">Themes</a>
          <a href="#pricing">Pricing</a>
          <a href="#download" className="nav-cta">Get the app</a>
        </div>
      </nav>

      {/* ───────── HERO ───────── */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-kicker">For serious lifters · Built 2026</span>
          <h1 className="hero-headline">
            Train in silence.<br />
            Track in <span className="em">full color.</span>
          </h1>
          <p className="hero-tagline">
            A workout tracker with the aesthetic of a premium watch app — built around
            a signature cosmic design system. Bodybuilding & powerlifting. Offline-first.
            Eight themes. Zero noise.
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
            <span>7-day trial</span>
            <span className="dot" />
            <span>No credit card</span>
            <span className="dot" />
            <span>$5.99/mo · $34.99/yr</span>
          </div>
        </div>

        {/* CSS phone mockup — journal day hero */}
        <div className="hero-right">
          <div className="phone" aria-hidden>
            <div className="phone-screen">
              <div className="phone-notch" />
              <div className="mock-journal">
                <div className="mock-topbar">
                  <div className="mock-arrow">‹</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div className="mock-arrow">‹</div>
                    <div className="mock-arrow">›</div>
                  </div>
                </div>
                <div className="mock-hero-label">MONDAY</div>
                <div className="mock-hero-day">14</div>
                <div className="mock-hero-month">OCTOBER 2026</div>
                <div className="mock-chips">
                  <span className="mock-chip c-workout">1 workout</span>
                  <span className="mock-chip c-nutri">nutrition</span>
                  <span className="mock-chip c-pr">1 pr</span>
                  <span className="mock-chip c-photo">1 photo</span>
                  <span className="mock-chip c-weight">weight</span>
                </div>

                <div className="mock-section-label">Workout</div>
                <div className="mock-card">
                  <div className="mock-card-title">push day</div>
                  <div className="mock-card-stats">
                    <div className="mock-stat">
                      <div className="mock-stat-value">42m</div>
                      <div className="mock-stat-label">Duration</div>
                    </div>
                    <div className="mock-stat">
                      <div className="mock-stat-value">12,450</div>
                      <div className="mock-stat-label">Volume</div>
                    </div>
                    <div className="mock-stat">
                      <div className="mock-stat-value">5</div>
                      <div className="mock-stat-label">Exercises</div>
                    </div>
                  </div>
                </div>

                <div className="mock-section-label" style={{ marginTop: 16 }}>Nutrition</div>
                <div className="mock-card">
                  <div className="mock-nutri-hero">2,543</div>
                  <div className="mock-kcal-label">KCAL · 6 meals</div>
                </div>
              </div>

              <div className="mock-tabbar">
                <div className="mock-tab"><div className="mock-tab-icon" /><span>Home</span></div>
                <div className="mock-tab"><div className="mock-tab-icon" /><span>Tracker</span></div>
                <div className="mock-tab active"><div className="mock-tab-icon" /><span>Journal</span></div>
                <div className="mock-tab"><div className="mock-tab-icon" /><span>Settings</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── MARQUEE ───────── */}
      <section className="marquee" aria-hidden>
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="marquee-item">{item}</span>
          ))}
        </div>
      </section>

      {/* ───────── JOURNAL (LEAD FEATURE) ───────── */}
      <section className="section" id="features">
        <div className="journal-section">
          <div className="journal-visual reveal">
            <div className="journal-heatmap-label">ACTIVITY · LAST 84 DAYS</div>
            <div className="journal-heatmap-title">Every day. Seen at a glance.</div>
            <div className="journal-heatmap">
              {Array.from({ length: 84 }).map((_, i) => {
                const intensity = [0, 0, 1, 2, 0, 3, 2, 1, 0, 2, 4, 3, 2, 1, 3, 4, 2, 0, 1, 3, 2, 4, 3, 1, 2, 0, 3, 4, 2, 1, 0, 2, 3, 1, 4, 2, 0, 1, 3, 2, 4, 3, 1, 2, 0, 3, 4, 2, 1, 3, 0, 2, 4, 1, 3, 2, 0, 1, 3, 4, 2, 1, 0, 2, 3, 4, 1, 2, 0, 3, 1, 4, 2, 3, 1, 0, 2, 4, 3, 1, 2, 0, 3, 2][i];
                return <div key={i} className={`heat-cell ${intensity ? `l${intensity}` : ''}`} />;
              })}
            </div>
            <div className="journal-legend">
              Less
              <div className="journal-legend-cells">
                <div className="heat-cell" />
                <div className="heat-cell l1" />
                <div className="heat-cell l2" />
                <div className="heat-cell l3" />
                <div className="heat-cell l4" />
              </div>
              More
            </div>
          </div>
          <div className="reveal">
            <div className="eyebrow"><span className="eyebrow-num">01</span> Journal</div>
            <h2 className="section-title">Your training, told as a story.</h2>
            <p className="section-subtitle">
              Not a dashboard of numbers — a <em style={{ color: 'var(--white)', fontStyle: 'normal' }}>journal</em>.
              Activity heatmap, then tap any day: workout · nutrition · PRs · photos · weight · measurements · cardio · notes —
              unified in one cinematic timeline with the signature cosmic hero on the day number.
            </p>
          </div>
        </div>
      </section>

      {/* ───────── FEATURE GRID ───────── */}
      <section className="section">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">02</span> Core</div>
          <h2 className="section-title">
            Everything you need. <span style={{ color: 'var(--text-dim)' }}>Nothing you don&apos;t.</span>
          </h2>
        </div>
        <div className="feature-grid">
          {[
            {
              title: 'Log workouts in seconds',
              desc: 'Sets, reps, weight — tap and done. Smart defaults from your last session. Custom splits with unlimited days.',
              tags: ['warmup', 'working', 'drop', 'failure', 'amrap'],
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 8h4M4 16h4M16 8h4M16 16h4M8 12h8" strokeLinecap="round" /></svg>,
            },
            {
              title: 'Analytics that mean something',
              desc: 'Strength curves per exercise. Volume deltas session over session. Best sets ranked. Exercise sparklines + trend arrows.',
              tags: ['2W', '1M', '3M', '1Y', 'all time'],
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 17l6-6 4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
            },
            {
              title: 'Track everything else',
              desc: 'Body weight with goal + body-fat. Calories + macros including custom. Measurements. Cardio. Photos. Notes.',
              tags: ['protein', 'carbs', 'fats', 'fiber', 'water'],
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 3v9l6 6" strokeLinecap="round" /></svg>,
            },
            {
              title: 'Powerlifting, done right',
              desc: 'S/B/D maxes + rolling e1RM. Meet planner with attempt selections. Red-light memory. Attempt learning engine.',
              tags: ['DOTS', 'Wilks', 'IPF GL', 'RPE'],
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="4" height="4" rx="1" /><rect x="18" y="10" width="4" height="4" rx="1" /><path d="M6 12h12" strokeLinecap="round" /></svg>,
            },
            {
              title: 'Offline-first. Synced everywhere.',
              desc: 'Every read and write goes to the local device first. Syncs to the cloud automatically in the background. Cross-device.',
              tags: ['iOS', 'Android', 'SQLite', 'Supabase'],
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4v8m0 0l-3-3m3 3l3-3M5 17a4 4 0 010-8 5 5 0 019-3 5 5 0 016 4 4 4 0 010 7" strokeLinecap="round" strokeLinejoin="round" /></svg>,
            },
            {
              title: 'Sign in your way',
              desc: 'Email + password, Sign in with Apple, Sign in with Google. Whatever works. Trial tracked server-side, tamper-proof.',
              tags: ['apple', 'google', 'email', '7-day trial'],
              icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 10a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" strokeLinecap="round" /></svg>,
            },
          ].map((f, i) => (
            <div key={i} className="feature-card reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
              <div className="feature-tags">
                {f.tags.map((t, j) => <span key={j} className="feature-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── MODES SPLIT ───────── */}
      <section className="section">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">03</span> Two Modes</div>
          <h2 className="section-title">
            Bodybuilding.<br />
            <span style={{ color: 'var(--text-dim)' }}>Powerlifting.</span>
          </h2>
          <p className="section-subtitle">Switch between modes with one tap. Each purpose-built for how you actually train.</p>
        </div>
        <div className="modes-split reveal">
          <div className="mode-half bb">
            <span className="mode-badge">Bodybuilding</span>
            <h3 className="mode-title">Build the physique</h3>
            <p className="mode-sub">Splits, volume, and a strength chart for every exercise you&apos;ve ever done.</p>
            <ul className="mode-features">
              <li>Split presets — PPL, Arnold, Upper/Lower, Bro, 3/4/5-day, custom</li>
              <li>120+ exercise library with bodyweight toggle</li>
              <li>Drag-and-drop reorder + supersets</li>
              <li>Cycle tracking with skip, complete, reset, advance</li>
              <li>Volume tracking + session deltas</li>
            </ul>
          </div>
          <div className="mode-half pl">
            <span className="mode-badge">Powerlifting</span>
            <h3 className="mode-title">Chase the total</h3>
            <p className="mode-sub">The only app with red-light memory, attempt learning, and a lift setup profile you can pre-lift in 5 seconds.</p>
            <ul className="mode-features">
              <li>S/B/D maxes + rolling e1RM + trends graph</li>
              <li>RPE per set + % of 1RM + e1RM calculator</li>
              <li>DOTS, Wilks, IPF GL scoring</li>
              <li>Meet planner + attempt selections + red-light memory</li>
              <li>Pre-lift setup profile (rack, stance, grip, cues)</li>
              <li>Plate calculator + warm-up generator + daily readiness</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── THEMES SHOWCASE ───────── */}
      <section className="section" id="themes">
        <div className="reveal">
          <div className="eyebrow"><span className="eyebrow-num">04</span> Aesthetics</div>
          <h2 className="section-title">
            Eight themes. <span style={{ color: 'var(--text-dim)' }}>All signed off by a designer.</span>
          </h2>
          <p className="section-subtitle">
            Every theme has its own canvas, typography weight, and palette tuned end-to-end — not recolored.
            Switch in Settings → Appearance.
          </p>
        </div>
        <div className="theme-grid">
          {[
            { c: 't-dark',        name: 'Dark',           d: 'The default · emerald accent' },
            { c: 't-cosmic-blue', name: 'Cosmic Blue',    d: 'Pure black · dark blue type' },
            { c: 't-obsidian',    name: 'Obsidian Gold',  d: 'Luxury · champagne gold' },
            { c: 't-sage',        name: 'Midnight Sage',  d: 'Organic · forest green' },
            { c: 't-graphite',    name: 'Graphite',       d: 'Minimalist · single orange' },
            { c: 't-light',       name: 'Light',          d: 'Clean · iOS-style' },
            { c: 't-dune',        name: 'Dune',           d: 'Literary · warm cream' },
            { c: 't-baddie',      name: 'Baddie',         d: 'Hot pink · gym-girl energy' },
          ].map((t, i) => (
            <div key={t.c} className={`theme-card ${t.c} reveal`} style={{ transitionDelay: `${i * 0.05}s` }}>
              <div>
                <div className="theme-name">{t.name}</div>
                <div className="theme-desc">{t.d}</div>
              </div>
              <div className="theme-swatches">
                <div className="theme-swatch" />
                <div className="theme-swatch" />
                <div className="theme-swatch" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── PRICING ───────── */}
      <section className="section" id="pricing">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-num">05</span> Pricing
          </div>
          <h2 className="section-title" style={{ margin: '0 auto' }}>Transparent. No gimmicks.</h2>
          <p className="section-subtitle" style={{ margin: '18px auto 0' }}>
            Seven days free with full access. No credit card to start. Pick a plan if you want to keep going.
          </p>
        </div>
        <div className="pricing-grid">
          <div className="price-card reveal">
            <div className="price-plan">Monthly</div>
            <div className="price-amount">$5.99</div>
            <span className="price-per">per month · billed monthly</span>
            <ul className="price-list">
              <li>Full workout + analytics engine</li>
              <li>All 8 themes</li>
              <li>Cross-device sync + cloud photos</li>
              <li>All powerlifting tools (DOTS, e1RM, meet planner)</li>
              <li>Cancel anytime</li>
            </ul>
            <a href="#download" className="price-btn ghost">Start 7-day trial</a>
          </div>
          <div className="price-card featured reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="price-plan">Annual</div>
            <div className="price-amount">$34.99</div>
            <span className="price-per">per year · $2.92/mo effective</span>
            <ul className="price-list">
              <li>Everything in Monthly</li>
              <li>Save 51% vs monthly</li>
              <li>Priority support</li>
              <li>First access to new features</li>
              <li>Cancel anytime</li>
            </ul>
            <a href="#download" className="price-btn primary">Start 7-day trial</a>
          </div>
        </div>
        <p className="price-locale">India: ₹149/month · ₹999/year · launch pricing</p>
      </section>

      {/* ───────── MANIFESTO ───────── */}
      <section className="manifesto-section">
        <h2 className="manifesto-quote reveal">
          Built different.<br />
          <span className="dim">No feeds. No coaches. No distractions.</span>
        </h2>
        <p className="manifesto-body reveal">
          Just your lifts, your numbers, your progress — tracked with precision and
          shown with clarity. Every rep counted. Every gain visible.
        </p>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="section">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>
            <span className="eyebrow-num">06</span> FAQ
          </div>
          <h2 className="section-title" style={{ margin: '0 auto' }}>Questions worth asking.</h2>
        </div>
        <div className="faq-list">
          {[
            { q: 'Is awekn actually free?', a: 'You get 7 days free with full access to every feature. No credit card to start. After that, $5.99/month or $34.99/year — ₹149/₹999 in India. Cancel anytime.' },
            { q: 'Does it work offline?', a: 'Yes. Every read and write hits your local device first. Cloud sync happens automatically in the background when you have internet. You can log workouts on a plane and everything syncs when you land.' },
            { q: 'How do I sign in?', a: 'Email + password, Sign in with Apple, or Sign in with Google. All three are first-class. Your choice.' },
            { q: 'Can one account use both bodybuilding and powerlifting?', a: 'Yes. Switch modes with one tap. Each has purpose-built features — BB has split presets and volume tracking, PL has RPE, scoring calculators, meet planning, and the lift setup profile.' },
            { q: 'What about my photos — where are they stored?', a: 'Per-user folders in an S3 bucket we control. Each photo is compressed to 1920px before upload. Delete cascades on the device remove the cloud copy too.' },
            { q: 'Will my data sync across devices?', a: 'Yes — workouts, weight, photos, notes, PRs, measurements, everything. Sign in on any device and it all appears.' },
            { q: 'What themes do I get?', a: 'Eight. Dark, Light, Cosmic Blue, Obsidian Gold, Midnight Sage, Dune, Graphite, Baddie — plus System. All tuned end-to-end, not just recolored.' },
            { q: 'Can I cancel anytime?', a: 'Yes. Through the App Store or Google Play. You keep access until the end of your billing period.' },
          ].map((item, i) => (
            <details key={i} className="faq-item reveal" style={{ transitionDelay: `${i * 0.04}s` }}>
              <summary className="faq-question">{item.q}</summary>
              <p className="faq-answer">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ───────── CLOSING CTA ───────── */}
      <section className="closing" id="download">
        <h2 className="closing-title">awekn.</h2>
        <p className="closing-sub">Available on iOS and Android. Start your 7-day free trial.</p>
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

      {/* ───────── FOOTER ───────── */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">awekn</div>
            <p>Track. Log. Analyse. Conquer. The workout tracker with the aesthetic of a premium watch app.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#themes">Themes</a>
            <a href="#pricing">Pricing</a>
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
          <span>Made for lifters who don&apos;t quit.</span>
        </div>
      </footer>
    </>
  );
}
