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
}

export default function ActionMenu({ user, isOpen, onToggle, onClose, onView, onDelete, menuItems = [] }: Props) {
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
    <div ref={ref} className="relative flex items-center gap-1.5">
      {onView && (
        <button title="View Document" onClick={() => onView(user)}
          className="h-7 w-7 rounded-lg bg-white/5 hover:bg-sky-500/20 hover:text-sky-400 flex items-center justify-center transition">
          <FiEye className="text-xs" />
        </button>
      )}

      {menuItems.length > 0 && (
        <button title="More actions" onClick={onToggle}
          className="h-7 w-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition">
          <FiMoreVertical className="text-xs" />
        </button>
      )}

      {isOpen && menuItems.length > 0 && (
        <div className="absolute right-0 top-9 bg-[#1a2744] border border-white/10 rounded-xl shadow-2xl z-50 w-52 py-1.5 text-xs overflow-hidden">
          {menuItems.map((item, i) => {
            const label = typeof item.label === "function" ? item.label(user) : item.label;
            const isBlock   = label.includes("Block");
            const isUnblock = label.includes("Unblock");
            const isReject  = label.includes("Reject");
            const isApprove = label.includes("Approve");
            const isDownload = label.includes("Download");

            return (
              <button key={i} onClick={() => { item.onClick(user); onClose(); }}
                className={`w-full text-left px-4 py-2.5 transition flex items-center gap-2.5 font-medium
                  ${isBlock   ? "text-red-400 hover:bg-red-500/10"     : ""}
                  ${isUnblock ? "text-green-400 hover:bg-green-500/10" : ""}
                  ${isReject  ? "text-orange-400 hover:bg-orange-500/10" : ""}
                  ${isApprove ? "text-emerald-400 hover:bg-emerald-500/10" : ""}
                  ${isDownload ? "text-sky-400 hover:bg-sky-500/10"    : ""}
                  ${!isBlock && !isUnblock && !isReject && !isApprove && !isDownload ? "text-white hover:bg-white/10" : ""}
                `}>
                {label}
              </button>
            );
          })}

          {/* Blocked indicator */}
          {user.isBlocked && (
            <div className="mx-3 mt-1 mb-1 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px]">
              🚫 User is currently blocked
            </div>
          )}

          {/* Rejection reason */}
          {user.rejectionReason && (
            <div className="mx-3 mt-1 mb-1.5 px-2 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <p className="text-orange-400 text-[10px] font-semibold mb-0.5">Rejection Reason:</p>
              <p className="text-orange-300 text-[10px] leading-relaxed">{user.rejectionReason}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}