"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FiHome,
  FiFolder,
  FiMessageCircle,
  FiFileText,
  FiCreditCard,
  FiSettings,
  FiFile,
} from "react-icons/fi";


export default function Sidebar() {
  const { data: session } = useSession();
  const role = session?.user?.role as "client" | "freelancer" | undefined;

  if (!role) return null; 
  
  const menuItems = [
    { name: "Dashboard", icon: FiHome },
    { name: "Projects", icon: FiFolder },
    { name: "Messages", icon: FiMessageCircle },
    { name: "Invoices", icon: FiFileText },
    { name: "Payments", icon: FiCreditCard },
    { name: "Contracts", icon: FiFile },
    { name: "Settings", icon: FiSettings },
  ];
  

  const getHref = (name: string) => {
 

      if (!role) return "#";

  if (name === "Dashboard") return `/${role}`;
  if (name === "Messages") return `/${role}/messages`;
  if (name === "Contracts") return `/${role}/contracts`;

  return `/${role}`;

  };

  const getDisplayName = (name: string) => {
    if (name === "Contracts") {
      return "Contracts & Agreements";
    }
    return name;
  }

  return (
    <aside className="w-64 bg-[#0f2744] text-white hidden md:flex flex-col">
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={getHref(item.name)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition"
            >
              <Icon className="text-lg" />
              <span>{getDisplayName(item.name)}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

