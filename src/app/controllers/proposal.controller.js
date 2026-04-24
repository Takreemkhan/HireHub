import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* SUBMIT PROPOSAL (Freelancer bids on a job) */
export const submitProposal = async (proposalData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const {
    jobId,
    freelancerId,
    proposalText,
    bidAmount,
    depositRequired,
    currency,
    coverLetter,
    estimatedDuration,
    attachments,
    resumeID,

  } = proposalData;

  // Validation
  if (!jobId || !freelancerId || !proposalText || !bidAmount) {
    throw new Error("Required fields missing");
  }

  if (proposalText.length < 50) {
    throw new Error("Proposal must be at least 50 characters");
  }

  if (bidAmount < 1) {
    throw new Error("Bid amount must be greater than 0");
  }

  // Check if job exists
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(jobId)
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // Check if job is still open
  if (job.status === "closed" || job.status === "completed") {
    throw new Error("This job is no longer accepting proposals");
  }

  // Check if freelancer already submitted proposal for this job
  const existingProposal = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    jobId: new ObjectId(jobId),
    freelancerId: new ObjectId(freelancerId)
  });

  if (existingProposal) {
    throw new Error("You have already submitted a proposal for this job");
  }

  // Get freelancer profile details
  const freelancer = await db.collection(COLLECTIONS.USERS).findOne({
    _id: new ObjectId(freelancerId)
  });

  const freelancerProfile = await db.collection(COLLECTIONS.PROFILES).findOne({
    userId: new ObjectId(freelancerId)
  });

  // Create proposal
  const proposal = {
    jobId: new ObjectId(jobId),
    freelancerId: new ObjectId(freelancerId),
    clientId: new ObjectId(job.clientId),
    resumeUrl: resumeID,
    proposalText: proposalText.trim(),
    bidAmount: Number(bidAmount),
    depositRequired: Number(depositRequired || 0),
    currency: currency || "INR",
    coverLetter: coverLetter ? coverLetter.trim() : null,
    estimatedDuration: estimatedDuration || null,
    attachments: attachments || [],
    status: "pending",
    shortlistedAt: null,
    shortlistedBy: null,
    respondedAt: null,
    responseNote: null,
    freelancerProfile: {
      name: freelancer?.name || "Unknown",
      email: freelancer?.email || "",
      hourlyRate: freelancerProfile?.hourlyRate || 0,
      skills: freelancerProfile?.topSkills || [],
      rating: freelancerProfile?.rating || 0,
      completedJobs: freelancerProfile?.completedJobs || 0
    },


    isActive: true,
    isRead: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.PROPOSALS).insertOne(proposal);

  // Update job's proposal count
  await db.collection(COLLECTIONS.JOBS).updateOne(
    { _id: new ObjectId(jobId) },
    {
      $inc: { proposalCount: 1 },
      $set: { updatedAt: new Date() }
    }
  );

  return { ...proposal, _id: result.insertedId };
};

