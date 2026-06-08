
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { getSocket } from "@/socket/socket";

export interface NotificationMeta {
    jobId?: string | null;
    chatId?: string | null;
    proposalId?: string | null;
    jobTitle?: string | null;
    amount?: number | null;
}

export interface Notification {
    _id: string;
    type: "message" | "job_invite" | "proposal_update" | "recommended_job" | "contract" | "payment" | "review";
    title: string;
    body: string;
    meta: NotificationMeta;
    link: string | null;
    isRead: boolean;
    createdAt: string;
    senderId?: {
        _id: string;
        name: string;
        image: string | null;
        role: string;
    } | null;
}

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: any;
    fetchNotifications: () => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    deleteNotification: (id: string) => void;
}

export function useNotifications(userId: string | undefined): UseNotificationsReturn {
    const queryClient = useQueryClient();

    const { data: notifications = [], isLoading: loading, error, refetch } = useQuery<Notification[]>({
        queryKey: ["notifications", userId],
        queryFn: async () => {
            const res = await fetch("/api/notifications?limit=30");
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "Failed to fetch");
            
            // Auto-mark as read for active chat if needed (legacy logic)
            if (typeof window !== "undefined") {
                const urlParams = new URLSearchParams(window.location.search);
                const activeChatId = urlParams.get("chatId");
                if (activeChatId) {
                    data.notifications.forEach((n: Notification) => {
                        if (!n._id) return;
                        if (!n.isRead && n.type === "message" && n.meta?.chatId === activeChatId) {
                            fetch(`/api/notifications/${n._id}`, { method: "PATCH" }).catch(() => { });
                        }
                    });
                }
            }
            return data.notifications;
        },
        enabled: !!userId,
        staleTime: 30_000, // 30 seconds
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/notifications/${id}`, { method: "PATCH" });
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["notifications", userId] });
            const previous = queryClient.getQueryData(["notifications", userId]);
            queryClient.setQueryData(["notifications", userId], (old: Notification[] | undefined) => 
                old?.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            return { previous };
        },
        onError: (err, id, context) => {
            if (context?.previous) queryClient.setQueryData(["notifications", userId], context.previous);
        }
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            await fetch("/api/notifications", { method: "PUT" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        }
    });

    const deleteNotificationMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/notifications/${id}`, { method: "DELETE" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        }
    });

    useEffect(() => {
        if (!userId) return;
        const socket = getSocket();
        const handleNewNotification = () => {
            queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        };
        socket.on("notification:new", handleNewNotification);
        return () => { socket.off("notification:new", handleNewNotification); };
    }, [userId, queryClient]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications: () => refetch(),
        markAsRead: (id) => markAsReadMutation.mutate(id),
        markAllAsRead: () => markAllAsReadMutation.mutate(),
        deleteNotification: (id) => deleteNotificationMutation.mutate(id),
    };
}
