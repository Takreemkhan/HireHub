"use client";

import React, { useRef, useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { useNotifications, Notification } from "@/app/hook/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

interface NotificationBellProps {
    userId: string | undefined;
    dashboardHref?: string;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ userId, dashboardHref = "/freelancer-dashboard" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
    } = useNotifications(userId);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleBellClick = () => {
        setIsOpen((prev) => !prev);
        if (!isOpen) {
            fetchNotifications(); // Refresh on open
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Bell Button */}
            <button
                onClick={handleBellClick}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400"
                aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
            >
                <BellIcon className="w-6 h-6 text-foreground" />

                {/* Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <NotificationDropdown
                    notifications={notifications}
                    loading={loading}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onDelete={deleteNotification}
                    onClose={() => setIsOpen(false)}
                    dashboardHref={dashboardHref}
                />
            )}
        </div>
    );
};

export default NotificationBell;