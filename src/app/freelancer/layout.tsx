

// // "use client";

// // import React, { use, useState } from "react";
// // import Header from "@/components/common/Header";
// // import { MapPin, Star, Briefcase, Clock } from "lucide-react";
// // import Settings from "../client-dashboard/components/SettingsSection";
// // import CurrentJobPost from "../current-job-post/page";
// // // import CompletedJob from "../client-dashboard/components/CompletedJobCard";
// // import CompletedJobsSection from "../client-dashboard/components/CompletedJobsSection";
// // import BidInsights from "./components/Bidinsights";
// // import FooterSection from "@/app/homepage/components/FooterSection";
// // import FreelancerProfileOverview from "./components/FreelancerProfileOverview";
// // import Overview from "./overview";
// // import { useRouter } from "next/navigation";

// // const mockFreelancers = [
// //   {
// //     id: 1,
// //     name: "Sarah Chen",
// //     image:
// //       "https://img.rocket.new/generatedImages/rocket_gen_img_10d60e496-1763295319842.png",
// //     location: "San Francisco, CA",
// //     completedProjects: 89,
// //     totalHours: "1,240",
// //     membership: {
// //       tier: "gold", // Change to: "free", "silver", "gold", or "platinum"
// //       expiryDate: "Dec 31, 2026",
// //       bidsRemaining: 150, // For free tier: typically 5-10, For premium: 50-500+
// //     },
// //   },
// // ];

// // // EXAMPLE FOR FREE USER:
// // // membership: {
// // //   tier: "free",
// // //   expiryDate: "", // Not needed for free
// // //   bidsRemaining: 5,
// // // },

// // export default function FreelancerDetailPage({
// //   params,
// // }: {
// //   params: Promise<{ id: string }>;
// // }) {
// //   const { id } = use(params);
// //   const router = useRouter();
// //   const freelancer =
// //     mockFreelancers.find((f) => f.id === parseInt(id)) || mockFreelancers[0];

// //   const [activeSection, setActiveSection] = useState("overview");
// //   const [isViewingProject, setIsViewingProject] = useState(false);

// //   const handleProfileClick = () => {
// //     // Navigate to profile overview or keep on same page
// //   };

// //   const sidebarItems = [
// //     { label: "Overview", value: "overview" },
// //     { label: "Completed Jobs", value: "completed" },
// //     { label: "Current Jobs", value: "current" },
// //     { label: "Bid Insights", value: "Bid Insights" },
// //     { label: "Settings", value: "settings" },
// //   ];

// //   // Get membership tier styling
// //   const getMembershipStyle = (tier: string) => {
// //     const styles = {
// //       free: {
// //         gradient: "from-gray-400 to-gray-500",
// //         textGradient: "from-gray-600 to-gray-700",
// //         badge: "bg-gray-100 text-gray-700",
// //         label: "Free Member",
// //         icon: (
// //           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
// //             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
// //           </svg>
// //         ),
// //       },
// //       silver: {
// //         gradient: "from-gray-300 via-gray-400 to-gray-500",
// //         textGradient: "from-gray-500 to-gray-700",
// //         badge: "bg-gray-100 text-gray-700",
// //         label: "Silver Member",
// //         icon: (
// //           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
// //             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
// //           </svg>
// //         ),
// //       },
// //       gold: {
// //         gradient: "from-yellow-400 via-yellow-500 to-orange-500",
// //         textGradient: "from-yellow-600 to-orange-600",
// //         badge: "bg-yellow-100 text-yellow-700",
// //         label: "Gold Member",
// //         icon: (
// //           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
// //             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
// //           </svg>
// //         ),
// //       },
// //       platinum: {
// //         gradient: "from-purple-400 via-purple-500 to-indigo-600",
// //         textGradient: "from-purple-600 to-indigo-700",
// //         badge: "bg-purple-100 text-purple-700",
// //         label: "Platinum Member",
// //         icon: (
// //           <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
// //             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
// //           </svg>
// //         ),
// //       },
// //     };
// //     return styles[tier as keyof typeof styles] || styles.free;
// //   };

