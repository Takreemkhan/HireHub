"use client";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback, Suspense } from "react";
import ResumeVideoManager from "../components/ResumeVideoManager";
import { useGetResumeVideos, useGetResumeVideosByUserId, useProfileDetails, useCurrentJobsClients } from "@/app/hook/useProfile";
import { useSavedFreelancersIds, useToggleSaveFreelancer } from "@/hooks/queries/useClientDashboard";

// Brand colors: Primary #1B365D | Secondary #2E5984 | Accent #FF6B35

type ApiProfile = {
  name?: string; title?: string; location?: string; hourlyRate?: number;
  occupationTime?: string; responseTime?: string; about?: string; skills?: string[];
  completedJobs?: number; activeProjects?: number; totalEarnings?: number; totalHours?: number; memberSince?: string;
  rating?: number; reviewCount?: number;
  profileImage?: string; coverPhoto?: string; image?: string;
  experience?: { title: string; company: string; period: string }[];
  workExperience?: { title: string; company: string; period: string }[];
  education?: { degree: string; school: string; period: string }[];
  certifications?: { name: string; issuer: string }[];
  portfolio?: { title: string; src: string }[];
  languages?: { name: string; level: string; width?: string }[];
  contact?: { email?: string; website?: string; linkedin?: string; github?: string };
};

function apiToPreviewProfile(api: ApiProfile | null) {
  if (!api) {
    return {
      name: "", title: "", location: "", availability: "Available now", hourlyRate: 0,
      rating: 4.9, reviewCount: 0, bio: "", skills: [] as string[],
      stats: { responseTime: "< 1 hour", jobsCompleted: 0, ongoingProjects: 0, totalEarnings: "$0", memberSince: "—" },
      languages: [] as { name: string; level: string; width: string }[],
      experience: [] as { title: string; company: string; period: string }[],
      education: [] as { degree: string; school: string; period: string }[],
      certifications: [] as { name: string; issuer: string }[],
      portfolio: [] as { title: string; src: string }[],
      reviews: [] as { name: string; role: string; avatar: string; text: string; date: string; rating: number }[],
      contact: { email: "", website: "", linkedin: "", github: "" },
      profileImage: "", coverPhoto: "",
    };
  }
  const experience = api.workExperience ?? api.experience ?? [];
  const languages = (api.languages ?? []).map((l) => ({
    name: l.name ?? "",
    level: l.level ?? "Basic",
    width: (l as { width?: string }).width ?? "50%",
  }));
  return {
    name: api.name ?? "",
    title: api.title ?? "",
    location: api.location ?? "",
    availability: api.occupationTime ?? api.responseTime ?? "Available now",
    hourlyRate: typeof api.hourlyRate === "number" ? api.hourlyRate : Number(api.hourlyRate) || 0,
    rating: api.rating ?? 4.9,
    reviewCount: api.reviewCount ?? 0,
    bio: api.about ?? "",
    skills: Array.isArray(api.skills) ? api.skills : [],
    stats: {
      responseTime: api.occupationTime ?? api.responseTime ?? "< 1 hour",
      jobsCompleted: api.completedJobs ?? 0,
      ongoingProjects: api.activeProjects ?? 0,
      totalEarnings: api.totalEarnings != null ? `$${Math.round(api.totalEarnings).toLocaleString()}` : "$0",
      totalHours: api.totalHours ?? 0,
      memberSince: api.memberSince ? new Date(api.memberSince).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—",
    },
    languages,
    experience,
    education: Array.isArray(api.education) ? api.education : [],
    certifications: Array.isArray(api.certifications) ? api.certifications : [],
    portfolio: Array.isArray(api.portfolio) ? api.portfolio : [],
    reviews: [] as { name: string; role: string; avatar: string; text: string; date: string; rating: number }[],
    contact: {
      email: api.contact?.email ?? "",
      website: api.contact?.website ?? "",
      linkedin: api.contact?.linkedin ?? "",
      github: api.contact?.github ?? "",
    },
    profileImage: api.profileImage ?? api.image ?? "",
    coverPhoto: api.coverPhoto ?? "",
  };
}

