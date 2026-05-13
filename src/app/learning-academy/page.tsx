"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

const tracks = [
  {
    id: "freelancer-foundations",
    icon: "🚀",
    title: "Freelancer Foundations",
    subtitle: "For those just starting their freelance journey",
    level: "Beginner",
    levelColor: "bg-green-100 text-green-700",
    duration: "4–6 hours",
    modules: 6,
    desc: "Everything you need to launch your freelance career on FreelanceHub Pro — from building a profile that wins attention to submitting your first proposal with confidence.",
    outcomes: [
      "Create a professional Freelancer profile that clients trust",
      "Understand how the Safe Deposit system protects your earnings",
      "Write a proposal that stands out from generic templates",
      "Price your services competitively for your first projects",
      "Deliver work professionally and earn your first review",
    ],
    lessons: [
      {
        no: "01",
        title: "Setting Up Your FreelanceHub Pro Profile",
        duration: "35 min",
        desc: "A step-by-step walkthrough of every profile section — photo, headline, bio, skills, hourly rate, and portfolio. Understand what clients see first and how to make those 20 seconds count.",
      },
      {
        no: "02",
        title: "Understanding the Freelance Marketplace",
        duration: "25 min",
        desc: "How FreelanceHub Pro works as a two-sided marketplace. How projects get posted, how proposals are evaluated, and the lifecycle of a project from posting to payment.",
      },
      {
        no: "03",
        title: "Building a Portfolio From Scratch",
        duration: "40 min",
        desc: "No clients yet? No problem. Learn how to create compelling portfolio samples using personal and fictional projects, what to include in each item, and how to present your work professionally.",
      },
      {
        no: "04",
        title: "Writing Your First Proposal",
        duration: "45 min",
        desc: "The anatomy of a winning proposal — opening lines, demonstrating understanding, describing your approach, setting a timeline, and pricing. Includes real before-and-after proposal examples.",
      },
      {
        no: "05",
        title: "Pricing for Beginners — How to Set Your Rate",
        duration: "30 min",
        desc: "Why most new freelancers get pricing wrong and how to fix it. A framework for setting your starting rate, when to raise it, and how your membership plan affects your earning potential.",
      },
      {
        no: "06",
        title: "Delivering Work and Getting Your First Review",
        duration: "30 min",
        desc: "How to manage client communication, submit deliverables through the platform, handle revision requests professionally, and ask for a review after a successful project.",
      },
    ],
  },
  {
    id: "winning-more-work",
    icon: "🏆",
    title: "Winning More Work",
    subtitle: "Level up your proposal game and win bigger projects",
    level: "Intermediate",
    levelColor: "bg-blue-100 text-blue-700",
    duration: "5–7 hours",
    modules: 6,
    desc: "For Freelancers who have their first few projects but want to win more consistently, raise their rates, and attract higher-quality clients.",
    outcomes: [
      "Write proposals that convert at a significantly higher rate",
      "Identify and target the most profitable project types in your category",
      "Build a profile that generates inbound enquiries — not just outbound bids",
      "Use the Bid Insights tool to analyse and improve proposal performance",
      "Raise your rates confidently and retain existing clients",
    ],
    lessons: [
      {
        no: "01",
        title: "Profile Optimisation for Search Visibility",
        duration: "35 min",
        desc: "How clients search for Freelancers on FreelanceHub Pro, what signals the platform uses to rank profiles, and the specific changes that improve your visibility in search results.",
      },
      {
        no: "02",
        title: "Advanced Proposal Strategy",
        duration: "50 min",
        desc: "How to tailor proposals for different project types, budget tiers, and client experience levels. Includes frameworks for opening lines, case studies, and closing with a clear call to action.",
      },
      {
        no: "03",
        title: "Using Bid Insights to Improve Your Win Rate",
        duration: "30 min",
        desc: "A deep dive into the FreelanceHub Pro Bid Insights tool — how to read your proposal analytics, identify patterns in successful versus unsuccessful bids, and use data to refine your approach.",
      },
      {
        no: "04",
        title: "Identifying High-Value Projects and Clients",
        duration: "35 min",
        desc: "Not all projects are worth your time. Learn to identify projects with the highest earning potential, recognise red flags in project briefs, and prioritise proposals based on fit and ROI.",
      },
      {
        no: "05",
        title: "When and How to Raise Your Rates",
        duration: "30 min",
        desc: "A structured approach to increasing your rates at the right time, how to communicate rate changes to existing clients, and how to position higher pricing as a signal of quality.",
      },
      {
        no: "06",
        title: "Building Long-Term Client Relationships",
        duration: "40 min",
        desc: "How to turn one-time projects into repeat engagements, when and how to propose retainer arrangements, and how to use the platform tools to manage ongoing client relationships professionally.",
      },
    ],
  },
  {
    id: "payments-and-finance",
    icon: "💳",
    title: "Payments, Escrow & Financial Management",
    subtitle: "Get paid correctly, on time, every time",
    level: "All Levels",
    levelColor: "bg-orange-100 text-orange-700",
    duration: "3–4 hours",
    modules: 5,
    desc: "The financial side of freelancing in India — Safe Deposit (Escrow), withdrawals, milestone payments, fee structures, and a practical introduction to tax compliance for Indian freelancers.",
    outcomes: [
      "Understand exactly how the Safe Deposit system protects every project",
      "Set up and use milestone payments for large projects",
      "Withdraw earnings efficiently via Razorpay, PayPal, and UPI",
      "Understand FreelanceHub Pro's fee structure and how to factor it into pricing",
      "Know your basic tax obligations as an Indian freelancer earning through platforms",
    ],
    lessons: [
      {
        no: "01",
        title: "How the Safe Deposit (Escrow) System Works",
        duration: "35 min",
        desc: "A complete walkthrough of the Safe Deposit system — how funds are held, what triggers release, what happens during disputes, and why never starting work without funded escrow is the most important rule on the platform.",
      },
      {
        no: "02",
        title: "Milestone-Based Payments for Large Projects",
        duration: "35 min",
        desc: "How to structure milestone payments, how to negotiate them with clients before starting, how to submit milestone completions for review, and how to handle partial approvals and revision requests.",
      },
      {
        no: "03",
        title: "Withdrawing Your Earnings — Methods, Fees & Timelines",
        duration: "25 min",
        desc: "A clear comparison of Razorpay, PayPal, and UPI as withdrawal methods — fees, processing times, limits, and which method is best depending on your location and payment frequency.",
      },
      {
        no: "04",
        title: "Understanding FreelanceHub Pro's Fee Structure",
        duration: "20 min",
        desc: "How service fees, payment processing fees, and membership plan costs interact. How to factor these into your project pricing so you always know exactly what you will actually take home.",
      },
      {
        no: "05",
        title: "Freelancer Taxes in India — GST, ITR & TDS Basics",
        duration: "45 min",
        desc: "An accessible, practical overview of what Indian freelancers earning through digital platforms need to know about income tax filing (ITR-4), GST registration thresholds, and TDS deductions. This module is for awareness only — consult a qualified CA for personalised advice.",
      },
    ],
  },
  {
    id: "trust-and-safety",
    icon: "🛡️",
    title: "Trust, Safety & Dispute Resolution",
    subtitle: "Protect yourself and resolve conflicts professionally",
    level: "All Levels",
    levelColor: "bg-orange-100 text-orange-700",
    duration: "2–3 hours",
    modules: 4,
    desc: "How to recognise and avoid the most common scams targeting Indian freelancers, how to keep every project engagement on-platform, and how to navigate the dispute resolution process if something goes wrong.",
    outcomes: [
      "Identify the six most common freelance scams and how to avoid them",
      "Understand what constitutes off-platform circumvention and its risks",
      "Know when and how to raise a dispute on FreelanceHub Pro",
      "Present your case effectively during the mediation process",
      "Use the platform's reporting tools to keep the community safe",
    ],
    lessons: [
      {
        no: "01",
        title: "Recognising and Avoiding Freelance Scams",
        duration: "40 min",
        desc: "The six most common scam types on freelance platforms — upfront fee requests, off-platform payment pressure, phishing emails, fake job postings, unpaid work requests, and communication hijacking — with real examples and how to respond to each.",
      },
      {
        no: "02",
        title: "Why Everything Must Stay On-Platform",
        duration: "25 min",
        desc: "Why moving communication or payments off FreelanceHub Pro eliminates all your protections, what the platform considers circumvention, and how to handle a client who pushes to take things external.",
      },
      {
        no: "03",
        title: "When and How to Raise a Dispute",
        duration: "35 min",
        desc: "A step-by-step walkthrough of the FreelanceHub Pro dispute process — when disputes are eligible, how to raise one, what evidence to submit, how the mediation window works, and what happens during binding arbitration.",
      },
      {
        no: "04",
        title: "Using Platform Reporting and Safety Tools",
        duration: "20 min",
        desc: "How to use the profile flag, message report, and job posting report features. When to report a user versus when to raise a dispute, and how to document issues in a way that supports a successful resolution.",
      },
    ],
  },
  {
    id: "client-masterclass",
    icon: "🤝",
    title: "Client Masterclass — Hire Better, Get Better Results",
    subtitle: "For Clients who want to get the most from every project",
    level: "Beginner",
    levelColor: "bg-green-100 text-green-700",
    duration: "3–4 hours",
    modules: 5,
    desc: "A comprehensive guide for Clients on how to post projects that attract quality Freelancers, evaluate proposals effectively, manage projects professionally, and build long-term freelance relationships.",
    outcomes: [
      "Write project briefs that attract relevant, high-quality proposals",
      "Evaluate and compare Freelancer proposals objectively",
      "Use the Safe Deposit and milestone tools to manage project risk",
      "Give feedback that improves the quality of delivered work",
      "Build a roster of trusted Freelancers for ongoing business needs",
    ],
    lessons: [
      {
        no: "01",
        title: "Writing a Project Brief That Attracts Quality Proposals",
        duration: "40 min",
        desc: "What to include, how much detail to give, how to describe your budget without anchoring too low, and how to signal that you are a serious client worth working with. Includes good and bad brief examples.",
      },
      {
        no: "02",
        title: "Evaluating Proposals and Choosing the Right Freelancer",
        duration: "35 min",
        desc: "How to read between the lines of a proposal, what a Freelancer's profile and reviews actually tell you, how to run a paid test project for high-stakes roles, and how to avoid the most common hiring mistakes.",
      },
      {
        no: "03",
        title: "Managing a Project from Start to Finish",
        duration: "35 min",
        desc: "Setting expectations at the start, using the messaging and file-sharing tools effectively, reviewing milestone submissions, handling revisions without conflict, and releasing payment correctly.",
      },
      {
        no: "04",
        title: "Giving Feedback That Actually Helps",
        duration: "25 min",
        desc: "How to give revision feedback that is clear, specific, and actionable. The difference between feedback based on the original brief and scope creep — and how to handle both professionally.",
      },
      {
        no: "05",
        title: "Building a Long-Term Freelance Talent Roster",
        duration: "30 min",
        desc: "How to move from transactional one-off projects to ongoing relationships with trusted Freelancers. How to offer retainers, why repeat Clients get better work and better rates, and how to manage a small portfolio of freelance partners.",
      },
    ],
  },
  {
    id: "freelance-growth",
    icon: "📈",
    title: "Scaling Your Freelance Business",
    subtitle: "Go from solo freelancer to a sustainable practice",
    level: "Advanced",
    levelColor: "bg-purple-100 text-purple-700",
    duration: "6–8 hours",
    modules: 7,
    desc: "For experienced Freelancers who want to move beyond the proposal treadmill — building a personal brand, creating recurring income, and turning a freelance practice into a scalable business.",
    outcomes: [
      "Build a personal brand that generates inbound client enquiries",
      "Create retainer structures that provide predictable monthly income",
      "Develop a niche positioning that commands premium pricing",
      "Scale your workload without burning out or sacrificing quality",
      "Evaluate whether building a freelance agency is right for your situation",
    ],
    lessons: [
      {
        no: "01",
        title: "Niching Down — Why Specialists Earn More Than Generalists",
        duration: "40 min",
        desc: "The data on why freelancers who specialise consistently out-earn generalists, how to identify your highest-value niche, and how to reposition your profile and proposals around a sharper focus.",
      },
      {
        no: "02",
        title: "Building a Personal Brand as a Freelancer",
        duration: "50 min",
        desc: "How to use LinkedIn, your portfolio, and your FreelanceHub Pro profile together to create a consistent professional presence that generates enquiries beyond the platform.",
      },
      {
        no: "03",
        title: "Creating Recurring Revenue with Retainers",
        duration: "45 min",
        desc: "How to identify clients who are good retainer candidates, how to pitch a monthly retainer arrangement, how to price and structure retainer agreements, and how to manage multiple retainer clients without overcommitting.",
      },
      {
        no: "04",
        title: "Productising Your Services",
        duration: "40 min",
        desc: "Turning bespoke services into defined, packageable offerings with fixed scopes, fixed prices, and predictable delivery timelines. Why this is more scalable than custom quoting every project.",
      },
      {
        no: "05",
        title: "Managing Your Time and Workload at Scale",
        duration: "45 min",
        desc: "Systems, tools, and habits for managing multiple active projects, client communication, and administrative work without burning out. How successful full-time freelancers structure their days.",
      },
      {
        no: "06",
        title: "When to Raise Your Rates — and How to Do It Without Losing Clients",
        duration: "35 min",
        desc: "Signals that you are ready for a rate increase, how to communicate it to existing clients, how to phase the increase for ongoing relationships, and how to use new-client pricing to test market rate.",
      },
      {
        no: "07",
        title: "Should You Build a Freelance Agency?",
        duration: "50 min",
        desc: "When going solo no longer serves your ambitions — how to evaluate whether building a small agency is the right next step, the operational challenges it creates, and what successful freelancer-to-agency transitions have in common.",
      },
    ],
  },
];

