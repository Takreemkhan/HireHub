import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  error: any;
  fetchPendingRequests: () => void;
  acceptRequest: (requestId: string, fromUserId: string) => Promise<string | null>;
  rejectRequest: (requestId: string) => Promise<boolean>;
  clearError: () => void;
  totalCount: number;
  showNewConversation: boolean;
  setShowNewConversation: React.Dispatch<React.SetStateAction<boolean>>;
  handleNewConversation: () => void;
}

export const usePendingRequests = (userId: string | undefined): UsePendingRequestsReturn => {
  const queryClient = useQueryClient();
  const [showNewConversation, setShowNewConversation] = useState(false);
  const handleNewConversation = () => setShowNewConversation(true);

  const { data: pendingRequests = [], isLoading: loading, error, refetch } = useQuery<PendingRequest[]>({
    queryKey: ['pending-requests', userId],
    queryFn: async () => {
      const res = await fetch(`/api/chat-request?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return data.requests || [];
    },
    enabled: !!userId,
    staleTime: 60_000, // 1 minute
  });

  const acceptMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await fetch("/api/chat-request/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      if (!res.ok) throw new Error('Failed to accept');
      return res.json();
    },
    onSuccess: (data, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests', userId] });
      // Emit socket event if needed
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
      } catch (e) {}
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await fetch("/api/chat-request/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests', userId] });
    }
  });

  useEffect(() => {
    if (!userId) return;
    const socket = getSocket();
    const handleNewRequest = () => {
      queryClient.invalidateQueries({ queryKey: ['pending-requests', userId] });
    };
    socket.on("chat:request:received", handleNewRequest);
    return () => { socket.off("chat:request:received", handleNewRequest); };
  }, [userId, queryClient]);

  return {
    pendingRequests,
    loading,
    error,
    fetchPendingRequests: () => refetch(),
    acceptRequest: async (requestId) => {
      const res = await acceptMutation.mutateAsync(requestId);
      return res.chatId;
    },
    rejectRequest: async (requestId) => {
      const res = await rejectMutation.mutateAsync(requestId);
      return res.success;
    },
    clearError: () => {},
    totalCount: pendingRequests.length,
    showNewConversation,
    setShowNewConversation,
    handleNewConversation
  };
};