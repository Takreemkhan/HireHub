import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch freelancer membership status
const fetchFreelancerMembershipStatus = async () => {
  const { data } = await axios.get('/api/freelancer/membership/status');
  return data || null;
};

export const useFreelancerMembershipStatus = () => {
  return useQuery({
    queryKey: ['freelancerMembershipStatus'],
    queryFn: fetchFreelancerMembershipStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

// Fetch freelancer plans (includes pricing and active subscription details)
const fetchFreelancerPlans = async () => {
  const { data } = await axios.get('/api/freelancer/plans');
  return data || null;
};

export const useFreelancerPlans = () => {
  return useQuery({
    queryKey: ['freelancerPlans'],
    queryFn: fetchFreelancerPlans,
    staleTime: 5 * 60 * 1000,
  });
};
