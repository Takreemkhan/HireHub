// hooks/usePendingRequests.ts
import { useState, useEffect, useCallback } from 'react';
import { getSocket } from '@/socket/socket';

interface PendingRequest {
  _id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface UsePendingRequestsReturn {
  pendingRequests: PendingRequest[];
  loading: boolean;
  error: string | null;
  fetchPendingRequests: () => Promise<void>;
  acceptRequest: (requestId: string, fromUserId: string) => Promise<string | null>;
  rejectRequest: (requestId: string) => Promise<boolean>;
  clearError: () => void;
  totalCount: number;
   showNewConversation: boolean;
  setShowNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
    handleNewConversation: () => void;
}

export const usePendingRequests = (userId: string | undefined): UsePendingRequestsReturn => {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
    const [showNewConversation, setShowNewConversation] = useState(false);
const handleNewConversation = () => setShowNewConversation(true);

  const fetchPendingRequests = useCallback(async () => {
    if (!userId) {
      setPendingRequests([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/chat-request?userId=${userId}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch requests: ${res.status}`);
      }

      const data = await res.json();
      
      // Backend returns requests where current user is the receiver
      const received = data.requests || [];
      setPendingRequests(received);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch pending requests");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const acceptRequest = useCallback(async (requestId: string, fromUserId: string): Promise<string | null> => {
    if (!userId) {
      setError("User not authenticated");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat-request/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to accept request: ${res.status}`);
      }

      const data = await res.json();

      if (data.chatId) {
        // Remove the accepted request from the list
        setPendingRequests(prev => prev.filter(req => req._id !== requestId));

        // Send real-time notification
        try {
          const socket = getSocket();
          if (socket.connected) {
            socket.emit("chat:accept", {
              requestId,
              chatId: data.chatId,
              fromUserId: data.fromUserId,
              toUserId: userId,
            });
          }
        } catch (socketError) {
          console.warn("Could not send real-time notification:", socketError);
        }

        return data.chatId;
      } else {
        throw new Error(data.error || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      setError(error instanceof Error ? error.message : "Failed to accept request");
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const rejectRequest = useCallback(async (requestId: string): Promise<boolean> => {
    if (!userId) {
      setError("User not authenticated");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat-request/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to reject request: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        // Remove the rejected request from the list
        setPendingRequests(prev => prev.filter(req => req._id !== requestId));
        return true;
      } else {
        throw new Error(data.error || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      setError(error instanceof Error ? error.message : "Failed to reject request");
      return false;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Set up socket listener for new requests
  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();

    const handleNewRequest = (data: any) => {
      // When a new request is received, refresh the list
      fetchPendingRequests();
    };

    socket.on("chat:request:received", handleNewRequest);

    return () => {
      socket.off("chat:request:received", handleNewRequest);
    };
  }, [userId, fetchPendingRequests]);

  // Initial fetch
  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  return {
    pendingRequests,
    loading,
    error,
    fetchPendingRequests,
    acceptRequest,
    rejectRequest,
    clearError,
    totalCount: pendingRequests.length,
    showNewConversation,
     setShowNewConversation,
     handleNewConversation
  };
};