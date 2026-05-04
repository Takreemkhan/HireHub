"use client";

import React, { use, useState, useEffect, useRef, Suspense } from "react";
import Header from "@/components/common/Header";
import { MapPin, Star, Briefcase, Clock, PanelLeft, X, Video, ShoppingCart, CheckCircle, AlertCircle } from "lucide-react";
import Settings from "./settings/page";
import CurrentJobsSection from "./components/CurrentJobsSection";
import CompletedJobsSection from "./components/CompletedJobsSection";
import BidInsightsSection from "./components/BidInsightsSection";
import FooterSection from "@/app/homepage/components/FooterSection";
import OverviewSection from "./components/OverviewSection";
import { useRouter, useSearchParams } from "next/navigation";
import Profile from "./components/Profile";
import InvitationsSection from "./components/InvitationsSection";
import Navbar from "../client/components/navbar";

// Settings components
import ContactInfo from '@/components/common/Contacts/ContactInfo';
import MembershipConnects from "./components/SettingsSection/MembershipConnects";
import Transactions from "./components/SettingsSection/Transactions";
import Withdrawals from "./components/SettingsSection/Withdrawals";
import { useProfileDetails } from "../hook/useProfile";
import { useSession } from "next-auth/react";
import CardSkeleton from "@/components/Loader/Loader";
const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getInitialsColor = (name: string) => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-yellow-500',
    'bg-teal-500',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
// Video plan accent colors
const VIDEO_PLAN_COLORS: Record<string, string> = {
  basic: '#2E5984',
  pro: '#FF6B35',
  elite: '#1B365D',
};