// //   const membershipStyle = getMembershipStyle(freelancer.membership.tier);

// //   // Listen to when Overview component is viewing a project
// //   // This is a simplified version - in production you'd use context or state management
// //   const handleSectionChange = (section: string) => {
// //     setActiveSection(section);
// //     setIsViewingProject(false);
// //   };


// //   return (
// //     <div className="flex flex-col min-h-screen mt-12">
// //       <Header />

// //       {/* Main Dashboard Area */}
// //       <main className="flex-1 bg-[#FAFBFC] text-[#1A1D23] font-sans">
// //         <div className="flex min-h-[calc(100vh-4rem)]">
          
// //           {/* LEFT SIDEBAR - Sticky */}
// //           <aside className="w-80 bg-white border-r border-[#E2E8F0] flex flex-col shadow-sm sticky top-16 h-[calc(100vh-4rem)]">
            
// //             {/* Profile Section */}
// //             <div className="p-6 border-b border-[#E2E8F0]">
// //               <div className="flex flex-col items-center text-center">
// //                 <div className="relative mb-4">
// //                   <img
// //                     src={freelancer.image}
// //                     alt={freelancer.name}
// //                     className="w-20 h-20 rounded-full object-cover border-2 border-[#E2E8F0] cursor-pointer hover:opacity-90 transition-opacity"
// //                     onClick={handleProfileClick}
// //                   />
// //                   <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
// //                 </div>

// //                 <h2 className="text-xl font-bold text-[#1A1D23] mb-1">
// //                   {freelancer.name}
// //                 </h2>

// //                 <p className="text-sm text-[#6B7280] flex items-center justify-center gap-1 mb-3">
// //                   <MapPin size={14} />
// //                   {freelancer.location}
// //                 </p>

// //                 <div className="flex items-center gap-1 mb-4">
// //                   {[...Array(5)].map((_, i) => (
// //                     <Star
// //                       key={i}
// //                       size={14}
// //                       className="fill-yellow-400 text-yellow-400"
// //                     />
// //                   ))}
// //                 </div>

// //                 {/* Stats Cards */}
// //                 <div className="w-full grid grid-cols-2 gap-4 mb-4">
// //                   <div className="bg-[#F7FAFC] rounded-lg p-3">
// //                     <div className="flex items-center justify-center gap-2 mb-1">
// //                       <Briefcase size={16} className="text-[#1B365D]" />
// //                       <p className="text-2xl font-bold text-[#1A1D23]">
// //                         {freelancer.completedProjects}
// //                       </p>
// //                     </div>
// //                     <p className="text-xs text-[#6B7280]">Total Jobs</p>
// //                   </div>

// //                   <div className="bg-[#F7FAFC] rounded-lg p-3">
// //                     <div className="flex items-center justify-center gap-2 mb-1">
// //                       <Clock size={16} className="text-[#1B365D]" />
// //                       <p className="text-2xl font-bold text-[#1A1D23]">
// //                         {freelancer.totalHours}
// //                       </p>
// //                     </div>
// //                     <p className="text-xs text-[#6B7280]">Total Hours</p>
// //                   </div>
// //                 </div>

// //                 {/* Membership Badge */}
// //                 {/* <div className="w-full p-3 bg-gradient-to-r from-gray-50 to-orange-50 border border-orange-200 rounded-lg">
// //                   <div className="flex items-center justify-center gap-2">
// //                     <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${membershipStyle.gradient} flex items-center justify-center`}>
// //                       {membershipStyle.icon}
// //                     </div>
// //                     <div className="text-left">
// //                       <p className={`text-sm font-bold bg-gradient-to-r ${membershipStyle.textGradient} bg-clip-text text-transparent`}>
// //                         {membershipStyle.label}
// //                       </p>
// //                       <p className="text-xs text-gray-500">
// //                         {freelancer.membership.bidsRemaining} Bids Left
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div> */}
// //               </div>
// //             </div>

