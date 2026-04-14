import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service . awekn",
  description: "Terms of Service for awekn fitness tracking app.",
};

export default function TermsOfService() {
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
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-updated">Last updated: April 5, 2026</p>

        <div className="legal-content">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By downloading, installing, or using awekn, you agree to be bound by these Terms of Service. If you do not agree, do not use the app.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            awekn is a fitness tracking application that allows users to log workouts, track body measurements, record personal records, and monitor fitness progress. The app supports both bodybuilding and powerlifting training modes.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You must create an account to use awekn. You are responsible for maintaining the confidentiality of your account credentials. You must provide a valid email address and accurate information.
          </p>

          <h2>4. User Content</h2>
          <p>
            You retain ownership of all data you enter into awekn, including workout logs, notes, and measurements. By using our cloud sync feature, you grant us a limited license to store and transmit your data solely for the purpose of providing the service.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>
            You agree not to misuse the service, attempt to gain unauthorized access to our systems, or use the app for any unlawful purpose. We reserve the right to suspend accounts that violate these terms.
          </p>

          <h2>6. Health Disclaimer</h2>
          <p>
            awekn is a fitness tracking tool, not a medical device or substitute for professional medical advice. Consult a healthcare provider before starting any exercise program. We are not responsible for any injuries sustained during workouts tracked with awekn.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            awekn is provided &quot;as is&quot; without warranty of any kind. We are not liable for any data loss, service interruptions, or damages arising from your use of the app. While we implement robust data protection measures, we cannot guarantee absolute data security.
          </p>

          <h2>8. Termination</h2>
          <p>
            You may terminate your account at any time by deleting it from the Settings screen. We may terminate or suspend your account if you violate these terms.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.
          </p>

          <h2>10. Contact</h2>
          <p>
            For questions about these terms, contact us at{" "}
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
