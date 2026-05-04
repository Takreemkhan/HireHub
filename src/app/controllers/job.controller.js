import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";



// CREATE JOB 
export const createJob = async (data) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.JOBS).insertOne(data);
  return { ...data, _id: result.insertedId };
};

// GET ALL JOBS 
export const getAllJobs = async () => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return await db.collection(COLLECTIONS.JOBS)
    .find()
    .sort({ createdAt: -1 })
    .toArray();
};

// GET SINGLE JOB 
export const getJobById = async (jobId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return await db.collection(COLLECTIONS.JOBS)
    .findOne({ _id: new ObjectId(jobId) });
};

// UPDATE JOB 
export const updateJobById = async (jobId, updateData) => {
  console.log("UPDATE → COLLECTIONS.JOBS =", COLLECTIONS.JOBS);

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.JOBS)
    .findOneAndUpdate(
      { _id: new ObjectId(jobId) },
      { $set: updateData },
      { returnDocument: "after" }
    );

  return result.value;
};

// DELETE JOB 
export const deleteJobById = async (jobId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.JOBS)
    .deleteOne({ _id: new ObjectId(jobId) });

  return result.deletedCount > 0;
};



//       FREELANCER SIDE - BROWSE/SEARCH JOBS        


// GET ALL JOBS FOR FREELANCER
// ✅ OPTIMIZED: Pehle 41 queries the (20 jobs x 2 + 1), ab sirf 2 queries hain
// MongoDB $lookup se saari client info ek hi query mein aati hai
export const getAllJobsForFreelancer = async (filters = {}) => {

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Step 1: Match filter banao (same as before)
  const matchQuery = {
    status: "open",
    jobVisibility: "public"
  };

  if (filters.category) matchQuery.category = filters.category;
  if (filters.subCategory) matchQuery.subCategory = filters.subCategory;
  if (filters.projectDuration) matchQuery.projectDuration = filters.projectDuration;
  if (filters.country) matchQuery.country = filters.country;

  if (filters.minBudget || filters.maxBudget) {
    matchQuery.budget = {};
    if (filters.minBudget) matchQuery.budget.$gte = Number(filters.minBudget);
    if (filters.maxBudget) matchQuery.budget.$lte = Number(filters.maxBudget);
  }

  if (filters.search) {
    matchQuery.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } }
    ];
  }

  // Step 2: Sort options
  const sortMap = {
    budget_asc: { budget: 1 },
    budget_desc: { budget: -1 },
    proposals: { proposalCount: -1 },
    recent: { createdAt: -1 },
  };
  const sortOptions = sortMap[filters.sortBy] || { createdAt: -1 };

  // Step 3: Pagination
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 20;
  const skip = (page - 1) * limit;

  // Step 4: EK hi aggregation query mein sab kuch
  // Pehle: 1 job fetch + 1 user fetch + 1 proposal count = 3 queries PER JOB (20 jobs = 60 queries)
  // Ab:    Sab kuch ek pipeline mein = sirf 1 query total
  const pipeline = [
    { $match: matchQuery },

    // Add computed field so featured + non-expired jobs sort to the top
    {
      $addFields: {
        _featuredActive: {
          $and: [
            { $eq: ["$isFeatured", true] },
            { $gt: ["$featuredUntil", "$$NOW"] }
          ]
        }
      }
    },

    // Featured jobs first, then by featuredUntil desc (most recently featured on top), then by chosen sort
    { $sort: { _featuredActive: -1, featuredUntil: -1, ...sortOptions } },

    // Total count ke liye facet use karo (pagination + data dono ek saath)
    {
      $facet: {
        metadata: [{ $count: "total" }],
        jobs: [
          { $skip: skip },
          { $limit: limit },

          // clientId string ho sakti hai ya ObjectId — dono handle karo
          {
            $addFields: {
              clientIdObj: {
                $cond: {
                  if: { $eq: [{ $type: "$clientId" }, "objectId"] },
                  then: "$clientId",
                  else: { $toObjectId: "$clientId" }
                }
              }
            }
          },

          // ✅ $lookup: Users collection se client info EK saath lao
          {
            $lookup: {
              from: COLLECTIONS.USERS,
              localField: "clientIdObj",
              foreignField: "_id",
              as: "clientData",
              pipeline: [
                { $project: { name: 1, country: 1, rating: 1, createdAt: 1 } }
              ]
            }
          },

          // ✅ $lookup: Proposals collection se count lao
          {
            $lookup: {
              from: COLLECTIONS.PROPOSALS,
              localField: "_id",
              foreignField: "jobId",
              as: "proposalDocs",
              pipeline: [
                { $match: { isActive: true } },
                { $count: "count" }
              ]
            }
          },

          // Data clean karo — final shape banao
          {
            $addFields: {
              clientInfo: {
                name: { $ifNull: [{ $arrayElemAt: ["$clientData.name", 0] }, "Anonymous"] },
                country: { $ifNull: [{ $arrayElemAt: ["$clientData.country", 0] }, "Not specified"] },
                rating: { $ifNull: [{ $arrayElemAt: ["$clientData.rating", 0] }, 0] },
                memberSince: { $arrayElemAt: ["$clientData.createdAt", 0] }
              },
              proposalCount: {
                $cond: {
                  if: { $gt: [{ $ifNull: ["$proposalCount", null] }, null] },
                  then: "$proposalCount",
                  else: { $ifNull: [{ $arrayElemAt: ["$proposalDocs.count", 0] }, 0] }
                }
              }
            }
          },

          // Temp fields hatao
          { $project: { clientData: 0, proposalDocs: 0, clientIdObj: 0, _featuredActive: 0 } }
        ]
      }
    }
  ];

  // ✅ Sirf 1 DB call — pehle 41+ calls tha!
  const [result] = await db.collection(COLLECTIONS.JOBS).aggregate(pipeline).toArray();

  const total = result.metadata[0]?.total || 0;
  const rawJobs = result.jobs || [];

  // timePosted calculate karo (DB se nahi, JS mein — sahi hai)
  const enhancedJobs = rawJobs.map((job) => ({
    ...job,
    timePosted: calculateTimeAgo(job.createdAt)
  }));

  return {
    jobs: enhancedJobs,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

// Calculate time ago 
const calculateTimeAgo = (date) => {
  const now = new Date();
  const posted = new Date(date);
  const diffMs = now - posted;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
};

// GET FEATURED JOBS - Active featured jobs (isFeatured=true, featuredUntil in future)
export const getFeaturedJobs = async (limit = 10) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const now = new Date();

  const jobs = await db.collection(COLLECTIONS.JOBS)
    .find({
      status: "open",
      jobVisibility: "public",
      isFeatured: true,
      featuredUntil: { $gte: now }
    })
    .sort({ featuredUntil: 1 }) // soonest-expiring first
    .limit(limit)
    .toArray();

  return jobs;
};

// GET JOB CATEGORIES - For Filter Dropdown
export const getJobCategories = async () => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const categories = await db.collection(COLLECTIONS.JOBS).aggregate([
    { $match: { status: "open", jobVisibility: "public" } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        subCategories: { $addToSet: "$subCategory" }
      }
    },
    { $sort: { count: -1 } }
  ]).toArray();

  return categories.map(cat => ({
    category: cat._id,
    count: cat.count,
    subCategories: cat.subCategories
  }));
};