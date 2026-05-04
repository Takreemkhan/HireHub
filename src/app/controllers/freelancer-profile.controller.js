



import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";



/* CREATE OR UPDATE FREELANCER PROFILE */
export const upsertFreelancerProfile = async (userId, profileData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Calculate profile completeness
  let completeness = 0;
  if (profileData.profileImage) completeness += 5;
  if (profileData.coverPhoto) completeness += 5;
  if (profileData.hourlyRate) completeness += 10;
  if (profileData.title?.length > 10) completeness += 10;
  if (profileData.about?.length >= 100) completeness += 15;
  if (profileData.skills?.length >= 5) completeness += 15;
  if (profileData.languages?.length >= 1) completeness += 10;
  if (profileData.portfolio?.length >= 1) completeness += 10;
  if (profileData.workExperience?.length >= 1) completeness += 10;
  if (profileData.education?.length >= 1) completeness += 10;

  const updatedData = {
    ...profileData,
    userId: new ObjectId(userId),
    role: "freelancer",
    profileCompleteness: completeness,
    updatedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId) },
    {
      $set: updatedData,
      $setOnInsert: {
        createdAt: new Date(),
        memberSince: new Date(),
        totalEarned: 0,
        completedJobs: 0,
        rating: 0,
        reviews: []
      }
    },
    {
      upsert: true,
      returnDocument: "after"
    }
  );

  return result.value;
};

/* GET FREELANCER PROFILE BY USER ID */
export const getFreelancerProfile = async (userId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const profile = await db.collection(COLLECTIONS.PROFILES).findOne({
    userId: new ObjectId(userId),
    role: "freelancer"
  });


  if (!profile) {
    return null;
  }

  // Get user basic info
  const user = await db.collection(COLLECTIONS.USERS).findOne({
    _id: new ObjectId(userId)
  });

  // Get completed jobs count
  const completedJobs = await db.collection(COLLECTIONS.JOBS).countDocuments({
    freelancerId: new ObjectId(userId),
    status: "completed"
  });

  // Get active projects count
  const activeProjects = await db.collection(COLLECTIONS.JOBS).countDocuments({
    freelancerId: new ObjectId(userId),
    status: "in-progress"
  });

  return {
    ...profile,
    name: user?.name || profile.name,
    email: user?.email || profile.email,
    image: user?.image || profile.profileImage,      // Fallback to profileImage
    completedJobs,
    activeProjects
  };
};

/* GET FREELANCER PROFILE BY ID */
export const getFreelancerProfileById = async (profileId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  return await db.collection(COLLECTIONS.PROFILES).findOne({
    _id: new ObjectId(profileId),
    role: "freelancer"
  });
};

/* NEW: UPDATE PROFILE IMAGE */
export const updateProfileImage = async (userId, imageUrl) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $set: {
        profileImage: imageUrl,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* NEW: UPDATE COVER PHOTO */
export const updateCoverPhoto = async (userId, coverUrl) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $set: {
        coverPhoto: coverUrl,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE HOURLY RATE */
export const updateHourlyRate = async (userId, hourlyRate) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $set: {
        hourlyRate: Number(hourlyRate),
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE TITLE */
export const updateTitle = async (userId, title) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $set: {
        title,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE ABOUT */
export const updateAbout = async (userId, about) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $set: {
        about,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE SKILLS */
export const updateSkills = async (userId, skills) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  if (!Array.isArray(skills)) {
    throw new Error("Skills must be an array");
  }

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $set: {
        skills,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE LANGUAGES */
export const updateLanguages = async (userId, languages) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $set: {
        languages,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* ADD PORTFOLIO ITEM */
export const addPortfolio = async (userId, portfolioItem) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const newItem = {
    _id: new ObjectId(),
    ...portfolioItem,
    addedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $push: { portfolio: newItem },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* DELETE PORTFOLIO ITEM */
export const deletePortfolio = async (userId, portfolioId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $pull: { portfolio: { _id: new ObjectId(portfolioId) } },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* ADD WORK EXPERIENCE */
export const addWorkExperience = async (userId, experience) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const newExperience = {
    _id: new ObjectId(),
    ...experience,
    addedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $push: { workExperience: newExperience },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* DELETE WORK EXPERIENCE */
export const deleteWorkExperience = async (userId, experienceId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $pull: { workExperience: { _id: new ObjectId(experienceId) } },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* ADD EDUCATION */
export const addEducation = async (userId, education) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const newEducation = {
    _id: new ObjectId(),
    ...education,
    addedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $push: { education: newEducation },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* DELETE EDUCATION */
export const deleteEducation = async (userId, educationId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $pull: { education: { _id: new ObjectId(educationId) } },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* ADD CERTIFICATION */
export const addCertification = async (userId, certification) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const newCertification = {
    _id: new ObjectId(),
    ...certification,
    addedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $push: { certifications: newCertification },
      $set: { updatedAt: new Date() }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* UPDATE CONTACT INFO */
export const updateContactInfo = async (userId, contactInfo) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).findOneAndUpdate(
    { userId: new ObjectId(userId), role: "freelancer" },
    {
      $set: {
        contactInfo,
        updatedAt: new Date()
      }
    },
    { returnDocument: "after" }
  );

  return result.value;
};

/* DELETE FREELANCER PROFILE */
export const deleteFreelancerProfile = async (userId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const result = await db.collection(COLLECTIONS.PROFILES).deleteOne({
    userId: new ObjectId(userId),
    role: "freelancer"
  });

  return result.deletedCount > 0;
};

/* GET ALL FREELANCER PROFILES (with pagination and filters) */
export const getAllFreelancerProfiles = async (page = 1, limit = 20, filters = {}) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const skip = (page - 1) * limit;
  const query = { role: "freelancer" };
  console.log("Filters received in getAllFreelancerProfiles:", filters);
  // Apply filters
  if (filters.skills && filters.skills.length > 0) {
    query.skills = { $in: filters.skills };
  }

  if (filters.title && filters.title.length > 0) {
    query.$or = filters.title.map((t) => ({
      title: { $regex: t, $options: "i" }
    }));
  }

  if (filters.minRate) {
    query.hourlyRate = { $gte: Number(filters.minRate) };
  }

  if (filters.maxRate) {
    query.hourlyRate = { ...query.hourlyRate, $lte: Number(filters.maxRate) };
  }

  if (filters.location) {
    query.location = { $regex: filters.location, $options: "i" };
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { about: { $regex: filters.search, $options: "i" } },
      { skills: { $in: [new RegExp(filters.search, "i")] } }
    ];
  }


  const [profiles, total] = await Promise.all([
    db.collection(COLLECTIONS.PROFILES)
      .find(query)
      .sort({ rating: -1, completedJobs: -1, updatedAt: -1 })
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
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  };
};

export const getAllFreelancerCategories = async () => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // MongoDB aggregation: freelancer profiles group by title + count
  const categories = await db.collection(COLLECTIONS.PROFILES).aggregate([
    {
      // Sirf freelancers jinka title set hai
      $match: {
        role: "freelancer",
        title: { $nin: [null, ""] }
      }
    },
    {
      // title ke basis pe group karo aur count nikalo
      $group: {
        _id: "$title",                  // group by title
        userId: { $first: "$userId" },  // us title ka pehla userId
        count: { $sum: 1 } // kitne profiles same title ke hain
      }
    },
    {
      // Response shape: { id, label, count }
      $project: {
        _id: 0,
        id: "$userId",
        label: "$_id",
        count: 1
      }
    },
    {
      // Sabse zyada count wale pehle
      $sort: { count: -1 }
    }
  ]).toArray();

  return { categories };
};