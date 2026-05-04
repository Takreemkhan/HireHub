"use client";

import React, { useState, useRef } from "react";
import {
  useGetResumeVideos,
  useGetResumeVideosByUserId,
  usePostResumeVideos,
  useDeleteResumeVideoById,
  useUpdateResumeVideoById,
  useUploadVideoFiles,
} from "@/app/hook/useProfile";
import type { ResumeVideoItem } from "@/app/api/profileApi";

const MAX_MB = 50;
const ALLOWED = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/avi"];

type Props = {
  readOnly?: boolean;
  targetUserId?: string;
};

export default function ResumeVideoManager({ readOnly = false, targetUserId }: Props) {
  const ownQuery = useGetResumeVideos();
  const targetQuery = useGetResumeVideosByUserId(targetUserId ?? "");
  const { data, isLoading, refetch } = targetUserId ? targetQuery : ownQuery;
  const { mutateAsync: saveAll } = usePostResumeVideos();
  const { mutateAsync: deleteById } = useDeleteResumeVideoById();
  const { mutateAsync: updateById } = useUpdateResumeVideoById();
  const { mutateAsync: uploadFiles } = useUploadVideoFiles();

  // --- subscription check ---
  const [isPlanActive, setIsPlanActive] = React.useState<boolean | null>(null);
  const [maxVideos, setMaxVideos] = React.useState<number>(3);
  const [planLabel, setPlanLabel] = React.useState<string>("");

  React.useEffect(() => {
    if (readOnly) {
      setIsPlanActive(true); // Don't gate viewing for others
      return;
    }
    fetch('/api/freelancer/plans', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setIsPlanActive(d?.subscription?.isPlanActive ?? false);
        setMaxVideos(d?.subscription?.maxVideos ?? 3);
        setPlanLabel(d?.subscription?.planLabel ?? "Free");
      })
      .catch(() => setIsPlanActive(false));
  }, [readOnly]);


  const videos: ResumeVideoItem[] = data?.data ?? [];

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<ResumeVideoItem | null>(null); // for modal

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // --- all existing handlers (unchanged) ---
  const handleUpload = async (files: File[]) => {
    setError("");
    const valid = files.filter(f => ALLOWED.includes(f.type.split(";")[0]));
    if (!valid.length) {
      setError("Only MP4, WebM, MOV or AVI files allowed.");
      return;
    }
    const slots = maxVideos - videos.length;
    if (slots <= 0) {
      setError(`Maximum ${maxVideos} videos allowed. Delete one to upload.`);
      return;
    }
    const toAdd = valid.slice(0, slots);
    const oversize = toAdd.filter(f => f.size > MAX_MB * 1024 * 1024);
    if (oversize.length) {
      setError(`"${oversize[0].name}" exceeds ${MAX_MB}MB.`);
      return;
    }
    setUploading(true);
    try {
      const { urls } = await uploadFiles(toAdd);
      const newItems: ResumeVideoItem[] = urls.map((url, i) => ({
        id: `${Date.now()}-${i}`,
        url,
        title: toAdd[i].name.replace(/\.[^.]+$/, ""),
        uploadedAt: new Date().toISOString(),
      }));
      await saveAll([...videos, ...newItems]);
      await refetch();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReplace = async (file: File, videoId: string) => {
    setError("");
    if (!ALLOWED.includes(file.type.split(";")[0])) {
      setError("Only MP4, WebM, MOV or AVI files allowed.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File exceeds ${MAX_MB}MB.`);
      return;
    }
    setUploading(true);
    try {
      const { urls } = await uploadFiles([file]);
      await updateById({ videoId, updatedData: { url: urls[0] } });
      await refetch();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Replace failed");
    } finally {
      setUploading(false);
      setReplacingId(null);
      if (replaceInputRef.current) replaceInputRef.current.value = "";
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm("Delete this video permanently?")) return;
    setError("");
    try {
      await deleteById(videoId);
      await refetch();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const handleSaveTitle = async () => {
    if (!editingId) return;
    setError("");
    try {
      await updateById({ videoId: editingId, updatedData: { title: editTitle } });
      await refetch();
      setEditingId(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  // --- drag & drop ---
  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (dragCounter.current === 1) setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleUpload(files);
  };

  // --- modal to play video ---
  const VideoModal = () => {
    if (!selectedVideo) return null;
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={() => setSelectedVideo(null)}
      >
        <div
          className="relative max-w-4xl w-full bg-black rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/50 rounded-full p-1.5 z-10"
            onClick={() => setSelectedVideo(null)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <video
            src={selectedVideo.url}
            controls
            autoPlay
            className="w-full h-auto max-h-[80vh]"
            controlsList="nodownload"
          />
          <div className="p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h3 className="text-lg font-bold">{selectedVideo.title || "Resume Video"}</h3>
            {selectedVideo.uploadedAt && (
              <p className="text-sm text-white/70">
                Uploaded {new Date(selectedVideo.uploadedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">
        <div className="flex items-center gap-3 justify-center py-12">
          <div className="w-6 h-6 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 font-medium">Loading resume videos…</span>
        </div>
      </div>
    );
  }

  const dropZoneClass = `relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 p-8 text-center ${isDragging
      ? "border-[#FF6B35] bg-orange-50 scale-[1.01] shadow-md"
      : "border-gray-300 hover:border-[#FF6B35] hover:bg-orange-50/30"
    }`;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden transition-all duration-200">
        {/* Header with gradient accent */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-[#1B365D] to-[#2A4A7A]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23FFFFFF%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
          <div className="relative flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Resume Videos</h2>
              <p className="text-sm text-white/70 mt-1">
                {readOnly
                  ? "Videos uploaded by this freelancer"
                  : "Showcase your best work – clients love seeing you in action"}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-white shadow-sm">
              {videos.length}/{maxVideos}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Hidden file inputs */}
          {!readOnly && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                multiple
                className="sr-only"
                onChange={e => e.target.files && handleUpload(Array.from(e.target.files))}
              />
              <input
                ref={replaceInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                className="sr-only"
                onChange={e => {
                  if (e.target.files?.[0] && replacingId) handleReplace(e.target.files[0], replacingId);
                }}
              />
            </>
          )}

          {/* Error alert */}
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="flex-1">{error}</span>
              <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 transition">
                ✕
              </button>
            </div>
          )}

          {/* Video list - vertical layout */}
          {videos.length > 0 && (
            <div className="space-y-4 mb-6">
              {videos.map((video, idx) => (
                <div
                  key={video.id ?? idx}
                  className="group flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  {/* Thumbnail / click to play */}
                  <div
                    className="relative flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden bg-black cursor-pointer"
                    onClick={() => setSelectedVideo(video)}
                  >
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title ?? "thumb"} className="w-full h-full object-cover" />
                    ) : (
                      <video
                        src={video.url}
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Middle: title and date */}
                  <div className="flex-1 min-w-0">
                    {!readOnly && editingId === video.id ? (
                      <div className="space-y-2">
                        <input
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full border border-[#FF6B35] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 bg-orange-50"
                          placeholder="Video title…"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveTitle}
                            className="px-3 py-1 rounded-lg text-xs font-semibold text-white bg-[#FF6B35] hover:bg-[#E55A2B] transition"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3
                          className="font-bold text-[#1B365D] truncate cursor-pointer hover:underline"
                          onClick={() => setSelectedVideo(video)}
                        >
                          {video.title || `Resume Video ${idx + 1}`}
                        </h3>
                        {video.uploadedAt && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(video.uploadedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Right side action buttons (only for editable) */}
                  {!readOnly && editingId !== video.id && (
                    <div className="flex flex-col sm:flex-row gap-1 flex-shrink-0">
                      <button
                        title="Edit title"
                        onClick={() => {
                          setEditingId(video.id);
                          setEditTitle(video.title ?? "");
                        }}
                        className="p-2 rounded-lg text-[#2E5984] hover:bg-blue-50 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        title={isPlanActive ? "Replace video file" : "Upgrade to replace videos"}
                        onClick={() => {
                          if (!isPlanActive) {
                            setError("Your plan has expired. Upgrade to replace videos.");
                            return;
                          }
                          setReplacingId(video.id);
                          setTimeout(() => replaceInputRef.current?.click(), 50);
                        }}
                        disabled={uploading}
                        className={`p-2 rounded-lg transition disabled:opacity-40 ${isPlanActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 grayscale cursor-not-allowed'}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                      <button
                        title="Delete video"
                        onClick={() => handleDelete(video.id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload zone (own profile only) */}
          {!readOnly && (
            <>
              {isPlanActive === false ? (
                <div className="mt-4 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mx-auto">
                    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-700">Resume Video Plan Expired</p>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">Upload and replace features are locked. Your existing videos are still visible to clients.</p>
                  </div>
                  <a
                    href="/freelancer-plans"
                    className="inline-block px-4 py-2 bg-[#FF6B35] text-white text-xs font-bold rounded-lg hover:opacity-90 transition"
                  >
                    Upgrade Plan
                  </a>
                </div>
              ) : (
                videos.length < maxVideos && (
                  <div
                    onDragEnter={onDragEnter}
                    onDragLeave={onDragLeave}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={dropZoneClass}
                  >
                    {uploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-3 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-semibold text-[#FF6B35]">Uploading…</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 pointer-events-none select-none">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition ${isDragging ? "bg-orange-100 scale-110" : "bg-gray-100"}`}>
                          <svg className={`w-7 h-7 transition ${isDragging ? "text-[#FF6B35]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        {isDragging ? (
                          <p className="text-base font-bold text-[#FF6B35]">Drop video here</p>
                        ) : (
                          <>
                            <p className="text-sm font-semibold text-gray-700">
                              Drag & drop or{" "}
                              <span className="underline underline-offset-2 text-[#FF6B35]">browse files</span>
                            </p>
                            <p className="text-xs text-gray-400">
                              MP4, WebM, MOV, AVI · Max {MAX_MB}MB · {maxVideos - videos.length} slot
                              {maxVideos - videos.length !== 1 ? "s" : ""} left
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              )}
            </>
          )}

          {/* Empty state for read-only */}
          {readOnly && videos.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No resume videos yet</p>
              <p className="text-sm text-gray-400 mt-1">This freelancer hasn't uploaded any videos.</p>
            </div>
          )}
        </div>
      </div>

      {/* Video modal */}
      <VideoModal />
    </>
  );
}