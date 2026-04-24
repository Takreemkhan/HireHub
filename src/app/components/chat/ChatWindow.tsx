'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import Script from "next/script";
import { getSocket } from "@/socket/socket";
import { getAvatarGradient, getInitials } from "@/utils/avatarColors";
import { filterMessage } from "@/utils/messageFilter";
import EmojiPicker from "emoji-picker-react";
import { usePathname } from "next/navigation";
import MilestonePanel from "./MilestonePanel";
import EscrowBalanceBar from "./EscrowBalanceBar";

interface Message {
  _id?: string;
  senderId: string;
  content?: string;
  text?: string;
  timestamp: Date | string;
  messageType?: "text" | "file" | "image" | "job_share" | "system_intro";
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  jobId?: string;
  jobDetails?: {
    _id: string;
    title: string;
    category?: string;
    budget?: number;
    status?: string;
    description?: string;
  } | null;
}

interface ChatWindowProps {
  chatId: string | null;
  userId: string;
  otherUserId: string;
  otherUserDisplay: string;
  otherUserProfileImage?: string | null;
  onRefreshChats: () => void;
  pinnedJobTitle?: string | null;
  pinnedJobId?: string | null;
  pinnedJobBudget?: string | null;
  pinnedJobCategory?: string | null;
  proposalId?: string | null;
  isJobAssigned?: boolean | null;
  isJobCompleted?: boolean;
  isJobLoading?: boolean;
  pinnedJobCurrency?: string | null;
  pinnedJobPaymentStatus?: string | null;
  chatSearch: string;
  setChatSearch: (val: string) => void;
  selectedImage: string | null;
  setSelectedImage: (url: string | null) => void;
  isOnline?: boolean;
  chatStatus?: string;
}

