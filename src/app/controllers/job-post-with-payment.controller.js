

import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { checkPaymentRequired } from "./razorpay-payment.controller";
import { notifyRecommendedJob } from "@/services/notificationService";
import { createPaymentRecord } from "@/services/payment.service";

/* Convert to ObjectId */
const toObjectId = (id) => {
  if (!id) return null;
  if (typeof id === 'string') return new ObjectId(id);
  return id;
};

/* POST A JOB (WITH PAYMENT CHECK) */
export const postJob = async (clientId, jobData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const clientObjId = toObjectId(clientId);

  // Validation
  if (!jobData.title || !jobData.budget || !jobData.category) {
    throw new Error("Title, budget, and category are required");
  }

  // CHECK IF PAYMENT REQUIRED
  const paymentCheck = await checkPaymentRequired(clientId);

  if (paymentCheck.paymentRequired) {
    // Pay Later with no Featured: bypass payment entirely
    if (jobData.payLater && !jobData.isFeatured) {
      paymentCheck.paymentRequired = false;
    } else {
      return {
        requiresPayment: true,
        ...paymentCheck,
        jobData
      };
    }
  }

  const featuredFee = jobData.isFeatured ? Math.round(Number(jobData.budget) * 0.02 * 100) / 100 : 0;
  const featuredUntil = jobData.isFeatured ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

  // ── Job document: only job-related fields ──
  const job = {
    clientId: clientObjId,
    title: jobData.title.trim(),
    category: jobData.category,
    subCategory: jobData.subCategory || null,
    description: jobData.description?.trim() || "",
    budget: Number(jobData.budget),
    currency: jobData.currency || "INR",
    projectDuration: jobData.projectDuration || null,
    experienceLevel: jobData.experienceLevel || null,
    skills: jobData.skills || [],
    attachments: jobData.attachments || [],
    jobVisibility: jobData.jobVisibility || "public",
    freelancerSource: jobData.freelancerSource || "any",
    questions: jobData.questions || [],
    isFeatured: !!jobData.isFeatured,
    featuredUntil,
    proposalCount: 0,
    status: "open",
    isDraft: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.JOBS).insertOne(job);
  const jobId = result.insertedId;

  // ── Payment document: deferred or "no payment" case ──
  await createPaymentRecord(db, {
    jobId,
    clientId: clientObjId,
    orderId: null,
    paymentType: "deferred",
    paymentStatus: "pending_assignment",
    amount: 0,
    platformCommission: 0,
    featuredFee,
    walletPart: 0,
    rzpPart: 0,
    escrowAmount: 0,
    escrowStatus: "none",
    escrowReleased: 0,
    payLater: !!jobData.payLater,
  });

  notifyMatchingFreelancers(db, jobId, job).catch((err) =>
    console.warn("⚠️ Recommended job notifications failed:", err.message)
  );

  return {
    requiresPayment: false,
    job: {
      ...job,
      _id: jobId
    },
    message: `Job posted successfully!`
  };
};



async function notifyMatchingFreelancers(db, jobId, job) {
  try {

    const matchQuery = {

      $or: [

        { title: { $regex: job.category, $options: "i" } },
      ]
    };


    if (job.skills && job.skills.length > 0) {
      matchQuery.$or.push(
        { skills: { $in: job.skills } }
      );
    }

    const matchingProfiles = await db
      .collection(COLLECTIONS.PROFILES)
      .find(matchQuery, { projection: { userId: 1 } })
      .limit(50)
      .toArray();

    if (matchingProfiles.length === 0) {
      console.log("No matching freelancers found for job:", job.title);
      return;
    }

    console.log(`📢 Notifying ${matchingProfiles.length} freelancers for job: ${job.title}`);


    const notificationPromises = matchingProfiles.map((profile) =>
      notifyRecommendedJob({
        recipientId: profile.userId.toString(),
        jobId: jobId.toString(),
        jobTitle: job.title,
        budget: job.budget,
      }).catch((err) => {

        console.warn(`Failed to notify freelancer ${profile.userId}:`, err.message);
      })
    );

    await Promise.allSettled(notificationPromises);

    console.log(`✅ Recommended job notifications sent for: ${job.title}`);
  } catch (err) {
    console.error("notifyMatchingFreelancers error:", err);
  }
}