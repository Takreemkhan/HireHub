"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useGetResumeVideos } from '@/app/hook/useProfile';
import type { ResumeVideoItem } from '@/app/api/profileApi';

export type JobForProposal = {
  id: string;
  title: string;
  budget: string;
  level: string;
  description?: string;
  clientName?: string;
  clientInitials?: string;
  bids?: number;
  rating?: number;
  averageBid?: string;
};

type ResumeVideo = {
  name: string;
  size: number;
  file: File;
  previewUrl?: string; // blob URL for recorded videos
};

type VideoTab = 'upload' | 'record' | 'profile';

type SubmitProposalModalProps = {
  job: JobForProposal;
  onClose: () => void;
  onBitUsed?: (newBitsRemaining: number) => void;
};

const MAX_VIDEO_SIZE_MB = 50;
const MAX_RECORD_SECONDS = 120;
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi'];

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function SubmitProposalModal({ job, onClose, onBitUsed }: SubmitProposalModalProps) {
  // ── Form state ───────────────────────────────────────────────
  const [coverLetter, setCoverLetter] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [bitsRemaining, setBitsRemaining] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>('free');
  const [error, setError] = useState('');

  // ── Video plan check ─────────────────────────────────────────
  const router = useRouter();
  const [isPlanActive, setIsPlanActive] = useState<boolean | null>(null);
  const [maxVideos, setMaxVideos] = useState<number>(3);
  useEffect(() => {
    fetch('/api/freelancer/plans', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setIsPlanActive(d?.subscription?.isPlanActive ?? false);
        setMaxVideos(d?.subscription?.maxVideos ?? 3);
      })
      .catch(() => setIsPlanActive(false));
  }, []);

  // ── Video upload state ───────────────────────────────────────
  const [videoTab, setVideoTab] = useState<VideoTab>('upload');
  const [resumeVideos, setResumeVideos] = useState<ResumeVideo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [videoError, setVideoError] = useState('');
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // ── Profile saved videos ─────────────────────────────────────
  const { data: profileVideoData, isLoading: profileVideosLoading } = useGetResumeVideos();
  const profileSavedVideos: ResumeVideoItem[] = profileVideoData?.data ?? [];
  const [selectedProfileVideos, setSelectedProfileVideos] = useState<string[]>([]);

  // ── Self-record state ────────────────────────────────────────
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedPreviewUrl, setRecordedPreviewUrl] = useState('');
  const [recordingDone, setRecordingDone] = useState(false);

  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const wordCount = coverLetter.length;
  const timerPercent = Math.min((recordedSeconds / MAX_RECORD_SECONDS) * 100, 100);
  const timeLeft = MAX_RECORD_SECONDS - recordedSeconds;

  // ── Load bits ────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem('freelancerBitsRemaining');
    const storedPlan = localStorage.getItem('freelancerMembershipPlan') || 'Free';
    if (stored !== null) setBitsRemaining(Number(stored));
    setPlan(storedPlan);
    fetch('/api/freelancer/membership/status')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setBitsRemaining(data.subscription.bitsRemaining);
          setPlan(data.subscription.planLabel);
        }
      })
      .catch(() => { });
  }, []);

  // ── Camera: start when switching to record tab ───────────────
  useEffect(() => {
    if (videoTab === 'record' && !recordingDone) {
      startCamera();
    }
    return () => {
      if (videoTab !== 'record') stopCamera();
    };
  }, [videoTab]);

  // ── Auto-stop when max duration reached ─────────────────────
  useEffect(() => {
    if (recordedSeconds >= MAX_RECORD_SECONDS && isRecording) {
      stopRecording();
    }
  }, [recordedSeconds, isRecording]);

  // ── Cleanup on unmount ───────────────────────────────────────
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordedPreviewUrl) URL.revokeObjectURL(recordedPreviewUrl);
    };
  }, []);

  // ── Camera helpers ───────────────────────────────────────────
  const startCamera = async () => {
    setCameraError('');
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.muted = true;
        await liveVideoRef.current.play();
      }
      setCameraReady(true);
    } catch (err: any) {
      const msg = err.name === 'NotAllowedError'
        ? 'Camera/microphone permission denied. Please allow access in your browser settings.'
        : err.name === 'NotFoundError'
          ? 'No camera found on this device.'
          : 'Could not access camera. Please try again.';
      setCameraError(msg);
    }
  };

  const stopCamera = () => {
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    mediaStreamRef.current = null;
    if (liveVideoRef.current) liveVideoRef.current.srcObject = null;
    setCameraReady(false);
  };

  // ── Recording helpers ────────────────────────────────────────
  const startRecording = () => {
    if (!mediaStreamRef.current) return;
    chunksRef.current = [];
    setRecordedSeconds(0);
    setRecordingDone(false);
    setRecordedBlob(null);
    if (recordedPreviewUrl) URL.revokeObjectURL(recordedPreviewUrl);
    setRecordedPreviewUrl('');
    setVideoError('');

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

    const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = e => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setRecordedBlob(blob);
      setRecordedPreviewUrl(url);
      setRecordingDone(true);
      stopCamera();
    };

    recorder.start(100);
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setRecordedSeconds(s => s + 1);
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  const discardRecording = () => {
    if (recordedPreviewUrl) URL.revokeObjectURL(recordedPreviewUrl);
    setRecordedBlob(null);
    setRecordedPreviewUrl('');
    setRecordingDone(false);
    setRecordedSeconds(0);
    setVideoError('');
    startCamera();
  };

  const addRecordedVideo = () => {
    if (!recordedBlob) return;
    if (resumeVideos.length >= maxVideos) {
      setVideoError(`Maximum ${maxVideos} videos allowed on your current plan.`);
      return;
    }
    const sizeMB = recordedBlob.size / (1024 * 1024);
    if (sizeMB > MAX_VIDEO_SIZE_MB) {
      setVideoError(`Recorded video (${sizeMB.toFixed(1)}MB) exceeds the ${MAX_VIDEO_SIZE_MB}MB limit.`);
      return;
    }
    const ext = recordedBlob.type.includes('mp4') ? 'mp4' : 'webm';
    const file = new File([recordedBlob], `resume-recording-${Date.now()}.${ext}`, { type: recordedBlob.type });
    setResumeVideos(prev => [...prev, { name: file.name, size: file.size, file, previewUrl: recordedPreviewUrl }]);
    setRecordedBlob(null);
    setRecordedPreviewUrl('');
    setRecordingDone(false);
    setRecordedSeconds(0);
    setVideoError('');
    setVideoTab('upload');
    stopCamera();
  };

  // ── Upload file handlers ─────────────────────────────────────
  const processVideoFiles = useCallback((files: File[]) => {
    setVideoError('');
    const videoFiles = files.filter(f => ALLOWED_VIDEO_TYPES.includes(f.type));
    if (videoFiles.length === 0) {
      setVideoError('Please upload valid video files (MP4, WebM, MOV, AVI).');
      return;
    }
    const remaining = maxVideos - resumeVideos.length;
    if (remaining <= 0) {
      setVideoError(`Maximum ${maxVideos} videos allowed. Remove a video to add a new one.`);
      return;
    }
    const toAdd = videoFiles.slice(0, remaining);
    const oversized = toAdd.filter(f => f.size > MAX_VIDEO_SIZE_MB * 1024 * 1024);
    if (oversized.length > 0) {
      setVideoError(`"${oversized[0].name}" exceeds the ${MAX_VIDEO_SIZE_MB}MB size limit.`);
      return;
    }
    if (videoFiles.length > remaining) {
      setVideoError(`Only ${remaining} more video${remaining > 1 ? 's' : ''} can be added (max ${maxVideos} total).`);
    }
    setResumeVideos(prev => [...prev, ...toAdd.map(f => ({ name: f.name, size: f.size, file: f }))]);
  }, [resumeVideos.length, maxVideos]);

  const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); dragCounterRef.current += 1; if (dragCounterRef.current === 1) setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); dragCounterRef.current -= 1; if (dragCounterRef.current === 0) setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); dragCounterRef.current = 0; setIsDragging(false); processVideoFiles(Array.from(e.dataTransfer.files)); };
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (!e.target.files) return; processVideoFiles(Array.from(e.target.files)); e.target.value = ''; };
  const handleRemoveVideo = (index: number) => { setResumeVideos(prev => prev.filter((_, i) => i !== index)); setVideoError(''); };

  // ── Attachments ──────────────────────────────────────────────
  const handleAddAttachment = () => setAttachments([...attachments, `Portfolio_Sample_${attachments.length + 1}.pdf`]);
  const handleRemoveAttachment = (index: number) => setAttachments(attachments.filter((_, i) => i !== index));

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (bitsRemaining !== null && bitsRemaining <= 0) {
      setError('You have no Bids remaining. Please upgrade your plan to submit more proposals.');
      return;
    }
    setSubmitting(true);
    try {
      // 1. Build the correct array of video objects (same as ResumeVideoManager)
      let resumeVideoItems: Array<{ url: string; title: string; uploadedAt?: string }> = [];

      // Upload new videos (if any)
      if (resumeVideos.length > 0) {
        setUploadingVideos(true);
        const formData = new FormData();
        resumeVideos.forEach(v => formData.append('videos', v.file));
        const uploadRes = await fetch('/api/upload/video', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        setUploadingVideos(false);
        if (!uploadRes.ok) throw new Error(uploadData.message || 'Video upload failed. Please try again.');

        // Convert each uploaded file to an object
        const newItems = uploadData.urls.map((url: string, i: number) => ({
          url,
          title: resumeVideos[i].name.replace(/\.[^.]+$/, ""),
          uploadedAt: new Date().toISOString(),
        }));
        resumeVideoItems.push(...newItems);
      }

      // Add profile-selected videos (with their existing metadata)
      const selectedProfileItems = profileSavedVideos
        .filter(v => selectedProfileVideos.includes(v.url))
        .map(v => ({
          url: v.url,
          title: v.title || "Resume Video",
          uploadedAt: v.uploadedAt,
        }));
      resumeVideoItems.push(...selectedProfileItems);

      // 2. Save to resume-video collection if there are any
      let resumeID: string | null = null;
      if (resumeVideoItems.length > 0) {
        const saveRes = await fetch('/api/resume-video', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeVideos: resumeVideoItems, append: true }),
        });
        const saveData = await saveRes.json();
        if (!saveRes.ok) throw new Error(saveData.message || 'Failed to save resume videos');

        resumeID = saveData?.data[0].url ?? null;
      }

      // 3. Submit proposal
      const proposalPayload = {
        jobId: job.id,
        proposalText: coverLetter,
        bidAmount: parseFloat(proposedRate),
        estimatedDuration,
        attachments,
        jobTitle: job.title,
        depositRequired: Number(job.budget.replace(/[^\d.]/g, "")),
        jobLevel: job.level,
        resumeID
      };
      const proposalRes = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalPayload)
      });
      const proposalData = await proposalRes.json();
      if (!proposalRes.ok) throw new Error(proposalData.message || 'Failed to submit proposal');

      // 4. Use a Bid
      const bitRes = await fetch('/api/freelancer/membership/use-bit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id || 'unknown' })
      });
      const bitData = await bitRes.json();
      if (!bitRes.ok || !bitData.success) {
        if (bitData.code === 'NO_BITS_REMAINING') {
          setError(bitData.message || 'No Bids remaining. Please upgrade your plan.');
          setSubmitting(false);
          return;
        }
        throw new Error(bitData.message || 'Failed to use Bit');
      }
      localStorage.setItem('freelancerBitsRemaining', String(bitData.bitsRemaining));
      setBitsRemaining(bitData.bitsRemaining);
      if (onBitUsed) onBitUsed(bitData.bitsRemaining);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Try again.');
      setUploadingVideos(false);
    } finally {
      setSubmitting(false);
    }
  };

  const planColor = plan === 'Premium' ? 'bg-purple-100 text-purple-700 border-purple-300' : plan === 'Plus' ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-gray-100 text-gray-700 border-gray-300';
  const isSubmitDisabled = submitting || uploadingVideos || (bitsRemaining !== null && bitsRemaining <= 0);
  const timerBarColor = timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 30 ? 'bg-orange-400' : 'bg-[#FF6B35]';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-end sm:justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-100" onClick={e => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-6">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <h2 className="text-xl font-bold text-[#1A1D23]">{job.title}</h2>
              <Icon name="StarIcon" size={20} className="text-amber-400 shrink-0" variant="solid" />
            </div>
            <button type="button" onClick={onClose} className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="Close">
              <Icon name="XMarkIcon" size={22} className="text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-[#6B7280] mb-4">Posted 2 days ago · Remote</p>

          {/* Bits indicator */}
          <div className={`mb-5 flex items-center justify-between p-3 rounded-xl border ${planColor}`}>
            <div className="flex items-center gap-2">
              <span className="text-lg">🪙</span>
              <div>
                <p className="font-semibold text-sm">{bitsRemaining !== null ? <>{bitsRemaining} Bid{bitsRemaining !== 1 ? 's' : ''} remaining</> : 'Loading bids...'}</p>
                <p className="text-xs opacity-70">{plan} plan · 1 Bid will be used on submit</p>
              </div>
            </div>
            {bitsRemaining !== null && bitsRemaining <= 3 && bitsRemaining > 0 && <Link href="/freelancer-membership" className="text-xs font-semibold underline hover:opacity-80">Upgrade</Link>}
            {bitsRemaining !== null && bitsRemaining <= 0 && <Link href="/freelancer-membership" className="text-xs font-semibold bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Upgrade Now</Link>}
          </div>

          {/* Job overview */}
          <div className="flex gap-6 text-sm mb-6">
            <span className="text-[#1A1D23]"><strong>Budget:</strong> {job.budget}</span>
            <span className="text-[#1A1D23]"><strong>Bids:</strong> {job.bids}</span>
            <span className="text-[#1A1D23]"><strong>Avg Bid:</strong> ${job.averageBid}</span>
          </div>

          {/* Project Details */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#1A1D23] mb-2">Project Details</h3>
            <p className="text-sm text-[#6B7280]">{job.description}</p>
          </div>

          {/* Requirement */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#1A1D23] mb-2">Requirement</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">{job.level}</span>
            </div>
          </div>

          {/* About the Client */}
          <div className="mb-6 p-4 border border-[#E2E8F0] rounded-xl bg-[#FAFBFC]">
            <h3 className="font-semibold text-[#1A1D23] mb-3">About the Client</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#1B365D] flex items-center justify-center text-white font-bold text-sm">{job.clientInitials}</div>
              <div>
                <p className="font-semibold text-[#1A1D23]">{job.clientName}</p>
                <p className="text-sm text-[#6B7280]">Budget {job.budget}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map(i => <Icon key={i} name="StarIcon" size={14} className="text-amber-400" variant="solid" />)}
                  <span className="text-xs text-[#6B7280] ml-1">(12 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Form */}
          <div className="border-t border-[#E2E8F0] pt-6">
            <h3 className="font-semibold text-[#1A1D23] mb-4 flex items-center gap-2">
              <Icon name="PaperAirplaneIcon" size={20} className="text-[#FF6B35]" />
              Submit Your Proposal
            </h3>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                <Icon name="ExclamationTriangleIcon" size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
                {bitsRemaining !== null && bitsRemaining <= 0 && <a href="/freelancer-membership" className="ml-auto font-semibold underline whitespace-nowrap">Upgrade Plan</a>}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-[#1A1D23] mb-2">Cover Letter *</label>
                <div className="flex justify-between items-center mt-1 text-xs text-[#6B7280]">
                  <span>Word count: {wordCount}</span>
                  <span>Recommended: 50–100 words</span>
                </div>
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} required rows={5}
                  placeholder="Explain why you're the best fit for this project..."
                  className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent resize-none text-[#1A1D23]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1D23] mb-2">Proposed Rate (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
                    <input type="number" value={proposedRate} onChange={e => setProposedRate(e.target.value)} required placeholder="5000"
                      className="w-full pl-8 pr-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-[#1A1D23]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1D23] mb-2">Estimated Duration *</label>
                  <select value={estimatedDuration} onChange={e => setEstimatedDuration(e.target.value)} required
                    className="w-full px-4 py-3 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] text-[#1A1D23]">
                    <option value="">Select duration</option>
                    <option value="1-2 weeks">1-2 weeks</option>
                    <option value="2-4 weeks">2-4 weeks</option>
                    <option value="1-2 months">1-2 months</option>
                    <option value="2-3 months">2-3 months</option>
                    <option value="3+ months">3+ months</option>
                  </select>
                </div>
              </div>

              {/* RESUME VIDEO SECTION */}
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                {/* Section Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#FAFBFC] border-b border-[#E2E8F0]">
                  <div>
                    <span className="text-sm font-semibold text-[#1A1D23]">Resume Video</span>
                    <span className="ml-2 text-xs text-[#6B7280]">Optional · Max {maxVideos} videos · Up to {MAX_VIDEO_SIZE_MB}MB each</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${resumeVideos.length >= maxVideos ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                    {resumeVideos.length}/{maxVideos}
                  </span>
                </div>

                {/* Plan gate */}
                {isPlanActive === null && (
                  <div className="p-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Checking plan…
                  </div>
                )}
                {isPlanActive === false && (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mx-auto">
                      <svg className="w-6 h-6 text-[#FF6B35]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1D23]">Resume Video Upload Locked</p>
                      <p className="text-xs text-[#6B7280] mt-1">Choose a plan (Basic / Pro / Elite) to upload resume videos and stand out from other freelancers.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { router.push('/freelancer-plans?from=proposal&jobId=' + job.id); }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition"
                      style={{ backgroundColor: '#FF6B35' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Advance feature-Starting ₹499/month
                    </button>
                  </div>
                )}
                {isPlanActive === true && (<>
                  {/* Tab Toggle */}
                  <div className="flex border-b border-[#E2E8F0]">
                    <button type="button" onClick={() => setVideoTab('upload')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors
                      ${videoTab === 'upload' ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] bg-orange-50/40' : 'text-[#6B7280] hover:text-[#1A1D23] hover:bg-gray-50'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload File
                    </button>
                    <button type="button" onClick={() => setVideoTab('record')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors
                      ${videoTab === 'record' ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] bg-orange-50/40' : 'text-[#6B7280] hover:text-[#1A1D23] hover:bg-gray-50'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Record Video
                    </button>
                    <button type="button" onClick={() => setVideoTab('profile')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors
                      ${videoTab === 'profile' ? 'text-[#FF6B35] border-b-2 border-[#FF6B35] bg-orange-50/40' : 'text-[#6B7280] hover:text-[#1A1D23] hover:bg-gray-50'}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      From Profile
                      {profileSavedVideos.length > 0 && (
                        <span className="ml-1 text-xs bg-[#FF6B35] text-white px-1.5 py-0.5 rounded-full font-bold">{profileSavedVideos.length}</span>
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    {/* UPLOAD TAB */}
                    {videoTab === 'upload' && (
                      <div>
                        {resumeVideos.length > 0 && (
                          <div className="space-y-2 mb-3">
                            {resumeVideos.map((video, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-[#F7FAFC] border border-[#E2E8F0] rounded-xl">
                                <div className="w-10 h-10 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-5 h-5 text-[#FF6B35]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[#1A1D23] truncate">{video.name}</p>
                                  <p className="text-xs text-[#6B7280]">{formatFileSize(video.size)}</p>
                                </div>
                                <button type="button" onClick={() => handleRemoveVideo(index)}
                                  className="p-1.5 hover:bg-red-50 rounded-lg text-[#6B7280] hover:text-red-500 transition-colors flex-shrink-0">
                                  <Icon name="XMarkIcon" size={18} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {resumeVideos.length < maxVideos && (
                          <div
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => videoInputRef.current?.click()}
                            className={`w-full cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 p-6 text-center
                            ${isDragging ? 'border-[#FF6B35] bg-orange-50 scale-[1.01]' : 'border-[#E2E8F0] hover:border-[#FF6B35] hover:bg-orange-50/40'}`}
                          >
                            <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo" multiple onChange={handleFileInputChange} className="sr-only" />
                            <div className="flex flex-col items-center gap-2 pointer-events-none select-none">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragging ? 'bg-[#FF6B35]/20' : 'bg-gray-100'}`}>
                                <svg className={`w-6 h-6 ${isDragging ? 'text-[#FF6B35]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                              </div>
                              {isDragging ? (
                                <p className="text-sm font-semibold text-[#FF6B35]">Drop your video here</p>
                              ) : (
                                <>
                                  <p className="text-sm font-semibold text-[#1A1D23]">
                                    Drag & drop your <span className="text-[#FF6B35] underline underline-offset-2">Resume Video</span>
                                  </p>
                                  <p className="text-xs text-[#6B7280]">
                                    MP4, WebM, MOV, AVI · Max {MAX_VIDEO_SIZE_MB}MB · {maxVideos - resumeVideos.length} slot{maxVideos - resumeVideos.length !== 1 ? 's' : ''} remaining
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* RECORD TAB */}
                    {videoTab === 'record' && (
                      <div>
                        {resumeVideos.length >= maxVideos ? (
                          <div className="text-center py-6 text-sm text-[#6B7280]">
                            <p>Maximum {maxVideos} videos reached.</p>
                            <p className="mt-1">Remove a video from the Upload tab to record a new one.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {cameraError && (
                              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                                <Icon name="ExclamationTriangleIcon" size={15} className="shrink-0 mt-0.5" />
                                <span>{cameraError}</span>
                              </div>
                            )}
                            <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                              <video ref={liveVideoRef} className={`w-full h-full object-cover ${recordingDone ? 'hidden' : 'block'}`} playsInline muted />
                              {recordingDone && recordedPreviewUrl && (
                                <video src={recordedPreviewUrl} controls className="w-full h-full object-cover" style={{ display: 'block' }} />
                              )}
                              {!cameraReady && !recordingDone && !cameraError && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex flex-col items-center gap-2 text-white/60">
                                    <svg className="w-10 h-10 animate-spin" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    <p className="text-sm">Starting camera…</p>
                                  </div>
                                </div>
                              )}
                              {isRecording && (
                                <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                  <span className="text-xs font-bold text-white tracking-wide">REC</span>
                                </div>
                              )}
                              {(isRecording || (cameraReady && !recordingDone)) && (
                                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                  <span className={`text-xs font-mono font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                                    {formatTime(recordedSeconds)} / {formatTime(MAX_RECORD_SECONDS)}
                                  </span>
                                </div>
                              )}
                            </div>
                            {(isRecording || recordedSeconds > 0) && (
                              <div className="space-y-1">
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full transition-all duration-1000 ease-linear ${timerBarColor}`} style={{ width: `${timerPercent}%` }} />
                                </div>
                                <div className="flex justify-between text-xs text-[#6B7280]">
                                  <span>{formatTime(recordedSeconds)} elapsed</span>
                                  <span className={timeLeft <= 10 ? 'text-red-500 font-semibold' : ''}>
                                    {timeLeft <= 0 ? 'Time up!' : `${formatTime(timeLeft)} left`}
                                  </span>
                                </div>
                              </div>
                            )}
                            {!recordingDone ? (
                              <div className="flex items-center gap-3">
                                {!isRecording ? (
                                  <button type="button" onClick={startRecording} disabled={!cameraReady}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <span className="w-3 h-3 rounded-full bg-white" />
                                    Start Recording
                                  </button>
                                ) : (
                                  <button type="button" onClick={stopRecording}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-sm font-semibold rounded-xl transition-colors">
                                    <span className="w-3 h-3 rounded bg-white" />
                                    Stop Recording
                                  </button>
                                )}
                                {cameraError && (
                                  <button type="button" onClick={startCamera}
                                    className="px-4 py-2.5 border border-[#E2E8F0] text-sm font-medium rounded-xl hover:bg-gray-50 text-[#1A1D23]">
                                    Retry Camera
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-3">
                                <button type="button" onClick={addRecordedVideo}
                                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#FF6B35] hover:bg-[#E5602F] text-white text-sm font-semibold rounded-xl transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Use This Video
                                </button>
                                <button type="button" onClick={discardRecording}
                                  className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#E2E8F0] text-sm font-medium rounded-xl hover:bg-gray-50 text-[#6B7280]">
                                  <Icon name="XMarkIcon" size={16} />
                                  Retake
                                </button>
                              </div>
                            )}
                            {!isRecording && !recordingDone && cameraReady && (
                              <p className="text-xs text-center text-[#6B7280]">
                                Max recording length: <strong>{formatTime(MAX_RECORD_SECONDS)}</strong> · Recording stops automatically
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* PROFILE TAB */}
                    {videoTab === 'profile' && (
                      <div>
                        {profileVideosLoading ? (
                          <div className="flex flex-col items-center justify-center py-8 gap-3">
                            <div className="w-7 h-7 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-[#6B7280]">Loading your saved videos…</p>
                          </div>
                        ) : profileSavedVideos.length === 0 ? (
                          <div className="text-center py-8 space-y-2">
                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.868v6.264a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-sm font-medium text-[#1A1D23]">No saved videos on your profile</p>
                            <p className="text-xs text-[#6B7280]">Upload resume videos to your profile first, then select them here.</p>
                            <a href="/freelancer-dashboard?view=profile" target="_blank" rel="noopener noreferrer"
                              className="inline-block mt-2 text-xs font-semibold text-[#FF6B35] underline underline-offset-2">
                              Go to Profile →
                            </a>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-xs text-[#6B7280] mb-2">Select videos from your profile to attach to this proposal (max {maxVideos} total):</p>
                            {profileSavedVideos.map((video, idx) => {
                              const isSelected = selectedProfileVideos.includes(video.url);
                              const canSelect = !isSelected && (resumeVideos.length + selectedProfileVideos.length) < maxVideos;
                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedProfileVideos(prev => prev.filter(u => u !== video.url));
                                    } else if (canSelect) {
                                      setSelectedProfileVideos(prev => [...prev, video.url]);
                                    }
                                  }}
                                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                                  ${isSelected
                                      ? 'border-[#FF6B35] bg-orange-50/60'
                                      : canSelect
                                        ? 'border-[#E2E8F0] hover:border-[#FF6B35] hover:bg-orange-50/30'
                                        : 'border-[#E2E8F0] opacity-50 cursor-not-allowed'
                                    }`}
                                >
                                  <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-black flex-shrink-0">
                                    {video.thumbnail ? (
                                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                    ) : (
                                      <video src={video.url} className="w-full h-full object-cover" preload="metadata" muted />
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: '#1B365D' }}>{video.title || `Resume Video ${idx + 1}`}</p>
                                    {video.uploadedAt && (
                                      <p className="text-xs text-[#6B7280]">{new Date(video.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                    )}
                                  </div>
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                                  ${isSelected ? 'border-[#FF6B35] bg-[#FF6B35]' : 'border-gray-300'}`}>
                                    {isSelected && (
                                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                            {selectedProfileVideos.length > 0 && (
                              <p className="text-xs text-[#FF6B35] font-semibold mt-1">{selectedProfileVideos.length} video{selectedProfileVideos.length > 1 ? 's' : ''} selected from profile</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {videoError && (
                      <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                        <Icon name="ExclamationTriangleIcon" size={14} />
                        {videoError}
                      </p>
                    )}
                  </div>
                </>)}
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-[#1A1D23] mb-2">Attachments (Optional)</label>
                <div className="space-y-2">
                  {attachments.map((name, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0]">
                      <span className="text-sm text-[#1A1D23]">{name}</span>
                      <button type="button" onClick={() => handleRemoveAttachment(index)} className="p-1 hover:bg-red-50 rounded text-[#6B7280]">
                        <Icon name="XMarkIcon" size={18} />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={handleAddAttachment}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#E2E8F0] rounded-lg hover:border-[#FF6B35] hover:bg-orange-50/50 transition-colors text-[#FF6B35] font-medium text-sm">
                    <Icon name="PlusIcon" size={20} />
                    Add Portfolio Sample
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="p-4 bg-[#F7FAFC] rounded-lg border border-[#E2E8F0]">
                <p className="text-sm font-medium text-[#1A1D23] mb-2">Application Tips</p>
                <ul className="text-sm text-[#6B7280] space-y-1">
                  <li>• Personalize your cover letter for this specific project</li>
                  <li>• Highlight relevant experience and past work</li>
                  <li>• Be realistic with your timeline and budget</li>
                  <li>• Include portfolio samples that showcase similar work</li>
                  <li>• A short resume video (30–90 sec) can significantly boost your chances</li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
                <button type="button" onClick={onClose} className="text-[#6B7280] text-sm font-medium hover:underline">Cancel</button>
                <button type="submit" disabled={isSubmitDisabled}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF6B35] text-white font-semibold rounded-lg hover:bg-[#E5602F] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                  {uploadingVideos ? (
                    <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Uploading Videos…</>
                  ) : submitting ? (
                    <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Submitting…</>
                  ) : (
                    <><Icon name="PaperAirplaneIcon" size={20} />Submit Proposal (uses 1 Bid 🪙)</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}