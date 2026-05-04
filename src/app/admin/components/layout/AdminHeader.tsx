"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiShield, FiLogOut, FiUser, FiChevronDown } from "react-icons/fi";

interface Props {
  title?: string;
  badgeLabel?: string;
  avatarLetter?: string;
}

export default function AdminHeader({
  title        = "FreelanceHub Pro",
  badgeLabel   = "Admin Panel",
  avatarLetter = "A",
}: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut]     = useState(false);
  const dropdownRef                     = useRef<HTMLDivElement>(null);
  const router                          = useRouter();

  // Dropdown ke bahar click karne par close karo
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      // API call to logout
      await fetch("/api/adminAuth/logout", { method: "POST" });

      // localStorage tokens clear karo
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Admin login page par redirect karo
      router.replace("/adminlogin");
    } catch {
      // Error aaye tab bhi logout karo
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      router.replace("/adminlogin");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Logo */}
      <div className="font-bold text-lg tracking-wide text-gray-900">{title}</div>

      {/* Badge */}
      <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5">
        <FiShield className="text-orange-500" />
        <span className="text-sm font-medium text-gray-700">{badgeLabel}</span>
      </div>

      {/* Avatar + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-1.5 group"
          aria-label="Admin menu"
        >
          <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center font-bold text-sm text-white select-none group-hover:bg-orange-600 transition-colors">
            {avatarLetter}
          </div>
          <FiChevronDown
            className={`text-gray-500 transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
            size={15}
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
            {/* Profile option */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-500 border-b border-gray-100 select-none">
              <FiUser size={14} />
              <span className="font-medium">Admin</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-xl disabled:opacity-60"
            >
              {loggingOut ? (
                <span className="h-3.5 w-3.5 border-2 border-red-400 border-t-red-600 rounded-full animate-spin" />
              ) : (
                <FiLogOut size={14} />
              )}
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}