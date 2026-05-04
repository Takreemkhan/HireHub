
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import crypto from "crypto";


/*  JOB SHARING (with Chat Integration)   */


/*  Convert to ObjectId */
const toObjectId = (id) => {
  if (!id) return null;
  if (typeof id === 'string') return new ObjectId(id);
  return id;
};

/* SHARE JOB VIA MESSAGE - Direct to Freelancer (Creates chat message) */
export const shareJobViaMessage = async (jobId, clientId, freelancerId, message) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const jobObjId = toObjectId(jobId);
  const clientObjId = toObjectId(clientId);
  const freelancerObjId = toObjectId(freelancerId);

  // Verify job exists and belongs to client
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: jobObjId,
    clientId: clientId 
  });
  

  if (!job) {
    throw new Error("Job not found or you don't have permission");
  }

  // Verify freelancer exists
  const freelancer = await db.collection(COLLECTIONS.USERS).findOne({
    _id: freelancerObjId,
    role: "freelancer"
  });

  if (!freelancer) {
    throw new Error("Freelancer not found");
  }

 
  const shareData = {
    jobId: jobObjId,
    clientId: clientObjId,
    freelancerId: freelancerObjId,
    shareType: "direct_message",
    message: message || `Check out this job opportunity: ${job.title}`,
    isActive: true,
    isRead: false,
    sharedAt: new Date()
  };

  const shareResult = await db.collection(COLLECTIONS.JOB_SHARES).insertOne(shareData);

  
  let chat = await db.collection(COLLECTIONS.CHATS).findOne({
    participants: { $all: [clientObjId, freelancerObjId] }
    
  });

  if (!chat) {
    // Create new chat
    const chatData = {
      participants: [clientObjId, freelancerObjId],
      messages: [],
      lastMessage: null,
      lastMessageAt: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const chatResult = await db.collection(COLLECTIONS.CHATS).insertOne(chatData);
    chat = { _id: chatResult.insertedId, ...chatData };
  }

  
  const chatMessage = {
    _id: new ObjectId(),
    senderId: clientObjId,
    receiverId: freelancerObjId,
    content: message || `I'd like to share this job opportunity with you: ${job.title}`,
    messageType: "job_share",  
    jobId: jobObjId,
    isRead: false,
    timestamp: new Date()
  };

  await db.collection(COLLECTIONS.CHATS).updateOne(
    { _id: chat._id },
    {
      $push: { messages: chatMessage },
      $set: {
        lastMessage: message || `Shared a job: ${job.title}`,
        lastMessageAt: new Date(),
        updatedAt: new Date()
      }
    }
  );

  return {
    shareId: shareResult.insertedId,
    jobTitle: job.title,
    freelancerName: freelancer.name,
    shareType: "direct_message",
    sharedAt: shareData.sharedAt,
    chatId: chat._id
  };
};

