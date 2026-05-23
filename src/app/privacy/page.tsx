import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy . awekn",
  description: "Privacy Policy for awekn. How we collect, use, store, and protect your data.",
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
        <p className="legal-updated">Last updated: May 23, 2026</p>

        <div className="legal-content">
          <p>
            This Privacy Policy describes how Venex Labs (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;awekn&rdquo;) collects, uses, and protects the information you provide when you use the awekn mobile app or visit awekn.com (collectively, the &ldquo;Service&rdquo;). The data controller is Venex Labs, registered in India, contact <a href="mailto:areeb@awekn.com">areeb@awekn.com</a>.
          </p>

          <h2>1. Information We Collect</h2>
          <p><strong>Account data.</strong> When you sign up, we collect your email address, chosen username, and (if you sign in with Apple or Google) the identifier your provider returns. If you sign in with Apple and choose to share your name, we store the name you return on first sign-in only.</p>
          <p><strong>Fitness and body data you enter.</strong> Workout sessions, exercises, sets, reps, weights, personal records, body measurements, body weight, body fat percentage, progress photos, cardio sessions, calorie and macro logs, water intake, journal notes, and any regimen entries you type. Regimen entries are free-text and never selected from a preset catalog. We store exactly what you type.</p>
          <p><strong>Camera and photo library.</strong> awekn uses your device camera when you tap &ldquo;Take a photo&rdquo; to capture a progress photo, a workout selfie, or a custom share-card background. awekn reads from your photo library when you tap &ldquo;Choose from library&rdquo; to pick one of those images. awekn writes to your photo library only when you tap &ldquo;Save&rdquo; on a finished share card. We never scan, enumerate, or upload photos you do not explicitly select.</p>
          <p><strong>Progress photos.</strong> If you choose to upload progress photos, the image file is stored in our Amazon Web Services (AWS S3) private bucket, keyed by your account identifier. Photos are never made public and are served only via short-lived signed links to you.</p>
          <p><strong>Apple HealthKit data (iOS only, optional).</strong> If you grant permission on iOS, awekn reads your step count and your walking and running distance from Apple Health in order to show daily activity in the Cardio section alongside your lifts. HealthKit data is processed on your device, surfaced in the awekn cardio log you control, and is never used for advertising, marketing, research, or sold to any third party. We read HealthKit only; awekn never writes to Apple Health. You can revoke HealthKit access at any time in iOS Settings, under Privacy &amp; Security, Health.</p>
          <p><strong>Google Health Connect data (Android only, optional).</strong> If you grant permission on Android, awekn reads your steps, distance, and active calories burned from Google Health Connect to surface daily activity in the Cardio section alongside your lifts. Health Connect acts as an on-device hub that may aggregate data from other apps and devices you have connected on your phone (for example Samsung Health, Fitbit, Garmin Connect, Mi Fitness, or a Pixel Watch). The data is processed on your device, surfaced in the awekn cardio log you control, and is never used for advertising, marketing, research, or sold to any third party. awekn reads from Health Connect only and never writes back. You can revoke Health Connect access at any time in the Health Connect app or under Android Settings, Apps, Health Connect. Health Connect is not available on Huawei (HMS) devices and on Android versions below 13; on those devices awekn falls back to manual cardio entry.</p>
          <p><strong>Purchase data.</strong> When you subscribe to awekn Pro, we receive from the Apple App Store (on iOS) or the Google Play Store (on Android), relayed through our subscription-management provider (RevenueCat), a transaction identifier, the subscription product, renewal and expiration timestamps, trial and grace-period flags, and refund status. We do not receive your credit-card number, bank details, Apple ID password, or Google account password. Those stay with Apple or Google respectively.</p>
          <p><strong>Device and diagnostic data.</strong> When the app encounters an unexpected error, we send a crash report to Sentry, our error-monitoring provider. These reports contain the stack trace, the device model and OS version, the app version, and a pseudonymous account identifier. Before any report is uploaded we scrub authentication tokens, signed storage URLs, and similar sensitive values. Sentry does not receive your fitness, body, nutrition, health, or photo data. We use Sentry strictly to find and fix crashes and do not use it for advertising, marketing, or behavioral analytics.</p>
          <p><strong>Product analytics.</strong> awekn uses PostHog, a privacy-friendly analytics processor, to understand at an aggregate level how users move through the app. When you open the app, sign up, view the paywall, start a trial, subscribe, or complete a workout, we send PostHog an event name (for example <code>app_opened</code>, <code>signup_completed</code>, <code>paywall_viewed</code>, <code>workout_completed</code>) along with a pseudonymous account identifier (your Supabase user id) and a small number of non-personal context fields (such as workout duration in seconds, exercise count, or whether the trial flag was set). PostHog never receives the names of foods you log, the values of your body measurements, your progress photos, your personal records, your custom regimen text, your push token, or your email. PostHog data is hosted in the United States. We use PostHog strictly to improve product flow, conversion, and user experience; PostHog does not perform cross-site tracking, ad targeting, or profile-building, and we do not sell PostHog data to third parties.</p>
          <p><strong>Transactional email.</strong> awekn uses Resend, an email delivery processor, to send only service-related emails tied to your account state: a welcome email shortly after you subscribe, a receipt at each successful renewal, an alert if your payment method has a billing issue, a reminder before your free trial ends, and a one-time offer to return if your subscription has expired. We send Resend your email address and a first-name token solely for delivery and personalization. Resend records the delivery status (delivered, bounced, deferred) for up to 90 days for diagnostic purposes and does not use the address for any other purpose. We do not send marketing newsletters, promotional broadcasts, or product announcements through Resend or any other channel.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your data solely to operate awekn: to authenticate you, to display your progress in the app, to sync your data across your devices if you choose, to grant or revoke your subscription entitlement, and to respond to your support requests. We do not sell, rent, trade, or share your personal data with advertisers or data brokers. Your fitness and health data is never used to train any machine-learning model.</p>

          <h2>3. Special-Category Health Data &mdash; GDPR Article 9 Disclosure</h2>
          <p>Some of the data you enter into awekn &mdash; specifically your <strong>body weight, body fat percentage, body measurements, progress photos, calorie and macronutrient intake, and any step or distance figures we read from Apple HealthKit or Google Health Connect</strong> &mdash; reveals information about your physical health. Under Article 9 of the EU General Data Protection Regulation (GDPR) and the equivalent provisions of the UK GDPR and Swiss FADP, this is &ldquo;special category&rdquo; (sensitive) personal data and requires a stronger legal basis than ordinary personal data.</p>
          <p>The legal basis we rely on for this special-category data is your <strong>explicit consent under Article 9(2)(a) GDPR</strong>. Before you create an account in the awekn app, we present a dedicated, unbundled consent screen that names the categories of health and body data we will process, the purposes (showing your progress to you, calculating maintenance calories, syncing across your devices), and the processors involved. We log this consent against your account with a timestamp and the policy version you accepted. You can withdraw this consent at any time from <strong>Settings &gt; Account &gt; Privacy &amp; Consents</strong>, which will delete the relevant categories of data from our systems. Withdrawal does not affect the lawfulness of processing before the withdrawal.</p>
          <p>Workout-only data (sets, reps, weights, exercises, RPE) is processed under contract (Article 6(1)(b) GDPR) and does not require Article 9 consent. We separate the two so that you can use the workout log without granting health-data consent, although several features (Maintenance Calculator, body composition charts, cardio strip) require Article 9 consent to function.</p>

          <h2>4. Legal Bases (GDPR, UK GDPR, Swiss FADP, India DPDP)</h2>
          <p>We process your data under the following legal bases:</p>
          <ul>
            <li><strong>Performance of the contract</strong> (GDPR Article 6(1)(b)) when you create an account, log workouts, subscribe to awekn Pro, and we deliver the corresponding service.</li>
            <li><strong>Explicit consent</strong> (GDPR Article 6(1)(a) and Article 9(2)(a)) when you grant the health-data consent described in Section 3, when you enable optional permissions such as Apple HealthKit, Google Health Connect, camera and photo library access, push notifications, or upload progress photos.</li>
            <li><strong>Legitimate interests</strong> (GDPR Article 6(1)(f)) for keeping the Service secure, detecting and preventing abuse, fixing crashes via Sentry, and understanding aggregate product usage via PostHog. We have weighed these interests against your privacy rights; the data shared is pseudonymous, minimized, and never used to build a behavioral profile or target you with advertising.</li>
            <li><strong>Compliance with legal obligations</strong> (GDPR Article 6(1)(c)) including Apple App Store and Google Play Store requirements, tax and accounting record-keeping for subscription transactions, and responses to lawful requests from public authorities.</li>
          </ul>

          <h2>5. Where Your Data Lives</h2>
          <p>Your data is stored in:</p>
          <ul>
            <li><strong>Supabase</strong> (PostgreSQL, hosted on AWS in the US East region) for your account, fitness logs, body measurements, subscriptions state, and all structured data. Access is gated by Row-Level Security so only you can read or write your own rows.</li>
            <li><strong>AWS S3</strong> (private bucket, US East region) for progress photo files. Photos are keyed by your account identifier and served only via short-lived signed URLs.</li>
            <li><strong>Your device</strong> (encrypted local SQLite) as a primary copy so awekn works offline. Local and cloud copies sync automatically when online.</li>
          </ul>

          <h2>6. Subprocessors</h2>
          <p>awekn uses the following subprocessors strictly to operate the Service. Each row lists the data shared, the purpose, the country where the data is hosted, and the legal mechanism we rely on for any transfer outside the European Economic Area, United Kingdom, or Switzerland.</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5em' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px 6px' }}>Subprocessor</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px 6px' }}>What they receive</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px 6px' }}>Host country</th>
                  <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: '8px 6px' }}>Transfer mechanism</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={{ padding: '8px 6px', verticalAlign: 'top' }}><strong>Supabase</strong> (database, auth, edge functions)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Account, fitness, body, nutrition, regimen, photos metadata</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>United States (AWS us-east-1)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Standard Contractual Clauses with published Transfer Impact Assessment (<a href="https://supabase.com/legal/dpa" target="_blank" rel="noopener noreferrer">DPA</a>)</td></tr>
                <tr><td style={{ padding: '8px 6px', verticalAlign: 'top' }}><strong>AWS</strong> (S3 progress-photo storage)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Progress photo image files</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>United States (us-east-1)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>EU&ndash;US Data Privacy Framework (certified, <a href="https://aws.amazon.com/compliance/eu-us-data-privacy-framework/" target="_blank" rel="noopener noreferrer">listing</a>) plus SCCs</td></tr>
                <tr><td style={{ padding: '8px 6px', verticalAlign: 'top' }}><strong>RevenueCat</strong> (subscription state)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>App-store transaction identifier, product, renewal/expiration timestamps, trial &amp; grace flags</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>United States</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Standard Contractual Clauses (<a href="https://www.revenuecat.com/dpa" target="_blank" rel="noopener noreferrer">DPA</a>)</td></tr>
                <tr><td style={{ padding: '8px 6px', verticalAlign: 'top' }}><strong>Resend</strong> (transactional email)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Email address, first name token, delivery status</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>United States</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>EU&ndash;US Data Privacy Framework (certified March 2025)</td></tr>
                <tr><td style={{ padding: '8px 6px', verticalAlign: 'top' }}><strong>Sentry</strong> (crash + error monitoring)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Stack traces, device model, OS, app version, pseudonymous user id</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>United States</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>EU&ndash;US Data Privacy Framework (certified)</td></tr>
                <tr><td style={{ padding: '8px 6px', verticalAlign: 'top' }}><strong>PostHog</strong> (product analytics)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Event names + non-PII context, pseudonymous user id</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>United States</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>EU&ndash;US Data Privacy Framework (certified)</td></tr>
                <tr><td style={{ padding: '8px 6px', verticalAlign: 'top' }}><strong>Apple</strong> (App Store, StoreKit, Sign in with Apple, HealthKit)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>iOS account creation, payment, optional HealthKit reads</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Apple-operated regions per Apple&rsquo;s policy</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Apple&rsquo;s own framework; HealthKit processed on-device only</td></tr>
                <tr><td style={{ padding: '8px 6px', verticalAlign: 'top' }}><strong>Google</strong> (Play Store, Play Billing, Sign in with Google, Health Connect)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Android account creation, payment, optional Health Connect reads</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Google-operated regions per Google&rsquo;s policy</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Google&rsquo;s own framework; Health Connect processed on-device only</td></tr>
                <tr><td style={{ padding: '8px 6px', verticalAlign: 'top' }}><strong>Vercel</strong> (awekn.com hosting only &mdash; no app data)</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>Page hits to awekn.com</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>United States</td><td style={{ padding: '8px 6px', verticalAlign: 'top' }}>EU&ndash;US Data Privacy Framework (certified)</td></tr>
              </tbody>
            </table>
          </div>
          <p>We do not integrate any advertising networks, behavioral analytics SDKs, or social-media pixels.</p>
          <p><strong>On-device data sources via Apple HealthKit and Google Health Connect.</strong> On iOS, HealthKit may relay data into awekn from other apps and devices you have separately connected on your phone (Apple Watch, third-party fitness trackers). On Android, Health Connect plays the same role for Samsung Health, Fitbit, Garmin Connect, Mi Fitness, Pixel Watch, and others. awekn does not have a direct integration or business relationship with any of these providers and only sees the data that you have permitted Apple Health or Health Connect to share, on your device.</p>

          <h2>7. Data Retention and Deletion</h2>
          <p>Your fitness, body, and account data is retained while your account is active. You may delete your account at any time from Settings &gt; Account &gt; Delete Account. Deletion permanently removes your profile, workout history, body logs, progress photos, regimen entries, and all other account-scoped rows from our database and from S3. This action is irreversible.</p>
          <p><strong>Username reservation after deletion.</strong> To prevent impersonation of returning users, we retain a one-way lowercase hash-equivalent of your chosen username in a reserved-usernames index after you delete your account. We do not retain the rest of your profile or any content. If you later return to the Service, you may reclaim your username by contacting us at <a href="mailto:areeb@awekn.com">areeb@awekn.com</a>.</p>
          <p><strong>Subscription records.</strong> Even after you delete your account, we may retain a minimal record of the anonymized subscription event (event id, product, timestamps) for up to 7 years where required for tax and audit obligations. These records do not identify you personally.</p>
          <p><strong>Consent log.</strong> The record of consents you have granted under Article 9(2)(a) GDPR (Section 3 above), including timestamps and policy versions, is retained for the lifetime of your account plus a further three years following account deletion, solely to demonstrate compliance with our accountability obligations under Article 5(2) GDPR. The record contains only your user identifier and the consent metadata; it does not contain the health data itself.</p>

          <h2>8. Your Rights</h2>
          <p>Subject to the law in your country of residence, you have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Right of access</strong> (GDPR Article 15): obtain a copy of the personal data we hold about you, with a description of how it is processed.</li>
            <li><strong>Right to rectification</strong> (Article 16): correct inaccurate or incomplete data.</li>
            <li><strong>Right to erasure</strong> (Article 17, the &ldquo;right to be forgotten&rdquo;): have your personal data deleted. Most of this is self-serve via Settings &gt; Account &gt; Delete Account.</li>
            <li><strong>Right to restriction of processing</strong> (Article 18) and <strong>right to object</strong> (Article 21).</li>
            <li><strong>Right to data portability</strong> (Article 20): receive your data in a structured, commonly used, machine-readable format. awekn provides a JSON export of your full account at Settings &gt; Account &gt; Export Data, in addition to a human-readable PDF report.</li>
            <li><strong>Right to withdraw consent</strong> (Article 7(3)) at any time, equally easily as it was given. Settings &gt; Account &gt; Privacy &amp; Consents lets you withdraw the Article 9(2)(a) explicit consent described in Section 3.</li>
            <li><strong>Right to lodge a complaint</strong> with your local supervisory authority. EU users may complain to the data-protection authority of their habitual residence; a directory is available at <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer">edpb.europa.eu</a>. UK users may complain to the <a href="https://ico.org.uk/" target="_blank" rel="noopener noreferrer">Information Commissioner&rsquo;s Office</a>. Swiss users to the <a href="https://www.edoeb.admin.ch/" target="_blank" rel="noopener noreferrer">FDPIC</a>.</li>
          </ul>
          <p>To exercise any of these rights, email <a href="mailto:areeb@awekn.com">areeb@awekn.com</a> from the address associated with your account. We respond within 30 days and may extend by a further 60 days for complex requests, telling you within the first 30 days if we need the extension. Exercising a right will not lead to any disadvantage in your use of the Service.</p>

          <h2>9. Subscription Auto-Renewal Disclosure</h2>
          <p>awekn Pro is a subscription purchased through the Apple App Store on iOS or the Google Play Store on Android. Payment is charged to your Apple ID or Google account respectively at confirmation of purchase and again at each renewal, unless you cancel at least 24 hours before the end of the current period. Prices are displayed in your local currency at the time of purchase. Your subscription automatically renews at the same price and period until cancelled.</p>
          <p>To manage or cancel your subscription at any time:</p>
          <ul>
            <li><strong>iOS:</strong> iPhone Settings, your Apple ID, Subscriptions.</li>
            <li><strong>Android:</strong> Google Play app, profile icon, Payments &amp; subscriptions, Subscriptions, awekn, Manage.</li>
          </ul>

          <h2>10. Children</h2>
          <p>awekn is rated 4+ and is not directed at children under 13. We do not knowingly collect personal data from children under 13. If you believe a child under 13 has provided us data, please contact us and we will delete it.</p>

          <h2>11. Security</h2>
          <p>All data transmission uses HTTPS/TLS. Database access is gated server-side by Row-Level Security. Photo uploads and downloads are routed through signed URLs generated by a privileged server function. Your phone never holds long-lived cloud credentials. We work to protect your data but cannot guarantee absolute security on the internet.</p>

          <h2>12. International Data Transfers</h2>
          <p>Your data is processed on infrastructure located in the United States (primarily AWS us-east-1, hosting Supabase and S3). The data controller, Venex Labs, is based in India. Where personal data of users located in the European Economic Area, the United Kingdom, or Switzerland is transferred outside their jurisdiction, we rely on the transfer mechanisms listed in the Subprocessors table in Section 6.</p>
          <p>For transfers from the EEA, UK, or Switzerland to the United States, we rely on each subprocessor&rsquo;s certification under the EU&ndash;US Data Privacy Framework (DPF) where available (AWS, Sentry, PostHog, Resend, Vercel) and on Standard Contractual Clauses with published Transfer Impact Assessments for the remainder (Supabase, RevenueCat). For data accessed by Venex Labs from India (a third country with no current EU adequacy decision), we apply the same Standard Contractual Clauses through our contracts with our US-hosted subprocessors, and we limit such access to the minimum necessary to operate the Service and respond to user support requests.</p>
          <p>You may obtain a copy of the relevant safeguards for any specific transfer by emailing <a href="mailto:areeb@awekn.com">areeb@awekn.com</a>.</p>

          <h2>13. Contacting Us as an EU, UK, or Swiss User</h2>
          <p>awekn is offered to users in the European Economic Area, the United Kingdom, and Switzerland, while the controller (Venex Labs) is established in India. GDPR Article 27, UK GDPR Article 27, and the Swiss FADP each contemplate an appointed local representative for non-domestic controllers in our position. We are a one-person independent studio and have not yet appointed a paid external representative. We will do so once subscription revenue supports it, and we will update this section with the representative&rsquo;s name, postal address, and email at that time.</p>
          <p>In the meantime, all rights described in Section 8 above remain fully available to you. Email <a href="mailto:areeb@awekn.com">areeb@awekn.com</a> from any address and we will respond within 30 days. You are also entitled at any time to lodge a complaint directly with the supervisory authority of your country of residence; we have linked the directories in Section 8. We commit to cooperating fully with any supervisory-authority enquiry.</p>

          <h2>14. Service Continuity and Wind-Down Commitment</h2>
          <p>We recognize that awekn holds months or years of your training data, that you pay for Pro access, and that you deserve confidence in what happens if we ever have to step away from a specific market or shut down the Service entirely. We commit to the following:</p>
          <ul>
            <li><strong>30-day notice.</strong> We will give you at least 30 days&rsquo; notice via in-app banner and email before any planned wind-down of the Service in your market.</li>
            <li><strong>Export remains available.</strong> The full data export (Settings &gt; Account &gt; Export Data) will remain available throughout the notice window and for at least 90 days after the Service ends, by emailing <a href="mailto:areeb@awekn.com">areeb@awekn.com</a> if the app itself is no longer reachable.</li>
            <li><strong>Pro-rated refunds for EU subscribers.</strong> If a wind-down happens during a paid period and your store (Apple or Google) declines to refund the unused portion, we will personally process a pro-rated refund outside the store for EEA, UK, and Swiss subscribers who request one within 60 days of the wind-down notice.</li>
            <li><strong>No silent transfers.</strong> We will not transfer your data to any acquirer or successor without notifying you first and giving you the chance to delete instead. Any transfer will preserve the protections in this Policy or use better ones.</li>
            <li><strong>Final deletion.</strong> 12 months after a final shutdown, we will permanently delete all remaining user data from our systems and instruct each subprocessor to do the same, subject only to retention required by tax law for anonymized subscription records.</li>
          </ul>

          <h2>15. Changes to This Policy</h2>
          <p>We may update this policy from time to time. We will change the &ldquo;Last updated&rdquo; date above and, if the changes are material, notify you in the app or by email. Material changes that affect the basis on which we process your health data will additionally trigger a fresh in-app consent prompt before processing continues under the new terms.</p>

          <h2>16. Contact</h2>
          <p>For any privacy question, data-subject request, or complaint, contact us at <a href="mailto:areeb@awekn.com">areeb@awekn.com</a>. The Service is operated by Venex Labs (India).</p>
        </div>
      </div>

      <footer className="legal-footer">
        <p>&copy; {new Date().getFullYear()} awekn by Venex Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}
