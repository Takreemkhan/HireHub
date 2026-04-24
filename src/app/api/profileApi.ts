// app/api/profileApi.ts
export const updateFreelancerProfile = async (data: any) => {
  const res = await fetch("/api/freelancer/profile", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
};

export const getFreelancerProfileDetails = async (userId: string) => {
  const res = await fetch(`/api/freelancer/profile?userId=${userId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
};

export const getFreelancerProfile = async (filters?: {
  title?: string;
  skills?: string[];
  minRate?: number;
  maxRate?: number;
}) => {
  const params = new URLSearchParams();

  if (filters?.title) {
    params.append("title", filters.title);
  }

  if (filters?.skills && filters.skills.length > 0) {
    params.append("skills", filters.skills.join(","));
  }

  if (filters?.minRate) {
    params.append("minRate", String(filters.minRate));
  }

  if (filters?.maxRate) {
    params.append("maxRate", String(filters.maxRate));
  }

  const url = `/api/freelancer/profile?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
};

export const getAllFreelancerCategories = async () => {
  const res = await fetch("/api/freelancer/categories", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
};


export const getClientProfileDetails = async (userId: string) => {
  const res = await fetch(`/api/freelancer/profile?userId=${userId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
};

export const getCurrentJobs = async () => {
  const res = await fetch("/api/client/jobs/current", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}
export const sendInviteJobs = async ({ jobId, data }: { jobId: string; data: any }) => {
  const res = await fetch(`http://localhost:4028/api/jobs/${jobId}/invites`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile");
  }

  return res.json();
};


export const getJobInvites = async (jobId: string) => {
  const res = await fetch(`/api/jobs/${jobId}/invites`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return res.json();
};


// freelancer membership plan 
export const getFreelancerMembershipPlan = async () => {
  const res = await fetch("/api/freelancer/membership/plan", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}

// client membership plan 
export const getClientMembershipPlan = async () => {
  const res = await fetch("/api/client/membership/plan", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  return res.json();
}


// Freelancer activity 
export const getFreelancerActivity = async () => {
  const res = await fetch("/api/client/freelancer-activity", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch freelancer activity");
  }

  return res.json();
}


// Freelancer activity 
export const getAllFreelancerProfiles = async () => {
  const res = await fetch("/api/freelancer/profile?limit=500", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch freelancer activity");
  }

  return res.json();
}

// client send message to freelancer 
export const clientSendMessage = async ({ data }: { data: any }) => {
  const { fromUserId, toUserId } = data;
  const res = await fetch(`http://localhost:4028/api/client-send-message`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fromUserId, toUserId }),
  });

  if (!res.ok) {
    throw new Error("Failed to send message");
  }

  return res.json();
}


// save job
export const saveJob = async ({ jobId, freelancerId }: { jobId: string; freelancerId: string }) => {
  const res = await fetch("/api/freelancer/jobs/save", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jobId, freelancerId }),
  });

  if (!res.ok) {
    throw new Error("Failed to save job");
  }

  return res.json();
}

// unsave job
export const unsaveJob = async ({ jobId, freelancerId }: { jobId: string; freelancerId: string }) => {
  const res = await fetch("/api/freelancer/jobs/save", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ jobId, freelancerId }),
  });

  if (!res.ok) {
    throw new Error("Failed to unsave job");
  }

  return res.json();
}

// get saved jobs
export const getSavedJobs = async () => {
  const res = await fetch("/api/freelancer/jobs/save", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to get saved jobs");
  }

  return res.json();
}

