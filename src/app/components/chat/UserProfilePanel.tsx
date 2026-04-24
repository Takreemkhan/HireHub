"use client";

import { getAvatarGradient, getInitials } from "@/utils/avatarColors";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProposalDraw from "./ProposalDraw";

interface UserProfilePanelProps {
  userId: string;
  otherUser: string;
  chat: any;
  chatSearch: string;
  setChatSearch: (val: string) => void;
  chatId?: string;
  pinnedJobId?: string | null;
  isJobAssigned?: boolean | null;
  onImageClick?: (url: string) => void;
  isOnline?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSize(bytes: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ fileType }: { fileType: string }) {
  if (fileType?.startsWith("image/")) return (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
  if (fileType === "application/pdf") return (
    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
  return (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
  );
}

// ─── Files Drawer ─────────────────────────────────────────────────────────────

interface ChatFile {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

function FilesDrawer({ chatId, onClose, onImageClick }: { chatId: string; onClose: () => void; onImageClick?: (url: string) => void }) {
  const [files, setFiles] = useState<ChatFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/chat/files?chatId=${chatId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setFiles(data.files || []);
        else setError("Failed to load files.");
      })
      .catch(() => setError("Network error."))
      .finally(() => setLoading(false));
  }, [chatId]);

  const images = files.filter((f) => f.fileType?.startsWith("image/"));
  const docs = files.filter((f) => !f.fileType?.startsWith("image/"));

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px]" onClick={onClose} />
      <div
        className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-white z-50 shadow-2xl flex flex-col"
        style={{ animation: "slideInRight 0.25s cubic-bezier(0.25,0.46,0.45,0.94) both" }}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 className="text-base font-semibold text-gray-900">Files & Links</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading files…</p>
            </div>
          )}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}
          {!loading && !error && files.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <p className="text-sm text-gray-400">No files shared yet</p>
              <p className="text-xs text-gray-400">Files you send in this chat will appear here</p>
            </div>
          )}

          {!loading && !error && files.length > 0 && (
            <div className="space-y-6">
              {images.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Images ({images.length})</p>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((f) => (
                      <div key={f._id}
                        onClick={() => onImageClick?.(f.fileUrl)}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-1 transition-all">
                        <img src={f.fileUrl} alt={f.fileName} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {docs.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Documents ({docs.length})</p>
                  <div className="space-y-2">
                    {docs.map((f) => (
                      <a key={f._id} href={f.fileUrl} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                          <FileIcon fileType={f.fileType} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{f.fileName}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                            {f.fileSize > 0 && <span>{formatSize(f.fileSize)}</span>}
                            <span>·</span>
                            <span>{new Date(f.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>
    </>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function UserProfilePanel({
  userId,
  otherUser,
  chat,
  chatSearch,
  setChatSearch,
  chatId,
  pinnedJobId,
  isJobAssigned = false,
  onImageClick,
  isOnline = false,
}: UserProfilePanelProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const role = session?.user.role;
  const currentUserId = (session?.user as any)?.id || (session?.user as any)?._id;
  const otherUserId = chat?.participants?.find((p: any) => p?.toString() !== currentUserId?.toString())?.toString() || "";

  const otherUserTitle = chat?.participantDetails?.[0]?.title || "";
  const otherUserLocation = chat?.participantDetails?.[0]?.location || "";
  const otherUserProfileImage = chat?.participantDetails?.[0]?.profileImage || "";
  const otherUserIdFromDetails = chat?.participantDetails?.[0]?._id || "";

  const resolvedChatId: string = chatId || chat?._id?.toString() || "";

  const userProfile = {
    name: otherUser?.split("@")[0] || "User",
    email: otherUser,
    role: otherUserTitle || (role === "freelancer" ? "Client" : "Freelancer"),
    location: otherUserLocation || "Remote",
    localTime: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
  };

  const [proposalDrawOpen, setProposalDrawOpen] = useState(false);
  const [filesDrawerOpen, setFilesDrawerOpen] = useState(false);
  const [fileCount, setFileCount] = useState<number | null>(null);

  useEffect(() => {
    if (!resolvedChatId) return;
    fetch(`/api/chat/files?chatId=${resolvedChatId}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setFileCount(data.files?.length ?? 0); })
      .catch(() => { });
  }, [resolvedChatId]);

  useEffect(() => { console.log(chatSearch); }, [chatSearch]);

  const sections = [
    {
      title: "Meeting recaps", count: null, onClickFn: null,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    },
    {
      title: "People", count: null, onClickFn: null,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    },
    {
      title: "Files and links",
      count: fileCount,
      onClickFn: resolvedChatId ? () => setFilesDrawerOpen(true) : null,
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>,
    },
  ];

  return (
    <>
      <div className="w-80 border-l border-gray-200 bg-white overflow-y-auto scrollbar-hide">

        {/* Profile Header */}
        <div className="p-6 text-center border-b border-gray-200">
          <div className={`w-20 h-20 bg-gradient-to-br ${getAvatarGradient(otherUser)} rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg`}>
            {otherUserProfileImage
              ? <img src={otherUserProfileImage} alt="profile" className="w-full h-full object-cover rounded-full" />
              : getInitials(otherUser)}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">{userProfile.name}</h2>
          <p className="text-xs text-gray-500 mb-3">{isOnline ? "Online" : "Offline"}</p>
          <p className="text-sm text-gray-500 mb-3">{userProfile.role}</p>
          <div className="flex gap-2 justify-center">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View proposal">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" onClick={() => setProposalDrawOpen(true)}>
              View proposal
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 border-b border-gray-200 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Local time</span>
            <span className="font-medium text-gray-900">{userProfile.localTime}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Location</span>
            <span className="font-medium text-gray-900 text-right">{userProfile.location}</span>
          </div>
        </div>

        {/* Search Messages */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={chatSearch} placeholder="Search messages"
              className="w-full pl-9 pr-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setChatSearch(e.target.value)} />
          </div>
        </div>

        {/* Sections */}
        <div className="divide-y divide-gray-200">
          {sections.map((section, index) => (
            <button key={index} onClick={section.onClickFn ?? undefined} disabled={!section.onClickFn}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left disabled:cursor-default">
              <div className="flex items-center gap-3">
                <div className="text-gray-600">{section.icon}</div>
                <span className="text-sm font-medium text-gray-900">{section.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {section.count !== null && section.count !== undefined && section.count > 0 && (
                  <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full">{section.count}</span>
                )}
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="p-4 space-y-2">
          {role === "client" && (
            <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => { if (otherUserId) router.push(`/freelancer-dashboard/freelancer-profile-preview?userId=${otherUserId}`); }}>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>View profile</span>
            </button>
          )}
          <button
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            onClick={() => {
              if (resolvedChatId && pinnedJobId && otherUserId) {
                const clientId = role === "client" ? currentUserId : otherUserId;
                const freelancerId = role === "freelancer" ? currentUserId : otherUserId;
                router.push(`/dispute?chatId=${resolvedChatId}&jobId=${pinnedJobId}&clientId=${clientId}&freelancerId=${freelancerId}`);
              } else {
                // If not in a specific job context, maybe just go to dispute page without params or show a toast
                router.push('/dispute');
              }
            }}
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Report an issue</span>
          </button>
        </div>
      </div>

      <ProposalDraw
        proposalDrawOpen={proposalDrawOpen}
        setProposalDrawOpen={setProposalDrawOpen}
        jobId={pinnedJobId}
        freelancerId={otherUserId}
        isJobAssigned={isJobAssigned}
      />

      {filesDrawerOpen && resolvedChatId && (
        <FilesDrawer
          chatId={resolvedChatId}
          onClose={() => setFilesDrawerOpen(false)}
          onImageClick={onImageClick}
        />
      )}
    </>
  );
}