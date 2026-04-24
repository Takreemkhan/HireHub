"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
    ChatBubbleLeftRightIcon,
    BriefcaseIcon,
    DocumentCheckIcon,
    SparklesIcon,
    CreditCardIcon,
    StarIcon,
    BellSlashIcon,
    CheckIcon,
    TrashIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Notification } from "@/app/hook/useNotifications";

interface Props {
    notifications: Notification[];
    loading: boolean;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
    onDelete: (id: string) => void;
    onClose: () => void;
    dashboardHref?: string;
}

const TYPE_CONFIG: Record<
    Notification["type"],
    { icon: React.ElementType; bg: string; iconColor: string; label: string }
> = {
    message: { icon: ChatBubbleLeftRightIcon, bg: "bg-blue-100", iconColor: "text-blue-600", label: "Message" },
    job_invite: { icon: BriefcaseIcon, bg: "bg-orange-100", iconColor: "text-orange-600", label: "Job Invite" },
    proposal_update: { icon: DocumentCheckIcon, bg: "bg-green-100", iconColor: "text-green-600", label: "Proposal" },
    recommended_job: { icon: SparklesIcon, bg: "bg-purple-100", iconColor: "text-purple-600", label: "Recommended" },
    contract: { icon: DocumentCheckIcon, bg: "bg-indigo-100", iconColor: "text-indigo-600", label: "Contract" },
    payment: { icon: CreditCardIcon, bg: "bg-emerald-100", iconColor: "text-emerald-600", label: "Payment" },
    review: { icon: StarIcon, bg: "bg-yellow-100", iconColor: "text-yellow-600", label: "Review" },
};


const FILTER_TABS = [
    { key: "all", label: "All" },
    { key: "message", label: "Messages" },
    { key: "job_invite", label: "Invites" },
    { key: "recommended_job", label: "Recommended" },
    { key: "payment", label: "Payments" },

] as const;

type FilterKey = (typeof FILTER_TABS)[number]["key"];

const NotificationDropdown: React.FC<Props> = ({
    notifications,
    loading,
    onMarkAsRead,
    onMarkAllAsRead,
    onDelete,
    onClose,
    dashboardHref = "/freelancer-dashboard",
}) => {
    const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

    const filtered =
        activeFilter === "all"
            ? notifications
            : notifications.filter((n) => n.type === activeFilter);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (

        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-[1000] flex flex-col max-h-[520px]"
            style={{ width: "clamp(320px, 90vw, 440px)" }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 whitespace-nowrap"
                        >
                            <CheckIcon className="w-3.5 h-3.5" />
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                        <XMarkIcon className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </div>


            <div
                className="flex gap-1 px-3 py-2 border-b border-gray-100 flex-shrink-0 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {FILTER_TABS.map((tab) => {
                    const count =
                        tab.key === "all"
                            ? notifications.length
                            : notifications.filter((n) => n.type === tab.key).length;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveFilter(tab.key)}

                            className={`flex-shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${activeFilter === tab.key
                                ? "bg-[#FF6B35] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {tab.label}
                            {count > 0 && (
                                <span className={`ml-1 ${activeFilter === tab.key ? "opacity-80" : "text-gray-400"}`}>
                                    ({count})
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto flex-1">
                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF6B35]" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <BellSlashIcon className="w-10 h-10 mb-2 opacity-50" />
                        <p className="text-sm">No notifications yet </p>
                    </div>
                ) : (
                    <ul>
                        {filtered.map((n) => (
                            <NotificationItem
                                key={n._id}
                                notification={n}
                                onMarkAsRead={onMarkAsRead}
                                onDelete={onDelete}
                                onClose={onClose}
                            />
                        ))}
                    </ul>
                )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 text-center flex-shrink-0">
                <Link
                    href={dashboardHref}
                    onClick={onClose}
                    className="text-xs text-[#FF6B35] hover:underline font-medium"
                >
                    View all notifications →
                </Link>
            </div>
        </div>
    );
};

// Single notification row
const NotificationItem: React.FC<{
    notification: Notification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}> = ({ notification: n, onMarkAsRead, onDelete, onClose }) => {
    const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.message;
    const Icon = config.icon;

    const timeAgo = (() => {
        try {
            return formatDistanceToNow(new Date(n.createdAt), { addSuffix: true });
        } catch {
            return "";
        }
    })();

    const handleClick = () => {
        if (!n.isRead) onMarkAsRead(n._id);
        onClose();
    };

    const content = (
        <li className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer group relative ${!n.isRead ? "bg-orange-50/60" : ""
            }`}>
            {!n.isRead && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
            )}
            <div className={`flex-shrink-0 w-9 h-9 rounded-full ${config.bg} flex items-center justify-center mt-0.5`}>
                <Icon className={`w-4 h-4 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${!n.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                    {n.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                <p className="text-[11px] text-gray-400 mt-1">{timeAgo}</p>
            </div>
            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!n.isRead && (
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMarkAsRead(n._id); }}
                        className="p-1 rounded hover:bg-green-100 transition-colors"
                        title="Mark as read"
                    >
                        <CheckIcon className="w-3.5 h-3.5 text-green-600" />
                    </button>
                )}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(n._id); }}
                    className="p-1 rounded hover:bg-red-100 transition-colors"
                    title="Delete"
                >
                    <TrashIcon className="w-3.5 h-3.5 text-red-500" />
                </button>
            </div>
        </li>
    );

    if (n.link) {
        return (
            <Link href={n.link} onClick={handleClick} className="block">
                {content}
            </Link>
        );
    }
    return <div onClick={handleClick}>{content}</div>;
};

export default NotificationDropdown;