"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import { MapPin, Star, Briefcase, Plus, PanelLeft, X, Building2, Loader2 } from "lucide-react";
import SettingsSection from "@/app/client-dashboard/settings/page";
import DraftSection from "@/app/client-dashboard/components/DraftSection";
import OverviewSection from "@/app/client-dashboard/components/OverviewSection";
import CurrentJobsSection from "@/app/client-dashboard/components/CurrentJobsSection";
import CompletedJobsSection from "@/app/client-dashboard/components/CompletedJobsSection";
import SavedFreelancersSection from "@/app/client-dashboard/components/SavedFreelancersSection";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import ContactInfo from "@/components/common/Contacts/ContactInfo";
import MembershipConnects from "@/app/client-dashboard/components/SettingsSection/MembershipConnects";
import Transactions from "@/app/client-dashboard/components/SettingsSection/Transactions";
import PayFreelancers from "@/app/client-dashboard/components/SettingsSection/PayFreelancers";
import Navbar from "@/app/client/components/navbar";
import { useCurrentJobsClients, useGetContactsInfo } from "@/app/hook/useProfile";
import { useSession } from "next-auth/react";
import CardSkeleton from "@/components/Loader/Loader";

// ─── Context to pass businessId to child components ─────────────────────────
import { createContext, useContext } from "react";

export const BusinessPageContext = createContext<{ businessId: string; businessName: string }>({
  businessId: "",
  businessName: "",
});

export const useBusinessPage = () => useContext(BusinessPageContext);

// ─── Inner dashboard ─────────────────────────────────────────────────────────

