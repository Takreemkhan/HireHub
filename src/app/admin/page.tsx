"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./components/layout/AdminHeader";
import UserTable from "./components/table/UserTable";
import { useAdminUsers } from "./hooks/useAdminUsers";
import type { User, ActionItem } from "./types/admin.types";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { ListSkeleton, DetailSkeleton, WorkspaceSkeleton } from "./components/Skeletons";

const DisputeDetail = dynamic(() => import("./components/DisputeDetail"), {
  loading: () => <DetailSkeleton />,
  ssr: false,
});

const ResolutionWorkspace = dynamic(() => import("./components/ResolutionWorkspace"), {
  loading: () => <WorkspaceSkeleton />,
  ssr: false,
});

import {
  FiHome,
  FiCheckSquare,
  FiAlertTriangle,
  FiUsers,
  FiBell,
  FiSettings,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTrash2,
  FiLock,
  FiUnlock,
  FiInfo,
  FiDollarSign,
  FiFileText,
  FiShield,
  FiLogOut,
  FiUser,
  FiChevronDown,
  FiMail,
  FiCalendar,
  FiEye,
  FiSearch,
  FiMaximize,
  FiX,
  FiArrowLeft,
  FiSave,
  FiSend,
  FiMessageSquare,
  FiUpload,
  FiEdit3,
} from "react-icons/fi";

type Tab = "dashboard" | "verification" | "disputes" | "users" | "notifications" | "settings" | "pending-users";

interface PartySubmission {
  description: string;
  additionalNotes: string;
  mediaFiles: any[];
  submittedAt: string;
  submittedBy?: string;
}

interface ResolutionSummary {
  resolutionTitle: string;
  resolutionCategory: string;
  finalDecision: string;
  adminNotes: string;
  internalNotes: string;
  financial: {
    refundClientAmount: number;
    releaseFreelancerAmount: number;
    platformAdjustment: number;
  };
  settings: {
    reopenChat: boolean;
    sendSystemMessage: boolean;
    notifyClient: boolean;
    notifyFreelancer: boolean;
  };
  resolvedBy: string;
  resolvedAt: string;
}

interface ResolutionDraft {
  resolutionTitle: string;
  resolutionCategory: string;
  finalDecision: string;
  adminNotes: string;
  internalNotes: string;
  refundClientAmount: string;
  releaseFreelancerAmount: string;
  platformAdjustment: string;
  reopenChat: boolean;
  sendSystemMessage: boolean;
  notifyClient: boolean;
  notifyFreelancer: boolean;
}

