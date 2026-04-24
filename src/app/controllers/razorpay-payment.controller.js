
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import Razorpay from "razorpay";
import crypto from "crypto";
import { notifyRecommendedJob } from "@/services/notificationService";
import {
  createPaymentRecord,
  getPaymentByJobId,
  getPaymentByOrderId,
  updatePaymentRecord,
} from "@/services/payment.service";

/*   RAZORPAY PAYMENT WITH 2% COMMISSION   */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* CHECK IF PAYMENT REQUIRED FOR JOB POST */
export const checkPaymentRequired = async (clientId) => {
  // All job posts now require payment from the first post
  return {
    paymentRequired: true,
    totalJobsPosted: 0,
    freeJobsRemaining: 0,
    message: "Payment required to post this job"
  };
};

/* CREATE RAZORPAY ORDER */
export const createPaymentOrder = async (clientId, jobData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const clientObjId = new ObjectId(clientId);

  const clientUser = await db.collection(COLLECTIONS.USERS).findOne({ _id: clientObjId });
  if (!clientUser) throw new Error("Client not found");

  const jobBudget = Number(jobData.budget);
  const platformCommission = jobBudget * 0.02;
  const featuredFee = jobData.isFeatured ? Math.round(jobBudget * 0.02 * 100) / 100 : 0;
  let totalAmount = 0;

  if (jobData.payLater) {
    totalAmount = featuredFee;
  } else {
    totalAmount = jobBudget + platformCommission + featuredFee;
  }

  const amountInPaise = Math.round(totalAmount * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `job_${Date.now()}`,
    notes: { clientId: clientId.toString(), jobBudget, platformCommission, featuredFee, totalAmount }
  });

  const featuredUntil = jobData.isFeatured ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

  // ── Job document: only job-related fields ──
  const jobToSave = {
    clientId: clientObjId,
    title: jobData.title?.trim(),
    category: jobData.category,
    subCategory: jobData.subCategory || null,
    description: jobData.description?.trim() || "",
    budget: jobBudget,
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
    payLater: !!jobData.payLater,
    isDraft: true,
    status: jobData.payLater ? "open" : "payment_pending",
    proposalCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.JOBS).insertOne(jobToSave);
  const jobId = result.insertedId;

  // ── Payment document: all payment-related fields ──
  await createPaymentRecord(db, {
    jobId,
    clientId: clientObjId,
    orderId: razorpayOrder.id,
    paymentType: "razorpay",
    paymentStatus: "pending",
    amount: totalAmount,
    platformCommission,
    featuredFee,
    walletPart: 0,
    rzpPart: totalAmount,
    escrowAmount: 0,
    escrowStatus: "none",
    escrowReleased: 0,
  });

  return {
    orderId: razorpayOrder.id,
    amountInPaise,
    currency: "INR",
    jobBudget,
    platformCommission,
    featuredFee,
    totalAmount,
    jobId,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    clientName: clientUser.name,
    clientEmail: clientUser.email
  };
};

/* CREATE SPLIT PAYMENT ORDER (Wallet + Card) */
export const createSplitPaymentOrder = async (clientId, jobData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const clientObjId = new ObjectId(clientId);

  const clientUser = await db.collection(COLLECTIONS.USERS).findOne({ _id: clientObjId });
  if (!clientUser) throw new Error("Client not found");

  const { walletAmount, remainingAmount } = jobData;
  const jobBudget = Number(jobData.budget);
  const platformCommission = jobBudget * 0.02;
  const featuredFee = jobData.isFeatured ? Math.round(jobBudget * 0.02 * 100) / 100 : 0;

  let totalAmount = 0;
  if (jobData.payLater) {
    totalAmount = featuredFee;
  } else {
    totalAmount = jobBudget + platformCommission + featuredFee;
  }

  const amountInPaise = Math.round(remainingAmount * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `job_split_${Date.now()}`,
    notes: {
      clientId: clientId.toString(),
      jobBudget,
      platformCommission,
      featuredFee,
      totalAmount,
      walletPart: walletAmount,
      rzpPart: remainingAmount
    }
  });

  const featuredUntil = jobData.isFeatured ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;

  // ── Job document: only job-related fields ──
  const jobToSave = {
    clientId: clientObjId,
    title: jobData.title?.trim(),
    category: jobData.category,
    subCategory: jobData.subCategory || null,
    description: jobData.description?.trim() || "",
    budget: jobBudget,
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
    payLater: !!jobData.payLater,
    isDraft: true,
    status: jobData.payLater ? "open" : "payment_pending",
    proposalCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection(COLLECTIONS.JOBS).insertOne(jobToSave);
  const jobId = result.insertedId;

  // ── Payment document: all payment-related fields ──
  await createPaymentRecord(db, {
    jobId,
    clientId: clientObjId,
    orderId: razorpayOrder.id,
    paymentType: "split",
    paymentStatus: "split_pending",
    amount: totalAmount,
    platformCommission,
    featuredFee,
    walletPart: walletAmount,
    rzpPart: remainingAmount,
    escrowAmount: 0,
    escrowStatus: "none",
    escrowReleased: 0,
  });

  return {
    orderId: razorpayOrder.id,
    amount: remainingAmount,
    amountInPaise,
    currency: "INR",
    jobBudget,
    platformCommission,
    featuredFee,
    jobId,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    clientName: clientUser.name,
    clientEmail: clientUser.email
  };
};

