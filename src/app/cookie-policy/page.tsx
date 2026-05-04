import React from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

export const metadata = {
  title: "Cookie Policy | FreelanceHub Pro",
  description: "Cookie Policy for FreelanceHub Pro — how we use cookies and tracking technologies on our platform.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen mt-10">
        {/* Page Wrapper */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">Cookie Policy</h1>
            <p className="text-gray-600 mt-1">
              How FreelanceHub Pro uses cookies and tracking technologies to
              improve your experience
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-8">

            {/* Last Updated + Intro */}
            <section>
              <p className="text-sm text-gray-500 mb-4">
                Last Updated: April 27, 2025
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                FreelanceHub Pro ("we", "our", "us") uses cookies and similar
                tracking technologies on our platform at{" "}
                <span className="text-orange-600 font-medium">
                  freelancehubpro.com
                </span>{" "}
                to ensure the platform works correctly, remember your
                preferences, and help us understand how users interact with our
                services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This Cookie Policy explains what cookies are, the types of
                cookies we use, why we use them, and how you can manage or
                disable them. By continuing to use FreelanceHub Pro, you consent
                to our use of cookies as described in this policy.
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                1. What Are Cookies?
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Cookies are small text files that are placed on your device
                (computer, tablet, or mobile phone) when you visit a website.
                They are widely used to make websites work more efficiently and
                to provide information to website owners.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                Cookies allow a website to recognise your device and remember
                information about your visit — for example, your login session,
                language preference, or which pages you have visited. This helps
                make your next visit easier and the site more useful to you.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Cookies can be <strong>session cookies</strong> (deleted when
                you close your browser) or <strong>persistent cookies</strong>{" "}
                (which remain on your device for a set period or until you
                delete them). They can also be <strong>first-party cookies</strong>{" "}
                (set directly by FreelanceHub Pro) or{" "}
                <strong>third-party cookies</strong> (set by our trusted service
                partners such as payment processors or analytics tools).
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                2. Types of Cookies We Use
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                FreelanceHub Pro uses the following categories of cookies across
                our platform:
              </p>

              <div className="space-y-5">
                {/* 2.1 */}
                <div className="border border-gray-100 rounded-lg p-5 bg-slate-50">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.1 Strictly Necessary Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    These cookies are essential for FreelanceHub Pro to function
                    correctly. Without them, core features — such as logging in,
                    accessing your dashboard, submitting proposals, processing
                    payments, and using the Safe Deposit (Escrow) system —
                    cannot work.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    These cookies do not collect any personally identifiable
                    information and cannot be disabled without breaking
                    fundamental platform functionality.
                  </p>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Examples of what these cookies do:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                      <li>Maintain your authenticated login session</li>
                      <li>
                        Remember items in your active project or proposal draft
                      </li>
                      <li>
                        Enable secure payment and escrow transaction flows via
                        Razorpay and PayPal
                      </li>
                      <li>
                        Enforce security measures such as CSRF protection
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 2.2 */}
                <div className="border border-gray-100 rounded-lg p-5 bg-slate-50">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.2 Performance &amp; Analytics Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    These cookies collect anonymous information about how
                    visitors use FreelanceHub Pro — for example, which pages are
                    visited most frequently, how long users spend on each
                    section, and whether any error messages are encountered.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    All information collected is aggregated and anonymised — it
                    does not identify you personally. We use this data solely to
                    improve platform performance, fix bugs, and enhance the user
                    experience for both Clients and Freelancers.
                  </p>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Tools we may use for this purpose:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                      <li>Google Analytics (anonymised IP tracking)</li>
                      <li>Internal platform diagnostics and error logging</li>
                      <li>Page load and response time monitoring</li>
                    </ul>
                  </div>
                </div>

                {/* 2.3 */}
                <div className="border border-gray-100 rounded-lg p-5 bg-slate-50">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.3 Functionality Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    These cookies allow FreelanceHub Pro to remember choices you
                    make — such as your language settings, notification
                    preferences, dashboard layout, or your last-active role
                    (Client or Freelancer) — and provide a more personalised
                    experience.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The information collected by these cookies may be
                    anonymised. They cannot track your browsing activity on
                    other websites.
                  </p>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Examples of what these cookies remember:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                      <li>Your preferred language or region settings</li>
                      <li>
                        Whether you have dismissed onboarding prompts or
                        tooltips
                      </li>
                      <li>
                        Your active role on the platform (Client or Freelancer)
                      </li>
                      <li>Notification and display preferences</li>
                    </ul>
                  </div>
                </div>

                {/* 2.4 */}
                <div className="border border-gray-100 rounded-lg p-5 bg-slate-50">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.4 Targeting &amp; Tailored Content Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    These cookies are used to show you content that is more
                    relevant to your activity on FreelanceHub Pro. For example,
                    if you have browsed projects in a particular skill category,
                    we may use this information to surface similar opportunities
                    on your dashboard or in email recommendations.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    These cookies do not share your personal data with
                    advertisers. FreelanceHub Pro does not display third-party
                    advertisements on its platform. Any tailored content is
                    served within our platform only and is aimed at improving
                    your job-matching and proposal experience.
                  </p>
                </div>

                {/* 2.5 */}
                <div className="border border-gray-100 rounded-lg p-5 bg-slate-50">
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.5 Third-Party Service Cookies
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Some features on FreelanceHub Pro rely on third-party
                    services that may set their own cookies on your device. These
                    third parties are bound by their own privacy and cookie
                    policies and only use cookie data for the purpose of
                    delivering their service to us.
                  </p>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Third-party services that may set cookies:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-600 text-sm">
                      <li>
                        <strong>Razorpay</strong> — payment gateway cookies for
                        processing transactions
                      </li>
                      <li>
                        <strong>PayPal</strong> — payment session and fraud
                        prevention cookies
                      </li>
                      <li>
                        <strong>Google Analytics</strong> — anonymised usage
                        statistics
                      </li>
                      <li>
                        <strong>Cloud hosting providers</strong> — load
                        balancing and infrastructure cookies
                      </li>
                    </ul>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-3 text-sm">
                    We encourage you to review the cookie and privacy policies of
                    these third-party services independently.
                  </p>
                </div>
              </div>
            </section>

            {/* Highlight Box */}
            <section className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
              <p className="text-gray-700">
                <strong>Important:</strong> FreelanceHub Pro does not display
                third-party advertisements and does not allow advertisers to
                place cookies on our platform. Cookies are used exclusively to
                improve your experience and enable core platform functionality.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                3. Why We Use Cookies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                FreelanceHub Pro uses cookies for the following specific
                purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Authentication:</strong> To keep you securely logged
                  in as you navigate between your dashboard, messages, active
                  projects, and payment centre.
                </li>
                <li>
                  <strong>Security:</strong> To detect and prevent unauthorised
                  access, fraudulent transactions, and suspicious activity on
                  the platform.
                </li>
                <li>
                  <strong>Payment processing:</strong> To enable smooth,
                  uninterrupted transactions through Razorpay, PayPal, and UPI,
                  including Safe Deposit (Escrow) fund management.
                </li>
                <li>
                  <strong>Platform performance:</strong> To monitor uptime,
                  diagnose errors, and ensure fast load times for both Clients
                  and Freelancers.
                </li>
                <li>
                  <strong>Personalisation:</strong> To remember your preferences
                  and show you relevant projects, freelancers, and platform
                  features based on your past activity.
                </li>
                <li>
                  <strong>Session continuity:</strong> To preserve your progress
                  in multi-step flows such as job posting, proposal submission,
                  and milestone approvals.
                </li>
                <li>
                  <strong>Analytics:</strong> To understand how users engage
                  with the platform so we can continuously improve features,
                  fix usability issues, and build a better product.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                4. Cookie Duration
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Cookies on FreelanceHub Pro are set with varying lifespans
                depending on their purpose:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Session cookies</strong> expire when you close your
                  browser. These are typically used for login sessions and
                  in-progress actions such as drafting a proposal or posting a
                  job.
                </li>
                <li>
                  <strong>Short-term persistent cookies</strong> remain on your
                  device for up to 30 days. These are used to remember
                  preferences and reduce repeated login prompts.
                </li>
                <li>
                  <strong>Long-term persistent cookies</strong> may remain on
                  your device for up to 12 months. These are used for analytics,
                  personalisation, and remembering your communication
                  preferences.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                You can delete cookies at any time through your browser settings.
                See Section 5 below for instructions.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                5. How to Manage or Disable Cookies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to manage, restrict, or delete cookies at any
                time through your browser settings. Below is how to do so in the
                most commonly used browsers:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Google Chrome
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Go to{" "}
                    <span className="font-medium">
                      Settings → Privacy and Security → Cookies and other site
                      data
                    </span>
                    . Here you can block all cookies, block third-party cookies,
                    or clear existing cookies.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Mozilla Firefox
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Go to{" "}
                    <span className="font-medium">
                      Settings → Privacy &amp; Security → Cookies and Site Data
                    </span>
                    . You can choose to block cookies, manage exceptions, or
                    clear your cookie history.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Apple Safari
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Go to{" "}
                    <span className="font-medium">
                      Preferences → Privacy → Manage Website Data
                    </span>
                    . You can block all cookies or remove cookies from specific
                    sites.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Microsoft Edge
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Go to{" "}
                    <span className="font-medium">
                      Settings → Cookies and site permissions → Cookies and
                      stored data
                    </span>
                    . You can block or allow cookies and clear existing data.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Mobile Browsers (iOS &amp; Android)
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    On iOS Safari, go to{" "}
                    <span className="font-medium">
                      Settings → Safari → Privacy &amp; Security
                    </span>
                    . On Android Chrome, go to{" "}
                    <span className="font-medium">
                      Settings → Site Settings → Cookies
                    </span>
                    .
                  </p>
                </div>
              </div>

              <div className="mt-5 p-4 bg-slate-50 border border-gray-200 rounded-lg">
                <p className="text-gray-700 text-sm leading-relaxed">
                  <strong>Please note:</strong> Disabling strictly necessary
                  cookies will significantly affect your ability to use
                  FreelanceHub Pro. Core features such as logging in, submitting
                  proposals, messaging, and processing payments through our
                  Escrow system may not function correctly if these cookies are
                  blocked. We recommend keeping strictly necessary cookies
                  enabled for the best experience.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                6. First-Party vs. Third-Party Cookies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>First-party cookies</strong> are set directly by
                FreelanceHub Pro. We use these to manage your session, remember
                your preferences, and improve your experience on our platform.
                These cookies are fully under our control.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Third-party cookies</strong> are set by external service
                providers when you interact with their integrated tools on our
                platform — for example, completing a payment through Razorpay or
                PayPal. FreelanceHub Pro does not control these cookies and they
                are governed by the respective third party&apos;s own cookie and
                privacy policies. We only work with third-party providers who
                maintain industry-standard data protection practices.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                7. Cookies and Your Account Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                FreelanceHub Pro uses cookies as part of our account security
                infrastructure. Authentication cookies help us verify that
                requests made during your session are genuinely coming from you
                and not a third party attempting to impersonate your account.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                We also use cookies to detect unusual login patterns — such as
                access from an unrecognised device or location — and to trigger
                additional verification steps when necessary. This protects both
                Clients and Freelancers from unauthorised access to their
                accounts, wallet balances, and project data.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For your security, we recommend not using FreelanceHub Pro on
                shared or public devices. If you do, always log out after your
                session and clear your browser cookies before leaving.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                8. Do Not Track (DNT) Signals
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Some browsers offer a "Do Not Track" (DNT) setting that sends a
                signal to websites requesting that your browsing activity not be
                tracked. There is currently no universal standard for how
                websites should respond to DNT signals.
              </p>
              <p className="text-gray-700 leading-relaxed">
                At this time, FreelanceHub Pro does not alter its data
                collection practices in response to DNT signals. We encourage
                you to use the cookie management options described in Section 5
                above if you wish to limit the tracking of your activity on our
                platform.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                9. Cookies and Children
              </h2>
              <p className="text-gray-700 leading-relaxed">
                FreelanceHub Pro is not intended for individuals under the age
                of 18. We do not knowingly use cookies to collect information
                from minors. If you believe a minor has registered on our
                platform or that cookies have been used to collect data from a
                person under 18, please contact us immediately at{" "}
                <a
                  href="mailto:privacy@freelancehubpro.com"
                  className="text-orange-600 font-medium hover:underline"
                >
                  privacy@freelancehubpro.com
                </a>{" "}
                and we will take prompt action.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                10. Changes to This Cookie Policy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We may update this Cookie Policy from time to time to reflect
                changes in the technologies we use, applicable laws, or our
                platform&apos;s features. Any updates will be posted on this
                page with a revised date at the top.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We encourage you to review this policy periodically. Continued
                use of FreelanceHub Pro after any updates are posted constitutes
                your acceptance of the revised Cookie Policy.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                11. Related Policies
              </h2>
              <p className="text-gray-700 leading-relaxed">
                This Cookie Policy should be read alongside our other legal
                documents which together govern your use of FreelanceHub Pro:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-3">
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  — how we collect, use, and protect your personal data
                </li>
                <li>
                  <a
                    href="/terms-&-conditions"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Terms and Conditions
                  </a>{" "}
                  — the rules and obligations governing use of the platform
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="pt-6 border-t">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about this Cookie Policy or how we use
                cookies on FreelanceHub Pro, please contact us at:
              </p>
              <div className="mt-3 space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Email: </span>
                  <a
                    href="mailto:privacy@freelancehubpro.com"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    privacy@freelancehubpro.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Website: </span>
                  <a
                    href="https://www.freelancehubpro.com"
                    className="text-orange-600 font-medium hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    www.freelancehubpro.com
                  </a>
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}