function BusinessDashboardInner() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  const businessId = params?.businessId as string;
  const activeSection = searchParams.get("view") || "overview";
  const isSettingsOpen = activeSection.startsWith("settings-");
  const isAnySettingsActive = activeSection.startsWith("settings-");

  const [businessPage, setBusinessPage] = useState<{ name: string; slug: string } | null>(null);
  const [bpLoading, setBpLoading] = useState(true);
  const [bpError, setBpError] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const userId = session?.user?.id;

  // Fetch business page info
  useEffect(() => {
    if (!businessId) return;
    setBpLoading(true);
    fetch(`/api/business-pages/${businessId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.businessPage) {
          setBusinessPage(d.businessPage);
        } else {
          setBpError(d.error || "Business page not found.");
        }
      })
      .catch(() => setBpError("Failed to load business page."))
      .finally(() => setBpLoading(false));
  }, [businessId]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) router.replace("/sign-in-page");
  }, [session, status, router]);

  // Success toast after posting a job
  useEffect(() => {
    if (searchParams.get("success") === "job_posted") {
      setShowSuccessToast(true);
      router.replace(`/business-dashboard/${businessId}`);
      setTimeout(() => setShowSuccessToast(false), 5000);
    }
  }, [searchParams, router, businessId]);

  const { data: contactData } = useGetContactsInfo({ userId: userId || "" });
  const clientCity = contactData?.contact?.location?.city;
  const { data: currentJobs, isLoading } = useCurrentJobsClients(businessId);

  const getInitials = (name?: string | null) => {
    if (!name) return "B";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getInitialsColor = (name: string) => {
    const colors = [
      "bg-blue-500", "bg-indigo-600", "bg-orange-500",
      "bg-teal-500", "bg-purple-600", "bg-rose-500",
    ];
    return colors[name.charCodeAt(0) % colors.length];
  };

  const sidebarItems = [
    { label: "Overview", value: "overview" },
    { label: "Saved Freelancers", value: "saved" },
    { label: "Completed Jobs", value: "completed" },
    { label: "Current Jobs", value: "current" },
    { label: "Draft", value: "draft" },
  ];

  const settingsItems = [
    { label: "Pay Freelancers", value: "settings-pay" },
    { label: "Membership and Connects", value: "settings-membership" },
    { label: "Contact Info", value: "settings-contact" },
    { label: "Transactions", value: "settings-transactions" },
    { label: "Profile Settings", value: "settings-profile" },
  ];

  const handleSectionChange = (section: string) => {
    router.push(`/business-dashboard/${businessId}?view=${section}`);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSettingsToggle = () => {
    if (!isSettingsOpen) {
      router.push(`/business-dashboard/${businessId}?view=settings-pay`);
    } else {
      router.push(`/business-dashboard/${businessId}?view=overview`);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview": return <OverviewSection />;
      case "saved": return <SavedFreelancersSection />;
      case "draft": return <DraftSection />;
      case "current": return <CurrentJobsSection />;
      case "completed": return <CompletedJobsSection />;
      case "settings-profile": return <SettingsSection />;
      case "settings-pay": return <PayFreelancers />;
      case "settings-membership": return <MembershipConnects />;
      case "settings-contact": return <ContactInfo />;
      case "settings-transactions": return <Transactions />;
      default: return <OverviewSection />;
    }
  };

  // Loading states
  if (status === "loading" || bpLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B365D]" />
      </div>
    );
  }

  if (bpError) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg mb-4">{bpError}</p>
          <button
            onClick={() => router.push("/freelancer-dashboard")}
            className="px-6 py-2 bg-[#1B365D] text-white rounded-lg"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const businessName = businessPage?.name || "Business";

  return (
    <BusinessPageContext.Provider value={{ businessId, businessName }}>
      <div className="flex flex-col min-h-screen mt-12">
        {/* SUCCESS TOAST */}
        {showSuccessToast && (
          <div className="fixed top-20 right-4 z-50 w-full max-w-sm animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="bg-emerald-50 border border-emerald-200 shadow-xl rounded-xl p-4 flex items-start gap-3">
              <div className="bg-emerald-500 rounded-full p-1 flex-shrink-0 mt-0.5 text-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-emerald-900 font-bold mb-0.5 text-sm">Job Posted Successfully!</h4>
                <p className="text-emerald-700 text-sm">Freelancers can start applying immediately.</p>
              </div>
              <button onClick={() => setShowSuccessToast(false)} className="text-emerald-400 hover:text-emerald-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <Header />

        <main className="flex-1 bg-[#FAFBFC] text-[#1A1D23] font-sans">
          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="lg:hidden fixed bottom-6 left-4 z-50 bg-[#1B365D] text-white p-3 rounded-full shadow-xl border-2 border-white"
            aria-label="Toggle sidebar"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
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
            {isLoading ? (
              <CardSkeleton count={1} />
            ) : (
              <aside
                className={`w-72 sm:w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden z-40 transition-transform duration-300
                  fixed top-16 left-0 lg:sticky lg:top-16 lg:shrink-0
                  ${isMobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`}
              >
                {/* ── Business identity header ─────────────────────────── */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col items-center text-center">
                    {/* Business avatar */}
                    <div className="relative mb-3">
                      <div className={`w-20 h-20 rounded-2xl ${getInitialsColor(businessName)} flex items-center justify-center text-white text-2xl font-bold shadow-sm border-2 border-white`}>
                        {getInitials(businessName)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white">
                        <Building2 className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-0.5">{businessName}</h2>
                    <p className="text-gray-500 text-xs font-medium mb-1">Business Page</p>
                    <p className="text-gray-400 text-xs">
                      Owner: {session?.user?.name || "You"}
                    </p>

                    {clientCity && (
                      <p className="text-gray-500 text-xs flex items-center justify-center gap-1 mt-1.5">
                        <MapPin size={12} className="text-gray-400" />
                        {clientCity}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="w-full mt-4 bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <div className="flex items-center justify-center gap-2">
                        <Briefcase size={16} className="text-orange-500" />
                        <p className="text-2xl font-bold text-gray-900">
                          {currentJobs?.stats?.totalSidebar || 0}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">Total Jobs</p>
                    </div>

                    {/* Post Job */}
                    <button
                      type="button"
                      onClick={() => router.push(`/post-page?businessId=${businessId}`)}
                      className="mt-5 w-full py-2.5 px-4 rounded-xl bg-[#FF6B35] text-white font-semibold hover:bg-[#e85a25] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Plus size={18} />
                      Post Job
                    </button>
                  </div>
                </div>

                {/* Navigation is handled by the Navbar component below */}
              </aside>
            )}

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
              <div className="min-h-full">{renderContent()}</div>
            </div>
          </div>
        </main>

        <FooterSection />
      </div>
    </BusinessPageContext.Provider>
  );
}

export default function BusinessDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]" />
        </div>
      }
    >
      <BusinessDashboardInner />
    </Suspense>
  );
}
