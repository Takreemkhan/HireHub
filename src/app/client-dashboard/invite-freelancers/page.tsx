"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, Search, X, Check } from "lucide-react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

const freelancers = [
  {
    id: "1",
    name: "Amy A.",
    title: "Copywriter, Designer, Marketer & PR Professional",
    location: "United Kingdom",
    rating: 5,
    reviewCount: 986,
    hourlyRate: "£30/hr",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
    skills: ["Copywriting", "Design", "Marketing"],
  },
  {
    id: "2",
    name: "Scott A.",
    title: "Delivering High-Quality AI-FREE Content That Gets Results",
    location: "United Kingdom",
    rating: 5,
    reviewCount: 2634,
    hourlyRate: "£10/hr",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face",
    skills: ["Content Writing", "SEO", "Copywriting"],
  },
  {
    id: "3",
    name: "Cogshed",
    title: "Creative and Commercial Copy Writing",
    location: "United Kingdom",
    rating: 4.9,
    reviewCount: 813,
    hourlyRate: "£20/hr",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face",
    skills: ["Copywriting", "Creative Writing"],
  },
  {
    id: "4",
    name: "James R.",
    title: "Full Stack Developer | React & Node.js Expert",
    location: "United States",
    rating: 4.8,
    reviewCount: 421,
    hourlyRate: "£45/hr",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&h=160&fit=crop&crop=face",
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: "5",
    name: "Priya M.",
    title: "UI/UX Designer with 8+ years of experience",
    location: "India",
    rating: 4.9,
    reviewCount: 657,
    hourlyRate: "£25/hr",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=160&h=160&fit=crop&crop=face",
    skills: ["UI/UX", "Figma", "Webflow"],
  },
  {
    id: "6",
    name: "Carlos D.",
    title: "WordPress & E-commerce Specialist",
    location: "Spain",
    rating: 4.7,
    reviewCount: 312,
    hourlyRate: "£35/hr",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&h=160&fit=crop&crop=face",
    skills: ["WordPress", "WooCommerce", "PHP"],
  },
  {
    id: "7",
    name: "Sarah K.",
    title: "Mobile App Developer | React Native & Flutter",
    location: "Canada",
    rating: 5,
    reviewCount: 189,
    hourlyRate: "£55/hr",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face",
    skills: ["React Native", "Flutter", "iOS", "Android"],
  },
  {
    id: "8",
    name: "David L.",
    title: "Backend Engineer | Python & Django Expert",
    location: "United Kingdom",
    rating: 4.8,
    reviewCount: 274,
    hourlyRate: "£50/hr",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=160&h=160&fit=crop&crop=face",
    skills: ["Python", "Django", "PostgreSQL"],
  },
];

const sortOptions = ["Recommended", "Top Rated", "Newest", "Price: Low to High", "Price: High to Low"];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-red-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function InviteFreelancersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") || "";
  const jobTitle = searchParams.get("jobTitle") || "your project";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);

  const filteredFreelancers = freelancers.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInvite = (freelancer: (typeof freelancers)[0]) => {
    if (invitedIds.includes(freelancer.id)) return;
    setInvitedIds((prev) => [...prev, freelancer.id]);
    setShowSuccessToast(freelancer.name);
    setTimeout(() => setShowSuccessToast(null), 3000);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : star - 0.5 <= rating
                ? "text-yellow-400 fill-yellow-200"
                : "text-gray-300"
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">

          {/* ── Page Header ── */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Invite your Freelancers</h1>
              <p className="text-gray-500 text-base">Invite freelancers before posting your private job.</p>
              {jobTitle && jobTitle !== "your project" && (
                <p className="text-sm text-blue-600 mt-2 font-medium">
                  For: {decodeURIComponent(jobTitle)}
                </p>
              )}
            </div>

            {/* Search + Sort */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-gray-50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 bg-white"
                >
                  {selectedSort}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-48 py-1">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedSort(opt);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${selectedSort === opt ? "text-blue-600 font-medium" : "text-gray-700"
                          }`}
                      >
                        {opt}
                        {selectedSort === opt && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invited count badge */}
          {invitedIds.length > 0 && (
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {invitedIds.length} freelancer{invitedIds.length > 1 ? "s" : ""} invited
                </span>
              </div>
            </div>
          )}

          {/* ── Freelancer Grid ── */}
          {filteredFreelancers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">No freelancers found</p>
              <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFreelancers.map((freelancer) => {
                const isInvited = invitedIds.includes(freelancer.id);
                return (
                  <div
                    key={freelancer.id}
                    className={`border rounded-xl p-6 flex flex-col items-center text-center transition-all duration-200 ${isInvited
                      ? "border-blue-300 bg-blue-50/30"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-md bg-white"
                      }`}
                  >
                    {/* Avatar */}
                    <div className="mb-4">
                      {freelancer.avatar ? (
                        <img
                          src={freelancer.avatar}
                          alt={freelancer.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold ${getAvatarColor(
                            freelancer.name
                          )}`}
                        >
                          {getInitials(freelancer.name)}
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-base font-bold text-gray-900 mb-1">{freelancer.name}</h3>

                    {/* Title */}
                    <p className="text-sm text-gray-500 mb-2 leading-snug line-clamp-2 min-h-[40px]">
                      {freelancer.title}
                    </p>

                    {/* Location */}
                    <p className="text-sm text-gray-400 mb-3">{freelancer.location}</p>

                    {/* Stars + Reviews */}
                    <div className="flex items-center gap-2 mb-4">
                      {renderStars(freelancer.rating)}
                      <span className="text-sm text-gray-600 font-medium">
                        {freelancer.rating} ({freelancer.reviewCount.toLocaleString()})
                      </span>
                    </div>

                    {/* Rate + Invite */}
                    <div className="flex items-center justify-between w-full pt-3 border-t border-gray-100">
                      <span className="text-base font-bold text-gray-900">{freelancer.hourlyRate}</span>
                      <button
                        onClick={() => handleInvite(freelancer)}
                        disabled={isInvited}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${isInvited
                          ? "bg-green-100 text-green-700 cursor-default flex items-center gap-1.5"
                          : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                          }`}
                      >
                        {isInvited ? (
                          <>
                            <Check className="w-4 h-4" /> Invited
                          </>
                        ) : (
                          "Invite"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Bottom nav ── */}
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              ← Back to Job
            </button>
            {/* {invitedIds.length > 0 && (
              <button
                onClick={() => router.back()}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Done — Back to Job
              </button>
            )} */}
          </div>
        </div>
      </main>

      {/* ── Success Toast ── */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Invitation sent to <strong>{showSuccessToast}</strong></span>
        </div>
      )}

      <FooterSection />
    </div>
  );
}

export default function InviteFreelancersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <InviteFreelancersContent />
    </Suspense>
  );
}