// //             {/* Navigation Menu */}
// //             <nav className="flex-1 p-4 overflow-y-auto" aria-label="Dashboard sections">
// //               <div className="space-y-1">
// //                 {sidebarItems.map((item) => (
// //                   <button
// //                     type="button"
// //                     key={item.value}
// //                     onClick={() => handleSectionChange(item.value)}
// //                     className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
// //                       activeSection === item.value
// //                         ? 'bg-[#FF6B35] text-white shadow-sm'
// //                         : 'text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23]'
// //                     }`}
// //                   >
// //                     {item.label}
// //                   </button>
// //                 ))}
// //               </div>
// //             </nav>

// //             {/* Sidebar Footer */}
// //             <div className="p-4 border-t border-[#E2E8F0]">
// //               <p className="text-xs text-center text-[#6B7280]">
// //                 © 2026 FreelanceHub Pro
// //               </p>
// //             </div>
// //           </aside>

// //           {/* MAIN CONTENT AREA - Scrollable */}
// //           <div className="flex-1 bg-[#FAFBFC]">
// //             <div className="min-h-full">
// //               {!isViewingProject && (
// //                 <>
// //                   {activeSection === "overview" && (
// //                     <FreelancerProfileOverview />
// //                   )}
// //                   {activeSection === "settings" && <Settings />}
// //                   {activeSection === "current" && <CurrentJobPost />}
// //                   {activeSection === "completed" && <CompletedJobsSection />}
// //                   {activeSection === "Bid Insights" && <BidInsights />}
// //                 </>
// //               )}
// //               {isViewingProject && activeSection === "overview" && (
// //                 <Overview onProjectView={setIsViewingProject} />
// //               )}
// //             </div>
// //           </div>
          
// //         </div>
// //       </main>

// //       {/* Footer at the bottom of the page */}
// //       <FooterSection />
// //     </div>
// //   );
// // }

// "use client";

// import React, { use, useState, useEffect } from "react";
// import Header from "@/components/common/Header";
// import { MapPin, Star, Briefcase, Clock, Crown, Zap } from "lucide-react";
// import Settings from "../client-dashboard/components/SettingsSection";
// import CurrentJobPost from "../current-job-post/page";
// import CompletedJobsSection from "../client-dashboard/components/CompletedJobsSection";
// import BidInsights from "./components/Bidinsights";
// import FooterSection from "@/app/homepage/components/FooterSection";
// import FreelancerProfileOverview from "./components/FreelancerProfileOverview";
// import Overview from "./overview";
// import { useRouter } from "next/navigation";

// const mockFreelancers = [
//   {
//     id: 1,
//     name: "Sarah Chen",
//     image:
//       "https://img.rocket.new/generatedImages/rocket_gen_img_10d60e496-1763295319842.png",
//     location: "San Francisco, CA",
//     completedProjects: 89,
//     totalHours: "1,240",
//     membership: {
//       tier: "Basic", // Change to: "Basic", "Plus", or "Premium"
//       expiryDate: "Dec 31, 2026",
//       bidsRemaining: 150,
//     },
//   },
// ];

// export default function FreelancerDashboard({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = use(params);
//   const router = useRouter();
//   const freelancer =
//     mockFreelancers.find((f) => f.id === parseInt(id)) || mockFreelancers[0];

//   const [activeSection, setActiveSection] = useState("overview");
//   const [isViewingProject, setIsViewingProject] = useState(false);
//   const [currentPlan, setCurrentPlan] = useState<string>('Basic');

//   useEffect(() => {
//     // Check localStorage for saved plan
//     const savedPlan = localStorage.getItem('freelancerMembershipPlan');
//     if (savedPlan) {
//       setCurrentPlan(savedPlan);
//     }
//   }, []);

