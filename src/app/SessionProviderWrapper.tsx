"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { connectSocket } from "@/socket/socket";

function GlobalSocketHandler({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      console.log("🔌 Global connection for user:", userId);
      connectSocket(userId);
    }
  }, [userId]);

  return <>{children}</>;
}

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <GlobalSocketHandler>{children}</GlobalSocketHandler>
    </SessionProvider>
  );
}