// get view proposal 
export const getProposals = async ({
  jobId,
  freelancerId,
}: {
  jobId?: string;
  freelancerId?: string;
}) => {
  const params = new URLSearchParams();

  if (jobId) {
    params.append("jobId", jobId);
  }

  if (freelancerId) {
    params.append("freelancerId", freelancerId);
  }

  const res = await fetch(`/api/proposals?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch proposals");
  }

  return res.json();
};

// get client drafts
export const getClientDrafts = async () => {
  const res = await fetch("/api/jobs/drafts", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch drafts");
  }

  return res.json();
}



export const ContactsInfoEdit = async ({ userId, data }: { userId: string; data: any }) => {
  const res = await fetch(`/api/contacts/${userId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {

    throw new Error("Failed to edit contact");
  }
  return res.json();
}

export const getContactsInfo = async ({ userId, }: { userId: string; }) => {
  const res = await fetch(`/api/contacts/${userId}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch contacts");
  }

  return res.json();
}



// ==============================================
// NEW: Resume Videos API functions
// ==============================================

// Save/update all resume videos for the authenticated user
export const saveResumeVideos = async (resumeVideos: any[]) => {
  const res = await fetch("/api/resume-videos", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resumeVideos }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to save resume videos");
  }

  return res.json();
};

// Get all resume videos for the authenticated user
// export const getResumeVideos = async () => {
//   const res = await fetch("/api/resume-videos", {
//     method: "GET",
//     credentials: "include",
//   });

//   if (!res.ok) {
//     const errorData = await res.json().catch(() => ({}));
//     throw new Error(errorData.message || "Failed to fetch resume videos");
//   }

//   return res.json();
// };

// Delete a single resume video by its unique id
export const deleteResumeVideo = async (videoId: string) => {
  const res = await fetch("/api/resume-videos", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ videoId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete resume video");
  }

  return res.json();
};

// Update a single resume video (e.g., change URL, title, etc.)
export const updateResumeVideo = async (videoId: string, updatedData: any) => {
  const res = await fetch("/api/resume-videos", {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ videoId, updatedData }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update resume video");
  }

  return res.json();
};

// ── Resume Video APIs ──────────────────────────────────────────────────────

export interface ResumeVideoItem {
  id: string;           // unique video id (set by backend)
  url: string;
  title?: string;
  thumbnail?: string;
  uploadedAt?: string;
}

/** GET /api/resume-video — fetch logged-in user's saved resume videos */
export const getResumeVideos = async (): Promise<{ success: boolean; data: ResumeVideoItem[] }> => {
  const res = await fetch("/api/resume-video", { method: "GET", credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch resume videos");
  return res.json();
};

/** GET /api/resume-video?userId=xxx — fetch another user's videos (client view) */
export const getResumeVideosByUserId = async (userId: string): Promise<{ success: boolean; data: ResumeVideoItem[] }> => {
  const res = await fetch(`/api/resume-video?userId=${encodeURIComponent(userId)}`, { method: "GET", credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch resume videos");
  return res.json();
};

/** POST /api/resume-video — save full array */
export const postResumeVideos = async (resumeVideos: ResumeVideoItem[]): Promise<{ success: boolean; data: ResumeVideoItem[] }> => {
  const res = await fetch("/api/resume-video", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resumeVideos }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Failed to save videos"); }
  return res.json();
};

/** DELETE /api/resume-video — delete one video by id */
export const deleteResumeVideoById = async (videoId: string): Promise<{ success: boolean }> => {
  const res = await fetch("/api/resume-video", {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Failed to delete video"); }
  return res.json();
};

/** PUT /api/resume-video — update title/url of one video */
export const updateResumeVideoById = async (videoId: string, updatedData: Partial<ResumeVideoItem>): Promise<{ success: boolean }> => {
  const res = await fetch("/api/resume-video", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ videoId, updatedData }),
  });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Failed to update video"); }
  return res.json();
};

/** POST /api/upload/video — upload raw video files, returns { urls } */
export const uploadVideoFiles = async (files: File[]): Promise<{ success: boolean; urls: string[] }> => {
  const formData = new FormData();
  files.forEach(f => formData.append("videos", f));
  const res = await fetch("/api/upload/video", { method: "POST", credentials: "include", body: formData });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || "Video upload failed"); }
  return res.json();
};