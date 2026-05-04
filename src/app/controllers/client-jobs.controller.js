import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";


/* Helper: Convert to ObjectId */
const toObjectId = (id) => {
  if (!id) return null;
  if (typeof id === 'string') return new ObjectId(id);
  return id;
};

/* GET CLIENT'S CURRENT JOBS (Open + In-Progress) */
export const getClientCurrentJobs = async (clientId, page = 1, limit = 100) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const skip = (page - 1) * limit;
  const clientObjId = toObjectId(clientId);

  // Statuses for "Current" are open and in-progress (and variation with space)
  const currentQuery = {
    $or: [
      { clientId: clientObjId },
      { clientId: clientId.toString() }
    ],
    isDraft: { $ne: true },
    status: { $in: ["open", "in-progress", "in progress"] }
  };

  // Statuses for "Total" according to user: open, completed, in-progress
  const totalQuery = {
    $or: [
      { clientId: clientObjId },
      { clientId: clientId.toString() }
    ],
    isDraft: { $ne: true },
    status: { $in: ["open", "in-progress", "in progress", "completed"] }
  };

  const [jobs, totalCurrent, totalCompleted, openCount, inProgressCount, totalAllSidebar] = await Promise.all([
    db.collection(COLLECTIONS.JOBS).aggregate([
      { $match: currentQuery },
      { $sort: { status: 1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "jobId",
          as: "paymentDetails"
        }
      },
      {
        $addFields: {
          paymentStatus: { $arrayElemAt: ["$paymentDetails.paymentStatus", 0] },
          paymentType: { $arrayElemAt: ["$paymentDetails.paymentType", 0] },
          escrowAmount: { $arrayElemAt: ["$paymentDetails.escrowAmount", 0] },
          escrowStatus: { $arrayElemAt: ["$paymentDetails.escrowStatus", 0] },
          escrowReleased: { $arrayElemAt: ["$paymentDetails.escrowReleased", 0] },
          platformCommission: { $arrayElemAt: ["$paymentDetails.platformCommission", 0] }
        }
      },
      { $project: { paymentDetails: 0 } }
    ]).toArray(),
    db.collection(COLLECTIONS.JOBS).countDocuments(currentQuery),
    db.collection(COLLECTIONS.JOBS).countDocuments({ ...totalQuery, status: "completed" }),
    db.collection(COLLECTIONS.JOBS).countDocuments({ ...totalQuery, status: "open" }),
    db.collection(COLLECTIONS.JOBS).countDocuments({ ...totalQuery, status: "in-progress" }),
    db.collection(COLLECTIONS.JOBS).countDocuments(totalQuery)
  ]);

  // Enhance with freelancer info (if assigned)
  const enhancedJobs = await Promise.all(
    jobs.map(async (job) => {
      let freelancerInfo = null;

      if (job.freelancerId) {
        const freelancerId = toObjectId(job.freelancerId);
        const freelancer = await db.collection(COLLECTIONS.USERS).findOne({
          $or: [
            { _id: freelancerId },
            { _id: job.freelancerId.toString() }
          ]
        });

        if (freelancer) {
          freelancerInfo = {
            _id: freelancer._id,
            name: freelancer.name,
            email: freelancer.email,
            image: freelancer.image
          };
        }
      }

      // Get proposal count
      const proposalCount = await db.collection(COLLECTIONS.PROPOSALS).countDocuments({
        jobId: job._id,
        status: { $ne: "rejected" }
      });

      return {
        ...job,
        freelancerInfo,
        proposalCount
      };
    })
  );

  return {
    jobs: enhancedJobs,
    pagination: {
      total: totalCurrent,
      page,
      limit,
      totalPages: Math.ceil(totalCurrent / limit),
      hasNext: page < Math.ceil(totalCurrent / limit),
      hasPrev: page > 1
    },
    stats: {
      totalCurrent,
      totalCompleted,
      totalSidebar: totalAllSidebar, // This is open + in-progress + completed
      inProgressCount,
      openCount
    }
  };
};

