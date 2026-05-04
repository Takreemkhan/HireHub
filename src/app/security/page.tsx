import React from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

export const metadata = {
  title: "Security | FreelanceHub Pro",
  description:
    "How FreelanceHub Pro protects your account, payments, and data — platform security, fraud prevention, and safe working practices.",
};

export default function SecurityPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen mt-10">
        {/* Page Wrapper */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              Security at FreelanceHub Pro
            </h1>
            <p className="text-gray-600 mt-1">
              How we protect your account, your money, and your data — and how
              you can stay safe on our platform
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-8">

            {/* Intro */}
            <section>
              <p className="text-sm text-gray-500 mb-4">
                Last Updated: April 27, 2025
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                At FreelanceHub Pro, security is not an afterthought — it is
                built into every layer of our platform. Whether you are a Client
                posting a project, a Freelancer submitting a proposal, or both,
                we are committed to providing a safe, transparent, and trusted
                environment for every interaction and transaction.
              </p>
              <p className="text-gray-700 leading-relaxed">
                This page explains the technical and operational security
                measures we have in place, how our Safe Deposit (Escrow) system
                protects your payments, how to recognise and report scams, and
                the steps you can take to keep your account secure.
              </p>
            </section>

            {/* Section 1 — Platform Security Infrastructure */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                1. Platform Security Infrastructure
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                FreelanceHub Pro is built on a secure technical foundation
                designed to protect your personal data, financial information,
                and communications at all times.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    1.1 Encrypted Data Transmission (HTTPS &amp; TLS)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    All data exchanged between your browser and FreelanceHub Pro
                    is encrypted using HTTPS with TLS (Transport Layer
                    Security). This means that every page you visit, every
                    message you send, every proposal you submit, and every
                    payment you process is protected from eavesdropping,
                    interception, and man-in-the-middle attacks.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    1.2 Secure Authentication &amp; Session Management
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    User authentication on FreelanceHub Pro is handled using
                    industry-standard protocols including hashed and salted
                    passwords, secure HTTP-only session cookies, and token-based
                    session management. Sessions are invalidated upon logout and
                    expire automatically after a period of inactivity to reduce
                    the risk of unauthorised access on shared or public devices.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    1.3 Secure Cloud Infrastructure
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro is hosted on secure, managed cloud
                    infrastructure with access controls, intrusion detection
                    systems, automated threat monitoring, and regular security
                    patching. Server access is strictly restricted to authorised
                    personnel only, with all access logs maintained and audited.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    1.4 Data Encryption at Rest
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Sensitive data stored on our servers — including personal
                    account details, payment records, and project files — is
                    encrypted at rest. This ensures that even in the unlikely
                    event of a storage-level breach, your data cannot be read or
                    misused without the encryption keys.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    1.5 File &amp; Attachment Scanning
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    All files and attachments shared through the FreelanceHub
                    Pro messaging system, project workspace, and proposal
                    submissions are scanned for viruses, malware, and malicious
                    code before being made available for download. This protects
                    both Clients and Freelancers from inadvertently receiving
                    harmful files.
                  </p>
                </div>
              </div>
            </section>

            {/* Highlight Box */}
            <section className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
              <p className="text-gray-700">
                <strong>Our commitment:</strong> FreelanceHub Pro will never ask
                you to share your password, banking credentials, or OTP via
                email, chat, or phone. If you receive any such request claiming
                to be from us, treat it as fraudulent and report it immediately
                at{" "}
                <a
                  href="mailto:security@freelancehubpro.com"
                  className="text-orange-600 font-medium hover:underline"
                >
                  security@freelancehubpro.com
                </a>
                .
              </p>
            </section>

            {/* Section 2 — Safe Deposit (Escrow) Payment Protection */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                2. Safe Deposit (Escrow) — Payment Protection
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                One of the most important security features on FreelanceHub Pro
                is our <strong>Safe Deposit (Escrow) system</strong>. It is
                designed to protect both Clients and Freelancers from payment
                disputes, non-payment, and fraud.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.1 How Safe Deposit Works
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    When a Client hires a Freelancer and a project begins, the
                    Client deposits the agreed project funds into the Safe
                    Deposit. FreelanceHub Pro holds these funds securely — they
                    are not accessible to the Freelancer until the Client
                    reviews and approves the final deliverables. Once the Client
                    is satisfied, funds are released directly to the
                    Freelancer&apos;s account.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.2 How It Protects Freelancers
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Freelancers can begin work with confidence knowing that the
                    Client&apos;s funds are already secured. There is no risk of
                    a Client disappearing after work is delivered or refusing to
                    pay without raising a formal dispute. All payment records
                    are maintained on the platform for full transparency.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.3 How It Protects Clients
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Clients retain full control over payment release. Funds are
                    never disbursed to the Freelancer without the Client&apos;s
                    approval. If a Freelancer fails to deliver work as agreed,
                    the Client can raise a dispute through our Dispute
                    Resolution process before any funds are released.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.4 Milestone-Based Payments
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    For larger or longer projects, FreelanceHub Pro supports
                    milestone-based Safe Deposit payments. Funds can be broken
                    down and released in stages — one milestone at a time —
                    giving both parties a structured and lower-risk way to
                    manage complex projects.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    2.5 Payment Processor Security
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    All payments on FreelanceHub Pro are processed through
                    certified, secure payment gateways — Razorpay, PayPal, and
                    UPI. These providers comply with PCI DSS (Payment Card
                    Industry Data Security Standard) requirements. FreelanceHub
                    Pro does not store your full card number, CVV, or bank
                    account credentials on our servers at any time.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 — Account Security */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                3. Protecting Your Account
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your account security is a shared responsibility. Here is what
                FreelanceHub Pro does to protect your account, and what you can
                do to help.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.1 Use a Strong, Unique Password
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Always use a strong password that is unique to your
                    FreelanceHub Pro account. A strong password contains at
                    least 10 characters and combines uppercase and lowercase
                    letters, numbers, and special characters. Never reuse a
                    password from another website or service.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.2 Never Share Your Login Credentials
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Your FreelanceHub Pro username and password are private.
                    Treat them like your bank account credentials. Never share
                    them with anyone — including people claiming to be
                    FreelanceHub Pro support staff, clients, or fellow
                    freelancers. Any legitimate support request from our team
                    will never require your password.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.3 Log Out on Shared Devices
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you use FreelanceHub Pro on a shared, public, or
                    borrowed device, always log out when you are done and clear
                    the browser&apos;s cookies and cache. Our session cookies
                    are designed to expire after a period of inactivity, but
                    manually logging out is the safest practice.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.4 Keep Your Contact Information Updated
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Always keep your registered email address and phone number
                    current. If we detect suspicious activity on your account or
                    need to verify your identity, we will contact you through
                    your registered details. An outdated email or phone number
                    could prevent you from receiving critical security alerts.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    3.5 Report Unauthorised Access Immediately
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you suspect that someone has accessed your FreelanceHub
                    Pro account without your permission, contact us immediately
                    at{" "}
                    <a
                      href="mailto:security@freelancehubpro.com"
                      className="text-orange-600 font-medium hover:underline"
                    >
                      security@freelancehubpro.com
                    </a>
                    . We will investigate the incident, help you secure your
                    account, and take appropriate action.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 — Fraud Prevention & Scam Awareness */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                4. Fraud Prevention &amp; Scam Awareness
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                FreelanceHub Pro actively monitors the platform for signs of
                fraud and suspicious behaviour. However, awareness is your first
                line of defence. Below are the most common scams targeting
                freelance platform users and how to avoid them.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    4.1 Off-Platform Payment Requests
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-red-600">Red flag:</strong> A client
                    or freelancer asks you to pay, receive payment, or continue
                    the project outside of FreelanceHub Pro — via WhatsApp,
                    Telegram, email bank transfer, UPI to a personal number, or
                    any other external method.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    All payments for projects sourced through FreelanceHub Pro
                    must be conducted exclusively through our platform. Moving
                    payments off-platform removes all protections provided by
                    our Safe Deposit system and violates our Terms and
                    Conditions. Legitimate clients and freelancers never ask to
                    take transactions outside the platform.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    4.2 Upfront Deposit Scams
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-red-600">Red flag:</strong> Someone
                    asks you — as a Freelancer — to pay a &quot;security
                    deposit&quot;, &quot;registration fee&quot;, or
                    &quot;platform fee&quot; before you can access a project or
                    receive payment.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    FreelanceHub Pro will never ask Freelancers to pay any
                    deposit to access work. Real clients never require
                    Freelancers to pay money upfront. If you encounter this,
                    report it immediately using the flag feature or by emailing
                    us.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    4.3 Phishing Emails &amp; Fake Login Pages
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-red-600">Red flag:</strong> You
                    receive an email with the FreelanceHub Pro logo asking you
                    to urgently verify your account, confirm a payment, or log
                    in via a link. The email address or URL looks slightly
                    different from our official domain.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    Always verify that emails claiming to be from FreelanceHub
                    Pro come from an official{" "}
                    <span className="font-medium">
                      @freelancehubpro.com
                    </span>{" "}
                    address. Never click links in unsolicited emails — instead,
                    open a new browser tab and log in directly at{" "}
                    <span className="text-orange-600 font-medium">
                      freelancehubpro.com
                    </span>
                    . Our platform will never ask for your OTP via email or
                    phone call.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    4.4 Requests to Move Communication Off-Platform
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-red-600">Red flag:</strong> A new
                    client or freelancer immediately pushes to move all
                    communication to WhatsApp, Telegram, email, or another
                    external app before any project agreement is in place.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    Keep all project communications within FreelanceHub Pro
                    messaging. This ensures a full audit trail of all
                    agreements, instructions, and feedback — which is critical
                    if a dispute arises. Moving off-platform also puts you
                    outside the protection of our Dispute Resolution process.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    4.5 Fake or Suspicious Job Postings
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-red-600">Red flag:</strong> A job
                    posting offers unusually high pay for simple work, has vague
                    or unclear requirements, requests personal information (such
                    as your Aadhaar, PAN, or bank details) before hiring, or
                    comes from a profile with no reviews and a recently created
                    account.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    Always review a Client&apos;s profile thoroughly before
                    accepting work. Check their hire history, ratings, and
                    whether their payment method is verified. If something feels
                    off, trust your instinct and use the report flag on the
                    posting.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    4.6 Requests for Free or Unpaid Work
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-red-600">Red flag:</strong> A client
                    asks for extensive work samples, a &quot;test
                    project&quot;, or complete deliverables before funding the
                    Safe Deposit or accepting a formal proposal.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-2">
                    Do not begin substantive work on any project until the
                    Client has funded the Safe Deposit and a formal project
                    agreement is in place on the platform. Sharing small
                    portfolio samples is acceptable — but completing unpaid full
                    projects is not, and no legitimate Client will ask for this.
                  </p>
                </div>
              </div>
            </section>

            {/* Highlight Box 2 */}
            <section className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
              <p className="text-gray-700">
                <strong>Golden rule:</strong> If a client or freelancer asks you
                to do anything that feels unusual, rushed, or requires you to
                pay money, share sensitive personal information, or leave the
                platform — it is almost certainly a scam. Stop, do not proceed,
                and report it to us immediately.
              </p>
            </section>

            {/* Section 5 — Data Protection & Privacy */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                5. Data Protection &amp; Privacy
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    5.1 What We Collect and Why
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro collects only the personal data necessary
                    to operate the platform — including account information,
                    payment details, project communications, and usage data. We
                    do not sell or rent your personal data to third parties. For
                    full details, please review our{" "}
                    <a
                      href="/privacy-policy"
                      className="text-orange-600 font-medium hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    5.2 Access Controls
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Access to user data within FreelanceHub Pro is restricted on
                    a strict need-to-know basis. Our internal team members
                    access user account information only when necessary to
                    resolve a support issue, investigate a dispute, or comply
                    with a legal obligation. All internal access is logged and
                    audited.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    5.3 Third-Party Service Providers
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Where we share data with trusted third-party providers —
                    such as Razorpay, PayPal, or cloud hosting services — those
                    providers are contractually bound to maintain appropriate
                    security standards and to use your data only for the
                    specific purpose for which it was shared.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    5.4 Data Breach Response
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    In the event of a data security incident that affects your
                    personal information, FreelanceHub Pro will notify affected
                    users promptly with relevant details and guidance on steps
                    to take. We will also take immediate corrective action to
                    contain the breach and prevent recurrence.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 6 — Trust & Safety on the Platform */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                6. Trust &amp; Safety on the Platform
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    6.1 Identity Verification
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro reserves the right to request identity
                    verification from any user — particularly for high-value
                    transactions, new accounts, or accounts flagged for
                    suspicious activity. Verified profiles provide greater
                    confidence to both Clients and Freelancers, and
                    verification badges may be displayed on qualifying profiles.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    6.2 Verified Payment Methods
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Clients who have verified their payment method are indicated
                    on the platform. As a Freelancer, checking for a verified
                    payment method before beginning work gives you added
                    assurance that the Client is genuine and financially capable
                    of completing the transaction.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    6.3 Ratings &amp; Review System
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our transparent ratings and reviews system allows both
                    Clients and Freelancers to build a verifiable track record
                    on the platform. Always check a user&apos;s review history,
                    average rating, and number of completed projects before
                    entering into an agreement.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    6.4 Anti-Money Laundering (AML) Policy
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro maintains a zero-tolerance policy toward
                    money laundering, financial fraud, and any attempt to use
                    the platform for illicit financial activity. We monitor
                    transactions for unusual patterns and reserve the right to
                    suspend accounts and report suspicious financial activity to
                    relevant authorities as required by law.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 — How to Report a Security Issue */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                7. How to Report a Security Issue or Suspicious Activity
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                FreelanceHub Pro takes every report of suspicious or
                inappropriate activity seriously. If you encounter anything that
                concerns you, here is how to report it:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <strong>Suspicious user profiles:</strong> Use the{" "}
                  <span className="font-medium">Report</span> or{" "}
                  <span className="font-medium">Flag</span> option available on
                  any user profile page.
                </li>
                <li>
                  <strong>Suspicious job postings:</strong> Use the flag icon on
                  the job posting to submit a report to our moderation team.
                </li>
                <li>
                  <strong>Suspicious messages:</strong> Use the report option
                  within the messaging interface to flag any threatening,
                  fraudulent, or inappropriate messages.
                </li>
                <li>
                  <strong>Platform security vulnerabilities:</strong> If you
                  believe you have discovered a security vulnerability or bug in
                  FreelanceHub Pro, please disclose it responsibly by emailing{" "}
                  <a
                    href="mailto:security@freelancehubpro.com"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    security@freelancehubpro.com
                  </a>
                  . Please do not publicly disclose any vulnerability before we
                  have had a chance to investigate and address it.
                </li>
                <li>
                  <strong>Phishing or impersonation attempts:</strong> Forward
                  any suspicious email or screenshot to{" "}
                  <a
                    href="mailto:security@freelancehubpro.com"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    security@freelancehubpro.com
                  </a>{" "}
                  with a brief description of the incident.
                </li>
                <li>
                  <strong>Unauthorised account access:</strong> Contact us
                  immediately at{" "}
                  <a
                    href="mailto:support@freelancehubpro.com"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    support@freelancehubpro.com
                  </a>{" "}
                  so we can secure your account as quickly as possible.
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Every report is reviewed by our team. We investigate all
                credible reports and take enforcement action — which may include
                warnings, temporary suspension, permanent account termination,
                or referral to law enforcement — depending on the severity of
                the violation.
              </p>
            </section>

            {/* Section 8 — Quick Security Checklist */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                8. Your Security Checklist
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Here is a quick checklist to make sure you are working safely on
                FreelanceHub Pro:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Use a strong, unique password for your account",
                  "Keep your registered email and phone number up to date",
                  "Always fund or verify Safe Deposit before starting work",
                  "Keep all project communications within the platform",
                  "Never pay any deposit or fee to access work as a Freelancer",
                  "Verify a Client's payment method and review history before starting",
                  "Never share your login credentials with anyone",
                  "Log out from shared or public devices after each session",
                  "Check that emails from us come from @freelancehubpro.com",
                  "Report anything suspicious immediately using the flag or email",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-slate-50 border border-gray-100 rounded-lg p-3"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 9 — Related Policies */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                9. Related Policies
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Our security practices are supported by the following legal
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
                <li>
                  <a
                    href="/cookie-policy"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Cookie Policy
                  </a>{" "}
                  — how we use cookies and tracking technologies
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="pt-6 border-t">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Contact Our Security Team
              </h2>
              <p className="text-gray-700 mb-3">
                For any security concerns, suspected fraud, vulnerability
                disclosures, or account safety issues, please reach out:
              </p>
              <div className="space-y-1">
                <p className="text-gray-700">
                  <span className="font-medium">Security issues: </span>
                  <a
                    href="mailto:security@freelancehubpro.com"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    security@freelancehubpro.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">General support: </span>
                  <a
                    href="mailto:support@freelancehubpro.com"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    support@freelancehubpro.com
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