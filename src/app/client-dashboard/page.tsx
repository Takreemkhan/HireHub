'use client';

import React, { useRef, useEffect, useState, Suspense } from 'react';
import Header from '@/components/common/Header';
import FooterSection from '@/app/homepage/components/FooterSection';
import { MapPin, Star, Briefcase, Clock, Plus, Crown, Zap, Loader } from 'lucide-react';
import SettingsSection from './settings/page';
import DraftSection from './components/DraftSection';
import OverviewSection from './components/OverviewSection';
import CurrentJobsSection from './components/CurrentJobsSection';
import CompletedJobsSection from './components/CompletedJobsSection';
import { useRouter, useSearchParams } from 'next/navigation';

// Import settings components
import ContactInfo from '@/components/common/Contacts/ContactInfo';
import MembershipConnects from './components/SettingsSection/MembershipConnects';
import Transactions from './components/SettingsSection/Transactions';
import PayFreelancers from './components/SettingsSection/PayFreelancers';
import Navbar from '../client/components/navbar';
import { useCurrentJobsClients, useProfileDetails, useGetContactsInfo } from '../hook/useProfile';
import { useSession } from 'next-auth/react';
import CardSkeleton from '@/components/Loader/Loader';

const mockClient = {
  id: 1,
  name: 'Sarah Chen 1',
  image: 'https://img.rocket.new/generatedImages/rocket_gen_img_10d60e496-1763295319842.png',
  location: 'San Francisco, CA',
  completedProjects: 89,
  totalHours: '1,240',
  rating: 5,
};

const PLAN_CONFIG = {
  'Free': {
    icon: Star,
    gradient: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    borderColor: 'border-gray-300',
  },
  'Business Plus': {
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-300',
  },
  'Enterprise': {
    icon: Crown,
    gradient: 'from-purple-500 to-indigo-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-300',
  },
};


function ClientDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentPlan, setCurrentPlan] = useState<string>('Basic');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const mockClients = session?.user

  // const { data: responseData, isLoading } = useProfileDetails(userId as string);
  // const mockClient  = responseData?.profile || {} ;
  // console.log("mockclient",responseData)

  const { data: contactData, isLoading: contactLoading, isError: contactError } = useGetContactsInfo({
    userId: userId || "",
  });
  const clientCity = contactData?.contact?.location?.city;
  const activeSection = searchParams.get('view') || 'overview';
  const isSettingsOpen = activeSection.startsWith('settings-');
  const isAnySettingsActive = activeSection.startsWith('settings-');

  useEffect(() => {
    const savedPlan = localStorage.getItem('clientMembershipPlan');
    if (savedPlan) {
      setCurrentPlan(savedPlan);
    }
  }, []);

  useEffect(() => {
    if (searchParams.get('success') === 'job_posted') {
      setShowSuccessToast(true);
      router.replace('/client-dashboard');
      setTimeout(() => setShowSuccessToast(false), 5000);
    }
  }, [searchParams, router]);

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

  const sidebarItems = [
    { label: 'Overview', value: 'overview' },
    { label: 'Completed Jobs', value: 'completed' },
    { label: 'Current Jobs', value: 'current' },
    { label: 'Draft', value: 'draft' },
  ];

  const settingsItems = [
    { label: 'Pay Freelancers', value: 'settings-pay' },
    { label: 'Membership and Connects', value: 'settings-membership' },
    { label: 'Contact Info', value: 'settings-contact' },
    { label: 'Transactions', value: 'settings-transactions' },
    { label: 'Profile Settings', value: 'settings-profile' },
  ];

  const planConfig = PLAN_CONFIG[currentPlan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG['Free'];
  const PlanIcon = planConfig.icon;


  const handleSectionChange = (section: string) => {
    router.push(`/client-dashboard?view=${section}`);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };


  const handleSettingsToggle = () => {
    if (!isSettingsOpen) {
      router.push(`/client-dashboard?view=settings-pay`);
    } else {
      router.push(`/client-dashboard?view=overview`);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'draft':
        return <DraftSection />;
      case 'current':
        return <CurrentJobsSection />;
      case 'completed':
        return <CompletedJobsSection />;
      case 'settings-profile':
        return <SettingsSection />;
      case 'settings-pay':
        return <PayFreelancers />;
      case 'settings-membership':
        return <MembershipConnects />;
      case 'settings-contact':
        return <ContactInfo />;
      case 'settings-transactions':
        return <Transactions />;
      default:
        return <OverviewSection />;
    }
  };

  const handlePostJob = () => {
    router.push('/post-page');
  };

  const handleMembershipClick = () => {
    router.push('/client-membership');
  };

  // Bits state (mirrors freelancer sidebar)
  const [bitsRemaining, setBitsRemaining] = useState<number | null>(null);
  const [bitsTotal, setBitsTotal] = useState<number | null>(null);
  const [planLabel, setPlanLabel] = useState<string>('Free');

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const storedRemaining = localStorage.getItem('clientBitsRemaining');
        const storedTotal = localStorage.getItem('clientBitsTotal');
        const storedPlan = localStorage.getItem('clientMembershipPlan');
        if (storedRemaining !== null) setBitsRemaining(Number(storedRemaining));
        if (storedTotal !== null) setBitsTotal(Number(storedTotal));
        if (storedPlan) setPlanLabel(storedPlan);

        const response = await fetch('/api/client/membership/status');
        const data = await response.json();
        if (data.success) {
          setBitsRemaining(data.subscription.bitsRemaining);
          setBitsTotal(data.subscription.bitsTotal);
          setPlanLabel(data.subscription.planLabel);
          // keep currentPlan badge in sync
          setCurrentPlan(data.subscription.planLabel);
        }
      } catch (error) {
        console.error('Error fetching client membership:', error);
      }
    };
    fetchMembership();
  }, []);

  const { data: currentJobs, isLoading, error } = useCurrentJobsClients();

  const currentjobs = currentJobs?.jobs

  // if (isLoading) return <Loader />
  // if (isLoading) return <CardSkeleton />
  const displayName = mockClients?.name || mockClient?.name || "User";

  return (
    <div className="flex flex-col min-h-screen mt-12">
      {/* ── SUCCESS TOAST ── */}
      {showSuccessToast && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="bg-emerald-50 border border-emerald-200 shadow-xl rounded-xl p-4 flex items-start gap-4 max-w-sm">
            <div className="bg-emerald-500 rounded-full p-1 5 flex-shrink-0 mt-0.5 text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-emerald-900 font-bold mb-0.5 text-sm uppercase tracking-wide">Job Posted Successfully!</h4>
              <p className="text-emerald-700 text-sm">Your new job is now live. Freelancers can start applying immediately.</p>
            </div>
            <button onClick={() => setShowSuccessToast(false)} className="text-emerald-400 hover:text-emerald-600 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <Header />

      <main className="flex-1 bg-[#FAFBFC] text-[#1A1D23] font-sans">
        <div className="flex min-h-[calc(100vh-4rem)]">

          {/* LEFT SIDEBAR */}
          {
            isLoading ? <CardSkeleton count={1} /> : (
              <aside className="w-80 bg-white border-r border-[#E2E8F0] flex flex-col shadow-sm sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">

                {/* Profile Section */}
                <div className="p-6 border-b border-[#E2E8F0]">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">

                      <div
                        className={`w-20 h-20 rounded-full ${getInitialsColor(displayName)} flex items-center justify-center text-white text-2xl font-bold shadow-md`}
                      >
                        {getInitials(displayName)}
                      </div>

                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    {/* Initials Circle */}
                    {/* <div className="relative mb-4">
                  <div className={`w-20 h-20 rounded-full ${getInitialsColor(mockClient.name)} flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
                    {getInitials(mockClients?.name || "")}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                </div> */}

                    <h2 className="text-xl font-bold text-[#1A1D23] mb-1">
                      {mockClients?.name}
                    </h2>

                    {
                      clientCity && (
                        <p className="text-sm text-[#6B7280] flex items-center justify-center gap-1 mb-3">
                          <MapPin size={14} />
                          {clientCity}
                        </p>
                      )
                    }
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(mockClient.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Stats Cards */}
                    <div className="w-full grid grid-cols-1 gap-4 mb-4">
                      <div className="bg-[#F7FAFC] rounded-lg p-3">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Briefcase size={16} className="text-[#1B365D]" />
                          <p className="text-2xl font-bold text-[#1A1D23]">
                            {/* {mockClient.completedProjects} */}
                            {currentJobs?.stats.totalSidebar || 0}
                          </p>
                        </div>
                        <p className="text-xs text-[#6B7280]">Total Jobs</p>
                      </div>

                      {/* <div className="bg-[#F7FAFC] rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Clock size={16} className="text-[#1B365D]" />
                      <p className="text-2xl font-bold text-[#1A1D23]">
                        {mockClient.totalHours}
                      </p>
                    </div>
                    <p className="text-xs text-[#6B7280]">Total Hours</p>
                  </div> */}
                    </div>

                    {/* Membership Badge — mirrors freelancer sidebar */}
                    <div
                      onClick={handleMembershipClick}
                      className={`w-full mb-4 p-4 rounded-xl border ${planConfig.borderColor} ${planConfig.bgColor} cursor-pointer hover:opacity-90 transition`}
                    >
                      {/* Top row: plan + upgrade */}
                      <div className="flex items-center justify-between">
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
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMembershipClick(); }}
                          className="text-xs px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium"
                        >
                          Upgrade
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="my-3 border-t border-gray-200" />

                      {/* Bottom row: bids remaining */}
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

                    {/* Post Job Button */}
                    <button
                      type="button"
                      onClick={handlePostJob}
                      className="w-full py-3 px-4 rounded-lg bg-[#1B365D] text-white font-semibold hover:bg-[#102542] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Plus size={18} />
                      Post Job
                    </button>
                  </div>
                </div>
              </aside>
            )
          }

          {/* MAIN CONTENT AREA */}
          <div
            ref={contentRef}
            className="flex-1 bg-[#FAFBFC] overflow-y-auto"
          >
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


export default function ClientDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    }>
      <ClientDashboardInner />
    </Suspense>
  );
}