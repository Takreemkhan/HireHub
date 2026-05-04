import React from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

export const metadata = {
  title: "Privacy Policy | FreelanceHub Pro",
  description: "Privacy Policy for FreelanceHub Pro",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen mt-10">
        {/* Page Wrapper */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              Privacy Policy
            </h1>
            <p className="text-gray-600 mt-1">
              How FreelanceHub Pro collects, uses, and protects your information
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-8">
            {/* Last Updated + Intro */}
            <section>
              <p className="text-sm text-gray-500 mb-4">
                Last Updated: April 27, 2025
              </p>
              <p className="text-gray-700 leading-relaxed">
                At FreelanceHub Pro, your privacy matters. This Privacy Policy
                explains what personal data we collect, how we use it, and how
                we protect it when you use our platform at{" "}
                <span className="text-orange-600 font-medium">
                  freelancehubpro.com
                </span>
                . By using our services, you agree to the practices described
                here.
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                1. Information We Collect
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    1.1 Account Information
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    When you register, we collect your name, email address,
                    username, and password. Freelancers may also provide
                    professional details such as skills, portfolio items, and
                    work history.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    1.2 Payment Information
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To process transactions, we collect billing details
                    including UPI IDs, PayPal account information, or card
                    details processed via Razorpay. We do not store full card
                    numbers on our servers — all payment data is handled by our
                    certified payment processors.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    1.3 Project and Communication Data
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We store project descriptions, proposals, messages exchanged
                    between users, files uploaded, and feedback given — all of
                    which are necessary for the platform to function.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    1.4 Usage Data
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We automatically collect information such as IP address,
                    browser type, device details, pages visited, and time spent
                    on the platform. This helps us improve platform performance
                    and user experience.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  To create and manage your account and verify your identity.
                </li>
                <li>
                  To facilitate project postings, proposals, and communications
                  between users.
                </li>
                <li>
                  To process payments, manage escrow funds, and disburse
                  earnings.
                </li>
                <li>
                  To resolve disputes and enforce our Terms and Conditions.
                </li>
                <li>
                  To send service-related notifications, updates, and security
                  alerts.
                </li>
                <li>
                  To improve platform features, troubleshoot bugs, and analyse
                  usage trends.
                </li>
                <li>
                  To comply with legal obligations or respond to lawful
                  government or law enforcement requests.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                3. Sharing of Information
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.1 With Other Users
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Certain profile information such as your username, skills,
                    ratings, and portfolio are visible to other users.
                    Project-related communications are shared between the Client
                    and Freelancer involved in that project.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.2 With Service Providers
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We share data with trusted third-party providers — including
                    payment processors (Razorpay, PayPal), cloud hosting
                    services, and analytics tools — who are contractually bound
                    to keep your data secure and use it only for the services
                    they provide to us.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.3 Legal Requirements
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We may disclose your information when required by law, court
                    order, or regulatory authority. We will make reasonable
                    efforts to notify you before doing so, unless prohibited by
                    law.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.4 No Data Selling
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro does not sell, rent, or trade your personal
                    data to third parties for their own marketing purposes.
                  </p>
                </div>
              </div>
            </section>

            {/* Highlight Box */}
            <section className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
              <p className="text-gray-700">
                <strong>Important:</strong> All third-party services used by
                FreelanceHub Pro are contractually bound to keep your data
                secure and follow industry-standard security and privacy
                practices.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                4. Cookies
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar tracking technologies to maintain
                sessions, remember your preferences, and analyse platform usage.
                You can manage cookie preferences through your browser settings.
                Disabling cookies may affect certain platform features.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                5. Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement standard security measures including encryption in
                transit, access controls, and secure server infrastructure to
                protect your data. However, no system is entirely immune to
                risk. You are responsible for keeping your login credentials
                confidential.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                6. Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your account data for as long as your account is
                active or as needed to provide services. If you close your
                account, we may retain certain data for a legally required
                period for compliance, fraud prevention, or dispute resolution
                purposes, after which it is securely deleted.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                7. Your Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access the personal data we hold about you.</li>
                <li>Request correction of inaccurate information.</li>
                <li>
                  Request deletion of your data (subject to legal obligations).
                </li>
                <li>
                  Withdraw consent where processing is based on consent.
                </li>
                <li>
                  Raise a complaint with a data protection authority if you
                  believe your rights have been violated.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                To exercise any of these rights, contact us at{" "}
                <a
                  href="mailto:privacy@freelancehubpro.com"
                  className="text-orange-600 font-medium hover:underline"
                >
                  privacy@freelancehubpro.com
                </a>
                .
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                8. Children&apos;s Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                FreelanceHub Pro is not intended for individuals under the age
                of 18. We do not knowingly collect personal data from minors.
                If we become aware that a minor has registered, we will promptly
                delete their account and associated data.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                9. Third-Party Links
              </h2>
              <p className="text-gray-700 leading-relaxed">
                The platform may contain links to external websites. FreelanceHub
                Pro is not responsible for the privacy practices of third-party
                sites. We encourage you to review their privacy policies
                independently.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                10. Changes to This Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy periodically. Any changes will
                be posted on this page with a revised date. Continued use of the
                platform after changes are posted indicates your acceptance of
                the updated policy.
              </p>
            </section>

            {/* Contact */}
            <section className="pt-6 border-t">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                11. Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy or how your
                data is handled, please reach out:
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