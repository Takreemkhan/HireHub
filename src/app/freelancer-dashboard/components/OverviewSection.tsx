// 'use client';

// import { useRouter } from "next/navigation";

// export default function OverviewSection() {
//   const router = useRouter();

//   return (
//     <div className="bg-[#FAFBFC] p-8">
//       <div className="max-w-7xl mx-auto space-y-10 pb-10">

//         {/* HEADER */}
//         <div className="flex justify-between items-center">
//           <h2 className="font-bold text-[#1A1D23] text-3xl">
//             Welcome back 👋
//           </h2>
//         </div>

//         {/* OVERVIEW */}
//         <section>
//           <h3 className="font-semibold text-[#1A1D23] mb-6 text-2xl">
//             Overview
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//             {/* SAVED JOB / DRAFT PROPOSAL */}
//             <div className="border border-[#E2E8F0] rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-start gap-3 mb-4">
//                 <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
//                   <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
//                   </svg>
//                 </div>

//                 <div className="flex-1">
//                   <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
//                     Draft Proposal
//                   </p>
//                   <p className="font-semibold text-[#1A1D23] text-lg">
//                     Frontend Developer Needed for SaaS Platform
//                   </p>
//                 </div>
//               </div>

//               <p className="text-sm text-[#6B7280] mb-5">
//                 Complete and submit your proposal to increase your chances.
//               </p>

//               <button
//                 className="w-full border-2 border-[#1B365D] text-[#1B365D] font-semibold py-3 rounded-lg hover:bg-[#1B365D] hover:text-white transition-all"
//               >
//                 Continue Proposal
//               </button>
//             </div>

//             {/* FIND JOBS */}
//             <div
//               onClick={() => router.push("/search-and-discovery")}
//               className="border-2 border-dashed border-[#E2E8F0] rounded-xl bg-white hover:bg-[#F7FAFC] hover:border-[#FF6B35] transition-all cursor-pointer flex items-center justify-center min-h-[200px] group"
//             >
//               <div className="text-center">
//                 <div className="w-12 h-12 rounded-full bg-orange-50 mx-auto mb-3 flex items-center justify-center group-hover:bg-orange-100">
//                   <svg className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                 </div>
//                 <span className="font-semibold text-[#FF6B35]">
//                   Find new jobs
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* ACTIVE CONTRACTS */}
//         <section>
//           <h3 className="font-semibold text-[#1A1D23] mb-6 text-2xl">
//             Active contracts
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//             {/* CONTRACT CARD */}
//             <div className="border border-[#E2E8F0] rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex items-center gap-4 mb-5">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
//                   AC
//                 </div>
//                 <div>
//                   <p className="font-semibold text-[#1A1D23]">
//                     Alpha Corp
//                   </p>
//                   <p className="text-sm text-[#6B7280]">
//                     United States
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-8 mb-5">
//                 <div>
//                   <p className="text-2xl font-bold">$25/hr</p>
//                   <p className="text-xs text-[#6B7280]">Hourly rate</p>
//                 </div>
//                 <div>
//                   <p className="text-2xl font-bold">32 hrs</p>
//                   <p className="text-xs text-[#6B7280]">This week</p>
//                 </div>
//               </div>

//               <div className="bg-[#F7FAFC] rounded-lg p-4 mb-5">
//                 <p className="text-xs text-[#6B7280] mb-1">Current work</p>
//                 <p className="text-sm font-medium text-[#1A1D23]">
//                   React dashboard UI improvements
//                 </p>
//               </div>

//               <button className="w-full border-2 border-[#1B365D] text-[#1B365D] font-semibold py-3 rounded-lg hover:bg-[#1B365D] hover:text-white">
//                 View contract
//               </button>
//             </div>

//             {/* INFO CARD */}
//             <div className="border border-[#E2E8F0] rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 flex flex-col items-center justify-center text-center">
//               <div className="w-16 h-16 rounded-full bg-white shadow-sm mb-4 flex items-center justify-center">
//                 <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
//                 </svg>
//               </div>
//               <p className="font-bold text-[#1A1D23] mb-2 text-lg">
//                 Pro tip
//               </p>
//               <p className="text-sm text-[#6B7280]">
//                 Freelancers with active proposals are 3x more likely to get hired.
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* RECOMMENDED JOBS */}
//         <section>
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="font-semibold text-[#1A1D23] text-2xl">
//               Jobs recommended for you
//             </h3>

