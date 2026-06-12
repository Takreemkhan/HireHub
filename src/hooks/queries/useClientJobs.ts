import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Fetch client's current jobs
const fetchClientCurrentJobs = async (params: { page?: number; limit?: number; businessId?: string | null }) => {
  const { data } = await axios.get('/api/client/jobs/current', { params });
  return data;
};

export const useClientCurrentJobs = (params: { page?: number; limit?: number; businessId?: string | null } = {}) => {
  return useQuery({
    queryKey: ['clientCurrentJobs', params],
    queryFn: () => fetchClientCurrentJobs(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch client's completed jobs
const fetchClientCompletedJobs = async (params: { page?: number; limit?: number; businessId?: string | null }) => {
  const { data } = await axios.get('/api/client/jobs/completed', { params });
  return data;
};

export const useClientCompletedJobs = (params: { page?: number; limit?: number; businessId?: string | null } = {}) => {
  return useQuery({
    queryKey: ['clientCompletedJobs', params],
    queryFn: () => fetchClientCompletedJobs(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Assign freelancer to a job
const assignFreelancer = async (payload: { jobId: string; freelancerId: string; proposalId?: string }) => {
  const { data } = await axios.post('/api/client/jobs/current', payload);
  return data;
};

export const useAssignFreelancer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignFreelancer,
    onSuccess: (data, variables) => {
      // Invalidate current jobs query
      queryClient.invalidateQueries({ queryKey: ['clientCurrentJobs'] });
      // Invalidate specific job detail query
      queryClient.invalidateQueries({ queryKey: ['job', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

// Mark a job as completed
const markJobCompleted = async (payload: { jobId: string; finalAmount?: number; notes?: string; clientReview?: any }) => {
  const { data } = await axios.post('/api/client/jobs/completed', payload);
  return data;
};

export const useMarkJobCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markJobCompleted,
    onSuccess: (data, variables) => {
      // Invalidate both current and completed jobs list
      queryClient.invalidateQueries({ queryKey: ['clientCurrentJobs'] });
      queryClient.invalidateQueries({ queryKey: ['clientCompletedJobs'] });
      queryClient.invalidateQueries({ queryKey: ['job', variables.jobId] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

// Fetch freelancer activity stats
const fetchFreelancerActivity = async () => {
  const { data } = await axios.get('/api/client/freelancer-activity');
  return data.freelancerActivity;
};

export const useFreelancerActivity = () => {
  return useQuery({
    queryKey: ['freelancerActivity'],
    queryFn: fetchFreelancerActivity,
    staleTime: 10 * 60 * 1000, // Cache for 10 mins since backend is cached
  });
};
