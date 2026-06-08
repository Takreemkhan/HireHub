"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Icon from "@/components/ui/AppIcon";
import { usePendingRequests } from "@/app/hook/usePendingRequests";
import NewConversationModal from "@/app/components/chat/NewConversationModal";
import NotificationBell from "@/components/notifications/NotificationBell";
import { connectSocket } from "@/socket/socket";
import { Building2, ChevronDown, Plus } from "lucide-react";
import { useBusinessPages } from "@/app/hook/useBusinessPages";

interface HeaderProps {
  className?: string;
}

const Header = ({ className = "" }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [bpDropdownOpen, setBpDropdownOpen] = useState(false);
  const bpDropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const isFreelancerUser = (session?.user as any)?.role === "freelancer";

  const {
    showNewConversation,
    setShowNewConversation,
    totalCount,
    fetchPendingRequests,
    handleNewConversation,
  } = usePendingRequests(userId);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); setBpDropdownOpen(false); }, [pathname]);

  // Close BP dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bpDropdownRef.current && !bpDropdownRef.current.contains(e.target as Node)) {
        setBpDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: businessPages = [] } = useBusinessPages(userId, isFreelancerUser);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const userRole = session?.user?.role;
  const isClient = userRole === "client";
  const isFreelancer = userRole === "freelancer";

  // ── Avatar helpers ────────────────────────────────────────────────────────
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const avatarColors = [
    "bg-violet-600", "bg-blue-600", "bg-emerald-600",
    "bg-rose-600", "bg-amber-600", "bg-cyan-600",
  ];
  const getAvatarColor = (name?: string | null) => {
    if (!name) return avatarColors[0];
    return avatarColors[name.charCodeAt(0) % avatarColors.length];
  };

  const publicNavigationItems = [
    { name: "Home", path: "/", icon: "HomeIcon" },
    { name: "About", path: "/about", icon: "InformationCircleIcon" },
    { name: "Find Talent", path: "/freelancer-profiles", icon: "UserGroupIcon" },
    { name: "Find Job", path: "/search-and-discovery", icon: "MagnifyingGlassIcon" },
  ];

  const clientNavigationItems = [{ name: "Find Talent", path: "/freelancer-profiles", icon: "UserGroupIcon" }];
  const freelancerNavigationItems = [{ name: "Find Job", path: "/search-and-discovery", icon: "MagnifyingGlassIcon" }];

  const getWorkspaceDropdownItems = () => {
    const basePath = isFreelancer ? "/freelancer" : "/client";
    return [
      { name: "Messages", path: `${basePath}/messages`, icon: "ChatBubbleLeftRightIcon" },
      { name: "Payments", path: "/payment-center", icon: "CreditCardIcon" },
      { name: "Contracts & Agreements", path: `${basePath}/contracts`, icon: "DocumentCheckIcon" },
    ];
  };

  // Direct dashboard link (replaces old "More" dropdown)
  const getDashboardPath = () => {
    return isClient ? "/client-dashboard" : "/freelancer-dashboard";
  };

  const getNavigationItems = () => {
    if (!session?.user) return publicNavigationItems;
    return isClient ? clientNavigationItems : freelancerNavigationItems;
  };

  const navigationItems = getNavigationItems();
  const workspaceDropdownItems = session?.user ? getWorkspaceDropdownItems() : [];
  const dashboardPath = session?.user ? getDashboardPath() : "";
  const isActivePath = (path: string) => pathname === path;

  const handleSignOut = async () => {
    // Replace current history entry before signing out so the browser's
    // back button cannot navigate back to a protected page after logout.
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", "/homepage");
    }
    await signOut({ callbackUrl: "/homepage", redirect: true });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-card shadow-brand" : "bg-card"
        } ${className}`}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group" aria-label="FreelanceHub Pro Home">
            <div className="relative">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-105">
                <rect width="40" height="40" rx="8" fill="#1B365D" />
                <path d="M12 28V12H18C19.6569 12 21 13.3431 21 15V15C21 16.6569 19.6569 18 18 18H12"
                  stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M20 28V18H26C27.6569 18 29 19.3431 29 21V21C29 22.6569 27.6569 24 26 24H20"
                  stroke="#4299E1" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-display font-bold text-primary tracking-tight">FreelanceHub</span>
              <span className="text-xl font-display font-bold text-accent ml-1">Pro</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-body font-medium transition-all duration-300 ${isActivePath(item.path)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted hover:text-primary"
                  }`}>
                <Icon name={item.icon as any} size={20} />
                <span>{item.name}</span>
              </Link>
            ))}

            {session?.user && (
              <div className="relative group">
                <Link href="/workspace-dashboard"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-body font-medium transition-all duration-300 ${isActivePath("/workspace-dashboard")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted hover:text-primary"
                    }`}>
                  <Icon name="ChartBarIcon" size={20} />
                  <span>Workspace</span>
                  <Icon name="ChevronDownIcon" size={16} className="ml-1" />
                </Link>
                <div className="absolute left-0 top-full mt-2 w-64 bg-card rounded-lg shadow-brand-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-border overflow-hidden">
                  {workspaceDropdownItems.map((item, index) => (
                    <Link key={item.path} href={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 hover:bg-muted transition-colors duration-200 ${index === 0 ? "rounded-t-lg" : ""
                        } ${index === workspaceDropdownItems.length - 1 ? "rounded-b-lg" : ""
                        } ${isActivePath(item.path) ? "bg-muted text-primary font-medium" : "text-foreground"
                        }`}>
                      <Icon name={item.icon as any} size={20} />
                      <span className="font-body font-medium">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ✅ REPLACED "More" dropdown with direct Dashboard link */}
            {session?.user && (
              <Link href={dashboardPath}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-body font-medium transition-all duration-300 ${isActivePath(dashboardPath)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted hover:text-primary"
                  }`}>
                <Icon name="UserCircleIcon" size={20} />
                <span>Dashboard</span>
              </Link>
            )}

            {/* ── Business Page Button / Dropdown (freelancers only) ─── */}
            {session?.user && isFreelancerUser && (
              businessPages.length === 0 ? (
                <Link
                  href="/create-business-page"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-body font-medium transition-all duration-300 text-foreground hover:bg-muted hover:text-primary shadow-sm"
                >
                  <Plus size={16} />
                  <span>Business Page</span>
                </Link>
              ) : (
                <div className="relative" ref={bpDropdownRef}>
                  <button
                    onClick={() => setBpDropdownOpen(!bpDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-body font-medium transition-all duration-300 text-foreground hover:bg-muted hover:text-primary shadow-sm"
                  >
                    <Building2 size={16} />
                    <span>Business Pages</span>
                    <ChevronDown size={14} className={`transition-transform ${bpDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {bpDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Business Pages</p>
                      </div>
                      {businessPages.map((bp: any) => (
                        <button
                          key={bp._id}
                          onClick={() => { router.push(`/business-dashboard/${bp._id}`); setBpDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors text-left group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#1B365D] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {bp.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{bp.name}</p>
                            <p className="text-xs text-gray-400">Business Dashboard</p>
                          </div>
                          <Icon name="ChevronRightIcon" size={14} className="text-gray-300 group-hover:text-orange-400 transition-colors" />
                        </button>
                      ))}
                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => { router.push("/create-business-page"); setBpDropdownOpen(false); }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Plus size={16} className="text-gray-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">Create New Page</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </nav>

          <div className="flex items-center space-x-2">
            {/* NOTIFICATION BELL — freelancer & client */}
            {session?.user && (isFreelancer || isClient) && (
              <NotificationBell
                userId={userId}
                dashboardHref={isClient ? "/client-dashboard" : "/freelancer-dashboard"}
              />
            )}

            {status === "loading" ? (
              <div className="hidden lg:block w-24 h-10 bg-gray-200 animate-pulse rounded-lg" />
            ) : session?.user ? (
              <div className="hidden lg:flex items-center space-x-3">
                {/* User Avatar with online dot — replaces role badge */}
                <div className="relative flex-shrink-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold select-none ${getAvatarColor(session?.user?.name)}`}>
                    {getInitials(session?.user?.name)}
                  </div>
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>

                <button
                  onClick={handleSignOut}
                  className="hidden lg:flex items-center space-x-2 px-5 py-2.5 bg-red-600 text-white rounded-lg font-display font-semibold hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Icon name="ArrowRightOnRectangleIcon" size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/sign-in-page">
                  <div className="hidden lg:flex items-center space-x-2 px-5 py-2.5 bg-brand-blue text-white rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
                    <Icon name="ArrowRightOnRectangleIcon" size={20} />
                    <span>Sign In</span>
                  </div>
                </Link>
                <Link href="/sign-up-page">
                  <div className="hidden lg:flex items-center space-x-2 px-5 py-2.5 bg-brand-cta text-white rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
                    <span>Get Started</span>
                    <Icon name="ArrowRightIcon" size={20} />
                  </div>
                </Link>
              </>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Icon name={isMobileMenuOpen ? "XMarkIcon" : "Bars3Icon"} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-card z-40 overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-2">
            {session?.user && (
              <div className={`px-4 py-2 rounded-lg text-center font-semibold ${isClient ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                }`}>
                {isClient ? "👔 Client Account" : "💼 Freelancer Account"}
              </div>
            )}

            {navigationItems.map((item) => (
              <Link key={item.path} href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-body font-medium transition-all duration-300 ${isActivePath(item.path)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground hover:bg-muted hover:text-primary"
                  }`}>
                <Icon name={item.icon as any} size={22} />
                <span>{item.name}</span>
              </Link>
            ))}

            {session?.user && (
              <>
                <div className="pt-4 border-t border-border mt-4">
                  <p className="px-4 py-2 text-sm font-semibold text-muted-foreground">Workspace</p>
                  {workspaceDropdownItems.map((item) => (
                    <Link key={item.path} href={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-body font-medium transition-all duration-300 ${isActivePath(item.path)
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-muted hover:text-primary"
                        }`}>
                      <Icon name={item.icon as any} size={22} />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>

                {/* ✅ Direct Dashboard link in mobile menu */}
                <Link href={dashboardPath}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-body font-medium transition-all duration-300 ${isActivePath(dashboardPath)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:bg-muted hover:text-primary"
                    }`}>
                  <Icon name="UserCircleIcon" size={22} />
                  <span>Dashboard</span>
                </Link>

                {/* ── Business Pages (mobile) ── */}
                {isFreelancerUser && (
                  <div className="pt-3 border-t border-border mt-2">
                    <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business Pages</p>
                    {businessPages.map((bp: any) => (
                      <Link key={bp._id} href={`/business-dashboard/${bp._id}`}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg font-body font-medium text-foreground hover:bg-muted hover:text-primary transition-all">
                        <Building2 size={22} />
                        <span>{bp.name}</span>
                      </Link>
                    ))}
                    <Link href="/create-business-page"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg font-body font-medium text-[#FF6B35] hover:bg-orange-50 transition-all">
                      <Plus size={22} />
                      <span>{businessPages.length === 0 ? "+ Business Page" : "Create New Page"}</span>
                    </Link>
                  </div>
                )}
              </>
            )}

            <div className="pt-4 space-y-2 border-t border-border mt-4">
              {session?.user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-red-600 text-white rounded-lg font-display font-semibold hover:bg-red-700 transition-all duration-300 shadow-sm"
                >
                  <Icon name="ArrowRightOnRectangleIcon" size={20} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <>
                  <Link href="/sign-in-page">
                    <div className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-brand-blue text-white rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-sm cursor-pointer">
                      <Icon name="ArrowRightOnRectangleIcon" size={20} />
                      <span>Sign In</span>
                    </div>
                  </Link>
                  <Link href="/sign-up-page">
                    <div className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-brand-cta text-white rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-sm cursor-pointer">
                      <span>Get Started</span>
                      <Icon name="ArrowRightIcon" size={20} />
                    </div>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {showNewConversation && userId && (
        <NewConversationModal
          userId={userId}
          onClose={() => setShowNewConversation(false)}
          onConversationCreated={(_chatId) => setShowNewConversation(false)}
        />
      )}
    </header>
  );
};

export default Header;