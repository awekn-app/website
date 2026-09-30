import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "../lib/links";

export const metadata: Metadata = {
  title: "Support · Awekn",
  description: "Help with Awekn: your account, subscription, syncing, Apple Health, and how to reach the founder.",
  alternates: { canonical: "https://awekn.com/support" },
};

// Apple asks every app for a Support URL: this is it. Answers first, then a real person.
export default function Support() {
  return (
    <div className="legal-page">
      <nav className="nav">
        <a href="/" className="nav-logo">awekn</a>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="https://app.awekn.com/sign-in">Log in</a>
        </div>
      </nav>

      <div className="legal-container">
        <a href="/" className="legal-back">&larr; Back to home</a>
        <h1 className="legal-title">Support</h1>
        <p className="legal-updated">A real person reads every message, usually within a day.</p>

        <div className="legal-content">
          <h2>Write to us</h2>
          <p>
            Email <a href={`mailto:${SUPPORT_EMAIL}?subject=Awekn%20support`}>{SUPPORT_EMAIL}</a>. Tell us your
            phone, the app version (Settings, at the bottom) and what happened. A screenshot helps.
          </p>

          <h2>My subscription</h2>
          <ul>
            <li><strong>Cancel or change a plan</strong>: on iPhone, the Settings app, your name, Subscriptions, Awekn. Apple handles billing, so a plan is changed there.</li>
            <li><strong>Pro not showing after you paid</strong>: in Awekn, Settings, Restore purchases.</li>
            <li><strong>A refund</strong>: Apple decides refunds at reportaproblem.apple.com.</li>
          </ul>

          <h2>My data</h2>
          <ul>
            <li><strong>It is on your phone first</strong>, and syncs to your account when you are online. Sign in on a new phone and it comes back.</li>
            <li><strong>Export everything</strong>: Settings, Account, Export data.</li>
            <li><strong>Delete your account</strong>: see <a href="/delete-account">how to delete your account</a>. It removes your data from the phone and our servers.</li>
          </ul>

          <h2>Apple Health and steps</h2>
          <ul>
            <li>Allow Awekn in the Health app: Sharing, Apps, Awekn, turn on Steps and the rest.</li>
            <li>Steps can lag a few minutes behind the Health app; opening Awekn refreshes them.</li>
          </ul>

          <h2>Privacy</h2>
          <p>
            Read the <a href="/privacy">privacy policy</a> and the <a href="/terms">terms</a>.
          </p>
        </div>
      </div>

      <footer className="legal-footer">
        <p>&copy; {new Date().getFullYear()} awekn by Venex Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}
