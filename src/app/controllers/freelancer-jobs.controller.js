import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";



/* Convert to ObjectId */
const toObjectId = (id) => {
  if (!id) return null;
  if (typeof id === 'string') return new ObjectId(id);
  return id;
};

/* GET FREELANCER'S CURRENT JOBS (In-Progress only) */
export const getFreelancerCurrentJobs = async (freelancerId, page = 1, limit = 10) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const skip = (page - 1) * limit;
  const freelancerObjId = toObjectId(freelancerId);

  const query = {
    $or: [
      { freelancerId: freelancerObjId },
      { freelancerId: freelancerId.toString() }
    ],
    status: "in-progress"
  };

  const [jobs, total] = await Promise.all([
    db.collection(COLLECTIONS.JOBS)
      .find(query)
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection(COLLECTIONS.JOBS).countDocuments(query)
  ]);

  // Enhance with client info
  const enhancedJobs = await Promise.all(
    jobs.map(async (job) => {
      const clientId = toObjectId(job.clientId);
      
      const clientUser = await db.collection(COLLECTIONS.USERS).findOne({
        $or: [
          { _id: clientId },
          { _id: job.clientId.toString() }
        ]
      });

      // Calculate days since started
      const daysSinceStart = job.startedAt 
        ? Math.ceil((new Date() - new Date(job.startedAt)) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        ...job,
        clientInfo: {
          _id: clientUser?._id,
          name: clientUser?.name || "Unknown",
          email: clientUser?.email,
          image: clientUser?.image,
          rating: clientUser?.rating || 0
        },
        daysSinceStart
      };
    })
  );
console.log("current jobs ",jobs)
  return {
    jobs: enhancedJobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    },
    stats: {
      totalCurrent: total,
      totalEarning: jobs.reduce((sum, job) => sum + (job.budget || 0), 0)
    }
  };
};

/* GET FREELANCER'S COMPLETED JOBS (with reviews & earnings) */
export const getFreelancerCompletedJobs = async (freelancerId, page = 1, limit = 10) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const skip = (page - 1) * limit;
  const freelancerObjId = toObjectId(freelancerId);

  const query = {
    $or: [
      { freelancerId: freelancerObjId },
      { freelancerId: freelancerId.toString() }
    ],
    status: "completed"
  };

  const [jobs, total] = await Promise.all([
    db.collection(COLLECTIONS.JOBS)
      .find(query)
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection(COLLECTIONS.JOBS).countDocuments(query)
  ]);

  // Enhance with client info and calculate duration
  const enhancedJobs = await Promise.all(
    jobs.map(async (job) => {
      const clientId = toObjectId(job.clientId);
      
      const clientUser = await db.collection(COLLECTIONS.USERS).findOne({
        $or: [
          { _id: clientId },
          { _id: job.clientId.toString() }
        ]
      });

      // Calculate duration
      const duration = job.completedAt && job.startedAt
        ? Math.ceil((new Date(job.completedAt) - new Date(job.startedAt)) / (1000 * 60 * 60 * 24))
        : job.durationInDays || null;

      return {
        ...job,
        clientInfo: {
          _id: clientUser?._id,
          name: clientUser?.name || "Unknown",
          email: clientUser?.email,
          image: clientUser?.image,
          rating: clientUser?.rating || 0
        },
        durationInDays: duration,
        earned: job.finalAmount || job.budget || 0,
        clientReview: job.clientReview || null,
        freelancerReview: job.freelancerReview || null
      };
    })
  );

  return {
    jobs: enhancedJobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    },
    stats: {
      totalCompleted: total,
      totalEarned: enhancedJobs.reduce((sum, job) => sum + job.earned, 0),
      averageDuration: enhancedJobs.reduce((sum, job) => sum + (job.durationInDays || 0), 0) / total || 0,
      averageRating: enhancedJobs
        .filter(j => j.clientReview?.rating)
        .reduce((sum, job) => sum + job.clientReview.rating, 0) / 
        enhancedJobs.filter(j => j.clientReview?.rating).length || 0
    }
  };
};

