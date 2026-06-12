import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch all jobs
const fetchJobs = async () => {
  const { data } = await axios.get('/api/jobs');
  return data.jobs;
};

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

// Fetch a single job by ID
const fetchJobById = async (id: string) => {
  const { data } = await axios.get(`/api/jobs/${id}`);
  return data.job;
};

export const useJobDetails = (id: string) => {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id),
    enabled: !!id, // Only run the query if the id is present
    staleTime: 5 * 60 * 1000,
  });
};