//   const handleProfileClick = () => {
//     // Navigate to profile overview or keep on same page
//   };

//   const sidebarItems = [
//     { label: "Overview", value: "overview" },
//     { label: "Completed Jobs", value: "completed" },
//     { label: "Current Jobs", value: "current" },
//     { label: "Bid Insights", value: "Bid Insights" },
//     { label: "Settings", value: "settings" },
//   ];

//   // Plan configuration with icons and colors
//   const PLAN_CONFIG = {
//     'Basic': {
//       icon: Star,
//       gradient: 'from-gray-500 to-gray-600',
//       bgColor: 'bg-gray-100',
//       textColor: 'text-gray-700',
//       borderColor: 'border-gray-300',
//     },
//     'Plus': {
//       icon: Zap,
//       gradient: 'from-orange-500 to-red-500',
//       bgColor: 'bg-orange-50',
//       textColor: 'text-orange-700',
//       borderColor: 'border-orange-300',
//     },
//     'Premium': {
//       icon: Crown,
//       gradient: 'from-purple-500 to-indigo-600',
//       bgColor: 'bg-purple-50',
//       textColor: 'text-purple-700',
//       borderColor: 'border-purple-300',
//     },
//   };

//   const planConfig = PLAN_CONFIG[currentPlan as keyof typeof PLAN_CONFIG] || PLAN_CONFIG['Basic'];
//   const PlanIcon = planConfig.icon;

//   const handleSectionChange = (section: string) => {
//     setActiveSection(section);
//     setIsViewingProject(false);
//   };

//   const handleMembershipClick = () => {
//     router.push('/freelancer-membership');
//   };

//   return (
//     <div className="flex flex-col min-h-screen mt-12">
//       <Header />

//       {/* Main Dashboard Area */}
//       <main className="flex-1 bg-[#FAFBFC] text-[#1A1D23] font-sans">
//         <div className="flex min-h-[calc(100vh-4rem)]">
          
//           {/* LEFT SIDEBAR - Sticky */}
//           <aside className="w-80 bg-white border-r border-[#E2E8F0] flex flex-col shadow-sm sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
            
//             {/* Profile Section */}
//             <div className="p-6 border-b border-[#E2E8F0]">
//               <div className="flex flex-col items-center text-center">
//                 <div className="relative mb-4">
//                   <img
//                     src={freelancer.image}
//                     alt={freelancer.name}
//                     className="w-20 h-20 rounded-full object-cover border-2 border-[#E2E8F0] cursor-pointer hover:opacity-90 transition-opacity"
//                     onClick={handleProfileClick}
//                   />
//                   <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
//                 </div>

//                 <h2 className="text-xl font-bold text-[#1A1D23] mb-1">
//                   {freelancer.name}
//                 </h2>

//                 <p className="text-sm text-[#6B7280] flex items-center justify-center gap-1 mb-3">
//                   <MapPin size={14} />
//                   {freelancer.location}
//                 </p>

//                 <div className="flex items-center gap-1 mb-4">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       size={14}
//                       className="fill-yellow-400 text-yellow-400"
//                     />
//                   ))}
//                 </div>

//                 {/* Stats Cards */}
//                 <div className="w-full grid grid-cols-2 gap-4 mb-4">
//                   <div className="bg-[#F7FAFC] rounded-lg p-3">
//                     <div className="flex items-center justify-center gap-2 mb-1">
//                       <Briefcase size={16} className="text-[#1B365D]" />
//                       <p className="text-2xl font-bold text-[#1A1D23]">
//                         {freelancer.completedProjects}
//                       </p>
//                     </div>
//                     <p className="text-xs text-[#6B7280]">Total Jobs</p>
//                   </div>

