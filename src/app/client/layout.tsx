

"use client";

import Header from "@/components/common/Header";
import FooterSection from "@/app/homepage/components/FooterSection"
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function ClientGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      if (!hasRedirected.current) {
        hasRedirected.current = true;
        router.replace("/sign-in-page");
      }
      return;
    }

    // ✅ Only redirect if role is EXPLICITLY "freelancer"
    if (session.user?.role === "freelancer" && !hasRedirected.current) {
      hasRedirected.current = true;
      const newPath = pathname.replace('/client', '/freelancer');
      router.replace(newPath);
      return;
    }

    // ✅ Reset flag if user has correct role or no role
    hasRedirected.current = false;
  }, [session?.user?.role, status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
      </div>
    );
  }

  // ✅ Only block if definitely wrong role
  if (!session || session.user?.role === "freelancer") {
    return null;
  }

  return <>{children}</>;
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientGuard>
      <div className="flex flex-1 flex-col w-full">
        <Header/>
        <main className="flex-1 overflow-y-auto pt-16 min-h-screen">
          {children}
        </main>
        <FooterSection/>
      </div>
    </ClientGuard>
  );
}