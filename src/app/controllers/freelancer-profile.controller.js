



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

  let profile = null;
  let userObjectId;

  try {
    userObjectId = new ObjectId(userId);
  } catch (e) {
    return null;
  }

  profile = await db.collection(COLLECTIONS.PROFILES).findOne({
    userId: userObjectId,
    role: "freelancer"
  });

  // Get user basic info (always needed for name/image)
  const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: userObjectId });

  if (!profile && !user) return null;

  // Get completed jobs (with details)
  const completedJobsList = await db.collection(COLLECTIONS.JOBS).find({
    freelancerId: userObjectId,
    status: "completed"
  }, {
    projection: { title: 1, createdAt: 1, updatedAt: 1, description: 1, budget: 1 }
  }).limit(20).toArray();

  // Get active/in-progress jobs (with details)
  const activeJobsList = await db.collection(COLLECTIONS.JOBS).find({
    freelancerId: userObjectId,
    status: "in-progress"
  }, {
    projection: { title: 1, createdAt: 1, updatedAt: 1, description: 1 }
  }).limit(20).toArray();

  return {
    ...(profile || {}),
    name: user?.name || profile?.name || "Unknown",
    email: user?.email || profile?.email,
    image: profile?.profileImage || user?.image || null,
    profileImage: profile?.profileImage || user?.image || null,
    completedJobs: completedJobsList.length,
    activeProjects: activeJobsList.length,
    completedJobsList: completedJobsList.map(j => ({
      title: j.title || "Completed Project",
      dateRange: j.updatedAt ? new Date(j.updatedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
      feedback: ""
    })),
    activeJobsList: activeJobsList.map(j => ({
      title: j.title || "Ongoing Project",
      startDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
      description: j.description || ""
    }))
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
  const userQuery = { role: "freelancer", isDeleted: { $ne: true } };

  // Note: Since we want ALL freelancers from USERS table, we start with USERS
  // and left join PROFILES.

  const pipeline = [
    { $match: userQuery },
    {
      $lookup: {
        from: COLLECTIONS.PROFILES,
        localField: "_id",
        foreignField: "userId",
        as: "profile"
      }
    },
    { $unwind: { path: "$profile", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        userId: { $toString: "$_id" },
        name: 1,
        email: 1,
        profileImage: { $ifNull: ["$profile.profileImage", "$image", ""] },
        title: { $ifNull: ["$profile.title", "Freelancer"] },
        hourlyRate: { $ifNull: ["$profile.hourlyRate", 0] },
        rating: { $ifNull: ["$profile.rating", 0] },
        completedJobs: { $ifNull: ["$profile.completedJobs", 0] },
        activeProjects: { $ifNull: ["$profile.activeProjects", 0] },
        reviews: { $ifNull: ["$profile.reviews", []] },
        skills: { $ifNull: ["$profile.skills", []] },
        location: { $ifNull: ["$profile.location", "Remote"] },
        responseTime: { $ifNull: ["$profile.responseTime", "1 hour"] },
        about: { $ifNull: ["$profile.about", ""] },
        verified: { $ifNull: ["$profile.verified", false] },
        updatedAt: { $ifNull: ["$profile.updatedAt", "$createdAt"] }
      }
    }
  ];

  // Apply filters to the projected results
  const matchFilter = {};
  if (filters.skills && filters.skills.length > 0) {
    matchFilter.skills = { $in: filters.skills };
  }
  if (filters.search) {
    matchFilter.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { title: { $regex: filters.search, $options: "i" } },
      { about: { $regex: filters.search, $options: "i" } },
      { skills: { $in: [new RegExp(filters.search, "i")] } }
    ];
  }
  if (filters.minRate) matchFilter.hourlyRate = { $gte: Number(filters.minRate) };
  if (filters.maxRate) matchFilter.hourlyRate = { ...matchFilter.hourlyRate, $lte: Number(filters.maxRate) };
  if (filters.location) matchFilter.location = { $regex: filters.location, $options: "i" };

  if (Object.keys(matchFilter).length > 0) {
    pipeline.push({ $match: matchFilter });
  }

  // Count total matching
  const countPipeline = [...pipeline, { $count: "total" }];
  const [profiles, countResult] = await Promise.all([
    db.collection(COLLECTIONS.USERS).aggregate([
      ...pipeline,
      { $sort: { rating: -1, completedJobs: -1, updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]).toArray(),
    db.collection(COLLECTIONS.USERS).aggregate(countPipeline).toArray()
  ]);

  const total = countResult[0]?.total || 0;

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

  const rawProfiles = await db.collection(COLLECTIONS.PROFILES).find(
    { role: "freelancer" },
    { projection: { title: 1, userId: 1, skills: 1 } }
  ).toArray();

  const getCanonicalCategory = (title) => {
    if (!title) return "Freelancer";
    const t = title.toLowerCase().trim();
    if (t.includes('mern')) return 'MERN Stack';
    if (t.includes('full stack') || t.includes('full-stack') || t.includes('fullstack')) return 'Full-Stack Development';
    if (t.includes('frontend') || t.includes('front-end')) return 'Frontend Development';
    if (t.includes('backend') || t.includes('back-end')) return 'Backend Development';
    if (t.includes('mobile') || t.includes('ios') || t.includes('android')) return 'Mobile Development';
    if (t.includes('design') || t.includes('ui/ux') || t.includes('graphic')) return 'Design & Creative';
    if (t.includes('data') || t.includes('machine learning') || t.includes('ml') || t.includes('ai')) return 'Data Science & AI';
    if (t.includes('junior')) return 'Junior Developer';
    if (t.includes('senior')) return 'Senior Developer';
    // Fallback: Capitalize first letters
    return title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };

  const categoryMap = {};
  const skillMap = {};

  rawProfiles.forEach(p => {
    // Categories
    if (p.title) {
      const canonical = getCanonicalCategory(p.title);
      if (!categoryMap[canonical]) {
        categoryMap[canonical] = {
          id: p.userId.toString(),
          label: canonical,
          count: 0
        };
      }
      categoryMap[canonical].count++;
    }

    // Skills
    if (Array.isArray(p.skills)) {
      p.skills.forEach(skill => {
        let skillName = "";
        if (typeof skill === 'string') {
          skillName = skill;
        } else if (skill && typeof skill === 'object') {
          skillName = skill.name || skill.label || "";
        }

        if (skillName) {
          const canonicalSkill = skillName.trim();
          if (!skillMap[canonicalSkill]) {
            skillMap[canonicalSkill] = {
              id: canonicalSkill.toLowerCase().replace(/\s+/g, ''),
              label: canonicalSkill,
              count: 0
            };
          }
          skillMap[canonicalSkill].count++;
        }
      });
    }
  });

  const categories = Object.values(categoryMap).sort((a, b) => b.count - a.count);
  const topSkills = Object.values(skillMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Top 15 skills

  return { categories, topSkills };
};

