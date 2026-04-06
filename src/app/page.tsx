'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
      });
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
          <a href="#pricing">Pricing</a>
          <a href="#download" className="nav-cta">Download</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/splash.png" alt="awekn" />
          <div className="hero-gradient" />
        </div>
        <div className="hero-content">
          <h1 className="hero-logo">awekn</h1>
          <p className="hero-tagline">
            Track. Log. Analyse. Conquer.<br />
            The only workout tracker built for serious lifters.
          </p>
          <div className="hero-buttons">
            <a href="#download" className="btn-primary">Download Free</a>
            <a href="#features" className="btn-secondary">See Features</a>
          </div>
        </div>
        <div className="hero-scroll">Scroll</div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <p className="section-label reveal">Everything you need</p>
        <h2 className="section-title reveal">Built for lifters, not influencers</h2>
        <p className="section-subtitle reveal">
          No fluff. No gimmicks. Just your lifts, your numbers, your progress — tracked with precision and shown with clarity.
        </p>
        <div className="features-grid">
          {[
            { icon: '🏋️‍♂️', title: 'Workout Logging', desc: 'Log sets, reps, and weight in seconds. Smart defaults from your last session. Resume any workout.' },
            { icon: '📊', title: 'Advanced Analytics', desc: 'Strength charts, exercise sparklines, session deltas, best sets. See your progress over any time range.' },
            { icon: '🔥', title: 'Calorie & Macros', desc: 'Track calories, protein, carbs, fats, fiber, and custom macros. Graphs for every metric.' },
            { icon: '📈', title: 'Body Tracking', desc: 'Weight, measurements, personal records, cardio. Every number in one place with trend analysis.' },
            { icon: '🔄', title: 'Cross-Device Sync', desc: 'Offline-first. Works without internet. Syncs across iPhone, Android, and any device automatically.' },
            { icon: '📝', title: 'Notes', desc: 'Unlimited workout notes. Write down thoughts, plans, or anything. Timestamped and synced.' },
            { icon: '🎯', title: 'Custom Splits', desc: 'Unlimited days, unlimited exercises. Build your exact program. Bodybuilding presets or fully custom.' },
            { icon: '⏱️', title: 'Cycle Tracking', desc: 'Track your cycle progress. Skip days, mark complete, reset. Visual progress bar per cycle.' },
            { icon: '🌙', title: '3 Premium Themes', desc: 'Dark (cosmic), Light (clean), Baddie (pink). Each one crafted. System theme auto-switch.' },
          ].map((f, i) => (
            <div key={i} className="feature-card reveal" style={{ transitionDelay: `${i * 0.05}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MODES */}
      <section className="modes" id="modes">
        <p className="section-label reveal">Two modes. One app.</p>
        <h2 className="section-title reveal">Bodybuilding & Powerlifting</h2>
        <p className="section-subtitle reveal">
          Switch between modes with one tap. Each mode is purpose-built with features that matter.
        </p>
        <div className="modes-grid">
          <div className="mode-card mode-bb reveal">
            <img src="/statue-back.jpg" alt="Bodybuilding" />
            <div className="mode-overlay" />
            <div className="mode-content">
              <span className="mode-badge">Bodybuilding</span>
              <h3 className="mode-title">Build the physique</h3>
              <p className="mode-desc">
                Split presets (PPL, Arnold, Upper/Lower), exercise library with 120+ exercises, set completion tracking, volume analytics, and detailed exercise history graphs.
              </p>
            </div>
          </div>
          <div className="mode-card mode-pl reveal" style={{ transitionDelay: '0.1s' }}>
            <img src="/statue-atlas.jpg" alt="Powerlifting" />
            <div className="mode-overlay" />
            <div className="mode-content">
              <span className="mode-badge">Powerlifting</span>
              <h3 className="mode-title">Chase the total</h3>
              <p className="mode-desc">
                S/B/D maxes, RPE logging, plate calculator, DOTS/Wilks/IPF GL scoring, meet tracker with attempt planner, RPE-to-percentage chart, e1RM calculator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto reveal">
        <h2 className="manifesto-text">Built different.</h2>
        <p className="manifesto-sub">
          No features you will never use. No distractions. Just your lifts, your numbers, your progress. Every rep counted. Every gain visible. Nothing in between.
        </p>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <p className="section-label reveal">Simple pricing</p>
        <h2 className="section-title reveal">3 days free. Then choose your plan.</h2>
        <p className="section-subtitle reveal">Full access from day one. No credit card required for trial.</p>
        <div className="pricing-grid">
          <div className="price-card reveal">
            <p className="price-plan">Monthly</p>
            <p className="price-amount">$2.50</p>
            <p className="price-period">per month</p>
            <ul className="price-features">
              <li>Everything unlimited</li>
              <li>All features included</li>
              <li>Cross-device sync</li>
              <li>All themes</li>
              <li>Cancel anytime</li>
            </ul>
            <button className="price-btn price-btn-secondary">Get Started</button>
          </div>
          <div className="price-card popular reveal" style={{ transitionDelay: '0.1s' }}>
            <span className="price-badge">SAVE 33%</span>
            <p className="price-plan">Yearly</p>
            <p className="price-amount">$20</p>
            <p className="price-period">$1.67/month</p>
            <ul className="price-features">
              <li>Everything unlimited</li>
              <li>All features included</li>
              <li>Cross-device sync</li>
              <li>All themes</li>
              <li>Best value</li>
            </ul>
            <button className="price-btn price-btn-primary">Get Started</button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="download">
        <div className="cta-bg"><img src="/statue-pillar.jpg" alt="" /></div>
        <div className="cta-content">
          <h2 className="cta-title reveal">Ready to awekn?</h2>
          <p className="cta-sub reveal">Available on iOS and Android. Start your free trial today.</p>
          <div className="hero-buttons reveal">
            <a href="#" className="btn-primary">App Store</a>
            <a href="#" className="btn-secondary">Google Play</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p className="footer-logo">awekn</p>
        <div className="footer-links">
          <a href="mailto:areeb@awekn.com">Contact</a>
          <a href="https://www.instagram.com/awekn.app" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} awekn. All rights reserved.</p>
      </footer>
    </>
  );
}