// ✅ Inner component — useSearchParams 
function FreelancerDashboardInner({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: session, status: sessionStatus } = useSession();
  const userId = session?.user?.id;
  const { data: responseData, isLoading: profileLoading } = useProfileDetails(userId as string);
  const isLoading = sessionStatus === "loading" || sessionStatus === "unauthenticated" || profileLoading;
  const freelancer = responseData?.profile || {};

  const name = freelancer.name || session?.user?.name || "user";
  const [sidebarImage, setSidebarImage] = useState<string | null>(null);
  const userImage = sidebarImage || freelancer.profileImage || freelancer.image || session?.user?.image || freelancer.profilePic;
  const [pendingInvitations, setPendingInvitations] = useState(4);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Resume Video Plan state
  const [videoSub, setVideoSub] = useState<{
    isPlanActive: boolean; planKey: string | null; planLabel: string | null;
    maxVideos: number; planExpiry: string | null;
  }>({ isPlanActive: false, planKey: null, planLabel: null, maxVideos: 0, planExpiry: null });

  // Bids state
  const [bidsRemaining, setBidsRemaining] = useState<number | null>(null);
  const [bidsTotal, setBidsTotal] = useState<number | null>(null);


  const activeSection = searchParams.get('view') || 'overview';

  const isSettingsOpen = activeSection.startsWith('settings-');
  const isAnySettingsActive = activeSection.startsWith('settings-');


  const sidebarItems = [
    { label: "Overview", value: "overview" },
    { label: "Completed Jobs", value: "completed" },
    { label: "Current Jobs", value: "current" },
    { label: "Bid Insights", value: "bidInsights" },
    { label: "Profile", value: "profile" },
    { label: "Invitations", value: "invitations", badge: pendingInvitations },
  ];

  const settingsItems = [
    { label: "Withdrawals", value: "settings-withdrawals" },
    { label: "Membership and Connects", value: "settings-membership" },
    { label: "Contact Info", value: "settings-contact" },
    { label: "Transactions", value: "settings-transactions" },
    { label: "Profile Settings", value: "settings-profile" },
  ];


  const handleSectionChange = (section: string) => {
    if (section === "invitations") setPendingInvitations(0);
    router.push(`/freelancer-dashboard?view=${section}`);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSettingsToggle = () => {
    if (!isSettingsOpen) {
      router.push(`/freelancer-dashboard/${id}?view=settings-withdrawals`);
    } else {
      router.push(`/freelancer-dashboard/${id}?view=overview`);
    }
  };

  const handleProfileClick = () => {
    router.push('/user-profile/' + id);
  };

  const handleMembershipClick = () => { router.push('/freelancer-membership'); };
  const handleVideoPlansClick = () => { router.push('/freelancer-plans'); };




  const renderContent = () => {
    switch (activeSection) {
      case "overview": return <OverviewSection />;
      case "current": return <CurrentJobsSection />;
      case "completed": return <CompletedJobsSection />;
      case "bidInsights": return <BidInsightsSection />;
      case "profile": return <Profile onProfileImageChange={(url) => setSidebarImage(url)} />;
      case "invitations": return <InvitationsSection />;
      case "settings-profile": return <Settings />;
      case "settings-withdrawals": return <Withdrawals />;
      case "settings-membership": return <MembershipConnects />;
      case "settings-contact": return <ContactInfo />;
      case "settings-transactions": return <Transactions />;
      default: return <OverviewSection />;
    }
  };
  // Fetch bids balance + video plan on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Bids
        const storedRemaining = localStorage.getItem('freelancerBitsRemaining');
        const storedTotal = localStorage.getItem('freelancerBitsTotal');
        if (storedRemaining !== null) setBidsRemaining(Number(storedRemaining));
        if (storedTotal !== null) setBidsTotal(Number(storedTotal));

        const [bidsRes, plansRes] = await Promise.all([
          fetch('/api/freelancer/membership/status', { credentials: 'include' }),
          fetch('/api/freelancer/plans', { credentials: 'include' }),
        ]);
        const bidsData = await bidsRes.json();
        if (bidsData.success) {
          setBidsRemaining(bidsData.bidsRemaining ?? bidsData.subscription?.bitsRemaining ?? 0);
          setBidsTotal(bidsData.bidsTotal ?? bidsData.subscription?.bitsTotal ?? 0);
        }
        const plansData = await plansRes.json();
        if (plansData.success) setVideoSub(plansData.subscription);
      } catch (e) {
        console.error('Dashboard data fetch error:', e);
      }
    };
    fetchData();
  }, []);


  if (isLoading) return (
    <div className="flex flex-col min-h-screen mt-12 bg-[#FAFBFC]">
      <Header />
      <div className="flex flex-1 min-h-[calc(100vh-4rem)] relative">
        <aside className="w-72 sm:w-80 bg-white border-r border-[#E2E8F0] flex flex-col shadow-sm h-[calc(100vh-4rem)] overflow-hidden z-40 fixed top-16 left-0 lg:sticky lg:top-16 lg:shrink-0 hidden lg:flex">
          <div className="p-6 border-b border-[#E2E8F0] animate-pulse">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gray-200 mb-4" />
              <div className="w-32 h-5 bg-gray-200 rounded mb-2" />
              <div className="w-24 h-4 bg-gray-200 rounded mb-4" />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-4 bg-gray-200 rounded-full" />)}
              </div>

              <div className="w-full grid grid-cols-2 gap-4 mb-4">
                <div className="bg-[#F7FAFC] rounded-lg p-3 h-16 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-4 bg-gray-200 rounded" />
                  <div className="w-16 h-3 bg-gray-200 rounded" />
                </div>
                <div className="bg-[#F7FAFC] rounded-lg p-3 h-16 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-4 bg-gray-200 rounded" />
                  <div className="w-16 h-3 bg-gray-200 rounded" />
                </div>
              </div>

              <div className="w-full h-20 rounded-xl bg-gray-100 mb-3" />
              <div className="w-full h-20 rounded-xl bg-gray-100 mb-4" />
            </div>
          </div>

          <div className="p-4 flex-1 animate-pulse">
            <div className="space-y-6 mt-2 ml-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area Shimmer Loader */}
        <main className="flex-1 p-6 md:p-8 lg:p-10 w-full overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-6" />
            <CardSkeleton view="grid" count={6} />
          </div>
        </main>
      </div>
    </div>
  );
  return (
    <div className="flex flex-col min-h-screen mt-12">
      <Header />

      <main className="flex-1 bg-[#FAFBFC] text-[#1A1D23] font-sans">
        {/* Mobile Sidebar Toggle Button */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="lg:hidden fixed bottom-6 left-4 z-50 bg-[#1B365D] text-white p-3 rounded-full shadow-xl border-2 border-white"
          aria-label="Toggle sidebar"
        >
          {isMobileSidebarOpen
            ? <X className="w-5 h-5" />
            : <PanelLeft className="w-5 h-5" />}
        </button>
        <div className="flex min-h-[calc(100vh-4rem)] relative">

          {/* Mobile overlay */}
          {isMobileSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* LEFT SIDEBAR */}
          <aside className={`w-72 sm:w-80 bg-white border-r border-[#E2E8F0] flex flex-col shadow-sm h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden z-40 transition-transform duration-300
            fixed top-16 left-0 lg:sticky lg:top-16 lg:shrink-0
            ${isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>

            {/* Profile Section */}
            <div className="p-6 border-b border-[#E2E8F0]">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  {userImage ? (<img
                    src={userImage}
                    alt={freelancer.name || name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#E2E8F0] cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={handleProfileClick}
                  />) : (<div
                    className={`w-20 h-20 rounded-full ${getInitialsColor(name)} flex items-center justify-center text-white text-2xl font-bold shadow-md`}
                  >
                    {getInitials(name)}
                  </div>)}


                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <h2 className="text-xl font-bold text-[#1A1D23] mb-1">
                  {name}
                </h2>

                <p className="text-sm text-[#6B7280] flex items-center justify-center gap-1 mb-3">
                  <MapPin size={14} />
                  {freelancer.location}
                </p>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Stats */}
                <div className="w-full grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#F7FAFC] rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Briefcase size={16} className="text-[#1B365D]" />
                      <p className="text-2xl font-bold text-[#1A1D23]">
                        {freelancer.completedJobs || 0}
                      </p>
                    </div>
                    <p className="text-xs text-[#6B7280]">Total Jobs</p>
                  </div>

                  <div className="bg-[#F7FAFC] rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Clock size={16} className="text-[#1B365D]" />
                      <p className="text-2xl font-bold text-[#1A1D23]">
                        {freelancer.hourlyRate || '0'}
                      </p>
                    </div>
                    <p className="text-xs text-[#6B7280]">Total Hours</p>
                  </div>
                </div>

                {/* ── Resume Video Plan Widget ─────────────────────────── */}
                <div
                  onClick={handleVideoPlansClick}
                  className="w-full mb-3 p-4 rounded-xl border border-[#E2E8F0] bg-white cursor-pointer hover:border-[#FF6B35] hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: videoSub.isPlanActive ? (VIDEO_PLAN_COLORS[videoSub.planKey ?? 'basic'] ?? '#FF6B35') : '#9CA3AF' }}
                      >
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Resume Video</p>
                        <p className="text-sm font-semibold text-[#1A1D23]">
                          {videoSub.isPlanActive ? `${videoSub.planLabel} Plan` : 'No Active Plan'}
                        </p>
                      </div>
                    </div>
                    {videoSub.isPlanActive
                      ? <CheckCircle className="w-4 h-4 text-green-500" />
                      : <AlertCircle className="w-4 h-4 text-orange-400" />}
                  </div>

                  {videoSub.isPlanActive && videoSub.planExpiry && (
                    <p className="text-xs text-gray-400 mb-2">
                      {videoSub.maxVideos} video{videoSub.maxVideos !== 1 ? 's' : ''} ·
                      Expires {new Date(videoSub.planExpiry).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}

                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                    style={{
                      backgroundColor: videoSub.isPlanActive ? '#dcfce7' : '#fff7ed',
                      color: videoSub.isPlanActive ? '#16a34a' : '#ea580c',
                    }}
                  >
                    {videoSub.isPlanActive ? '✓ Active' : 'Upgrade Plan →'}
                  </span>
                </div>

                {/* ── Bids Balance Widget ──────────────────────────────── */}
                <div
                  onClick={handleMembershipClick}
                  className="w-full mb-4 p-4 rounded-xl border border-[#E2E8F0] bg-white cursor-pointer hover:border-[#FF6B35] hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🪙</span>
                      <div>
                        <p className="text-xs text-gray-400">Bids Balance</p>
                        <p className="text-sm font-semibold text-[#1A1D23]">
                          {bidsRemaining !== null ? `${bidsRemaining} remaining` : 'Loading…'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMembershipClick(); }}
                      className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#FF6B35]/10 text-[#FF6B35] hover:bg-[#FF6B35]/20 font-semibold transition"
                    >
                      <ShoppingCart className="w-3 h-3" /> Buy
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div ref={contentRef} className="flex-1 bg-[#FAFBFC] overflow-y-auto">
            <Navbar
              activeSection={activeSection}
              isSettingsOpen={isSettingsOpen}
              isAnySettingsActive={isAnySettingsActive}
              sidebarItems={sidebarItems}
              settingsItems={settingsItems}
              handleSectionChange={handleSectionChange}
              handleSettingsToggle={handleSettingsToggle}
            />
            <div className="min-h-full">
              {renderContent()}
            </div>
          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}

// ✅ Suspense wrapper — useSearchParams
export default function FreelancerDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    }>
      <FreelancerDashboardInner id={id} />
    </Suspense>
  );
}