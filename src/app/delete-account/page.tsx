import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Your Account . awekn",
  description: "How to delete your awekn account and associated data.",
};

export default function DeleteAccount() {
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
        <h1 className="legal-title">Delete Your Account</h1>
        <p className="legal-updated">Last updated: April 15, 2026</p>

        <div className="legal-content">
          <h2>How to Delete Your awekn Account</h2>
          <p>
            You can delete your awekn account and all associated data directly from within the app. This removes your data from both your device and our cloud servers. The deletion is permanent and cannot be undone.
          </p>

          <h2>Option 1: Delete from the App (recommended)</h2>
          <ol>
            <li>Open the awekn app on your phone</li>
            <li>Tap the <strong>Settings</strong> tab in the bottom navigation</li>
            <li>Tap <strong>Account</strong></li>
            <li>Scroll to the bottom and tap <strong>Delete Account</strong></li>
            <li>Confirm the deletion when prompted</li>
          </ol>
          <p>
            Your account and all data will be deleted immediately.
          </p>

          <h2>Option 2: Request Deletion by Email</h2>
          <p>
            If you cannot access the app, send an email to{" "}
            <a href="mailto:areeb@awekn.com?subject=Account%20Deletion%20Request">areeb@awekn.com</a>{" "}
            with the subject line &quot;Account Deletion Request&quot; and include the email address associated with your awekn account. We will process your request within 7 business days.
          </p>

          <h2>What Data Gets Deleted</h2>
          <p>Deleting your account permanently removes all of the following:</p>
          <ul>
            <li>Your profile (email, name, date of birth, height, training preferences)</li>
            <li>All workout sessions, exercises, sets, reps, weights, and RPE records</li>
            <li>All personal records (PRs)</li>
            <li>All body weight logs and body measurements</li>
            <li>All cardio logs</li>
            <li>All progress pictures (removed from both local storage and our AWS S3 bucket)</li>
            <li>All notes you have written</li>
            <li>All calorie and food tracking logs</li>
            <li>All powerlifting data (maxes, meets, attempts, readiness logs, lift setup profiles)</li>
            <li>Your authentication credentials</li>
          </ul>

          <h2>What Data Is Kept</h2>
          <p>
            We may retain anonymous, aggregated analytics data (for example, total app installs, crash reports) that cannot be linked back to you. We may also retain transaction records for a limited period where required by law (for example, subscription receipt history for tax compliance).
          </p>
          <p>
            No personally identifiable information is retained after account deletion.
          </p>

          <h2>Canceling Your Subscription</h2>
          <p>
            If you have an active subscription, cancel it through your app store before deleting your account:
          </p>
          <ul>
            <li><strong>Google Play</strong>: Play Store app &rarr; your profile icon &rarr; Payments &amp; subscriptions &rarr; Subscriptions &rarr; awekn &rarr; Cancel</li>
            <li><strong>App Store</strong>: Settings app &rarr; your name &rarr; Subscriptions &rarr; awekn &rarr; Cancel</li>
          </ul>
          <p>
            Deleting the awekn account does not automatically cancel subscriptions purchased through the app store.
          </p>

          <h2>Timeline</h2>
          <p>
            In-app deletion is <strong>immediate</strong>. Email-based requests are processed within <strong>7 business days</strong>.
          </p>

          <h2>Questions</h2>
          <p>
            For questions about account deletion or data privacy, contact us at{" "}
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
