"use client";

import { FiUsers } from "react-icons/fi";
import DataTable from "./DataTable";
import type { ComponentProps } from "react";
import TableFilters from "./TableFilters";
import StatusBadge from "../ui/StatusBadge";
import RoleBadge from "../ui/RoleBadge";
import UserAvatar from "../ui/UserAvatar";
import ActionMenu from "../ui/ActionMenu";
import { useActionMenu } from "../../hooks/useAdminUsers";
import type { User, FilterState, DocumentStatus, UserRole, TableColumn, ActionItem } from "../../types/admin.types";

const UserDataTable = DataTable as (props: ComponentProps<typeof DataTable<User>>) => React.ReactElement;

interface Props {
  users: User[];
  total: number;
  filters: FilterState;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: DocumentStatus | "All") => void;
  onRoleChange: (v: UserRole | "All") => void;
  onExport?: () => void;
  onView?: (user: User) => void;
  onDelete?: (user: User) => void;
  extraMenuItems?: ActionItem[];
}

export default function UserTable({ users, total, filters, onSearchChange, onStatusChange, onRoleChange, onExport, onView, onDelete, extraMenuItems = [] }: Props) {
  const { openId, toggle, close } = useActionMenu();

  const columns: TableColumn<User>[] = [
    {
      key: "index", header: "#",
      className: "text-gray-400 w-10",
      render: (_, idx) => idx + 1,
    },
    {
      key: "user", header: "User",
      render: (u, idx) => (
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar letter={u.avatar} colorIndex={idx} />
            {u.isBlocked && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px]">🚫</span>
            )}
          </div>
          <div>
            <p className={`font-medium ${u.isBlocked ? "text-red-400 line-through" : "text-gray-900"}`}>{u.name}</p>
            <p className="text-gray-400 text-xs">{u.email}</p>
            {u.isBlocked && <span className="text-[10px] text-red-500 font-semibold">BLOCKED</span>}
          </div>
        </div>
      ),
    },
    {
      key: "userType", header: "User Type",
      render: (u) => <RoleBadge role={u.role} />,
    },
    {
      key: "contact", header: "Contact",
      className: "text-gray-700 text-sm",
      render: (u) => u.contact,
    },
    {
      key: "documentType", header: "Document Type",
      render: (u) => (
        <span className={`rounded-md px-2 py-0.5 text-xs border ${u.hasDocument ? "bg-gray-100 border-gray-200 text-gray-600" : "bg-yellow-50 border-yellow-200 text-yellow-600"}`}>
          {u.documentType}
        </span>
      ),
    },
    {
      key: "documentStatus", header: "Doc Status",
      render: (u) => {
        if (!u.hasDocument) return <span className="text-xs text-gray-400 italic">No doc</span>;
        return (
          <div>
            <StatusBadge status={u.documentStatus} />
            {u.documentStatus === "Rejected" && u.rejectionReason && (
              <p className="text-[10px] text-red-400 mt-0.5 max-w-[120px] truncate" title={u.rejectionReason}>
                {u.rejectionReason}
              </p>
            )}
          </div>
        );
      },
    },
    {
      key: "uploadDate", header: "Upload Date",
      className: "text-gray-500 text-xs",
      render: (u) => u.uploadDate || "—",
    },
    {
      key: "joinedDate", header: "Joined",
      className: "text-gray-500 text-xs",
      render: (u) => u.joinedDate,
    },
    {
      key: "actions", header: "Actions",
      render: (u) => (
        <div className="opacity-0 group-hover:opacity-100 transition">
          <ActionMenu
            user={u}
            isOpen={openId === u.id}
            onToggle={() => toggle(u.id)}
            onClose={close}
            onView={onView}
            onDelete={onDelete}
            menuItems={extraMenuItems}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-5 bg-[#0f2744] border-b border-white/10">
        <div className="flex items-center gap-2 text-white">
          <FiUsers className="text-orange-400 text-lg" />
          <h2 className="font-semibold text-base">User Management</h2>
          <span className="ml-2 bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full">{users.length} users</span>
        </div>
        <TableFilters filters={filters} onSearchChange={onSearchChange} onStatusChange={onStatusChange} onRoleChange={onRoleChange} onExport={onExport} />
      </div>

      <UserDataTable columns={columns} rows={users} keyExtractor={(u) => u.id} emptyMessage="Koi user nahi mila" />

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <span>Showing {users.length} of {total} users</span>
        <span>FreelanceHub Pro · Admin v1.0</span>
      </div>
    </div>
  );
}