interface Dispute {
  id: string;
  chatId: string | null;
  jobId: string | null;
  jobTitle: string;
  clientId: string | null;
  clientName: string;
  clientEmail: string;
  freelancerId: string | null;
  freelancerName: string;
  freelancerEmail: string;
  raisedBy: string;
  disputeType: string;
  title: string;
  description: string;
  resolution: string;
  partialAmount: number | null;
  additionalNotes: string;
  mediaFiles: any[];
  escrowAmount: number | null;
  status: string;
  disputeWorkflowStatus: string;
  freelancerResponse: PartySubmission | null;
  clientStatement: PartySubmission | null;
  resolutionSummary: ResolutionSummary | null;
  resolutionDraft: ResolutionDraft | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentTab, setCurrentTab] = useState<Tab>("dashboard");
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Search/Filters for Disputes
  const [disputeSearch, setDisputeSearch] = useState("");
  const [disputeStatusFilter, setDisputeStatusFilter] = useState("All");
  const [previewFile, setPreviewFile] = useState<{ url: string; name: string } | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [disputePage, setDisputePage] = useState(1);
  const itemsPerPage = 8;

  // Resolution Workspace State
  const [showResolutionWorkspace, setShowResolutionWorkspace] = useState(false);
  const [resolutionForm, setResolutionForm] = useState<ResolutionDraft>({
    resolutionTitle: "",
    resolutionCategory: "other",
    finalDecision: "",
    adminNotes: "",
    internalNotes: "",
    refundClientAmount: "",
    releaseFreelancerAmount: "",
    platformAdjustment: "",
    reopenChat: true,
    sendSystemMessage: true,
    notifyClient: true,
    notifyFreelancer: true,
  });
  const [resolutionSuccess, setResolutionSuccess] = useState(false);
  const [showResolutionReport, setShowResolutionReport] = useState(false);

  // Custom Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "alert" | "confirm" | "prompt";
    title: string;
    message: string;
    placeholder?: string;
    defaultValue?: string;
    onConfirm: (val?: string) => void;
    onCancel: () => void;
  }>({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });
  const [promptInput, setPromptInput] = useState("");

  useEffect(() => {
    if (modalConfig.isOpen && modalConfig.type === "prompt") {
      setPromptInput(modalConfig.defaultValue || "");
    }
  }, [modalConfig.isOpen, modalConfig.type, modalConfig.defaultValue]);

  const customAlert = (message: string, title = "Notification") => {
    return new Promise<void>((resolve) => {
      setModalConfig({
        isOpen: true,
        type: "alert",
        title,
        message,
        onConfirm: () => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          resolve();
        },
        onCancel: () => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          resolve();
        },
      });
    });
  };

  const customConfirm = (message: string, title = "Confirmation Required") => {
    return new Promise<boolean>((resolve) => {
      setModalConfig({
        isOpen: true,
        type: "confirm",
        title,
        message,
        onConfirm: () => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        },
      });
    });
  };

  const customPrompt = (message: string, defaultValue = "", placeholder = "", title = "Action Required") => {
    return new Promise<string | null>((resolve) => {
      setModalConfig({
        isOpen: true,
        type: "prompt",
        title,
        message,
        defaultValue,
        placeholder,
        onConfirm: (val) => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          resolve(val !== undefined ? val : null);
        },
        onCancel: () => {
          setModalConfig((prev) => ({ ...prev, isOpen: false }));
          resolve(null);
        },
      });
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) router.replace("/adminlogin");
    else setIsAuthorized(true);
  }, [router]);

  const {
    users, filteredUsers, stats, filters, loading, error,
    fetchUsers, setSearch, setStatusFilter, setRoleFilter,
    updateStatus, toggleBlock, deleteUser,
  } = useAdminUsers();

  // React Query configuration for disputes list
  const { data: disputesList = [], isLoading: disputesListLoading, refetch: fetchDisputes } = useQuery({
    queryKey: ["admin", "disputes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/disputes");
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to fetch disputes");
      return json.data as Dispute[];
    },
    enabled: isAuthorized,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // React Query configuration for single dispute detail
  const { data: selectedDisputeDetail = null, isLoading: selectedDisputeLoading } = useQuery({
    queryKey: ["admin", "dispute", selectedDisputeId],
    queryFn: async () => {
      if (!selectedDisputeId) return null;
      const res = await fetch(`/api/admin/disputes?id=${selectedDisputeId}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to fetch dispute details");
      return json.data as Dispute;
    },
    enabled: isAuthorized && !!selectedDisputeId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Derived counts from complete users and disputes list
  const totalUsersCount = users.length;
  const submittedCount = users.filter(u => u.hasDocument).length;
  const verifiedCount = users.filter(u => u.hasDocument && u.documentStatus === "Verified").length;
  const rejectedCount = users.filter(u => u.hasDocument && u.documentStatus === "Rejected").length;
  const pendingReviewCount = users.filter(u => u.hasDocument && u.documentStatus === "Pending").length;
  const notSubmittedCount = users.filter(u => !u.hasDocument).length;
  const activeDisputesCount = disputesList.filter(d => d.status === "open").length;

  // Filter disputes
  const filteredDisputes = useMemo(() => {
    return disputesList.filter((d) => {
      const q = disputeSearch.toLowerCase();
      const matchesSearch =
        !q ||
        d.title.toLowerCase().includes(q) ||
        d.jobTitle.toLowerCase().includes(q) ||
        d.clientName.toLowerCase().includes(q) ||
        d.freelancerName.toLowerCase().includes(q);

      const matchesStatus =
        disputeStatusFilter === "All" || d.status === disputeStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [disputesList, disputeSearch, disputeStatusFilter]);

  const paginatedDisputes = useMemo(() => {
    const start = (disputePage - 1) * itemsPerPage;
    return filteredDisputes.slice(start, start + itemsPerPage);
  }, [filteredDisputes, disputePage]);
  const totalDisputePages = Math.ceil(filteredDisputes.length / itemsPerPage);

  // Generate activities list
  useEffect(() => {
    const logs: any[] = [];
    if (disputesList.length) {
      disputesList.slice(0, 3).forEach((d) => {
        logs.push({
          id: `dis-log-${d.id}`,
          message: `Dispute raised: "${d.title}" by ${d.raisedBy} for $${d.partialAmount || 0}`,
          type: "dispute",
          time: d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "Recent",
          badgeColor: "bg-red-50 text-red-700 border-red-100",
        });
      });
    }
    const verifiedUsers = users.filter(u => u.hasDocument && u.documentStatus === "Verified").slice(0, 3);
    verifiedUsers.forEach((u) => {
      logs.push({
        id: `usr-log-${u.id}`,
        message: `Verified account of ${u.name} (${u.role})`,
        type: "verify",
        time: u.uploadDate || "Recent",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
      });
    });
    setRecentActivities(logs);
  }, [disputesList, users]);

  // Action Menu Configs
  const menuItems: ActionItem[] = [
    {
      label: "✅ Approve Document",
      emoji: "",
      onClick: async (u: User) => {
        if (!u.hasDocument) {
          await customAlert("This user has not uploaded any document.", "No Document");
          return;
        }
        const confirmApprove = await customConfirm(`Approve ${u.name}'s document?`, "Approve Document");
        if (confirmApprove) {
          await updateStatus(u.id, "approved", u.documentId);
          await fetchUsers();
        }
      },
    },
    {
      label: "❌ Reject Document",
      emoji: "",
      onClick: async (u: User) => {
        if (!u.hasDocument) {
          await customAlert("This user has not uploaded any document.", "No Document");
          return;
        }
        const reason = await customPrompt(
          "Enter rejection reason (will be visible to user):",
          "Document is invalid or unclear",
          "Type rejection reason here...",
          "Reject Document"
        );
        if (reason === null) return; // cancelled
        await updateStatus(u.id, "rejected", u.documentId, reason);
        await fetchUsers();
      },
    },
    {
      label: "⬇️ Download Document",
      emoji: "",
      onClick: async (u: User) => {
        if (!u.documentUrl) {
          await customAlert("Document has not been uploaded.", "Download Error");
          return;
        }
        const a = document.createElement("a");
        a.href = u.documentUrl;
        a.download = `${u.name}_document`;
        a.target = "_blank";
        a.click();
      },
    },
    {
      label: u => u.isBlocked ? "🔓 Unblock User" : "🚫 Block User",
      emoji: "",
      onClick: async (u: User) => {
        const action = u.isBlocked ? "unblock" : "block";
        const confirmBlock = await customConfirm(`Are you sure you want to ${action} ${u.name}?`, `${action === "block" ? "Block" : "Unblock"} User`);
        if (confirmBlock) {
          await toggleBlock(u.id, !u.isBlocked);
          await fetchUsers();
        }
      },
    },
  ];

  const pendingMenuItems: ActionItem[] = [
    {
      label: u => u.isBlocked ? "🔓 Unblock User" : "🚫 Block User",
      emoji: "",
      onClick: async (u: User) => {
        const action = u.isBlocked ? "unblock" : "block";
        const confirmBlock = await customConfirm(`Are you sure you want to ${action} ${u.name}?`, `${action === "block" ? "Block" : "Unblock"} User`);
        if (confirmBlock) {
          await toggleBlock(u.id, !u.isBlocked);
          await fetchUsers();
        }
      },
    },
  ];

  const handleExport = () => {
    const headers = ["Name", "Email", "Contact", "Role", "Document Type", "Doc Status", "Upload Date", "Joined", "Blocked"];
    const rows = filteredUsers.map((u) => [
      u.name, u.email, u.contact, u.role, u.documentType,
      u.documentStatus, u.uploadDate, u.joinedDate, u.isBlocked ? "Yes" : "No"
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "users.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const queryClient = useQueryClient();

  const handleResolveDispute = (dispute: Dispute) => {
    const target = selectedDisputeDetail || dispute;
    if (target.resolutionDraft) {
      setResolutionForm(target.resolutionDraft);
    } else {
      setResolutionForm({
        resolutionTitle: "",
        resolutionCategory: "other",
        finalDecision: "",
        adminNotes: "",
        internalNotes: "",
        refundClientAmount: "",
        releaseFreelancerAmount: "",
        platformAdjustment: "",
        reopenChat: true,
        sendSystemMessage: true,
        notifyClient: true,
        notifyFreelancer: true,
      });
    }
    setShowResolutionWorkspace(true);
    setResolutionSuccess(false);
  };

  const saveDraftMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDisputeId) return;
      const res = await fetch(`/api/admin/disputes/${selectedDisputeId}/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resolutionForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to save draft");
      return data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["admin", "dispute", selectedDisputeId] });
      const previousDetail = queryClient.getQueryData(["admin", "dispute", selectedDisputeId]);
      queryClient.setQueryData(["admin", "dispute", selectedDisputeId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          resolutionDraft: resolutionForm,
          disputeWorkflowStatus: "resolution_drafted",
        };
      });
      return { previousDetail };
    },
    onError: async (error: any, variables, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(["admin", "dispute", selectedDisputeId], context.previousDetail);
      }
      await customAlert(error.message || "Failed to save draft", "Error");
    },
    onSuccess: async () => {
      await customAlert("Resolution draft saved successfully.", "Draft Saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dispute", selectedDisputeId] });
    }
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDisputeId) return;
      const res = await fetch(`/api/admin/disputes/${selectedDisputeId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...resolutionForm, resolvedBy: "Admin" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Failed to publish resolution");
      return data;
    },
    onSuccess: async () => {
      setResolutionSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dispute", selectedDisputeId] });
    },
    onError: async (error: any) => {
      await customAlert(error.message || "Failed to publish resolution", "Error");
    }
  });

  const handleSaveDraft = () => {
    saveDraftMutation.mutate();
  };

  const handlePublishResolution = async () => {
    if (!selectedDisputeId) return;
    if (!resolutionForm.resolutionTitle.trim() || !resolutionForm.finalDecision.trim()) {
      await customAlert("Resolution title and final decision are required.", "Validation Error");
      return;
    }
    const confirmed = await customConfirm(
      "Are you sure you want to publish this resolution? Both parties will be notified and this action cannot be undone.",
      "Publish Resolution"
    );
    if (!confirmed) return;
    publishMutation.mutate();
  };

  const resolutionSaving = saveDraftMutation.isPending;
  const resolutionPublishing = publishMutation.isPending;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome },
    { id: "verification", label: "Document Verification", icon: FiCheckSquare, badge: pendingReviewCount },
    { id: "disputes", label: "Disputes", icon: FiAlertTriangle, badge: activeDisputesCount },
    { id: "users", label: "Users", icon: FiUsers },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 bg-white text-gray-800 flex flex-col shrink-0 border-r border-gray-200 shadow-sm z-10">
        {/* Sidebar Header Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 gap-3 bg-white">
          <div className="bg-[#0f2744] p-1.5 rounded-lg shadow-md text-white">
            <FiShield size={18} className="text-[#FF6B35]" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide text-[#0f2744] leading-none">HireHub Pro</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Admin Portal</p>
          </div>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 py-6 px-3.5 space-y-1 overflow-y-auto bg-white">
          {sidebarItems.map((item) => {
            const isActive = currentTab === item.id || (item.id === "verification" && currentTab === "pending-users");
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id as Tab);
                  setSelectedDisputeId(null);
                }}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-all group focus:outline-none ${
                  isActive
                    ? "bg-[#0f2744] text-white shadow-lg shadow-blue-900/20"
                    : "text-[#0f2744]/70 hover:text-[#0f2744] hover:bg-orange-50/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    size={16}
                    className={
                      isActive
                        ? "text-[#FF6B35] font-bold animate-pulse"
                        : "text-gray-400 group-hover:text-[#FF6B35] transition-colors"
                    }
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`h-5 w-5 flex items-center justify-center rounded-full text-[9px] font-bold shrink-0 ${
                    isActive ? "bg-[#FF6B35] text-white" : "bg-orange-500/10 text-[#FF6B35]"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400 bg-white">
          <span>Version 1.2.0</span>
          <span>© 2026</span>
        </div>
      </aside>

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50 focus:outline-none">
          {/* ──────────────────────────────────────────────────────── */}
          {/* TAB: DASHBOARD                                           */}
          {/* ──────────────────────────────────────────────────────── */}
          {currentTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Welcome banner */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">System Dashboard Overview</h2>
                <p className="text-gray-500 text-sm mt-1">Real-time metrics, status distributions, and active user conflicts logs.</p>
              </div>

              {/* Grid Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Users */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Users</p>
                    <p className="text-3xl font-extrabold text-gray-900 mt-2">{totalUsersCount}</p>
                  </div>
                  <div className="bg-sky-50 text-sky-600 p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <FiUsers size={24} />
                  </div>
                </div>

                {/* Documents Submitted */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Documents Submitted</p>
                    <p className="text-3xl font-extrabold text-emerald-600 mt-2">{submittedCount}</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <FiFileText size={24} />
                  </div>
                </div>

                {/* Verified Documents */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verified Documents</p>
                    <p className="text-3xl font-extrabold text-green-600 mt-2">{verifiedCount}</p>
                  </div>
                  <div className="bg-green-50 text-green-600 p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <FiCheckCircle size={24} />
                  </div>
                </div>

                {/* Rejected Documents */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Rejected Documents</p>
                    <p className="text-3xl font-extrabold text-red-600 mt-2">{rejectedCount}</p>
                  </div>
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <FiXCircle size={24} />
                  </div>
                </div>

                {/* Clickable Pending Card */}
                <button
                  onClick={() => setCurrentTab("pending-users")}
                  className="bg-white border border-orange-200 rounded-2xl p-6 shadow-sm flex items-center justify-between text-left group hover:shadow-md hover:border-orange-400 transition-all duration-200 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-orange-500"
                >
                  <div>
                    <p className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-1.5">
                      Pending Users <span className="text-[10px] bg-orange-100 px-1.5 py-0.5 rounded font-bold">CLICK TO VIEW</span>
                    </p>
                    <p className="text-3xl font-extrabold text-orange-600 mt-2">{notSubmittedCount}</p>
                  </div>
                  <div className="bg-orange-50 text-orange-500 p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <FiClock size={24} />
                  </div>
                </button>

                {/* Active Disputes */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center justify-between group hover:shadow-md transition-all duration-200">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Disputes</p>
                    <p className="text-3xl font-extrabold text-rose-600 mt-2">{activeDisputesCount}</p>
                  </div>
                  <div className="bg-rose-50 text-rose-600 p-4 rounded-xl group-hover:scale-110 transition-transform">
                    <FiAlertTriangle size={24} />
                  </div>
                </div>
              </div>

              {/* Sub-Layout: Activity Stream and System Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activities */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm lg:col-span-2">
                  <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FiBell className="text-orange-500" />
                    <span>Recent Administrative Logs</span>
                  </h3>
                  <div className="space-y-4">
                    {recentActivities.length > 0 ? (
                      recentActivities.map((act) => (
                        <div key={act.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                          <div className="flex items-start gap-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border mt-0.5 ${act.badgeColor}`}>
                              {act.type === "dispute" ? "Dispute" : "Verify"}
                            </span>
                            <p className="text-sm text-gray-700 font-medium">{act.message}</p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{act.time}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm py-4 text-center">No recent logs recorded.</p>
                    )}
                  </div>
                </div>

                {/* Server Diagnostic */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FiInfo className="text-orange-500" />
                      <span>System Status</span>
                    </h3>
                    <div className="space-y-3.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">API Transporter:</span>
                        <span className="font-semibold text-green-600">Online</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Database Pool:</span>
                        <span className="font-semibold text-green-600">Active (10/10)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Cron Jobs:</span>
                        <span className="font-semibold text-green-600">Running</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mail Gateway:</span>
                        <span className="font-semibold text-green-600">Configured</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <span>Uptime: 142 hours</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* TAB: DOCUMENT VERIFICATION                               */}
          {/* ──────────────────────────────────────────────────────── */}
          {currentTab === "verification" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Document Verification Queue</h2>
                <p className="text-gray-500 text-sm mt-1">Review and approve submitted freelancer and client verification credentials. Only users who have uploaded documents are listed here.</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm">Loading verification requests...</p>
                  </div>
                </div>
              ) : (
                <UserTable
                  users={filteredUsers.filter(u => u.hasDocument)}
                  total={users.filter(u => u.hasDocument).length}
                  filters={filters}
                  onSearchChange={setSearch}
                  onStatusChange={setStatusFilter}
                  onRoleChange={setRoleFilter}
                  onExport={handleExport}
                  onView={async (u) => {
                    if (u.documentUrl) {
                      setPreviewFile({ url: u.documentUrl, name: `${u.name}'s Verification Document` });
                    } else {
                      await customAlert("No document uploaded", "Document Missing");
                    }
                  }}
                  onDelete={async (u) => {
                    const confirmDelete = await customConfirm(`Are you sure you want to delete ${u.name}? This action is permanent.`, "Delete User");
                    if (confirmDelete) {
                      deleteUser(u.id);
                      await fetchUsers();
                    }
                  }}
                  extraMenuItems={menuItems}
                />
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* TAB: PENDING USERS (Non-submitted)                       */}
          {/* ──────────────────────────────────────────────────────── */}
          {currentTab === "pending-users" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Pending Users List</h2>
                <p className="text-gray-500 text-sm mt-1">Users who have not submitted any identity verification documents. These users are omitted from the main verification queue.</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm">Loading pending users...</p>
                  </div>
                </div>
              ) : (
                <UserTable
                  users={filteredUsers.filter(u => !u.hasDocument)}
                  total={users.filter(u => !u.hasDocument).length}
                  filters={{ ...filters, status: "All" }}
                  onSearchChange={setSearch}
                  onStatusChange={() => {}}
                  onRoleChange={setRoleFilter}
                  onExport={handleExport}
                  onView={async (u) => {
                    await customAlert(`${u.name} has not submitted any documents yet.`, "No Document");
                  }}
                  onDelete={async (u) => {
                    const confirmDelete = await customConfirm(`Are you sure you want to delete ${u.name}? This action is permanent.`, "Delete User");
                    if (confirmDelete) {
                      deleteUser(u.id);
                      await fetchUsers();
                    }
                  }}
                  extraMenuItems={pendingMenuItems}
                />
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* TAB: DISPUTES MODULE                                     */}
          {/* ──────────────────────────────────────────────────────── */}
          {currentTab === "disputes" && (
            <div className="space-y-6 animate-in fade-in duration-200 h-full flex flex-col">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Disputes Resolution Center</h2>
                <p className="text-gray-500 text-sm mt-1">Oversee active conflicts between client employers and freelancer contractors.</p>
              </div>

              {disputesListLoading ? (
                <div className="flex flex-col lg:flex-row bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex-1 min-h-[500px]">
                  <div className="w-full lg:w-[380px] border-r border-gray-200 p-4 bg-gray-50/50">
                    <ListSkeleton />
                  </div>
                  <div className="flex-1 bg-white">
                    <DetailSkeleton />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex-1 min-h-[500px]">
                  {/* Left Column - Disputes List */}
                  <div className="w-full lg:w-[380px] border-r border-gray-200 flex flex-col bg-gray-50/50">
                    {/* List Header Search & Filter */}
                    <div className="p-4 border-b border-gray-200 space-y-3 bg-white">
                      <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                          type="text"
                          value={disputeSearch}
                          onChange={(e) => {
                            setDisputeSearch(e.target.value);
                            setDisputePage(1);
                          }}
                          placeholder="Search disputes..."
                          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#FF6B35] transition-colors"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Filter Status:</span>
                        <div className="flex gap-1">
                          {["All", "open", "resolved"].map((st) => (
                            <button
                              key={st}
                              onClick={() => {
                                setDisputeStatusFilter(st);
                                setDisputePage(1);
                              }}
                              className={`px-2 py-0.5 rounded-md font-medium capitalize border transition-all ${
                                disputeStatusFilter === st
                                  ? "bg-[#FF6B35]/10 border-[#FF6B35] text-[#FF6B35]"
                                  : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Dispute Item List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        {paginatedDisputes.length > 0 ? (
                          paginatedDisputes.map((dis) => {
                            const isSelected = selectedDisputeId === dis.id;
                            return (
                              <button
                                key={dis.id}
                                onClick={() => setSelectedDisputeId(dis.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                                  isSelected
                                    ? "bg-[#0f2744] border-[#0f2744] text-white shadow-lg"
                                    : "bg-white border-gray-200 hover:border-gray-300 text-gray-800"
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    dis.status === "open"
                                      ? isSelected ? "bg-red-500/20 text-red-300" : "bg-red-50 border border-red-100 text-red-700"
                                      : isSelected ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-50 border border-emerald-100 text-emerald-700"
                                  }`}>
                                    {dis.status}
                                  </span>
                                  <span className={`text-[10px] ${isSelected ? "text-white/60" : "text-gray-400"}`}>
                                    {dis.createdAt ? new Date(dis.createdAt).toLocaleDateString() : ""}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-xs line-clamp-1">{dis.title}</h4>
                                  <p className={`text-[10px] mt-0.5 truncate ${isSelected ? "text-white/60" : "text-gray-400"}`}>
                                    {dis.jobTitle}
                                  </p>
                                </div>
                                <div className="flex justify-between items-center text-[10px] mt-1 pt-1.5 border-t border-dashed border-white/10">
                                  <span className={isSelected ? "text-white/70" : "text-gray-500"}>
                                    By: <span className="font-semibold uppercase">{dis.raisedBy}</span>
                                  </span>
                                </div>
                              </button>
                            );
                          })
                        ) : (
                          <div className="text-center py-12 text-gray-400 text-sm">No disputes found.</div>
                        )}
                      </div>

                      {/* Pagination Footer */}
                      {totalDisputePages > 1 && (
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 mt-2 bg-white p-2 rounded-xl">
                          <button
                            disabled={disputePage === 1}
                            onClick={() => setDisputePage((p) => Math.max(1, p - 1))}
                            className="px-2.5 py-1 text-[10px] font-semibold text-gray-500 hover:text-[#0f2744] bg-white border border-gray-200 rounded-lg disabled:opacity-40"
                          >
                            Prev
                          </button>
                          <span className="text-[10px] text-gray-400 font-medium">Page {disputePage} of {totalDisputePages}</span>
                          <button
                            disabled={disputePage === totalDisputePages}
                            onClick={() => setDisputePage((p) => Math.min(totalDisputePages, p + 1))}
                            className="px-2.5 py-1 text-[10px] font-semibold text-gray-500 hover:text-[#0f2744] bg-white border border-gray-200 rounded-lg disabled:opacity-40"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column — Dispute Detail OR Resolution Workspace */}
                  <div className="flex-1 overflow-y-auto">
                    {selectedDisputeId ? (
                      selectedDisputeLoading ? (
                        showResolutionWorkspace ? <WorkspaceSkeleton /> : <DetailSkeleton />
                      ) : selectedDisputeDetail ? (
                        showResolutionWorkspace ? (
                          <ResolutionWorkspace
                            selectedDispute={selectedDisputeDetail}
                            resolutionForm={resolutionForm}
                            setResolutionForm={setResolutionForm}
                            resolutionSaving={resolutionSaving}
                            resolutionPublishing={resolutionPublishing}
                            resolutionSuccess={resolutionSuccess}
                            setResolutionSuccess={setResolutionSuccess}
                            setShowResolutionWorkspace={setShowResolutionWorkspace}
                            handleSaveDraft={handleSaveDraft}
                            handlePublishResolution={handlePublishResolution}
                          />
                        ) : (
                          <DisputeDetail
                            selectedDispute={selectedDisputeDetail}
                            handleResolveDispute={handleResolveDispute}
                            setShowResolutionWorkspace={setShowResolutionWorkspace}
                            setResolutionSuccess={setResolutionSuccess}
                            setPreviewFile={setPreviewFile}
                          />
                        )
                      ) : (
                        <div className="flex items-center justify-center h-full text-red-500 p-6 bg-white">
                          Failed to load dispute details.
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400 gap-4 text-center p-6 bg-white">
                        <div className="bg-gray-100 p-5 rounded-full"><FiAlertTriangle size={32} /></div>
                        <div>
                          <p className="font-semibold text-base text-gray-900">Select a Dispute</p>
                          <p className="text-xs text-gray-400 mt-1 max-w-[280px]">Pick a dispute to review both-party submissions and manage the resolution.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* TAB: USERS DIRECTORY                                     */}
          {/* ──────────────────────────────────────────────────────── */}
          {currentTab === "users" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Global User Directory</h2>
                <p className="text-gray-500 text-sm mt-1">Manage and audit all registered freelancers and clients in the system.</p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                    <p className="text-gray-400 text-sm">Loading user listings...</p>
                  </div>
                </div>
              ) : (
                <UserTable
                  users={filteredUsers}
                  total={users.length}
                  filters={filters}
                  onSearchChange={setSearch}
                  onStatusChange={setStatusFilter}
                  onRoleChange={setRoleFilter}
                  onExport={handleExport}
                  onView={async (u) => {
                    if (u.documentUrl) {
                      setPreviewFile({ url: u.documentUrl, name: `${u.name}'s Verification Document` });
                    } else {
                      await customAlert(`${u.name} has not uploaded any document yet.`, "No Document");
                    }
                  }}
                  onDelete={async (u) => {
                    const confirmDelete = await customConfirm(`Are you sure you want to delete ${u.name}? This action is permanent.`, "Delete User");
                    if (confirmDelete) {
                      deleteUser(u.id);
                      await fetchUsers();
                    }
                  }}
                  extraMenuItems={menuItems}
                />
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* TAB: NOTIFICATIONS LOGS                                  */}
          {/* ──────────────────────────────────────────────────────── */}
          {currentTab === "notifications" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Administrative Notifications Logs</h2>
                <p className="text-gray-500 text-sm mt-1">Audit trail of global announcements, portal notifications, and emails sent on verification updates.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm lg:col-span-2 space-y-4">
                  <h3 className="font-bold text-base text-gray-900">Recent Notifications Dispatch History</h3>
                  <div className="space-y-4">
                    {recentActivities.map((act, i) => (
                      <div key={i} className="p-4 border rounded-xl border-gray-100 flex items-start gap-4 justify-between bg-gray-50/30">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {act.type === "dispute" ? "📢 Dispute notice triggered" : "✉️ Verification notice dispatched"}
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">{act.message}</p>
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 h-fit">
                  <h3 className="font-bold text-base text-gray-900">System broadcast notice</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">Broadcast an urgent banner message to all active clients and freelancers.</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Enter announcement title"
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#FF6B35]"
                    />
                    <textarea
                      placeholder="Write global system notice body..."
                      rows={4}
                      className="w-full px-3 py-2 border rounded-xl text-xs outline-none focus:border-[#FF6B35] resize-none"
                    />
                    <button
                      onClick={async () => {
                        const confirmSend = await customConfirm("Broadcast this message to all users?", "Confirm System Broadcast");
                        if (confirmSend) {
                          await customAlert("System broadcast dispatched successfully.", "Success");
                        }
                      }}
                      className="w-full bg-[#FF6B35] hover:bg-[#e55a2b] text-white py-2 rounded-xl text-xs font-bold tracking-wide transition-colors"
                    >
                      Dispatch Broadcast
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* TAB: SETTINGS                                            */}
          {/* ──────────────────────────────────────────────────────── */}
          {currentTab === "settings" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Portal Global Parameters</h2>
                <p className="text-gray-500 text-sm mt-1">Configure global verification workflows, disputes arbitration limits, and mailer setups.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Identity Verification Threshold</label>
                    <select className="w-full bg-white border rounded-xl px-3 py-2.5 text-xs text-gray-700 outline-none focus:border-[#FF6B35]">
                      <option>Manual Review Mandatory (Highly Recommended)</option>
                      <option>Semi-Automated (Verify format only)</option>
                      <option>Auto-Approve Aadhar & PAN verified formats</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Max verification attempts allowed</label>
                    <input
                      type="number"
                      defaultValue={3}
                      className="w-full bg-white border rounded-xl px-3 py-2 text-xs text-gray-700 outline-none focus:border-[#FF6B35]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Dispute Escrow Freeze Policy</label>
                    <select className="w-full bg-white border rounded-xl px-3 py-2.5 text-xs text-gray-700 outline-none focus:border-[#FF6B35]">
                      <option>Automatic communication freeze on dispute raise</option>
                      <option>Alert admin without communication freeze</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Nodemailer SMTP Transporter Mode</label>
                    <select className="w-full bg-white border rounded-xl px-3 py-2.5 text-xs text-gray-700 outline-none focus:border-[#FF6B35]">
                      <option>Gmail SMTP Secure API Enabled</option>
                      <option>Mock Server / Log Only</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={async () => {
                      const confirmSave = await customConfirm("Are you sure you want to save these system properties?", "Save System Configuration");
                      if (confirmSave) {
                        await customAlert("System configuration parameters saved successfully.", "Parameters Saved");
                      }
                    }}
                    className="bg-[#FF6B35] hover:bg-[#e55a2b] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-orange-950/20 transition-all"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Full Screen Lightbox Overlay */}
      {previewFile && isFullScreen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200">
          {/* Close button at top right */}
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full text-2xl transition-all focus:outline-none z-10 shadow-lg animate-in spin-in-12 duration-200"
            title="Exit Full Screen"
          >
            <FiX />
          </button>
          
          {/* Main Full Screen View */}
          <div className="w-full h-full p-8 flex items-center justify-center">
            {previewFile.url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || previewFile.url.includes("image") ? (
              <img
                src={previewFile.url}
                alt={previewFile.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <iframe
                src={previewFile.url}
                className="w-full h-full rounded-lg bg-white"
                title="Full Screen Document"
              />
            )}
          </div>
        </div>
      )}

      {/* Attachment Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-gray-800 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div>
                <h3 className="font-bold text-sm text-[#0f2744] truncate max-w-[500px]" title={previewFile.name}>
                  Preview: {previewFile.name}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                {/* Full Screen Icon */}
                <button
                  onClick={() => setIsFullScreen(true)}
                  title="Open in Full Screen"
                  className="h-8 w-8 rounded-lg bg-white hover:bg-gray-100 text-gray-500 hover:text-orange-500 border border-gray-200 flex items-center justify-center transition-colors focus:outline-none"
                >
                  <FiMaximize size={15} />
                </button>
                {/* Close Button */}
                <button
                  onClick={() => {
                    setPreviewFile(null);
                    setIsFullScreen(false);
                  }}
                  title="Close Preview"
                  className="h-8 w-8 rounded-lg bg-white hover:bg-gray-100 text-gray-500 hover:text-red-500 border border-gray-200 flex items-center justify-center transition-colors focus:outline-none"
                >
                  <FiX size={15} />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 bg-gray-100 overflow-y-auto flex items-center justify-center min-h-[300px]">
              {/* Check if file is image or pdf */}
              {previewFile.url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || previewFile.url.includes("image") ? (
                <img
                  src={previewFile.url}
                  alt={previewFile.name}
                  className="max-h-[60vh] object-contain rounded-lg shadow-sm border border-gray-200"
                />
              ) : (
                <iframe
                  src={previewFile.url}
                  className="w-full h-[60vh] rounded-lg border border-gray-250"
                  title="Document Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Popup Modal */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0f2744] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-white">
            {/* Header */}
            <div className="px-6 py-4 bg-white/[0.02] border-b border-white/10 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                {modalConfig.type === "alert" && <span className="text-orange-400">💡</span>}
                {modalConfig.type === "confirm" && <span className="text-blue-400">❓</span>}
                {modalConfig.type === "prompt" && <span className="text-red-400">⚠️</span>}
                {modalConfig.title}
              </h3>
              <button
                onClick={modalConfig.onCancel}
                className="text-white/40 hover:text-white/70 transition-colors text-xl font-medium focus:outline-none"
              >
                &times;
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4 font-sans">
              <p className="text-white/80 text-sm leading-relaxed">
                {modalConfig.message}
              </p>

              {modalConfig.type === "prompt" && (
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={modalConfig.placeholder}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500/60 transition-all"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      modalConfig.onConfirm(promptInput);
                    }
                  }}
                />
              )}
            </div>

            {/* Footer / Buttons */}
            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-end gap-3">
              {modalConfig.type !== "alert" && (
                <button
                  onClick={modalConfig.onCancel}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 text-white/80 transition-all border border-white/10"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  if (modalConfig.type === "prompt") {
                    modalConfig.onConfirm(promptInput);
                  } else {
                    modalConfig.onConfirm();
                  }
                }}
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#FF6B35] hover:bg-[#e55a2b] transition-all shadow-lg shadow-orange-950/40"
              >
                {modalConfig.type === "alert" ? "OK" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}