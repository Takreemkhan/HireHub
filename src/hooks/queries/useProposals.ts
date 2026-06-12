import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch proposals for a specific job (Client view)
const fetchJobProposals = async (jobId: string, filters: any = {}) => {
  const { data } = await axios.get('/api/proposals', {
    params: { jobId, ...filters },
  });
  return data;
};

export const useJobProposals = (jobId: string, filters: any = {}) => {
  return useQuery({
    queryKey: ['proposals', 'job', jobId, filters],
    queryFn: () => fetchJobProposals(jobId, filters),
    enabled: !!jobId,
  });
};

// Fetch proposals submitted by the current freelancer
const fetchMyProposals = async (filters: any = {}) => {
  const { data } = await axios.get('/api/proposals', {
    params: { myProposals: true, ...filters },
  });
  return data;
};

export const useMyProposals = (filters: any = {}) => {
  return useQuery({
    queryKey: ['proposals', 'my', filters],
    queryFn: () => fetchMyProposals(filters),
  });
};

// Submit a new proposal
const submitProposal = async (proposalData: any) => {
  const { data } = await axios.post('/api/proposals', proposalData);
  return data;
};

export const useSubmitProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitProposal,
    onSuccess: (data, variables) => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['proposals', 'job', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['proposals', 'my'] });
    },
  });
};
