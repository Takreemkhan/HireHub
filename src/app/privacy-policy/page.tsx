

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
    <Header/>
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
          {/* Intro */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              FreelanceHub Pro (“we”, “our”, “us”) respects your privacy and is
              committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, store, and safeguard your
              data when you use our platform.
            </p>
          </section>

          {/* Section */}
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              1. Information We Collect
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Personal details such as name, email address, and phone number
              </li>
              <li>
                Profile information including skills, experience, and portfolio
              </li>
              <li>
                Job postings, proposals, contracts, and messages
              </li>
              <li>
                Technical data such as IP address, browser type, and device
                information
              </li>
            </ul>
          </section>

          {/* Section */}
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To create and manage user accounts</li>
              <li>To connect clients with freelancers</li>
              <li>To process payments and transactions securely</li>
              <li>To improve platform functionality and user experience</li>
              <li>To ensure security and prevent fraud</li>
            </ul>
          </section>

          {/* Section */}
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              3. Cookies & Tracking Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              FreelanceHub Pro uses cookies and similar technologies to maintain
              user sessions, remember preferences, and analyze website usage.
              You can manage or disable cookies through your browser settings,
              though some features may not function properly.
            </p>
          </section>

          {/* Section */}
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              4. Information Sharing
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We do not sell or rent your personal information. Your data may be
              shared only with trusted third-party service providers (such as
              payment processors) or when required by law.
            </p>
          </section>

          {/* Highlight Box */}
          <section className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
            <p className="text-gray-700">
              <strong>Important:</strong> All third-party services used by
              FreelanceHub Pro follow industry-standard security and privacy
              practices.
            </p>
          </section>

          {/* Section */}
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security
              measures to protect your data. However, no method of transmission
              over the internet is completely secure.
            </p>
          </section>

          {/* Section */}
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              6. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain personal information only as long as necessary to
              provide our services and comply with legal obligations. Users may
              request account deletion, subject to applicable laws.
            </p>
          </section>

          {/* Section */}
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              7. Children’s Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              FreelanceHub Pro is not intended for users under the age of 18. We
              do not knowingly collect personal information from minors.
            </p>
          </section>

          {/* Section */}
          <section>
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              8. Updates to This Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-6 border-t">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              Contact Us
            </h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <p className="mt-2">
              <a
                href="mailto:support@freelancehubpro.com"
                className="text-orange-600 font-medium hover:underline"
              >
                support@hirehub.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
    <FooterSection/>
    </>
  );
}

