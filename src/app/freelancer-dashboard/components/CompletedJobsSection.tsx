// "use client";

// import { useState } from "react";
// import { Search, Star, Calendar, DollarSign, Award } from "lucide-react";

// interface CompletedJob {
//   id: number;
//   title: string;
//   client: string;
//   clientAvatar: string;
//   completedDate: string;
//   budget: string;
//   earned: string;
//   rating: number;
//   review?: string;
//   skills: string[];
//   duration: string;
// }

// export default function CompletedJobsSection() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("date");

//   const completedJobs: CompletedJob[] = [
//     {
//       id: 1,
//       title: "E-commerce Platform with Payment Integration",
//       client: "Sarah Johnson",
//       clientAvatar: "SJ",
//       completedDate: "Jan 5, 2025",
//       budget: "$8,500",
//       earned: "$8,500",
//       rating: 5,
//       review: "Exceptional work! The platform exceeded our expectations. Highly professional and delivered on time.",
//       skills: ["React", "Node.js", "Stripe", "MongoDB"],
//       duration: "2 months",
//     },
//     {
//       id: 2,
//       title: "Mobile App UI/UX Design and Development",
//       client: "Michael Chen",
//       clientAvatar: "MC",
//       completedDate: "Dec 15, 2024",
//       budget: "$12,000",
//       earned: "$12,000",
//       rating: 5,
//       review: "Outstanding developer with great communication skills. Would definitely hire again!",
//       skills: ["React Native", "Figma", "TypeScript"],
//       duration: "3 months",
//     },
//     {
//       id: 3,
//       title: "React Native App Development for Healthcare",
//       client: "Emily Rodriguez",
//       clientAvatar: "ER",
//       completedDate: "Nov 30, 2024",
//       budget: "$15,500",
//       earned: "$15,500",
//       rating: 5,
//       review: "Perfect execution of a complex healthcare app. Very impressed with the quality.",
//       skills: ["React Native", "AWS", "PostgreSQL", "HIPAA"],
//       duration: "4 months",
//     },
//     {
//       id: 4,
//       title: "WordPress Plugin Development and Customization",
//       client: "David Park",
//       clientAvatar: "DP",
//       completedDate: "Nov 8, 2024",
//       budget: "$3,200",
//       earned: "$3,200",
//       rating: 4,
//       skills: ["WordPress", "PHP", "JavaScript", "MySQL"],
//       duration: "1 month",
//     },
//     {
//       id: 5,
//       title: "Full Stack Web Application Development",
//       client: "James Wilson",
//       clientAvatar: "JW",
//       completedDate: "Sep 30, 2024",
//       budget: "$18,000",
//       earned: "$18,000",
//       rating: 5,
//       review: "Incredible work on our web application. The developer went above and beyond!",
//       skills: ["Next.js", "Python", "Docker", "AWS"],
//       duration: "4 months",
//     },
//     {
//       id: 6,
//       title: "Database Design and Optimization",
//       client: "Maria Garcia",
//       clientAvatar: "MG",
//       completedDate: "Aug 10, 2024",
//       budget: "$4,500",
//       earned: "$4,500",
//       rating: 4,
//       skills: ["PostgreSQL", "Redis", "Performance Tuning"],
//       duration: "2 months",
//     },
//   ];

//   const filteredJobs = completedJobs.filter((job) =>
//     job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     job.client.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const sortedJobs = [...filteredJobs].sort((a, b) => {
//     switch (sortBy) {
//       case "date":
//         return new Date(b.completedDate).getTime() - new Date(a.completedDate).getTime();
//       case "earnings":
//         return parseFloat(b.earned.replace(/[^0-9.-]+/g, "")) - parseFloat(a.earned.replace(/[^0-9.-]+/g, ""));
//       case "rating":
//         return b.rating - a.rating;
//       default:
//         return 0;
//     }
//   });

