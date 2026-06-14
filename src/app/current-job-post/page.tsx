"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import {
  Clock,
  MapPin,
  Tag,
  Edit,
  Save,
  Send
} from "lucide-react";

const CurrentJobPost = () => {
  const router = useRouter();
  const [jobData, setJobData] = useState<any>(null);
  const [invitedFreelancers, setInvitedFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedJob = localStorage.getItem("previewJob");
    if (storedJob) {
      try {
        setJobData(JSON.parse(storedJob));
      } catch (e) {
        console.error("Failed to parse previewJob from localStorage", e);
      }
    }

    const storedFreelancers = localStorage.getItem("invitedFreelancers");
    if (storedFreelancers) {
      try {
        setInvitedFreelancers(JSON.parse(storedFreelancers));
      } catch (e) {
        console.error("Failed to parse invitedFreelancers", e);
      }
    }
    setLoading(false);
  }, []);

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD": return "$";
      case "INR": return "₹";
      case "GBP": return "£";
      case "EUR": return "€";
      default: return "$";
    }
  };

  const handlePostJob = () => {
    const draftId = jobData?.id && jobData.id !== "preview" ? jobData.id : "";
    router.push(`/post-page?action=publish${draftId ? `&draftId=${draftId}` : ""}`);
  };

  const handleSaveDraft = () => {
    const draftId = jobData?.id && jobData.id !== "preview" ? jobData.id : "";
    router.push(`/post-page?action=save${draftId ? `&draftId=${draftId}` : ""}`);
  };

  const handleEditJob = () => {
    const draftId = jobData?.id && jobData.id !== "preview" ? jobData.id : "";
    router.push(`/post-page${draftId ? `?draftId=${draftId}` : ""}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  if (!jobData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mb-6">
          <Tag className="w-10 h-10 text-[#FF6B35]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1B365D] mb-2">No Preview Job Data</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          We couldn&apos;t find any active job post preview details. Please go back to the job posting page.
        </p>
        <button
          onClick={() => router.push("/post-page")}
          className="bg-[#FF6B35] hover:bg-[#E25A24] text-white font-bold px-6 py-3 rounded-xl transition shadow-md shadow-[#FF6B35]/20"
        >
          Go to Post Page
        </button>
      </div>
    );
  }

  const currencySymbol = getCurrencySymbol(jobData.currency || "USD");

  return (
    <>
      <Header />

      <div className="min-h-screen bg-white mt-10">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* JOB HEADER CARD */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-[#1B365D]/5">
                <h1 className="text-3xl font-medium text-[#1B365D] mb-4 tracking-tight leading-tight">
                  {jobData.title || "Untitled Job Post"}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Clock className="w-4 h-4 text-[#FF6B35]" />
                    <span>Posted Just Now (Preview)</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4 text-[#FF6B35]" />
                    <span>Remote</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Tag className="w-4 h-4 text-[#FF6B35]" />
                    <span>Job ID: {jobData.id || "Preview"}</span>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION CARD */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-[#1B365D]/5">
                <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-100">
                  <h2 className="text-xl font-bold text-[#1B365D]">Description</h2>
                  <div className="flex gap-2">
                    <span className="bg-[#1B365D]/5 text-[#1B365D] px-3 py-1 rounded-full text-xs font-semibold uppercase">
                      {jobData.category || "General"}
                    </span>
                    {jobData.subcategory && (
                      <span className="bg-[#FF6B35]/10 text-[#FF6B35] px-3 py-1 rounded-full text-xs font-semibold uppercase">
                        {jobData.subcategory}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-4 flex gap-4">
                  <span>Duration: <strong className="text-gray-700">{jobData.projectDuration || "Not Specified"}</strong></span>
                  <span>Visibility: <strong className="text-gray-700 uppercase">{jobData.visibility || "Public"}</strong></span>
                </div>

                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                  {jobData.description || "No description provided."}
                </p>
              </div>

              {/* SCREENING QUESTIONS */}
              {jobData.questions && jobData.questions.length > 0 && jobData.questions.some((q: string) => q.trim() !== "") && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-[#1B365D]/5">
                  <h2 className="text-xl font-bold text-[#1B365D] mb-4 border-b pb-3 border-gray-100">
                    Screening Questions
                  </h2>
                  <ol className="space-y-3 list-decimal list-inside text-gray-700">
                    {jobData.questions.filter((q: string) => q.trim() !== "").map((q: string, idx: number) => (
                      <li key={idx} className="text-base leading-relaxed">
                        <span className="font-medium text-gray-900 ml-2">{q}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* INVITED FREELANCERS */}
              {invitedFreelancers.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-6 text-[#1B365D] border-b pb-2">Invited Freelancers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {invitedFreelancers.map((freelancer: any) => (
                      <div key={freelancer.id} className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition shadow-[#1B365D]/5">
                        <div className="flex justify-center">
                          <img
                            src={freelancer.image}
                            alt={freelancer.name}
                            className="w-[90px] h-[90px] rounded-full object-cover border-2 border-gray-100"
                          />
                        </div>

                        <div className="text-center mt-4">
                          <h3 className="font-semibold text-base text-gray-900">
                            {freelancer.name}
                          </h3>

                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {freelancer.title}
                          </p>

                          <p className="text-xs text-gray-500 mt-2">
                            {freelancer.country}
                          </p>

                          <div className="flex justify-center items-center gap-1 mt-2 text-sm text-gray-700">
                            ⭐ {freelancer.rating}
                            <span className="text-gray-400">({freelancer.reviews?.length || 0})</span>
                          </div>

                          <p className="mt-3 text-base font-semibold text-gray-900">
                            {freelancer.price}
                          </p>

                          <button
                            className="mt-4 w-full bg-[#FF6B35]/10 text-[#FF6B35] px-4 py-2 text-sm rounded-md font-semibold cursor-default"
                          >
                            Invited
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6 sticky top-24 h-fit">

              {/* ACTION CARD */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm shadow-[#1B365D]/5">
                <div className="text-center mb-6 border-b pb-4 border-gray-100">
                  <p className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">{jobData.budgetType || "Fixed"} Budget</p>
                  <p className="text-4xl font-extrabold text-[#1B365D]">{currencySymbol}{Number(jobData.budget || 0).toLocaleString()}</p>
                </div>

                <div className="space-y-4">
                  <button onClick={handlePostJob}
                    className="w-full flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#E25A24] text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-[#FF6B35]/20 hover:shadow-lg hover:-translate-y-0.5">
                    <Send className="w-5 h-5" />
                    Post Job
                  </button>

                  <button onClick={handleSaveDraft} 
                    className="w-full flex items-center justify-center gap-2 border-2 border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D]/5 py-3.5 rounded-xl font-bold transition-all">
                    <Save className="w-5 h-5" />
                    Save as Draft
                  </button>

                  <button onClick={handleEditJob} 
                    className="w-full flex items-center justify-center gap-2 text-[#1B365D] hover:text-[#FF6B35] transition-colors py-2 text-sm font-semibold hover:underline">
                    <Edit className="w-4 h-4" />
                    Edit Job Details
                  </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold mr-2">Status:</span>
                  <span className="bg-[#FF6B35]/10 text-[#FF6B35] text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                    {jobData.status || "PREVIEW"}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* <FooterSection /> */}
    </>
  );
};

export default CurrentJobPost;