const faqs = [
  {
    q: "Is the Learning Academy free for all FreelanceHub Pro users?",
    a: "Yes — all Learning Academy content is free for all registered FreelanceHub Pro users. Creating an account on FreelanceHub Pro gives you full access to every track and lesson at no additional cost. Some advanced resources and one-on-one mentorship sessions (when available) may require a premium membership plan.",
  },
  {
    q: "Do I need to complete the tracks in order?",
    a: "No. Each track is self-contained and can be taken independently based on where you are in your freelance journey. If you are completely new to the platform, we recommend starting with Freelancer Foundations or Client Masterclass. If you have some experience, jump to whichever track addresses your current challenge.",
  },
  {
    q: "Will I receive a certificate after completing a track?",
    a: "FreelanceHub Pro Learning Academy completion certificates are currently in development and will be available on qualifying tracks in a future update. Completion of a track will be reflected on your Freelancer profile as a verified badge, visible to Clients reviewing your profile.",
  },
  {
    q: "How long does it take to complete a full track?",
    a: "Track duration ranges from 2–3 hours (shorter, focused tracks) to 6–8 hours (comprehensive tracks). All lessons are available on demand — you can complete them at your own pace over multiple sessions. There is no deadline or expiry on access.",
  },
  {
    q: "Are the lessons video-based or text-based?",
    a: "Learning Academy lessons currently combine written guides, illustrated walkthroughs, real platform screenshots, and practical exercises. Video lessons are in development and will be introduced across all tracks as the Academy grows.",
  },
  {
    q: "Can Clients access the Learning Academy content?",
    a: "Yes. The Client Masterclass track is specifically designed for Clients and covers everything from writing effective project briefs to managing projects and building long-term freelance relationships. All other tracks are also open for Clients to read, even if the content is primarily Freelancer-focused.",
  },
  {
    q: "How often is content updated?",
    a: "All Learning Academy content is reviewed and updated quarterly to reflect platform changes, market trends, and community feedback. When a significant platform update is released, affected lessons are updated within 2 weeks of the launch.",
  },
];

