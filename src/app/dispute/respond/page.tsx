"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiUpload,
  FiX,
  FiFileText,
  FiArrowLeft,
  FiSend,
} from "react-icons/fi";

interface DisputeData {
  id: string;
  jobTitle: string;
  disputeType: string;
  title: string;
  description: string;
  raisedBy: string;
  clientName: string;
  freelancerName: string;
  disputeWorkflowStatus: string;
  createdAt: string;
  chatId: string | null;
  hasFreelancerResponse?: boolean;
  hasClientStatement?: boolean;
  freelancerResponse?: any;
  clientStatement?: any;
  creatorAdditionalEvidence?: any;
  status: string;
  resolvedAt?: string | null;
  resolutionSummary?: any;
}

const DISPUTE_TYPE_LABELS: Record<string, string> = {
  quality_issue: "Quality Issue",
  deadline_missed: "Deadline Missed",
  incomplete_work: "Incomplete Work",
  communication_breakdown: "Communication Breakdown",
  payment_dispute: "Payment Dispute",
  scope_creep: "Scope Changed",
  other: "Other",
};

const WORKFLOW_STEPS = [
  { key: "raised", label: "Dispute Raised" },
  { key: "awaiting_response", label: "Awaiting Response" },
  { key: "admin_reviewing", label: "Under Review" },
  { key: "resolution_drafted", label: "Resolution Drafted" },
  { key: "resolved", label: "Resolved" },
];