/* GET AVAILABLE JOBS FOR FREELANCER (Open jobs to apply) */
export const getAvailableJobsForFreelancer = async (freelancerId, page = 1, limit = 20, filters = {}) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const skip = (page - 1) * limit;
  const freelancerObjId = toObjectId(freelancerId);

  const query = {
    status: "open",
    isDraft: false,
    jobVisibility: "public"
  };

  // Apply filters
  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.minBudget) {
    query.budget = { $gte: Number(filters.minBudget) };
  }

  if (filters.maxBudget) {
    query.budget = { ...query.budget, $lte: Number(filters.maxBudget) };
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } }
    ];
  }

  const [jobs, total] = await Promise.all([
    db.collection(COLLECTIONS.JOBS)
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection(COLLECTIONS.JOBS).countDocuments(query)
  ]);

  // Check if freelancer already applied
  const enhancedJobs = await Promise.all(
    jobs.map(async (job) => {
      const clientId = toObjectId(job.clientId);
      
      const [clientUser, hasApplied, proposalCount] = await Promise.all([
        db.collection(COLLECTIONS.USERS).findOne({
          $or: [
            { _id: clientId },
            { _id: job.clientId.toString() }
          ]
        }),
        db.collection(COLLECTIONS.PROPOSALS).findOne({
          jobId: job._id,
          $or: [
            { freelancerId: freelancerObjId },
            { freelancerId: freelancerId.toString() }
          ]
        }),
        db.collection(COLLECTIONS.PROPOSALS).countDocuments({
          jobId: job._id,
          status: { $ne: "rejected" }
        })
      ]);

      return {
        ...job,
        clientInfo: {
          name: clientUser?.name || "Unknown",
          rating: clientUser?.rating || 0
        },
        hasApplied: !!hasApplied,
        proposalCount
      };
    })
  );

  return {
    jobs: enhancedJobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

/* SUBMIT JOB FOR COMPLETION (Freelancer marks as ready) */
export const submitJobForCompletion = async (jobId, freelancerId, submissionData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const freelancerObjId = toObjectId(freelancerId);

  // Verify job belongs to freelancer
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(jobId),
    $or: [
      { freelancerId: freelancerObjId },
      { freelancerId: freelancerId.toString() }
    ],
    status: "in-progress"
  });

  if (!job) {
    throw new Error("Job not found or you don't have permission");
  }

  const result = await db.collection(COLLECTIONS.JOBS).findOneAndUpdate(
    { _id: new ObjectId(jobId) },
    { 
      $set: { 
        submittedForReview: true,
        submittedAt: new Date(),
        submissionNotes: submissionData.notes || null,
        deliverables: submissionData.deliverables || [],
        updatedAt: new Date()
      } 
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* ADD FREELANCER REVIEW FOR CLIENT */
export const addFreelancerReviewForClient = async (jobId, freelancerId, reviewData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const freelancerObjId = toObjectId(freelancerId);

  // Verify job belongs to freelancer and is completed
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(jobId),
    $or: [
      { freelancerId: freelancerObjId },
      { freelancerId: freelancerId.toString() }
    ],
    status: "completed"
  });

  if (!job) {
    throw new Error("Job not found or you don't have permission");
  }

  if (job.freelancerReview) {
    throw new Error("You have already reviewed this client");
  }

  const result = await db.collection(COLLECTIONS.JOBS).findOneAndUpdate(
    { _id: new ObjectId(jobId) },
    { 
      $set: { 
        freelancerReview: {
          rating: reviewData.rating,
          comment: reviewData.comment,
          reviewedAt: new Date()
        },
        updatedAt: new Date()
      } 
    },
    { returnDocument: "after" }
  );

  // Update client rating
  const clientId = toObjectId(job.clientId);
  
  const clientJobs = await db.collection(COLLECTIONS.JOBS).find({
    $or: [
      { clientId: clientId },
      { clientId: job.clientId.toString() }
    ],
    status: "completed",
    "freelancerReview.rating": { $exists: true }
  }).toArray();

  if (clientJobs.length > 0) {
    const totalRating = clientJobs.reduce((sum, j) => sum + (j.freelancerReview?.rating || 0), 0);
    const avgRating = totalRating / clientJobs.length;

    await db.collection(COLLECTIONS.USERS).updateOne(
      { 
        $or: [
          { _id: clientId },
          { _id: job.clientId.toString() }
        ]
      },
      { $set: { rating: Number(avgRating.toFixed(1)) } }
    );
  }

  return result.value;
};

/* GET JOB DETAILS WITH BOTH PARTIES INFO */
export const getJobDetailsForFreelancer = async (jobId, freelancerId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const freelancerObjId = toObjectId(freelancerId);

  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(jobId),
    $or: [
      { freelancerId: freelancerObjId },
      { freelancerId: freelancerId.toString() }
    ]
  });

  if (!job) {
    throw new Error("Job not found or you don't have permission");
  }

  // Get client info
  const clientId = toObjectId(job.clientId);
  const clientUser = await db.collection(COLLECTIONS.USERS).findOne({
    $or: [
      { _id: clientId },
      { _id: job.clientId.toString() }
    ]
  });

  // Calculate duration
  const duration = job.completedAt && job.startedAt
    ? Math.ceil((new Date(job.completedAt) - new Date(job.startedAt)) / (1000 * 60 * 60 * 24))
    : job.startedAt
    ? Math.ceil((new Date() - new Date(job.startedAt)) / (1000 * 60 * 60 * 24))
    : null;

  return {
    ...job,
    clientInfo: {
      _id: clientUser?._id,
      name: clientUser?.name || "Unknown",
      email: clientUser?.email,
      image: clientUser?.image,
      rating: clientUser?.rating || 0,
      memberSince: clientUser?.createdAt
    },
    durationInDays: duration
  };
};




