"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

const forumCategories = [
  {
    icon: "🚀",
    title: "Getting Started",
    desc: "New to the platform? Ask your first questions and learn from experienced members.",
    threads: 124,
    posts: 891,
    color: "bg-blue-50 border-blue-100",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    icon: "💳",
    title: "Payments & Billing",
    desc: "Safe Deposit, withdrawals, fees, membership plans, and payment method discussions.",
    threads: 87,
    posts: 634,
    color: "bg-green-50 border-green-100",
    badge: "bg-green-100 text-green-700",
  },
  {
    icon: "📋",
    title: "Proposals & Winning Work",
    desc: "Share tips, review proposal strategies, and discuss what makes a winning bid.",
    threads: 213,
    posts: 1847,
    color: "bg-orange-50 border-orange-100",
    badge: "bg-orange-100 text-orange-700",
  },
  {
    icon: "🎨",
    title: "Skill-Specific Discussions",
    desc: "Conversations for developers, designers, writers, marketers, and more — by skill, for skill.",
    threads: 341,
    posts: 2903,
    color: "bg-purple-50 border-purple-100",
    badge: "bg-purple-100 text-purple-700",
  },
  {
    icon: "🤝",
    title: "Client Corner",
    desc: "For Clients to discuss hiring, managing projects, giving feedback, and getting the most from the platform.",
    threads: 96,
    posts: 712,
    color: "bg-teal-50 border-teal-100",
    badge: "bg-teal-100 text-teal-700",
  },
  {
    icon: "⚠️",
    title: "Disputes & Trust & Safety",
    desc: "Discuss experiences with disputes, scam prevention, and staying safe on the platform.",
    threads: 58,
    posts: 423,
    color: "bg-red-50 border-red-100",
    badge: "bg-red-100 text-red-700",
  },
  {
    icon: "💡",
    title: "Freelance Tips & Growth",
    desc: "Career advice, rate-setting, building a portfolio, client communication, and growing your freelance income.",
    threads: 289,
    posts: 2241,
    color: "bg-yellow-50 border-yellow-100",
    badge: "bg-yellow-100 text-yellow-700",
  },
  {
    icon: "📢",
    title: "Platform Feedback",
    desc: "Feature requests, bug reports, and suggestions for improving FreelanceHub Pro.",
    threads: 73,
    posts: 509,
    color: "bg-slate-50 border-slate-200",
    badge: "bg-slate-100 text-slate-600",
  },
];