//   const totalEarned = completedJobs.reduce((sum, job) => sum + parseFloat(job.earned.replace(/[^0-9.-]+/g, "")), 0);
//   const averageRating = completedJobs.reduce((sum, job) => sum + job.rating, 0) / completedJobs.length;

//   return (
//     <div className="flex-1 p-8 bg-[#FAFBFC]">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-[#1A1D23] mb-2">Completed Jobs</h2>
//           <p className="text-[#6B7280]">View your successfully completed projects and client reviews</p>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
//             <div className="flex items-center gap-4 mb-3">
//               <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
//                 <Award className="text-green-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-[#6B7280]">Total Completed</p>
//                 <p className="text-2xl font-bold text-[#1A1D23]">{completedJobs.length}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
//             <div className="flex items-center gap-4 mb-3">
//               <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
//                 <DollarSign className="text-blue-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-[#6B7280]">Total Earned</p>
//                 <p className="text-2xl font-bold text-[#1A1D23]">${totalEarned.toLocaleString()}</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
//             <div className="flex items-center gap-4 mb-3">
//               <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
//                 <Star className="text-yellow-600 fill-yellow-600" size={24} />
//               </div>
//               <div>
//                 <p className="text-sm text-[#6B7280]">Average Rating</p>
//                 <p className="text-2xl font-bold text-[#1A1D23]">{averageRating.toFixed(1)}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Sort */}
//         <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search completed jobs or clients..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
//               />
//             </div>

//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
//             >
//               <option value="date">Sort by Date</option>
//               <option value="earnings">Sort by Earnings</option>
//               <option value="rating">Sort by Rating</option>
//             </select>
//           </div>
//         </div>

