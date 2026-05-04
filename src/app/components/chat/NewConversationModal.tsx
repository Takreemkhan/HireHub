"use client";

import { useState } from "react";
import { usePendingRequests } from "@/app/hook/usePendingRequests";
import { getSocket } from "@/socket/socket";
import { getAvatarGradient, getInitials } from "@/utils/avatarColors";

interface NewConversationModalProps {
  userId: string;
  onClose: () => void;
  onConversationCreated: (chatId: string) => void;
}

export default function NewConversationModal({
  userId,
  onClose,
  onConversationCreated
}: NewConversationModalProps) {
  const [toUserId, setToUserId] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [activeTab, setActiveTab] = useState<'send' | 'pending'>('send');

  // Use the custom hook
  const {
    pendingRequests,
    loading: pendingLoading,
    error: pendingError,
    acceptRequest,
    fetchPendingRequests,
    clearError,
    totalCount
  } = usePendingRequests(userId);

  const sendRequest = async () => {
    if (!toUserId.trim()) {
      setSendError("Please enter an email address");
      return;
    }

    if (toUserId.trim() === userId) {
      setSendError("You cannot send a request to yourself");
      return;
    }

    setSending(true);
    setSendError("");

    try {
      const res = await fetch("/api/chat-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: userId,
          toUserId: toUserId.trim(),
        }),
      });

      const data = await res.json();

      if (data.error) {
        setSendError(data.error);
        return;
      }

      if (data.requestId) {
        try {
          const socket = getSocket();
          if (socket.connected) {
            socket.emit("chat:request", {
              fromUserId: userId,
              toUserId: toUserId.trim(),
              requestId: data.requestId,
            });
          }
        } catch (error) {
          console.warn("Could not send real-time notification:", error);
        }

        setToUserId("");
        showSuccessMessage("✓ Request sent successfully");
      } else {
        setSendError(data.message || "Request already sent or failed");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setSendError("Failed to send request. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleAcceptRequest = async (requestId: string, fromUserId: string) => {
    const chatId = await acceptRequest(requestId, fromUserId);
    if (chatId) {
      onConversationCreated(chatId);
    }
  };

  const showSuccessMessage = (message: string) => {
    const successMsg = document.createElement('div');
    successMsg.className = 'bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm mb-4';
    successMsg.textContent = message;
    document.querySelector('.modal-content')?.prepend(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">New Conversation</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => {
              setActiveTab('send');
              clearError();
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'send'
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Send Request
          </button>
          <button
            onClick={() => {
              setActiveTab('pending');
              fetchPendingRequests();
            }}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === 'pending'
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Pending Requests
            {totalCount > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalCount > 9 ? '9+' : totalCount}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'send' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter email address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={toUserId}
                  onChange={(e) => {
                    setToUserId(e.target.value);
                    setSendError("");
                  }}
                  onKeyPress={(e) => e.key === "Enter" && sendRequest()}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  disabled={sending}
                />
              </div>

              {sendError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {sendError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={sendRequest}
                  disabled={sending || !toUserId.trim()}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {sending ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {pendingError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm mb-4">
                  {pendingError}
                </div>
              )}

              {pendingLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {pendingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarGradient(request.fromUserId)} rounded-full flex items-center justify-center text-white font-semibold shadow-sm`}>
                          {getInitials(request.fromUserId)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {request.fromUserId.split('@')[0]}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{request.fromUserId}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAcceptRequest(request._id, request.fromUserId)}
                        disabled={pendingLoading}
                        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
                      >
                        Accept Request
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">No pending requests</p>
                  <p className="text-gray-400 text-sm mt-1">You don't have any pending chat requests</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}