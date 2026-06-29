
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { getSocket } from "@/socket/socket";
import { usePathname, useSearchParams } from "next/navigation";

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

function matchesCurrentPage(n: Notification, pathname: string, searchParams: any) {
    if (n.isRead) return false;

    // 1. Check by chatId
    const chatId = searchParams.get("chatId");
    if (chatId && n.meta?.chatId === chatId) {
        return true;
    }

    // 2. Check by jobId (covers recommended jobs, project detail pages, and client dashboard current jobs)
    const jobId = searchParams.get("jobId") || pathname.split("/").pop();
    if (jobId && n.meta?.jobId === jobId) {
        return true;
    }

    // 3. Check by tab (covers freelancer-dashboard tabs)
    if (pathname === "/freelancer-dashboard") {
        const tab = searchParams.get("tab") || "overview";
        if (n.type === "job_invite" && tab === "invitations") return true;
        if (n.type === "proposal_update" && tab === "current") return true;
        if (n.type === "review" && tab === "overview") return true;
    }

    // 4. Check by exact link matching (excluding query params or checking full link)
    if (n.link) {
        try {
            const nUrl = new URL(n.link, "http://localhost");
            if (nUrl.pathname === pathname) {
                let paramsMatch = true;
                nUrl.searchParams.forEach((val, key) => {
                    if (searchParams.get(key) !== val) {
                        paramsMatch = false;
                    }
                });
                if (paramsMatch) return true;
            }
        } catch {
            if (n.link === pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")) {
                return true;
            }
        }
    }

    return false;
}

export function useNotifications(userId: string | undefined): UseNotificationsReturn {
    const queryClient = useQueryClient();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { data: notifications = [], isLoading: loading, error, refetch } = useQuery<Notification[]>({
        queryKey: ["notifications", userId],
        queryFn: async () => {
            const res = await fetch("/api/notifications?limit=30");
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "Failed to fetch");
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

    useEffect(() => {
        if (!userId || !notifications.length) return;

        notifications.forEach((n) => {
            if (matchesCurrentPage(n, pathname, searchParams)) {
                markAsReadMutation.mutate(n._id);
            }
        });
    }, [pathname, searchParams, notifications, userId]);

    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/notifications", { method: "PUT" });
            if (!res.ok) {
                throw new Error("Failed to mark all notifications as read");
            }
            return res.json();
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["notifications", userId] });
            const previous = queryClient.getQueryData(["notifications", userId]);
            queryClient.setQueryData(["notifications", userId], (old: Notification[] | undefined) => 
                old?.map(n => ({ ...n, isRead: true }))
            );
            return { previous };
        },
        onError: (err, variables, context) => {
            if (context?.previous) {
                queryClient.setQueryData(["notifications", userId], context.previous);
            }
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
