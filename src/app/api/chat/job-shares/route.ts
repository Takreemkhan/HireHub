// src/app/api/chat/job-shares/route.ts
import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/* GET - Get all job shares received by user
  Route: /api/chat/job-shares
 */
export async function GET(req: Request) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const db = (await clientPromise).db(DB_NAME);
    const chats = db.collection(COLLECTIONS.CHATS);
    const jobs = db.collection(COLLECTIONS.JOBS);
    const users = db.collection(COLLECTIONS.USERS);

    // Find all chats where user is a participant

    if (!auth.userId) {
  return unauthorizedResponse("Invalid user");
}

const userObjectId = new ObjectId(auth.userId);

const userChats = await chats.find({
  participants: userObjectId
}).toArray();

    // Extract job share messages
    const jobShares: any[] = [];

    for (const chat of userChats) {
      const messages = chat.messages || [];
      
      for (const msg of messages) {
        // Check if it's a job share message sent TO this user
        if (
          msg.messageType === "job_share" && 
          msg.jobId &&
          msg.receiverId?.toString() === auth.userId
        ) {
          // Get job details
          const job = await jobs.findOne({ _id: new ObjectId(msg.jobId) });
          
          // Get sender details
          const sender = await users.findOne({ _id: new ObjectId(msg.senderId) });

          if (job) {
            jobShares.push({
              _id: msg._id,
              chatId: chat._id,
              message: msg.content,
              timestamp: msg.timestamp,
              isRead: msg.isRead || false,
              
              job: {
                _id: job._id,
                title: job.title,
                category: job.category,
                subCategory: job.subCategory,
                budget: job.budget,
                projectDuration: job.projectDuration,
                status: job.status,
                description: job.description
              },
              
              sharedBy: {
                _id: sender?._id,
                name: sender?.name || "Unknown",
                email: sender?.email,
                image: sender?.image
              }
            });
          }
        }
      }
    }

    // Sort by most recent first
    jobShares.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return NextResponse.json({
      success: true,
      jobShares,
      total: jobShares.length
    });

  } catch (error) {
    console.error("Error fetching job shares:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch job shares" 
      }, 
      { status: 500 }
    );
  }
}