/* VERIFY SPLIT PAYMENT AND PUBLISH JOB */
export const verifySplitPaymentAndPublishJob = async (paymentData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId, walletAmount } = paymentData;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new Error("Payment signature verification failed");
  }

  const payment = await razorpay.payments.fetch(razorpay_payment_id);
  if (payment.status !== "captured") throw new Error("Payment not captured");

  // Fetch job to get isFeatured / payLater flags
  const existingJob = await db.collection(COLLECTIONS.JOBS).findOne({ _id: new ObjectId(jobId) });
  if (!existingJob) throw new Error("Job not found");

  const featuredUpdate = existingJob.isFeatured
    ? { isFeatured: true, featuredUntil: existingJob.featuredUntil || new Date(Date.now() + 24 * 60 * 60 * 1000) }
    : { isFeatured: false, featuredUntil: null };

  // Update job — only job-level fields
  const jobResult = await db.collection(COLLECTIONS.JOBS).findOneAndUpdate(
    { _id: new ObjectId(jobId) },
    {
      $set: {
        isDraft: false,
        status: "open",
        updatedAt: new Date(),
        ...featuredUpdate
      }
    },
    { returnDocument: "after" }
  );

  const publishedJob = jobResult.value;

  // Fetch the payment record by orderId and update it
  const paymentRecord = await getPaymentByOrderId(db, razorpay_order_id);

  if (paymentRecord) {
    const escrowAmount = paymentRecord.payLater ? 0 : (payment.amount / 100) + (walletAmount || 0);
    await updatePaymentRecord(db, paymentRecord._id, {
      paymentId: razorpay_payment_id,
      paymentStatus: paymentRecord.payLater ? "pending_assignment" : "paid",
      paymentVerifiedAt: new Date(),
      escrowAmount,
      escrowStatus: paymentRecord.payLater ? "none" : "held",
      escrowReleased: 0,
    });
  }

  // Wallet deduction for split portion
  if (walletAmount > 0) {
    const walletRef = await db.collection(COLLECTIONS.WALLETS).findOneAndUpdate(
      {
        $or: [{ userId: existingJob.clientId }, { userId: existingJob.clientId.toString() }],
        balance: { $gte: walletAmount }
      },
      {
        $inc: { balance: -walletAmount },
        $set: { updatedAt: new Date() }
      },
      { returnDocument: "after" }
    );

    if (!walletRef.value) {
      console.error("❌ Wallet deduction failed AFTER Razorpay success! Requires manual adjustment.");
    } else {
      await db.collection(COLLECTIONS.WALLET_TRANSACTIONS).insertOne({
        userId: existingJob.clientId,
        type: "debit",
        category: "escrow_deposit",
        source: "wallet",
        amount: walletAmount,
        description: `Wallet portion for split payment: ${existingJob.title}`,
        jobId: new ObjectId(jobId),
        status: "completed",
        createdAt: new Date()
      });
    }
  }

  await db.collection(COLLECTIONS.TRANSACTIONS).insertOne({
    clientId: existingJob.clientId,
    jobId: new ObjectId(jobId),
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    amount: payment.amount / 100,
    currency: payment.currency,
    status: payment.status,
    method: "split_razorpay",
    createdAt: new Date()
  });

  notifyMatchingFreelancers(db, new ObjectId(jobId), publishedJob).catch((err) =>
    console.warn("⚠️ Recommended notifications failed:", err.message)
  );

  return {
    job: publishedJob,
    payment: {
      id: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: payment.amount / 100,
      status: payment.status,
      method: "split"
    }
  };
};

