import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const toggleSavedFreelancer = async (clientId, freelancerId) => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(clientId) });
    if (!user) throw new Error("Client not found");

    const savedFreelancers = user.savedFreelancers || [];
    const isSaved = savedFreelancers.some(id => id.toString() === freelancerId);

    if (isSaved) {
        await db.collection(COLLECTIONS.USERS).updateOne(
            { _id: new ObjectId(clientId) },
            { $pull: { savedFreelancers: new ObjectId(freelancerId) } }
        );
        return { isSaved: false };
    } else {
        await db.collection(COLLECTIONS.USERS).updateOne(
            { _id: new ObjectId(clientId) },
            { $addToSet: { savedFreelancers: new ObjectId(freelancerId) } }
        );
        return { isSaved: true };
    }
};

export const getSavedFreelancers = async (clientId) => {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const user = await db.collection(COLLECTIONS.USERS).findOne({ _id: new ObjectId(clientId) });
    if (!user || !user.savedFreelancers || user.savedFreelancers.length === 0) {
        return [];
    }

    const pipeline = [
        { $match: { _id: { $in: user.savedFreelancers }, role: "freelancer", isDeleted: { $ne: true } } },
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
                responseTime: { $ifNull: ["$profile.responseTime", "Available now"] },
                about: { $ifNull: ["$profile.about", ""] },
                verified: { $ifNull: ["$profile.verified", false] },
                availability: { $ifNull: ["$profile.availability", "Available now"] },
                totalHours: { $ifNull: ["$profile.totalHours", 0] }
            }
        }
    ];

    const freelancers = await db.collection(COLLECTIONS.USERS).aggregate(pipeline).toArray();
    return freelancers;
};
