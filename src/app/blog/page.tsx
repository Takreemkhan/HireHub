"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

const blogCategories = [
  "All",
  "Freelancer Tips",
  "Client Guides",
  "Payments & Finance",
  "Platform Updates",
  "Success Stories",
  "Industry Trends",
];

const featuredPost = {
  category: "Freelancer Tips",
  tag: "⭐ Featured",
  title:
    "The Complete Guide to Winning Your First Project on FreelanceHub Pro in 2025",
  excerpt:
    "Landing your first project as a new Freelancer is the hardest milestone. Everything after that builds on it. This guide covers exactly what to do — from building a profile that gets noticed to writing a proposal that actually wins — based on what the best-performing Freelancers on our platform do differently.",
  author: "FreelanceHub Pro Editorial",
  date: "April 28, 2025",
  readTime: "12 min read",
  sections: [
    {
      heading: "Why Your First Project Is Different from All the Others",
      body: "Before you have a single review on your profile, every Client looking at your proposal is taking a leap of faith. You cannot rely on past ratings — so everything else has to work harder. Your profile photo, your bio, your portfolio, your proposal — all of it needs to compensate for the one thing you do not yet have: a track record. The good news is that the barrier is exactly as high for every Freelancer who has ever joined FreelanceHub Pro. The ones who win early do so not because they are the most talented — they win because they make the right decisions early on.",
    },
    {
      heading: "Step 1 — Build a Profile That a Client Would Actually Trust",
      body: "Your profile is your storefront. A Client who has received 15 proposals will spend about 20 seconds on each before deciding which three to read properly. In those 20 seconds, they will see your photo, your headline, and the first two lines of your bio. Use a clear, professional headshot — not a logo, not a casual selfie. Write a headline that describes exactly what you do and who you help: 'Full Stack Developer helping Indian startups build and launch web applications' is infinitely stronger than 'Freelance Developer'. Your bio should open with what you deliver, not your background. 'I help e-commerce businesses reduce cart abandonment through conversion-focused UI redesign' is a bio opener. 'I am a UI designer with 3 years of experience' is not.",
    },
    {
      heading: "Step 2 — Upload Portfolio Samples Before You Apply for Anything",
      body: "Do not submit a single proposal until you have at least two portfolio items on your profile. If you have no client work to show, create it. Build a sample project for a fictional client. Write two sample articles in your niche. Design a landing page for a concept brand. Clients cannot evaluate your ability without evidence — and a portfolio sample, even a self-initiated one, is infinitely better than nothing. Label each portfolio item clearly: describe what the project was, what problem you solved, and what the result was.",
    },
    {
      heading:
        "Step 3 — Write a Proposal That Addresses the Project, Not Your CV",
      body: "The single biggest mistake new Freelancers make is writing proposals that are about themselves. Clients already see your profile — the proposal is where you demonstrate that you understand their specific problem. Read the project brief twice. Identify the actual challenge behind the stated requirement. Then open your proposal by showing that you understand it. 'I noticed you are rebuilding your checkout flow — this is usually a UX problem as much as a development one. Here is how I would approach it...' is a proposal opener. 'Hi, I am a Full Stack Developer with 3 years of experience and I believe I can help you with this project' is not.",
    },
    {
      heading: "Step 4 — Price to Win Your First Review, Not to Maximise Earnings",
      body: "Set your rate for the first project at 70–80% of what you eventually want to charge. This is not about undervaluing your work — it is about acknowledging that your first review is worth more than the extra ₹2,000 on a single project. Once you have three to five strong reviews, adjust your rate upward. Once you have ten, you can price above market and clients will pay it. Every top Freelancer on this platform — every single one — priced competitively early and increased rates as their reputation grew.",
    },
  ],
};