const featuredThreads = [
  {
    category: "Proposals & Winning Work",
    categoryIcon: "📋",
    title: "How I went from 0 to 12 projects in my first 3 months — what actually worked",
    author: "Rohan M.",
    role: "Freelancer · Web Developer",
    avatar: "R",
    time: "2 days ago",
    replies: 47,
    views: 892,
    tags: ["Proposals", "Beginner Tips", "Profile"],
    pinned: true,
    content:
      "When I joined FreelanceHub Pro, I had zero reviews and no idea how to write a proposal. Three months later I have 12 completed projects and a 4.9 rating. Here is exactly what made the difference — I wrote every proposal from scratch, referenced something specific in the project brief, and kept my rate 15–20% below market until I had 5 reviews. The first 5 reviews are the hardest to get. After that, things snowball quickly.",
  },
  {
    category: "Payments & Billing",
    categoryIcon: "💳",
    title: "Safe Deposit explained simply — for Freelancers who are still confused",
    author: "Priya S.",
    role: "Freelancer · Content Writer",
    avatar: "P",
    time: "5 days ago",
    replies: 31,
    views: 1204,
    tags: ["Safe Deposit", "Payments", "Escrow"],
    pinned: true,
    content:
      "I see this question in almost every thread for new Freelancers. The Safe Deposit is simple: the Client puts the money in before you start work. It sits with FreelanceHub Pro — not with the Client — until you finish and they approve. If they disappear, the money is still there. If they refuse without reason, you raise a dispute. The key thing to remember: never start work on a project until the Safe Deposit is funded. This is not optional advice — it is the only thing protecting you.",
  },
  {
    category: "Freelance Tips & Growth",
    categoryIcon: "💡",
    title: "Setting your freelance rate as an Indian freelancer — a framework that works",
    author: "Arjun K.",
    role: "Freelancer · UI/UX Designer",
    avatar: "A",
    time: "1 week ago",
    replies: 62,
    views: 2341,
    tags: ["Rates", "Pricing", "India"],
    pinned: false,
    content:
      "Pricing is the most common thing new freelancers get wrong. The mistake is usually one of two things — pricing too low because you are scared, or pricing too high before you have reviews to back it up. My framework: research what experienced freelancers in your category are charging on the platform. Start at 70% of that rate for your first 5 projects. After 5 good reviews, move to market rate. After 15, experiment with going 20% above market and see what happens. Your rate should increase every quarter while you are actively improving.",
  },
  {
    category: "Client Corner",
    categoryIcon: "🤝",
    title: "What Clients actually want — a Freelancer's guide to reading between the lines",
    author: "Meera D.",
    role: "Freelancer · Digital Marketer",
    avatar: "M",
    time: "1 week ago",
    replies: 38,
    views: 1102,
    tags: ["Client Relations", "Communication", "Tips"],
    pinned: false,
    content:
      "After 3 years of freelancing and 80+ projects, here is what I have learned about what Clients are actually evaluating. First, they want to feel heard. Address their specific brief in your proposal — not a generic pitch. Second, they want certainty, not promises. Tell them the process: 'Here is how I will approach this, here is what I will deliver, here is my timeline.' Third, they want you to make the decision easy. If your proposal requires them to think too hard, they will pick someone else.",
  },
  {
    category: "Skill-Specific Discussions",
    categoryIcon: "🎨",
    title: "Web developers: what tech stack are you pitching for Indian startup clients in 2025?",
    author: "Vikram T.",
    role: "Freelancer · Full Stack Developer",
    avatar: "V",
    time: "3 days ago",
    replies: 55,
    views: 1677,
    tags: ["Development", "Tech Stack", "Startups"],
    pinned: false,
    content:
      "Starting a discussion for developers working with Indian startup Clients specifically. I have been seeing a lot of demand for Next.js + Node.js combinations, and React Native for mobile. Clients are increasingly asking about AI integrations too — simple chatbots, recommendation engines. What is everyone else pitching? What is converting well for you and what is getting ignored? Also curious about whether anyone is charging differently for AI-related work vs standard builds.",
  },
  {
    category: "Getting Started",
    categoryIcon: "🚀",
    title: "Complete checklist: everything to do before submitting your first proposal",
    author: "Anjali R.",
    role: "Freelancer · Graphic Designer",
    avatar: "A",
    time: "4 days ago",
    replies: 29,
    views: 987,
    tags: ["Beginner", "Checklist", "Profile"],
    pinned: false,
    content:
      "Before you send your first proposal, make sure: 1) Your profile photo is professional and clearly shows your face. 2) Your bio is at least 150 words and explains what you do AND who you do it for. 3) You have at least 2 portfolio samples uploaded — even if they are personal projects. 4) Your skills are tagged correctly on your profile. 5) Your hourly rate is filled in even if you prefer fixed-price work. 6) You have read the project brief at least twice before writing your proposal. Most new Freelancers skip one of these and wonder why they are not getting responses.",
  },
];

const communityRules = [
  "Be respectful. Treat every member the way you would want to be treated in a professional setting.",
  "Stay on topic. Post in the most relevant category and keep discussions constructive.",
  "No self-promotion or spam. Do not use the forum to advertise your services or post unsolicited links.",
  "Never share personal contact details, payment information, or platform credentials in posts.",
  "Do not use the forum to conduct off-platform transactions or recruit users away from FreelanceHub Pro.",
  "Report posts that violate these rules using the report flag rather than engaging directly.",
  "Advice shared in the forum is community-based and not official FreelanceHub Pro guidance. For official answers, contact support.",
];

