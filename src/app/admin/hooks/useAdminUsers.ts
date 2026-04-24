"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { User, FilterState, DocumentStatus, UserRole } from "../types/admin.types";

export function useAdminUsers() {
  const [users, setUsers]     = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({ search: "", status: "All", role: "All" });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setUsers(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filteredUsers = useMemo(() => users.filter((u) => {
    const q = filters.search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchStatus = filters.status === "All" || u.documentStatus === filters.status;
    const matchRole   = filters.role === "All" || u.role === filters.role;
    return matchSearch && matchStatus && matchRole;
  }), [users, filters]);

  const stats = useMemo(() => ({
    total:    users.length,
    verified: users.filter((u) => u.documentStatus === "Verified").length,
    pending:  users.filter((u) => u.documentStatus === "Pending").length,
    rejected: users.filter((u) => u.documentStatus === "Rejected").length,
  }), [users]);

  // Approve / Reject document
  const updateStatus = useCallback(async (
    userId: string, action: "approved" | "rejected",
    documentId?: string | null, reason?: string
  ) => {
    const statusMap: Record<string, DocumentStatus> = { approved: "Verified", rejected: "Rejected" };
    setUsers((prev) => prev.map((u) =>
      u.id === userId
        ? { ...u, documentStatus: statusMap[action], rejectionReason: action === "rejected" ? (reason || null) : null }
        : u
    ));
    try {
      const res = await fetch(`/api/admin/users/${userId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, documentId, reason }),
      });
      const json = await res.json();
      if (!json.success) await fetchUsers();
    } catch { await fetchUsers(); }
  }, [fetchUsers]);

  // Block / Unblock user
  const toggleBlock = useCallback(async (userId: string, block: boolean) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isBlocked: block } : u));
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: block ? "block" : "unblock" }),
      });
      const json = await res.json();
      if (!json.success) await fetchUsers();
    } catch { await fetchUsers(); }
  }, [fetchUsers]);

  const deleteUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const setSearch       = useCallback((search: string) => setFilters((f) => ({ ...f, search })), []);
  const setStatusFilter = useCallback((status: DocumentStatus | "All") => setFilters((f) => ({ ...f, status })), []);
  const setRoleFilter   = useCallback((role: UserRole | "All") => setFilters((f) => ({ ...f, role })), []);

  return { users, filteredUsers, stats, filters, loading, error, fetchUsers, setSearch, setStatusFilter, setRoleFilter, updateStatus, toggleBlock, deleteUser };
}

export function useActionMenu() {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle  = useCallback((id: string) => setOpenId((prev) => (prev === id ? null : id)), []);
  const close   = useCallback(() => setOpenId(null), []);
  return { openId, toggle, close };
}