const blogPosts = [
  {
    category: "Payments & Finance",
    title: "Safe Deposit vs Direct Payment: Why Escrow Protects Both Sides",
    excerpt:
      "Off-platform payments are the number one cause of freelancer disputes in India. Here is why the Safe Deposit system is not just a feature — it is the foundation of every secure project on FreelanceHub Pro.",
    author: "FreelanceHub Pro Editorial",
    date: "April 25, 2025",
    readTime: "7 min read",
    emoji: "💳",
  },
  {
    category: "Freelancer Tips",
    title:
      "How to Set Your Freelance Rate as an Indian Freelancer in 2025 — A Practical Framework",
    excerpt:
      "Most Indian freelancers either price too low out of fear or too high before they have the reviews to justify it. This framework walks you through a data-backed approach to pricing that grows with your reputation.",
    author: "FreelanceHub Pro Editorial",
    date: "April 22, 2025",
    readTime: "9 min read",
    emoji: "💰",
  },
  {
    category: "Client Guides",
    title:
      "How to Write a Project Brief That Attracts Great Freelancers (and Filters Out the Rest)",
    excerpt:
      "The quality of proposals you receive is directly proportional to the quality of your project brief. This guide shows Clients exactly how to write a brief that communicates requirements clearly and brings the right Freelancers to your inbox.",
    author: "FreelanceHub Pro Editorial",
    date: "April 20, 2025",
    readTime: "8 min read",
    emoji: "📋",
  },
  {
    category: "Industry Trends",
    title:
      "The 10 Most In-Demand Freelance Skills in India in 2025 — And What They Pay",
    excerpt:
      "From AI integration and full-stack development to UI/UX design, video editing, and digital marketing — here is where the real demand is, what Clients are willing to pay, and which niches are growing fastest on freelance platforms in India.",
    author: "FreelanceHub Pro Editorial",
    date: "April 18, 2025",
    readTime: "11 min read",
    emoji: "📈",
  },
  {
    category: "Freelancer Tips",
    title:
      "Proposal Writing 101: The Anatomy of a Winning Bid on FreelanceHub Pro",
    excerpt:
      "We analysed hundreds of successful proposals on the platform and identified five structural elements that appear in every one that wins work. This is not theory — this is what actually converts.",
    author: "FreelanceHub Pro Editorial",
    date: "April 15, 2025",
    readTime: "8 min read",
    emoji: "✍️",
  },
  {
    category: "Success Stories",
    title:
      "From Zero Reviews to ₹1.2L/Month: How Rohan Built His Freelance Practice in 6 Months",
    excerpt:
      "Rohan started on FreelanceHub Pro with no reviews, a freshly built portfolio, and one goal: replace his full-time salary within a year. Six months in, he had exceeded it. Here is exactly how he did it.",
    author: "FreelanceHub Pro Editorial",
    date: "April 12, 2025",
    readTime: "10 min read",
    emoji: "🏆",
  },
  {
    category: "Client Guides",
    title:
      "Milestone Payments Explained: The Smart Way to Manage Large Freelance Projects",
    excerpt:
      "For any project that runs longer than two weeks or costs more than ₹15,000, milestone-based payments are not just a good idea — they are the professional standard. Here is how to structure them correctly.",
    author: "FreelanceHub Pro Editorial",
    date: "April 10, 2025",
    readTime: "6 min read",
    emoji: "🎯",
  },
  {
    category: "Payments & Finance",
    title:
      "Freelancer Taxes in India 2025: What You Need to Know About GST, ITR, and TDS",
    excerpt:
      "Tax compliance is one of the most neglected aspects of freelancing in India — until it becomes a crisis. This straightforward guide covers what Indian freelancers earning through platforms need to know about their tax obligations.",
    author: "FreelanceHub Pro Editorial",
    date: "April 8, 2025",
    readTime: "13 min read",
    emoji: "🧾",
  },
  {
    category: "Platform Updates",
    title:
      "What Is New on FreelanceHub Pro — April 2025 Product Update",
    excerpt:
      "A walkthrough of everything that launched or improved on the platform in April 2025 — including the new Bid Insights dashboard, Resume Video profiles, updated dispute resolution workflows, and UPI withdrawal improvements.",
    author: "FreelanceHub Pro Team",
    date: "April 5, 2025",
    readTime: "5 min read",
    emoji: "🚀",
  },
  {
    category: "Freelancer Tips",
    title:
      "Building a Freelance Portfolio From Scratch: A Step-by-Step Guide for Beginners",
    excerpt:
      "No experience, no clients, no portfolio. Every successful freelancer started here. This guide explains exactly how to build a compelling portfolio that wins projects even before you have a single paid client to show.",
    author: "FreelanceHub Pro Editorial",
    date: "April 3, 2025",
    readTime: "9 min read",
    emoji: "🎨",
  },
  {
    category: "Industry Trends",
    title:
      "The Rise of the Indian Freelance Economy: Data, Trends, and What It Means for Independent Professionals",
    excerpt:
      "India is home to an estimated 15 million freelancers — one in four globally. The Indian freelance platforms market is projected to reach USD 1.5 billion by 2033. Here is what the numbers mean for the opportunity in front of every skilled Indian professional today.",
    author: "FreelanceHub Pro Editorial",
    date: "April 1, 2025",
    readTime: "10 min read",
    emoji: "🇮🇳",
  },
  {
    category: "Success Stories",
    title:
      "How Priya Went from Struggling Content Writer to Fully Booked Freelancer in 90 Days",
    excerpt:
      "Priya had been freelancing for two years with inconsistent results — until she made three specific changes to how she positioned herself and wrote her proposals. Within 90 days, she had more work than she could handle.",
    author: "FreelanceHub Pro Editorial",
    date: "March 28, 2025",
    readTime: "8 min read",
    emoji: "🌟",
  },
];

