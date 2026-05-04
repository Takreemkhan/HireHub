// src/app/components/chat/ChatPage.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { connectSocket, disconnectSocket, getSocket } from "@/socket/socket";
import ConversationsList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import UserProfilePanel from "./UserProfilePanel";
import NewConversationModal from "./NewConversationModal";
import { usePendingRequests } from "@/app/hook/usePendingRequests";
import { useProposalChat } from "@/app/hook/useProposalChat";
import VideoCallModal, { type CallState, type IncomingCallInfo } from "./VideoCallModal";

interface ChatPageProps {
  userId: string;
}

interface UserCacheDetails {
  name: string;
  profileImage: string | null;
}

const userCache: Record<string, UserCacheDetails> = {};

const fetchUserDetails = async (userId: string): Promise<UserCacheDetails> => {
  if (!userId) return { name: "User", profileImage: null };
  if (userCache[userId]) return userCache[userId];
  try {
    const res = await fetch(`/api/user/name/${userId}`);
    if (res.ok) {
      const data = await res.json();
      const name = data?.name && data.name !== "User" ? data.name : "User";
      const profileImage = data?.profileImage || null;
      userCache[userId] = { name, profileImage };
      return { name, profileImage };
    }
  } catch (_) { }
  return { name: "User", profileImage: null };
};