function FreelancerProfilePreviewContent() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const userId = (session?.user as { id?: string })?.id ?? null;
  const [chatLoading, setChatLoading] = useState(false);
  const searchParams = useSearchParams();
  const freelancerId = searchParams.get("userId") ?? "";

  const UserId = (freelancerId || userId) ?? "";

  // React Query Hooks
  const { data: profileQueryData, isLoading: profileLoading, error: profileQueryError } = useProfileDetails(UserId);
  const profile = apiToPreviewProfile(profileQueryData?.profile || null);
  const loading = (sessionStatus === "loading") || (!!UserId && profileLoading);
  const error = profileQueryError ? (profileQueryError as any).message || "Failed to load profile" : null;

  // Saved Status & Toggle Mutation
  const { data: savedIds } = useSavedFreelancersIds(!!freelancerId && sessionStatus === "authenticated");
  const toggleSaveMutation = useToggleSaveFreelancer();
  const isSaved = savedIds?.includes(freelancerId) ?? false;
  const saveLoading = toggleSaveMutation.isPending;

  // Hire Modal State
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState("");

  // Current Jobs Query
  const { data: currentJobsData, isLoading: loadingJobs } = useCurrentJobsClients();
  const clientJobs = currentJobsData?.jobs?.filter((j: any) => !j.hiredFreelancer) || [];

  // Video Fetching
  const ownQuery = useGetResumeVideos();
  const targetQuery = useGetResumeVideosByUserId(freelancerId || "");
  const videoData = freelancerId ? targetQuery.data?.data : ownQuery.data?.data;
  const firstVideo = videoData?.[0] || null;

  const handleToggleSave = useCallback(async () => {
    if (!freelancerId) return;
    try {
      await toggleSaveMutation.mutateAsync(freelancerId);
    } catch { /* non-critical */ }
  }, [freelancerId, toggleSaveMutation]);

  const handleOpenHireModal = () => {
    setIsHireModalOpen(true);
  };

  const handleOpenChat = useCallback(async (jobId?: string) => {
    if (!freelancerId || !userId) return;
    setChatLoading(true);
    try {
      const payload: any = { otherUserId: freelancerId };
      if (jobId) payload.jobId = jobId;

      const res = await fetch("/api/chat/with-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      const queryParams = new URLSearchParams();
      if (data?.chatId) queryParams.set("chatId", data.chatId);
      queryParams.set("otherUserId", freelancerId);
      if (jobId) queryParams.set("jobId", jobId);
      if (profile.name) queryParams.set("peerName", profile.name);

      router.push(`/client/messages?${queryParams.toString()}`);
    } catch {
      router.push(`/client/messages?otherUserId=${freelancerId}${jobId ? `&jobId=${jobId}` : ''}`);
    } finally {
      setChatLoading(false);
      setIsHireModalOpen(false);
    }
  }, [freelancerId, userId, profile.name, router]);

  const Stars = ({ count = 5, cls = "w-4 h-4" }: { count?: number; cls?: string }) => (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className={`${cls} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  const SideCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100/50">
      <h3 className="font-bold text-lg mb-5 pb-3 border-b border-gray-100" style={{ color: "#1B365D" }}>{title}</h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 text-gray-500 pt-24" style={{ backgroundColor: "#FAFBFC" }}>
          <div className="w-8 h-8 border-2 border-blue-300 border-t-[#1B365D] rounded-full animate-spin" />
          <p>Loading profile…</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 pt-24 px-6" style={{ backgroundColor: "#FAFBFC" }}>
          <p className="text-red-600">{error}</p>
          <button onClick={() => router.push("/freelancer-dashboard")} className="px-4 py-2 rounded-xl text-white" style={{ backgroundColor: "#FF6B35" }}>Back to Dashboard</button>
        </div>
      </>
    );
  }

  const avatarSrc = profile.profileImage || null;
  const hasPhoto = !!avatarSrc;
  const isClientView = !!freelancerId && freelancerId !== userId;

  return (
    <>
      <Header />

      <div className="w-full min-h-screen" style={{ backgroundColor: "#FAFBFC" }}>
        


        {/* ─── Dawn-style Banner Section ─── */}
        <div className="w-full relative px-6 pt-24 pb-8 lg:pt-28 lg:pb-10 bg-gradient-to-br from-[#0f2545] to-[#1B365D] overflow-hidden">
          {/* Subtle Background Accents */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 10% 20%, #fff 1.5px, transparent 1.5px)", backgroundSize: "30px 30px" }} />
          <svg className="absolute -bottom-10 right-0 text-[#2E5984] w-1/2 h-full opacity-40 pointer-events-none" viewBox="0 0 200 200" fill="currentColor">
            <path d="M45.7,-77.2C58.8,-68.5,68.9,-54.6,77.3,-40.1C85.7,-25.5,92.5,-10.3,91.8,4.5C91.1,19.3,82.8,33.7,72.6,45.4C62.4,57,50.3,65.9,36.8,71.2C23.3,76.5,8.4,78.2,-6.1,76.7C-20.6,75.1,-34.7,70.2,-46.8,61.7C-58.9,53.2,-69.1,41.1,-75.7,27.3C-82.3,13.5,-85.4,-1.8,-82.1,-15.8C-78.7,-29.9,-69,-42.6,-57,-52.1C-44.9,-61.6,-30.5,-67.9,-16.5,-73C-2.4,-78.1,11.3,-82,24.1,-80C36.8,-78,48.7,-70.2,45.7,-77.2Z" transform="translate(100 100) scale(1.1)" />
          </svg>
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
            
            {/* Left: Profile Presentation */}
            <div className="flex-1 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-8">
              
              {/* Avatar Squircle */}
              <div className="relative w-36 h-36 flex-shrink-0 rounded-[2rem] border-2 border-white/20 shadow-2xl overflow-hidden bg-[#2E5984]">
                {hasPhoto ? (
                  <img src={avatarSrc} alt={profile.name || "Profile"} className="w-full h-full object-cover" />
                ) : (
                  <span className="w-full h-full flex flex-col items-center justify-center text-white/50">
                    <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                  </span>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/50 backdrop-blur-md py-1.5 px-2 text-center">
                  <span className="text-white text-sm font-bold">${profile.hourlyRate}<span className="text-xs font-normal text-white/70">/hr</span></span>
                </div>
              </div>

              {/* Name, Details & Actions */}
              <div className="flex-1 text-white py-2">
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center sm:justify-start gap-2.5">
                  {profile.name}
                  <svg className="w-6 h-6 text-blue-400 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </h1>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 mt-3 text-sm text-white/80 font-medium">
                  <span className="flex items-center gap-2"><svg className="w-4 h-4 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> {profile.title || "Freelancer"}</span>
                  <span className="flex items-center gap-2"><svg className="w-4 h-4 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {profile.location}</span>
                  <span className="flex items-center gap-2 text-yellow-400"><Stars cls="w-4 h-4" count={Math.round(profile.rating)} /> <span className="ml-1 text-white/90">{profile.rating} ({profile.reviewCount})</span></span>
                </div>

                {isClientView && (
                  <div className="mt-8 flex flex-wrap justify-center sm:justify-start gap-4">
                    <button
                      onClick={handleOpenHireModal}
                      className="px-6 py-3 rounded-[1rem] font-bold text-sm transition text-white shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 flex items-center gap-2"
                      style={{ backgroundColor: "#FF6B35" }}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      Hire for a Job
                    </button>
                    
                    <button
                      onClick={handleToggleSave}
                      disabled={saveLoading}
                      className={`p-3 rounded-[1rem] transition shadow-lg flex items-center justify-center ${isSaved ? 'bg-orange-50 text-[#FF6B35]' : 'bg-white/10 text-white hover:bg-white/20'} disabled:opacity-50`}
                      title={isSaved ? 'Unsave freelancer' : 'Save freelancer'}
                    >
                      <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </button>
                  </div>
                )}
              </div>
            </div>


          </div>
        </div>

        {/* ─── Main Content Grid (Two Columns) ─── */}
        <div className="max-w-7xl mx-auto px-6 py-12 md:pt-16 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column — Main Details */}
            <div className="lg:col-span-2 space-y-8 min-w-0">
              
              {/* About Me */}
              <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50">
                <h2 className="text-2xl font-bold mb-6" style={{ color: "#1B365D" }}>About Me</h2>
                <p className="text-gray-600 leading-loose whitespace-pre-line break-words break-all min-w-0 text-[15px]">{profile.bio}</p>
              </div>

              {/* Work History */}
              <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50">
                <h2 className="text-2xl font-bold mb-8" style={{ color: "#1B365D" }}>Work History</h2>
                <div className="relative">
                  <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gray-100" />
                  <div className="space-y-8 pl-14">
                    {profile.experience.length > 0 ? profile.experience.map((exp, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-14 top-1 mt-0.5 w-10 h-10 rounded-full flex items-center justify-center bg-blue-50 border-4 border-white shadow-sm z-10">
                          <svg className="w-4 h-4 text-[#2E5984]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="font-bold text-lg" style={{ color: "#1B365D" }}>{exp.title}</h3>
                        <p className="text-sm font-semibold mt-1" style={{ color: "#FF6B35" }}>{exp.company}</p>
                        <p className="text-xs text-gray-400 mt-1.5 uppercase tracking-wider font-semibold">{exp.period}</p>
                      </div>
                    )) : <p className="text-sm text-gray-400 pl-0">No work experience listed.</p>}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50">
                <h2 className="text-2xl font-bold mb-8" style={{ color: "#1B365D" }}>Education</h2>
                <div className="space-y-6">
                  {profile.education.length > 0 ? profile.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-5 items-start p-5 rounded-2xl bg-gray-50/50 border border-gray-100 transition hover:shadow-md hover:bg-white">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-green-100">
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: "#1B365D" }}>{edu.degree}</h3>
                        <p className="text-[15px] font-medium text-gray-600 mt-1">{edu.school}</p>
                        <p className="text-xs text-gray-400 mt-1.5 uppercase tracking-wider font-semibold">{edu.period}</p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-400">No education listed.</p>}
                </div>
              </div>

              {/* Reviews */}
              {profile.reviews.length > 0 && (
                <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold" style={{ color: "#1B365D" }}>Client Reviews</h2>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-100">
                      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-base font-bold text-yellow-700">{profile.rating}</span>
                      <span className="text-sm text-yellow-600/70">({profile.reviewCount})</span>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {profile.reviews.map((review, idx) => (
                      <div key={idx} className={idx < profile.reviews.length - 1 ? "pb-6 border-b border-gray-100" : ""}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                            <div>
                              <p className="font-bold text-base" style={{ color: "#1B365D" }}>{review.name}</p>
                              <p className="text-xs font-medium text-gray-500 mt-0.5">{review.role}</p>
                            </div>
                          </div>
                          <Stars count={review.rating} cls="w-4 h-4 text-yellow-400" />
                        </div>
                        <p className="text-gray-600 text-[15px] mt-4 leading-relaxed bg-gray-50/50 p-4 rounded-2xl">{review.text}</p>
                        <p className="text-xs font-semibold text-gray-400 mt-3 pl-2">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Manager Section */}
              <div id="video-manager-section" className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50">
                 <h2 className="text-2xl font-bold mb-6" style={{ color: "#1B365D" }}>Resume Videos</h2>
                 <ResumeVideoManager readOnly={true} targetUserId={freelancerId || undefined} />
              </div>

              {/* Portfolio Images */}
              <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: "#1B365D" }}>Portfolio</h2>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full">{profile.portfolio.length} items</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {profile.portfolio.map((item, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-sm border border-gray-100">
                      {(item.src || "").startsWith("data:") ? (
                        <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                      ) : (
                        item.src && <Image src={item.src} alt={item.title} width={300} height={300} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1B365D]/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-white text-sm font-bold translate-y-2 group-hover:translate-y-0 transition duration-300">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column — Sidebar Widgets */}
            <div className="space-y-8">
              
              {/* Skills */}
              <SideCard title="Skills">
                <div className="flex flex-wrap gap-2.5">
                  {profile.skills.length > 0 ? profile.skills.map((skill) => (
                    <span key={skill} className="px-4 py-2 rounded-xl text-[13px] font-bold transition hover:scale-105 cursor-default" style={{ backgroundColor: "#f0f5fa", color: "#2E5984", border: "1px solid #e1e9f2" }}>{skill}</span>
                  )) : <p className="text-sm text-gray-400">No skills listed.</p>}
                </div>
              </SideCard>

              {/* Freelancer Stats */}
              <SideCard title="Freelancer Stats">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Response Time", value: profile.stats.responseTime, icon: "⚡" },
                    { label: "Jobs Done", value: profile.stats.jobsCompleted, icon: "🎯" },
                    { label: "Active Projects", value: profile.stats.ongoingProjects, icon: "🚀" },
                    { label: "Total Hours", value: profile.stats.totalHours, icon: "⏱️" },
                  ].map((s) => (
                    <div key={s.label} className="bg-gray-50 p-4 rounded-2xl border border-gray-100/50 text-center flex flex-col items-center justify-center transition hover:bg-white hover:shadow-md">
                      <span className="text-xl mb-2">{s.icon}</span>
                      <div className="text-xl font-bold" style={{ color: "#1B365D" }}>{String(s.value)}</div>
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mt-1">{s.label}</div>
                    </div>
                  ))}
                  <div className="col-span-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50 text-center mt-2 flex flex-row items-center justify-center gap-3">
                     <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     <div className="text-sm font-semibold text-gray-600">Member Since <span style={{ color: "#1B365D" }}>{profile.stats.memberSince}</span></div>
                  </div>
                </div>
              </SideCard>

              {/* Languages */}
              <SideCard title="Languages">
                <div className="space-y-4">
                  {profile.languages.length > 0 ? profile.languages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="font-bold text-gray-700">{lang.name}</span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#2E5984]">{lang.level}</span>
                      </div>
                      <div className="h-2.5 rounded-full w-full bg-gray-100 overflow-hidden shadow-inner">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: lang.width, backgroundColor: "#FF6B35" }} />
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-400">No languages listed.</p>}
                </div>
              </SideCard>

              {/* Certifications */}
              <SideCard title="Certifications">
                <div className="space-y-4">
                  {profile.certifications.length > 0 ? profile.certifications.map((cert) => (
                    <div key={cert.name} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 transition">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100 bg-white">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#FF6B35" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "#1B365D" }}>{cert.name}</p>
                        <p className="text-[13px] font-medium text-gray-500 mt-0.5">{cert.issuer}</p>
                      </div>
                    </div>
                  )) : <p className="text-sm text-gray-400">No certifications listed.</p>}
                </div>
              </SideCard>



            </div>
          </div>
        </div>
      </div>
      
      {/* ─── Hire For A Job Modal ─── */}
      {isHireModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B365D]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "#1B365D" }}>
                <svg className="w-5 h-5 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Hire {profile.name}
              </h3>
              <button onClick={() => setIsHireModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition p-1.5 rounded-full hover:bg-gray-200 bg-white shadow-sm border border-gray-100">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-[15px] text-gray-600 mb-5 font-medium">Select an open job to assign to this freelancer and start a conversation.</p>
              
              {loadingJobs ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-8 h-8 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm font-semibold text-gray-500">Loading open jobs...</p>
                </div>
              ) : clientJobs.length === 0 ? (
                <div className="text-center py-10 px-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-orange-100">
                     <svg className="w-6 h-6 text-[#FF6B35]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  </div>
                  <p className="font-bold text-[#1B365D] text-lg">No open jobs available</p>
                  <p className="text-[13px] text-gray-500 mt-2 max-w-[250px] mx-auto font-medium">You need an unassigned job before you can hire a freelancer. Please create a new job from your dashboard.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                  {clientJobs.map((job: any) => (
                    <label key={job._id} className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedJobId === job._id ? 'border-[#FF6B35] bg-orange-50/30 shadow-md' : 'border-gray-100 hover:border-[#2E5984]/30 hover:bg-gray-50'}`}>
                      <div className="mt-1">
                        <input type="radio" name="jobSelect" value={job._id} checked={selectedJobId === job._id} onChange={() => setSelectedJobId(job._id)} className="w-4 h-4 text-[#FF6B35] focus:ring-[#FF6B35] border-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1B365D] truncate text-base">{job.title}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           <span className="text-[11px] font-bold uppercase tracking-wide bg-white px-2 py-1 rounded-md text-green-700 border border-green-200 shadow-sm">Budget: ${job.budget}</span>
                           <span className="text-[11px] font-bold uppercase tracking-wide bg-white px-2 py-1 rounded-md text-blue-700 border border-blue-200 shadow-sm">{job.budgetType}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setIsHireModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-200 transition">Cancel</button>
              <button 
                onClick={() => selectedJobId ? handleOpenChat(selectedJobId) : undefined}
                disabled={!selectedJobId || chatLoading}
                className="px-6 py-2.5 rounded-xl font-bold text-white transition disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                style={{ backgroundColor: "#FF6B35" }}
              >
                {chatLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                Proceed to Chat
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <FooterSection />
    </>
  );
}

export default function FreelancerProfilePreview() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-bold text-[#1B365D] text-lg gap-3"><div className="w-6 h-6 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin" /> Loading Profile...</div>}>
      <FreelancerProfilePreviewContent />
    </Suspense>
  );
}
