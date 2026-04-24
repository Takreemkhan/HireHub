"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Icon from "@/components/ui/AppIcon";
import { usePendingRequests } from "@/app/hook/usePendingRequests";
import NewConversationModal from "@/app/components/chat/NewConversationModal";
// ✅ NEW IMPORT
import NotificationBell from "@/components/notifications/NotificationBell";

interface HeaderProps {
  className?: string;
}

const Header = ({ className = "" }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

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

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

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
                  <button className="hidden lg:flex items-center space-x-2 px-5 py-2.5 bg-brand-blue text-white rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-sm hover:shadow-md">
                    <Icon name="ArrowRightOnRectangleIcon" size={20} />
                    <span>Sign In</span>
                  </button>
                </Link>
                <Link href="/sign-up-page">
                  <button className="hidden lg:flex items-center space-x-2 px-5 py-2.5 bg-brand-cta text-white rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-sm hover:shadow-md">
                    <span>Get Started</span>
                    <Icon name="ArrowRightIcon" size={20} />
                  </button>
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
                    <button className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-brand-blue text-white rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-sm">
                      <Icon name="ArrowRightOnRectangleIcon" size={20} />
                      <span>Sign In</span>
                    </button>
                  </Link>
                  <Link href="/sign-up-page">
                    <button className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-brand-cta text-white rounded-lg font-display font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-sm">
                      <span>Get Started</span>
                      <Icon name="ArrowRightIcon" size={20} />
                    </button>
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