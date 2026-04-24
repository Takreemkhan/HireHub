

import { useState, useEffect, useCallback, useRef } from "react";
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
    error: string | null;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
}

export function useNotifications(userId: string | undefined): UseNotificationsReturn {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    // ── Derived unread count
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    // ── Fetch all notifications from API
    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/notifications?limit=30");
            const data = await res.json();

            if (data.success) {
                if (typeof window !== "undefined") {
                    const urlParams = new URLSearchParams(window.location.search);
                    const activeChatId = urlParams.get("chatId");
                    if (activeChatId) {
                        data.notifications.forEach((n: Notification) => {
                            if (!n.isRead && n.type === "message" && n.meta?.chatId === activeChatId) {
                                n.isRead = true;
                                fetch(`/api/notifications/${n._id}`, { method: "PATCH" }).catch(() => { });
                            }
                        });
                    }
                }
                setNotifications(data.notifications);
            } else {
                setError(data.error || "Failed to load notifications");
            }
        } catch (err) {
            setError("Network error while loading notifications");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // ── Mark single notification as read
    const markAsRead = useCallback(async (id: string) => {
        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        try {
            await fetch(`/api/notifications/${id}`, { method: "PATCH" });
        } catch {
            // Revert on failure
            setNotifications((prev) =>
                prev.map((n) => (n._id === id ? { ...n, isRead: false } : n))
            );
        }
    }, []);

    // ── Mark all as read
    const markAllAsRead = useCallback(async () => {
        // Optimistic update
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        try {
            await fetch("/api/notifications", { method: "PUT" });
        } catch {
            await fetchNotifications(); // Re-sync on failure
        }
    }, [fetchNotifications]);

    // ── Delete a single notification
    const deleteNotification = useCallback(async (id: string) => {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        try {
            await fetch(`/api/notifications/${id}`, { method: "DELETE" });
        } catch {
            await fetchNotifications(); // Re-sync on failure
        }
    }, [fetchNotifications]);

    // ── Listen for custom chat:read event
    useEffect(() => {
        if (typeof window === "undefined") return;
        const handleChatRead = (e: Event) => {
            const customEvent = e as CustomEvent;
            const openedChatId = customEvent.detail?.chatId;
            if (openedChatId) {
                setNotifications((prev) =>
                    prev.map((n) =>
                        (!n.isRead && n.type === "message" && n.meta?.chatId === openedChatId)
                            ? { ...n, isRead: true }
                            : n
                    )
                );
            }
        };
        window.addEventListener("chat:read", handleChatRead);
        return () => window.removeEventListener("chat:read", handleChatRead);
    }, []);

    // ── Socket.IO — listen for real-time new notifications
    useEffect(() => {
        if (!userId) return;

        let socket: ReturnType<typeof getSocket> | null = null;

        try {
            socket = getSocket();

            const handleNewNotification = (notification: Notification) => {
                if (typeof window !== "undefined") {
                    const urlParams = new URLSearchParams(window.location.search);
                    const activeChatId = urlParams.get("chatId");
                    if (notification.type === "message" && notification.meta?.chatId === activeChatId) {
                        // Immediately mark as read and don't count it as unread
                        fetch(`/api/notifications/${notification._id}`, { method: "PATCH" }).catch(() => { });
                        setNotifications((prev) => [{ ...notification, isRead: true }, ...prev]);
                        return;
                    }
                }
                setNotifications((prev) => [notification, ...prev]);
            };

            socket.on("notification:new", handleNewNotification);

            return () => {
                socket?.off("notification:new", handleNewNotification);
            };
        } catch (err) {
            console.warn("Socket not available for notifications, using polling.");
        }
    }, [userId]);

    // ── Polling fallback — refresh every 30 seconds
    useEffect(() => {
        if (!userId) return;
        fetchNotifications();

        pollingRef.current = setInterval(fetchNotifications, 30_000);
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [fetchNotifications, userId]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
}