/* VERIFY PAYMENT AND PUBLISH JOB */
export const verifyPaymentAndPublishJob = async (paymentData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId } = paymentData;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new Error("Payment signature verification failed");
  }

  const payment = await razorpay.payments.fetch(razorpay_payment_id);
  if (payment.status !== "captured") throw new Error("Payment not captured");

  const existingJob = await db.collection(COLLECTIONS.JOBS).findOne({ _id: new ObjectId(jobId) });
  if (!existingJob) throw new Error("Job not found");

  const featuredUpdate = existingJob.isFeatured
    ? { isFeatured: true, featuredUntil: existingJob.featuredUntil || new Date(Date.now() + 24 * 60 * 60 * 1000) }
    : { isFeatured: false, featuredUntil: null };

  // Update job — only job-level fields
  const jobResult = await db.collection(COLLECTIONS.JOBS).findOneAndUpdate(
    { _id: new ObjectId(jobId) },
    {
      $set: {
        isDraft: false,
        status: "open",
        updatedAt: new Date(),
        ...featuredUpdate
      }
    },
    { returnDocument: "after" }
  );

  const publishedJob = jobResult.value;
  const amountPaid = payment.amount / 100;

  // Fetch the payment record by orderId and update it
  const paymentRecord = await getPaymentByOrderId(db, razorpay_order_id);

  if (paymentRecord) {
    await updatePaymentRecord(db, paymentRecord._id, {
      paymentId: razorpay_payment_id,
      paymentStatus: paymentRecord.payLater ? "pending_assignment" : "paid",
      paymentVerifiedAt: new Date(),
      escrowAmount: paymentRecord.payLater ? 0 : amountPaid,
      escrowStatus: paymentRecord.payLater ? "none" : "held",
      escrowReleased: 0,
    });
  }

  await db.collection(COLLECTIONS.TRANSACTIONS).insertOne({
    clientId: existingJob.clientId,
    jobId: new ObjectId(jobId),
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    amount: amountPaid,
    currency: payment.currency,
    status: payment.status,
    method: payment.method,
    createdAt: new Date()
  });

  notifyMatchingFreelancers(db, new ObjectId(jobId), publishedJob).catch((err) =>
    console.warn("⚠️ Recommended notifications failed:", err.message)
  );

  return {
    job: publishedJob,
    payment: {
      id: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount: amountPaid,
      status: payment.status,
      method: payment.method
    }
  };
};


async function notifyMatchingFreelancers(db, jobId, job) {
  try {
    const orConditions = [];

    if (job.skills && job.skills.length > 0) {
      orConditions.push({ skills: { $in: job.skills } });
    }

    if (job.category) {
      const categoryWords = job.category
        .split(/[\s&,]+/)
        .filter(w => w.length > 3);
      categoryWords.forEach(word => {
        orConditions.push({ title: { $regex: word, $options: "i" } });
      });
    }

    if (job.subCategory) {
      const subCatWord = job.subCategory.split(" ")[0];
      if (subCatWord.length > 3) {
        orConditions.push({ title: { $regex: subCatWord, $options: "i" } });
      }
    }

    if (job.title) {
      const titleWords = job.title
        .split(" ")
        .filter(w => w.length > 3);
      if (titleWords.length > 0) {
        orConditions.push({
          skills: { $in: titleWords.map(w => new RegExp(`^${w}$`, "i")) }
        });
      }
    }

    let matchingProfiles = [];

    if (orConditions.length > 0) {
      matchingProfiles = await db
        .collection(COLLECTIONS.PROFILES)
        .find(
          { role: "freelancer", $or: orConditions },
          { projection: { userId: 1 } }
        )
        .limit(50)
        .toArray();
    }

    if (matchingProfiles.length === 0) {
      console.log(`📭 No profile match for "${job.title}" — falling back to all freelancers`);

      const allFreelancers = await db
        .collection(COLLECTIONS.USERS)
        .find({ role: "freelancer" }, { projection: { _id: 1 } })
        .limit(50)
        .toArray();

      if (allFreelancers.length === 0) {
        console.log("📭 No freelancers found at all");
        return;
      }

      await Promise.allSettled(
        allFreelancers.map(user =>
          notifyRecommendedJob({
            recipientId: user._id.toString(),
            jobId: jobId.toString(),
            jobTitle: job.title,
            budget: job.budget,
          }).catch(err => console.warn(`Notify failed:`, err.message))
        )
      );
      return;
    }

    await Promise.allSettled(
      matchingProfiles.map(profile =>
        notifyRecommendedJob({
          recipientId: profile.userId.toString(),
          jobId: jobId.toString(),
          jobTitle: job.title,
          budget: job.budget,
        }).catch(err => console.warn(`Notify failed for ${profile.userId}:`, err.message))
      )
    );

    console.log(`✅ Done notifying for: "${job.title}"`);

  } catch (err) {
    console.error("notifyMatchingFreelancers error:", err.message);
    throw err;
  }
}

