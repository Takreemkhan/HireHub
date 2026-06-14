import { QueryClient } from "@tanstack/react-query";

declare global {
  var _queryClient: QueryClient | undefined;
}

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data considered fresh for 5 minutes — prevents refetch on every mount
        staleTime: 1000 * 60 * 5,
        // Keep unused data in cache for 10 minutes after it's no longer observed
        gcTime: 1000 * 60 * 10,
        // Only retry once on error to avoid hammering slow APIs
        retry: 1,
        // Don't refetch when the window regains focus (reduces unnecessary calls)
        refetchOnWindowFocus: false,
        // Don't refetch when the network reconnects (we'll refetch on navigate)
        refetchOnReconnect: false,
      },
    },
  });
}

// In development, reuse the QueryClient across hot-reloads so cached data isn't lost.
// In production, always create a fresh client (each request has its own instance).
export const queryClient =
  process.env.NODE_ENV === "development"
    ? (global._queryClient ??= makeQueryClient())
    : makeQueryClient();