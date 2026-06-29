"use client";

import { useRef, useEffect } from "react";
import { FiMoreVertical, FiEye, FiTrash2 } from "react-icons/fi";
import type { User, ActionItem } from "../../types/admin.types";

interface Props {
  user: User;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onView?: (user: User) => void;
  onDelete?: (user: User) => void;
  menuItems?: ActionItem[];
  dropUp?: boolean;
}

export default function ActionMenu({ user, isOpen, onToggle, onClose, onView, onDelete, menuItems = [], dropUp = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen, onClose]);

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      {onView && (
        <button
          title="View Document"
          onClick={() => onView(user)}
          className="h-8 w-8 rounded-xl bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-[#FF6B35] border border-gray-200/60 flex items-center justify-center transition-all shadow-sm focus:outline-none"
        >
          <FiEye className="text-sm" />
        </button>
      )}

      {menuItems.length > 0 && (
        <button
          title="More actions"
          onClick={onToggle}
          className="h-8 w-8 rounded-xl bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-[#FF6B35] border border-gray-200/60 flex items-center justify-center transition-all shadow-sm focus:outline-none"
        >
          <FiMoreVertical className="text-sm" />
        </button>
      )}

      {isOpen && menuItems.length > 0 && (
        <div className={`absolute right-0 bg-white border border-gray-200/80 rounded-xl shadow-xl z-50 w-56 py-1.5 text-xs overflow-hidden ${
          dropUp ? "bottom-10" : "top-10"
        }`}>
          {menuItems.map((item, i) => {
            const label = typeof item.label === "function" ? item.label(user) : item.label;
            const isBlock = label.includes("Block");
            const isUnblock = label.includes("Unblock");
            const isReject = label.includes("Reject");
            const isApprove = label.includes("Approve");
            const isDownload = label.includes("Download");

            return (
              <button
                key={i}
                onClick={() => {
                  item.onClick(user);
                  onClose();
                }}
                className={`w-full text-left px-4 py-2.5 transition-all flex items-center gap-2.5 font-semibold border-l-4 border-transparent
                  ${isBlock ? "text-red-600 hover:bg-red-50 hover:border-red-500" : ""}
                  ${isUnblock ? "text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500" : ""}
                  ${isReject ? "text-orange-600 hover:bg-orange-50 hover:border-orange-500" : ""}
                  ${isApprove ? "text-green-600 hover:bg-green-50 hover:border-green-500" : ""}
                  ${isDownload ? "text-blue-600 hover:bg-blue-50 hover:border-blue-500" : ""}
                  ${!isBlock && !isUnblock && !isReject && !isApprove && !isDownload ? "text-gray-700 hover:bg-gray-50 hover:border-gray-300" : ""}
                `}
              >
                {label}
              </button>
            );
          })}

          {/* Blocked indicator */}
          {user.isBlocked && (
            <div className="mx-3 mt-1.5 mb-1 px-2.5 py-1.5 bg-red-50 border border-red-100 rounded-lg text-red-700 text-[10px] font-medium">
              🚫 User is currently blocked
            </div>
          )}

          {/* Rejection reason */}
          {user.rejectionReason && (
            <div className="mx-3 mt-1.5 mb-1.5 px-2.5 py-1.5 bg-orange-50/50 border border-orange-100 rounded-lg">
              <p className="text-orange-800 text-[10px] font-bold mb-0.5">Rejection Reason:</p>
              <p className="text-orange-700 text-[10px] leading-relaxed font-medium">{user.rejectionReason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}