import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";


/*     DRAFT PROPOSAL MANAGEMENT (Same Table)         */


/* Helper: Convert to ObjectId */
const toObjectId = (id) => {
  if (!id) return null;
  if (typeof id === 'string') return new ObjectId(id);
  return id;
};

/* SAVE DRAFT PROPOSAL */
export const saveDraftProposal = async (freelancerId, proposalData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Minimum required: jobId only
  if (!proposalData.jobId) {
    throw new Error("Job ID is required");
  }

  const freelancerObjId = toObjectId(freelancerId);
  const jobObjId = toObjectId(proposalData.jobId);

  // Get job details
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: jobObjId
  });

  if (!job) {
    throw new Error("Job not found");
  }

  // Check if draft already exists for this job
  const existingDraft = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    freelancerId: freelancerObjId,
    jobId: jobObjId,
    isDraft: true
  });

  const draftData = {
    freelancerId: freelancerObjId,
    jobId: jobObjId,
    clientId: toObjectId(job.clientId),
    coverLetter: proposalData.coverLetter || null,
    proposedBudget: proposalData.proposedBudget || null,
    estimatedDuration: proposalData.estimatedDuration || null,
    milestones: proposalData.milestones || [],
    attachments: proposalData.attachments || [],
    
    // IMPORTANT: Draft flags
    isDraft: true,
    status: "draft",
    isActive: false,
    
    updatedAt: new Date()
  };

  if (existingDraft) {
    // Update existing draft
    const result = await db.collection(COLLECTIONS.PROPOSALS).findOneAndUpdate(
      { _id: existingDraft._id },
      { $set: draftData },
      { returnDocument: "after" }
    );
    return result.value;
  } else {
    // Create new draft
    draftData.createdAt = new Date();
    const result = await db.collection(COLLECTIONS.PROPOSALS).insertOne(draftData);
    return { ...draftData, _id: result.insertedId };
  }
};

/* GET ALL DRAFT PROPOSALS FOR FREELANCER */
export const getFreelancerDraftProposals = async (freelancerId, page = 1, limit = 10) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const skip = (page - 1) * limit;
  const freelancerObjId = toObjectId(freelancerId);

  const query = {
    freelancerId: freelancerObjId,
    isDraft: true,
    status: "draft"
  };

  const [drafts, total] = await Promise.all([
    db.collection(COLLECTIONS.PROPOSALS)
      .find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection(COLLECTIONS.PROPOSALS).countDocuments(query)
  ]);

  // Enhance with job details
  const enhancedDrafts = await Promise.all(
    drafts.map(async (draft) => {
      const jobId = toObjectId(draft.jobId);
      
      const job = await db.collection(COLLECTIONS.JOBS).findOne({
        _id: jobId
      });

      return {
        ...draft,
        jobDetails: job ? {
          _id: job._id,
          title: job.title,
          budget: job.budget,
          category: job.category,
          status: job.status,
          projectDuration: job.projectDuration
        } : null
      };
    })
  );

  return {
    drafts: enhancedDrafts,
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

/* GET SINGLE DRAFT BY ID */
export const getDraftProposalById = async (draftId, freelancerId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const freelancerObjId = toObjectId(freelancerId);

  const draft = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    _id: new ObjectId(draftId),
    freelancerId: freelancerObjId,
    isDraft: true
  });

  if (!draft) {
    throw new Error("Draft not found or you don't have permission");
  }

  // Get job details
  const jobId = toObjectId(draft.jobId);
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: jobId
  });

  return {
    ...draft,
    jobDetails: job ? {
      _id: job._id,
      title: job.title,
      description: job.description,
      budget: job.budget,
      category: job.category,
      subCategory: job.subCategory,
      projectDuration: job.projectDuration,
      status: job.status
    } : null
  };
};

/* UPDATE DRAFT PROPOSAL */
export const updateDraftProposal = async (draftId, freelancerId, updateData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const freelancerObjId = toObjectId(freelancerId);

  // Verify ownership
  const draft = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    _id: new ObjectId(draftId),
    freelancerId: freelancerObjId,
    isDraft: true
  });

  if (!draft) {
    throw new Error("Draft not found or you don't have permission");
  }

  const result = await db.collection(COLLECTIONS.PROPOSALS).findOneAndUpdate(
    { _id: new ObjectId(draftId) },
    { 
      $set: {
        ...updateData,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* DELETE DRAFT PROPOSAL */
export const deleteDraftProposal = async (draftId, freelancerId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const freelancerObjId = toObjectId(freelancerId);

  const result = await db.collection(COLLECTIONS.PROPOSALS).deleteOne({
    _id: new ObjectId(draftId),
    freelancerId: freelancerObjId,
    isDraft: true
  });

  return result.deletedCount > 0;
};

/* PUBLISH DRAFT PROPOSAL (Convert to real proposal) */
export const publishDraftProposal = async (draftId, freelancerId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const freelancerObjId = toObjectId(freelancerId);

  // Get draft
  const draft = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    _id: new ObjectId(draftId),
    freelancerId: freelancerObjId,
    isDraft: true
  });

  if (!draft) {
    throw new Error("Draft not found or you don't have permission");
  }

  // Validate required fields
  const missingFields = [];
  if (!draft.coverLetter) missingFields.push("coverLetter");
  if (!draft.proposedBudget) missingFields.push("proposedBudget");
  if (!draft.estimatedDuration) missingFields.push("estimatedDuration");

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  // Check if job still exists and is open
  const jobId = toObjectId(draft.jobId);
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: jobId,
    status: "open"
  });

  if (!job) {
    throw new Error("Job not found or no longer accepting proposals");
  }

  // Check if already submitted a published proposal for this job
  const existingProposal = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    jobId: jobId,
    freelancerId: freelancerObjId,
    isDraft: false,
    status: { $ne: "draft" }
  });

  if (existingProposal) {
    throw new Error("You have already submitted a proposal for this job");
  }

  // Update draft to published proposal
  const result = await db.collection(COLLECTIONS.PROPOSALS).findOneAndUpdate(
    { _id: new ObjectId(draftId) },
    { 
      $set: { 
        isDraft: false,
        status: "pending",
        isActive: true,
        submittedAt: new Date(),
        updatedAt: new Date()
      } 
    },
    { returnDocument: "after" }
  );

  // Update job proposal count
  await db.collection(COLLECTIONS.JOBS).updateOne(
    { _id: jobId },
    { $inc: { proposalCount: 1 } }
  );

  return result.value;
};

/* GET DRAFT FOR SPECIFIC JOB */
export const getDraftForJob = async (freelancerId, jobId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const freelancerObjId = toObjectId(freelancerId);
  const jobObjId = toObjectId(jobId);

  const draft = await db.collection(COLLECTIONS.PROPOSALS).findOne({
    freelancerId: freelancerObjId,
    jobId: jobObjId,
    isDraft: true
  });

  return draft;
};