"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFreelancerProfile,
  updateFreelancerProfile,
  getFreelancerProfileDetails,
  getAllFreelancerCategories,
  getCurrentJobs,
  sendInviteJobs,
  getJobInvites,
  getFreelancerMembershipPlan,
  getClientMembershipPlan,
  getFreelancerActivity,
  getAllFreelancerProfiles,
  clientSendMessage,
  saveJob,
  unsaveJob,
  getSavedJobs,
  getProposals,
  getClientDrafts,
  ContactsInfoEdit,
  getContactsInfo,
  getResumeVideos,
  getResumeVideosByUserId,
  postResumeVideos,
  deleteResumeVideoById,
  updateResumeVideoById,
  uploadVideoFiles,
  type ResumeVideoItem,
  // sendInviteJobs
} from "../api/profileApi";

// normal profile
export const useProfile = (filters?: {
  title?: string;
  skills?: string[];
  minRate?: number;
  maxRate?: number;
}) => {
  return useQuery({
    queryKey: ["profile", filters],
    queryFn: () => getFreelancerProfile(filters),
  });
};

// profile by userId
export const useProfileDetails = (userId: string) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getFreelancerProfileDetails(userId),
    enabled: !!userId,
  });
};

// update profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFreelancerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
};

// categories hook
export const useFreelancerCategories = () => {
  return useQuery({
    queryKey: ["freelancer-categories"],
    queryFn: getAllFreelancerCategories,
  });
};

export const useCurrentJobsClients = () => {
  return useQuery({
    queryKey: ["current-jobs-clients"],
    queryFn: getCurrentJobs,
  });
};

// export const usesendInviteJobs = () => {
//   return useQuery({
//     queryKey: ["send-invite-jobs"],
//     queryFn: sendInviteJobs,
//   });
// };



//  client send req to freelancer private job
export const usesendInviteJobs = () => {
  const queryClient = useQueryClient();

  // CLIENT SEND INVITE JOBS
  return useMutation({
    mutationFn: sendInviteJobs,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["send-invite-jobs"],
      });
    },
  });
};

// get invite jobs
export const usegetJobInvites = (jobId: string) => {
  return useQuery({
    queryKey: ["get-job-invites", jobId],
    queryFn: () => getJobInvites(jobId),
  });
};

// get freelancer plan 
export const usegetFreelancerMembershipPlan = () => {
  return useQuery({
    queryKey: ["get-freelancer-membership-plan"],
    queryFn: getFreelancerMembershipPlan,
  });
};



// get freelancer activity
export const usegetFreelancerActivity = () => {
  return useQuery({
    queryKey: ["get-freelancer-activity"],
    queryFn: getFreelancerActivity,
  });
};


// get all freelancer profiles
export const usegetAllFreelancerProfiles = () => {
  return useQuery({
    queryKey: ["get-all-freelancer-profiles"],
    queryFn: getAllFreelancerProfiles,
  });


};

// client send message to freelancer 
export const useclientSendMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientSendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["client-send-message"],
      });
    },
  });
};


// save job
export const useSaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["save-job"],
      });
    },
  });
};

// unsave job
export const useUnsaveJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unsaveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["save-job"],
      });
    },
  });
};

// get saved jobs
export const useGetSavedJobs = () => {
  return useQuery({
    queryKey: ["get-saved-jobs"],
    queryFn: getSavedJobs,
  });
};

// get view proposal 
export const useGetProposals = ({
  jobId,
  freelancerId,
}: {
  jobId?: string;
  freelancerId?: string;
}) => {
  return useQuery({
    queryKey: ["proposals", jobId, freelancerId],
    queryFn: () => getProposals({ jobId, freelancerId }),
    enabled: !!jobId || !!freelancerId,
  });
};

// ── Client Membership ────────────────────────────────────────────────────────
export const useGetClientMembershipPlan = () => {
  return useQuery({
    queryKey: ["get-client-membership-plan"],
    queryFn: getClientMembershipPlan,
  });
};

export const useGetClientDrafts = () => {
  return useQuery({
    queryKey: ["get-client-drafts"],
    queryFn: getClientDrafts,
  });
};



// [post] update contact info
export const useContactsInfoEdit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ContactsInfoEdit,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["get-contacts-info", variables.userId],
      });
    },
  });
};

export const useGetContactsInfo = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["get-contacts-info", userId],
    queryFn: () => getContactsInfo({ userId }),
    enabled: !!userId,
  });
};

// resue video
export const useGetResumeVideos = () => {
  return useQuery({
    queryKey: ["resume-videos"],
    queryFn: getResumeVideos,
    staleTime: 30_000,
  });
};

/** Fetch another user's resume videos (client viewing freelancer profile) */
export const useGetResumeVideosByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["resume-videos", userId],
    queryFn: () => getResumeVideosByUserId(userId),
    enabled: !!userId,
    staleTime: 30_000,
  });
};

/** Save full videos array */
export const usePostResumeVideos = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videos: ResumeVideoItem[]) => postResumeVideos(videos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resume-videos"] }),
  });
};

/** Delete one video by id */
export const useDeleteResumeVideoById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (videoId: string) => deleteResumeVideoById(videoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resume-videos"] }),
  });
};

/** Update title/url of one video */
export const useUpdateResumeVideoById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ videoId, updatedData }: { videoId: string; updatedData: Partial<ResumeVideoItem> }) =>
      updateResumeVideoById(videoId, updatedData),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resume-videos"] }),
  });
};

/** Upload raw video files to /api/upload/video */
export const useUploadVideoFiles = () => {
  return useMutation({
    mutationFn: (files: File[]) => uploadVideoFiles(files),
  });
};