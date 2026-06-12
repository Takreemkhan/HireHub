import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch freelancer profile details
const fetchFreelancerProfile = async (userId: string) => {
  if (!userId) return null;
  const { data } = await axios.get('/api/freelancer/profile', {
    params: { userId },
  });
  return data.profile;
};

export const useFreelancerProfileDetails = (userId: string) => {
  return useQuery({
    queryKey: ['freelancerProfile', userId],
    queryFn: () => fetchFreelancerProfile(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
};

// Fetch all freelancer profiles with filters
interface FetchProfilesParams {
  page?: number;
  limit?: number;
  search?: string;
  skills?: string[];
  minRate?: number;
  maxRate?: number;
  location?: string;
}

const fetchAllFreelancerProfiles = async (params: FetchProfilesParams) => {
  const { data } = await axios.get('/api/freelancer/profile', {
    params: {
      ...params,
      skills: params.skills?.join(','),
    },
  });
  return data;
};

export const useAllFreelancerProfiles = (params: FetchProfilesParams = {}) => {
  return useQuery({
    queryKey: ['freelancerProfiles', params],
    queryFn: () => fetchAllFreelancerProfiles(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Update freelancer profile
const updateFreelancerProfile = async (profileData: any) => {
  const { data } = await axios.post('/api/freelancer/profile', profileData);
  return data;
};

export const useUpdateFreelancerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFreelancerProfile,
    onSuccess: (data, variables) => {
      // Invalidate specific profile cache and list caches
      queryClient.invalidateQueries({ queryKey: ['freelancerProfile'] });
      queryClient.invalidateQueries({ queryKey: ['freelancerProfiles'] });
    },
  });
};
