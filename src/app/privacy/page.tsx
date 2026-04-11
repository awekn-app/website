import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — awekn",
  description: "Privacy Policy for awekn fitness tracking app.",
};

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <nav className="nav">
        <a href="/" className="nav-logo">awekn</a>
        <div className="nav-links">
          <a href="/">Home</a>
        </div>
      </nav>

      <div className="legal-container">
        <a href="/" className="legal-back">&larr; Back to home</a>
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-updated">Last updated: April 5, 2026</p>

        <div className="legal-content">
          <h2>1. Information We Collect</h2>
          <p>
            When you create an account, we collect your email address. When you use awekn, we store your workout data including exercises, sets, reps, weights, body measurements, personal records, and notes. All data is stored locally on your device and optionally synced to our secure cloud servers for cross-device access.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            Your data is used solely to provide the awekn fitness tracking service. We use your email for authentication and account recovery. Your workout data is used to display your progress, analytics, and history within the app. We do not sell, share, or distribute your personal data to third parties.
          </p>

          <h2>3. Data Storage and Security</h2>
          <p>
            Your workout data is stored locally on your device using SQLite encryption. Cloud sync uses Supabase with PostgreSQL, secured by Row Level Security (RLS) policies ensuring only you can access your data. All data transmission uses HTTPS/TLS encryption.
          </p>

          <h2>4. Data Retention and Deletion</h2>
          <p>
            Your data is retained as long as your account is active. You can delete your account at any time from Settings, which permanently removes all your data from both local storage and our servers. This action is irreversible.
          </p>

          <h2>5. Third-Party Services</h2>
          <p>
            awekn uses Supabase for authentication and cloud storage. We do not integrate with advertising networks, social media trackers, or analytics services that track individual users.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You have the right to access, export, and delete your data at any time. You can delete your account from the Settings screen. For data-related requests, contact us at{" "}
            <a href="mailto:areeb@awekn.com">areeb@awekn.com</a>.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any significant changes through the app or via email.
          </p>

          <h2>8. Contact</h2>
          <p>
            For questions about this privacy policy, contact us at{" "}
            <a href="mailto:areeb@awekn.com">areeb@awekn.com</a>.
          </p>
        </div>
      </div>

      <footer className="legal-footer">
        <p>&copy; {new Date().getFullYear()} awekn. All rights reserved.</p>
      </footer>
    </div>
  );
}
