"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

const helpCategories = [
  {
    icon: "🚀",
    title: "Getting Started",
    desc: "New to FreelanceHub Pro? Learn how to set up your account, complete your profile, and take your first steps.",
    articles: [
      {
        title: "How to create a FreelanceHub Pro account",
        content:
          "Go to freelancehubpro.com and click 'Sign Up'. Choose your role — Freelancer or Client — and enter your name, email address, and a strong password. You will receive an OTP on your registered email to verify your account. Once verified, you can complete your profile and start using the platform. Creating an account is free.",
      },
      {
        title: "Freelancer vs Client — which account type should I choose?",
        content:
          "Choose Freelancer if you want to browse job postings, submit proposals, deliver work, and earn payments. Choose Client if you want to post projects, review proposals, hire talent, and manage work. You can only have one active account, so select the role that matches your primary purpose on the platform.",
      },
      {
        title: "How to verify your email and activate your account",
        content:
          "After signing up, a 6-digit OTP (One-Time Password) is sent to your registered email address. Enter this OTP on the verification page to activate your account. If you did not receive the OTP, check your spam folder or click 'Resend OTP'. OTPs expire after 10 minutes.",
      },
      {
        title: "How to complete your Freelancer profile",
        content:
          "A complete profile significantly increases your chances of winning projects. Go to your dashboard and click 'Edit Profile'. Add a professional photo, a detailed bio (at least 150 words), your skills (up to 15), your hourly rate, portfolio samples (at least 2), and your education or work experience. Profiles with all sections complete receive up to 3x more Client views.",
      },
      {
        title: "How to post your first project as a Client",
        content:
          "Log in and click 'Post a Project' from your Client dashboard. Fill in the project title, description, required skills, budget range, and timeline. The more detail you provide, the better the quality of proposals you will receive. Click 'Submit' to publish the project — it goes live immediately and Freelancers can start submitting proposals right away.",
      },
    ],
  },
  {
    icon: "💳",
    title: "Payments & Billing",
    desc: "Understand how the Safe Deposit system works, how to withdraw earnings, and how billing and fees are structured.",
    articles: [
      {
        title: "How the Safe Deposit (Escrow) system works",
        content:
          "When a Client hires a Freelancer, the Client deposits the agreed project amount into the Safe Deposit before work begins. FreelanceHub Pro holds these funds securely. Once the Freelancer delivers the work and the Client approves it, the funds are released to the Freelancer. This protects Clients from non-delivery and Freelancers from non-payment. The Safe Deposit is mandatory for all fixed-price projects.",
      },
      {
        title: "What payment methods are supported?",
        content:
          "FreelanceHub Pro currently supports payments via Razorpay (credit/debit cards, net banking, UPI), PayPal, and UPI (direct UPI ID). All payment processing is handled by our certified payment partners and complies with PCI DSS standards. We do not store your full card number or banking credentials on our servers.",
      },
      {
        title: "How to withdraw my earnings as a Freelancer",
        content:
          "Go to your Freelancer dashboard and navigate to the 'Wallet' or 'Withdrawal' section. Enter the amount you wish to withdraw and select your preferred payout method (Razorpay, PayPal, or UPI). Withdrawals are typically processed within 1–3 business days depending on your bank. A withdrawal fee may apply for certain payout methods — check the billing section of the platform for current rates.",
      },
      {
        title: "What fees does FreelanceHub Pro charge?",
        content:
          "FreelanceHub Pro charges Freelancers a service fee on each completed project. The fee percentage depends on your membership tier and is automatically deducted before payment disbursement. A payment processing fee may also apply based on your payment method. Membership plans have a fixed monthly or annual fee and are non-refundable once the billing period begins. Full fee details are listed in the billing section of the platform.",
      },
      {
        title: "My payment is pending or stuck — what do I do?",
        content:
          "Razorpay and UPI payments typically process within a few minutes to a few hours. PayPal can take up to 1 business day. If your payment has been pending for more than 24 hours, contact billing@freelancehubpro.com with your transaction reference number, the amount, and the date of the transaction. Do not initiate a duplicate payment before the original has been confirmed as failed.",
      },
      {
        title: "How do milestone-based payments work?",
        content:
          "For larger projects, Clients can split the payment into milestones. Each milestone represents a stage of the project with its own deliverable and payment amount. The Client funds each milestone's Safe Deposit before that stage of work begins. When the Freelancer completes and submits the milestone, the Client reviews and approves it — releasing that portion of the payment. This approach gives both parties structured checkpoints throughout the project.",
      },
    ],
  },
  {
    icon: "📋",
    title: "Proposals & Projects",
    desc: "Everything you need to know about submitting proposals, managing projects, and delivering work successfully.",
    articles: [
      {
        title: "How to submit a proposal on a project",
        content:
          "Browse active projects in the 'Find Jobs' section and click on a project that matches your skills. Click 'Submit Proposal' and fill in your proposed rate, estimated timeline, and a detailed cover letter explaining your approach. Personalise each proposal to the specific project — generic templates are easy to spot and rarely win. Submitting a proposal uses one proposal credit from your account.",
      },
      {
        title: "How many proposals can I submit per month?",
        content:
          "The number of proposals you can submit per month depends on your membership plan. Free accounts receive a limited number of proposal credits per month. Upgrading to a paid membership plan gives you more credits, enhanced visibility, and additional platform features. View your current credit balance in your Freelancer dashboard under 'Membership'.",
      },
      {
        title: "How to track the status of my proposal",
        content:
          "Go to your Freelancer dashboard and navigate to 'My Proposals'. Here you can see all proposals you have submitted, their current status (Pending, Viewed, Shortlisted, or Declined), and the date they were submitted. If a Client shortlists you, you will also receive a notification. Proposals are visible to the Client once submitted.",
      },
      {
        title: "What happens after a Client accepts my proposal?",
        content:
          "When a Client accepts your proposal, you will receive a notification and the project will appear in your 'Active Projects' dashboard. The Client will then fund the Safe Deposit before work begins. Once funded, you can start working. Use the platform's messaging and file-sharing tools to communicate with your Client and deliver all work through the platform.",
      },
      {
        title: "How to submit your completed work for review",
        content:
          "Go to the active project in your dashboard and click 'Submit for Review'. Upload your deliverables and add a message describing what you have completed. The Client will be notified and has a review period to approve the work or request revisions. Do not request payment release before submitting your work through this process.",
      },
      {
        title: "What is the revision request process?",
        content:
          "If a Client is not satisfied with a deliverable, they can click 'Request Revision' and provide specific feedback on what needs to be changed. Revisions should be based on the original project brief — requests that go significantly beyond the original scope may warrant a renegotiation of the project terms. The number of revisions included should be agreed upon at the proposal stage.",
      },
    ],
  },
  {
    icon: "🛡️",
    title: "Trust, Safety & Disputes",
    desc: "How to stay safe on the platform, recognise scams, and what to do if something goes wrong with a project.",
    articles: [
      {
        title: "How to raise a dispute on a project",
        content:
          "Disputes can only be raised for projects where the Safe Deposit (Escrow) service was used. Go to the active project in your dashboard and click 'Raise Dispute'. Provide a clear description of the issue, the amount in dispute, and any supporting evidence (messages, files, screenshots). Both parties will have 10 business days to reach a mutual resolution facilitated by FreelanceHub Pro. A Dispute Resolution Fee of ₹500 or 5% of the disputed amount (whichever is greater) applies.",
      },
      {
        title: "What happens during the dispute resolution process?",
        content:
          "Once a dispute is raised, FreelanceHub Pro notifies both parties and opens a facilitated mediation process. Both the Client and the Freelancer can submit their case and supporting evidence. Our team reviews the project agreement, communication records, and submitted evidence to facilitate a resolution. If mediation fails within 10 business days, FreelanceHub Pro or a nominated third party will make a final binding arbitration decision.",
      },
      {
        title: "How to report a scam or fraudulent user",
        content:
          "If you suspect fraud or a policy violation, use the 'Report' flag on the user's profile or project listing. For urgent security concerns, email security@freelancehubpro.com with a description of the incident and any screenshots or evidence. Do not engage further with a user you suspect is acting fraudulently — stop all communication and report immediately.",
      },
      {
        title: "Is it allowed to move payments outside the platform?",
        content:
          "No. All payments for work sourced through FreelanceHub Pro must be processed exclusively through the platform's payment system for a period of 24 months from the date of first connection. Moving payments off-platform removes all Safe Deposit protections and violates our Terms and Conditions. This is also the most common form of scam on freelance platforms. Any request to pay or receive payment outside the platform should be treated as a red flag and reported immediately.",
      },
      {
        title: "What should I do if I receive a suspicious message?",
        content:
          "FreelanceHub Pro will never ask for your password, OTP, or banking credentials via message, email, or phone. If you receive a message from someone claiming to be from FreelanceHub Pro support asking for this information — or from another user offering unusually high pay, asking to move communication off-platform, or requesting upfront fees — do not comply. Use the report flag in the messaging interface and contact security@freelancehubpro.com immediately.",
      },
    ],
  },
  {
    icon: "👤",
    title: "Account & Settings",
    desc: "Managing your account, updating personal information, changing passwords, and understanding account settings.",
    articles: [
      {
        title: "How to reset your password",
        content:
          "Go to the login page and click 'Forgot Password'. Enter your registered email address and click 'Send Reset Link'. A password reset link will be sent to your email — click it and enter your new password. The link expires after 30 minutes. If you do not receive the email, check your spam folder or contact support@freelancehubpro.com.",
      },
      {
        title: "How to update your email address or phone number",
        content:
          "Log in and go to Account Settings from your dashboard. Navigate to 'Personal Information' and click 'Edit'. Update your email address or phone number and save. You may be asked to verify the new email or phone via OTP before the change takes effect. Keep your contact information current so you can receive security alerts and important platform notifications.",
      },
      {
        title: "How to request account deletion",
        content:
          "To permanently delete your account, email support@freelancehubpro.com from your registered email address with the subject line 'Account Deletion Request'. Note that you must resolve all outstanding project obligations, pending payments, and active disputes before deletion can proceed. Certain data may be retained for a legally required period for compliance purposes as outlined in our Privacy Policy.",
      },
      {
        title: "How to upgrade or cancel your membership plan",
        content:
          "Go to your dashboard and navigate to 'Membership & Plans'. Here you can view your current plan, compare available plans, and upgrade with a single click. To cancel your plan, navigate to the same section and select 'Cancel Subscription'. Cancellation takes effect at the end of your current billing period. Membership fees are non-refundable once a billing period has begun.",
      },
    ],
  },
  {
    icon: "⭐",
    title: "Ratings & Reviews",
    desc: "How the ratings system works, how to leave or respond to a review, and what affects your profile score.",
    articles: [
      {
        title: "How does the ratings system work?",
        content:
          "After every completed project, both the Client and the Freelancer have the opportunity to leave a star rating (1–5) and a written review. Ratings are visible on both parties' public profiles and contribute to their overall platform reputation score. Ratings are permanent — they cannot be removed except in cases of verified policy violations. Both parties have 14 days after project completion to leave a review.",
      },
      {
        title: "Can I dispute a review I believe is unfair?",
        content:
          "If you believe a review violates FreelanceHub Pro's review guidelines — for example, it contains false statements, was left in bad faith, or was made by a user engaged in policy violations — contact support@freelancehubpro.com with the project details and your specific concern. We review all flagged reviews but only remove those that genuinely violate our guidelines. Negative reviews based on a genuine experience are not removed.",
      },
      {
        title: "How to respond to a review left on your profile",
        content:
          "Go to your profile page and locate the review you want to respond to. Click 'Reply to Review' beneath it and type your response. Responses are public and visible to anyone viewing your profile. Keep your response professional and constructive — it reflects your communication style and professionalism to potential clients or freelancers.",
      },
    ],
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openArticle, setOpenArticle] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allArticles = helpCategories.flatMap((cat) =>
    cat.articles.map((a) => ({ ...a, category: cat.title, icon: cat.icon }))
  );

  const filteredArticles = searchQuery.trim()
    ? allArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const toggleArticle = (key: string) => {
    setOpenArticle(openArticle === key ? null : key);
  };

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">Help Center</h1>
            <p className="text-gray-600 mt-1">
              Find answers to common questions about FreelanceHub Pro — from
              getting started to payments, disputes, and account management
            </p>
          </div>

          <div className="space-y-6">

            {/* — SEARCH BAR — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search the Help Center
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  🔍
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. how to withdraw earnings, raise a dispute, reset password..."
                  className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="mt-4">
                  {filteredArticles.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-gray-500 text-sm">
                        No articles found for &quot;{searchQuery}&quot;.
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Try different keywords or{" "}
                        <a
                          href="/contact"
                          className="text-orange-600 hover:underline"
                        >
                          contact our support team
                        </a>
                        .
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-gray-400 mb-3">
                        {filteredArticles.length} result
                        {filteredArticles.length !== 1 ? "s" : ""} found
                      </p>
                      <div className="space-y-2">
                        {filteredArticles.map((a, i) => {
                          const key = `search-${i}`;
                          return (
                            <div
                              key={key}
                              className="border border-gray-100 rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() => toggleArticle(key)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                              >
                                <div>
                                  <span className="text-xs text-orange-600 font-medium">
                                    {a.icon} {a.category}
                                  </span>
                                  <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                    {a.title}
                                  </p>
                                </div>
                                <span className="text-gray-400 ml-4 flex-shrink-0">
                                  {openArticle === key ? "▲" : "▼"}
                                </span>
                              </button>
                              {openArticle === key && (
                                <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                                  {a.content}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* — HIGHLIGHT — */}
            <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-xl">
              <p className="text-gray-700 text-sm">
                <strong>Can&apos;t find what you need?</strong> Our support
                team is available Monday to Saturday, 9 AM–6 PM IST. Contact
                us at{" "}
                <a
                  href="mailto:support@freelancehubpro.com"
                  className="text-orange-600 font-medium hover:underline"
                >
                  support@freelancehubpro.com
                </a>{" "}
                or use the{" "}
                <a href="/contact" className="text-orange-600 font-medium hover:underline">
                  Contact Us
                </a>{" "}
                form and we will get back to you within 1 business day.
              </p>
            </div>

            {/* — CATEGORY FILTER PILLS — */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
                  activeCategory === null
                    ? "bg-blue-900 text-white border-blue-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                All Topics
              </button>
              {helpCategories.map((cat) => (
                <button
                  key={cat.title}
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === cat.title ? null : cat.title
                    )
                  }
                  className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
                    activeCategory === cat.title
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {cat.icon} {cat.title}
                </button>
              ))}
            </div>

            {/* — CATEGORIES + ARTICLES — */}
            <div className="space-y-5">
              {helpCategories
                .filter(
                  (cat) =>
                    activeCategory === null || activeCategory === cat.title
                )
                .map((cat) => (
                  <div
                    key={cat.title}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                  >
                    {/* Category Header */}
                    <div className="flex items-start gap-4 p-6 border-b border-gray-100">
                      <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                      <div>
                        <h2 className="text-lg font-semibold text-blue-900">
                          {cat.title}
                        </h2>
                        <p className="text-gray-500 text-sm mt-0.5">
                          {cat.desc}
                        </p>
                      </div>
                      <span className="ml-auto flex-shrink-0 text-xs bg-slate-100 text-gray-500 rounded-full px-2 py-1">
                        {cat.articles.length} articles
                      </span>
                    </div>

                    {/* Articles */}
                    <div className="divide-y divide-gray-50">
                      {cat.articles.map((article, ai) => {
                        const key = `${cat.title}-${ai}`;
                        return (
                          <div key={key}>
                            <button
                              onClick={() => toggleArticle(key)}
                              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                            >
                              <span className="text-sm font-medium text-gray-800">
                                {article.title}
                              </span>
                              <span className="text-gray-400 ml-4 flex-shrink-0 text-xs">
                                {openArticle === key ? "▲" : "▼"}
                              </span>
                            </button>
                            {openArticle === key && (
                              <div className="px-6 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3 bg-slate-50">
                                {article.content}
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-xs text-gray-400">
                                    Was this helpful?{" "}
                                    <button className="text-orange-600 hover:underline font-medium">
                                      Yes
                                    </button>{" "}
                                    ·{" "}
                                    <button className="text-orange-600 hover:underline font-medium">
                                      No
                                    </button>{" "}
                                    ·{" "}
                                    <a
                                      href="/contact"
                                      className="text-orange-600 hover:underline font-medium"
                                    >
                                      Contact support
                                    </a>
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>

            {/* — STILL NEED HELP — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Still Need Help?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: "✉️",
                    title: "Email Support",
                    desc: "Send us a message and we will respond within 1 business day.",
                    action: "support@freelancehubpro.com",
                    href: "mailto:support@freelancehubpro.com",
                  },
                  {
                    icon: "📋",
                    title: "Contact Form",
                    desc: "Use our detailed contact form to route your query to the right team.",
                    action: "Go to Contact Us →",
                    href: "/contact",
                  },
                  {
                    icon: "💬",
                    title: "Community Forum",
                    desc: "Ask the FreelanceHub Pro community — Freelancers and Clients helping each other.",
                    action: "Visit the Forum →",
                    href: "/community-forum",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 border border-gray-100 rounded-lg p-5 text-center"
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h3 className="text-sm font-semibold text-blue-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">
                      {item.desc}
                    </p>
                    <a
                      href={item.href}
                      className="text-xs font-medium text-orange-600 hover:underline"
                    >
                      {item.action}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* — RELATED LINKS — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 border-t border-t-gray-100">
              <h2 className="text-base font-semibold text-blue-900 mb-3">
                Related Resources
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Security", href: "/security" },
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Terms & Conditions", href: "/terms-&-conditions" },
                  { label: "Cookie Policy", href: "/cookie-policy" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Community Forum", href: "/community-forum" },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="text-sm text-orange-600 font-medium border border-orange-200 bg-orange-50 hover:bg-orange-100 rounded-full px-4 py-1.5 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}