/* GENERATE PUBLIC SHARE LINK */
export const generatePublicShareLink = async (jobId, clientId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const jobObjId = toObjectId(jobId);
  const clientObjId = toObjectId(clientId);

  // Verify job exists and belongs to client
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: jobObjId,
    // clientId: clientObjId
     clientId: clientId 
  });

  if (!job) {
    throw new Error("Job not found or you don't have permission");
  }

  // Check if job is not draft
  if (job.isDraft || job.status === "draft") {
    throw new Error("Cannot share draft jobs. Please publish first.");
  }

  // Generate unique share token
  const shareToken = crypto.randomBytes(16).toString('hex');

  // Check if share already exists
  const existingShare = await db.collection(COLLECTIONS.JOB_SHARES).findOne({
    jobId: jobObjId,
    shareType: "public_link",
    isActive: true
  });

  let shareId;
  let token;

  if (existingShare) {
    // Return existing share link
    shareId = existingShare._id;
    token = existingShare.shareToken;
  } else {
    // Create new share
    const shareData = {
      jobId: jobObjId,
      clientId: clientObjId,
      shareToken: shareToken,
      shareType: "public_link",
      isActive: true,
      viewCount: 0,
      sharedAt: new Date(),
      expiresAt: null  // Public links don't expire
    };

    const result = await db.collection(COLLECTIONS.JOB_SHARES).insertOne(shareData);
    shareId = result.insertedId;
    token = shareToken;
  }

  // Generate public URL
  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/jobs/share/${token}`;

  return {
    shareId,
    shareToken: token,
    publicUrl,
    jobTitle: job.title,
    shareType: "public_link",
    createdAt: existingShare?.sharedAt || new Date()
  };
};

/* GET JOB BY SHARE TOKEN (Public access - NO AUTH) */
export const getJobByShareToken = async (shareToken) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Find share record
  const share = await db.collection(COLLECTIONS.JOB_SHARES).findOne({
    shareToken: shareToken,
    shareType: "public_link",
    isActive: true
  });

  if (!share) {
    throw new Error("Invalid or expired share link");
  }

  // Get job details
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: toObjectId(share.jobId),
    status: { $ne: "draft" }
  });

  if (!job) {
    throw new Error("Job not found or no longer available");
  }

  // Get client info
  const clientUser = await db.collection(COLLECTIONS.USERS).findOne({
    _id: toObjectId(job.clientId)
  });

  // Increment view count
  await db.collection(COLLECTIONS.JOB_SHARES).updateOne(
    { _id: share._id },
    { 
      $inc: { viewCount: 1 },
      $set: { lastViewedAt: new Date() }
    }
  );

  return {
    job,
    clientInfo: {
      name: clientUser?.name || "Anonymous",
      rating: clientUser?.rating || 0,
      memberSince: clientUser?.createdAt
    },
    shareInfo: {
      viewCount: share.viewCount + 1,
      sharedAt: share.sharedAt
    }
  };
};

/* GET ALL SHARES FOR A JOB */
export const getJobShares = async (jobId, clientId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const jobObjId = toObjectId(jobId);
  const clientObjId = toObjectId(clientId);

  // Verify job belongs to client
  const job = await db.collection(COLLECTIONS.JOBS).findOne({
    _id: jobObjId,
    clientId: clientObjId
  });

  if (!job) {
    throw new Error("Job not found or you don't have permission");
  }

  // Get all shares for this job
  const shares = await db.collection(COLLECTIONS.JOB_SHARES)
    .find({ 
      jobId: jobObjId,
      isActive: true
    })
    .sort({ sharedAt: -1 })
    .toArray();

  // Enhance shares with freelancer info for direct shares
  const enhancedShares = await Promise.all(
    shares.map(async (share) => {
      if (share.shareType === "direct_message" && share.freelancerId) {
        const freelancer = await db.collection(COLLECTIONS.USERS).findOne({
          _id: toObjectId(share.freelancerId)
        });

        return {
          ...share,
          freelancerInfo: {
            name: freelancer?.name,
            email: freelancer?.email
          }
        };
      }

      if (share.shareType === "public_link") {
        return {
          ...share,
          publicUrl: `${process.env.NEXT_PUBLIC_APP_URL || ''}/jobs/share/${share.shareToken}`
        };
      }

      return share;
    })
  );

  return {
    jobTitle: job.title,
    shares: enhancedShares,
    total: enhancedShares.length,
    publicLinkCount: enhancedShares.filter(s => s.shareType === "public_link").length,
    directMessageCount: enhancedShares.filter(s => s.shareType === "direct_message").length
  };
};

/* DEACTIVATE SHARE LINK */
export const deactivateShareLink = async (shareId, clientId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const clientObjId = toObjectId(clientId);

  // Verify share belongs to client
  const share = await db.collection(COLLECTIONS.JOB_SHARES).findOne({
    _id: new ObjectId(shareId),
    clientId: clientObjId
  });

  if (!share) {
    throw new Error("Share not found or you don't have permission");
  }

  // Deactivate share
  await db.collection(COLLECTIONS.JOB_SHARES).updateOne(
    { _id: new ObjectId(shareId) },
    { 
      $set: { 
        isActive: false,
        deactivatedAt: new Date()
      } 
    }
  );

  return { success: true };
};

/* GET CHAT WITH JOB SHARE MESSAGES */
export const getChatWithJobShares = async (userId, otherUserId) => {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  console.log("Logged In User:", userId);
console.log("Other User:", otherUserId);

  //const userObjId = toObjectId(userId);
  //const otherUserObjId = toObjectId(otherUserId);

  const chat = await db.collection(COLLECTIONS.CHATS).findOne({
    participants: { $all: [userId, otherUserId] }
  });

  if (!chat) {
    return null;
  }

  // Enhance messages with job details for job_share type
  const enhancedMessages = await Promise.all(
    chat.messages.map(async (msg) => {
      if (msg.messageType === "job_share" && msg.jobId) {
        const jobId = toObjectId(msg.jobId);
        const job = await db.collection(COLLECTIONS.JOBS).findOne({ _id: jobId });

        return {
          ...msg,
          jobDetails: job ? {
            _id: job._id,
            title: job.title,
            budget: job.budget,
            category: job.category,
            description: job.description,
            status: job.status,
            projectDuration: job.projectDuration
          } : null
        };
      }
      return msg;
    })
  );

  return {
    ...chat,
    messages: enhancedMessages
  };
};