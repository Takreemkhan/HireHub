// "use client";

// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import ChatPage from "@/app/components/chat/ChatPage";
// // import Sidebar from "@/app/components/Sidebar";

// export default function FreelancerMessagesPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, router]);

//   if (status === "loading") {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!session || !session.user?.email) {
//     return null;
//   }

//   const userId = session.user.email;

//   // return (
//   //   <div className="flex min-h-screen bg-gray-100">
//   //     {/*  <Sidebar role="freelancer" />*/}
//   //     <main className="flex-1 overflow-auto">
//   //       <ChatPage userId={userId} />
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

export default function FreelancerMessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Wait for session to load before making any decisions
    if (status === "loading") return;

    if (status === "unauthenticated") {
      // Only redirect to sign-in if truly unauthenticated
      router.push("/sign-in-page");
    } else if (status === "authenticated") {
      // Session is valid, allow rendering
      setShouldRender(true);
    }
  }, [status, router]);

  // Show loading while checking session
  if (status === "loading" || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF6B35] mx-auto mb-4"></div>
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
            className="mt-4 px-4 py-2 bg-[#FF6B35] text-white rounded-lg"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-16 inset-x-0 bottom-0 overflow-hidden bg-white z-10">
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35]"></div>
        </div>
      }>
        <ChatPage userId={userId} />
      </Suspense>
    </div>
  );
}