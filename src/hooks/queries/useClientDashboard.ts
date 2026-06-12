import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch bookmarked freelancer profiles
const fetchSavedFreelancers = async () => {
  const { data } = await axios.get('/api/client/saved-freelancers');
  return data.freelancers || [];
};

export const useSavedFreelancers = () => {
  return useQuery({
    queryKey: ['savedFreelancers'],
    queryFn: fetchSavedFreelancers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Fetch bookmarked freelancer IDs (for bookmark status check)
const fetchSavedFreelancersIds = async () => {
  const { data } = await axios.get('/api/client/saved-freelancers?idsOnly=true');
  return data.ids || [];
};

export const useSavedFreelancersIds = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['savedFreelancersIds'],
    queryFn: fetchSavedFreelancersIds,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
};

// Toggle save/unsave freelancer
const toggleSaveFreelancer = async (freelancerId: string) => {
  const { data } = await axios.post('/api/client/saved-freelancers', { freelancerId });
  return data;
};

export const useToggleSaveFreelancer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleSaveFreelancer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedFreelancers'] });
      queryClient.invalidateQueries({ queryKey: ['savedFreelancersIds'] });
    },
  });
};

// Fetch client membership status
const fetchClientMembershipStatus = async () => {
  const { data } = await axios.get('/api/client/membership/status');
  return data.subscription || null;
};

export const useClientMembershipStatus = () => {
  return useQuery({
    queryKey: ['clientMembershipStatus'],
    queryFn: fetchClientMembershipStatus,
    staleTime: 5 * 60 * 1000,
  });
};

// Delete a client draft
const deleteDraft = async (draftId: string) => {
  const { data } = await axios.delete(`/api/jobs/drafts/${draftId}`);
  return data;
};

export const useDeleteDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientDrafts'] });
      // also invalidate the hook from useProfile if used
      queryClient.invalidateQueries({ queryKey: ['get-client-drafts'] });
    },
  });
};

// Publish a client draft
const publishDraft = async (draftId: string) => {
  const { data } = await axios.patch(`/api/jobs/drafts/${draftId}`, { action: 'publish' });
  return data;
};

export const usePublishDraft = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientDrafts'] });
      queryClient.invalidateQueries({ queryKey: ['get-client-drafts'] });
      queryClient.invalidateQueries({ queryKey: ['clientCurrentJobs'] });
      queryClient.invalidateQueries({ queryKey: ['current-jobs-clients'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};