export default function LearningAcademyPage() {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const selectedTrack = tracks.find((t) => t.id === activeTrack) || null;

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              FreelanceHub Pro Learning Academy
            </h1>
            <p className="text-gray-600 mt-1">
              Free, practical, platform-specific learning for every Freelancer
              and Client — from your very first project to scaling a full
              freelance practice
            </p>
          </div>

          <div className="space-y-8">

            {/* — INTRO — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <p className="text-gray-700 leading-relaxed mb-3">
                The FreelanceHub Pro Learning Academy is built around one idea:
                the fastest way to succeed on a freelance platform is to
                understand how it actually works — not just in theory, but in
                practice, with real examples, platform-specific guidance, and
                honest advice drawn from what the most successful Freelancers
                and Clients on our platform actually do.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Every lesson in the Academy is written specifically for
                FreelanceHub Pro. You will not find generic freelancing advice
                recycled from other platforms — every module references our
                actual tools, workflows, fee structures, and community norms.
                Whether you are a Freelancer in your first week or a Client
                managing your fifth project, there is a track here that will
                make your next engagement more successful than your last.
              </p>
            </div>

            {/* — STATS — */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { stat: "6", label: "Learning Tracks" },
                { stat: "33", label: "In-Depth Lessons" },
                { stat: "25+ hrs", label: "Total Content" },
                { stat: "Free", label: "For All Members" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-4 text-center"
                >
                  <p className="text-xl font-bold text-blue-900">{s.stat}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* — HIGHLIGHT — */}
            <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-xl">
              <p className="text-gray-700 text-sm">
                <strong>100% free for all members.</strong> All Learning Academy
                tracks and lessons are included with your FreelanceHub Pro
                account at no additional cost.{" "}
                <a
                  href="/sign-up-page"
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Create your free account
                </a>{" "}
                to get started.
              </p>
            </div>

            {/* — TRACKS OVERVIEW GRID — */}
            <div>
              <h2 className="text-xl font-semibold text-blue-900 mb-5">
                Choose Your Learning Track
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tracks.map((track) => (
                  <div
                    key={track.id}
                    onClick={() =>
                      setActiveTrack(
                        activeTrack === track.id ? null : track.id
                      )
                    }
                    className={`bg-white border rounded-xl p-5 cursor-pointer transition-all hover:shadow-sm ${activeTrack === track.id
                        ? "border-orange-400 shadow-sm ring-1 ring-orange-300"
                        : "border-gray-200 hover:border-orange-200"
                      }`}
                  >
                    <div className="text-2xl mb-3">{track.icon}</div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-base font-semibold text-blue-900 leading-snug">
                        {track.title}
                      </h3>
                      <span
                        className={`text-xs font-medium rounded-full px-2.5 py-0.5 flex-shrink-0 ${track.levelColor}`}
                      >
                        {track.level}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs mb-3">
                      {track.subtitle}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {track.desc}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-100 pt-3">
                      <span>📚 {track.modules} lessons</span>
                      <span>⏱ {track.duration}</span>
                    </div>
                    <button
                      className={`mt-3 text-sm font-semibold w-full py-2 rounded-lg transition-colors ${activeTrack === track.id
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "bg-slate-100 text-blue-900 hover:bg-orange-50 hover:text-orange-600"
                        }`}
                    >
                      {activeTrack === track.id
                        ? "Hide Lessons ▲"
                        : "View Lessons →"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* — EXPANDED TRACK DETAIL — */}
            {selectedTrack && (
              <div className="bg-white border border-orange-200 rounded-xl overflow-hidden">
                {/* Track Header */}
                <div className="bg-slate-50 border-b border-orange-100 p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{selectedTrack.icon}</span>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span
                          className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${selectedTrack.levelColor}`}
                        >
                          {selectedTrack.level}
                        </span>
                        <span className="text-xs text-gray-400">
                          {selectedTrack.modules} lessons · {selectedTrack.duration}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-blue-900 mb-1">
                        {selectedTrack.title}
                      </h2>
                      <p className="text-gray-500 text-sm mb-3">
                        {selectedTrack.subtitle}
                      </p>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {selectedTrack.desc}
                      </p>
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="mt-5 pt-5 border-t border-orange-100">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">
                      What you will learn:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedTrack.outcomes.map((o, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-xs font-bold mt-0.5">
                            ✓
                          </span>
                          <p className="text-sm text-gray-700">{o}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Lessons */}
                <div className="divide-y divide-gray-50">
                  <div className="px-6 py-4 bg-white">
                    <h3 className="text-base font-semibold text-blue-900">
                      Track Lessons
                    </h3>
                  </div>
                  {selectedTrack.lessons.map((lesson, li) => {
                    const key = `${selectedTrack.id}-${li}`;
                    return (
                      <div key={key}>
                        <button
                          onClick={() =>
                            setOpenLesson(openLesson === key ? null : key)
                          }
                          className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                            {lesson.no}
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-semibold text-gray-800">
                              {lesson.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className="text-xs text-gray-400">
                              {lesson.duration}
                            </span>
                            <span className="text-gray-400 text-xs">
                              {openLesson === key ? "▲" : "▼"}
                            </span>
                          </div>
                        </button>
                        {openLesson === key && (
                          <div className="px-6 pb-5 pt-3 bg-slate-50 border-t border-gray-50">
                            <p className="text-sm text-gray-600 leading-relaxed mb-3">
                              {lesson.desc}
                            </p>
                            <button className="text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg px-4 py-2 transition-colors">
                              Start Lesson →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Start Track CTA */}
                <div className="p-6 border-t border-gray-100 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Ready to start this track?
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Free for all FreelanceHub Pro members.
                    </p>
                  </div>
                  <a
                    href="/sign-up-page"
                    className="inline-block bg-blue-900 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-blue-800 transition-colors whitespace-nowrap"
                  >
                    Begin {selectedTrack.title} →
                  </a>
                </div>
              </div>
            )}

            {/* — HOW IT WORKS — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-5">
                How the Learning Academy Works
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    step: "01",
                    title: "Create Your Free Account",
                    desc: "Sign up to FreelanceHub Pro — it is free. Your account gives you instant access to all Learning Academy tracks with no paywall.",
                  },
                  {
                    step: "02",
                    title: "Choose Your Track",
                    desc: "Browse the six learning tracks and pick the one that best matches where you are right now — beginner, intermediate, or advanced.",
                  },
                  {
                    step: "03",
                    title: "Learn at Your Own Pace",
                    desc: "All lessons are on demand. Complete them in any order, at any time, across as many sessions as you need. There is no deadline.",
                  },
                  {
                    step: "04",
                    title: "Apply It on the Platform",
                    desc: "Every lesson is designed to be put into practice immediately — on your next proposal, your next project brief, or your next client interaction.",
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

            {/* — WHO IS THIS FOR — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-5">
                Find the Right Track for You
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: "🌱",
                    who: "Brand New Freelancer",
                    desc: "Just signed up and not sure where to start? You do not have any clients or reviews yet.",
                    tracks: [
                      "Freelancer Foundations",
                      "Payments, Escrow & Financial Management",
                      "Trust, Safety & Dispute Resolution",
                    ],
                    color: "border-green-200 bg-green-50",
                  },
                  {
                    icon: "🔥",
                    who: "Active Freelancer",
                    desc: "You have completed a few projects but want to win work more consistently and at higher rates.",
                    tracks: [
                      "Winning More Work",
                      "Scaling Your Freelance Business",
                      "Payments, Escrow & Financial Management",
                    ],
                    color: "border-orange-200 bg-orange-50",
                  },
                  {
                    icon: "💼",
                    who: "Client or Business",
                    desc: "You want to hire freelancers effectively, manage projects smoothly, and get consistently strong results.",
                    tracks: [
                      "Client Masterclass",
                      "Payments, Escrow & Financial Management",
                      "Trust, Safety & Dispute Resolution",
                    ],
                    color: "border-blue-200 bg-blue-50",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`border rounded-xl p-5 ${item.color}`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h3 className="text-base font-semibold text-blue-900 mb-1">
                      {item.who}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Recommended tracks:
                      </p>
                      {item.tracks.map((t, ti) => (
                        <div key={ti} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                          <p className="text-sm text-gray-700">{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* — FAQ — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-5">
                Frequently Asked Questions
              </h2>
              <div className="space-y-0 divide-y divide-gray-100">
                {faqs.map((faq, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between py-4 text-left hover:text-orange-600 transition-colors group"
                    >
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 pr-4">
                        {faq.q}
                      </span>
                      <span className="text-gray-400 flex-shrink-0 text-xs">
                        {openFaq === i ? "▲" : "▼"}
                      </span>
                    </button>
                    {openFaq === i && (
                      <div className="pb-4">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* — BOTTOM CTA — */}
            <div className="border-l-4 border-orange-500 bg-orange-50 p-6 rounded-xl">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Start Learning Today — It&apos;s Completely Free
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                All FreelanceHub Pro Learning Academy tracks are included with
                your free account. Join thousands of Freelancers and Clients who
                are using the Academy to work smarter, earn more, and build
                better professional relationships on the platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/sign-up-page"
                  className="inline-block bg-blue-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Join as a Freelancer — Free
                </a>
                <a
                  href="/sign-up-page"
                  className="inline-block bg-orange-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Join as a Client — Free
                </a>
              </div>
            </div>

            {/* — RELATED LINKS — */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-base font-semibold text-blue-900 mb-3">
                More Resources
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Blog", href: "/blog" },
                  { label: "Community Forum", href: "/community-forum" },
                  { label: "Help Center", href: "/help-center" },
                  { label: "Security", href: "/security" },
                  { label: "Contact Us", href: "/contact" },
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
      </main>
      <FooterSection />
    </>
  );
}