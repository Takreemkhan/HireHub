"use client";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback, Suspense } from "react";
import ResumeVideoManager from "../components/ResumeVideoManager";

// Brand colors: Primary #1B365D | Secondary #2E5984 | Accent #FF6B35

type ApiProfile = {
  name?: string; title?: string; location?: string; hourlyRate?: number;
  occupationTime?: string; responseTime?: string; about?: string; skills?: string[];
  completedJobs?: number; activeProjects?: number; totalEarned?: number; memberSince?: string;
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
    rating: 4.9,
    reviewCount: 0,
    bio: api.about ?? "",
    skills: Array.isArray(api.skills) ? api.skills : [],
    stats: {
      responseTime: api.occupationTime ?? api.responseTime ?? "< 1 hour",
      jobsCompleted: api.completedJobs ?? 0,
      ongoingProjects: api.activeProjects ?? 0,
      totalEarnings: api.totalEarned != null ? `$${Math.round(api.totalEarned).toLocaleString()}` : "$0",
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
  const [profile, setProfile] = useState(apiToPreviewProfile(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const freelancerId = searchParams.get("userId") ?? "";


  const UserId = (freelancerId || userId) ?? "";

  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/freelancer/profile?userId=${encodeURIComponent(UserId)}`, { credentials: "include" });
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 404) setProfile(apiToPreviewProfile(null));
        else setError(json.message || "Failed to load profile");
        return;
      }
      setProfile(apiToPreviewProfile(json.profile as ApiProfile));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load profile");
      setProfile(apiToPreviewProfile(null));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (sessionStatus === "loading" || !userId) {
      if (sessionStatus === "unauthenticated") setLoading(false);
      return;
    }
    fetchProfile();
  }, [sessionStatus, userId, fetchProfile]);

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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-sm mb-4 pb-2 border-b border-gray-100" style={{ color: "#1B365D" }}>{title}</h3>
      {children}
    </div>
  );

  if (loading) {
    return (
      <>
        <Header />
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-3 text-gray-500 pt-24" style={{ backgroundColor: "#FAFBFC" }}>
          <div className="w-8 h-8 border-2 border-blue-300 border-t-[#1B365D] rounded-full animate-spin" />
          <p>Loading your profile…</p>
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
          <button onClick={() => router.push("/freelancer-dashboard")} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: "#FF6B35" }}>Back to Dashboard</button>
        </div>
      </>
    );
  }

  const avatarSrc = profile.profileImage || null;
  const hasPhoto = !!avatarSrc;
  const coverStyle = profile.coverPhoto ? { backgroundImage: `url(${profile.coverPhoto})`, backgroundSize: "cover", backgroundPosition: "center" } : { background: "linear-gradient(135deg, #1B365D 0%, #2E5984 55%, #FF6B35 100%)" };

  return (
    <>
      <Header />

      <div className="w-full min-h-screen" style={{ backgroundColor: "#FAFBFC" }}>

        {/* ─── Preview Mode Banner — full bleed ─── */}
        <div className="w-full flex items-center justify-between px-6 py-3 mt-12" style={{ backgroundColor: "#1B365D" }}>
          <div className="flex items-center gap-3 mt-12">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#FF6B35" }} />
            <span className="text-sm font-medium text-white">Preview Mode — This is exactly how clients see your profile</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              // onClick={() => router.push(`${freelancerId}? client-dashboard : /freelancer-dashboard`)}
              onClick={() =>
                router.push(
                  freelancerId
                    ? `/client-dashboard`
                    : "/freelancer-dashboard"
                )}

              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-white transition"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.22)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.12)")}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
            {
              freelancerId ? " " : <button
                onClick={() => router.push("/freelancer-dashboard")}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition"
                style={{ backgroundColor: "#FF6B35" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            }


          </div>
        </div>

        {/* ─── Cover — from API or default gradient ─── */}
        <div className="w-full h-52 relative bg-cover bg-center" style={coverStyle}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} />
          <svg className="absolute -bottom-px left-0 w-full" viewBox="0 0 1440 40" preserveAspectRatio="none" fill="white">
            <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
          </svg>
        </div>

        {/* ─── Profile info strip — white bar, px-6, avatar overlaps cover ─── */}
        <div className="w-full bg-white border-b border-gray-100 shadow-sm px-6 pb-5 mt-12">
          <div className="flex flex-col lg:flex-row lg:items-end gap-5 -mt-12">
            {/* Avatar — same as Profile.tsx: no default photo when removed; empty placeholder only */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                {hasPhoto ? (
                  <img
                    src={avatarSrc}
                    alt={profile.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                    </svg>
                    <span className="text-xs mt-0.5">No photo</span>
                  </span>
                )}
              </div>
            </div>

            {/* Name / details */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: "#1B365D" }}>{profile.name}</h1>
                  <p className="text-gray-600 mt-0.5">{profile.title}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                      {profile.location}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-green-600">
                      <span className="w-2 h-2 rounded-full bg-green-500" />{profile.availability}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Stars cls="w-3.5 h-3.5" />
                      <strong className="text-gray-700 ml-0.5">{profile.rating}</strong>
                      <span className="text-gray-400">({profile.reviewCount} reviews)</span>
                    </span>
                  </div>
                </div>

                {/* Rate + CTA buttons */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-3xl font-bold" style={{ color: "#FF6B35" }}>
                    ${profile.hourlyRate}<span className="text-base font-normal text-gray-400">/hr</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2" style={{ backgroundColor: "#FF6B35" }}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      Hire Now
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      Message
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-gray-500 border border-gray-200 p-2.5 rounded-xl transition">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip — full width within white bar */}
          <div className="mt-5 grid grid-cols-3 sm:grid-cols-5 gap-3 rounded-xl p-4" style={{ backgroundColor: "#EBF4FF" }}>
            {[
              { label: "Response Time", value: profile.stats.responseTime },
              { label: "Jobs Done", value: profile.stats.jobsCompleted },
              { label: "Active Projects", value: profile.stats.ongoingProjects },
              { label: "Total Earned", value: profile.stats.totalEarnings },
              { label: "Member Since", value: profile.stats.memberSince },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-lg font-bold" style={{ color: "#1B365D" }}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Main Content Grid — px-6, full width ─── */}
        <div className="w-full px-6 py-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left — main sections */}
            <div className="xl:col-span-2 space-y-6 min-w-0">

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-w-0 overflow-hidden">
                <h2 className="text-base font-bold mb-3" style={{ color: "#1B365D" }}>About</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line break-words break-all min-w-0">{profile.bio}</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold mb-4" style={{ color: "#1B365D" }}>Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="px-3.5 py-1.5 rounded-full text-sm font-medium border" style={{ backgroundColor: "#EBF4FF", color: "#1B365D", borderColor: "#BFDBFE" }}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold" style={{ color: "#1B365D" }}>Portfolio</h2>
                  <span className="text-xs text-gray-400">{profile.portfolio.length} projects</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {profile.portfolio.map((item, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group">
                      {item.src.startsWith("data:") ? (
                        <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      ) : (
                        <Image src={item.src} alt={item.title} width={300} height={300} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                        <p className="text-white text-sm font-semibold">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* <ResumeVideoManager readOnly={!!freelancerId} targetUserId={freelancerId || undefined} /> */}
                <ResumeVideoManager readOnly={true} />
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold mb-5" style={{ color: "#1B365D" }}>Work Experience</h2>
                <div className="relative">
                  <div className="absolute left-3.5 top-2 bottom-2 w-px" style={{ backgroundColor: "#BFDBFE" }} />
                  <div className="space-y-5 pl-10">
                    {profile.experience.map((exp, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-10 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EBF4FF" }}>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF6B35" }} />
                        </div>
                        <h3 className="font-semibold text-sm" style={{ color: "#1B365D" }}>{exp.title}</h3>
                        <p className="text-sm font-medium" style={{ color: "#2E5984" }}>{exp.company}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{exp.period}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-bold mb-4" style={{ color: "#1B365D" }}>Education</h2>
                <div className="space-y-4">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm" style={{ color: "#1B365D" }}>{edu.degree}</h3>
                        <p className="text-sm text-gray-600">{edu.school}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{edu.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews — only show when there are reviews */}
              {profile.reviews.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-base font-bold" style={{ color: "#1B365D" }}>Client Reviews</h2>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: "#EBF4FF" }}>
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-sm font-bold" style={{ color: "#1B365D" }}>{profile.rating}</span>
                      <span className="text-sm text-gray-500">({profile.reviewCount})</span>
                    </div>
                  </div>
                  <div className="space-y-5">
                    {profile.reviews.map((review, idx) => (
                      <div key={idx} className={idx < profile.reviews.length - 1 ? "pb-5 border-b border-gray-100" : ""}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <img src={review.avatar} alt={review.name} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="font-semibold text-sm" style={{ color: "#1B365D" }}>{review.name}</p>
                              <p className="text-xs text-gray-500">{review.role}</p>
                            </div>
                          </div>
                          <Stars count={review.rating} cls="w-3.5 h-3.5" />
                        </div>
                        <p className="text-gray-600 text-sm mt-3 leading-relaxed">{review.text}</p>
                        <p className="text-xs text-gray-400 mt-2">{review.date}</p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition">
                    See All {profile.reviewCount} Reviews
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">

              {/* CTA Card */}
              <div className="rounded-2xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(135deg, #1B365D 0%, #2E5984 100%)" }}>
                <div className="text-2xl font-bold" style={{ color: "#FF6B35" }}>
                  ${profile.hourlyRate}<span className="text-base font-normal text-white opacity-70">/hr</span>
                </div>
                <div className="flex items-center gap-1 mt-1 mb-5">
                  <Stars />
                  <span className="text-sm ml-1 opacity-80">{profile.rating} ({profile.reviewCount})</span>
                </div>
                <button className="w-full font-bold py-3 rounded-xl text-sm transition mb-2 text-white" style={{ backgroundColor: "#FF6B35" }}>
                  Hire {(profile.name?.split(" ")[0]) || "Me"} Now
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 rounded-xl transition text-sm">
                  Send a Message
                </button>
              </div>

              <SideCard title="Languages">
                <div className="space-y-3">
                  {profile.languages.map((lang) => (
                    <div key={lang.name}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-600">{lang.name}</span>
                        <span className="font-semibold" style={{ color: "#1B365D" }}>{lang.level}</span>
                      </div>
                      <div className="h-2 rounded-full" style={{ backgroundColor: "#EBF4FF" }}>
                        <div className="h-2 rounded-full" style={{ width: lang.width, backgroundColor: "#FF6B35" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </SideCard>

              <SideCard title="Certifications">
                <div className="space-y-3">
                  {profile.certifications.map((cert) => (
                    <div key={cert.name} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#EBF4FF" }}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#2E5984" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: "#1B365D" }}>{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </SideCard>

              <SideCard title="Contact">
                <div className="space-y-2.5">
                  {[
                    { label: profile.contact.email, icon: "✉️", href: `mailto:${profile.contact.email}` },
                    { label: profile.contact.website, icon: "🌐", href: `https://${profile.contact.website}` },
                    { label: profile.contact.linkedin, icon: "💼", href: `https://${profile.contact.linkedin}` },
                    { label: profile.contact.github, icon: "💻", href: `https://${profile.contact.github}` },
                  ].map((c) => (
                    <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs transition hover:opacity-80" style={{ color: "#2E5984" }}>
                      <span className="text-base">{c.icon}</span>
                      <span className="truncate">{c.label}</span>
                    </a>
                  ))}
                </div>
              </SideCard>

            </div>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}

export default function FreelancerProfilePreview() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FreelancerProfilePreviewContent />
    </Suspense>
  );
}