//             <button
//               onClick={() => router.push("/search-and-discovery")}
//               className="text-[#FF6B35] text-sm font-semibold hover:text-[#E5602F] flex items-center gap-2"
//             >
//               View all jobs
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </button>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {[
//               { title: 'React Developer', budget: '$500 - $800', level: 'Intermediate' },
//               { title: 'UI Designer', budget: '$300', level: 'Beginner' },
//               { title: 'Backend Node.js Dev', budget: '$1000+', level: 'Expert' },
//               { title: 'SEO Specialist', budget: '$200', level: 'Intermediate' },
//             ].map((job, i) => (
//               <div
//                 key={i}
//                 className="border border-[#E2E8F0] rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
//               >
//                 <p className="font-semibold text-[#1A1D23] mb-2">
//                   {job.title}
//                 </p>
//                 <p className="text-sm text-[#6B7280] mb-4">
//                   Budget: {job.budget}
//                 </p>
//                 <span className="inline-block text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full mb-4">
//                   {job.level}
//                 </span>

//                 <button className="w-full border-2 border-[#1B365D] text-[#1B365D] font-semibold text-sm py-2.5 rounded-lg hover:bg-[#1B365D] hover:text-white">
//                   Apply now
//                 </button>
//               </div>
//             ))}
//           </div>
//         </section>

//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SubmitProposalModal, { type JobForProposal } from "./SubmitProposalModal";

function formatBudget(budget: number | undefined): string {
  if (budget == null) return 'Not specified';
  return `£${Number(budget).toLocaleString()}`;
}

function mapApiJobToCard(apiJob: {
  _id: string;
  title: string;
  budget?: number;
  category?: string;
  subCategory?: string;
  experienceLevel?: string;
}): JobForProposal {
  const level = apiJob.experienceLevel || apiJob.subCategory || 'Intermediate';
  return {
    id: apiJob._id,
    title: apiJob.title,
    budget: formatBudget(apiJob.budget),
    level,
  };
}

export default function OverviewSection() {
  const router = useRouter();
  const [proposalJob, setProposalJob] = useState<JobForProposal | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<JobForProposal[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState('');

  // Bits state
  const [bitsRemaining, setBitsRemaining] = useState<number | null>(null);
  const [bitsTotal, setBitsTotal] = useState<number | null>(null);
  const [planLabel, setPlanLabel] = useState<string>('Free');

  // Fetch membership status
  useEffect(() => {
    // Load from localStorage first for instant display
    const storedRemaining = localStorage.getItem('freelancerBitsRemaining');
    const storedTotal = localStorage.getItem('freelancerBitsTotal');
    const storedPlan = localStorage.getItem('freelancerMembershipPlan');
    if (storedRemaining !== null) setBitsRemaining(Number(storedRemaining));
    if (storedTotal !== null) setBitsTotal(Number(storedTotal));
    if (storedPlan) setPlanLabel(storedPlan);
    console.log("storedRemaining", storedRemaining)
    // Verify with server
    fetch('/api/freelancer/membership/status')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setBitsRemaining(data.subscription.bitsRemaining);
          setBitsTotal(data.subscription.bitsTotal);
          setPlanLabel(data.subscription.planLabel);
        }
      })
      .catch(() => { });
  }, []);

  const handleBitUsed = (newBitsRemaining: number) => {
    setBitsRemaining(newBitsRemaining);
    localStorage.setItem('freelancerBitsRemaining', String(newBitsRemaining));
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        setJobsError('');
        const res = await fetch('/api/jobs/browse?limit=4&page=1');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load jobs');
        const jobs = (data.jobs || []).slice(0, 4).map(mapApiJobToCard);
        setRecommendedJobs(jobs);
      } catch (err: unknown) {
        setRecommendedJobs([]);
        setJobsError(err instanceof Error ? err.message : 'Failed to load jobs');
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-[#FAFBFC] p-8">
      <div className="max-w-7xl mx-auto space-y-10 pb-10">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-[#1A1D23] text-3xl">
            Welcome back 👋
          </h2>
        </div>

        {/* BITS WIDGET */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
              🪙
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-0.5">
                {planLabel} Plan · Bids Balance
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#1A1D23]">
                  {bitsRemaining !== null ? bitsRemaining : '—'}
                </span>
                {bitsTotal !== null && (
                  <span className="text-sm text-[#6B7280]">/ {bitsTotal} Bids remaining</span>
                )}
              </div>
              {bitsRemaining !== null && bitsTotal !== null && (
                <div className="mt-2 w-48 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-amber-400 h-2 rounded-full transition-all"
                    style={{ width: `${Math.max(0, Math.min(100, (bitsRemaining / bitsTotal) * 100))}%` }}
                  />
                </div>
              )}
              {bitsRemaining !== null && bitsRemaining <= 5 && bitsRemaining > 0 && (
                <p className="text-xs text-orange-500 font-semibold mt-1">⚠ Running low on Bids!</p>
              )}
              {bitsRemaining !== null && bitsRemaining === 0 && (
                <p className="text-xs text-red-500 font-semibold mt-1">🚫 No Bids left – upgrade to keep bidding</p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <p className="text-xs text-[#6B7280]">1 Bid = 1 proposal submission </p>
            <button
              onClick={() => router.push('/freelancer-membership')}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-sm"
            >
              {bitsRemaining === 0 ? 'Get More Bids →' : 'Manage Plan →'}
            </button>
          </div>
        </div>

        {/* OVERVIEW */}
        <section>
          <h3 className="font-semibold text-[#1A1D23] mb-6 text-2xl">
            Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* SAVED JOB / DRAFT PROPOSAL */}
            <div className="border border-[#E2E8F0] rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                  </svg>
                </div>

                <div className="flex-1">
                  <p className="text-xs font-medium text-green-600 uppercase tracking-wide mb-1">
                    Draft Proposal
                  </p>
                  <p className="font-semibold text-[#1A1D23] text-lg">
                    Frontend Developer Needed for SaaS Platform
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#6B7280] mb-5">
                Complete and submit your proposal to increase your chances.
              </p>

              <button
                className="w-full border-2 border-[#1B365D] text-[#1B365D] font-semibold py-3 rounded-lg hover:bg-[#1B365D] hover:text-white transition-all"
              >
                Continue Proposal
              </button>
            </div>

            {/* FIND JOBS */}
            <div
              onClick={() => router.push("/search-and-discovery")}
              className="border-2 border-dashed border-[#E2E8F0] rounded-xl bg-white hover:bg-[#F7FAFC] hover:border-[#FF6B35] transition-all cursor-pointer flex items-center justify-center min-h-[200px] group"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-orange-50 mx-auto mb-3 flex items-center justify-center group-hover:bg-orange-100">
                  <svg className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-semibold text-[#FF6B35]">
                  Find new jobs
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ACTIVE CONTRACTS */}
        <section>
          <h3 className="font-semibold text-[#1A1D23] mb-6 text-2xl">
            Active contracts
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CONTRACT CARD */}
            <div className="border border-[#E2E8F0] rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                  AC
                </div>
                <div>
                  <p className="font-semibold text-[#1A1D23]">
                    Alpha Corp
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    United States
                  </p>
                </div>
              </div>

              <div className="flex gap-8 mb-5">
                <div>
                  <p className="text-2xl font-bold">$25/hr</p>
                  <p className="text-xs text-[#6B7280]">Hourly rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">32 hrs</p>
                  <p className="text-xs text-[#6B7280]">This week</p>
                </div>
              </div>

              <div className="bg-[#F7FAFC] rounded-lg p-4 mb-5">
                <p className="text-xs text-[#6B7280] mb-1">Current work</p>
                <p className="text-sm font-medium text-[#1A1D23]">
                  React dashboard UI improvements
                </p>
              </div>

              <button className="w-full border-2 border-[#1B365D] text-[#1B365D] font-semibold py-3 rounded-lg hover:bg-[#1B365D] hover:text-white">
                View contract
              </button>
            </div>

            {/* INFO CARD */}
            <div className="border border-[#E2E8F0] rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <p className="font-bold text-[#1A1D23] mb-2 text-lg">
                Pro tip
              </p>
              <p className="text-sm text-[#6B7280]">
                Freelancers with active proposals are 3x more likely to get hired.
              </p>
            </div>
          </div>
        </section>

        {/* RECOMMENDED JOBS */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-[#1A1D23] text-2xl">
              Jobs recommended for you
            </h3>

            <button
              onClick={() => router.push("/search-and-discovery")}
              className="text-[#FF6B35] text-sm font-semibold hover:text-[#E5602F] flex items-center gap-2"
            >
              View all jobs
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {jobsLoading && (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border border-[#E2E8F0] rounded-xl p-5 bg-white shadow-sm animate-pulse"
                  >
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
                    <div className="h-6 bg-gray-100 rounded-full w-20 mb-4" />
                    <div className="h-10 bg-gray-100 rounded-lg w-full" />
                  </div>
                ))}
              </>
            )}
            {!jobsLoading && jobsError && (
              <div className="col-span-full p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                {jobsError}
              </div>
            )}
            {!jobsLoading && !jobsError && recommendedJobs.length === 0 && (
              <div className="col-span-full p-4 bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl text-[#6B7280] text-sm">
                No recommended jobs right now. Try &quot;View all jobs&quot; to browse.
              </div>
            )}
            {!jobsLoading && recommendedJobs.map((job) => (
              <div
                key={job.id ?? job.title}
                className="border border-[#E2E8F0] rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <p className="font-semibold text-[#1A1D23] mb-2">
                  {job.title}
                </p>
                <p className="text-sm text-[#6B7280] mb-4">
                  Budget: {job.budget}
                </p>
                <span className="inline-block text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full mb-4">
                  {job.level}
                </span>

                <button
                  type="button"
                  onClick={() => setProposalJob(job)}
                  className="w-full border-2 border-[#1B365D] text-[#1B365D] font-semibold text-sm py-2.5 rounded-lg hover:bg-[#1B365D] hover:text-white"
                >
                  Apply now
                </button>
              </div>
            ))}
          </div>

          {proposalJob && (
            <SubmitProposalModal
              job={proposalJob}
              onClose={() => setProposalJob(null)}
              onBitUsed={handleBitUsed}
            />

          )}
        </section>

      </div>
    </div>
  );
}