"use client";

import { FiSearch, FiFilter, FiDownload } from "react-icons/fi";
import type { FilterState, DocumentStatus, UserRole } from "../../types/admin.types";

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  filters: FilterState;
  onSearchChange: (v: string) => void;
  onStatusChange: (v: DocumentStatus | "All") => void;
  onRoleChange: (v: UserRole | "All") => void;
  onExport?: () => void;
  statusOptions?: SelectOption[];
  roleOptions?: SelectOption[];
}

const DEFAULT_STATUS_OPTIONS: SelectOption[] = [
  { value: "All",      label: "All Status" },
  { value: "Verified", label: "Verified"   },
  { value: "Pending",  label: "Pending"    },
  { value: "Rejected", label: "Rejected"   },
];

const DEFAULT_ROLE_OPTIONS: SelectOption[] = [
  { value: "All",        label: "All Roles"  },
  { value: "client",     label: "Client"     },
  { value: "freelancer", label: "Freelancer" },
];

export default function TableFilters({
  filters,
  onSearchChange,
  onStatusChange,
  onRoleChange,
  onExport,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  roleOptions   = DEFAULT_ROLE_OPTIONS,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 w-56">
        <FiSearch className="text-white/60 text-sm shrink-0" />
        <input
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search name or email..."
          className="bg-transparent text-sm outline-none placeholder-white/40 w-full text-white"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5">
        <FiFilter className="text-white/60 text-sm shrink-0" />
        <select
          value={filters.status}
          onChange={(e) => onStatusChange(e.target.value as DocumentStatus | "All")}
          className="bg-transparent text-sm outline-none text-white cursor-pointer"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value} className="bg-[#0f2744] text-white">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Role Filter */}
      <select
        value={filters.role}
        onChange={(e) => onRoleChange(e.target.value as UserRole | "All")}
        className="bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm outline-none text-white cursor-pointer"
      >
        {roleOptions.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#0f2744] text-white">
            {o.label}
          </option>
        ))}
      </select>

      {/* Export */}
      {onExport && (
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 transition rounded-lg px-3 py-1.5 text-sm font-medium text-white"
        >
          <FiDownload className="text-sm" />
          Export
        </button>
      )}
    </div>
  );
}