//         {/* Jobs List */}
//         <div className="space-y-6">
//           {sortedJobs.length === 0 ? (
//             <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
//               <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
//                 <Search className="text-gray-400" size={32} />
//               </div>
//               <h3 className="text-xl font-semibold text-[#1A1D23] mb-2">No completed jobs found</h3>
//               <p className="text-[#6B7280]">Try adjusting your search</p>
//             </div>
//           ) : (
//             sortedJobs.map((job) => (
//               <div
//                 key={job.id}
//                 className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-all"
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
//                       {job.clientAvatar}
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-semibold text-[#1A1D23] mb-1">
//                         {job.title}
//                       </h3>
//                       <p className="text-sm text-[#6B7280]">{job.client}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-1">
//                     {[...Array(5)].map((_, i) => (
//                       <Star
//                         key={i}
//                         size={18}
//                         className={i < job.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
//                       />
//                     ))}
//                     <span className="ml-2 font-semibold text-[#1A1D23]">{job.rating}.0</span>
//                   </div>
//                 </div>

//                 {job.review && (
//                   <div className="bg-[#F7FAFC] rounded-lg p-4 mb-4">
//                     <p className="text-sm text-[#6B7280] italic">"{job.review}"</p>
//                   </div>
//                 )}

//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {job.skills.map((skill, index) => (
//                     <span
//                       key={index}
//                       className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
//                     >
//                       {skill}
//                     </span>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E2E8F0]">
//                   <div className="flex items-center gap-2">
//                     <Calendar size={18} className="text-[#6B7280]" />
//                     <div>
//                       <p className="text-xs text-[#6B7280]">Completed</p>
//                       <p className="font-semibold text-[#1A1D23] text-sm">{job.completedDate}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <DollarSign size={18} className="text-[#6B7280]" />
//                     <div>
//                       <p className="text-xs text-[#6B7280]">Earned</p>
//                       <p className="font-semibold text-green-600 text-sm">{job.earned}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <div>
//                       <p className="text-xs text-[#6B7280]">Duration</p>
//                       <p className="font-semibold text-[#1A1D23] text-sm">{job.duration}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <DollarSign size={18} className="text-[#6B7280]" />
//                     <div>
//                       <p className="text-xs text-[#6B7280]">Budget</p>
//                       <p className="font-semibold text-[#1A1D23] text-sm">{job.budget}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Search, Star, Calendar, DollarSign, Award, Loader2 } from "lucide-react";

interface CompletedJob {
  _id: string;
  title: string;
  description: string;
  budget: number;
  finalAmount?: number;
  completedAt?: string;
  durationInDays?: number;
  clientInfo: {
    name: string;
    email?: string;
    image?: string;
    rating?: number;
  };
  clientReview?: {
    rating: number;
    comment?: string;
    reviewedAt?: string;
  };
  freelancerReview?: any;
  skills?: string[];
  earned?: number;
}

export default function CompletedJobsSection() {
  const [jobs, setJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalEarned: 0,
    averageRating: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/freelancer/jobs/completed?page=${page}&limit=10`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch jobs");

      setJobs(data.jobs);
      setTotalPages(data.pagination.totalPages);
      setStats(data.stats);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.clientInfo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime();
      case "earnings":
        return (b.finalAmount || b.budget || 0) - (a.finalAmount || a.budget || 0);
      case "rating":
        return (b.clientReview?.rating || 0) - (a.clientReview?.rating || 0);
      default:
        return 0;
    }
  });

  if (loading && page === 1) {
    return (
      <div className="flex-1 p-8 bg-[#FAFBFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-[#FAFBFC]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#1A1D23] mb-2">Completed Jobs</h2>
          <p className="text-[#6B7280]">View your successfully completed projects and client reviews</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                <Award className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Total Completed</p>
                <p className="text-2xl font-bold text-[#1A1D23]">{stats.totalCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                <DollarSign className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Total Earned</p>
                <p className="text-2xl font-bold text-[#1A1D23]">${stats.totalEarned.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center">
                <Star className="text-yellow-600 fill-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-[#6B7280]">Average Rating</p>
                <p className="text-2xl font-bold text-[#1A1D23]">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input
                type="text"
                placeholder="Search completed jobs or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="earnings">Sort by Earnings</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Jobs List */}
        <div className="space-y-6">
          {sortedJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#1A1D23] mb-2">No completed jobs found</h3>
              <p className="text-[#6B7280]">Try adjusting your search</p>
            </div>
          ) : (
            sortedJobs.map((job) => {
              const clientAvatar = job.clientInfo.name.charAt(0).toUpperCase();
              const earned = job.finalAmount || job.budget || 0;
              const rating = job.clientReview?.rating || 0;
              const reviewText = job.clientReview?.comment;
              const completedDate = job.completedAt ? new Date(job.completedAt).toLocaleDateString() : "N/A";
              const duration = job.durationInDays ? `${job.durationInDays} days` : "N/A";
              const skills = job.skills || [];

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                        {clientAvatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1A1D23] mb-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-[#6B7280]">{job.clientInfo.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                      <span className="ml-2 font-semibold text-[#1A1D23]">{rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {reviewText && (
                    <div className="bg-[#F7FAFC] rounded-lg p-4 mb-4">
                      <p className="text-sm text-[#6B7280] italic">"{reviewText}"</p>
                    </div>
                  )}

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-[#6B7280]" />
                      <div>
                        <p className="text-xs text-[#6B7280]">Completed</p>
                        <p className="font-semibold text-[#1A1D23] text-sm">{completedDate}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-[#6B7280]" />
                      <div>
                        <p className="text-xs text-[#6B7280]">Earned</p>
                        <p className="font-semibold text-green-600 text-sm">${earned.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-xs text-[#6B7280]">Duration</p>
                        <p className="font-semibold text-[#1A1D23] text-sm">{duration}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign size={18} className="text-[#6B7280]" />
                      <div>
                        <p className="text-xs text-[#6B7280]">Budget</p>
                        <p className="font-semibold text-[#1A1D23] text-sm">${job.budget?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}