export default function ChatPage({ userId }: ChatPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeChatId, setActiveChatId] = useState<string | null>("");
  const activeChatIdRef = useRef<string | null>(activeChatId);
  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);
  const [userChats, setUserChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedJobTitle, setPinnedJobTitle] = useState<string | null>(null);
  const [pinnedJobIdState, setPinnedJobIdState] = useState<string | null>(null);
  const [pinnedJobCurrency, setPinnedJobCurrency] = useState<string | null>(
    null,
  );
  const [pinnedJobPaymentStatus, setPinnedJobPaymentStatus] = useState<
    string | null
  >(null);
  const [isPinnedJobAssigned, setIsPinnedJobAssigned] = useState<
    boolean | null
  >(null);
  const [isPinnedJobCompleted, setIsPinnedJobCompleted] =
    useState<boolean>(false);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [listLoaded, setListLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  // ── Video Call State ──────────────────────────────────────────────────────────
  const [callState, setCallState] = useState<CallState>("idle");
  const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [localUserName, setLocalUserName] = useState("You");
  // Stable peer info for the duration of ANY call (outgoing or incoming)
  const [activeCallPeerId, setActiveCallPeerId] = useState("");
  const [activeCallPeerName, setActiveCallPeerName] = useState("User");

  // Fetch own name once on mount
  useEffect(() => {
    if (!userId) return;
    fetchUserDetails(userId).then(d => setLocalUserName(d.name || "You")).catch(() => { });
  }, [userId]);

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Extract filename from URL or use a default
      const fileName =
        imageUrl.split("/").pop()?.split("?")[0] || "downloaded-image.jpg";
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab if blob download fails
      window.open(imageUrl, "_blank");
    }
  };

  const { showNewConversation, setShowNewConversation } =
    usePendingRequests(userId);

  const hasAutoSelected = useRef(false);
  const searchParams = useSearchParams();
  const chatIdFromUrl = searchParams?.get("chatId");
  const peerNameFromUrl = searchParams?.get("peerName")
    ? decodeURIComponent(searchParams.get("peerName")!)
    : null;
  const otherUserIdFromUrl = searchParams?.get("otherUserId");
  const jobIdFromUrl = searchParams?.get("jobId");

  // ✅ chatSearch state from custom hook
  const { chatSearch, setChatSearch } = useProposalChat();

  // ── Effect: Unified Job Header Fetch ───────────────────────────────────────────
  useEffect(() => {
    const fetchJobData = async () => {
      // If we have a URL jobId, it takes precedence for the title
      if (jobIdFromUrl) {
        try {
          setIsJobLoading(true);
          setIsPinnedJobAssigned(null); // Reset until we verify assignment
          const res = await fetch(`/api/jobs/${jobIdFromUrl}`);
          if (res.ok) {
            const data = await res.json();
            if (data?.job?.title) {
              setPinnedJobTitle(data.job.title);
              setPinnedJobCurrency(data.job.currency || "USD");
              // Check if we already have an assignment for this job in the current chat context
              if (activeChatId) {
                try {
                  const assignRes = await fetch(
                    `/api/chat/assign-job?chatId=${activeChatId}`,
                  );
                  if (assignRes.ok) {
                    const assignData = await assignRes.json();
                    setIsPinnedJobAssigned(!!assignData.assigned);
                    setIsPinnedJobCompleted(
                      assignData.pinnedJob?.jobStatus === "completed",
                    );
                    setPinnedJobPaymentStatus(
                      assignData.pinnedJob?.paymentStatus || null,
                    );
                  }
                } catch (e) {
                  setIsPinnedJobAssigned(false);
                  setIsPinnedJobCompleted(false);
                  setPinnedJobPaymentStatus(null);
                }
              }
              // If no activeChatId yet, stay null so we don't flicker yellow
            }
          }
        } catch (error) {
          console.error("Error fetching job from URL:", error);
        } finally {
          setIsJobLoading(false);
        }
        return;
      }

      // Otherwise, fetch from the database for the active chat
      if (!activeChatId || !userId || !listLoaded) {
        setPinnedJobTitle(null);
        setPinnedJobIdState(null);
        setPinnedJobCurrency(null);
        setPinnedJobPaymentStatus(null);
        setIsPinnedJobAssigned(false);
        setIsJobLoading(false);
        return;
      }

      const activeChat = userChats.find(
        (c) => c._id?.toString() === activeChatId?.toString(),
      );
      if (!activeChat) {
        setIsJobLoading(false);
        return;
      }

      setIsJobLoading(true);
      try {
        const res = await fetch(`/api/chat/assign-job?chatId=${activeChatId}`);
        if (res.ok) {
          const d = await res.json();
          if (d?.pinnedJob?.jobTitle) {
            setPinnedJobTitle(d.pinnedJob.jobTitle);
            setPinnedJobIdState(d.pinnedJob.jobId || null);
            setPinnedJobCurrency(d.pinnedJob.jobCurrency || "USD");
            setPinnedJobPaymentStatus(d.pinnedJob.paymentStatus || null);
            setIsPinnedJobAssigned(!!d.assigned);
            setIsPinnedJobCompleted(d.pinnedJob.jobStatus === "completed");
          } else {
            setPinnedJobTitle(null);
            setPinnedJobIdState(null);
            setPinnedJobCurrency(null);
            setPinnedJobPaymentStatus(null);
            setIsPinnedJobAssigned(false);
            setIsPinnedJobCompleted(false);
          }
        }
      } catch (error) {
        console.error("Error fetching pinned job:", error);
      } finally {
        setIsJobLoading(false);
      }
    };

    fetchJobData();
  }, [activeChatId, jobIdFromUrl, userId, listLoaded, userChats]);
  /* 
    Removed redundant Effect 1 and Effect 2 here.
  */

  const fetchSingleChat = useCallback(
    async (chatId: string, peerName?: string | null): Promise<any | null> => {
      try {
        const res = await fetch(`/api/chat/messages?chatId=${chatId}`);
        if (!res.ok) return null;
        const data = await res.json();
        const messages = data.messages || [];
        let otherSenderId = "";
        if (data.participants?.length) {
          otherSenderId =
            data.participants.find(
              (p: string) => p?.toString() !== userId?.toString(),
            ) || "";
        }
        if (!otherSenderId) {
          otherSenderId =
            messages
              .find((m: any) => m.senderId?.toString() !== userId?.toString())
              ?.senderId?.toString() || "";
        }
        let resolvedDetails: UserCacheDetails | null = peerName
          ? { name: peerName, profileImage: null }
          : null;
        if (!resolvedDetails && otherSenderId) {
          resolvedDetails = await fetchUserDetails(otherSenderId);
        }
        return {
          _id: chatId,
          participants:
            data.participants ||
            (otherSenderId ? [userId, otherSenderId] : [userId]),
          messages,
          lastMessageAt: messages[messages.length - 1]?.timestamp || new Date(),
          createdAt: messages[0]?.timestamp || new Date(),
          participantDetails:
            otherSenderId || resolvedDetails
              ? [
                {
                  _id: otherSenderId || "",
                  name: resolvedDetails?.name || "User",
                  profileImage: resolvedDetails?.profileImage || null,
                },
              ]
              : undefined,
        };
      } catch (_) {
        return null;
      }
    },
    [userId],
  );

  const fetchUserChats = useCallback(async (): Promise<any[]> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chat/list?userId=${userId}`);
      const data = res.ok ? await res.json() : { chats: [] };
      let chats: any[] = data.chats || [];
      if (chats.length === 0) {
        if (chatIdFromUrl) {
          const single = await fetchSingleChat(chatIdFromUrl, peerNameFromUrl);
          if (single) {
            setUserChats([single]);
            return [single];
          }
        }
        if (!chatIdFromUrl && otherUserIdFromUrl) {
          try {
            const r = await fetch(
              `/api/chat/with-user?otherUserId=${otherUserIdFromUrl}`,
            );
            if (r.ok) {
              const d = await r.json();
              if (d?.chat?._id) {
                const single = await fetchSingleChat(d.chat._id.toString());
                if (single) {
                  setUserChats([single]);
                  return [single];
                }
              }
            }
          } catch (_) { }
        }
        setUserChats([]);
        return [];
      }
      if (chatIdFromUrl && peerNameFromUrl) {
        chats = chats.map((chat: any) => {
          if (chat._id?.toString() === chatIdFromUrl) {
            const otherId =
              (chat.participants as string[])?.find(
                (p: string) => p !== userId,
              ) || "";
            if (otherId)
              userCache[otherId] = {
                name: peerNameFromUrl,
                profileImage: null,
              };
            return {
              ...chat,
              participantDetails: [
                { _id: otherId, name: peerNameFromUrl, profileImage: null },
              ],
            };
          }
          return chat;
        });
      }
      setUserChats(chats);
      return chats;
    } catch (error) {
      console.error("❌ fetchUserChats error:", error);
      setUserChats([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId, chatIdFromUrl, peerNameFromUrl, fetchSingleChat]);

  // ── Effect 1: Fetch Chat List (Only on mount/userId change) ───────────────────
  useEffect(() => {
    const loadList = async () => {
      await fetchUserChats();
      setListLoaded(true);
    };
    loadList();
  }, [userId, fetchUserChats]);

  // ── Effect 2: Socket Integration ─────────────────────────────────────────────
  useEffect(() => {
    connectSocket(userId);
    setSocketConnected(true);
    const socket = getSocket();

    const handleChatAccepted = async (data: {
      chatId: string;
      withUserId: string;
    }) => {
      if (!data?.chatId) return;
      const chat = await fetchSingleChat(data.chatId);
      if (!chat) return;
      setUserChats((prev) => {
        const exists = prev.some((c) => c._id?.toString() === data.chatId);
        if (exists) return prev;
        return [chat, ...prev];
      });
      setActiveChatId(data.chatId);
    };

    const handleMessageReceived = async (data: any) => {
      const incomingChatId = data.chatId?.toString();
      if (!incomingChatId) return;
      setUserChats((prev) => {
        const exists = prev.some((c) => c._id?.toString() === incomingChatId);
        if (exists) {
          return prev
            .map((c) => {
              if (c._id?.toString() === incomingChatId) {
                const isLocallyActive =
                  activeChatIdRef.current === incomingChatId;
                const patchedMessage = {
                  ...data.message,
                  readBy: isLocallyActive
                    ? data.message.readBy?.includes(userId)
                      ? data.message.readBy
                      : [...(data.message.readBy || []), userId]
                    : data.message.readBy,
                };
                return {
                  ...c,
                  messages: [...(c.messages || []), patchedMessage],
                  lastMessageAt: patchedMessage.timestamp || new Date(),
                };
              }
              return c;
            })
            .sort(
              (a, b) =>
                new Date(b.lastMessageAt).getTime() -
                new Date(a.lastMessageAt).getTime(),
            );
        }
        fetchSingleChat(incomingChatId).then((chat) => {
          if (!chat) return;
          setUserChats((latest) => {
            const alreadyIn = latest.some(
              (c) => c._id?.toString() === incomingChatId,
            );
            if (alreadyIn) return latest;
            return [chat, ...latest];
          });
          setActiveChatId((current) => current ?? incomingChatId);
        });
        return prev;
      });
    };

    const handleStatusChange = (data: {
      userId: string;
      isOnline: boolean;
    }) => {
      setOnlineUsers((prev) => ({ ...prev, [data.userId]: data.isOnline }));
    };

    const handleStatusResponse = (data: {
      userId: string;
      isOnline: boolean;
    }) => {
      setOnlineUsers((prev) => ({ ...prev, [data.userId]: data.isOnline }));
    };

    socket.on("chat:accepted", handleChatAccepted);
    socket.on("message:received", handleMessageReceived);
    socket.on("user:status_change", handleStatusChange);
    socket.on("user:status_response", handleStatusResponse);
    return () => {
      socket.off("chat:accepted");
      socket.off("message:received");
      socket.off("user:status_change", handleStatusChange);
      socket.off("user:status_response", handleStatusResponse);
    };
  }, [userId, fetchSingleChat]);

  // ── Effect 2b: Stable call:incoming listener (own effect so it never gets torn down) ──
  useEffect(() => {
    const socket = getSocket();
    const handleIncomingCall = (data: IncomingCallInfo) => {
      // Save stable peer info immediately — used for ICE/answer after state changes
      setActiveCallPeerId(data.fromUserId);
      setActiveCallPeerName(data.fromName || "User");
      setIncomingCall(data);
      setCallState("incoming");
    };
    socket.on("call:incoming", handleIncomingCall);
    return () => { socket.off("call:incoming", handleIncomingCall); };
    // Empty deps — we want this listener alive for the full page lifetime
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Effect 3: URL Parameters Integration (Auto-selection) ───────────────────
  useEffect(() => {
    if (!listLoaded || hasAutoSelected.current) return;

    const performAutoSelect = async () => {
      hasAutoSelected.current = true;
      if (chatIdFromUrl) {
        const alreadyInList = userChats.some(
          (c) => c._id?.toString() === chatIdFromUrl,
        );
        if (!alreadyInList) {
          const single = await fetchSingleChat(chatIdFromUrl, peerNameFromUrl);
          if (single) setUserChats((prev) => [single, ...prev]);
        }
        setActiveChatId(chatIdFromUrl);
      } else if (otherUserIdFromUrl) {
        const matchedChat = userChats.find(
          (c) =>
            c.participants?.some(
              (p: any) => p?.toString() === otherUserIdFromUrl,
            ) &&
            (jobIdFromUrl ? c.jobId?.toString() === jobIdFromUrl : !c.jobId),
        );
        if (matchedChat) {
          setActiveChatId(matchedChat._id?.toString());
        } else {
          try {
            const r = await fetch(
              `/api/chat/with-user?otherUserId=${otherUserIdFromUrl}${jobIdFromUrl ? `&jobId=${jobIdFromUrl}` : ""}`,
            );
            if (r.ok) {
              const d = await r.json();
              if (d?.chat?._id) {
                const chatId = d.chat._id.toString();
                const single = await fetchSingleChat(chatId);
                if (single) {
                  setUserChats((prev) => [single, ...prev]);
                  setActiveChatId(chatId);
                }
              }
            }
          } catch (_) { }
        }
      } else if (userChats.length > 0) {
        setActiveChatId(userChats[0]._id?.toString());
      }
    };

    performAutoSelect();
  }, [
    listLoaded,
    chatIdFromUrl,
    otherUserIdFromUrl,
    userChats,
    fetchSingleChat,
    peerNameFromUrl,
  ]);

  // ── Effect 4: Listen for chat:read events from ChatWindow ─────────────────
  useEffect(() => {
    const handleChatRead = (e: Event) => {
      const { chatId } = (e as CustomEvent).detail;
      if (!chatId) return;
      setUserChats((prev) =>
        prev.map((c) => {
          if (c._id?.toString() === chatId) {
            return {
              ...c,
              messages: (c.messages || []).map((m: any) => ({
                ...m,
                readBy: m.readBy?.includes(userId)
                  ? m.readBy
                  : [...(m.readBy || []), userId],
              })),
            };
          }
          return c;
        }),
      );
    };
    window.addEventListener("chat:read", handleChatRead);
    return () => window.removeEventListener("chat:read", handleChatRead);
  }, [userId]);
  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setPinnedJobTitle(null);
    setPinnedJobIdState(null);
    setPinnedJobCurrency(null);
    setPinnedJobPaymentStatus(null);
    setIsPinnedJobAssigned(false);
    setIsJobLoading(true);

    // Update URL to clear job/proposal context when switching manually
    const params = new URLSearchParams();
    params.set("chatId", chatId);
    router.push(`${pathname}?${params.toString()}`);

    // Optimistically mark all messages inside this chat as read in memory
    setUserChats((prev) =>
      prev.map((c) => {
        if (c._id?.toString() === chatId) {
          return {
            ...c,
            messages: (c.messages || []).map((m: any) => ({
              ...m,
              readBy: m.readBy?.includes(userId)
                ? m.readBy
                : [...(m.readBy || []), userId],
            })),
          };
        }
        return c;
      }),
    );
  };
  const handleNewConversation = () => setShowNewConversation(true);
  const handleConversationCreated = async (
    chatId: string,
    peerName?: string,
  ) => {
    const chat = await fetchSingleChat(chatId, peerName || null);
    if (chat)
      setUserChats((prev) => {
        const exists = prev.some((c) => c._id?.toString() === chatId);
        if (exists) return prev;
        return [chat, ...prev];
      });
    setShowNewConversation(false);
    setActiveChatId(chatId);
  };
  const refreshChats = useCallback(async () => {
    if (!activeChatId) return;
    const updated = await fetchSingleChat(activeChatId);
    if (!updated) return;
    setUserChats((prev) =>
      prev.map((c) => (c._id?.toString() === activeChatId ? updated : c)),
    );
  }, [activeChatId, fetchSingleChat]);

  const getActiveChat = () =>
    userChats.find((c) => c._id?.toString() === activeChatId?.toString());
  const getOtherUserId = (chat: any): string => {
    if (!chat?.participants) return "";
    const other = chat.participants.find(
      (p: any) => p?.toString() !== userId?.toString(),
    );
    return other?.toString() || "";
  };
  const getOtherUserDisplay = (chat: any): string => {
    if (!chat) return "User";
    if (chat?.participantDetails?.length > 0) {
      const detail = chat.participantDetails[0];
      if (detail?.name && detail.name !== "User") return detail.name;
    }
    return "User";
  };
  const getOtherUserProfileImage = (chat: any): string | null => {
    if (!chat) return null;
    if (chat?.participantDetails?.length > 0) {
      const detail = chat.participantDetails[0];
      if (detail?.profileImage) return detail.profileImage;
    }
    return null;
  };
  const filteredChats = userChats.filter((chat) => {
    if (!searchQuery) return true;
    return getOtherUserDisplay(chat)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });
  const activeChat = getActiveChat();
  const currentPeerId = activeChatId ? getOtherUserId(activeChat) : "";

  // Query online status for the peer whenever chat changes
  useEffect(() => {
    if (socketConnected && currentPeerId) {
      getSocket().emit("user:check_online", currentPeerId);
    }
  }, [socketConnected, currentPeerId]);
  // Next.js Cache invalidator
  return (
    <div className="h-full bg-white flex overflow-hidden scrollbar-hide">
      <ConversationsList
        userId={userId}
        chats={filteredChats}
        activeChatId={activeChatId}
        loading={loading}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onChatSelect={handleChatSelect}
        onNewConversation={handleNewConversation}
        getOtherUserDisplay={getOtherUserDisplay}
      />
      <ChatWindow
        chatId={activeChatId}
        userId={userId}
        otherUserId={activeChatId ? getOtherUserId(activeChat) : ""}
        otherUserDisplay={activeChatId ? getOtherUserDisplay(activeChat) : ""}
        otherUserProfileImage={
          activeChatId ? getOtherUserProfileImage(activeChat) : null
        }
        onRefreshChats={refreshChats}
        pinnedJobTitle={pinnedJobTitle}
        pinnedJobId={jobIdFromUrl ?? pinnedJobIdState}
        isJobAssigned={isPinnedJobAssigned}
        isJobCompleted={isPinnedJobCompleted}
        isJobLoading={isJobLoading}
        pinnedJobCurrency={pinnedJobCurrency}
        pinnedJobPaymentStatus={pinnedJobPaymentStatus}
        chatSearch={chatSearch}
        setChatSearch={setChatSearch}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        isOnline={!!onlineUsers[currentPeerId]}
        chatStatus={activeChat?.status}
        onStartCall={
          activeChatId && callState === "idle"
            ? () => {
              // Save peer info BEFORE transitioning — so it stays stable during whole call
              setActiveCallPeerId(activeChatId ? getOtherUserId(activeChat) : "");
              setActiveCallPeerName(activeChatId ? getOtherUserDisplay(activeChat) : "User");
              setCallState("calling");
            }
            : undefined
        }
      />
      {activeChatId && (
        <UserProfilePanel
          userId={userId}
          otherUser={getOtherUserDisplay(activeChat)}
          chat={activeChat}
          chatSearch={chatSearch}
          setChatSearch={setChatSearch}
          pinnedJobId={jobIdFromUrl ?? pinnedJobIdState}
          isJobAssigned={isPinnedJobAssigned}
          onImageClick={(url) => setSelectedImage(url)}
          isOnline={!!onlineUsers[currentPeerId]}
        />
      )}
      {showNewConversation && (
        <NewConversationModal
          userId={userId}
          onClose={() => setShowNewConversation(false)}
          onConversationCreated={handleConversationCreated}
        />
      )}

      {/* ── Global Image Lightbox ────────────────────────────────────────────────── */}
      {/* ── Video Call Modal ─────────────────────────────────────────────────────── */}
      <VideoCallModal
        callState={callState}
        incomingCall={incomingCall}
        localUserId={userId}
        localUserName={localUserName}
        remoteUserId={activeCallPeerId}
        remoteUserName={activeCallPeerName}
        chatId={
          incomingCall?.chatId ?? activeChatId ?? ""
        }
        peerConnectionRef={peerConnectionRef}
        onConnected={() => {
          // Called on CALLER side when answer is received and WebRTC is set up
          setCallState("connected");
        }}
        onEnd={() => {
          setCallState("idle");
          setIncomingCall(null);
          setActiveCallPeerId("");
          setActiveCallPeerName("User");
        }}
        onAccept={() => {
          // Called on CALLEE side after WebRTC answer is sent
          setCallState("connected");
          setIncomingCall(null);
        }}
        onReject={() => {
          setCallState("idle");
          setIncomingCall(null);
          setActiveCallPeerId("");
          setActiveCallPeerName("User");
        }}
      />

      {selectedImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
          >
            {/* Controls Container */}
            <div className="absolute top-6 right-6 flex items-center gap-3 z-[100000]">
              {/* Download Button */}
              <button
                title="Download Image"
                className="text-white transition-all bg-black/60 p-3 rounded-full hover:bg-black/80 shadow-2xl border border-white/30 backdrop-blur-sm flex items-center justify-center group"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(selectedImage);
                }}
              >
                <svg
                  className="w-6 h-6 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>

              {/* Close Button */}
              <button
                title="Close Preview"
                className="text-white transition-all bg-black/60 p-3 rounded-full hover:bg-black/80 shadow-2xl border border-white/30 backdrop-blur-sm flex items-center justify-center group"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <svg
                  className="w-6 h-6 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-[95vw] max-h-[95vh] object-contain rounded shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </div>
  );
} 