/* GET CLIENT'S COMPLETED JOBS (with reviews & duration) */
export const getClientCompletedJobs = async (clientId, page = 1, limit = 100) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const skip = (page - 1) * limit;
  const clientObjId = toObjectId(clientId);

  const query = {
    $or: [
      { clientId: clientObjId },
      { clientId: clientId.toString() }
    ],
    isDraft: { $ne: true },
    status: "completed"
  };

  // Statuses for "Total" according to user: open, completed, in-progress
  const totalQuery = {
    $or: [
      { clientId: clientObjId },
      { clientId: clientId.toString() }
    ],
    isDraft: { $ne: true },
    status: { $in: ["open", "in-progress", "in progress", "completed"] }
  };

  const [jobs, totalCompleted, totalSidebar] = await Promise.all([
    db.collection(COLLECTIONS.JOBS).aggregate([
      { $match: query },
      { $sort: { completedAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "jobId",
          as: "paymentDetails"
        }
      },
      {
        $addFields: {
          paymentStatus: { $arrayElemAt: ["$paymentDetails.paymentStatus", 0] },
          escrowAmount: { $arrayElemAt: ["$paymentDetails.escrowAmount", 0] },
          escrowStatus: { $arrayElemAt: ["$paymentDetails.escrowStatus", 0] },
          escrowReleased: { $arrayElemAt: ["$paymentDetails.escrowReleased", 0] },
          platformCommission: { $arrayElemAt: ["$paymentDetails.platformCommission", 0] }
        }
      },
      { $project: { paymentDetails: 0 } }
    ]).toArray(),
    db.collection(COLLECTIONS.JOBS).countDocuments(query),
    db.collection(COLLECTIONS.JOBS).countDocuments(totalQuery)
  ]);

  // Enhance with freelancer info and reviews
  const enhancedJobs = await Promise.all(
    jobs.map(async (job) => {
      let freelancerInfo = null;

      if (job.freelancerId) {
        const freelancerId = toObjectId(job.freelancerId);
        const freelancer = await db.collection(COLLECTIONS.USERS).findOne({
          $or: [
            { _id: freelancerId },
            { _id: job.freelancerId.toString() }
          ]
        });

        if (freelancer) {
          freelancerInfo = {
            _id: freelancer._id,
            name: freelancer.name,
            email: freelancer.email,
            image: freelancer.image,
            rating: freelancer.rating || 0
          };
        }
      }

      // Calculate duration
      const duration = job.completedAt && job.createdAt
        ? Math.ceil((new Date(job.completedAt) - new Date(job.createdAt)) / (1000 * 60 * 60 * 24))
        : null;

      return {
        ...job,
        freelancerInfo,
        durationInDays: duration,
        clientReview: job.clientReview || null,
        freelancerReview: job.freelancerReview || null
      };
    })
  );

  return {
    jobs: enhancedJobs,
    pagination: {
      total: totalCompleted,
      page,
      limit,
      totalPages: Math.ceil(totalCompleted / limit),
      hasNext: page < Math.ceil(totalCompleted / limit),
      hasPrev: page > 1
    },
    stats: {
      totalCompleted: totalCompleted,
      totalSidebar: totalSidebar,
      totalSpent: jobs.reduce((sum, job) => sum + (job.finalAmount || job.budget || 0), 0),
      averageDuration: enhancedJobs.reduce((sum, job) => sum + (job.durationInDays || 0), 0) / totalCompleted || 0
    }
  };
};