export default function DisputeRespondPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const disputeId = searchParams.get("disputeId");
  const role = searchParams.get("role") || ""; // "client" or "freelancer"

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [description, setDescription] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch dispute data with useQuery
  const { data: dispute = null, isLoading: loading, error: queryError } = useQuery({
    queryKey: ["dispute", disputeId],
    queryFn: async () => {
      if (!disputeId) return null;
      const res = await fetch(`/api/disputes/${disputeId}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Could not load dispute information.");
      return data.data as DisputeData;
    },
    enabled: !!disputeId && status === "authenticated",
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const error = queryError ? (queryError as Error).message : null;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Check if response already submitted
  useEffect(() => {
    if (dispute) {
      const isCreator = dispute.raisedBy === role;
      if (isCreator) {
        if (dispute.creatorAdditionalEvidence) {
          setSubmitted(true);
        }
      } else {
        if (role === "freelancer" && dispute.freelancerResponse) {
          setSubmitted(true);
        } else if (role === "client" && dispute.clientStatement) {
          setSubmitted(true);
        }
      }
    }
  }, [dispute, role]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setMediaFiles(prev => [...prev, ...selected].slice(0, 10));
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async (uploadedFiles: any[]) => {
      if (!dispute) return;
      const res = await fetch(`/api/disputes/${dispute.id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim(),
          additionalNotes: additionalNotes.trim(),
          mediaFiles: uploadedFiles,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to submit response.");
      return data;
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["dispute", disputeId] });
      queryClient.invalidateQueries({ queryKey: ["dispute", "my"] });
    },
    onError: (err: any) => {
      alert(err.message || "Failed to submit response. Please try again.");
    }
  });

  const handleSubmit = async () => {
    if (!dispute) return;
    const isCreator = dispute.raisedBy === role;

    if (!isCreator) {
      if (!description.trim()) return;
      if (description.trim().length < 20) {
        alert("Please provide a more detailed response (min 20 characters).");
        return;
      }
    } else {
      if (!description.trim() && mediaFiles.length === 0) {
        alert("Please write a comment or upload at least one file before submitting.");
        return;
      }
    }

    setSubmitting(true);
    try {
      // Upload media files first if any
      const uploadedFiles: any[] = [];
      for (const file of mediaFiles) {
        try {
          const formData = new FormData();
          formData.append("file", file);
          const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            uploadedFiles.push({ fileName: file.name, fileUrl: uploadData.url || uploadData.fileUrl });
          }
        } catch {
          // Skip failed uploads
        }
      }

      await submitMutation.mutateAsync(uploadedFiles);
    } catch {
      // Handled in mutation onError
    } finally {
      setSubmitting(false);
    }
  };

  const currentStepIndex = WORKFLOW_STEPS.findIndex(s => s.key === dispute?.disputeWorkflowStatus);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading dispute information...</p>
        </div>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full text-center shadow-sm space-y-4">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FiAlertTriangle size={24} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Could Not Load Dispute</h2>
          <p className="text-gray-500 text-sm">{error || "Dispute not found or you don't have access."}</p>
          <button onClick={() => router.back()} className="px-6 py-2.5 bg-[#0f2744] text-white rounded-xl text-sm font-semibold hover:bg-[#1a3a5c] transition-colors">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const myRole = role || (session?.user?.role === "client" ? "client" : "freelancer");
  const myName = myRole === "client" ? dispute.clientName : dispute.freelancerName;
  const otherName = myRole === "client" ? dispute.freelancerName : dispute.clientName;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-all"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-bold text-[#0f2744] text-base">
              {dispute.raisedBy === role ? "Submit Additional Evidence" : "Submit Your Response"}
            </h1>
            <p className="text-xs text-gray-400">
              {dispute.raisedBy === role ? "Add comments or evidence" : "Dispute Response"} — {dispute.jobTitle}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Status Banner */}
        {dispute.status === "resolved" ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-2.5 bg-green-100 rounded-xl shrink-0">
              <FiCheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-green-800 text-sm">Dispute Resolved</h3>
              <p className="text-green-700 text-xs mt-1 leading-relaxed">
                This dispute has been officially resolved by our administrative team. Communication has been restored. Please find the final decision and resolution report below.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="p-2.5 bg-amber-100 rounded-xl shrink-0">
              <FiAlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-amber-800 text-sm">Dispute Under Review</h3>
              <p className="text-amber-700 text-xs mt-1 leading-relaxed">
                {dispute.raisedBy === role ? (
                  <>
                    You raised a dispute on contract <span className="font-semibold">"{dispute.jobTitle}"</span>. Communication has been temporarily frozen while our team reviews the case. You can submit any additional evidence or comments below if needed.
                  </>
                ) : (
                  <>
                    A dispute has been raised on your contract <span className="font-semibold">"{dispute.jobTitle}"</span>. Communication has been temporarily frozen while our team reviews the case. Please submit your response and supporting evidence below.
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Dispute Progress Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#0f2744]">Dispute Progress</h3>
          <div className="flex items-center gap-0">
            {WORKFLOW_STEPS.map((step, idx) => {
              const isCompleted = dispute.status === "resolved" ? idx <= currentStepIndex : idx < currentStepIndex;
              const isCurrent = dispute.status === "resolved" ? false : idx === currentStepIndex;
              const isLast = idx === WORKFLOW_STEPS.length - 1;
              return (
                <div key={step.key} className="flex items-center flex-1 min-w-0">
                  <div className="flex flex-col items-center gap-1.5 min-w-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 transition-all ${
                      isCompleted ? "bg-green-500 border-green-500" :
                      isCurrent ? "bg-[#FF6B35] border-[#FF6B35]" :
                      "bg-white border-gray-300"
                    }`}>
                      {isCompleted ? <FiCheckCircle size={13} className="text-white" /> : <div className={`w-2 h-2 rounded-full ${isCurrent ? "bg-white" : "bg-gray-300"}`} />}
                    </div>
                    <span className={`text-[9px] font-semibold text-center leading-tight ${isCurrent ? "text-[#FF6B35]" : isCompleted ? "text-green-600" : "text-gray-400"}`}>
                      {step.label}
                    </span>
                  </div>
                  {!isLast && <div className={`h-0.5 flex-1 mx-1 mb-4 ${isCompleted ? "bg-green-400" : "bg-gray-200"}`} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dispute Details (Original — read-only) */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#0f2744]">📋 Dispute Details</h3>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded-full">
              {DISPUTE_TYPE_LABELS[dispute.disputeType] || dispute.disputeType}
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Dispute Title</p>
              <p className="text-base font-bold text-gray-900">{dispute.title}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Issue Description</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">
                {dispute.description}
              </p>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                Note: The other party's requested resolution/demands are not shown to ensure a fair response.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Raised By</p>
                <p className="font-semibold text-gray-800 capitalize mt-0.5">{dispute.raisedBy === myRole ? "You" : otherName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Date Raised</p>
                <p className="font-semibold text-gray-800 mt-0.5">{new Date(dispute.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Response / Evidence details */}
        {submitted && (() => {
          const myResponse = dispute?.raisedBy === role
            ? dispute?.creatorAdditionalEvidence
            : role === "freelancer"
              ? dispute?.freelancerResponse
              : dispute?.clientStatement;

          if (!myResponse) return null;

          return (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden text-left shadow-sm">
              <div className="bg-[#f0fdf4] border-b border-green-100 px-5 py-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-green-900 flex items-center gap-1.5">
                  <FiCheckCircle className="text-green-600" />
                  {dispute?.raisedBy === role ? "Your Submitted Evidence" : "Your Submitted Response / Defense"}
                </h3>
                <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Submitted
                </span>
              </div>
              <div className="p-5 space-y-4">
                {myResponse.description && (
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                      {dispute?.raisedBy === role ? "Comments / Explanation" : "Statement / Defense"}
                    </span>
                    <p className="text-sm text-gray-800 bg-gray-50 rounded-xl p-3.5 border border-gray-200/60 leading-relaxed whitespace-pre-wrap">
                      {myResponse.description}
                    </p>
                  </div>
                )}
                
                {myResponse.additionalNotes && (
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                      Additional Notes
                    </span>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 border border-gray-200/60 leading-relaxed whitespace-pre-wrap">
                      {myResponse.additionalNotes}
                    </p>
                  </div>
                )}

                {myResponse.mediaFiles && myResponse.mediaFiles.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block mb-2">
                      Attached Files
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {myResponse.mediaFiles.map((file: any, i: number) => (
                        <a
                          key={i}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 text-green-600 group-hover:bg-green-100 transition-colors">
                            <FiFileText size={16} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-800 truncate group-hover:text-green-705 transition-colors">
                              {file.name || `Attachment ${i + 1}`}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5 capitalize">
                              {file.type ? file.type.split("/")[1] || file.type : "File"}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* Resolution details or Response Form/Submitted Success */}
        {dispute.status === "resolved" ? (
          <div className="space-y-6">
            {/* Official Resolution Report */}
            <div className="bg-white rounded-2xl border border-green-200 overflow-hidden shadow-sm animate-fade-in text-left">
              <div className="bg-[#f0fdf4] border-b border-green-100 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FiCheckCircle className="text-green-600" />
                  <h3 className="text-sm font-bold text-green-900">⚖️ Official Resolution Report</h3>
                </div>
                <span className="text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Resolved
                </span>
              </div>
              <div className="p-5 space-y-6">
                <div>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Resolution Summary</p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">
                    {dispute.resolutionSummary?.resolutionTitle || "Dispute Resolved"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Category: <span className="font-semibold text-gray-700 capitalize">{dispute.resolutionSummary?.resolutionCategory || "Other"}</span>
                  </p>
                </div>

                {dispute.resolutionSummary?.finalDecision && (
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Final Decision / Verdict</p>
                    <div className="text-sm text-gray-800 bg-gray-50 rounded-xl p-4 border border-gray-150 leading-relaxed whitespace-pre-wrap">
                      {dispute.resolutionSummary.finalDecision}
                    </div>
                  </div>
                )}

                {dispute.resolutionSummary?.financial && (
                  <div className="border border-gray-200 rounded-xl p-4 bg-green-50/20 space-y-3">
                    <p className="text-xs text-green-800 font-bold uppercase tracking-wider">💵 Settlement Breakdown</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="bg-white rounded-lg p-3 border border-gray-150">
                        <p className="text-xs text-gray-400">Refunded to Client</p>
                        <p className="text-lg font-extrabold text-blue-600 mt-0.5">
                          ₹{Number(dispute.resolutionSummary.financial.refundClientAmount || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-gray-150">
                        <p className="text-xs text-gray-400">Released to Freelancer</p>
                        <p className="text-lg font-extrabold text-green-600 mt-0.5">
                          ₹{Number(dispute.resolutionSummary.financial.releaseFreelancerAmount || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {dispute.resolutionSummary?.adminNotes && (
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Admin Remarks</p>
                    <p className="text-xs text-gray-600 leading-relaxed bg-amber-50/30 border border-amber-100 rounded-xl p-3.5">
                      {dispute.resolutionSummary.adminNotes}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
                  <span>Resolved by: <strong className="text-gray-600">{dispute.resolutionSummary?.resolvedBy || "System Admin"}</strong></span>
                  <span>
                    Resolution Date:{" "}
                    <strong className="text-gray-600">
                      {dispute.resolvedAt 
                        ? new Date(dispute.resolvedAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })
                        : "N/A"}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Return to Chat Button */}
            {dispute.chatId && (
              <div className="text-center">
                <button
                  onClick={() => router.push(`/${myRole}/messages?chatId=${dispute.chatId}`)}
                  className="px-6 py-2.5 bg-[#0f2744] text-white rounded-xl text-sm font-semibold hover:bg-[#1a3a5c] transition-colors"
                >
                  Return to Contract Chat
                </button>
              </div>
            )}
          </div>
        ) : submitted ? (
          <div className="bg-white rounded-2xl border border-green-200 p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FiCheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {dispute.raisedBy === role ? "Evidence Submitted!" : "Response Submitted!"}
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              {dispute.raisedBy === role ? (
                "Your additional evidence and comments have been added to the case. Our admin team will review all submissions and get back to you with a resolution."
              ) : (
                "Your response has been submitted successfully. Our admin team will review both submissions and get back to you with a resolution."
              )}
            </p>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-left space-y-2">
              <p className="text-xs text-gray-500">What happens next:</p>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-start gap-2"><span className="text-[#FF6B35] mt-0.5">→</span> Admin team reviews both submissions</li>
                <li className="flex items-start gap-2"><span className="text-[#FF6B35] mt-0.5">→</span> A resolution is drafted and published</li>
                <li className="flex items-start gap-2"><span className="text-[#FF6B35] mt-0.5">→</span> Both parties are notified and chat is reopened</li>
              </ul>
            </div>
            {dispute.chatId && (
              <button onClick={() => router.push(`/${myRole}/messages?chatId=${dispute.chatId}`)} className="px-6 py-2.5 bg-[#0f2744] text-white rounded-xl text-sm font-semibold hover:bg-[#1a3a5c] transition-colors">
                Return to Contract Chat
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-5 py-3">
              <h3 className="text-sm font-bold text-[#0f2744]">
                {dispute.raisedBy === role ? "✍️ Add Evidence" : "✍️ Your Response"}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {dispute.raisedBy === role 
                  ? "Provide any additional comments, explanation, or supporting files" 
                  : "Provide your explanation, defense, and any supporting evidence"}
              </p>
            </div>
            <div className="p-5 space-y-5">
              {/* Main Response */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2 text-left">
                  {dispute.raisedBy === role ? "Additional Comments / Explanation" : "Your Response / Explanation"}
                  {dispute.raisedBy !== role && <span className="text-red-500"> *</span>}
                  <span className="font-normal text-gray-400 ml-1">
                    {dispute.raisedBy === role ? "(optional)" : "(min 20 characters)"}
                  </span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={`Explain your side of the situation. Include relevant context, timeline of events, and any facts that support your position. Be clear and factual.\n\nExample: "The work was delivered on [date] as agreed. The client requested additional revisions beyond the agreed scope..."`}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35] transition-colors resize-none"
                />
                <p className={`text-xs mt-1 text-right ${description.length < 20 && description.length > 0 ? "text-red-500" : "text-gray-400"}`}>
                  {description.length} characters
                </p>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2 text-left">
                  Additional Notes / Context <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="Any additional context, references to communications, or clarifying information..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#FF6B35] transition-colors resize-none"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2 text-left">
                  Supporting Evidence <span className="text-gray-400 font-normal">(optional — max 10 files)</span>
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-[#FF6B35]/40 hover:bg-orange-50/20 transition-all group"
                >
                  <FiUpload size={20} className="mx-auto text-gray-400 group-hover:text-[#FF6B35] transition-colors mb-2" />
                  <p className="text-sm text-gray-500 group-hover:text-gray-700">Click to upload files</p>
                  <p className="text-xs text-gray-400 mt-1">Images, PDFs, documents — Max 10 files</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  />
                </div>
                {mediaFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {mediaFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200">
                        <FiFileText size={14} className="text-orange-500 shrink-0" />
                        <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                        <span className="text-xs text-gray-400 shrink-0">{(file.size / 1024).toFixed(0)} KB</span>
                        <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                          <FiX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting || 
                    (dispute.raisedBy !== role && description.trim().length < 20) ||
                    (dispute.raisedBy === role && !description.trim() && mediaFiles.length === 0)
                  }
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF6B35] hover:bg-[#e55a2b] text-white rounded-xl text-sm font-bold shadow-md shadow-orange-900/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                  ) : (
                    <><FiSend size={15} /> {dispute.raisedBy === role ? "Submit Additional Evidence" : "Submit My Response"}</>
                  )}
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  Once submitted, your response cannot be edited. The admin team will be notified immediately.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
