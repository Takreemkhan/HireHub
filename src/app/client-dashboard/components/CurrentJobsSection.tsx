
// 'use client';

// import { useRouter } from 'next/navigation';
// import { Clock, MapPin, Tag, Briefcase, Plus } from 'lucide-react';
// import { useState, useEffect } from 'react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Job {
//   _id: string;
//   title: string;
//   budget: number;
//   category: string;
//   subCategory: string;
//   status: string;
//   jobVisibility: string;
//   freelancerSource: string;
//   projectDuration: string;
//   createdAt: string;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function timeAgo(dateString: string): string {
//   const diffMs = Date.now() - new Date(dateString).getTime();
//   const mins  = Math.floor(diffMs / 60000);
//   const hours = Math.floor(mins / 60);
//   const days  = Math.floor(hours / 24);
//   if (mins  < 60) return `${mins} minutes ago`;
//   if (hours < 24) return `${hours} hours ago`;
//   if (days  === 1) return '1 day ago';
//   if (days  <  7) return `${days} days ago`;
//   return `${Math.floor(days / 7)} weeks ago`;
// }

// function formatBudget(budget: number): string {
//   if (!budget) return 'Not specified';
//   return `£${budget.toLocaleString()}`;
// }

// // Last 7 chars of MongoDB _id as a short display ID
// function shortId(id: string): string {
//   return `#${id.slice(-7).toUpperCase()}`;
// }

// // ─── Job Card ─────────────────────────────────────────────────────────────────

// function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
//   return (
//     <div
//       role="button"
//       tabIndex={0}
//       onClick={onClick}
//       onKeyDown={(e) => e.key === 'Enter' && onClick()}
//       className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-blue-200"
//     >
//       <div>
//         <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 lg:text-xl">
//           {job.title}
//         </h2>

//         <div className="space-y-2 text-sm text-gray-600 lg:text-base">
//           <div className="flex items-center gap-2">
//             <Clock className="w-4 h-4 flex-shrink-0" />
//             Posted {timeAgo(job.createdAt)}
//           </div>
//           <div className="flex items-center gap-2">
//             <MapPin className="w-4 h-4 flex-shrink-0" />
//             {/* location not in schema yet — show visibility instead */}
//             {job.jobVisibility === 'private' ? '🔒 Private' : 'Remote'}
//           </div>
//           <div className="flex items-center gap-2">
//             <Tag className="w-4 h-4 flex-shrink-0" />
//             {shortId(job._id)}
//           </div>
//         </div>
//       </div>

//       <div className="pt-3 border-t flex items-end justify-between">
//         <div>
//           <p className="text-xs text-gray-500 mb-0.5">
//             {job.freelancerSource === 'invited' ? 'Private Project' : 'Fixed Budget'}
//           </p>
//           <p className="text-xl font-bold text-gray-900">
//             {formatBudget(job.budget)}
//           </p>
//         </div>

//         {/* Status badge */}
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           job.status === 'open'        ? 'bg-green-100 text-green-700' :
//           job.status === 'in-progress' ? 'bg-blue-100 text-blue-700'  :
//           job.status === 'completed'   ? 'bg-gray-100 text-gray-600'  :
//           'bg-yellow-100 text-yellow-700'
//         }`}>
//           {job.status === 'open' ? 'Active' : job.status}
//         </span>
//       </div>
//     </div>
//   );
// }

// // ─── Loading Skeleton ─────────────────────────────────────────────────────────

