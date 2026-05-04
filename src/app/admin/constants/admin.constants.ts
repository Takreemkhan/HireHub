import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import type { User, DocumentStatus, StatCard } from "../types/admin.types";

// ─────────────────────────────────────────────
//  Mock Users
// ─────────────────────────────────────────────

export const MOCK_USERS: User[] = [
  {
    id: 1,
    name: "Arjun Sharma",
    email: "arjun.sharma@gmail.com",
    contact: "+91 98765 43210",
    documentType: "Aadhar Card",
    documentStatus: "Verified",
    role: "freelancer",
    joinedDate: "12 Jan 2025",
    avatar: "A",
  },
  {
    id: 2,
    name: "Priya Mehta",
    email: "priya.mehta@outlook.com",
    contact: "+91 87654 32109",
    documentType: "PAN Card",
    documentStatus: "Pending",
    role: "client",
    joinedDate: "05 Feb 2025",
    avatar: "P",
  },
  {
    id: 3,
    name: "Rohan Verma",
    email: "rohan.v@yahoo.com",
    contact: "+91 76543 21098",
    documentType: "Passport",
    documentStatus: "Verified",
    role: "freelancer",
    joinedDate: "19 Feb 2025",
    avatar: "R",
  },
  {
    id: 4,
    name: "Sneha Patel",
    email: "sneha.patel@gmail.com",
    contact: "+91 65432 10987",
    documentType: "Driving License",
    documentStatus: "Rejected",
    role: "client",
    joinedDate: "28 Feb 2025",
    avatar: "S",
  },
  {
    id: 5,
    name: "Karan Singh",
    email: "karan.singh@proton.me",
    contact: "+91 54321 09876",
    documentType: "Voter ID",
    documentStatus: "Pending",
    role: "freelancer",
    joinedDate: "03 Mar 2025",
    avatar: "K",
  },
  {
    id: 6,
    name: "Divya Nair",
    email: "divya.nair@gmail.com",
    contact: "+91 43210 98765",
    documentType: "Aadhar Card",
    documentStatus: "Verified",
    role: "client",
    joinedDate: "10 Mar 2025",
    avatar: "D",
  },
];

// ─────────────────────────────────────────────
//  Status Visual Config
// ─────────────────────────────────────────────

export const STATUS_CONFIG: Record<
  DocumentStatus,
  { icon: React.ElementType; color: string; bg: string }
> = {
  Verified: {
    icon: FiCheckCircle,
    color: "text-emerald-700",
    bg: "bg-emerald-100 border border-emerald-200",
  },
  Pending: {
    icon: FiClock,
    color: "text-amber-700",
    bg: "bg-amber-100 border border-amber-200",
  },
  Rejected: {
    icon: FiXCircle,
    color: "text-red-700",
    bg: "bg-red-100 border border-red-200",
  },
};

// ─────────────────────────────────────────────
//  Avatar Rotation Colors
// ─────────────────────────────────────────────

export const AVATAR_COLORS = [
  "bg-orange-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-lime-500",
  "bg-sky-500",
];

// ─────────────────────────────────────────────
//  Role Badge Config
// ─────────────────────────────────────────────

export const ROLE_CONFIG = {
  freelancer: {
    bg: "bg-violet-100",
    text: "text-violet-700",
    label: "Freelancer",
  },
  client: {
    bg: "bg-sky-100",
    text: "text-sky-700",
    label: "Client",
  },
};

// ─────────────────────────────────────────────
//  Stat Cards builder (accepts live counts)
// ─────────────────────────────────────────────

export function buildStatCards(
  total: number,
  verified: number,
  pending: number,
  rejected: number
): StatCard[] {
  return [
    {
      label: "Total Users",
      value: total,
      accent: "text-sky-300",
      gradient: "from-[#1e4d7b] to-[#0f2744]",
    },
    {
      label: "Verified",
      value: verified,
      accent: "text-emerald-400",
      gradient: "from-emerald-900/60 to-[#0f2744]",
    },
    {
      label: "Pending",
      value: pending,
      accent: "text-amber-400",
      gradient: "from-amber-900/60 to-[#0f2744]",
    },
    {
      label: "Rejected",
      value: rejected,
      accent: "text-red-400",
      gradient: "from-red-900/60 to-[#0f2744]",
    },
  ];
}