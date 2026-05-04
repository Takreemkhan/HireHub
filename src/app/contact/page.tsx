"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.role ||
      !formData.subject ||
      !formData.message
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">Contact Us</h1>
            <p className="text-gray-600 mt-1">
              We are here to help — reach out to the right team and we will get
              back to you as quickly as possible
            </p>
          </div>

          <div className="space-y-6">

            {/* — TOP INTRO CARD — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed mb-3">
                At FreelanceHub Pro, we are committed to providing every
                Freelancer and Client with a responsive, human, and genuinely
                helpful support experience. Whether you have a question about
                your account, a payment concern, a dispute to report, a press
                enquiry, or feedback about the platform — our team is here to
                help.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Use the contact form below to reach us, or pick the right email
                channel from our department directory. We aim to respond to all
                enquiries within{" "}
                <strong>1–2 business days</strong>.
              </p>
            </div>

            {/* — CONTACT CHANNELS GRID — */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: "🛠️",
                  dept: "General Support",
                  desc: "Account issues, login problems, profile questions, platform navigation, and general how-to queries.",
                  email: "support@freelancehubpro.com",
                  response: "Within 1 business day",
                },
                {
                  icon: "💳",
                  dept: "Payments & Billing",
                  desc: "Safe Deposit (Escrow) queries, payment failures, withdrawal issues, membership billing, and refund requests.",
                  email: "billing@freelancehubpro.com",
                  response: "Within 1 business day",
                },
                {
                  icon: "⚖️",
                  dept: "Disputes & Trust",
                  desc: "Raising a project dispute, reporting fraud, flagging policy violations, or escalating an unresolved issue.",
                  email: "disputes@freelancehubpro.com",
                  response: "Within 1 business day",
                },
                {
                  icon: "📰",
                  dept: "Press & Media",
                  desc: "Media enquiries, interview requests, press kit assets, on-record commentary, and partnership coverage.",
                  email: "press@freelancehubpro.com",
                  response: "Within 1 business day",
                },
                {
                  icon: "🔒",
                  dept: "Security & Safety",
                  desc: "Reporting a security vulnerability, phishing attempts, suspected fraud, or unauthorised account access.",
                  email: "security@freelancehubpro.com",
                  response: "Within 4 business hours",
                },
                {
                  icon: "📜",
                  dept: "Legal & Compliance",
                  desc: "Legal notices, data protection requests, terms-related queries, and compliance or regulatory matters.",
                  email: "legal@freelancehubpro.com",
                  response: "Within 2 business days",
                },
              ].map((ch, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col"
                >
                  <div className="text-2xl mb-3">{ch.icon}</div>
                  <h3 className="text-base font-semibold text-blue-900 mb-1">
                    {ch.dept}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-grow mb-3">
                    {ch.desc}
                  </p>
                  <a
                    href={`mailto:${ch.email}`}
                    className="text-orange-600 font-medium text-sm hover:underline break-all"
                  >
                    {ch.email}
                  </a>
                  <p className="text-xs text-gray-400 mt-1">
                    Response: {ch.response}
                  </p>
                </div>
              ))}
            </div>

            {/* — HIGHLIGHT BOX — */}
            <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-xl">
              <p className="text-gray-700">
                <strong>Security reports get priority.</strong> If you are
                reporting a security vulnerability or a suspected account breach,
                email{" "}
                <a
                  href="mailto:security@freelancehubpro.com"
                  className="text-orange-600 font-medium hover:underline"
                >
                  security@freelancehubpro.com
                </a>{" "}
                directly for the fastest response. For all other urgent matters,
                use the contact form below and select the appropriate topic — we
                prioritise accordingly.
              </p>
            </div>

            {/* — MAIN FORM + SIDEBAR GRID — */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* FORM */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-blue-900 mb-1">
                  Send Us a Message
                </h2>
                <p className="text-gray-500 text-sm mb-6">
                  Fill in the form below and the right team will be in touch.
                  All fields are required.
                </p>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-2xl mb-4">
                      ✓
                    </div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                      Message Received
                    </h3>
                    <p className="text-gray-600 text-sm max-w-sm">
                      Thank you for reaching out. Our team will review your
                      message and respond to{" "}
                      <strong>{formData.email}</strong> within 1–2 business
                      days.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          role: "",
                          subject: "",
                          message: "",
                        });
                      }}
                      className="mt-6 text-sm text-orange-600 hover:underline font-medium"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Arjun Sharma"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-400"
                        />
                      </div>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        I am a...
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      >
                        <option value="">Select your role</option>
                        <option value="freelancer">Freelancer</option>
                        <option value="client">Client / Business</option>
                        <option value="press">Journalist / Press</option>
                        <option value="partner">
                          Partner / Investor
                        </option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Topic / Subject
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                      >
                        <option value="">Select a topic</option>
                        <optgroup label="Account">
                          <option value="account-login">
                            Login or account access issue
                          </option>
                          <option value="account-profile">
                            Profile or verification query
                          </option>
                          <option value="account-deletion">
                            Account deletion request
                          </option>
                        </optgroup>
                        <optgroup label="Payments & Billing">
                          <option value="payment-escrow">
                            Safe Deposit (Escrow) query
                          </option>
                          <option value="payment-withdrawal">
                            Withdrawal or payout issue
                          </option>
                          <option value="payment-membership">
                            Membership or subscription billing
                          </option>
                          <option value="payment-failed">
                            Failed or pending payment
                          </option>
                          <option value="payment-refund">
                            Refund request
                          </option>
                        </optgroup>
                        <optgroup label="Projects & Work">
                          <option value="project-dispute">
                            Raise a project dispute
                          </option>
                          <option value="project-proposal">
                            Proposal or hiring query
                          </option>
                          <option value="project-milestone">
                            Milestone or delivery issue
                          </option>
                        </optgroup>
                        <optgroup label="Trust & Safety">
                          <option value="safety-fraud">
                            Report fraud or scam
                          </option>
                          <option value="safety-security">
                            Security or account breach
                          </option>
                          <option value="safety-policy">
                            Report a policy violation
                          </option>
                        </optgroup>
                        <optgroup label="Other">
                          <option value="press">Press or media enquiry</option>
                          <option value="legal">Legal or compliance</option>
                          <option value="partnership">
                            Partnership or collaboration
                          </option>
                          <option value="feedback">
                            Platform feedback or suggestion
                          </option>
                          <option value="other">Other</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Please describe your question or issue in as much detail as possible. If it relates to a payment or project, include the relevant project ID or transaction reference."
                        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent placeholder-gray-400 resize-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        The more detail you provide, the faster we can help.
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full bg-blue-900 text-white font-medium text-sm py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>

                    <p className="text-xs text-gray-400 text-center">
                      By submitting this form you agree to our{" "}
                      <a
                        href="/privacy-policy"
                        className="text-orange-600 hover:underline"
                      >
                        Privacy Policy
                      </a>
                      . We will never share your details with third parties.
                    </p>
                  </div>
                )}
              </div>

              {/* SIDEBAR */}
              <div className="space-y-4">

                {/* Response Times */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-base font-semibold text-blue-900 mb-3">
                    Response Times
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: "General Support",
                        time: "≤ 1 business day",
                        dot: "bg-green-400",
                      },
                      {
                        label: "Payments & Billing",
                        time: "≤ 1 business day",
                        dot: "bg-green-400",
                      },
                      {
                        label: "Disputes",
                        time: "≤ 1 business day",
                        dot: "bg-green-400",
                      },
                      {
                        label: "Security Reports",
                        time: "≤ 4 business hours",
                        dot: "bg-orange-400",
                      },
                      {
                        label: "Press & Media",
                        time: "≤ 1 business day",
                        dot: "bg-green-400",
                      },
                      {
                        label: "Legal",
                        time: "≤ 2 business days",
                        dot: "bg-yellow-400",
                      },
                    ].map((r, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full flex-shrink-0 ${r.dot}`}
                          />
                          <span className="text-sm text-gray-600">
                            {r.label}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-500">
                          {r.time}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">
                    Business hours: Mon–Sat, 9 AM–6 PM IST
                  </p>
                </div>

                {/* Platform Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-base font-semibold text-blue-900 mb-3">
                    Platform Information
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">
                        Website:{" "}
                      </span>
                      <a
                        href="https://www.freelancehubpro.com"
                        className="text-orange-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        freelancehubpro.com
                      </a>
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Primary market:{" "}
                      </span>
                      India
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Founded:{" "}
                      </span>
                      2024
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Launched:{" "}
                      </span>
                      April 2025
                    </p>
                    <p>
                      <span className="font-medium text-gray-800">
                        Support hours:{" "}
                      </span>
                      Mon–Sat, 9 AM–6 PM IST
                    </p>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="text-base font-semibold text-blue-900 mb-3">
                    Quick Links
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: "Help Center", href: "/help-center" },
                      { label: "Privacy Policy", href: "/privacy-policy" },
                      {
                        label: "Terms & Conditions",
                        href: "/terms-&-conditions",
                      },
                      { label: "Security", href: "/security" },
                      { label: "Cookie Policy", href: "/cookie-policy" },
                      { label: "Press Kit", href: "/press-kit" },
                    ].map((link, i) => (
                      <a
                        key={i}
                        href={link.href}
                        className="flex items-center justify-between text-sm text-gray-600 hover:text-orange-600 transition-colors group"
                      >
                        <span>{link.label}</span>
                        <span className="text-gray-300 group-hover:text-orange-400">
                          →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* — BEFORE YOU CONTACT FAQ — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Before You Contact Us — Common Questions
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                Many common questions are answered below. Check if your query
                is covered here first — it may save you time waiting for a
                response.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    q: "My payment is stuck or pending — what should I do?",
                    a: "Payment processing times vary by method. Razorpay and UPI payments typically settle within a few minutes to a few hours. PayPal can take up to 1 business day. If your payment has been pending for more than 24 hours, contact billing@freelancehubpro.com with your transaction reference number.",
                  },
                  {
                    q: "I cannot log into my account — how do I recover access?",
                    a: "Click 'Forgot Password' on the login page and follow the reset instructions sent to your registered email. If you no longer have access to your registered email, contact support@freelancehubpro.com with your account username and the email address used at registration.",
                  },
                  {
                    q: "How do I raise a dispute for my project?",
                    a: "Disputes can only be raised for projects where the Safe Deposit (Escrow) service was used. Go to your active project, click 'Raise Dispute', and follow the on-screen steps. Both parties will have 10 business days to reach a resolution. If you need guidance, contact disputes@freelancehubpro.com.",
                  },
                  {
                    q: "A client/freelancer is asking me to pay or communicate outside the platform — is this allowed?",
                    a: "No. Moving payments or communication outside FreelanceHub Pro is a violation of our Terms and Conditions and removes all platform protections. This is also a common sign of a scam. Report any such request immediately at security@freelancehubpro.com or use the report flag on the user's profile.",
                  },
                  {
                    q: "How do I request a refund for my membership plan?",
                    a: "Membership fees are non-refundable once the billing period has begun, as stated in our Terms and Conditions. If you believe you have been charged incorrectly, contact billing@freelancehubpro.com with your account email and the transaction details, and we will review your case.",
                  },
                  {
                    q: "How do I delete my FreelanceHub Pro account?",
                    a: "To request account deletion, email support@freelancehubpro.com from your registered email address with the subject line 'Account Deletion Request'. Please note that outstanding project obligations must be resolved before deletion can be processed, and certain data may be retained for legal compliance purposes as outlined in our Privacy Policy.",
                  },
                  {
                    q: "I found a security vulnerability in the platform — how do I report it?",
                    a: "Please report all security vulnerabilities responsibly by emailing security@freelancehubpro.com. Include a clear description of the vulnerability, the steps to reproduce it, and any relevant screenshots or evidence. Please do not publicly disclose the vulnerability before we have addressed it.",
                  },
                  {
                    q: "How can I update the email address or phone number on my account?",
                    a: "Go to Account Settings in your dashboard and navigate to the Personal Information section. You can update your email address and phone number from there. If you experience any issues, contact support@freelancehubpro.com with your account username.",
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0 md:border-b-0 md:pb-0"
                  >
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* — WHAT HAPPENS AFTER YOU CONTACT US — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                What Happens After You Contact Us
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    step: "01",
                    title: "We Receive Your Message",
                    desc: "Your message arrives in our support queue and is automatically categorised by topic for routing to the right team.",
                  },
                  {
                    step: "02",
                    title: "A Team Member Reviews It",
                    desc: "A real, human team member reads your message — we do not use scripted auto-responses for substantive queries.",
                  },
                  {
                    step: "03",
                    title: "We Investigate",
                    desc: "If your query involves an account, payment, or dispute, we look into the details before responding — so we can give you a useful answer, not just a generic one.",
                  },
                  {
                    step: "04",
                    title: "We Respond",
                    desc: "You receive our response at your registered email. If we need more information from you, we will ask clearly and specifically.",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 border border-gray-100 rounded-lg p-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold mb-3">
                      {s.step}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">
                      {s.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* — TIPS FOR FASTER SUPPORT — */}
            <div className="border-l-4 border-orange-500 bg-orange-50 p-5 rounded-xl">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Tips for a Faster Resolution
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Always contact us from your registered FreelanceHub Pro email address",
                  "Include your account username or registered email in your message",
                  "For payment queries, include the transaction reference or project ID",
                  "For disputes, describe the issue clearly with dates and amounts",
                  "For security concerns, attach screenshots or evidence if available",
                  "Select the correct topic category when using the contact form",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">
                      ✓
                    </span>
                    <p className="text-sm text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* — RELATED PAGES — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 pt-6 border-t-0 rounded-t-none">
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-base font-semibold text-blue-900 mb-3">
                  Other Helpful Pages
                </h2>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Help Center", href: "/help-center" },
                    { label: "Security", href: "/security" },
                    { label: "Privacy Policy", href: "/privacy-policy" },
                    { label: "Terms & Conditions", href: "/terms-&-conditions" },
                    { label: "Cookie Policy", href: "/cookie-policy" },
                    { label: "Press Kit", href: "/press-kit" },
                    { label: "Careers", href: "/careers" },
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
        </div>
      </main>
      <FooterSection />
    </>
  );
}