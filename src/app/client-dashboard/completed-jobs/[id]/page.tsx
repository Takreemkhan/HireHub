"use client";

import { useParams } from "next/navigation";
import { MapPin, Star, CheckCircle, Clock, DollarSign } from "lucide-react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

// Detailed job data for each job
const jobDetails: Record<string, any> = {
  "shopify-azure": {
    id: "shopify-azure",
    title: "Shopify app needed to connect with Azure for real-time inventory & customer sync",
    posted: "4 years ago",
    location: "Worldwide",
    summary: [
      "We need an EXPERIENCED Shopify app developer to build a public app (with paid subscription) for our B2B business customers to connect with our existing Azure DB.",
      "This new Shopify app needs to connect our existing business customer's Shopify store to our Azure-based SaaS system.",
    ],
    requirements: [
      "Products",
      "Inventory sync (Shopify ↔ Azure)",
      "Product images & descriptions",
      "Update customer info",
    ],
    client: {
      name: "Zahid Rahman",
      rating: 5.0,
      reviews: 4,
      location: "Canada",
      timezone: "Markham · 3:22 AM",
      jobsPosted: 4,
      hireRate: "100%",
      totalSpent: "$77k+",
      avgHourlyRate: "$11.62/hr",
      totalHours: 354,
    },
  },
  "landing-page": {
    id: "landing-page",
    title: "Landing page for startup - Modern design with conversion optimization",
    posted: "2 years ago",
    location: "United States",
    summary: [
      "We're a fast-growing startup looking for an experienced web developer to create a high-converting landing page for our SaaS product.",
      "The page needs to be modern, responsive, and optimized for conversions with A/B testing capabilities.",
    ],
    requirements: [
      "Responsive design (mobile-first)",
      "SEO optimization",
      "Fast loading times (< 3 seconds)",
      "Integration with analytics tools",
      "A/B testing setup",
    ],
    client: {
      name: "Sarah Johnson",
      rating: 4.8,
      reviews: 12,
      location: "San Francisco, CA",
      timezone: "San Francisco · 1:15 PM",
      jobsPosted: 8,
      hireRate: "87%",
      totalSpent: "$45k+",
      avgHourlyRate: "$25/hr",
      totalHours: 1800,
    },
  },
  "wordpress": {
    id: "wordpress",
    title: "WordPress performance optimization - Speed and security improvements",
    posted: "1 year ago",
    location: "United Kingdom",
    summary: [
      "Our WordPress website is experiencing slow load times and security concerns. We need an expert to optimize performance and enhance security.",
      "The site has over 500 pages and needs to maintain functionality while improving speed significantly.",
    ],
    requirements: [
      "Page speed optimization (target: < 2 seconds)",
      "Security hardening",
      "Database optimization",
      "CDN integration",
      "Caching implementation",
      "Plugin audit and optimization",
    ],
    client: {
      name: "Michael Chen",
      rating: 5.0,
      reviews: 6,
      location: "London, UK",
      timezone: "London · 6:30 PM",
      jobsPosted: 3,
      hireRate: "100%",
      totalSpent: "$28k+",
      avgHourlyRate: "$35/hr",
      totalHours: 800,
    },
  },
  "portfolio": {
    id: "portfolio",
    title: "Portfolio website for designer - Showcase creative work professionally",
    posted: "6 months ago",
    location: "Canada",
    summary: [
      "I'm a freelance graphic designer looking to create a stunning portfolio website that showcases my work in the best light.",
      "The site should be visually striking, easy to navigate, and include a contact form for potential clients.",
    ],
    requirements: [
      "Modern, creative design",
      "Image gallery with lightbox",
      "Responsive layout",
      "Contact form integration",
      "Blog section",
      "Social media integration",
    ],
    client: {
      name: "Emma Williams",
      rating: 4.9,
      reviews: 3,
      location: "Toronto, Canada",
      timezone: "Toronto · 2:45 PM",
      jobsPosted: 2,
      hireRate: "100%",
      totalSpent: "$12k+",
      avgHourlyRate: "$20/hr",
      totalHours: 600,
    },
  },
};

// Mock client history data
const clientHistory = [
  {
    id: "1",
    title: "E-commerce website redesign",
    posted: "2 years ago",
    status: "Completed",
    budget: "$3,500",
    duration: "6 weeks",
  },
  {
    id: "2",
    title: "Mobile app development for iOS",
    posted: "3 years ago",
    status: "Completed",
    budget: "$8,000",
    duration: "12 weeks",
  },
  {
    id: "3",
    title: "Database migration project",
    posted: "3 years ago",
    status: "Completed",
    budget: "$2,200",
    duration: "4 weeks",
  },
];

export default function CompletedJobDetailPage() {
  const { id } = useParams();
  const jobId = Array.isArray(id) ? id[0] : id;
  const job = jobDetails[jobId || ""] || jobDetails["shopify-azure"];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow bg-gray-100 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* LEFT SECTION */}
            <div className="lg:col-span-2 bg-white rounded-xl border p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {job.title}
              </h1>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                <span>Posted {job.posted}</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
              </div>

              {/* Debug / ID (optional – remove later) */}
              <p className="text-xs text-gray-400 mb-4">
                Job ID: <span className="font-medium">{jobId}</span>
              </p>

              {/* SUMMARY */}
              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <h2 className="font-semibold text-gray-900">Summary</h2>

                {job.summary.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Requirements:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {job.requirements.map((req: string, index: number) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="bg-white rounded-xl border p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4">About the client</h3>

              <div className="flex items-center gap-2 text-green-600 text-sm mb-3">
                <CheckCircle className="w-4 h-4" />
                Payment method verified
              </div>

              <div className="space-y-3 text-sm text-gray-700">
                <p className="font-medium text-gray-900">{job.client.name}</p>

                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{job.client.rating}</span>
                  <span className="text-gray-500">({job.client.reviews} reviews)</span>
                </div>

                <p>{job.client.location}</p>
                <p className="text-gray-500">{job.client.timezone}</p>

                <hr />

                <p><strong>{job.client.jobsPosted}</strong> jobs posted</p>
                <p><strong>{job.client.hireRate}</strong> hire rate</p>
                <p><strong>{job.client.totalSpent}</strong> total spent</p>
                <p><strong>{job.client.avgHourlyRate}</strong> avg hourly rate</p>
                <p><strong>{job.client.totalHours}</strong> hours</p>
              </div>
            </div>
          </div>

          {/* CLIENT HISTORY SECTION */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Client's Job History
            </h2>
            
            <div className="space-y-4">
              {clientHistory.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-orange-400 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.posted}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.budget}
                        </span>
                        <span>{job.duration}</span>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
