import { useQuery } from '@tanstack/react-query';

export const useBusinessPages = (userId: string | undefined, isFreelancer: boolean) => {
  return useQuery({
    queryKey: ['business-pages', userId],
    queryFn: async () => {
      const res = await fetch("/api/business-pages");
      const data = await res.json();
      return data.businessPages || [];
    },
    enabled: !!userId && isFreelancer,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
