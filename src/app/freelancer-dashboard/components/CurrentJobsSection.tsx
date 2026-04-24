// "use client";

// import { useState } from "react";
// import { Search, Filter, MoreVertical } from "lucide-react";

// interface CurrentJob {
//   id: number;
//   title: string;
//   client: string;
//   clientAvatar: string;
//   status: "in-progress" | "review" | "pending";
//   budget: string;
//   earned: string;
//   deadline: string;
//   // progress: number;
//   lastUpdate: string;
//   description: string;
// }

// export default function CurrentJobsSection() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");

//   const currentJobs: CurrentJob[] = [
//     {
//       id: 1,
//       title: "React Dashboard Development",
//       client: "Alpha Corp",
//       clientAvatar: "AC",
//       status: "in-progress",
//       budget: "$2,500",
//       earned: "$1,875",
//       deadline: "Feb 28, 2026",
//       // progress: 75,
//       lastUpdate: "2 hours ago",
//       description: "Building a modern dashboard with React and TypeScript",
//     },
//     {
//       id: 2,
//       title: "E-commerce Website Redesign",
//       client: "Beta Retail",
//       clientAvatar: "BR",
//       status: "review",
//       budget: "$3,200",
//       earned: "$3,200",
//       deadline: "Feb 20, 2026",
//       // progress: 100,
//       lastUpdate: "1 day ago",
//       description: "Complete redesign of e-commerce platform UI/UX",
//     },
//     {
//       id: 3,
//       title: "Mobile App Bug Fixes",
//       client: "Gamma Tech",
//       clientAvatar: "GT",
//       status: "pending",
//       budget: "$800",
//       earned: "$0",
//       deadline: "Feb 25, 2026",
//       // progress: 0,
//       lastUpdate: "3 days ago",
//       description: "Fixing critical bugs in React Native mobile application",
//     },
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       // case "in-progress":
//       //   return "bg-blue-100 text-blue-700";
//       case "review":
//         return "bg-yellow-100 text-yellow-700";
//       case "pending":
//         return "bg-gray-100 text-gray-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   const getStatusText = (status: string) => {
//     switch (status) {
//       // case "in-progress":
//       //   return "In Progress";
//       case "review":
//         return "Under Review";
//       case "pending":
//         return "Pending Start";
//       default:
//         return status;
//     }
//   };

//   const filteredJobs = currentJobs.filter((job) => {
//     const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.client.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter = filterStatus === "all" || job.status === filterStatus;
//     return matchesSearch && matchesFilter;
//   });

//   return (
//     <div className="flex-1 p-8 bg-[#FAFBFC]">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-[#1A1D23] mb-2">Current Jobs</h2>
//           <p className="text-[#6B7280]">Manage your ongoing projects and contracts</p>
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
//           <div className="flex flex-col md:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search jobs or clients..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
//               />
//             </div>

//             <div className="flex gap-3">
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
//               >
//                 <option value="all">All Status</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="review">Under Review</option>
//                 <option value="pending">Pending</option>
//               </select>

//               <button className="px-4 py-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F7FAFC] transition-colors flex items-center gap-2">
//                 <Filter size={20} />
//                 <span className="hidden sm:inline">More Filters</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-sm font-medium text-[#6B7280]">Active Jobs</h3>
//               <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                 <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//               </div>
//             </div>
//             <p className="text-3xl font-bold text-[#1A1D23]">3</p>
//             <p className="text-sm text-green-600 mt-2">+1 this week</p>
//           </div>

//           <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-sm font-medium text-[#6B7280]">Total Earned</h3>
//               <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
//                 <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//             </div>
//             <p className="text-3xl font-bold text-[#1A1D23]">$5,075</p>
//             <p className="text-sm text-green-600 mt-2">+$1,875 this month</p>
//           </div>

//           <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-sm font-medium text-[#6B7280]">Avg. Completion</h3>
//               <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
//                 <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//                 </svg>
//               </div>
//             </div>
//             <p className="text-3xl font-bold text-[#1A1D23]">58%</p>
//             <p className="text-sm text-[#6B7280] mt-2">Across all jobs</p>
//           </div>
//         </div>

//         {/* Jobs List */}
//         <div className="space-y-6">
//           {filteredJobs.length === 0 ? (
//             <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
//               <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
//                 <Search className="text-gray-400" size={32} />
//               </div>
//               <h3 className="text-xl font-semibold text-[#1A1D23] mb-2">No jobs found</h3>
//               <p className="text-[#6B7280]">Try adjusting your search or filters</p>
//             </div>
//           ) : (
//             filteredJobs.map((job) => (
//               <div
//                 key={job.id}
//                 className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-all"
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
//                       {job.clientAvatar}
//                     </div>
//                     <div>
//                       <h3 className="text-xl font-semibold text-[#1A1D23] mb-1">
//                         {job.title}
//                       </h3>
//                       <p className="text-sm text-[#6B7280]">{job.client}</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
//                       {getStatusText(job.status)}
//                     </span>
//                     <button className="p-2 hover:bg-[#F7FAFC] rounded-lg transition-colors">
//                       <MoreVertical size={20} className="text-[#6B7280]" />
//                     </button>
//                   </div>
//                 </div>

