"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Star, CheckCircle, Clock, DollarSign, Calendar, ChevronLeft, User, ArrowLeft, Loader2 } from "lucide-react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";

interface ReviewData {
  rating: number;
  comment: string;
  reviewedAt: string;
}

interface FreelancerInfo {
  _id: string;
  name: string;
  email: string;
  image?: string;
  rating: number;
  hourlyRate: number;
  completedJobs: number;
  location: string;
}

interface JobData {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  completedAt: string;
  budget: number;
  finalAmount: number;
  durationInDays: number;
  clientReview?: ReviewData;
  freelancerReview?: ReviewData;
  freelancerInfo?: FreelancerInfo;
}

function timeAgo(dateString: string): string {
  if (!dateString) return "Recently";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
  return `${years} year${years !== 1 ? 's' : ''} ago`;
}

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

import { useClientCompletedJobs } from "@/hooks/queries/useClientJobs";
import { useMutation } from "@tanstack/react-query";
import { getCurrencySymbol } from "@/utils/currency";

export default function CompletedJobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const jobId = Array.isArray(id) ? id[0] : id;

  // Review Form State
  const [isReviewing, setIsReviewing] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewError, setReviewError] = useState("");

  // Use React Query to fetch client completed jobs
  const { data: completedJobsData, isLoading: loading, error: queryError, refetch } = useClientCompletedJobs({ page: 1, limit: 100 });
  
  const job = completedJobsData?.jobs?.find((j: any) => j._id === jobId) || null;
  const error = queryError ? (queryError as Error).message : (!loading && !job ? "Job not found in your completed jobs list" : "");

  // Review submission mutation
  const submitReviewMutation = useMutation({
    mutationFn: async ({ rating, reviewText }: { rating: number; reviewText: string }) => {
      const res = await fetch(`/api/jobs/${jobId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review: reviewText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");
      return data;
    },
    onSuccess: () => {
      // Reset form and refetch to show the new review
      setIsReviewing(false);
      setRating(0);
      setReviewText("");
      setReviewError("");
      refetch();
    },
    onError: (err: any) => {
      setReviewError(err.message || "Failed to submit review");
    }
  });

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setReviewError("Please select a star rating.");
      return;
    }
    setReviewError("");
    submitReviewMutation.mutate({ rating, reviewText });
  };

  const submittingReview = submitReviewMutation.isPending;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600 font-medium text-sm">Loading job details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-24 pb-12">
          <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Job</h2>
            <p className="text-slate-600 mb-6">{error || "Job could not be loaded."}</p>
            <button 
              onClick={() => router.push("/client-dashboard")}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-lg hover:bg-slate-800 font-medium transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Calculate Average Rating dynamically if both exist
  const hasClientReview = !!job.clientReview;
  const hasFreelancerReview = !!job.freelancerReview;
  
  let averageRating: number | null = null;
  if (hasClientReview && hasFreelancerReview) {
    averageRating = (job.clientReview!.rating + job.freelancerReview!.rating) / 2;
  } else if (hasClientReview) {
    averageRating = job.clientReview!.rating;
  } else if (hasFreelancerReview) {
    averageRating = job.freelancerReview!.rating;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Back Button & Header */}
          <div className="mb-6 flex items-center gap-2">
            <button 
              onClick={() => router.back()}
              className="text-slate-500 hover:text-slate-900 transition-colors p-2 -ml-2 rounded-lg hover:bg-slate-100 flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* LEFT SECTION - Job Details & Reviews */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Job Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-500"></div>
                <div className="p-7">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                      {job.title}
                    </h1>
                    <span className="shrink-0 inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full border border-emerald-100">
                      Completed
                    </span>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-sm text-slate-600 mb-8 pb-6 border-b border-slate-100">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-orange-500" />
                      Posted {timeAgo(job.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Completed {formatDate(job.completedAt)}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      {getCurrencySymbol(job.currency || "GBP")}{job.finalAmount?.toLocaleString() || job.budget?.toLocaleString()}
                    </span>
                  </div>

                  {/* SUMMARY */}
                  <div className="space-y-4">
                    <h2 className="font-bold text-slate-900 text-lg">Job Description</h2>
                    <div className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap">
                      {job.description || "No description provided."}
                    </div>
                  </div>
                </div>
              </div>

              {/* REVIEWS & RATINGS SECTION */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                  <h2 className="text-xl font-bold text-slate-900">Feedback & Ratings</h2>
                  {averageRating !== null && (
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                      <span className="text-sm font-semibold text-slate-600">Average:</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-900">{averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {!hasClientReview && !hasFreelancerReview ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-6 h-6 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No feedback has been left for this job yet.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Client Review (Top) */}
                    {hasClientReview ? (
                      <div>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
                            <User className="w-6 h-6" />
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div>
                                <h4 className="font-bold text-slate-900">Your Feedback</h4>
                                <span className="text-xs font-medium text-slate-500">Client</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < job.clientReview!.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} 
                                    />
                                  ))}
                                  <span className="ml-2 font-bold text-slate-700 text-sm">{job.clientReview!.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-xs text-slate-400">• {formatDate(job.clientReview!.reviewedAt)}</span>
                              </div>
                            </div>
                            {job.clientReview!.comment ? (
                              <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                "{job.clientReview!.comment}"
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200 border-dashed">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-grow pt-1">
                          {!isReviewing ? (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <p className="text-sm font-medium text-slate-500 italic">You haven't left feedback yet.</p>
                              <button
                                onClick={() => setIsReviewing(true)}
                                className="px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-lg text-sm font-bold transition-colors border border-orange-200"
                              >
                                Leave Feedback
                              </button>
                            </div>
                          ) : (
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mt-2">
                              <h4 className="font-bold text-slate-900 mb-4">Rate the Freelancer</h4>
                              
                              <div className="flex items-center gap-2 mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                                  >
                                    <Star 
                                      className={`w-8 h-8 ${rating >= star ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} 
                                    />
                                  </button>
                                ))}
                                <span className="ml-3 text-sm font-medium text-slate-500">
                                  {rating === 0 ? "Select a rating" : `${rating} out of 5`}
                                </span>
                              </div>

                              <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder="Share your experience working with this freelancer..."
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none min-h-[100px] mb-3"
                              />

                              {reviewError && (
                                <p className="text-red-500 text-sm mb-3 font-medium">{reviewError}</p>
                              )}

                              <div className="flex justify-end gap-3">
                                <button
                                  onClick={() => setIsReviewing(false)}
                                  disabled={submittingReview}
                                  className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleSubmitReview}
                                  disabled={submittingReview || rating === 0}
                                  className="px-6 py-2 bg-slate-900 text-white font-medium text-sm rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                  {submittingReview && <Loader2 className="w-4 h-4 animate-spin" />}
                                  {submittingReview ? "Submitting..." : "Submit Feedback"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Freelancer Reply (Bottom) */}
                    <div className="relative">
                      {/* Connection line */}
                      <div className="absolute top-0 bottom-0 left-6 w-px bg-slate-200 -ml-px -mt-6 h-12 hidden sm:block"></div>
                      
                      {hasFreelancerReview ? (
                        <div className="flex items-start gap-4 sm:ml-10 relative">
                          {/* Connection curve */}
                          <div className="absolute top-6 left-[-16px] w-4 h-px bg-slate-200 hidden sm:block"></div>

                          <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                            {job.freelancerInfo?.image ? (
                              <img src={job.freelancerInfo.image} alt={job.freelancerInfo.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-lg">{(job.freelancerInfo?.name || "F").charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div>
                                <h4 className="font-bold text-slate-900">{job.freelancerInfo?.name || "Freelancer"}</h4>
                                <span className="text-xs font-medium text-orange-500">Freelancer Reply</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-4 h-4 ${i < job.freelancerReview!.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} 
                                    />
                                  ))}
                                  <span className="ml-2 font-bold text-slate-700 text-sm">{job.freelancerReview!.rating.toFixed(1)}</span>
                                </div>
                                <span className="text-xs text-slate-400">• {formatDate(job.freelancerReview!.reviewedAt)}</span>
                              </div>
                            </div>
                            {job.freelancerReview!.comment ? (
                              <p className="text-slate-700 text-sm leading-relaxed bg-white border border-slate-200 shadow-sm p-4 rounded-xl">
                                "{job.freelancerReview!.comment}"
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-4 sm:ml-10 relative opacity-60">
                          {/* Connection curve */}
                          <div className="absolute top-6 left-[-16px] w-4 h-px bg-slate-200 hidden sm:block"></div>
                          
                          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200 border-dashed">
                            {(job.freelancerInfo?.name || "F").charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow pt-3">
                            <p className="text-sm font-medium text-slate-500 italic">
                              {job.freelancerInfo?.name || "Freelancer"} hasn't left feedback yet.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SECTION - About the Freelancer */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-28 p-6">
                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide mb-6 pb-4 border-b border-slate-100">
                  About the Freelancer
                </h3>

                {job.freelancerInfo ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md overflow-hidden">
                        {job.freelancerInfo.image ? (
                          <img src={job.freelancerInfo.image} alt={job.freelancerInfo.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-2xl">{(job.freelancerInfo.name || "F").charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg leading-tight">{job.freelancerInfo.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-slate-800 text-sm">{job.freelancerInfo.rating ? job.freelancerInfo.rating.toFixed(1) : "New"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Location</span>
                        <span className="font-bold text-slate-900 text-right flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.freelancerInfo.location || "Unknown"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Completed Jobs</span>
                        <span className="font-bold text-slate-900">{job.freelancerInfo.completedJobs || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Hourly Rate</span>
                        <span className="font-bold text-slate-900">{job.freelancerInfo.hourlyRate ? `${getCurrencySymbol(job.currency || "GBP")}${job.freelancerInfo.hourlyRate}/hr` : "N/A"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 text-sm font-medium">
                    Freelancer details unavailable.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
