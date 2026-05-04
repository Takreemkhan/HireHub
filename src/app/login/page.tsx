
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user?.role) {
      localStorage.setItem("role", session.user.role);
    }

    // if (session?.user) {

    //   const redirectPath = session.user.role === 'freelancer' 
    //     ? '/freelancer' 
    //     : '/client';

    //   router.replace(redirectPath);
    // } else {

    //   router.replace('/sign-in-page');
    // }
    if (status === "unauthenticated") {
      // ❗ Role not selected yet
      router.replace("/sign-in-page");
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // ❗ ROLE NOT SELECTED YET
      if (!session.user.role) {
        router.replace('/sign-in-page');
        return;
      }

      if (session.user.role === "freelancer") {
        router.replace("/freelancer-dashboard");
      } else {
        router.replace("/client-dashboard");
      }
    }
  }, [session, status, router]);


  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}