/* GET ALL PROPOSALS FOR A JOB (Client views bids) */
export const getProposalsForJob = async (jobId, clientId, filters = {}, freelancerId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);


  // Verify job belongs to client
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(jobId),
    //clientId: new ObjectId(clientId)
  });

  if (!job) {
    throw new Error("Job not found or you don't have permission to view proposals");
  }

  // Build query
  const query = {
    jobId: new ObjectId(jobId),
    isActive: true
  };

  if (freelancerId) {
    query.freelancerId = new ObjectId(freelancerId);
  }

  // Apply filters
  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.minBid) {
    query.bidAmount = { $gte: Number(filters.minBid) };
  }

  if (filters.maxBid) {
    query.bidAmount = { ...query.bidAmount, $lte: Number(filters.maxBid) };
  }

  // Sorting
  let sortOptions = { createdAt: -1 }; // Default: newest first

  if (filters.sortBy === "amount_asc") {
    sortOptions = { bidAmount: 1 };
  } else if (filters.sortBy === "amount_desc") {
    sortOptions = { bidAmount: -1 };
  } else if (filters.sortBy === "rating") {
    sortOptions = { "freelancerProfile.rating": -1 };
  }

  // Pagination
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 20;
  const skip = (page - 1) * limit;

  const proposalsRaw = await db.collection(COLLECTIONS.PROPOSALS)
    .find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .toArray();
  const proposals = await Promise.all(
    proposalsRaw.map(async (proposal) => {
      if (!proposal.resumeID) {
        return { ...proposal, resumeVideos: [] };
      }

      try {
        const resumeId =
          typeof proposal.resumeID === "string"
            ? new ObjectId(proposal.resumeID)
            : proposal.resumeID;

        const resume = await db.collection(COLLECTIONS.RESUME_VIDEOS).findOne({
          _id: resumeId
        });

        return {
          ...proposal,
          resumeVideos: resume?.videos || []
        };
      } catch (err) {
        return {
          ...proposal,
          resumeVideos: []
        };
      }
    })
  );
  const total = await db.collection(COLLECTIONS.PROPOSALS).countDocuments(query);

  // Global stats for the job (ignoring freelancerId filter)
  const globalQuery = { jobId: new ObjectId(jobId), isActive: true };
  const allProposalsForJob = await db.collection(COLLECTIONS.PROPOSALS)
    .find(globalQuery)
    .project({ bidAmount: 1 })
    .toArray();

  const globalTotal = allProposalsForJob.length;
  const globalAvgBid = globalTotal > 0
    ? allProposalsForJob.reduce((sum, p) => sum + p.bidAmount, 0) / globalTotal
    : 0;

  // Mark proposals as read
  await db.collection(COLLECTIONS.PROPOSALS).updateMany(
    { jobId: new ObjectId(jobId), clientId: new ObjectId(clientId) },
    { $set: { isRead: true } }
  );

  return {
    proposals,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    summary: {
      total: globalTotal,
      pending: await db.collection(COLLECTIONS.PROPOSALS).countDocuments({
        jobId: new ObjectId(jobId),
        status: "pending"
      }),
      shortlisted: await db.collection(COLLECTIONS.PROPOSALS).countDocuments({
        jobId: new ObjectId(jobId),
        status: "shortlisted"
      }),
      avgBid: Math.round(globalAvgBid),
      minBid: allProposalsForJob.length > 0
        ? Math.min(...allProposalsForJob.map(p => p.bidAmount))
        : 0,
      maxBid: allProposalsForJob.length > 0
        ? Math.max(...allProposalsForJob.map(p => p.bidAmount))
        : 0
    }
  };
};

/* GET SINGLE PROPOSAL DETAILS */
export const getProposalById = async (proposalId, userId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const proposal = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    _id: new ObjectId(proposalId)
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  // Check permission (client or freelancer)
  const isClient = proposal.clientId.toString() === userId;
  const isFreelancer = proposal.freelancerId.toString() === userId;

  if (!isClient && !isFreelancer) {
    throw new Error("You don't have permission to view this proposal");
  }

  return proposal;
};

