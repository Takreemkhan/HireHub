import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Post a new job
const postJob = async (jobData: any) => {
  const { data } = await axios.post('/api/jobs', jobData);
  return data;
};

export const usePostJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postJob,
    onSuccess: () => {
      // Invalidate the jobs list query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

// Update a job by ID
const updateJob = async ({ id, jobData }: { id: string; jobData: any }) => {
  const { data } = await axios.put(`/api/jobs/${id}`, jobData);
  return data;
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateJob,
    onSuccess: (data, variables) => {
      // Invalidate specific job and the jobs list
      queryClient.invalidateQueries({ queryKey: ['job', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};

// Delete a job by ID
const deleteJob = async (id: string) => {
  const { data } = await axios.delete(`/api/jobs/${id}`);
  return data;
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });
};
