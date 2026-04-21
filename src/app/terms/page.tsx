import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service . awekn",
  description: "Terms of Service for awekn — the rules for using the app, your subscription, and our responsibilities to each other.",
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
        <p className="legal-updated">Last updated: April 21, 2026</p>

        <div className="legal-content">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the awekn mobile application and awekn.com (together, the &ldquo;Service&rdquo;), operated by Venex Labs. By downloading, installing, or using the Service, you agree to these Terms. If you do not agree, do not use the Service.
          </p>

          <h2>1. Who Can Use awekn</h2>
          <p>You must be at least 13 years old to use awekn, and at least 18 (or the age of majority in your jurisdiction) to purchase a subscription. If you are between 13 and 18, you may use awekn only with the involvement of a parent or guardian. The App Store rating is 4+ because the content is suitable for a general audience; the age gate here is about legal capacity to enter a contract, not content suitability.</p>

          <h2>2. Your Account</h2>
          <p>You need an account to use awekn. You are responsible for the accuracy of the information you provide, for keeping your password and sign-in credentials confidential, and for any activity under your account. Notify us at <a href="mailto:areebghani359@gmail.com">areebghani359@gmail.com</a> if you suspect unauthorized use.</p>
          <p><strong>Username policy</strong> — your chosen username is unique across awekn. When you delete your account, we retain a reserved record of the lowercased username so another user cannot claim it and impersonate you. If you later return and would like your old username back, email us and we will release it where possible.</p>

          <h2>3. Your Content, Your Data</h2>
          <p>You own the workout logs, body measurements, progress photos, notes, regimen entries, and every other piece of content you create in awekn. We do not claim any ownership of your content. By using the cloud-sync feature you grant us a limited, non-exclusive license solely to store, transmit, display, and back up your content in order to operate the Service on your behalf. This license ends when you delete your content or your account.</p>

          <h2>4. awekn Pro Subscription</h2>
          <p>awekn Pro is a recurring subscription that unlocks the full app. The subscription is sold through the Apple App Store and billed to your Apple ID.</p>
          <ul>
            <li><strong>Free trial</strong> — new users receive a 7-day free trial. The trial is limited to one per Apple ID and per subscription group, as enforced by the App Store. Your payment method is not charged during the trial.</li>
            <li><strong>Auto-renewal</strong> — unless you cancel at least 24 hours before the end of the current period, your subscription automatically renews at the then-current price for the same duration (monthly or annual). Payment is charged to your Apple ID at purchase confirmation and again at each renewal.</li>
            <li><strong>Pricing</strong> — the exact price, period, and currency are shown to you on the purchase screen in your local currency, set by Apple for your App Store country. We do not control Apple&rsquo;s regional pricing conversion.</li>
            <li><strong>Manage or cancel</strong> — at any time in iPhone Settings &rarr; your Apple ID &rarr; Subscriptions. Cancelling stops the next renewal; you keep Pro access through the end of the paid period you already started.</li>
            <li><strong>Grace period</strong> — if a renewal payment fails, Apple retries for up to 16 days. During this billing-retry grace period you retain Pro access.</li>
            <li><strong>Restoring purchases</strong> — if you reinstall awekn or switch devices, tap &ldquo;Restore Purchases&rdquo; on the paywall to re-link the subscription to your Apple ID.</li>
            <li><strong>Refunds</strong> — all refund requests are handled by Apple through reportaproblem.apple.com. awekn does not process refunds directly. If Apple issues you a refund we are notified server-side and will revoke Pro access immediately.</li>
          </ul>

          <h2>5. Acceptable Use</h2>
          <p>You agree not to: (a) attempt to reverse-engineer, decompile, or extract source from the app beyond what applicable law allows; (b) probe, scan, or test the vulnerability of any system or network; (c) access or use the Service to build a competing product, scrape content, or train machine-learning models; (d) impersonate another person, misrepresent your identity, or interfere with another user&rsquo;s enjoyment of the Service; (e) upload unlawful, infringing, or harassing content; (f) bypass usage limits, entitlement checks, or safety features; or (g) use the Service to violate any applicable law or regulation. We may suspend or terminate accounts that breach this section.</p>

          <h2>6. Health and Fitness Disclaimer</h2>
          <p>awekn is a fitness tracking tool, not a medical device, diagnostic aid, or substitute for professional advice. Exercise involves risk of injury. Consult a qualified healthcare professional before starting any new training, nutrition, or supplementation regimen, especially if you have a medical condition or take medication. You use awekn at your own risk. We are not liable for injury, illness, or adverse outcomes that may occur during or as a result of activity you log in the app.</p>

          <h2>7. Regimen Tracking — User-Provided Content Only</h2>
          <p>awekn includes a private regimen tracker where you can record supplements, medications, or other items you choose to track. All entries are free text that you type yourself. awekn does not provide, recommend, or validate any substance. We do not promote, supply, or endorse any controlled substance, prescription medication, or performance-enhancing drug. Your regimen entries are private to your account and are never shared with any third party.</p>

          <h2>8. Intellectual Property</h2>
          <p>The awekn name, logo, app design, and source code are owned by Venex Labs and protected by applicable intellectual-property laws. We grant you a limited, personal, non-transferable, non-exclusive, revocable license to use the Service for your own personal, non-commercial purposes. Nothing in these Terms transfers any intellectual-property right to you beyond that license.</p>

          <h2>9. Feedback</h2>
          <p>If you send us feedback or suggestions about the Service, we may use them without restriction or obligation to you.</p>

          <h2>10. Availability and Changes</h2>
          <p>We strive to keep the Service available and working well, but we do not guarantee uninterrupted or error-free operation. We may modify or discontinue features with notice. We may update these Terms from time to time; material changes will be notified in the app or by email, and continued use of the Service after changes become effective constitutes acceptance.</p>

          <h2>11. Termination</h2>
          <p>You may terminate your account at any time from Settings &rarr; Account &rarr; Delete Account. We may suspend or terminate your access if you violate these Terms or use the Service in a way that risks harm to us or to other users. Upon termination, the license granted to you ends; sections 3, 6, 7, 8, 12, 13, 14, and 15 survive.</p>

          <h2>12. Disclaimer of Warranties</h2>
          <p>The Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. To the maximum extent permitted by law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, non-infringement, and any warranty arising out of course of dealing or usage of trade. We do not warrant that the Service will meet your requirements, be error-free, or that any data will be preserved against loss.</p>

          <h2>13. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, in no event will Venex Labs, its officers, employees, agents, or affiliates be liable for any indirect, incidental, special, consequential, punitive, or exemplary damages, including loss of profits, loss of data, loss of use, or business interruption, arising out of or related to the Service. Our total aggregate liability to you for any claim arising out of or related to the Service will not exceed the greater of (a) the amount you paid awekn in the twelve months before the event giving rise to the claim, or (b) ten US dollars. Some jurisdictions do not allow these limits; in those jurisdictions our liability is limited to the smallest extent allowed.</p>

          <h2>14. Indemnification</h2>
          <p>You agree to indemnify and hold Venex Labs harmless against any claim, demand, loss, liability, or expense (including reasonable legal fees) arising from (a) your violation of these Terms, (b) your misuse of the Service, or (c) content you upload.</p>

          <h2>15. Governing Law and Dispute Resolution</h2>
          <p>These Terms are governed by the laws of India, without regard to conflict-of-laws principles. Subject to any mandatory consumer-protection law in your country of residence, you and Venex Labs agree that any dispute arising out of or related to these Terms or the Service will be brought exclusively in the competent courts of Bengaluru, Karnataka, India. Nothing in this section prevents either party from seeking urgent injunctive relief in any court of competent jurisdiction.</p>

          <h2>16. Apple&rsquo;s Standard EULA Terms</h2>
          <p>If you access awekn through the Apple App Store, Apple&rsquo;s standard End-User License Agreement (<a href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/" target="_blank" rel="noopener noreferrer">available here</a>) additionally applies. In case of conflict between Apple&rsquo;s EULA and these Terms, Apple&rsquo;s EULA prevails only as to the app binary itself; these Terms govern the rest of the Service.</p>

          <h2>17. Contact</h2>
          <p>For any question about these Terms, contact us at <a href="mailto:areebghani359@gmail.com">areebghani359@gmail.com</a>. The operator of the Service is Venex Labs.</p>
        </div>
      </div>

      <footer className="legal-footer">
        <p>&copy; {new Date().getFullYear()} awekn by Venex Labs. All rights reserved.</p>
      </footer>
    </div>
  );
}