/* SHORTLIST PROPOSAL (Client shortlists freelancer) */
export const shortlistProposal = async (proposalId, clientId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Find proposal
  const proposal = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    _id: new ObjectId(proposalId)
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  // Verify client owns this job
  if (proposal.clientId.toString() !== clientId) {
    throw new Error("You don't have permission to shortlist this proposal");
  }

  // Check if already shortlisted
  if (proposal.status === "shortlisted") {
    throw new Error("Proposal is already shortlisted");
  }

  // Update proposal status
  const result = await db.collection(COLLECTIONS.PROPOSALS).findOneAndUpdate(
    { _id: new ObjectId(proposalId) },
    {
      $set: {
        status: "shortlisted",
        shortlistedAt: new Date(),
        shortlistedBy: new ObjectId(clientId),
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* REMOVE FROM SHORTLIST */
export const removeFromShortlist = async (proposalId, clientId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const proposal = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    _id: new ObjectId(proposalId)
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.clientId.toString() !== clientId) {
    throw new Error("You don't have permission to modify this proposal");
  }

  const result = await db.collection(COLLECTIONS.PROPOSALS).findOneAndUpdate(
    { _id: new ObjectId(proposalId) },
    {
      $set: {
        status: "pending",
        shortlistedAt: null,
        shortlistedBy: null,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* GET FREELANCER'S OWN PROPOSALS */
export const getFreelancerProposals = async (freelancerId, filters = {}) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const query = {
    freelancerId: new ObjectId(freelancerId),
    isActive: true
  };

  if (filters.status) {
    query.status = filters.status;
  }

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;
  const skip = (page - 1) * limit;

  const proposals = await db.collection(COLLECTIONS.PROPOSALS)
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  // Get job details for each proposal
  const proposalsWithJobs = await Promise.all(
    proposals.map(async (proposal) => {
      const job = await db.collection(COLLECTIONS.JOBS).findOne({
        _id: new ObjectId(proposal.jobId)
      });
      return { ...proposal, job };
    })
  );

  const total = await db.collection(COLLECTIONS.PROPOSALS).countDocuments(query);

  return {
    proposals: proposalsWithJobs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/* WITHDRAW PROPOSAL */
export const withdrawProposal = async (proposalId, freelancerId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const proposal = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    _id: new ObjectId(proposalId)
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.freelancerId.toString() !== freelancerId) {
    throw new Error("You don't have permission to withdraw this proposal");
  }

  if (proposal.status === "accepted") {
    throw new Error("Cannot withdraw an accepted proposal");
  }

  const result = await db.collection(COLLECTIONS.PROPOSALS).findOneAndUpdate(
    { _id: new ObjectId(proposalId) },
    {
      $set: {
        status: "withdrawn",
        isActive: false,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  // Decrement job proposal count
  await db.collection(COLLECTIONS.JOBS).updateOne(
    { _id: new ObjectId(proposal.jobId) },
    {
      $inc: { proposalCount: -1 },
      $set: { updatedAt: new Date() }
    }
  );

  return result.value;
};

/* ACCEPT PROPOSAL (Client accepts a bid)  */
export const acceptProposal = async (proposalId, clientId, responseNote = null) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const proposal = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    _id: new ObjectId(proposalId)
  });
  console.log("proposal video", proposal)
  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.clientId.toString() !== clientId) {
    throw new Error("You don't have permission to accept this proposal");
  }

  if (proposal.status === "accepted") {
    throw new Error("Proposal is already accepted");
  }

  // Update proposal to accepted
  const result = await db.collection(COLLECTIONS.PROPOSALS).findOneAndUpdate(
    { _id: new ObjectId(proposalId) },
    {
      $set: {
        status: "accepted",
        respondedAt: new Date(),
        responseNote: responseNote,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  // Reject all other proposals for this job
  await db.collection(COLLECTIONS.PROPOSALS).updateMany(
    {
      jobId: new ObjectId(proposal.jobId),
      _id: { $ne: new ObjectId(proposalId) },
      status: { $in: ["pending", "shortlisted"] }
    },
    {
      $set: {
        status: "rejected",
        respondedAt: new Date(),
        updatedAt: new Date()
      }
    }
  );

  // Update job status
  await db.collection(COLLECTIONS.JOBS).updateOne(
    { _id: new ObjectId(proposal.jobId) },
    {
      $set: {
        status: "in_progress",
        assignedFreelancer: new ObjectId(proposal.freelancerId),
        updatedAt: new Date()
      }
    }
  );

  return result.value;
};

/* REJECT PROPOSAL */
export const rejectProposal = async (proposalId, clientId, responseNote = null) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const proposal = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    _id: new ObjectId(proposalId)
  });

  if (!proposal) {
    throw new Error("Proposal not found");
  }

  if (proposal.clientId.toString() !== clientId) {
    throw new Error("You don't have permission to reject this proposal");
  }

  const result = await db.collection(COLLECTIONS.PROPOSALS).findOneAndUpdate(
    { _id: new ObjectId(proposalId) },
    {
      $set: {
        status: "rejected",
        respondedAt: new Date(),
        responseNote: responseNote,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};