const categoryColors: Record<string, string> = {
  "Freelancer Tips": "bg-blue-50 text-blue-700 border-blue-100",
  "Client Guides": "bg-orange-50 text-orange-700 border-orange-100",
  "Payments & Finance": "bg-green-50 text-green-700 border-green-100",
  "Platform Updates": "bg-purple-50 text-purple-700 border-purple-100",
  "Success Stories": "bg-yellow-50 text-yellow-700 border-yellow-100",
  "Industry Trends": "bg-teal-50 text-teal-700 border-teal-100",
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expandedFeatured, setExpandedFeatured] = useState(false);

  const filtered =
    activeCategory === "All"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <>
      <Header />
      <main className="bg-slate-50 min-h-screen mt-10">
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-900">
              FreelanceHub Pro Blog
            </h1>
            <p className="text-gray-600 mt-1">
              Practical guides, platform updates, success stories, and industry
              insights — written for Freelancers and Clients building their best
              work
            </p>
          </div>

          <div className="space-y-8">

            {/* — FEATURED POST — */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded-full px-3 py-1">
                    {featuredPost.tag}
                  </span>
                  <span
                    className={`text-xs font-medium border rounded-full px-2.5 py-0.5 ${categoryColors[featuredPost.category]
                      }`}
                  >
                    {featuredPost.category}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-blue-900 leading-snug mb-3">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                  <span>✍️ {featuredPost.author}</span>
                  <span>📅 {featuredPost.date}</span>
                  <span>⏱ {featuredPost.readTime}</span>
                </div>

                {expandedFeatured && (
                  <div className="space-y-5 border-t border-gray-100 pt-5 mb-5">
                    {featuredPost.sections.map((s, i) => (
                      <div key={i}>
                        <h3 className="text-base font-semibold text-blue-900 mb-2">
                          {s.heading}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {s.body}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => setExpandedFeatured(!expandedFeatured)}
                  className="inline-block text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg px-5 py-2.5 transition-colors"
                >
                  {expandedFeatured ? "Show Less ▲" : "Read Full Article →"}
                </button>
              </div>
            </div>

            {/* — HIGHLIGHT — */}
            <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-xl">
              <p className="text-gray-700 text-sm">
                <strong>New articles every week.</strong> The FreelanceHub Pro
                Blog publishes practical, platform-specific content for Indian
                Freelancers and Clients. Subscribe by joining the platform and
                enabling notifications — or check back here regularly.
              </p>
            </div>

            {/* — CATEGORY FILTERS — */}
            <div>
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Browse by Topic
              </h2>
              <div className="flex flex-wrap gap-2">
                {blogCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${activeCategory === cat
                        ? "bg-blue-900 text-white border-blue-900"
                        : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* — POST GRID — */}
            <div>
              <p className="text-xs text-gray-400 mb-4">
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}{" "}
                {activeCategory !== "All" ? `in ${activeCategory}` : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((post, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col hover:shadow-sm hover:border-orange-200 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{post.emoji}</span>
                      <span
                        className={`text-xs font-medium border rounded-full px-2.5 py-0.5 ${categoryColors[post.category]
                          }`}
                      >
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-blue-900 leading-snug mb-2 flex-grow">
                      {post.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                      <div className="text-xs text-gray-400 space-y-0.5">
                        <p>{post.date}</p>
                        <p>{post.readTime}</p>
                      </div>
                      <button className="text-sm font-medium text-orange-600 hover:underline">
                        Read more →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* — NEWSLETTER / CTA — */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <div className="max-w-xl">
                <h2 className="text-xl font-semibold text-blue-900 mb-2">
                  Never Miss an Article
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  The FreelanceHub Pro Blog covers everything from proposal
                  writing and rate-setting to platform updates, industry trends,
                  and Freelancer success stories. Create a free account to get
                  notified when new content is published.
                </p>
                <a
                  href="/sign-up-page"
                  className="inline-block bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Join FreelanceHub Pro — It&apos;s Free
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
                  { label: "Learning Academy", href: "/learning-academy" },
                  { label: "Community Forum", href: "/community-forum" },
                  { label: "Help Center", href: "/help-center" },
                  { label: "Careers", href: "/careers" },
                  { label: "Contact Us", href: "/contact" },
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