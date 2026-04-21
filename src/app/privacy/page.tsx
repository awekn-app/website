import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy . awekn",
  description: "Privacy Policy for awekn — how we collect, use, store, and protect your data.",
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
        <p className="legal-updated">Last updated: April 21, 2026</p>

        <div className="legal-content">
          <p>
            This Privacy Policy describes how Venex Labs (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;awekn&rdquo;) collects, uses, and protects the information you provide when you use the awekn mobile app or visit awekn.com (collectively, the &ldquo;Service&rdquo;). By using the Service you consent to the practices described here.
          </p>

          <h2>1. Information We Collect</h2>
          <p><strong>Account data</strong> — when you sign up, we collect your email address, chosen username, and (if you sign in with Apple or Google) the identifier your provider returns. If you sign in with Apple and choose to share your name, we store the name you return on first sign-in only.</p>
          <p><strong>Fitness and body data you enter</strong> — workout sessions, exercises, sets, reps, weights, personal records, body measurements, body weight, body fat percentage, progress photos, cardio sessions, calorie and macro logs, water intake, journal notes, and any regimen entries you type. Regimen entries are free-text and never selected from a preset catalog — we store exactly what you type.</p>
          <p><strong>Progress photos</strong> — if you choose to upload progress photos, the image file is stored in our Amazon Web Services (AWS S3) private bucket, keyed by your account identifier. Photos are never made public and are served only via short-lived signed links to you.</p>
          <p><strong>Apple HealthKit data (optional)</strong> — if you grant permission, awekn reads your steps, walking/running distance, and cycling distance from Apple Health in order to auto-log cardio sessions in the app. HealthKit data is processed on your device, written to the awekn cardio log you control, and is never used for advertising, marketing, research, or sold to any third party. You can revoke HealthKit access at any time in iOS Settings → Privacy &amp; Security → Health.</p>
          <p><strong>Purchase data</strong> — when you subscribe to awekn Pro, we receive from Apple and from our subscription-management provider (RevenueCat) a transaction identifier, subscription product, renewal and expiration timestamps, trial and grace-period flags, and refund status. We do not receive your credit-card number, bank details, or Apple ID password — those stay with Apple.</p>
          <p><strong>Device and diagnostic data</strong> — when the app encounters an unexpected error, the app&rsquo;s on-device logs remain on your device. We do not integrate a third-party crash reporter or analytics SDK that tracks individual users.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your data solely to operate awekn: to authenticate you, to display your progress in the app, to sync your data across your devices if you choose, to grant or revoke your subscription entitlement, and to respond to your support requests. We do not sell, rent, trade, or share your personal data with advertisers or data brokers. Your fitness and health data is never used to train any machine-learning model.</p>

          <h2>3. Legal Bases (GDPR / UK GDPR / India DPDP)</h2>
          <p>We process your data under the following legal bases: (a) performance of the contract between you and awekn when you create an account and subscribe; (b) your consent when you grant optional permissions such as Apple HealthKit or progress-photo upload; (c) our legitimate interests in keeping the Service secure, operable, and free of abuse; and (d) compliance with legal obligations including Apple App Store requirements.</p>

          <h2>4. Where Your Data Lives</h2>
          <p>Your data is stored in:</p>
          <ul>
            <li><strong>Supabase</strong> (PostgreSQL, hosted on AWS in the East US region) for your account, fitness logs, body measurements, subscriptions state, and all structured data. Access is gated by Row-Level Security so only you can read or write your own rows.</li>
            <li><strong>AWS S3</strong> (private bucket) for progress photo files. Photos are keyed by your account identifier and served only via short-lived signed URLs.</li>
            <li><strong>Your device</strong> (encrypted local SQLite) as a primary copy so awekn works offline. Local and cloud copies sync automatically when online.</li>
          </ul>

          <h2>5. Third-Party Services We Rely On</h2>
          <p>awekn uses the following processors strictly to operate the Service:</p>
          <ul>
            <li><strong>Supabase</strong> — authentication, database, and server-side functions.</li>
            <li><strong>RevenueCat</strong> — subscription-state management and server-to-server notifications from Apple.</li>
            <li><strong>Apple (App Store, StoreKit, Sign in with Apple, HealthKit)</strong> — account creation, payment processing, subscription management, and optional HealthKit data.</li>
            <li><strong>Google</strong> — Sign in with Google (if you choose that method).</li>
            <li><strong>Amazon Web Services (S3)</strong> — progress photo storage.</li>
            <li><strong>Vercel</strong> — hosting for awekn.com.</li>
          </ul>
          <p>We do not integrate any advertising networks, third-party analytics trackers, or social-media pixels.</p>

          <h2>6. Data Retention and Deletion</h2>
          <p>Your fitness, body, and account data is retained while your account is active. You may delete your account at any time from Settings &rarr; Account &rarr; Delete Account. Deletion permanently removes your profile, workout history, body logs, progress photos, regimen entries, and all other account-scoped rows from our database and from S3. This action is irreversible.</p>
          <p><strong>Username reservation after deletion</strong> — to prevent impersonation of returning users, we retain a one-way lowercase hash-equivalent of your chosen username in a reserved-usernames index after you delete your account. We do not retain the rest of your profile or any content. If you later return to the Service, you may reclaim your username by contacting us at <a href="mailto:areebghani359@gmail.com">areebghani359@gmail.com</a>.</p>
          <p><strong>Subscription records</strong> — even after you delete your account, we may retain a minimal record of the anonymized subscription event (event id, product, timestamps) for up to 7 years where required for tax and audit obligations. These records do not identify you personally.</p>

          <h2>7. Your Rights</h2>
          <p>Depending on where you live, you have the right to access, correct, export, or delete your personal data, to object to or restrict certain processing, and to lodge a complaint with your local data-protection authority. To exercise any of these rights, email <a href="mailto:areebghani359@gmail.com">areebghani359@gmail.com</a> from the address associated with your account. We will respond within 30 days. You can also perform most of these actions yourself from within the app under Settings &rarr; Account.</p>

          <h2>8. Subscription Auto-Renewal Disclosure</h2>
          <p>awekn Pro is a subscription purchased through the Apple App Store. Payment is charged to your Apple ID at confirmation of purchase and again at each renewal, unless you cancel at least 24 hours before the end of the current period. Prices are displayed in your local currency at the time of purchase. Your subscription automatically renews at the same price and period until cancelled. You can manage or cancel your subscription at any time in iPhone Settings &rarr; your Apple ID &rarr; Subscriptions.</p>

          <h2>9. Children</h2>
          <p>awekn is rated 4+ and is not directed at children under 13. We do not knowingly collect personal data from children under 13. If you believe a child under 13 has provided us data, please contact us and we will delete it.</p>

          <h2>10. Security</h2>
          <p>All data transmission uses HTTPS/TLS. Database access is gated server-side by Row-Level Security. Photo uploads and downloads are routed through signed URLs generated by a privileged server function — your phone never holds long-lived cloud credentials. We work to protect your data but cannot guarantee absolute security on the internet.</p>

          <h2>11. International Transfers</h2>
          <p>Your data is stored on servers in the United States (AWS East). If you are located outside the US, by using awekn you consent to the transfer and processing of your data in the US, which may have different data-protection laws than your country.</p>

          <h2>12. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will change the &ldquo;Last updated&rdquo; date above and, if the changes are material, notify you in the app or by email.</p>

          <h2>13. Contact</h2>
          <p>For any privacy question or request, contact us at <a href="mailto:areebghani359@gmail.com">areebghani359@gmail.com</a>. Venex Labs operates the Service. You may also write to us via the same address for data subject requests under GDPR, UK GDPR, or India&rsquo;s DPDP Act.</p>
        </div>
      </div>

      <footer className="legal-footer">
        <p>&copy; {new Date().getFullYear()} awekn by Venex Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}