//                   <div className="bg-[#F7FAFC] rounded-lg p-3">
//                     <div className="flex items-center justify-center gap-2 mb-1">
//                       <Clock size={16} className="text-[#1B365D]" />
//                       <p className="text-2xl font-bold text-[#1A1D23]">
//                         {freelancer.totalHours}
//                       </p>
//                     </div>
//                     <p className="text-xs text-[#6B7280]">Total Hours</p>
//                   </div>
//                 </div>

//                 {/* Membership Badge - Clickable */}
//                 <div 
//                   onClick={handleMembershipClick}
//                   className={`w-full mb-4 p-3 rounded-lg border ${planConfig.borderColor} ${planConfig.bgColor} cursor-pointer hover:opacity-90 transition-opacity`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <div className={`bg-gradient-to-r ${planConfig.gradient} p-2 rounded-lg`}>
//                         <PlanIcon className="w-4 h-4 text-white" />
//                       </div>
//                       <div className="text-left">
//                         <p className="text-xs text-gray-600">Current Plan</p>
//                         <p className={`text-sm font-bold ${planConfig.textColor}`}>
//                           {currentPlan}
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleMembershipClick();
//                       }}
//                       className="text-xs text-blue-600 hover:text-blue-700 font-medium"
//                     >
//                       Upgrade
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Navigation Menu */}
//             <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide" aria-label="Dashboard sections">
//               <div className="space-y-1">
//                 {sidebarItems.map((item) => (
//                   <button
//                     type="button"
//                     key={item.value}
//                     onClick={() => handleSectionChange(item.value)}
//                     className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
//                       activeSection === item.value
//                         ? 'bg-[#FF6B35] text-white shadow-sm'
//                         : 'text-[#6B7280] hover:bg-[#F7FAFC] hover:text-[#1A1D23]'
//                     }`}
//                   >
//                     {item.label}
//                   </button>
//                 ))}
//               </div>
//             </nav>

//             {/* Sidebar Footer */}
//             <div className="p-4 border-t border-[#E2E8F0]">
//               <p className="text-xs text-center text-[#6B7280]">
//                 © 2026 FreelanceHub Pro
//               </p>
//             </div>
//           </aside>

//           {/* MAIN CONTENT AREA - Scrollable */}
//           <div className="flex-1 bg-[#FAFBFC]">
//             <div className="min-h-full">
//               {!isViewingProject && (
//                 <>
//                   {activeSection === "overview" && (
//                     <FreelancerProfileOverview />
//                   )}
//                   {activeSection === "settings" && <Settings />}
//                   {activeSection === "current" && <CurrentJobPost />}
//                   {activeSection === "completed" && <CompletedJobsSection />}
//                   {activeSection === "Bid Insights" && <BidInsights />}
//                 </>
//               )}
//               {isViewingProject && activeSection === "overview" && (
//                 <Overview onProjectView={setIsViewingProject} />
//               )}
//             </div>
//           </div>
          
//         </div>
//       </main>

//       {/* Footer at the bottom of the page */}
//       <FooterSection />
//     </div>
//   );
// }

"use client";

import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function FreelancerGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace("/sign-in-page");
      }
      return;
    }

    // ✅ Only redirect if role is EXPLICITLY "client"
    if (session.user?.role === "client" && !hasRedirected.current) {
      hasRedirected.current = true;
      const newPath = pathname.replace('/freelancer', '/client');
      router.replace(newPath);
      return;
    }

    // ✅ Reset flag if user has correct role or no role
    hasRedirected.current = false;
  }, [session, status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  // ✅ Only block if definitely wrong role
  if (!session || session.user?.role === "client") {
    return null;
  }

  return <>{children}</>;
}

export default function FreelancerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FreelancerGuard>
      <div className="flex flex-1 flex-col w-full">
        <Header />
        <main className="flex-1 overflow-y-auto pt-16 min-h-screen">
          {children}
        </main>
        <FooterSection />
      </div>
    </FreelancerGuard>
  );
}