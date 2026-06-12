"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { setActiveRole } from "@/store/slices/authSlice";

function SessionSync({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user?.role) {
      const role = session.user.role as 'client' | 'freelancer';
      dispatch(setActiveRole(role));
    } else {
      dispatch(setActiveRole(null));
    }
  }, [session, dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <SessionSync>
          {children}
        </SessionSync>
      </QueryClientProvider>
    </ReduxProvider>
  );
}