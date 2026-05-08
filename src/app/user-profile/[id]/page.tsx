"use client";

import React, { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/common/Header";
import FooterSection from "../../homepage/components/FooterSection";
import CompletedJobs from "./components/CompletedJobs";
import PortfolioUpload from "./components/PortfolioUpload";

import { MapPin, Star } from "lucide-react";
import { useProfileDetails } from "@/app/hook/useProfile";
import Link from "next/link";

export default function FreelancerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [chatLoading, setChatLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!id) return;
    try {
      const res = await fetch('/api/client/saved-freelancers?idsOnly=true', { credentials: 'include' });
      const data = await res.json();
      if (data.success && Array.isArray(data.ids)) {
        setIsSaved(data.ids.includes(id));
      }
    } catch { /* non-critical */ }
  }, [id]);

  useEffect(() => {
    if (status === 'authenticated') fetchSaved();
  }, [status, fetchSaved]);

  const handleToggleSave = useCallback(async () => {
    if (!id) return;
    if (status !== 'authenticated') {
      router.push('/sign-in-page');
      return;
    }
    setSaveLoading(true);
    try {
      const res = await fetch('/api/client/saved-freelancers', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ freelancerId: id }),
      });
      const data = await res.json();
      if (data.success) setIsSaved(data.isSaved);
    } catch { /* non-critical */ } finally {
      setSaveLoading(false);
    }
  }, [id, status, router]);

  const { data, isLoading } = useProfileDetails(id);

  // Create or find a direct chat with this freelancer → navigate to messages
  const handleContactNow = useCallback(async () => {
    if (!id) return;
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat/with-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otherUserId: id }),
      });
      const data = await res.json();
      if (data?.chatId) {
        router.push(`/client/messages?chatId=${data.chatId}`);
      } else {
        router.push(`/client/messages?otherUserId=${id}`);
      }
    } catch {
      router.push(`/client/messages?otherUserId=${id}`);
    } finally {
      setChatLoading(false);
    }
  }, [id, router]);

  // Share this profile
  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const profileName = data?.profile?.name ?? "Freelancer";
    const title = `${profileName}'s profile on FreelanceHub`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch { }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      alert("Profile link copied to clipboard!");
    } catch {
      alert(`Copy this link: ${url}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  // console.log("userDetails",data)
  // Protect this page - redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Wait for session to load

    if (status === 'unauthenticated' || !session) {
      // Store current URL for redirect after login
      sessionStorage.setItem('redirectAfterLogin', `/user-profile/${id}`);
      router.replace('/sign-in-page');
    }
  }, [status, session, router, id]);

  const freelancer = data?.profile || {};

  // Show skeleton loading state while checking authentication or fetching profile
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9f9]">
        <Header />
        <main className="flex-grow p-10 mt-12 animate-pulse w-full max-w-7xl mx-auto space-y-6">
          <div className="h-48 bg-gray-200 rounded-xl w-full"></div>
          <div className="flex flex-col md:flex-row gap-6 w-full">
            <div className="w-full md:w-[300px] h-[500px] bg-gray-200 rounded-xl"></div>
            <div className="flex-1 h-[500px] bg-gray-200 rounded-xl"></div>
          </div>
        </main>
      </div>
    );
  }

  // Don't render the page if not authenticated (will redirect)
  if (!session) {
    return null;
  }
  const {
    name, location, image, skills,
    title, totalEarned, rating, reviews, role, workExperience, email, activeProjects, profileImage,
    profileCompleteness, portfolio, occupationTime, memberSince, languages, hourlyRate, experience, education,
    coverPhoto, contact, completedJobs, certifications, about, totalHours,
    completedJobsList, activeJobsList
  } = data?.profile || {};

  const avatarSrc = image || profileImage || null;

  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <main className="flex-grow bg-[#f9f9f9] text-[#001e00] font-sans">
        <div className="max-w-7xl mx-auto py-10">

          <header className="bg-white border border-gray-200 rounded-t-xl p-8 shadow-sm mt-12">
            <div className="flex justify-between items-start">
              <div className="flex gap-6">
                {/* Profile Image with Online Indicator */}
                <div className="relative">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      className="w-24 h-24 rounded-full object-cover border border-gray-100"
                      alt={name || "Profile"}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1B365D] to-[#2E5984] flex items-center justify-center border border-gray-100">
                      <span className="text-4xl font-bold text-white">
                        {name ? name[0].toUpperCase() : "?"}
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-1 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="space-y-2">
                  {/* Name and Verified Badge */}
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-[#001e00]">
                      {name}
                    </h1>
                    <div className="text-blue-500 bg-white rounded-full">
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-3.3-3.3 1.4-1.4 1.9 1.9 5.3-5.3 1.4 1.4-6.7 6.7z" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-gray-600 flex items-center text-sm">
                    <MapPin size={16} className="mr-1" />
                    {location}
                  </p>

                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 p-1 rounded-full">
                        <Star
                          size={12}
                          className="fill-blue-600 text-blue-600"
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        100% Job Success
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="bg-blue-600 p-1 rounded-full">
                        <Star size={12} className="fill-white text-white" />
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        Top Rated
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/freelancer-dashboard/freelancer-profile-preview?userId=${id}`)}
                    className="flex items-center gap-2 px-4 py-2 border text-sm font-medium rounded-lg transition hover:bg-gray-50"
                    style={{ borderColor: "#2E5984", color: "#2E5984" }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View profile
                  </button>

                  <button
                    onClick={handleToggleSave}
                    disabled={saveLoading || status !== "authenticated" || session?.user?.role !== "client"}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition ${isSaved ? 'text-[#FF6B35] bg-orange-50 w-10 h-10' : 'text-[#1B365D] hover:bg-gray-50 w-10 h-10 border border-gray-200'} disabled:opacity-50`}
                    title={isSaved ? "Unsave freelancer" : "Save freelancer"}
                  >
                    <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>
                {/* Share Button */}
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-1.5 text-lg font-semibold text-[#FF6B35] transition-all hover:opacity-80"
                >
                  Share <span className="text-lg">↥</span>
                </button>
              </div>
            </div>

          </header>

          <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm flex flex-col md:flex-row overflow-hidden">

            <aside className="w-full md:w-[300px] border-r border-gray-200 p-6 space-y-8">
              {/* VIEW PROFILE SECTION */}
              <section>
                <h3 className="font-bold text-md mb-4 text-[#001e00]">View profile</h3>
                <div className="flex flex-col gap-2">
                  {skills?.map((skill: string) => (
                    <button
                      key={skill}
                      className="text-left text-sm text-gray-600 hover:text-[#FF6B35] px-2 py-1"
                    >
                      {skill}
                    </button>
                  ))}
                  <div className="flex justify-between items-center bg-[#f2f2f2] px-3 py-2 rounded-md cursor-pointer">
                    <span className="text-sm font-bold text-[#001e00]">All work</span>
                    <span className="text-xs text-gray-500">›</span>
                  </div>
                </div>
              </section>

              {/* CONTACT NOW */}
              <section className="border-t pt-8">
                <h3 className="font-bold text-md mb-4 text-[#001e00]">
                  Ready to work with {name?.split(" ")[0]}?
                </h3>
                <button
                  onClick={handleContactNow}
                  disabled={chatLoading}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white font-bold py-2 rounded-full transition-colors mb-3 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {chatLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : null}
                  Contact Now
                </button>
              </section>

              {/* STATS SECTION */}
              <div className="border-t pt-8 grid grid-cols-2 gap-4 ">
                <div>
                  <p className="text-xl font-bold text-[#001e00]">
                    {/* {freelancer.completedProjects} */}
                    {completedJobs ?? 0}
                  </p>
                  <p className="text-xs text-gray-500">Total jobs</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#001e00]">
                    {totalHours || 0}
                  </p>
                  <p className="text-xs text-gray-500">Total hours</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#001e00]">{activeProjects ?? 0}</p>
                  <p className="text-xs text-gray-500">Active projects</p>
                </div>
              </div>

              {/* HOURS PER WEEK SECTION */}
              <section className="border-t pt-8 ">
                <h3 className="font-bold text-md mb-2 text-[#001e00]">
                  Hours per week
                </h3>
                {/* <p className="text-sm text-gray-600">More than 30 hrs/week</p> */}
                <p className="text-sm text-gray-600">{occupationTime ?? "—"}</p>
              </section>

              {/* LINKED ACCOUNTS SECTION */}
              <section className="flex flex-col gap-4 border-t pt-8">

                {/* Email */}
                {contact?.email && contact.email.trim() !== "" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-black text-white p-1 rounded text-[10px] font-bold">
                        Email
                      </div>

                      <div>
                        <p className="text-blue-500 text-xs font-bold mt-1 cursor-pointer hover:underline flex items-center gap-1">
                          🔗 {contact.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phone */}
                {contact?.phone && contact.phone.trim() !== "" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-black text-white p-1 rounded text-[10px] font-bold">
                        Phone
                      </div>

                      <div>
                        <p className="text-blue-500 text-xs font-bold mt-1 flex items-center gap-1">
                          📞 {contact.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Website */}
                {contact?.website && contact.website.trim() !== "" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-black text-white p-1 rounded text-[10px] font-bold">
                        Website
                      </div>

                      <div>
                        <Link
                          href={contact.website}
                          target="_blank"
                          className="text-blue-500 text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          🌐 {contact.website}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* LinkedIn */}
                {contact?.linkedin && contact.linkedin.trim() !== "" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-black text-white p-1 rounded text-[10px] font-bold">
                        LinkedIn
                      </div>

                      <div>
                        <Link
                          href={contact.linkedin}
                          target="_blank"
                          className="text-blue-500 text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          💼 {contact.linkedin}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Github */}
                {contact?.github && contact.github.trim() !== "" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-2">
                      <div className="bg-black text-white p-1 rounded text-[10px] font-bold">
                        Github
                      </div>

                      <div>
                        <Link
                          href={contact.github}
                          target="_blank"
                          className="text-blue-500 text-xs font-bold hover:underline flex items-center gap-1"
                        >
                          🐙 {contact.github}
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

              </section>
            </aside>

            {/* CONTENT AREA */}
            <div className="flex-1 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{title}</h2>
                <span className="text-2xl font-bold">
                  ${hourlyRate}.00/hr
                </span>
              </div>

              {/* COMPONENT IMPORTED HERE - ALL LOGIC IS INSIDE */}
              <CompletedJobs
                completedJobsList={completedJobsList || []}
                activeJobsList={activeJobsList || []}
                completedCount={completedJobs ?? 0}
                inProgressCount={activeProjects ?? 0}
              />

              <section className="border-t border-gray-100 pt-12 mt-12 text-center">
                <h3 className="text-2xl font-bold mb-8">Skills</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-5 py-1 bg-gray-100 text-gray-600 rounded-full text-sm border border-gray-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* Portfolio upload — hidden for client viewers */}
              <section>
                <PortfolioUpload readOnly={true} />
              </section>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
}