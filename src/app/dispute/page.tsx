"use client";

import React, { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection";
import {
  AlertTriangle, Upload, X, Image as ImageIcon,
  Video, FileText, ChevronRight, ChevronLeft,
  CheckCircle, Clock, DollarSign, MessageSquare,
  Paperclip, Send, Info, Shield, Loader2, Play
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type DisputeType =
  | "quality_issue"
  | "deadline_missed"
  | "incomplete_work"
  | "communication_breakdown"
  | "payment_dispute"
  | "scope_creep"
  | "other";

type ResolutionType = "full_refund" | "partial_refund" | "redo_work" | "milestone_revision" | "mediation";

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
  name: string;
  size: string;
}

interface Milestone {
  _id: string;
  title: string;
  amount: number;
  status: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DISPUTE_TYPES: { value: DisputeType; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "quality_issue", label: "Quality Issue", icon: <AlertTriangle size={18} />, desc: "Delivered work does not meet agreed standards" },
  { value: "deadline_missed", label: "Deadline Missed", icon: <Clock size={18} />, desc: "Work not delivered within the agreed timeline" },
  { value: "incomplete_work", label: "Incomplete Work", icon: <FileText size={18} />, desc: "Partial or unfinished deliverables received" },
  { value: "communication_breakdown", label: "Communication Breakdown", icon: <MessageSquare size={18} />, desc: "Freelancer became unresponsive or unreachable" },
  { value: "payment_dispute", label: "Payment Dispute", icon: <DollarSign size={18} />, desc: "Disagreement over payment amount or terms" },
  { value: "scope_creep", label: "Scope Changed", icon: <ChevronRight size={18} />, desc: "Work deviated significantly from original scope" },
  { value: "other", label: "Other", icon: <Info size={18} />, desc: "Issue not covered by above categories" },
];

const RESOLUTION_TYPES: { value: ResolutionType; label: string; desc: string }[] = [
  { value: "full_refund", label: "Full Refund", desc: "Receive 100% of escrow amount back" },
  { value: "partial_refund", label: "Partial Refund", desc: "Receive portion based on work done" },
  { value: "redo_work", label: "Redo the Work", desc: "Freelancer redoes deliverables at no cost" },
  { value: "milestone_revision", label: "Milestone Revision", desc: "Revise specific milestone before payment" },
  { value: "mediation", label: "Request Mediation", desc: "Platform team reviews and decides" },
];

// ─── Inner Component (uses useSearchParams) ───────────────────────────────────
function DisputePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Context from query params
  const chatId = searchParams.get("chatId");
  const jobId = searchParams.get("jobId");
  const clientId = searchParams.get("clientId");
  const freelancerId = searchParams.get("freelancerId");

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form fields
  const [disputeType, setDisputeType] = useState<DisputeType | "">("");
  const [disputeTitle, setDisputeTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resolution, setResolution] = useState<ResolutionType | "">("");
  const [partialAmount, setPartialAmount] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState("");

  // Data
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loadingMilestones, setLoadingMilestones] = useState(false);

  // Media
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  // UI
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");

  // ── Fetch Milestones ────────────────────────────────────────────────────────
  useEffect(() => {
    if (jobId) {
      setLoadingMilestones(true);
      fetch(`/api/milestones?jobId=${jobId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            const filterableMilestones = (data.milestones || []).filter((m: Milestone) =>
              m.status !== 'locked' && m.status !== 'proposed'
            );
            setMilestones(filterableMilestones);
          }
        })
        .catch(err => console.error("Error fetching milestones:", err))
        .finally(() => setLoadingMilestones(false));
    }
  }, [jobId]);

  // ── Media Helpers ──────────────────────────────────────────────────────────
  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addFiles = useCallback((files: File[]) => {
    const newMedia: MediaFile[] = [];
    for (const file of files) {
      if (mediaFiles.length + newMedia.length >= 10) break;
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) continue;
      if (isVideo && file.size > 100 * 1024 * 1024) continue;
      if (isImage && file.size > 10 * 1024 * 1024) continue;

      const preview = isImage ? URL.createObjectURL(file) : "";
      newMedia.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview,
        type: isImage ? "image" : "video",
        name: file.name,
        size: formatSize(file.size),
      });
    }
    setMediaFiles(prev => [...prev, ...newMedia]);
  }, [mediaFiles.length]);

  const removeFile = (id: string) => {
    setMediaFiles(prev => {
      const f = prev.find(m => m.id === id);
      if (f?.preview) URL.revokeObjectURL(f.preview);
      return prev.filter(m => m.id !== id);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  // ── Step Validation ────────────────────────────────────────────────────────
  const canProceedStep1 = disputeType !== "" && disputeTitle.trim().length >= 5 && description.trim().length >= 1;
  const canProceedStep2 = true;
  const canSubmit = resolution !== "" && agreeTerms && (resolution !== "partial_refund" || partialAmount !== "");

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!session) return;
    setSubmitting(true);

    try {
      const uploadedMedia = [];
      if (mediaFiles.length > 0) {
        for (const mf of mediaFiles) {
          const formData = new FormData();
          formData.append("file", mf.file);
          formData.append("jobId", jobId || "general");

          const uploadRes = await fetch("/api/disputes/upload", {
            method: "POST",
            body: formData,
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            if (uploadData.success) {
              uploadedMedia.push({
                fileUrl: uploadData.fileUrl,
                fileName: uploadData.fileName,
                fileType: uploadData.fileType,
                fileSize: uploadData.fileSize,
              });
            }
          }
        }
      }

      const response = await fetch("/api/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId,
          jobId,
          milestoneId: selectedMilestone || null,
          clientId,
          freelancerId,
          raisedBy: session.user.role,
          disputeType,
          title: disputeTitle,
          description,
          resolution,
          partialAmount,
          additionalNotes,
          mediaFiles: uploadedMedia
        })
      });

      const data = await response.json();
      if (data.success) {
        setTicketId(data.disputeId);
        setSubmitted(true);
      } else {
        alert(data.message || "Failed to submit dispute");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success Screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FAFBFC]">
        <Header />
        <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-[#1A1D23] mb-3">Dispute Submitted</h1>
            <p className="text-[#6B7280] mb-8">
              Your dispute has been filed and our team has been notified.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-8 text-left">
              <p className="font-semibold mb-1">⚡ What happens next?</p>
              <ul className="space-y-1 list-disc list-inside text-amber-700">
                <li>Counterparty will be notified within 24 hours</li>
                <li>Both parties can respond with evidence</li>
                <li>Platform team reviews within 3–5 business days</li>
                <li>Escrow remains held until resolution</li>
              </ul>
            </div>
            <button
              onClick={() => router.push(session?.user?.role === 'client' ? "/client-dashboard" : "/freelancer-dashboard")}
              className="w-full py-3 bg-[#1B365D] text-white rounded-xl font-semibold hover:bg-[#102542] transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <Header />

      <div className="pt-20 pb-16">
        <div className="max-w-2xl mx-auto px-4 py-8">

          {/* ── Page Header ──────────────────────────────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#1A1D23]">File a Dispute</h1>
                <p className="text-sm text-[#6B7280]">Report an issue with your job or milestone</p>
              </div>
            </div>

            {/* Escrow notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">
                <strong>Escrow Protected:</strong> All payments are held safely until the dispute is resolved. No money is released or refunded until a decision is made.
              </p>
            </div>
          </div>

          {/* ── Step Indicator ───────────────────────────────────────────── */}
          <div className="flex items-center mb-8">
            {[
              { n: 1, label: "Describe Issue" },
              { n: 2, label: "Add Evidence" },
              { n: 3, label: "Resolution" },
            ].map(({ n, label }, i) => (
              <React.Fragment key={n}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > n ? "bg-green-500 text-white" :
                    step === n ? "bg-[#1B365D] text-white" :
                      "bg-gray-200 text-gray-500"
                    }`}>
                    {step > n ? <CheckCircle size={16} /> : n}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${step === n ? "text-[#1B365D]" : "text-gray-400"}`}>
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${step > n ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* STEP 1 — Describe Issue                                        */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="space-y-6">

              {/* Dispute Type */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1D23] mb-3">
                  What type of issue are you facing? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {DISPUTE_TYPES.map((dt) => (
                    <button
                      key={dt.value}
                      onClick={() => setDisputeType(dt.value)}
                      className={`text-left p-3 rounded-xl border-2 transition-all ${disputeType === dt.value
                        ? "border-[#FF6B35] bg-orange-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={disputeType === dt.value ? "text-[#FF6B35]" : "text-gray-400"}>
                          {dt.icon}
                        </span>
                        <span className="font-semibold text-sm text-[#1A1D23]">{dt.label}</span>
                      </div>
                      <p className="text-xs text-[#6B7280] leading-snug">{dt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dispute Title */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1D23] mb-2">
                  Dispute Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={disputeTitle}
                  onChange={e => setDisputeTitle(e.target.value)}
                  placeholder="e.g. Frontend design looks completely different from what was agreed"
                  maxLength={120}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1D23] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B365D] focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{disputeTitle.length}/120</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1D23] mb-2">
                  Describe the Issue in Detail <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain clearly what went wrong. Include specific examples, dates, and what was originally agreed vs what was delivered..."
                  rows={5}
                  maxLength={2000}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1D23] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B365D] focus:border-transparent resize-none"
                />
                <div className="flex justify-end mt-1">
                  <p className="text-xs text-gray-400">{description.length}/2000</p>
                </div>
              </div>

              {/* Affected Milestone (optional) */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1D23] mb-2">
                  Affected Milestone <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <select
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1D23] focus:outline-none focus:ring-2 focus:ring-[#1B365D] focus:border-transparent"
                  value={selectedMilestone}
                  onChange={(e) => setSelectedMilestone(e.target.value)}
                  disabled={loadingMilestones}
                >
                  <option value="">— Select milestone (if applicable) —</option>
                  {milestones.map((m) => (
                    <option key={m._id} value={m._id}>{m.title} (₹{m.amount.toLocaleString()})</option>
                  ))}
                  <option value="entire_job">Entire Job</option>
                </select>
                {loadingMilestones && <p className="text-[10px] text-gray-400 mt-1">Loading milestones...</p>}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="w-full py-3.5 bg-[#FF6B35] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#ff6920] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Evidence <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* STEP 2 — Add Evidence (Images + Videos)                        */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-semibold text-[#1A1D23] mb-1">
                  Upload Evidence <span className="text-gray-400 font-normal">(optional but recommended)</span>
                </label>
                <p className="text-xs text-[#6B7280] mb-4">
                  Add screenshots, screen recordings, or videos that support your claim. Max 10 files — Images up to 10MB each, Videos up to 100MB each.
                </p>

                {/* Drop Zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragOver ? "border-[#FF6B35] bg-orange-50" : "border-gray-300 bg-white hover:border-gray-400"
                    }`}
                >
                  <div className="flex justify-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Video className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#1A1D23] mb-1">
                    Drag & drop files here
                  </p>
                  <p className="text-xs text-[#6B7280] mb-4">PNG, JPG, GIF, MP4, MOV, WebM</p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#FF6B35] text-white text-sm rounded-lg font-medium hover:bg-[#ff6920] transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Upload size={15} /> Upload Files
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={e => addFiles(Array.from(e.target.files || []))}
                  />
                </div>

                {mediaFiles.length > 0 && (
                  <p className="text-xs text-[#6B7280] mt-2">
                    {mediaFiles.length}/10 files uploaded
                  </p>
                )}

                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                    {mediaFiles.map((mf) => (
                      <div key={mf.id} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white">
                        {mf.type === "image" ? (
                          <img
                            src={mf.preview}
                            alt={mf.name}
                            className="w-full h-28 object-cover"
                          />
                        ) : (
                          <div className="w-full h-28 bg-gray-900 flex flex-col items-center justify-center">
                            <Play className="w-8 h-8 text-white/70 mb-1" />
                            <span className="text-xs text-white/50">{mf.name.slice(-20)}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <button
                            onClick={() => removeFile(mf.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="absolute top-1 left-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${mf.type === "image" ? "bg-blue-500 text-white" : "bg-purple-500 text-white"
                            }`}>
                            {mf.type === "image" ? "IMG" : "VID"}
                          </span>
                        </div>
                        <div className="px-2 py-1.5 border-t border-gray-100">
                          <p className="text-xs text-[#6B7280] truncate">{mf.name}</p>
                          <p className="text-[10px] text-gray-400">{mf.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Context */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1D23] mb-2">
                  Additional Context <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="Any chat messages, links, or other details that help explain the evidence..."
                  rows={3}
                  maxLength={1000}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1D23] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B365D] focus:border-transparent resize-none"
                />
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3.5 border-2 border-gray-200 text-[#1A1D23] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 bg-[#FF6B35] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#ff6920] transition-colors"
                >
                  Continue <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* STEP 3 — Resolution & Submit                                   */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="space-y-6">

              {/* Desired Resolution */}
              <div>
                <label className="block text-sm font-semibold text-[#1A1D23] mb-3">
                  What resolution are you seeking? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {RESOLUTION_TYPES.map((rt) => (
                    <button
                      key={rt.value}
                      onClick={() => setResolution(rt.value)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between ${resolution === rt.value
                        ? "border-[#FF6B35] bg-orange-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                    >
                      <div>
                        <p className="font-semibold text-sm text-[#1A1D23]">{rt.label}</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{rt.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ml-3 flex items-center justify-center ${resolution === rt.value ? "border-[#FF6B35] bg-[#FF6B35]" : "border-gray-300"
                        }`}>
                        {resolution === rt.value && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Partial Amount Field */}
              {resolution === "partial_refund" && (
                <div>
                  <label className="block text-sm font-semibold text-[#1A1D23] mb-2">
                    Requested Refund Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">₹</span>
                    <input
                      type="number"
                      value={partialAmount}
                      onChange={e => setPartialAmount(e.target.value)}
                      placeholder="e.g. 3000"
                      min="1"
                      className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-[#1A1D23] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B365D] focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-[#6B7280] mt-1">Must be ≤ your escrow balance</p>
                </div>
              )}

              {/* Summary Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[#1A1D23] mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-[#FF6B35]" /> Dispute Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Issue Type</span>
                    <span className="font-medium text-[#1A1D23] capitalize">
                      {DISPUTE_TYPES.find(d => d.value === disputeType)?.label || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Evidence Files</span>
                    <span className="font-medium text-[#1A1D23]">{mediaFiles.length} file{mediaFiles.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#6B7280]">Resolution Sought</span>
                    <span className="font-medium text-[#1A1D23]">
                      {RESOLUTION_TYPES.find(r => r.value === resolution)?.label || "—"}
                    </span>
                  </div>
                  {resolution === "partial_refund" && partialAmount && (
                    <div className="flex justify-between">
                      <span className="text-[#6B7280]">Refund Requested</span>
                      <span className="font-medium text-green-600">₹{Number(partialAmount).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#FF6B35]"
                />
                <span className="text-xs text-[#6B7280] leading-relaxed">
                  I confirm that the information provided is accurate and true to the best of my knowledge. I understand that false disputes may result in account penalties. I agree to the{" "}
                  <span className="text-[#1B365D] underline cursor-pointer">Dispute Resolution Policy</span>.
                </span>
              </label>

              {/* Navigation */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 py-3.5 border-2 border-gray-200 text-[#1A1D23] rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="flex-1 py-3.5 bg-[#FF6B35] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#ff6920] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Submitting...</>
                  ) : (
                    <><Send size={18} /> Submit Dispute</>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <FooterSection />
    </div>
  );
}

// ─── Default Export — Suspense wrapper fixes useSearchParams() build error ────
export default function DisputeRepostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1B365D]" />
      </div>
    }>
      <DisputePageContent />
    </Suspense>
  );
}