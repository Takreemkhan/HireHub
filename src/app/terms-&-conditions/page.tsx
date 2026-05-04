import React from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

export const metadata = {
  title: "Terms and Conditions | FreelanceHub Pro",
  description: "Terms and Conditions for FreelanceHub Pro",
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen mt-10">
        {/* Page Wrapper */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              Terms and Conditions
            </h1>
            <p className="text-gray-600 mt-1">
              Please read these terms carefully before using FreelanceHub Pro
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
                Welcome to FreelanceHub Pro. By accessing or using our platform
                at{" "}
                <span className="text-orange-600 font-medium">
                  freelancehubpro.com
                </span>{" "}
                (the "Website"), you agree to be bound by these Terms and
                Conditions. Please read them carefully before using our
                services. If you do not agree, you must not use the platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                FreelanceHub Pro is operated by an early-stage startup. These
                Terms form a legally binding agreement between you ("User",
                "you") and FreelanceHub Pro ("we", "us", "the Platform").
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                1. Overview
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                FreelanceHub Pro is an online marketplace that connects Clients
                (buyers of freelance services) with Freelancers (providers of
                freelance services). Our platform enables users to post
                projects, submit proposals, communicate, manage work, process
                payments, and leave feedback — all within a single platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to add, modify, or discontinue features at
                any time with reasonable prior notice posted on the Website.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                2. Eligibility and Registration
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.1 Eligibility
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To use FreelanceHub Pro, you must be at least 18 years of
                    age and legally capable of entering into binding contracts.
                    By registering, you confirm that the information you provide
                    is accurate, complete, and current.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.2 Account Responsibility
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    You are solely responsible for maintaining the
                    confidentiality of your login credentials. Any activity
                    carried out using your account will be considered your own.
                    Notify us immediately at{" "}
                    <a
                      href="mailto:support@freelancehubpro.com"
                      className="text-orange-600 font-medium hover:underline"
                    >
                      support@freelancehubpro.com
                    </a>{" "}
                    if you suspect unauthorized access to your account.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.3 One Account Per User
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Each user may maintain only one active account. Creating
                    duplicate or fraudulent accounts may result in immediate
                    suspension.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                3. User Roles
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.1 Clients
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Clients can post projects, review proposals, hire
                    Freelancers, manage active work, approve deliverables, and
                    process payments through the platform.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.2 Freelancers
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Freelancers can create a profile, submit proposals on
                    projects, deliver work, issue invoices, receive feedback,
                    and withdraw earnings through supported payment methods.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                4. Client and Freelancer Relationship
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    4.1 Independent Contractors
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Clients and Freelancers are independent contractors. Nothing
                    in these Terms creates any employment, partnership, agency,
                    or joint venture between any parties. FreelanceHub Pro does
                    not supervise, direct, or control the manner in which
                    Freelancers perform their work.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    4.2 Project Agreements
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    When a Client accepts a Freelancer&apos;s proposal, both
                    parties enter into a Project Agreement governed by the
                    proposal details, project description, communications on the
                    platform, and these Terms. Any Project Agreement that
                    conflicts with these Terms will be overridden by these
                    Terms.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Both parties are expected to act in good faith throughout
                    the project lifecycle. The Client is responsible for clearly
                    communicating requirements and approving deliverables in a
                    timely manner. The Freelancer is responsible for delivering
                    quality work as agreed.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    4.3 FreelanceHub Pro&apos;s Role
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro acts solely as an intermediary marketplace.
                    We do not guarantee the quality, legality, or completion of
                    any project, nor the accuracy of user profiles. Enforcement
                    of project obligations lies solely between the Client and
                    the Freelancer.
                  </p>
                </div>
              </div>
            </section>

            {/* Highlight Box */}
            <section className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
              <p className="text-gray-700">
                <strong>Important:</strong> All payments for work sourced
                through FreelanceHub Pro must be conducted exclusively via the
                platform for a period of 24 months from the date of first
                connection. Circumventing the platform&apos;s payment system is
                a breach of these Terms.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                5. Fees and Charges
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    5.1 Freelancer Service Fee
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro charges Freelancers a service fee on each
                    completed project. The applicable fee percentage is based on
                    the Freelancer&apos;s membership tier and is deducted
                    automatically from the project payment before disbursement.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    5.2 Payment Processing Fee
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    A payment processing fee may apply to transactions depending
                    on the payment method used (Razorpay, PayPal, or UPI). This
                    fee is disclosed at the time of transaction.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    5.3 Withdrawal Fee
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Freelancers may incur a transfer or withdrawal fee when
                    requesting funds via certain payout methods. Applicable fees
                    are listed on the billing section of the Website.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    5.4 Membership Plans
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro offers optional subscription plans for
                    Freelancers and Clients that provide enhanced features,
                    additional proposals, or priority visibility. Membership
                    fees are non-refundable once the billing period has begun.
                    Plan details and pricing are listed on the Website and may
                    be updated with prior notice.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    5.5 Fee Changes
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to revise fees at any time. Changes
                    will be communicated in advance via the Website. Continued
                    use of the platform after fee changes take effect
                    constitutes acceptance.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                6. Payments and Billing
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    6.1 Supported Payment Methods
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro currently supports payments via Razorpay,
                    PayPal, and UPI. Clients must use platform-provided payment
                    methods for all transactions related to projects sourced
                    through FreelanceHub Pro.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    6.2 Escrow / Safe Deposit
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    FreelanceHub Pro offers an Escrow (Safe Deposit) service.
                    When a Client deposits project funds into escrow, FreelanceHub
                    Pro holds those funds securely until both parties confirm
                    that deliverables have been satisfactorily completed, or
                    until a dispute is resolved per Section 8 of these Terms.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Funds held in escrow are not insured deposits and are
                    subject to the terms and limitations of this agreement.
                    FreelanceHub Pro is not a bank or financial institution.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    6.3 Payment Release
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Payment is released to the Freelancer upon the Client&apos;s
                    acceptance of the delivered work. Once a payment is approved
                    and released, it is considered final. Clients should review
                    deliverables carefully before approving.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    6.4 Non-Circumvention
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-2">
                    Both Clients and Freelancers agree to conduct all payments
                    for work sourced through the platform exclusively via
                    FreelanceHub Pro for a period of 24 months from the date of
                    first connection. Circumventing the platform&apos;s payment
                    system is a breach of these Terms and may result in account
                    suspension.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    To opt out of this obligation, an Opt-Out Fee applies.
                    Contact{" "}
                    <a
                      href="mailto:billing@freelancehubpro.com"
                      className="text-orange-600 font-medium hover:underline"
                    >
                      billing@freelancehubpro.com
                    </a>{" "}
                    for details.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    6.5 Chargebacks and Fraud
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    If FreelanceHub Pro receives a chargeback or payment
                    reversal on your behalf, we reserve the right to recover
                    those amounts from your account balance, future earnings, or
                    registered payment methods. Repeated fraudulent activity
                    will result in permanent account termination.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                7. Prohibited Activities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Users must not engage in any of the following on or through
                FreelanceHub Pro:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  Posting or performing work related to gambling, adult content,
                  virtual currency exchange, get-rich-quick schemes, or
                  remittance services.
                </li>
                <li>
                  Using the platform in any way that violates applicable laws or
                  regulations.
                </li>
                <li>
                  Misrepresenting qualifications, identity, or work history.
                </li>
                <li>
                  Soliciting or accepting off-platform payments from connections
                  made through the platform.
                </li>
                <li>
                  Uploading malware, viruses, or any code designed to harm
                  platform infrastructure.
                </li>
                <li>
                  Engaging in harassment, abuse, or threatening behavior toward
                  other users.
                </li>
                <li>
                  Creating multiple accounts or impersonating another person or
                  entity.
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                8. Dispute Resolution
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    8.1 Eligibility
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    The Dispute Resolution service is available for projects
                    where the Escrow (Safe Deposit) service has been used and a
                    disagreement arises over project completion or payment.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    8.2 Mediation
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Either party may raise a dispute through the platform. Both
                    parties will be given 10 business days to reach a mutual
                    agreement with FreelanceHub Pro facilitating the discussion.
                    If an agreement is reached, funds will be disbursed
                    accordingly.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    8.3 Arbitration
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    If mediation fails, FreelanceHub Pro or a nominated third
                    party will act as arbitrator. The arbitrator&apos;s decision
                    will be based on the project agreement, communication records
                    on the platform, and standard industry practices. The
                    decision rendered is final and binding.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    8.4 Dispute Resolution Fee
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    A Dispute Resolution Fee equal to Rs. 500 or 5% of the
                    disputed amount (whichever is greater) will be charged upon
                    use of this service, regardless of outcome.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    8.5 Disclaimer
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro does not provide legal advice. If you
                    require legal counsel, you should seek licensed legal
                    representation independently.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                9. Content and Intellectual Property
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    9.1 User Content
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    You retain ownership of all content you create and upload to
                    FreelanceHub Pro, including work samples, portfolio
                    materials, and project deliverables. By uploading content,
                    you grant FreelanceHub Pro a non-exclusive, royalty-free
                    license to display such content for platform-related
                    purposes only.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    9.2 Work Product
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Upon full payment, all rights to the project deliverables
                    transfer to the Client unless otherwise agreed in writing.
                    Freelancers must not use, distribute, or resell a
                    Client&apos;s deliverables after transfer.
                  </p>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    9.3 Platform Content
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    All platform content including logos, design, and software
                    is the property of FreelanceHub Pro. Unauthorized
                    reproduction or use is prohibited.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                10. Termination and Suspension
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                FreelanceHub Pro may suspend or terminate your account at any
                time if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>You breach any provision of these Terms.</li>
                <li>
                  Your account activity is found to be fraudulent or
                  misleading.
                </li>
                <li>
                  We are unable to verify your identity or the information
                  you&apos;ve provided.
                </li>
                <li>
                  Your conduct poses a legal risk to other users or to the
                  platform.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Upon termination, you lose access to your account data.
                Outstanding obligations to other users remain enforceable. If
                you wish to terminate your account voluntarily, contact{" "}
                <a
                  href="mailto:support@freelancehubpro.com"
                  className="text-orange-600 font-medium hover:underline"
                >
                  support@freelancehubpro.com
                </a>
                .
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                11. Limitations and Disclaimers
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                FreelanceHub Pro provides its services on an &quot;as-is&quot;
                basis. We make no warranties regarding platform availability,
                accuracy of user profiles, or the outcome of any project. To
                the maximum extent permitted by law, we are not liable for
                indirect, consequential, or incidental damages arising from
                platform use.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Any disputes between users are the sole responsibility of those
                parties. By using the platform, you release FreelanceHub Pro
                from any claims arising from user-to-user disputes.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                12. Governing Law and Jurisdiction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of India. Any unresolved
                disputes shall be subject to the jurisdiction of the courts of
                India. Users outside India are responsible for ensuring their
                use of the platform complies with their local laws.
              </p>
            </section>

            {/* Section 13 */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                13. Modifications to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                FreelanceHub Pro may update these Terms at any time. Updated
                Terms will be posted on the Website with a revised date.
                Continued use of the platform after changes are published
                constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Contact */}
            <section className="pt-6 border-t">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                14. Contact
              </h2>
              <p className="text-gray-700">
                For any queries regarding these Terms, please contact us at:
              </p>
              <div className="mt-3 space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Email: </span>
                  <a
                    href="mailto:legal@freelancehubpro.com"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    legal@freelancehubpro.com
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