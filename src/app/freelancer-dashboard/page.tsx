"use client";

import React, { use, useState, useEffect, useRef, Suspense } from "react";
import Header from "@/components/common/Header";
import { MapPin, Star, Briefcase, Clock, Crown, Zap } from "lucide-react";
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
// import ContactInfo from "./components/SettingsSection/ContactInfo";
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
const PLAN_CONFIG = {
  Basic: {
    icon: Star,
    gradient: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
  },
  Plus: {
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
  },
  Premium: {
    icon: Crown,
    gradient: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
  },
};

// ✅ Inner component — useSearchParams 
function FreelancerDashboardInner({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { data: responseData, isLoading } = useProfileDetails(userId as string);
  const freelancer = responseData?.profile || {};
 
  const name = session?.user.name || "user"
  const [currentPlan, setCurrentPlan] = useState<string>('Basic');
  const [pendingInvitations, setPendingInvitations] = useState(4);
 

  const activeSection = searchParams.get('view') || 'overview';

  const isSettingsOpen = activeSection.startsWith('settings-');
  const isAnySettingsActive = activeSection.startsWith('settings-');

  useEffect(() => {
    const savedPlan = localStorage.getItem('freelancerMembershipPlan');
    if (savedPlan) setCurrentPlan(savedPlan);
  }, []);

  const planConfig = PLAN_CONFIG[currentPlan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG['Basic'];
  const PlanIcon = planConfig.icon;

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

  const handleMembershipClick = () => {
    router.push('/freelancer-membership');
  };



  const renderContent = () => {
    switch (activeSection) {
      case "overview": return <OverviewSection />;
      case "current": return <CurrentJobsSection />;
      case "completed": return <CompletedJobsSection />;
      case "bidInsights": return <BidInsightsSection />;
      case "profile": return <Profile />;
      case "invitations": return <InvitationsSection />;
      case "settings-profile": return <Settings />;
      case "settings-withdrawals": return <Withdrawals />;
      case "settings-membership": return <MembershipConnects />;
      case "settings-contact": return <ContactInfo />;
      case "settings-transactions": return <Transactions />;
      default: return <OverviewSection />;
    }
  };
  // Bits state
  const [bitsRemaining, setBitsRemaining] = useState<number | null>(null);
  const [bitsTotal, setBitsTotal] = useState<number | null>(null);
  const [planLabel, setPlanLabel] = useState<string>('Free');

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        // Load from localStorage first
        const storedRemaining = localStorage.getItem('freelancerBitsRemaining');
        const storedTotal = localStorage.getItem('freelancerBitsTotal');
        const storedPlan = localStorage.getItem('freelancerMembershipPlan');

        if (storedRemaining !== null) setBitsRemaining(Number(storedRemaining));
        if (storedTotal !== null) setBitsTotal(Number(storedTotal));
        if (storedPlan) setPlanLabel(storedPlan);

        // Fetch from server
        const response = await fetch('/api/freelancer/membership/status');
        const data = await response.json();
        if (data.success) {
          setBitsRemaining(data.subscription.bitsRemaining);
          setBitsTotal(data.subscription.bitsTotal);
          setPlanLabel(data.subscription.planLabel);
        }
      } catch (error) {
        console.error('Error fetching membership:', error);
      }
    };

    fetchMembership();
  }, []);


  if (isLoading) return (

    <CardSkeleton view="grid" count={6} />

  );
  return (
    <div className="flex flex-col min-h-screen mt-12">
      <Header />

      <main className="flex-1 bg-[#FAFBFC] text-[#1A1D23] font-sans">
        <div className="flex min-h-[calc(100vh-4rem)]">

          {/* LEFT SIDEBAR */}
          <aside className="w-80 bg-white border-r border-[#E2E8F0] flex flex-col shadow-sm sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">

            {/* Profile Section */}
            <div className="p-6 border-b border-[#E2E8F0]">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  {freelancer.image ? (<img
                    src={freelancer.image}
                    alt={freelancer.name}
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

                {/* Membership Badge */}
                <div
                  onClick={handleMembershipClick}
                  className={`w-full mb-4 p-4 rounded-xl border ${planConfig.borderColor} ${planConfig.bgColor} cursor-pointer hover:opacity-90 transition`}
                >
                  {/* Top Section */}
                  <div className="flex items-center justify-between">

                    {/* Left */}
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-r ${planConfig.gradient} p-2 rounded-lg`}>
                        <PlanIcon className="w-4 h-4 text-white" />
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Current Plan</p>
                        <p className={`text-sm font-semibold ${planConfig.textColor}`}>
                          {planLabel}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMembershipClick();
                      }}
                      className="text-xs px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium"
                    >
                      Upgrade
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="my-3 border-t border-gray-200"></div>

                  {/* Bottom Section */}
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-xl">
                      🪙
                    </span>

                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-bold text-[#1A1D23]">
                        {bitsRemaining !== null ? bitsRemaining : '—'}
                      </span>
                      {bitsTotal !== null && (
                        <span className="text-sm text-gray-500">
                          / {bitsTotal} Bids
                        </span>
                      )}
                    </div>
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