//                 <p className="text-[#6B7280] mb-4">{job.description}</p>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
//                   <div>
//                     <p className="text-xs text-[#6B7280] mb-1">Budget</p>
//                     <p className="font-semibold text-[#1A1D23]">{job.budget}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-[#6B7280] mb-1">Earned</p>
//                     <p className="font-semibold text-green-600">{job.earned}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-[#6B7280] mb-1">Deadline</p>
//                     <p className="font-semibold text-[#1A1D23]">{job.deadline}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-[#6B7280] mb-1">Last Update</p>
//                     <p className="font-semibold text-[#1A1D23]">{job.lastUpdate}</p>
//                   </div>
//                 </div>

//                 {/* <div className="mb-4">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium text-[#6B7280]">Progress</span>
//                     <span className="text-sm font-semibold text-[#1A1D23]">{job.progress}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div
//                       className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all"
//                       style={{ width: `${job.progress}%` }}
//                     />
//                   </div>
//                 </div> */}

//                 <div className="flex gap-3">
//                   <button className="flex-1 px-4 py-2 border-2 border-[#1B365D] text-[#1B365D] font-semibold rounded-lg hover:bg-[#1B365D] hover:text-white transition-all">
//                     View Details
//                   </button>
//                   <button className="flex-1 px-4 py-2 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#E5602F] transition-all">
//                     Update Progress
//                   </button>
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
import { Search, Filter, MoreVertical, Loader2 } from "lucide-react";

interface CurrentJob {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  submittedForReview?: boolean;
  startedAt?: string;
  updatedAt?: string;
  clientInfo: {
    name: string;
    email?: string;
    image?: string;
    rating?: number;
  };
  daysSinceStart?: number;
}

export default function CurrentJobsSection() {
  const [jobs, setJobs] = useState<CurrentJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ totalCurrent: 0, totalEarning: 0 });

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/freelancer/jobs/current?page=${page}&limit=10`);
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

  const getStatusBadge = (job: CurrentJob) => {
    if (job.submittedForReview) {
      return { text: "Under Review", className: "bg-yellow-100 text-yellow-700" };
    }
    if (job.status === "in-progress") {
      return { text: "In Progress", className: "bg-blue-100 text-blue-700" };
    }
    return { text: "Pending", className: "bg-gray-100 text-gray-700" };
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.clientInfo.name.toLowerCase().includes(searchQuery.toLowerCase());
    const statusFilter = filterStatus === "all" ? true :
      (filterStatus === "review" ? job.submittedForReview :
       filterStatus === "in-progress" ? (!job.submittedForReview && job.status === "in-progress") :
       filterStatus === "pending" ? false : true); // pending not applicable
    return matchesSearch && statusFilter;
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
          <h2 className="text-3xl font-bold text-[#1A1D23] mb-2">Current Jobs</h2>
          <p className="text-[#6B7280]">Manage your ongoing projects and contracts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#6B7280]">Active Jobs</h3>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1A1D23]">{stats.totalCurrent}</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#6B7280]">Total Potential</h3>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1A1D23]">${stats.totalEarning.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-[#6B7280]">Avg. Completion</h3>
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-[#1A1D23]">58%</p>
            <p className="text-sm text-[#6B7280] mt-2">Across all jobs</p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={20} />
              <input
                type="text"
                placeholder="Search jobs or clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Under Review</option>
                {/* <option value="pending">Pending</option> */}
              </select>

              <button className="px-4 py-3 border border-[#E2E8F0] rounded-lg hover:bg-[#F7FAFC] transition-colors flex items-center gap-2">
                <Filter size={20} />
                <span className="hidden sm:inline">More Filters</span>
              </button>
            </div>
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
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#1A1D23] mb-2">No jobs found</h3>
              <p className="text-[#6B7280]">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const status = getStatusBadge(job);
              const clientAvatar = job.clientInfo.name.charAt(0).toUpperCase();
              const lastUpdate = job.updatedAt ? new Date(job.updatedAt).toLocaleDateString() : "N/A";
              const deadline = "N/A"; // Not available from API yet
              const earned = job.submittedForReview ? job.budget : 0; // For display

              return (
                <div
                  key={job._id}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {clientAvatar}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1A1D23] mb-1">
                          {job.title}
                        </h3>
                        <p className="text-sm text-[#6B7280]">{job.clientInfo.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
                        {status.text}
                      </span>
                      <button className="p-2 hover:bg-[#F7FAFC] rounded-lg transition-colors">
                        <MoreVertical size={20} className="text-[#6B7280]" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[#6B7280] mb-4 line-clamp-2">{job.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Budget</p>
                      <p className="font-semibold text-[#1A1D23]">${job.budget?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Earned</p>
                      <p className="font-semibold text-green-600">${earned.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Deadline</p>
                      <p className="font-semibold text-[#1A1D23]">{deadline}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280] mb-1">Last Update</p>
                      <p className="font-semibold text-[#1A1D23]">{lastUpdate}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 border-2 border-[#1B365D] text-[#1B365D] font-semibold rounded-lg hover:bg-[#1B365D] hover:text-white transition-all">
                      View Details
                    </button>
                    {!job.submittedForReview && (
                      <button className="flex-1 px-4 py-2 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#E5602F] transition-all">
                        Update Progress
                      </button>
                    )}
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