import React from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

export const metadata = {
  title: "Press Kit | FreelanceHub Pro",
  description:
    "FreelanceHub Pro press kit — company overview, platform facts, brand assets, milestones, boilerplate, and media contact information for journalists and media professionals.",
};

export default function PressKitPage() {
  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen mt-10">
        {/* Page Wrapper */}
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">Press Kit</h1>
            <p className="text-gray-600 mt-1">
              Everything journalists, bloggers, analysts, and media professionals
              need to accurately cover FreelanceHub Pro
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 space-y-10">

            {/* — INTRO — */}
            <section>
              <p className="text-sm text-gray-500 mb-4">
                Last Updated: April 27, 2025
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                Thank you for your interest in FreelanceHub Pro. This press kit
                is designed to give journalists, editors, bloggers, podcasters,
                analysts, and media professionals fast, accurate access to
                everything they need to cover our platform — from company facts
                and approved brand assets to platform milestones and leadership
                information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                If you require assets, information, or commentary not found on
                this page, please contact our media team directly at{" "}
                <a
                  href="mailto:press@freelancehubpro.com"
                  className="text-orange-600 font-medium hover:underline"
                >
                  press@freelancehubpro.com
                </a>
                . We aim to respond to all media enquiries within one business
                day.
              </p>
            </section>

            {/* — HIGHLIGHT BOX — */}
            <section className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
              <p className="text-gray-700">
                <strong>Media use:</strong> All brand assets on this page are
                approved for editorial use in press coverage, reviews, and media
                articles about FreelanceHub Pro. Assets may not be altered,
                recoloured, or used to imply endorsement without prior written
                consent. See our Brand Usage Guidelines below for details.
              </p>
            </section>

            {/* — COMPANY OVERVIEW — */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Company Overview
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Who We Are
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro is an Indian freelance marketplace platform
                    that connects independent professionals (Freelancers) with
                    businesses and individuals (Clients) seeking skilled talent
                    for project-based work. Our platform provides end-to-end
                    tools for project discovery, proposal submission, contract
                    management, real-time collaboration, milestone tracking, and
                    secure payments — all in one place.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Our Mission
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    To make independent work more accessible, secure, and
                    financially rewarding for every skilled professional in India
                    — regardless of their location, background, or years of
                    experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    The Problem We Solve
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Millions of skilled freelancers in India face serious
                    challenges on traditional platforms and in unstructured
                    client relationships — unpaid work, unreliable clients,
                    off-platform payment scams, and the absence of a fair
                    dispute resolution mechanism. FreelanceHub Pro addresses
                    these problems directly through our Safe Deposit (Escrow)
                    payment system, structured dispute resolution, verified
                    profiles, and a transparent rating ecosystem.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Our Platform
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    FreelanceHub Pro operates at{" "}
                    <a
                      href="https://www.freelancehubpro.com"
                      className="text-orange-600 font-medium hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      freelancehubpro.com
                    </a>{" "}
                    and is accessible via web and mobile browsers. The platform
                    supports Clients in posting projects, reviewing freelancer
                    proposals, managing work through milestone-based workflows,
                    and processing payments securely via Razorpay, PayPal, and
                    UPI. Freelancers can build verified profiles, submit
                    proposals, deliver work, and withdraw earnings through the
                    same integrated environment.
                  </p>
                </div>
              </div>
            </section>

            {/* — PLATFORM FACTS & STATS — */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Platform Facts &amp; Key Statistics
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                The following statistics reflect FreelanceHub Pro&apos;s
                platform activity as of April 2025. Journalists are welcome to
                cite these figures in editorial coverage with attribution to
                FreelanceHub Pro.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  { stat: "April 2025", label: "Platform launch date" },
                  { stat: "India", label: "Primary market" },
                  { stat: "20+", label: "Skill categories supported" },
                  { stat: "Razorpay, PayPal & UPI", label: "Payment methods" },
                  { stat: "₹500 or 5%", label: "Dispute resolution fee (min.)" },
                  { stat: "24 months", label: "Non-circumvention period" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 border border-gray-100 rounded-lg p-4 text-center"
                  >
                    <p className="text-lg font-bold text-blue-900 mb-1">
                      {item.stat}
                    </p>
                    <p className="text-sm text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* Industry Context */}
              <div className="bg-slate-50 border border-gray-100 rounded-lg p-5">
                <h3 className="text-base font-semibold text-gray-800 mb-3">
                  Industry Context — Why FreelanceHub Pro Matters
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                  <li>
                    India is home to an estimated{" "}
                    <strong>15 million freelancers</strong> — one in four
                    freelancers globally is Indian, making it one of the largest
                    independent talent markets in the world.
                  </li>
                  <li>
                    The Indian freelance platforms market generated{" "}
                    <strong>USD 265 million in revenue in 2025</strong> and is
                    projected to reach USD 1.5 billion by 2033, growing at a
                    CAGR of 25.1%.
                  </li>
                  <li>
                    Despite this scale, a significant share of Indian freelancers
                    operate without payment protection, structured contracts, or
                    accessible dispute resolution — the exact gap FreelanceHub
                    Pro is built to address.
                  </li>
                  <li>
                    The global freelance platform market is projected to reach{" "}
                    <strong>USD 13.92 billion by 2028</strong>, driven by
                    increasing internet penetration, remote work adoption, and
                    the rise of the gig economy.
                  </li>
                </ul>
                <p className="text-xs text-gray-400 mt-3">
                  Sources: StartupTalky, Grand View Research, Horizon Databook
                  (2025)
                </p>
              </div>
            </section>

            {/* — PLATFORM MILESTONES — */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Company Milestones
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                FreelanceHub Pro is an early-stage platform. Below is a timeline
                of key milestones in our development and launch journey.
              </p>
              <div className="space-y-0">
                {[
                  {
                    date: "2024 — Q3",
                    title: "Concept &amp; Founding",
                    desc: "FreelanceHub Pro is conceived as a solution to the payment protection and trust gap experienced by Indian freelancers. Core team assembled and initial product architecture designed.",
                  },
                  {
                    date: "2024 — Q4",
                    title: "Product Development Begins",
                    desc: "Full-stack development of the platform begins, including the core marketplace, user authentication, real-time messaging, and the Safe Deposit (Escrow) payment infrastructure with Razorpay integration.",
                  },
                  {
                    date: "2025 — Q1",
                    title: "Beta Testing",
                    desc: "Closed beta launched with an initial cohort of Freelancers and Clients. Proposal workflows, milestone management, dispute resolution, and PayPal/UPI payment methods tested and refined based on real user feedback.",
                  },
                  {
                    date: "April 2025",
                    title: "Official Platform Launch",
                    desc: "FreelanceHub Pro publicly launches at freelancehubpro.com. The platform goes live with full support for job posting, proposals, real-time chat, Safe Deposit payments, milestone approvals, and the dispute resolution system.",
                  },
                  {
                    date: "2025 — Ongoing",
                    title: "Growth &amp; Feature Expansion",
                    desc: "Post-launch development continues with additions including bid insights, resume video profiles, freelancer membership plans, client membership plans, an admin dashboard, and enhanced platform security infrastructure.",
                  },
                ].map((m, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0 mt-1.5" />
                      {i < 4 && (
                        <div className="w-px flex-grow bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">
                        {m.date}
                      </p>
                      <h3
                        className="text-base font-semibold text-gray-800 mb-1"
                        dangerouslySetInnerHTML={{ __html: m.title }}
                      />
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* — PLATFORM FEATURES — */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Key Platform Features
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5">
                The following is a factual overview of FreelanceHub Pro&apos;s
                core product features for use in editorial descriptions,
                product reviews, and platform comparisons.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Safe Deposit (Escrow) Payments",
                    desc: "Clients fund project payments into a secure escrow before work begins. Funds are held by FreelanceHub Pro and released to the Freelancer only upon Client approval of deliverables. Milestone-based releases are supported for larger projects.",
                  },
                  {
                    title: "Real-Time Messaging & File Sharing",
                    desc: "Built-in messaging system with file upload support allows Clients and Freelancers to communicate, share documents, and collaborate entirely within the platform — eliminating the need for external communication tools.",
                  },
                  {
                    title: "Proposal & Bidding System",
                    desc: "Freelancers submit structured proposals on client projects, including pricing, timelines, and approach. Clients review and compare proposals before making hiring decisions. Proposal credits are managed through membership plans.",
                  },
                  {
                    title: "Milestone Management",
                    desc: "Projects can be broken into milestones with individual payment releases, approval workflows, and revision requests — giving both parties structured checkpoints throughout the project lifecycle.",
                  },
                  {
                    title: "Dispute Resolution System",
                    desc: "A formal dispute resolution process is available for Escrow-funded projects. FreelanceHub Pro facilitates a 10-business-day mediation window, followed by binding arbitration if required. A transparent fee structure applies.",
                  },
                  {
                    title: "Verified Freelancer Profiles",
                    desc: "Freelancer profiles include skills, portfolio items, work history, ratings, and reviews from past clients. Identity verification is available to add a verification badge to qualifying profiles.",
                  },
                  {
                    title: "Bid Insights & Analytics",
                    desc: "Freelancers have access to bid insights that help analyse proposal performance and optimise future submissions. Clients can track project activity, payment history, and escrow status through their dashboard.",
                  },
                  {
                    title: "Membership Plans",
                    desc: "Optional membership tiers are available for both Freelancers and Clients, offering increased proposal credits, priority visibility, enhanced profile features, and access to premium platform tools.",
                  },
                  {
                    title: "Multi-Method Payment Support",
                    desc: "The platform supports payments via Razorpay, PayPal, and UPI, covering a wide range of payment preferences for Indian and international users. All payment processing is handled by PCI DSS-certified providers.",
                  },
                  {
                    title: "Resume Video Profiles",
                    desc: "Freelancers can upload a short video resume to their profile, giving Clients a more personal and compelling introduction to their skills, communication style, and professional background.",
                  },
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="bg-slate-50 border border-gray-100 rounded-lg p-5"
                  >
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* — BOILERPLATE — */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Approved Company Boilerplate
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The following boilerplate descriptions are approved for use in
                press articles, analyst reports, partnership materials, and any
                editorial coverage of FreelanceHub Pro. Please use the
                appropriate version based on the available word count.
              </p>
              <div className="space-y-5">

                {/* Short */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Short Description (1 sentence)
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">
                      ~25 words
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic border-l-4 border-orange-300 pl-4">
                    FreelanceHub Pro is an Indian freelance marketplace that
                    connects skilled independent professionals with clients
                    through a secure, escrow-protected platform.
                  </p>
                </div>

                {/* Medium */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Medium Description (2–3 sentences)
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">
                      ~60 words
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic border-l-4 border-orange-300 pl-4">
                    FreelanceHub Pro is an Indian freelance marketplace platform
                    that connects skilled independent professionals with
                    businesses and individuals seeking project-based talent. The
                    platform offers end-to-end tools for project posting,
                    proposal submission, real-time collaboration, and
                    milestone-based payments secured through a Safe Deposit
                    (Escrow) system. FreelanceHub Pro is designed to make
                    independent work fairer, safer, and more accessible for
                    freelancers across India.
                  </p>
                </div>

                {/* Full */}
                <div className="border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      Full Boilerplate (for press releases &amp; articles)
                    </h3>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">
                      ~120 words
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic border-l-4 border-orange-300 pl-4">
                    FreelanceHub Pro (freelancehubpro.com) is an Indian
                    freelance marketplace platform that connects skilled
                    independent professionals with clients seeking project-based
                    talent across more than 20 skill categories. Launched in
                    April 2025, the platform provides Freelancers and Clients
                    with a comprehensive set of tools including project posting,
                    structured proposal management, real-time messaging, file
                    collaboration, milestone tracking, and a Safe Deposit
                    (Escrow) payment system that holds funds securely until
                    project deliverables are approved. FreelanceHub Pro supports
                    payments via Razorpay, PayPal, and UPI, and includes a
                    formal dispute resolution process for Escrow-funded projects.
                    The platform is designed to address the payment protection
                    and trust gap faced by India&apos;s estimated 15 million
                    freelancers, making independent work safer, more
                    transparent, and more rewarding for professionals at every
                    stage of their career.
                  </p>
                </div>

              </div>
            </section>

            {/* — BRAND GUIDELINES — */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Brand Usage Guidelines
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To ensure FreelanceHub Pro is represented consistently and
                accurately across all media, please follow these brand usage
                guidelines when publishing content that references or features
                our brand.
              </p>

              <div className="space-y-5">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Brand Name
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">
                    Always write our brand name as{" "}
                    <strong>FreelanceHub Pro</strong> — two words capitalised,
                    with no spaces between &quot;Freelance&quot; and
                    &quot;Hub&quot;, and &quot;Pro&quot; as a separate word.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">
                        ✓ Correct
                      </p>
                      <p className="text-sm text-gray-700">FreelanceHub Pro</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-600 mb-1">
                        ✗ Incorrect
                      </p>
                      <p className="text-sm text-gray-500">
                        Freelancehub Pro / freelancehubpro / Freelance Hub Pro /
                        FHP
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Brand Colours
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    FreelanceHub Pro&apos;s primary brand colours are:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-900 border border-gray-200" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Primary Blue
                        </p>
                        <p className="text-xs text-gray-500">#1e3a5f</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500 border border-gray-200" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Accent Orange
                        </p>
                        <p className="text-xs text-gray-500">#f97316</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-gray-200" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Background Slate
                        </p>
                        <p className="text-xs text-gray-500">#f8fafc</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          White
                        </p>
                        <p className="text-xs text-gray-500">#ffffff</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Logo Usage Rules
                  </h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                    <li>
                      Do not stretch, distort, rotate, or alter the proportions
                      of the FreelanceHub Pro logo in any way.
                    </li>
                    <li>
                      Do not change the logo&apos;s colours outside of the
                      approved primary and white variants.
                    </li>
                    <li>
                      Always maintain clear space around the logo — a minimum
                      of the logo&apos;s height on all sides.
                    </li>
                    <li>
                      Do not place the logo on backgrounds that reduce its
                      legibility or contrast.
                    </li>
                    <li>
                      Do not use the logo in a way that implies endorsement of a
                      product, service, or viewpoint without written approval.
                    </li>
                    <li>
                      Logo files for media use are available upon request —
                      contact{" "}
                      <a
                        href="mailto:press@freelancehubpro.com"
                        className="text-orange-600 font-medium hover:underline"
                      >
                        press@freelancehubpro.com
                      </a>
                      .
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-2">
                    Screenshots &amp; Platform Images
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Screenshots of the FreelanceHub Pro platform may be used in
                    editorial coverage provided they are current, unaltered, and
                    used in a context that accurately represents the platform.
                    Screenshots must not be edited to misrepresent features,
                    pricing, or user data. High-resolution platform screenshots
                    for editorial use are available on request.
                  </p>
                </div>
              </div>
            </section>

            {/* — PLATFORM HIGHLIGHTS BOX 2 — */}
            <section className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded">
              <p className="text-gray-700">
                <strong>For journalists:</strong> If you are writing a story
                about the Indian freelance economy, gig work, payment protection
                for independent workers, or startup innovation in the future of
                work space — our team is available for background briefings,
                on-record commentary, and data support. Reach us at{" "}
                <a
                  href="mailto:press@freelancehubpro.com"
                  className="text-orange-600 font-medium hover:underline"
                >
                  press@freelancehubpro.com
                </a>
                .
              </p>
            </section>

            {/* — FREQUENTLY ASKED QUESTIONS — */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Frequently Asked Questions — For Media
              </h2>
              <div className="space-y-5">
                {[
                  {
                    q: "What is FreelanceHub Pro and how does it differ from other freelance platforms?",
                    a: "FreelanceHub Pro is an Indian-built freelance marketplace focused specifically on the needs of Indian Freelancers and Clients. Unlike global platforms, we support INR transactions via UPI and Razorpay, provide a formal escrow-based Safe Deposit system, include structured milestone management, and offer a built-in dispute resolution process — all in one integrated platform designed around the Indian market's realities.",
                  },
                  {
                    q: "Who are FreelanceHub Pro's primary users?",
                    a: "Our primary users are two groups: Freelancers — skilled independent professionals across categories including software development, design, writing, marketing, video, data, and business consulting — and Clients — businesses, startups, entrepreneurs, and individuals who need project-based talent. The platform is built for both groups equally.",
                  },
                  {
                    q: "How does the Safe Deposit (Escrow) system work?",
                    a: "When a Client hires a Freelancer through FreelanceHub Pro, they are required to fund the project amount into a Safe Deposit before work begins. FreelanceHub Pro holds these funds securely. Once the Freelancer delivers the work and the Client approves it, the funds are released to the Freelancer. If a dispute arises, our formal Dispute Resolution process is triggered before any funds are released.",
                  },
                  {
                    q: "Is FreelanceHub Pro available only in India?",
                    a: "FreelanceHub Pro is headquartered in India and primarily serves the Indian market. However, the platform supports international payment methods including PayPal, making it accessible to users outside India as well. Our Terms and Conditions are governed by Indian law.",
                  },
                  {
                    q: "When was FreelanceHub Pro founded and launched?",
                    a: "FreelanceHub Pro was founded in 2024 and officially launched in April 2025. The platform is currently in its early growth stage following a closed beta testing period.",
                  },
                  {
                    q: "Does FreelanceHub Pro have a mobile application?",
                    a: "FreelanceHub Pro is currently available as a mobile-responsive web platform accessible through any modern browser on iOS and Android devices. A dedicated mobile application is part of our product roadmap.",
                  },
                  {
                    q: "How can I request an interview, data, or additional information?",
                    a: "All press and media enquiries should be directed to our media team at press@freelancehubpro.com. Please include your publication name, the nature of your story, and your deadline. We aim to respond within one business day.",
                  },
                ].map((faq, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
                  >
                    <h3 className="text-base font-semibold text-gray-800 mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* — RELATED POLICIES — */}
            <section>
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                Related Resources
              </h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                The following pages may be useful for journalists researching
                FreelanceHub Pro&apos;s policies, platform structure, and
                operations:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Privacy Policy
                  </a>{" "}
                  — how user data is collected, used, and protected
                </li>
                <li>
                  <a
                    href="/terms-&-conditions"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Terms and Conditions
                  </a>{" "}
                  — platform rules, fee structures, and user obligations
                </li>
                <li>
                  <a
                    href="/security"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Security
                  </a>{" "}
                  — platform security infrastructure and fraud prevention
                </li>
                <li>
                  <a
                    href="/cookie-policy"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    Cookie Policy
                  </a>{" "}
                  — how cookies and tracking technologies are used
                </li>
              </ul>
            </section>

            {/* — MEDIA CONTACT — */}
            <section className="pt-6 border-t">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Media &amp; Press Contact
              </h2>
              <p className="text-gray-700 mb-4">
                For all press enquiries, interview requests, logo and asset
                requests, data queries, or on-the-record commentary, please
                contact our media team. We aim to respond to all media requests
                within one business day.
              </p>
              <div className="bg-slate-50 border border-gray-100 rounded-lg p-5 space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Press &amp; Media: </span>
                  <a
                    href="mailto:press@freelancehubpro.com"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    press@freelancehubpro.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">General enquiries: </span>
                  <a
                    href="mailto:support@freelancehubpro.com"
                    className="text-orange-600 font-medium hover:underline"
                  >
                    support@freelancehubpro.com
                  </a>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Legal &amp; partnerships: </span>
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