/* MARK JOB AS COMPLETED (with review) */
export const markJobAsCompleted = async (jobId, clientId, completionData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const clientObjId = toObjectId(clientId);

  // Verify job belongs to client
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(jobId),
    $or: [
      { clientId: clientObjId },
      { clientId: clientId.toString() }
    ],
    status: "in-progress"
  });

  if (!job) {
    throw new Error("Job not found or cannot be marked as completed");
  }

  const completionDate = new Date();
  const duration = Math.ceil((completionDate - new Date(job.createdAt)) / (1000 * 60 * 60 * 24));
  const finalAmount = completionData.finalAmount || job.budget || 0;

  const result = await db.collection(COLLECTIONS.JOBS).findOneAndUpdate(
    { _id: new ObjectId(jobId) },
    {
      $set: {
        status: "completed",
        completedAt: completionDate,
        completionNotes: completionData.notes || null,
        finalAmount: finalAmount,
        durationInDays: duration,
        escrowReleased: finalAmount,
        escrowStatus: "released",
        clientReview: completionData.clientReview ? {
          rating: completionData.clientReview.rating,
          comment: completionData.clientReview.comment,
          reviewedAt: new Date()
        } : null,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  // Record a transaction for the client so "Total Spent" and "This Month" metrics capture it
  await db.collection(COLLECTIONS.WALLET_TRANSACTIONS).insertOne({
    userId: clientObjId,
    type: "debit",
    category: "milestone_payment", // Use same category as releases for consistent tracking
    amount: finalAmount,
    description: `Job completed: ${job.title}`,
    jobId: job._id,
    status: "completed",
    createdAt: completionDate,
  });

  // Update freelancer stats if exists
  if (job.freelancerId) {
    const freelancerId = toObjectId(job.freelancerId);

    await db.collection(COLLECTIONS.PROFILES).updateOne(
      {
        $or: [
          { userId: freelancerId },
          { userId: job.freelancerId.toString() }
        ]
      },
      {
        $inc: {
          completedJobs: 1,
          totalEarned: completionData.finalAmount || job.budget
        },
        $push: {
          reviews: completionData.clientReview ? {
            jobId: job._id,
            rating: completionData.clientReview.rating,
            comment: completionData.clientReview.comment,
            reviewedBy: clientObjId,
            reviewedAt: new Date()
          } : null
        }
      }
    );

    // Update freelancer rating
    if (completionData.clientReview) {
      const profile = await db.collection(COLLECTIONS.PROFILES).findOne({
        $or: [
          { userId: freelancerId },
          { userId: job.freelancerId.toString() }
        ]
      });

      if (profile) {
        const reviews = profile.reviews || [];
        const totalRating = reviews.reduce((sum, r) => sum + (r?.rating || 0), 0);
        const avgRating = totalRating / reviews.length;

        await db.collection(COLLECTIONS.PROFILES).updateOne(
          { _id: profile._id },
          { $set: { rating: avgRating } }
        );
      }
    }
  }

  return result.value;
};

/* ADD FREELANCER REVIEW (Freelancer reviews client) */
export const addFreelancerReview = async (jobId, freelancerId, reviewData) => {
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

  const totalRating = clientJobs.reduce((sum, j) => sum + (j.freelancerReview?.rating || 0), 0);
  const avgRating = totalRating / clientJobs.length;

  await db.collection(COLLECTIONS.USERS).updateOne(
    { _id: clientId },
    { $set: { rating: avgRating } }
  );

  return result.value;
};

/* ASSIGN FREELANCER TO JOB (Move from open to in-progress) */
export const assignFreelancerToJob = async (jobId, clientId, freelancerId, proposalId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const clientObjId = toObjectId(clientId);
  const freelancerObjId = toObjectId(freelancerId);

  // Verify job belongs to client
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: new ObjectId(jobId),
    $or: [
      { clientId: clientObjId },
      { clientId: clientId.toString() }
    ],
    status: "open"
  });

  if (!job) {
    throw new Error("Job not found or already assigned");
  }

  // Update job
  const result = await db.collection(COLLECTIONS.JOBS).findOneAndUpdate(
    { _id: new ObjectId(jobId) },
    {
      $set: {
        freelancerId: freelancerObjId,
        status: "in-progress",
        startedAt: new Date(),
        acceptedProposalId: proposalId ? new ObjectId(proposalId) : null,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  // Update proposal status
  if (proposalId) {
    await db.collection(COLLECTIONS.PROPOSALS).updateOne(
      { _id: new ObjectId(proposalId) },
      {
        $set: {
          status: "accepted",
          acceptedAt: new Date()
        }
      }
    );

    // Reject other proposals
    await db.collection(COLLECTIONS.PROPOSALS).updateMany(
      {
        jobId: new ObjectId(jobId),
        _id: { $ne: new ObjectId(proposalId) }
      },
      {
        $set: {
          status: "rejected",
          rejectedAt: new Date()
        }
      }
    );
  }

  return result.value;
};