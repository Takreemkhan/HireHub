'use client';

import { useRouter } from "next/navigation";
import { usegetAllFreelancerProfiles, useGetClientDrafts } from "@/app/hook/useProfile";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import CardSkeleton from "@/components/Loader/Loader";
export default function OverviewSection() {
  const router = useRouter();

  const { data: freelancerProfiles, isLoading, error } = usegetAllFreelancerProfiles();
    const { data: drafts, isLoading: draftsLoading, error: draftsError } = useGetClientDrafts();
  const freelancerProfilesData = freelancerProfiles?.profiles?.slice(0, 4) || [];

  // ── Bits widget (mirrors freelancer Bids widget 1-to-1) ──────────────────
  const [bitsRemaining, setBitsRemaining] = useState<number | null>(null);
  const [bitsTotal, setBitsTotal] = useState<number | null>(null);
  const [planLabel, setPlanLabel] = useState<string>('Free');
const draftsData = drafts?.drafts?.slice(0, 1) || [];
  useEffect(() => {
    const fetchMembershipStatus = async () => {
      try {
        const storedRemaining = localStorage.getItem('clientBitsRemaining');
        const storedTotal = localStorage.getItem('clientBitsTotal');
        const storedPlan = localStorage.getItem('clientMembershipPlan');

        if (storedRemaining !== null) setBitsRemaining(Number(storedRemaining));
        if (storedTotal !== null) setBitsTotal(Number(storedTotal));
        if (storedPlan) setPlanLabel(storedPlan);

        const res = await fetch('/api/client/membership/status');
        const data = await res.json();
        console.log("client memvership status", data)
        if (data.success) {
          setBitsRemaining(data.subscription.bitsRemaining);
          setBitsTotal(data.subscription.bitsTotal);
          setPlanLabel(data.subscription.planLabel);


          localStorage.setItem('clientBitsRemaining', String(data.subscription.bitsRemaining));
          localStorage.setItem('clientBitsTotal', String(data.subscription.bitsTotal));
          localStorage.setItem('clientMembershipPlan', data.subscription.planLabel);
        }
      } catch (error) {
        console.log('Error fetching membership status:', error);
      }
    };

    fetchMembershipStatus();
  }, []);
  // ─────────────────────────────────────────────────────────────────────────

  const gradientColors = [
    'from-purple-400 to-purple-600',
    'from-green-400 to-green-600',
    'from-orange-400 to-orange-600',
    'from-pink-400 to-pink-600',
    'from-blue-400 to-blue-600',
    'from-red-400 to-red-600',
    'from-teal-400 to-teal-600',
    'from-indigo-400 to-indigo-600',
  ];

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // if (isLoading) return <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />;
  // if (isLoading) return <div className="flex items-center justify-center h-screen">
  //   <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
  // </div>
  // if (isLoading) return <div className="flex items-center justify-center mt-[-60px] h-screen">
  //   <DotLottieReact
  //     style={{ width: '150px', height: '150px' }}
  //     src="https://lottie.host/3c9fc0bd-f393-4b0f-af04-f771f6a8fba5/kMVosI89qk.lottie"
  //     loop
  //     autoplay
  //   />
  // </div>
  if (isLoading) return (

    <CardSkeleton view="grid" count={6} />

  );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-[#FAFBFC] p-8">
      <div className="max-w-7xl mx-auto space-y-8 pb-8">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-[#1A1D23] text-3xl">Welcome back 👋</h2>
        </div>

        {/* ── BITS WIDGET (mirrors freelancer Bits widget 1-to-1) ────────── */}
        {/* <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              {bitsRemaining !== null && bitsRemaining <= 3 && bitsRemaining > 0 && (
                <p className="text-xs text-orange-500 font-semibold mt-1">⚠ Running low on Bids!</p>
              )}
              {bitsRemaining !== null && bitsRemaining === 0 && (
                <p className="text-xs text-red-500 font-semibold mt-1">🚫 No Bids left – upgrade your plan</p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <p className="text-xs text-[#6B7280]">1 Bid = 1 proposal view</p>
            <button
              onClick={() => router.push('/client-membership')}
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-sm"
            >
              {bitsRemaining === 0 ? 'Get More Bids →' : 'Manage Plan →'}
            </button>
          </div>
        </div> */}
        {/* ──────────────────────────────────────────────────────────────── */}

        {/* OVERVIEW */}
        <section>
          <h3 className="font-semibold text-[#1A1D23] mb-6 text-2xl">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {
              draftsData.map((draft: any) => {
                return <div key={draft._id} className="border border-[#E2E8F0] rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-blue-600 mb-1 uppercase tracking-wide">Draft job post</p>
                      <p className="font-semibold text-[#1A1D23] text-lg mb-2">
                        {draft.subCategory}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#6B7280] mb-5">Add your project&apos;s scope to continue</p>
                  <button
                    type="button"
                    className="w-full border-2 border-[#1B365D] text-[#1B365D] font-semibold text-sm py-3 rounded-lg hover:bg-[#1B365D] hover:text-white transition-all duration-200"
                    onClick={() => router.push(`/client-dashboard?view=draft`)}
                  >
                    view
                  </button>
                </div>
              })
            }

            <div
              onClick={() => router.push("/post-page")}
              className="border-2 border-dashed border-[#E2E8F0] rounded-xl bg-white hover:bg-[#F7FAFC] hover:border-[#FF6B35] transition-all duration-200 cursor-pointer flex items-center justify-center text-base font-semibold text-[#FF6B35] min-h-[200px] group"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-orange-50 mx-auto mb-3 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <svg className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span>Post a job</span>
              </div>
            </div>
          </div>
        </section>

        {/* WORK AGAIN */}
        <section>
          <h3 className="font-semibold text-[#1A1D23] mb-6 text-2xl">Work together again on something new</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-[#E2E8F0] rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">JE</div>
                <div>
                  <p className="font-semibold text-[#1A1D23] text-base">Jackstone E.</p>
                  <p className="text-sm text-[#6B7280]">Kenya</p>
                </div>
              </div>
              <div className="flex gap-8 mb-5">
                <div><p className="text-2xl font-bold text-[#1A1D23]">50</p><p className="text-xs text-[#6B7280]">Jobs</p></div>
                <div><p className="text-2xl font-bold text-[#1A1D23]">$30/hr</p><p className="text-xs text-[#6B7280]">Rate</p></div>
              </div>
              <div className="bg-[#F7FAFC] rounded-lg p-4 mb-5">
                <p className="text-xs text-[#6B7280] mb-1">Last contract together:</p>
                <p className="text-sm text-[#1A1D23] font-medium">Need a content writer who can write product title and description.</p>
              </div>
              <button type="button" className="w-full border-2 border-[#1B365D] text-[#1B365D] font-semibold text-sm py-3 rounded-lg hover:bg-[#1B365D] hover:text-white transition-all duration-200">
                Rehire
              </button>
            </div>

            <div className="border border-[#E2E8F0] rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#1B365D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-bold text-[#1A1D23] mb-3 text-lg">Did you know?</p>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                You can start multiple contracts with the same freelancer. Rehire those you&apos;re already working with to kickstart new work.
              </p>
            </div>
          </div>
        </section>

        {/* PERSONALIZED TALENT */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-[#1A1D23] text-2xl">Personalized talent</h3>
            <button
              type="button"
              onClick={() => router.push("/freelancer-profiles")}
              className="text-[#FF6B35] text-sm font-semibold hover:text-[#E5602F] transition-colors flex items-center gap-2"
            >
              Browse talent
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {freelancerProfilesData.length === 0 ? (
            <div className="col-span-full text-center p-8 bg-white border border-[#E2E8F0] rounded-xl">
              <p className="text-[#6B7280]">No freelancer profiles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {freelancerProfilesData.map((profile: any, index: any) => {
                const name = profile.name || 'Anonymous';
                const initials = getInitials(name);
                const location = profile.location || 'Unknown';
                const hourlyRate = profile.hourlyRate;
                const rate = hourlyRate ? `$${hourlyRate}/hr` : 'Rate N/A';
                const skill = profile.skills?.length > 0 ? profile.skills.slice(0, 3).join(', ') : 'No skills';
                const gradient = gradientColors[index % gradientColors.length];

                return (
                  <div key={profile._id} className="border border-[#E2E8F0] rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm`}>
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1A1D23] text-sm">{name}</p>
                        <p className="text-xs text-[#6B7280]">{location}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#6B7280]">Rate</span>
                        <span className="font-semibold text-[#1A1D23]">{rate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-[#6B7280]">Skill</span>
                        <span className="text-sm text-[#1A1D23] truncate max-w-[120px]">{skill}</span>
                      </div>
                    </div>
                    <button type="button" className="w-full border-2 border-[#1B365D] text-[#1B365D] font-semibold text-xs py-2.5 rounded-lg hover:bg-[#1B365D] hover:text-white transition-all duration-200">
                      Invite to job
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}