export default function ChatWindow({
  chatId,
  userId,
  otherUserId,
  otherUserDisplay,
  otherUserProfileImage,
  onRefreshChats,
  pinnedJobTitle,
  pinnedJobId,
  pinnedJobBudget,
  pinnedJobCategory,
  proposalId,
  isJobAssigned = false,
  isJobCompleted = false,
  isJobLoading,
  pinnedJobCurrency,
  pinnedJobPaymentStatus,
  chatSearch,
  setChatSearch,
  selectedImage,
  setSelectedImage,
  isOnline,
  chatStatus,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isFrozen, setIsFrozen] = useState(false);

  const pathname = usePathname();
  const isClientRole = !pathname?.includes("/freelancer");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [restrictionError, setRestrictionError] = useState<string | null>(null);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // ── Job assign state ────────────────────────────────────────────────────────
  const [showAssignConfirm, setShowAssignConfirm] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const onRefreshChatsRef = useRef(onRefreshChats);
  useEffect(() => { onRefreshChatsRef.current = onRefreshChats; }, [onRefreshChats]);

  // ── Fetch messages ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/chat/messages?chatId=${chatId}`);
        const data = await res.json();
        setMessages(data.messages || []);
        setIsFrozen(!!data.isFrozen);

        // Mark fetched messages as read in the background
        if (data.messages && data.messages.length > 0) {
          fetch("/api/chat/messages", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId, userId })
          }).catch(() => { });

          fetch(`/api/notifications?chatId=${chatId}`, { method: "PUT" }).catch(() => { });
          window.dispatchEvent(new CustomEvent("chat:read", { detail: { chatId } }));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();

    // Socket setup
    try {
      const socket = getSocket();
      const joinRooms = () => {
        socket.emit("user:join", userId);
        socket.emit("join:chat", { chatId, userId });
      };
      if (socket.connected) joinRooms();
      else socket.once("connect", joinRooms);

      const handleMessage = (data: any) => {
        if (data.chatId === chatId) {
          setMessages((prev) => [...prev, data.message]);
          onRefreshChatsRef.current();

          // Mark incoming message as read since chat is active
          fetch("/api/chat/messages", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId, userId })
          }).catch(() => { });

          fetch(`/api/notifications?chatId=${chatId}`, { method: "PUT" }).catch(() => { });
          window.dispatchEvent(new CustomEvent("chat:read", { detail: { chatId } }));
        }
      };
      const handleTypingUser = (data: any) => {
        if (data.chatId === chatId && data.userId !== userId) {
          setOtherUserTyping(data.isTyping);
        }
      };
      const handleRestricted = (data: any) => {
        if (data.chatId === chatId) {
          setRestrictionError(data.reason);
          setTimeout(() => setRestrictionError(null), 5000);
        }
      };
      socket.on("message:received", handleMessage);
      socket.on("typing:user", handleTypingUser);
      socket.on("message:restricted", handleRestricted);
      return () => {
        socket.off("message:received", handleMessage);
        socket.off("typing:user", handleTypingUser);
        socket.off("message:restricted", handleRestricted);
        socket.off("connect", joinRooms);
      };
    } catch (error) {
      console.error("Socket error:", error);
    }
  }, [chatId, userId]);

  /* 
    Removed redundant assignment status check useEffect.
    Status is now provided by ChatPage via isJobAssigned prop.
  */

  // Auto-send system intro message 
  useEffect(() => {
    if (!chatId || !pinnedJobId || !pinnedJobTitle || !userId || !otherUserId) return;
    (async () => {
      try {
        const res = await fetch("/api/chat/auto-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chatId,
            jobId: pinnedJobId,
            jobTitle: pinnedJobTitle,
            clientId: userId,
            freelancerId: otherUserId || null,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.sent && data.message) {
            setMessages((prev) => {
              const exists = prev.some((m) => m._id === data.message._id);
              return exists ? prev : [...prev, data.message];
            });
          }
        }
      } catch (err) {
        console.error("❌ auto-message error:", err);
      }
    })();
  }, [chatId, pinnedJobId, pinnedJobTitle, userId, otherUserId]);

  // Handle Pay Later - Escrow Funding Flow
  const handleEscrowPayment = async () => {
    if (!chatId || !pinnedJobId || !otherUserId) return;
    setAssignLoading(true);
    setAssignError(null);
    try {
      // 1. Create order
      const res = await fetch("/api/jobs/payment/escrow/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: pinnedJobId })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create escrow payment order");
      }

      // 2. Open Razorpay
      const options = {
        key: data.razorpayKeyId,
        amount: data.amountInPaise,
        currency: "INR",
        order_id: data.orderId,
        name: "HireHub - Escrow Deposit",
        description: `Fund Job Budget (${data.totalAmount})`,
        handler: async function (response: any) {
          try {
            setAssignLoading(true);
            const verifyRes = await fetch("/api/jobs/payment/escrow/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                jobId: pinnedJobId,
              })
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error("Payment verification failed");

            // 3. Complete actual Job Assignment after payment success
            await actuallyAssignJob();
          } catch (err: any) {
            setAssignError(err.message || "Verification failed");
            setAssignLoading(false);
          }
        },
        theme: { color: "#4e73df" },
        modal: {
          ondismiss: function () {
            setAssignLoading(false);
            setAssignError("Payment cancelled.");
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setAssignError(err.message || "Something went wrong.");
      setAssignLoading(false);
    }
  };

  const actuallyAssignJob = async () => {
    if (!chatId || !pinnedJobId || !otherUserId) return;
    try {
      const assignRes = await fetch("/api/client/jobs/current", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: pinnedJobId,
          freelancerId: otherUserId,
          proposalId: proposalId || undefined,
        }),
      });
      const assignData = await assignRes.json();
      if (!assignRes.ok) throw new Error(assignData.message || "Failed to assign job");

      await fetch("/api/chat/assign-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, jobId: pinnedJobId, freelancerId: otherUserId }),
      });

      onRefreshChats();
      setShowAssignConfirm(false);
    } catch (err: any) {
      setAssignError(err.message || "Failed to assign job");
    } finally {
      setAssignLoading(false);
    }
  };

  // Assign job handler
  const handleAssignJob = useCallback(async () => {
    if (!chatId || !pinnedJobId || !otherUserId) return;

    if (pinnedJobPaymentStatus === "pending_assignment") {
      setShowAssignConfirm(false);
      await handleEscrowPayment();
      return;
    }

    setAssignLoading(true);
    setAssignError(null);
    await actuallyAssignJob();
  }, [chatId, pinnedJobId, otherUserId, proposalId, pinnedJobPaymentStatus]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [newMessage]);


  const getMessageText = (msg: Message): string => msg.content || msg.text || "";
  const isOwnMessage = (msg: Message): boolean => msg.senderId?.toString() === userId?.toString();

  const matchingIndices = messages.reduce((acc, msg, idx) => {
    if (chatSearch && getMessageText(msg).toLowerCase().includes(chatSearch.toLowerCase())) acc.push(idx);
    return acc;
  }, [] as number[]);

  useEffect(() => {
    if (!chatSearch.trim()) { setCurrentMatchIndex(-1); return; }
    if (matchingIndices.length > 0) {
      setCurrentMatchIndex(0);
      messageRefs.current[matchingIndices[0]]?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setCurrentMatchIndex(-1);
    }
  }, [chatSearch, messages]);

  const goToPrevMatch = () => {
    if (!matchingIndices.length) return;
    const ni = currentMatchIndex > 0 ? currentMatchIndex - 1 : matchingIndices.length - 1;
    setCurrentMatchIndex(ni);
    messageRefs.current[matchingIndices[ni]]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const goToNextMatch = () => {
    if (!matchingIndices.length) return;
    const ni = (currentMatchIndex + 1) % matchingIndices.length;
    setCurrentMatchIndex(ni);
    messageRefs.current[matchingIndices[ni]]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const parts = text.split(new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === search.toLowerCase()
        ? <mark key={i} className="bg-yellow-200 text-black rounded px-0.5">{p}</mark>
        : p
    );
  };


  const handleTyping = () => {
    if (!chatId) return;
    const socket = getSocket();
    if (!isTyping) { setIsTyping(true); socket.emit("typing:start", { chatId, userId }); }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit("typing:stop", { chatId, userId });
    }, 2000);
  };


  const sendMessage = async (content: string, type: "text" | "file" | "image" = "text", fileUrl?: string, fileName?: string) => {
    if (!content.trim() && type === "text") return;
    if (!chatId) return;

    if (type === "text") {
      const filterResult = filterMessage(content.trim());
      if (filterResult.blocked) {
        setRestrictionError(filterResult.reason);
        setTimeout(() => setRestrictionError(null), 5000);
        return;
      }
      setRestrictionError(null);
    }

    const message = {
      senderId: userId,
      receiverId: otherUserId,
      content: type === "text" ? content.trim() : (fileName || "File"),
      messageType: type,
      fileUrl: fileUrl || "",
      fileName: fileName || "",
      timestamp: new Date(),
    };

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, message }),
      });
      const data = await res.json();
      if (data.restricted) {
        setRestrictionError(data.error);
        setTimeout(() => setRestrictionError(null), 5000);
        return;
      }
      if (data.success) {
        const newMsg = { ...message, _id: data.messageId?.toString() } as Message;
        setMessages((prev) => [...prev, newMsg]);
        const socket = getSocket();
        socket.emit("message:send", { chatId, message: newMsg });
        if (type === "text") setNewMessage("");
        if (isTyping) { setIsTyping(false); socket.emit("typing:stop", { chatId, userId }); }
        onRefreshChats();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };


  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("chatId", chatId || "");
    formData.append("userId", userId);
    try {
      const res = await fetch("/api/chat/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        await sendMessage(file.name, "file", data.fileUrl, file.name);
      } else {
        setRestrictionError("File upload failed. Please try again.");
        setTimeout(() => setRestrictionError(null), 5000);
      }
    } catch {
      setRestrictionError("Network error while uploading file.");
      setTimeout(() => setRestrictionError(null), 5000);
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();


  const checkIsImage = (msg: Message) =>
    !!(msg.fileUrl && msg.fileName?.match(/\.(jpg|jpeg|png|gif|webp)$/i));

  const renderFileMessage = (msg: Message) => {
    const isImage = checkIsImage(msg);
    const own = isOwnMessage(msg);

    return (
      <div className="mt-1">
        {isImage ? (
          <div onClick={() => setSelectedImage(msg.fileUrl || null)} className="block cursor-pointer">
            <img
              src={msg.fileUrl}
              alt="shared"
              className="max-w-xs rounded-lg shadow-sm hover:opacity-95 transition-opacity"
            />
          </div>
        ) : (
          <a
            href={msg.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 underline ${own ? "text-white" : "text-blue-600"}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {msg.fileName}
          </a>
        )}
        {msg.messageType === "file" && !isImage && (
          <p className={`text-[11px] mt-1 opacity-80 ${own ? "text-white" : "text-gray-500"}`}>
            {msg.content}
          </p>
        )}
      </div>
    );
  };

  const isEmojiOnly = (str: string) => {
    if (!str || str.length > 20) return false;
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    const cleaned = str.replace(/\s/g, '');
    const match = cleaned.match(emojiRegex);
    return match && match.join('') === cleaned;
  };


  const renderSystemMessage = (msg: Message) => (
    <div className="flex justify-center my-4 px-4">
      <div style={{
        background: "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)",
        border: "1px solid #c7d2fe",
        borderLeft: "4px solid #6366f1",
        borderRadius: "12px",
        padding: "14px 18px",
        maxWidth: "78%",
        boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
      }}>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: "1rem" }}>🤖</span>
          <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6366f1" }}>
            System Message
          </span>
        </div>
        <p style={{ fontSize: "0.875rem", color: "#374151", lineHeight: 1.65, fontStyle: "italic" }}>
          {getMessageText(msg)}
        </p>
        <p style={{ fontSize: "0.68rem", color: "#9ca3af", marginTop: "8px", textAlign: "right" }}>
          {new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );


  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h2>
          <p className="text-sm text-gray-500">Choose a conversation from the list to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">


        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            {otherUserProfileImage ? (
              <img src={otherUserProfileImage} alt={otherUserDisplay} className="w-10 h-10 rounded-full object-cover shadow-sm" />
            ) : (
              <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(otherUserDisplay)} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}>
                {getInitials(otherUserDisplay)}
              </div>
            )}
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {otherUserDisplay.includes("@") ? otherUserDisplay.split("@")[0] : otherUserDisplay || "User"}
              </h2>
              {otherUserTyping
                ? <p className="text-xs text-green-600 font-medium">typing...</p>
                : <p className="text-xs text-gray-500">{isOnline ? "Online" : "Offline"}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2" />
        </div>

        {/* ── Shimmer Style ─────────────────────────────────────────────────── */}
        <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-bg {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>

        {/* ── Skeleton Loader ─────────────────────────────────────────────────── */}
        {isJobLoading && (
          <div className="flex-shrink-0 px-5 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-lg shimmer-bg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-2.5 w-20 rounded shimmer-bg" />
                <div className="h-3.5 w-48 rounded shimmer-bg" />
                <div className="flex gap-4">
                  <div className="h-2.5 w-16 rounded shimmer-bg" />
                  <div className="h-2.5 w-16 rounded shimmer-bg" />
                </div>
              </div>
            </div>
          </div>
        )}

        {!isJobLoading && (
          <div className="flex-shrink-0">
            {isJobCompleted ? (
              <div className="bg-emerald-600 text-white text-center py-3 px-4">
                <div className="flex items-center justify-center gap-2 mb-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-bold text-sm">Job completed!</p>
                </div>
                <p className="text-xs text-emerald-100">
                  {pinnedJobTitle} · All milestones released
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: isJobAssigned
                    ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #f0fdf4 100%)"
                    : "linear-gradient(135deg, #fffbeb 0%, #fef3c7 60%, #fffbeb 100%)",
                  borderBottom: isJobAssigned ? "2px solid #86efac" : "2px solid #fbbf24",
                  transition: "background 0.6s ease, border-color 0.6s ease",
                }}
              >
                <div className="flex items-center gap-3 px-5 py-3">
                  {/* Status icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    background: isJobAssigned ? "#bbf7d0" : "#fde68a",
                    transition: "background 0.5s ease",
                  }}>
                    {isJobAssigned ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    )}
                  </div>

                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <p style={{
                      fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em",
                      textTransform: "uppercase", color: isJobAssigned ? "#15803d" : "#92400e",
                      lineHeight: 1.2, marginBottom: 2,
                    }}>
                      {isJobAssigned ? "Job Assigned" : (pinnedJobTitle ? "💬 Discussion in Progress" : "General Conversation")}
                    </p>
                    <p style={{
                      fontSize: "0.9rem", fontWeight: 700, color: "#111827",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                      {pinnedJobTitle || "Ongoing Discussion"}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {pinnedJobBudget && (
                        <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 500 }}>💰 {pinnedJobBudget}</span>
                      )}
                      {pinnedJobCategory && (
                        <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 500 }}>🏷 {pinnedJobCategory}</span>
                      )}
                      {!pinnedJobTitle && (
                        <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 500 }}>No specific project linked</span>
                      )}
                    </div>
                  </div>

                  {/* Action button */}
                  {pinnedJobId && isJobAssigned !== null && (
                    isJobAssigned ? (
                      <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 14px",
                        background: "transparent",
                        border: "1.5px solid #16a34a",
                        borderRadius: 20, color: "#15803d",
                        fontSize: "0.78rem", fontWeight: 600,
                        letterSpacing: "0.02em",
                      }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                          <polyline points="9 12 11 14 15 10" />
                        </svg>
                        Assigned
                      </div>
                    ) : (
                      isClientRole && (
                        <button
                          onClick={() => setShowAssignConfirm(true)}
                          style={{
                            padding: "7px 16px", background: "linear-gradient(135deg, #f59e0b, #d97706)",
                            border: "none", borderRadius: 8, color: "#fff", fontSize: "0.8rem",
                            fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(217,119,6,0.25)",
                            transition: "transform 0.1s, box-shadow 0.1s", whiteSpace: "nowrap",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
                          onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                        >
                          {pinnedJobPaymentStatus === "pending_assignment" ? "Deposit & Assign" : "Assign Job"}
                        </button>
                      )
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Deposit Required Banner ───────── */}
        {isClientRole && !isJobAssigned && pinnedJobPaymentStatus === "pending_assignment" && (
          <div className="bg-white border-y border-gray-200 mt-2 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-orange-50 flex-shrink-0">
                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-700 font-semibold text-[13px] uppercase tracking-wide">Deposit Required to Assign</p>
                <p className="text-gray-500 text-sm mt-0.5 font-medium">You posted this job with Pay Later. Fund deposit by matching the budget to release this assignment.</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Escrow Balance Bar (client only, when job assigned) ───────── */}
        {isClientRole && isJobAssigned && pinnedJobId && (
          <EscrowBalanceBar jobId={pinnedJobId} isClient={isClientRole} />
        )}

        {chatSearch.trim() !== "" && (
          <div className="flex items-center justify-between px-6 py-2 bg-blue-50 border-b border-blue-100 flex-shrink-0">
            <span className="text-sm text-blue-700">
              {matchingIndices.length > 0 ? `${currentMatchIndex + 1} of ${matchingIndices.length} matches` : "No matches"}
            </span>
            <div className="flex gap-2 items-center">
              <button onClick={goToPrevMatch} disabled={!matchingIndices.length} className="p-1 rounded hover:bg-blue-100 disabled:opacity-40">▲</button>
              <button onClick={goToNextMatch} disabled={!matchingIndices.length} className="p-1 rounded hover:bg-blue-100 disabled:opacity-40">▼</button>
              <button onClick={() => setChatSearch("")} className="text-xs text-blue-600 ml-2 hover:underline">Clear</button>
            </div>
          </div>
        )}


        <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4 min-h-0 scrollbar-hide">
          {loading ? (
            <div className="space-y-6">
              <div className="flex justify-start">
                <div className="w-9 h-9 rounded-full shimmer-bg flex-shrink-0" />
                <div className="ml-3 space-y-2">
                  <div className="h-11 w-64 rounded-2xl shimmer-bg" />
                  <div className="h-9 w-40 rounded-2xl shimmer-bg" />
                </div>
              </div>
              <div className="flex justify-end">
                <div className="mr-3 space-y-2 items-end flex flex-col">
                  <div className="h-12 w-56 rounded-2xl shimmer-bg" />
                  <div className="h-8 w-32 rounded-2xl shimmer-bg" />
                </div>
              </div>
              <div className="flex justify-start">
                <div className="w-9 h-9 rounded-full shimmer-bg flex-shrink-0" />
                <div className="ml-3 space-y-2">
                  <div className="h-16 w-72 rounded-2xl shimmer-bg" />
                </div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium">No messages yet</p>
                <p className="text-gray-400 text-sm mt-1">Start the conversation by sending a message</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => {
                // System messages get special centered rendering
                if (msg.messageType === "system_intro") {
                  return (
                    <div key={msg._id?.toString() || idx} ref={(el) => { messageRefs.current[idx] = el; }}>
                      {renderSystemMessage(msg)}
                    </div>
                  );
                }

                const own = isOwnMessage(msg);
                const timestamp = msg.timestamp ? new Date(msg.timestamp) : new Date();
                const showDate = idx === 0 || new Date(messages[idx - 1].timestamp).toDateString() !== timestamp.toDateString();
                const messageText = getMessageText(msg);

                return (
                  <div key={msg._id?.toString() || idx} ref={(el) => { messageRefs.current[idx] = el; }}>
                    {showDate && (
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full font-medium">
                          {timestamp.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                        </div>
                      </div>
                    )}
                    <div className={`flex ${own ? "justify-end" : "justify-start"}`}>
                      <div className={`flex gap-2 max-w-[70%] ${own ? "flex-row-reverse" : "flex-row"}`}>
                        {!own && (
                          otherUserProfileImage ? (
                            <img src={otherUserProfileImage} alt={otherUserDisplay} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient(otherUserDisplay)} rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                              {getInitials(otherUserDisplay)}
                            </div>
                          )
                        )}
                        <div>
                          {isEmojiOnly(messageText) && msg.messageType === "text" ? (
                            <div className="py-1">
                              <p className="text-4xl">{messageText}</p>
                            </div>
                          ) : (
                            <div className={`
                            ${checkIsImage(msg) ? "" : "px-4 py-2.5 rounded-2xl"}
                            ${own && !checkIsImage(msg) ? "bg-blue-600 text-white shadow-sm" : ""}
                            ${!own && !checkIsImage(msg) ? "bg-white text-gray-900 border border-gray-200 shadow-sm" : ""}
                            ${checkIsImage(msg) ? "rounded-xl overflow-hidden shadow-md" : ""}
                          `}>
                              {msg.messageType === "file" || msg.messageType === "image"
                                ? renderFileMessage(msg)
                                : <p className="text-[14.5px] whitespace-pre-wrap break-words leading-relaxed font-medium">{highlightText(messageText, chatSearch)}</p>
                              }
                            </div>
                          )}
                          <p className={`text-xs text-gray-400 mt-1 px-1 ${own ? "text-right" : "text-left"}`}>
                            {timestamp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {otherUserTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    {otherUserProfileImage ? (
                      <img src={otherUserProfileImage} alt={otherUserDisplay} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient(otherUserDisplay)} rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0`}>
                        {getInitials(otherUserDisplay)}
                      </div>
                    )}
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ── Restriction Error ────────────────────────────────────────────────── */}
        {restrictionError && (
          <div className="mx-6 mb-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-red-700">Message Blocked</p>
              <p className="text-xs text-red-600 mt-0.5">{restrictionError}</p>
            </div>
            <button onClick={() => setRestrictionError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Milestone Panel ──────────────────────────────────────────────────── */}
        {isJobAssigned && pinnedJobId && (
          <MilestonePanel
            jobId={pinnedJobId}
            chatId={chatId}
            userId={userId}
            isClient={isClientRole}
            isJobAssigned={isJobAssigned}
            jobBudget={pinnedJobBudget ? parseFloat(pinnedJobBudget) : undefined}
            jobCurrency={pinnedJobCurrency}
            otherUserName={otherUserDisplay}
          />
        )}

        {/* ── Input Area or Frozen Banner ─────────────────────────────────────────── */}
        {(chatStatus === "disputed" || isFrozen) ? (
          <div className="px-6 py-8 bg-white border-t border-gray-100">
            <div className="max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 shadow-sm p-6 text-center">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gray-100 rounded-full blur-2xl opacity-50" />
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-gray-100 rounded-full blur-2xl opacity-50" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                    <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-tight">Conversation Frozen</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                    This chat is temporarily locked due to an active dispute. Our moderation team is currently reviewing the case to ensure a fair resolution for both parties.
                  </p>

                  <div className="mt-6 pt-6 border-t border-gray-100 w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                      <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                      Under Review
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-gray-400 font-medium italic">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Communication will resume once the dispute is resolved.
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 py-4 bg-white border-t border-gray-200 flex-shrink-0">
            {restrictionError && (
              <div className="mb-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {restrictionError}
              </div>
            )}
            <div className="flex items-end gap-3 bg-gray-50 rounded-2xl p-2 border border-gray-200 transition-all focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
              <div className="flex items-center gap-1 mb-1">
                <button
                  onClick={openFilePicker}
                  disabled={uploadingFile}
                  title="Upload file"
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all disabled:opacity-50"
                >
                  {uploadingFile ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  )}
                </button>
                <div className="relative">
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="fixed inset-0" onClick={() => setShowEmojiPicker(false)} />
                      <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTyping();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(newMessage);
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none outline-none text-sm text-gray-900 placeholder-gray-400 py-2.5 resize-none max-h-32 min-h-[40px] scrollbar-hide"
              />
              <button
                onClick={() => sendMessage(newMessage)}
                disabled={!newMessage.trim() || loading}
                className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center ${!newMessage.trim() || loading
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-blue-200"
                  }`}
              >
                <svg className="w-5 h-5 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
          </div>
        )}

        {/* ── Assign Job Confirmation Modal ────────────────────────────────────── */}
        {showAssignConfirm && (
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.45)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowAssignConfirm(false); }}
          >
            <div style={{
              background: "#fff", borderRadius: 16, padding: "32px 28px",
              width: "min(420px, 92vw)", boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="22" height="22" fill="none" stroke="#d97706" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827", margin: 0 }}>Assign Job</h3>
                  <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: 0 }}>This action cannot be undone</p>
                </div>
              </div>

              <p style={{ fontSize: "0.9rem", color: "#374151", lineHeight: 1.65, marginBottom: 20 }}>
                Are you sure you want to assign <strong>"{pinnedJobTitle}"</strong> to{" "}
                <strong>{otherUserDisplay || "this freelancer"}</strong>?
                <br />
                <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                  This will move the job to "In Progress" and the freelancer will be notified.
                </span>
              </p>

              {assignError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                  <p style={{ fontSize: "0.82rem", color: "#dc2626", margin: 0 }}>⚠ {assignError}</p>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button
                  onClick={() => { setShowAssignConfirm(false); setAssignError(null); }}
                  disabled={assignLoading}
                  style={{
                    padding: "9px 20px", border: "1.5px solid #d1d5db", borderRadius: 8,
                    background: "#fff", color: "#374151", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignJob}
                  disabled={assignLoading}
                  style={{
                    padding: "9px 20px",
                    background: assignLoading ? "#9ca3af" : "linear-gradient(135deg, #f59e0b, #d97706)",
                    border: "none", borderRadius: 8, color: "#fff",
                    fontSize: "0.875rem", fontWeight: 700, cursor: assignLoading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  {assignLoading ? (
                    <>
                      <div style={{ width: 14, height: 14, border: "2px solid #fff", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                      Assigning...
                    </>
                  ) : "✓ Yes, Assign Job"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}