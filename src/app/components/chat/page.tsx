"use client";
import ChatPage from "./ChatPage";
import { Suspense } from "react";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id || "";

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md h-full bg-white rounded-xl shadow">
        <Suspense fallback={<div>Loading...</div>}>
          <ChatPage userId={userId} />
        </Suspense>
      </div>
    </div>
  );
}