// function JobCardSkeleton() {
//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 animate-pulse">
//       <div className="space-y-3">
//         <div className="h-5 bg-gray-200 rounded w-3/4" />
//         <div className="h-4 bg-gray-200 rounded w-1/2" />
//         <div className="h-4 bg-gray-200 rounded w-1/3" />
//         <div className="h-4 bg-gray-200 rounded w-2/5" />
//       </div>
//       <div className="pt-3 border-t space-y-2">
//         <div className="h-3 bg-gray-200 rounded w-1/4" />
//         <div className="h-6 bg-gray-200 rounded w-1/3" />
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function CurrentJobsSection() {
//   const router = useRouter();

//   const [jobs, setJobs]       = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState('');

//   useEffect(() => {
//     const fetchMyJobs = async () => {
//       try {
//         setLoading(true);
//         setError('');

//         /*
//          * GET /api/jobs/client-jobs
//          * Returns all jobs where clientId === logged-in user's ID
//          * Auth: NextAuth session cookie sent automatically
//          */
//         const res  = await fetch('/api/jobs/client-jobs');
//         const data = await res.json();

//         if (res.status === 401) {
//           // Not logged in — redirect to sign in
//           router.push('/sign-in-page');
//           return;
//         }

//         if (!res.ok) {
//           throw new Error(data.message || 'Failed to load jobs');
//         }

//         setJobs(data.jobs || []);

//       } catch (err: any) {
//         console.error('CurrentJobsSection fetch error:', err);
//         setError(err.message || 'Failed to load your jobs');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyJobs();
//   }, [router]);

//   // ── Loading skeletons ────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3].map((i) => <JobCardSkeleton key={i} />)}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Error state ──────────────────────────────────────────────────────────
//   if (error) {
//     return (
//       <div className="bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="text-center py-16">
//             <div className="text-4xl mb-4">⚠️</div>
//             <p className="text-gray-700 font-medium mb-2">Failed to load jobs</p>
//             <p className="text-sm text-gray-500 mb-6">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Empty state ──────────────────────────────────────────────────────────
//   if (jobs.length === 0) {
//     return (
//       <div className="bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="text-center py-16">
//             <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               No jobs posted yet
//             </h3>
//             <p className="text-gray-500 mb-6">
//               Post your first job to start receiving proposals from freelancers.
//             </p>
//             <button
//               onClick={() => router.push('/post-page')}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
//             >
//               <Plus className="w-4 h-4" />
//               Post a Job
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Real jobs grid ───────────────────────────────────────────────────────
//   return (
//     <div className="bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">

//         {/* Header with count */}
//         <div className="flex items-center justify-between mb-6">
//           <p className="text-sm text-gray-500">
//             {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
//           </p>
//           <button
//             onClick={() => router.push('/post-page')}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
//           >
//             <Plus className="w-4 h-4" />
//             Post Another Job
//           </button>
//         </div>

//         {/* Job cards — clicking navigates to /client-dashboard/current-jobs/[real _id] */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {jobs.map((job) => (
//             <JobCard
//               key={job._id}
//               job={job}
//               onClick={() => router.push(`/client-dashboard/current-jobs/${job._id}`)}
//             />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useRouter } from 'next/navigation';
// import { Clock, MapPin, Tag, Briefcase, Plus } from 'lucide-react';
// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Job {
//   _id: string;
//   clientId: string; // ← We need this to filter
//   title: string;
//   budget: number;
//   category: string;
//   subCategory: string;
//   status: string;
//   jobVisibility: string;
//   freelancerSource: string;
//   projectDuration: string;
//   createdAt: string;
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function timeAgo(dateString: string): string {
//   const diffMs = Date.now() - new Date(dateString).getTime();
//   const mins  = Math.floor(diffMs / 60000);
//   const hours = Math.floor(mins / 60);
//   const days  = Math.floor(hours / 24);
//   if (mins  < 60) return `${mins} minutes ago`;
//   if (hours < 24) return `${hours} hours ago`;
//   if (days  === 1) return '1 day ago';
//   if (days  <  7) return `${days} days ago`;
//   return `${Math.floor(days / 7)} weeks ago`;
// }

// function formatBudget(budget: number): string {
//   if (!budget) return 'Not specified';
//   return `£${budget.toLocaleString()}`;
// }

// // Last 7 chars of MongoDB _id as a short display ID
// function shortId(id: string): string {
//   return `#${id.slice(-7).toUpperCase()}`;
// }

// // ─── Job Card ─────────────────────────────────────────────────────────────────

// function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
//   return (
//     <div
//       role="button"
//       tabIndex={0}
//       onClick={onClick}
//       onKeyDown={(e) => e.key === 'Enter' && onClick()}
//       className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-blue-200"
//     >
//       <div>
//         <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 lg:text-xl">
//           {job.title}
//         </h2>

//         <div className="space-y-2 text-sm text-gray-600 lg:text-base">
//           <div className="flex items-center gap-2">
//             <Clock className="w-4 h-4 flex-shrink-0" />
//             Posted {timeAgo(job.createdAt)}
//           </div>
//           <div className="flex items-center gap-2">
//             <MapPin className="w-4 h-4 flex-shrink-0" />
//             {job.jobVisibility === 'private' ? '🔒 Private' : 'Remote'}
//           </div>
//           <div className="flex items-center gap-2">
//             <Tag className="w-4 h-4 flex-shrink-0" />
//             {shortId(job._id)}
//           </div>
//         </div>
//       </div>

//       <div className="pt-3 border-t flex items-end justify-between">
//         <div>
//           <p className="text-xs text-gray-500 mb-0.5">
//             {job.freelancerSource === 'invited' ? 'Private Project' : 'Fixed Budget'}
//           </p>
//           <p className="text-xl font-bold text-gray-900">
//             {formatBudget(job.budget)}
//           </p>
//         </div>

//         {/* Status badge */}
//         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//           job.status === 'open'        ? 'bg-green-100 text-green-700' :
//           job.status === 'in-progress' ? 'bg-blue-100 text-blue-700'  :
//           job.status === 'completed'   ? 'bg-gray-100 text-gray-600'  :
//           'bg-yellow-100 text-yellow-700'
//         }`}>
//           {job.status === 'open' ? 'Active' : job.status}
//         </span>
//       </div>
//     </div>
//   );
// }

// // ─── Loading Skeleton ─────────────────────────────────────────────────────────

// function JobCardSkeleton() {
//   return (
//     <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 animate-pulse">
//       <div className="space-y-3">
//         <div className="h-5 bg-gray-200 rounded w-3/4" />
//         <div className="h-4 bg-gray-200 rounded w-1/2" />
//         <div className="h-4 bg-gray-200 rounded w-1/3" />
//         <div className="h-4 bg-gray-200 rounded w-2/5" />
//       </div>
//       <div className="pt-3 border-t space-y-2">
//         <div className="h-3 bg-gray-200 rounded w-1/4" />
//         <div className="h-6 bg-gray-200 rounded w-1/3" />
//       </div>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function CurrentJobsSection() {
//   const router = useRouter();
//   const { data: session, status } = useSession(); // ← Get current user

//   const [jobs, setJobs]       = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState('');

//   useEffect(() => {
//     // Wait for session to load
//     if (status === 'loading') return;

//     // Not logged in → redirect
//     if (status === 'unauthenticated') {
//       router.push('/sign-in-page');
//       return;
//     }

//     const fetchMyJobs = async () => {
//       try {
//         setLoading(true);
//         setError('');

//         console.log('📥 Fetching ALL jobs from GET /api/jobs...');

//         // ✅ Fetch from EXISTING endpoint
//         const res  = await fetch('/api/jobs');
//         const data = await res.json();

//         console.log('📦 Response:', data);

//         if (!res.ok) {
//           throw new Error(data.message || 'Failed to load jobs');
//         }

//         const allJobs = data.jobs || [];
//         console.log(`📊 Total jobs in DB: ${allJobs.length}`);

//         // ✅ Filter to show ONLY current user's jobs
//         const currentUserId = session?.user?.id;
//         console.log('👤 Current user ID:', currentUserId);

//         if (!currentUserId) {
//           throw new Error('User ID not found in session');
//         }

//         const myJobs = allJobs.filter((job: Job) => {
//           // MongoDB stores clientId as ObjectId, session might have it as string
//           const jobClientId = job.clientId?.toString();
//           const sessionUserId = currentUserId.toString();

//           console.log('🔍 Comparing:', { jobClientId, sessionUserId, match: jobClientId === sessionUserId });

//           return jobClientId === sessionUserId;
//         });

//         console.log(`✅ Your jobs: ${myJobs.length}`);
//         setJobs(myJobs);

//       } catch (err: any) {
//         console.error('❌ CurrentJobsSection fetch error:', err);
//         setError(err.message || 'Failed to load your jobs');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyJobs();
//   }, [router, session, status]);

//   // ── Loading skeletons ────────────────────────────────────────────────────
//   if (status === 'loading' || loading) {
//     return (
//       <div className="bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[1, 2, 3].map((i) => <JobCardSkeleton key={i} />)}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Error state ──────────────────────────────────────────────────────────
//   if (error) {
//     return (
//       <div className="bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="text-center py-16">
//             <div className="text-4xl mb-4">⚠️</div>
//             <p className="text-gray-700 font-medium mb-2">Failed to load jobs</p>
//             <p className="text-sm text-gray-500 mb-6">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Empty state ──────────────────────────────────────────────────────────
//   if (jobs.length === 0) {
//     return (
//       <div className="bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-8">
//           <div className="text-center py-16">
//             <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">
//               No jobs posted yet
//             </h3>
//             <p className="text-gray-500 mb-6">
//               Post your first job to start receiving proposals from freelancers.
//             </p>
//             <button
//               onClick={() => router.push('/post-page')}
//               className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
//             >
//               <Plus className="w-4 h-4" />
//               Post a Job
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Real jobs grid ───────────────────────────────────────────────────────
//   return (
//     <div className="bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">

//         {/* Header with count */}
//         <div className="flex items-center justify-between mb-6">
//           <p className="text-sm text-gray-500">
//             {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
//           </p>
//           <button
//             onClick={() => router.push('/post-page')}
//             className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
//           >
//             <Plus className="w-4 h-4" />
//             Post Another Job
//           </button>
//         </div>

//         {/* Job cards — clicking navigates to /client-dashboard/current-jobs/[real _id] */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {jobs.map((job) => (
//             <JobCard
//               key={job._id}
//               job={job}
//               onClick={() => router.push(`/client-dashboard/current-jobs/${job._id}`)}
//             />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }

'use client';

import { useRouter } from 'next/navigation';
import { Clock, MapPin, Tag, Briefcase, Plus, Banknote } from 'lucide-react';
import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Job {
  _id: string;
  title: string;
  budget: number;
  category: string;
  subCategory: string;
  status: string;
  jobVisibility: string;
  freelancerSource: string;
  projectDuration: string;
  currency: string;
  createdAt: string;
  proposalCount?: number;
  paymentStatus?: string;
  freelancerInfo?: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 60) return `${mins} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

// NAYA - ye lagao
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  INR: '₹',
  GBP: '£',
  EUR: '€',
};



function formatBudget(budget: number, currency: string = 'USD'): string {
  if (!budget) return 'Not specified';
  const symbol = CURRENCY_SYMBOLS[currency] || currency + ' ';
  return `${symbol}${budget.toLocaleString()}`;
}

// Last 7 chars of MongoDB _id as a short display ID
function shortId(id: string): string {
  return `#${id.slice(-7).toUpperCase()}`;
}

// ─── Job Card ─────────────────────────────────────────────────────────────────

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-blue-200"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 lg:text-xl">
          {job.title}
        </h2>

        {/* Category & Subcategory */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
            {job.category}
          </span>
          {job.subCategory && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              {job.subCategory}
            </span>
          )}
        </div>

        <div className="space-y-2 text-sm text-gray-600 lg:text-base">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 flex-shrink-0" />
            Posted {timeAgo(job.createdAt)}
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {job.jobVisibility === 'private' ? '🔒 Private' : 'Remote'}
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 flex-shrink-0" />
            {shortId(job._id)}
          </div>

          {/* Show proposal count or assigned freelancer */}
          {job.status === 'open' && job.proposalCount !== undefined && (
            <div className="flex items-center gap-2 text-blue-600">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              {job.proposalCount} proposal{job.proposalCount !== 1 ? 's' : ''}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-gray-500" />

            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
    ${(job.paymentStatus === "paid" || job.paymentStatus === "deposit" || job.paymentStatus === "escrow_funded")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
                }`}
            >
              {job.paymentStatus === "paid" || job.paymentStatus === "escrow_funded" ? "Deposit" : (job.paymentStatus === "pending_assignment" ? "Pending" : (job.paymentStatus || "pending").replace('_', ' '))}
            </span>
          </div>

          {job.status === 'in-progress' && job.freelancerInfo && (
            <div className="flex items-center gap-2 text-green-600">
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              Assigned to {job.freelancerInfo.name}
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">
            {job.freelancerSource === 'invited' ? 'Private Project' : 'Fixed Budget'}
          </p>

          <p className="text-xl font-bold text-gray-900">
            {formatBudget(job.budget, job.currency)}
          </p>
        </div>

        {/* Status badge */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-green-100 text-green-700' :
          job.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
          {job.status === 'open' ? 'Active' : job.status === 'in-progress' ? 'In Progress' : job.status}
        </span>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function JobCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col gap-4 animate-pulse">
      <div className="space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-2/5" />
      </div>
      <div className="pt-3 border-t space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/4" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CurrentJobsSection() {
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalCurrent: 0,
    inProgressCount: 0,
    openCount: 0,
  });

  useEffect(() => {
    const fetchCurrentJobs = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('📥 Fetching current jobs from GET /api/client/jobs/current...');

        // ✅ NEW ENDPOINT - Returns only current user's jobs (open + in-progress)
        const res = await fetch('/api/client/jobs/current');
        const data = await res.json();

        console.log('📦 Response:', data);

        // ✅ Check success field
        if (!res.ok || !data.success) {
          if (res.status === 401) {
            router.push('/sign-in-page');
            return;
          }
          throw new Error(data.message || 'Failed to load current jobs');
        }

        const currentJobs = data.jobs || [];
        console.log(`✅ Current jobs: ${currentJobs.length}`);

        setJobs(currentJobs);

        // Set stats if provided
        if (data.stats) {
          setStats(data.stats);
        }

      } catch (err: any) {
        console.error('❌ CurrentJobsSection fetch error:', err);
        setError(err.message || 'Failed to load your current jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentJobs();
  }, [router]);

  // ── Loading skeletons ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <JobCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-gray-700 font-medium mb-2">Failed to load jobs</p>
            <p className="text-sm text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (jobs.length === 0) {
    return (
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No current jobs
            </h3>
            <p className="text-gray-500 mb-6">
              You don't have any active or in-progress jobs at the moment.
            </p>
            <button
              onClick={() => router.push('/post-page')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <Plus className="w-4 h-4" />
              Post a Job
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Real jobs grid ───────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header with count and stats */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">
              {stats.totalCurrent} current job{stats.totalCurrent !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {stats.openCount} open • {stats.inProgressCount} in progress
            </p>
          </div>
          <button
            onClick={() => router.push('/post-page')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Post Another Job
          </button>
        </div>

        {/* Job cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onClick={() => router.push(`/client-dashboard/current-jobs/${job._id}`)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}