/* CREATE ESCROW PAYMENT ORDER (For Pay Later Jobs at Assignment) */
export const createEscrowPaymentOrder = async (clientId, jobId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const existingJob = await db.collection(COLLECTIONS.JOBS).findOne({ _id: new ObjectId(jobId) });
  if (!existingJob) throw new Error("Job not found");

  // Lookup the current payment record for this job
  const existingPayment = await getPaymentByJobId(db, jobId);
  if (!existingPayment || existingPayment.paymentStatus !== "pending_assignment") {
    throw new Error("Job is not awaiting escrow assignment");
  }

  if (existingJob.clientId?.toString() !== clientId.toString()) throw new Error("Unauthorized");

  const jobBudget = Number(existingJob.budget);
  const platformCommission = Math.round(jobBudget * 0.02 * 100) / 100;
  const totalAmount = jobBudget + platformCommission;
  const amountInPaise = Math.round(totalAmount * 100);

  const razorpayOrder = await razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: `escrow_${Date.now()}`,
    notes: { clientId: clientId.toString(), jobId: jobId.toString(), type: "escrow_assignment", totalAmount }
  });

  // Update the existing deferred payment record with escrow order details
  await updatePaymentRecord(db, existingPayment._id, {
    orderId: razorpayOrder.id,
    paymentType: "escrow",
    amount: totalAmount,
    platformCommission,
    featuredFee: 0,
    walletPart: 0,
    rzpPart: totalAmount,
  });

  return {
    orderId: razorpayOrder.id,
    amountInPaise,
    currency: "INR",
    jobBudget,
    platformCommission,
    totalAmount,
    jobId,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  };
};

/* VERIFY ESCROW PAYMENT */
export const verifyEscrowPayment = async (paymentData) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId } = paymentData;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new Error("Payment signature verification failed");
  }

  const payment = await razorpay.payments.fetch(razorpay_payment_id);
  if (payment.status !== "captured") throw new Error("Payment not captured");

  const amountPaidInRupees = payment.amount / 100;

  // Update job — only job-level status
  const jobResult = await db.collection(COLLECTIONS.JOBS).findOneAndUpdate(
    { _id: new ObjectId(jobId) },
    {
      $set: {
        status: "open",
        updatedAt: new Date(),
      }
    },
    { returnDocument: "after" }
  );

  if (!jobResult.value) throw new Error("Job not found");

  // Update payment record for this escrow transaction
  const paymentRecord = await getPaymentByOrderId(db, razorpay_order_id);
  if (paymentRecord) {
    await updatePaymentRecord(db, paymentRecord._id, {
      paymentId: razorpay_payment_id,
      paymentStatus: "escrow_funded",
      paymentVerifiedAt: new Date(),
      escrowAmount: amountPaidInRupees,
      escrowStatus: "held",
    });
  }

  await db.collection(COLLECTIONS.TRANSACTIONS).insertOne({
    clientId: jobResult.value.clientId,
    jobId: new ObjectId(jobId),
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    amount: amountPaidInRupees,
    currency: payment.currency,
    status: payment.status,
    method: payment.method,
    type: "escrow_assignment",
    createdAt: new Date()
  });

  return {
    job: jobResult.value,
    payment: {
      id: razorpay_payment_id,
      amount: amountPaidInRupees,
      status: payment.status
    }
  };
};

/* GET JOB PAYMENT STATUS — now reads from payments collection */
export const getJobPaymentStatus = async (jobId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const job = await db.collection(COLLECTIONS.JOBS).findOne({ _id: new ObjectId(jobId) });
  if (!job) throw new Error("Job not found");

  const paymentRecord = await getPaymentByJobId(db, jobId);

  return {
    jobId: job._id,
    paymentStatus: paymentRecord?.paymentStatus || "none",
    paymentOrderId: paymentRecord?.orderId || null,
    paymentId: paymentRecord?.paymentId || null,
    budget: job.budget,
    platformCommission: paymentRecord?.platformCommission || 0,
    totalAmount: paymentRecord?.amount || 0,
    escrowAmount: paymentRecord?.escrowAmount || 0,
    escrowStatus: paymentRecord?.escrowStatus || "none",
    status: job.status
  };
};

/* GET CLIENT'S FREE JOBS STATUS */
export const getClientJobsStatus = async (clientId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const clientObjId = new ObjectId(clientId);

  const totalPosted = await db.collection(COLLECTIONS.JOBS).countDocuments({
    $or: [{ clientId: clientObjId }, { clientId: clientId.toString() }],
    $and: [
      { $or: [{ isDraft: { $exists: false } }, { isDraft: false }] },
      { $or: [{ status: { $ne: "payment_pending" } }, { status: { $exists: false } }] }
    ]
  });

  const paidJobs = await db.collection(COLLECTIONS.PAYMENTS).countDocuments({
    clientId: clientObjId,
    paymentStatus: "paid"
  });

  const FREE_LIMIT = 5;

  return {
    totalJobsPosted: totalPosted,
    freeJobsUsed: 0,
    oldJobsWithoutStatus: 0,
    freeJobsRemaining: Math.max(0, FREE_LIMIT - totalPosted),
    paidJobs,
    needsPayment: totalPosted >= FREE_LIMIT
  };
};