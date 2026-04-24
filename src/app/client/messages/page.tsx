

// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import ChatPage from "@/app/components/chat/ChatPage";

// export default function ClientMessagesPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [shouldRender, setShouldRender] = useState(false);

//   useEffect(() => {
//     // Wait for session to load before making any decisions
//     if (status === "loading") return;

//     if (status === "unauthenticated") {
//       // Only redirect to sign-in if truly unauthenticated
//       router.push("/sign-in-page");
//     } else if (status === "authenticated") {
//       // Session is valid, allow rendering
//       setShouldRender(true);
//     }
//   }, [status, router]);

//   // Show loading while checking session
//   if (status === "loading" || !shouldRender) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading messages...</p>
//         </div>
//       </div>
//     );
//   }

//   // Double-check session exists
//   if (!session?.user?.email) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <div className="text-center">
//           <p className="text-gray-600">Redirecting to sign in...</p>
//         </div>
//       </div>
//     );
//   }

//   const userId = session.user.email;

//   // return (
//   //   <div className="flex min-h-screen bg-gray-100">
//   //     <main className="flex-1 overflow-auto">
//   //        <ChatPage userId={userId} />
//   //     </main>

//   //   </div>
//   // );

//   return (
//     <div className="h-screen overflow-hidden">
//       <ChatPage userId={userId} />
//     </div>
//   );
// }

"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatPage from "@/app/components/chat/ChatPage";

export default function ClientMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/sign-in-page");
    } else if (status === "authenticated") {
      setShouldRender(true);
    }
  }, [status, router]);



  if (status === "loading" || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  // ✅ ONLY use session.user.id (MongoDB ObjectId) — NEVER fall back to email
  // The DB stores participants as ObjectId, so email would never match
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-gray-600">Unable to load user information</p>
          <button
            onClick={() => router.push("/sign-in-page")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    // ✅ FIX: fixed position — header (64px) ke neeche se shuru, footer hide karo
    // h-screen nahi use karo — layout mein header aur footer bhi hain
    <div className="fixed top-16 inset-x-0 bottom-0 overflow-hidden bg-white z-10">
      <ChatPage userId={userId} />
    </div>
  );
}