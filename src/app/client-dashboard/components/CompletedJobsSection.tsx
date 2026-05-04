// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import CompletedJobCard from './CompletedJobCard';

// const completedJobs = [
//   { id: 'shopify-azure', title: 'Website redesign for e-commerce brand', rating: 5, duration: '3 weeks', price: '£480' },
//   { id: 'landing-page', title: 'Landing page for startup', rating: 4.8, duration: '10 days', price: '£220' },
//   { id: 'wordpress', title: 'WordPress performance optimization', rating: 5, duration: '2 weeks', price: '£350' },
//   { id: 'portfolio', title: 'Portfolio website for designer', rating: 4.9, duration: '1 week', price: '£180' },
// ];

// export default function CompletedJobsSection() {
//   const [activeJob, setActiveJob] = useState<typeof completedJobs[0] | null>(null);
//   const router = useRouter();

//   const handleViewFullJob = () => {
//     if (!activeJob) return;
//     setActiveJob(null);
//     router.push(`/client-dashboard/completed-jobs/${activeJob.id}`);
//   };

//   return (
//     <>
//       <div className="p-8 ">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {completedJobs.map((job) => (
//             <div
//               key={job.id}
//               role="button"
//               tabIndex={0}
//               onClick={() => setActiveJob(job)}
//               onKeyDown={(e) => e.key === 'Enter' && setActiveJob(job)}
//               className="cursor-pointer"
//             >
//               <CompletedJobCard {...job} />
//             </div>
//           ))}
//         </div>
//       </div>

//       {activeJob && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <div className="bg-white w-full max-w-xl rounded-xl p-6 relative">
//             <button
//               type="button"
//               onClick={() => setActiveJob(null)}
//               className="absolute top-4 right-4 text-gray-500 hover:text-black"
//               aria-label="Close"
//             >
//               ✕
//             </button>

//             <h2 className="text-xl font-semibold mb-3">
//               Shopify app needed to connect with Azure for real-time inventory & customer sync from physical store
//             </h2>

//             <p className="text-gray-600 mb-4">
//               We need an experienced Shopify app developer to build a public app with paid subscription and Azure integration.
//             </p>

//             <div className="grid grid-cols-2 gap-4 text-sm">
//               <div>
//                 <p className="text-gray-500">Project</p>
//                 <p className="font-semibold">{activeJob.title}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Rating</p>
//                 <p className="font-semibold">⭐ {activeJob.rating}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Duration</p>
//                 <p className="font-semibold">{activeJob.duration}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500">Budget</p>
//                 <p className="font-semibold">{activeJob.price}</p>
//               </div>
//             </div>

//             <button
//               type="button"
//               onClick={handleViewFullJob}
//               className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//             >
//               View entire job post
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompletedJobCard from './CompletedJobCard';
import { Briefcase } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface CompletedJob {
  _id: string;
  title: string;
  budget: number;
  finalAmount?: number;
  durationInDays?: number;
  completedAt: string;
  clientReview?: {
    rating: number;
    comment?: string;
  } | null;
  freelancerInfo?: {
    _id: string;
    name: string;
    email: string;
    rating?: number;
  } | null;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function formatDuration(days?: number): string {
  if (!days) return 'N/A';
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''}`;
  const weeks = Math.floor(days / 7);
  return `${weeks} week${weeks !== 1 ? 's' : ''}`;
}

function formatPrice(amount?: number): string {
  if (!amount) return 'Not specified';
  return `£${amount.toLocaleString()}`;
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function CompletedJobCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CompletedJobsSection() {
  const router = useRouter();

  const [jobs, setJobs] = useState<CompletedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeJob, setActiveJob] = useState<CompletedJob | null>(null);

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      try {
        setLoading(true);
        setError('');

        console.log('📥 Fetching completed jobs from GET /api/client/jobs/completed...');

        // ✅ NEW ENDPOINT - Returns only completed jobs for current user
        const res = await fetch('/api/client/jobs/completed');
        const data = await res.json();

        console.log('📦 Response:', data);

        // ✅ Check success field
        if (!res.ok || !data.success) {
          if (res.status === 401) {
            router.push('/sign-in-page');
            return;
          }
          throw new Error(data.message || 'Failed to load completed jobs');
        }

        const completedJobs = data.jobs || [];
        console.log(`✅ Completed jobs: ${completedJobs.length}`);

        setJobs(completedJobs);

      } catch (err: any) {
        console.error('❌ CompletedJobsSection fetch error:', err);
        setError(err.message || 'Failed to load completed jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedJobs();
  }, [router]);

  const handleViewFullJob = () => {
    if (!activeJob) return;
    setActiveJob(null);
    router.push(`/client-dashboard/completed-jobs/${activeJob._id}`);
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <CompletedJobCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="p-8">
        <div className="text-center py-16">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-700 font-medium mb-2">Failed to load completed jobs</p>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Empty state ──────────────────────────────────────────────────────────
  if (jobs.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center py-16">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No completed jobs yet
          </h3>
          <p className="text-gray-500">
            Your completed projects will appear here.
          </p>
        </div>
      </div>
    );
  }

  // ── Completed Jobs Grid ──────────────────────────────────────────────────
  return (
    <>
      <div className="p-8">
        {/* Header with count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            {jobs.length} completed job{jobs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              role="button"
              tabIndex={0}
              onClick={() => setActiveJob(job)}
              onKeyDown={(e) => e.key === 'Enter' && setActiveJob(job)}
              className="cursor-pointer"
            >
              <CompletedJobCard
                title={job.title}
                rating={job.clientReview?.rating || 0}
                duration={formatDuration(job.durationInDays)}
                price={formatPrice(job.finalAmount || job.budget)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Job Detail Modal */}
      {activeJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white w-full max-w-xl rounded-xl p-6 relative">
            <button
              type="button"
              onClick={() => setActiveJob(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
              aria-label="Close"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-3">
              {activeJob.title}
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm mt-6">
              <div>
                <p className="text-gray-500">Status</p>
                <p className="font-semibold">Completed</p>
              </div>

              {activeJob.clientReview && (
                <div>
                  <p className="text-gray-500">Your Rating</p>
                  <p className="font-semibold">⭐ {activeJob.clientReview.rating} / 5</p>
                </div>
              )}

              <div>
                <p className="text-gray-500">Duration</p>
                <p className="font-semibold">{formatDuration(activeJob.durationInDays)}</p>
              </div>

              <div>
                <p className="text-gray-500">Final Amount</p>
                <p className="font-semibold">{formatPrice(activeJob.finalAmount || activeJob.budget)}</p>
              </div>

              {activeJob.freelancerInfo && (
                <div className="col-span-2">
                  <p className="text-gray-500">Freelancer</p>
                  <p className="font-semibold">{activeJob.freelancerInfo.name}</p>
                  {activeJob.freelancerInfo.rating && (
                    <p className="text-xs text-gray-500">Rating: ⭐ {activeJob.freelancerInfo.rating.toFixed(1)}</p>
                  )}
                </div>
              )}

              {activeJob.clientReview?.comment && (
                <div className="col-span-2">
                  <p className="text-gray-500">Your Review</p>
                  <p className="text-sm mt-1">{activeJob.clientReview.comment}</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleViewFullJob}
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              View Full Details
            </button>
          </div>
        </div>
      )}
    </>
  );
}