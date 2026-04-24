import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* CREATE OR UPDATE PROFILE */
export const upsertProfile = async (userId, profileData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Calculate profile completeness
  let completeness = 0;
  if (profileData.hourlyRate) completeness += 15;
  if (profileData.professionalHeadline?.length > 10) completeness += 20;
  if (profileData.topSkills?.length >= 5) completeness += 25;
  if (profileData.summary?.length >= 100) completeness += 40;

  const updatedData = {
    ...profileData,
    userId: new ObjectId(userId),
    profileCompleteness: completeness,
    updatedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    {
      $set: updatedData,
      $setOnInsert: { createdAt: new Date() }
    },
    {
      upsert: true,
      returnDocument: "after"
    }
  );

  return result.value;
};

/* GET PROFILE BY USER ID */

export const getProfileByUserId = async (userId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return await db.collection(COLLECTIONS.PROFILES)
    .findOne({ userId: new ObjectId(userId) });
};

/* GET PROFILE BY ID */

export const getProfileById = async (profileId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return await db.collection(COLLECTIONS.PROFILES)
    .findOne({ _id: new ObjectId(profileId) });
};

/* UPDATE HOURLY RATE */
export const updateHourlyRate = async (userId, hourlyRate, currency = "USD") => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    {
      $set: {
        hourlyRate: Number(hourlyRate),
        currency,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE PROFESSIONAL HEADLINE */
export const updateProfessionalHeadline = async (userId, headline) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    {
      $set: {
        professionalHeadline: headline,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE TOP SKILLS */

export const updateTopSkills = async (userId, skills) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Validate skills array
  if (!Array.isArray(skills) || skills.length < 3 || skills.length > 20) {
    throw new Error("Skills must be an array with 3-20 items");
  }

  // Count matching jobs based on skills
  const matchingJobsCount = await db.collection(COLLECTIONS.JOBS).countDocuments({
    status: "open",
    $or: skills.map(skill => ({
      $or: [
        { title: { $regex: skill, $options: "i" } },
        { description: { $regex: skill, $options: "i" } },
        { requiredSkills: { $in: [skill] } }
      ]
    }))
  });

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    {
      $set: {
        topSkills: skills,
        matchingJobsCount,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE SUMMARY */
export const updateSummary = async (userId, summary) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    {
      $set: {
        summary,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE AVAILABILITY */
export const updateAvailability = async (userId, availability) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const validStatuses = ["available", "busy", "not-available"];
  if (!validStatuses.includes(availability)) {
    throw new Error("Invalid availability status");
  }

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    {
      $set: {
        availability,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* DELETE PROFILE */

export const deleteProfile = async (userId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES)
    .deleteOne({ userId: new ObjectId(userId) });

  return result.deletedCount > 0;
};

/* GET ALL PROFILES (with pagination) */

export const getAllProfiles = async (page = 1, limit = 10, filters = {}) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const skip = (page - 1) * limit;
  const query = {};

  // Apply filters
  if (filters.skills && filters.skills.length > 0) {
    query.topSkills = { $in: filters.skills };
  }

  if (filters.minRate) {
    query.hourlyRate = { $gte: Number(filters.minRate) };
  }

  if (filters.maxRate) {
    query.hourlyRate = { ...query.hourlyRate, $lte: Number(filters.maxRate) };
  }

  if (filters.availability) {
    query.availability = filters.availability;
  }

  const [profiles, total] = await Promise.all([
    db.collection(COLLECTIONS.PROFILES)
      .find(query)
      .sort({ profileCompleteness: -1, updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray(),
    db.collection(COLLECTIONS.PROFILES).countDocuments(query)
  ]);

  return {
    profiles,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};


/* GET user BY USER ID */

export const getUserByUserId = async (userId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return await db.collection(COLLECTIONS.USERS)
    .findOne({ userId: new ObjectId(userId) });
};


/* GET ALL PROFILES (with pagination) */

export const getFreelancerActivity = async () => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return await db.collection(COLLECTIONS.PROFILES).find({}).toArray();





};