export default function CommunityForumPage() {
  const [activeTab, setActiveTab] = useState<"featured" | "categories">(
    "featured"
  );
  const [expandedThread, setExpandedThread] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              Community Forum
            </h1>
            <p className="text-gray-600 mt-1">
              Connect with Freelancers and Clients, share experiences, get
              advice, and grow together on FreelanceHub Pro
            </p>
          </div>

          <div className="space-y-6">

            {/* — INTRO CARD — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-700 leading-relaxed mb-3">
                The FreelanceHub Pro Community Forum is a space for our
                Freelancers and Clients to connect, share knowledge, ask
                questions, and support each other. Whether you are looking for
                proposal writing tips, trying to understand how the Safe Deposit
                works, or want to discuss best practices for client
                communication — you are in the right place.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our community is built on respect, honesty, and genuine
                peer-to-peer support. Every member — from someone on their first
                project to a Freelancer with 100+ completed engagements — has
                something valuable to contribute.
              </p>
            </div>

            {/* — STATS BAR — */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { stat: "1,281", label: "Total Threads" },
                { stat: "10,160+", label: "Community Posts" },
                { stat: "8", label: "Discussion Categories" },
                { stat: "Mon–Sat", label: "Moderated Hours" },
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

            {/* — HIGHLIGHT BOX — */}
            <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-xl">
              <p className="text-gray-700 text-sm">
                <strong>Important:</strong> The Community Forum is for peer
                support and discussion — not for official support queries. For
                account issues, payment problems, or disputes, always contact
                our support team at{" "}
                <a
                  href="mailto:support@freelancehubpro.com"
                  className="text-orange-600 font-medium hover:underline"
                >
                  support@freelancehubpro.com
                </a>{" "}
                or visit the{" "}
                <a
                  href="/help-center"
                  className="text-orange-600 font-medium hover:underline"
                >
                  Help Center
                </a>
                .
              </p>
            </div>

            {/* — TABS — */}
            <div className="flex gap-2 border-b border-gray-200 bg-white rounded-t-xl px-4 pt-4">
              <button
                onClick={() => setActiveTab("featured")}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === "featured"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                🔥 Featured Discussions
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === "categories"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                📂 Browse Categories
              </button>
            </div>

            {/* — FEATURED DISCUSSIONS — */}
            {activeTab === "featured" && (
              <div className="space-y-4">
                {featuredThreads.map((thread, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden"
                  >
                    {/* Thread Header */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="text-xs font-medium text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-2.5 py-0.5">
                              {thread.categoryIcon} {thread.category}
                            </span>
                            {thread.pinned && (
                              <span className="text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5">
                                📌 Pinned
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-semibold text-blue-900 leading-snug">
                            {thread.title}
                          </h3>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {thread.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {thread.author}
                          </p>
                          <p className="text-xs text-gray-400">{thread.role}</p>
                        </div>
                        <span className="text-xs text-gray-400 ml-auto">
                          {thread.time}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {thread.tags.map((tag, ti) => (
                          <span
                            key={ti}
                            className="text-xs text-gray-500 bg-slate-100 rounded-full px-2.5 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Expand button */}
                      <button
                        onClick={() =>
                          setExpandedThread(expandedThread === i ? null : i)
                        }
                        className="text-sm text-orange-600 font-medium hover:underline"
                      >
                        {expandedThread === i
                          ? "Show less ▲"
                          : "Read post ▼"}
                      </button>

                      {/* Expanded Content */}
                      {expandedThread === i && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600 leading-relaxed">
                          {thread.content}
                        </div>
                      )}
                    </div>

                    {/* Thread Footer */}
                    <div className="bg-slate-50 border-t border-gray-100 px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>💬 {thread.replies} replies</span>
                        <span>👁 {thread.views.toLocaleString()} views</span>
                      </div>
                      <button className="text-xs font-medium text-orange-600 border border-orange-200 bg-orange-50 hover:bg-orange-100 rounded-full px-3 py-1 transition-colors">
                        Join Discussion →
                      </button>
                    </div>
                  </div>
                ))}

                {/* Load More */}
                <div className="text-center pt-2">
                  <button className="text-sm font-medium text-gray-500 border border-gray-200 bg-white hover:border-orange-300 hover:text-orange-600 rounded-lg px-6 py-2.5 transition-colors">
                    Load more discussions
                  </button>
                </div>
              </div>
            )}

            {/* — CATEGORIES VIEW — */}
            {activeTab === "categories" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forumCategories.map((cat, i) => (
                  <div
                    key={i}
                    className={`border rounded-xl p-5 ${cat.color} hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                      <div className="flex-grow">
                        <h3 className="text-base font-semibold text-blue-900 mb-1">
                          {cat.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                          {cat.desc}
                        </p>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-medium rounded-full px-2.5 py-0.5 ${cat.badge}`}
                          >
                            {cat.threads} threads
                          </span>
                          <span className="text-xs text-gray-400">
                            {cat.posts.toLocaleString()} posts
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white border-opacity-60">
                      <button className="text-sm font-medium text-orange-600 hover:underline">
                        Browse {cat.title} →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* — COMMUNITY GUIDELINES — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Community Guidelines
              </h2>
              <p className="text-gray-600 text-sm mb-5">
                The FreelanceHub Pro Community Forum is a professional space.
                All members — Freelancers and Clients alike — are expected to
                follow these guidelines to keep it useful, safe, and respectful
                for everyone.
              </p>
              <div className="space-y-3">
                {communityRules.map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {rule}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Posts that violate these guidelines will be removed. Repeated
                  violations may result in account suspension. For the complete
                  community policy, see our{" "}
                  <a
                    href="/terms-&-conditions"
                    className="text-orange-600 hover:underline"
                  >
                    Terms and Conditions
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* — HOW TO PARTICIPATE — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                How to Participate
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    step: "01",
                    title: "Log In to Your Account",
                    desc: "You need a FreelanceHub Pro account to post in the forum. If you are not yet registered, sign up — it is free.",
                  },
                  {
                    step: "02",
                    title: "Browse or Search",
                    desc: "Browse categories or search for threads relevant to your question before posting — your answer may already exist.",
                  },
                  {
                    step: "03",
                    title: "Join a Discussion or Start One",
                    desc: "Reply to an existing thread or start a new one in the most relevant category. Be specific and give context.",
                  },
                  {
                    step: "04",
                    title: "Help Others",
                    desc: "If you have experience that can help another member, share it. The forum grows stronger when experienced members give back.",
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

            {/* — POPULAR TOPIC TAGS — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base font-semibold text-blue-900 mb-3">
                Popular Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Proposals", "Safe Deposit", "Profile Tips", "Rates & Pricing",
                  "Client Communication", "First Project", "Dispute Resolution",
                  "Web Development", "UI/UX Design", "Content Writing",
                  "Digital Marketing", "Membership Plans", "Withdrawals",
                  "Scam Prevention", "Portfolio Building", "Feedback & Reviews",
                  "Mobile Development", "SEO", "Data Entry", "Video Editing",
                ].map((tag, i) => (
                  <button
                    key={i}
                    className="text-sm text-gray-600 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 border border-transparent hover:border-orange-200 rounded-full px-3 py-1.5 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* — CTA — */}
            <div className="border-l-4 border-orange-500 bg-orange-50 p-5 rounded-xl">
              <h3 className="text-base font-semibold text-gray-800 mb-2">
                Not a member yet?
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Join FreelanceHub Pro for free to participate in the community
                forum, submit proposals, and access all platform features.
                Thousands of Freelancers and Clients are already part of our
                growing community.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/sign-up-page"
                  className="inline-block bg-blue-900 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  Join as a Freelancer
                </a>
                <a
                  href="/sign-up-page"
                  className="inline-block bg-orange-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Join as a Client
                </a>
              </div>
            </div>

            {/* — RELATED LINKS — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-base font-semibold text-blue-900 mb-3">
                Related Resources
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Help Center", href: "/help-center" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Security", href: "/security" },
                  { label: "Terms & Conditions", href: "/terms-&-conditions" },
                  { label: "Careers", href: "/careers" },
                  { label: "About Us", href: "/about" },
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