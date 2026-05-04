"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "./components/layout/AdminHeader";
import StatCard from "./components/ui/StatCard";
import UserTable from "./components/table/UserTable";
import { useAdminUsers } from "./hooks/useAdminUsers";
import { buildStatCards } from "./constants/admin.constants";
import type { User, ActionItem } from "./types/admin.types";

export default function AdminPanel() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) router.replace("/adminlogin");
    else setIsAuthorized(true);
  }, [router]);

  const {
    filteredUsers, stats, filters, loading, error,
    fetchUsers, setSearch, setStatusFilter, setRoleFilter,
    updateStatus, toggleBlock, deleteUser,
  } = useAdminUsers();

  const statCards = buildStatCards(stats.total, stats.verified, stats.pending, stats.rejected);

  const menuItems: ActionItem[] = [
    {
      label: "✅ Approve Document",
      emoji: "",
      onClick: (u: User) => {
        if (!u.hasDocument) return alert("Is user ne koi document upload nahi kiya.");
        if (window.confirm(`${u.name} ka document approve karein?`)) {
          updateStatus(u.id, "approved", u.documentId);
        }
      },
    },
    {
      label: "❌ Reject Document",
      emoji: "",
      onClick: (u: User) => {
        if (!u.hasDocument) return alert("Is user ne koi document upload nahi kiya.");
        const reason = window.prompt("Rejection reason likhein (client ko dikhega):", "Document invalid ya unclear hai");
        if (reason === null) return; // cancelled
        updateStatus(u.id, "rejected", u.documentId, reason);
      },
    },
    {
      label: "⬇️ Download Document",
      emoji: "",
      onClick: (u: User) => {
        if (!u.documentUrl) return alert("Document upload nahi hua.");
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
      onClick: (u: User) => {
        const action = u.isBlocked ? "unblock" : "block";
        if (window.confirm(`${u.name} ko ${action} karein?`)) {
          toggleBlock(u.id, !u.isBlocked);
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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <AdminHeader />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((card) => <StatCard key={card.label} {...card} />)}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
            <span>⚠️ {error}</span>
            <button onClick={fetchUsers} className="underline ml-4">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Users fetch ho rahe hain...</p>
            </div>
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            total={stats.total}
            filters={filters}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            onRoleChange={setRoleFilter}
            onExport={handleExport}
            onView={(u) => u.documentUrl ? window.open(u.documentUrl, "_blank") : alert("Document nahi hai")}
            onDelete={(u) => deleteUser(u.id)}
            extraMenuItems={menuItems}
          />
        )}
      </div>
    </div>
  );
}