import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Helper — get best display name from a user document
function resolveName(user: any): string {
  if (!user) return "User";
  return (
    (user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : null) ||
    user.name ||
    user.firstName ||
    user.lastName ||
    user.email?.split("@")[0] ||
    "User"
  );
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  let userObjectId: ObjectId;
  try {
    userObjectId = new ObjectId(userId);
  } catch {
    return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const chats = db.collection("chats");
    const users = db.collection("users");
    const profile = db.collection("profiles");
    const userChats = await chats
      .find({ participants: userObjectId })
      .sort({ lastMessageAt: -1, createdAt: -1 })
      .toArray();

    const enrichedChats = await Promise.all(
      userChats.map(async (chat: any) => {

        const participantStrings: string[] = (chat.participants || []).map(
          (p: any) => p?.toString()
        );

        const otherIdStr =
          participantStrings.find((p) => p !== userId) || "";

        let otherUser: any = null;
        let otherName = "User";

        let roleCheck = null
        if (otherIdStr) {
          try {
            roleCheck = await users.findOne(
              { _id: new ObjectId(otherIdStr) },
              { projection: { name: 1, firstName: 1, lastName: 1, email: 1, role: 1 } }
            );

            otherName = resolveName(roleCheck);
          } catch (e) {
            console.error("Error fetching other user:", e);
          }
        }

        // console.log("otherIdStr", otherIdStr)
        // const profileUser = await profile.findOne({ userId: new ObjectId(otherIdStr) })
        if (otherIdStr) {
          try {
            otherUser = await users.findOne(
              { _id: new ObjectId(otherIdStr) },
              { projection: { name: 1, firstName: 1, lastName: 1, email: 1, role: 1 } }
            );

            otherName = resolveName(otherUser);
          } catch (e) {
            console.error("Error fetching other user:", e);
          }
        }

        let freelancerProfile: any = null;
        try {
          freelancerProfile = await profile.findOne(
            { userId: new ObjectId(otherIdStr) },
            {
              projection: {
                title: 1, name: 1, location: 1, "contact.email": 1, role: 1,
                profileImage: 1
              }
            }
          );

        } catch (error) {
          console.error("Error fetching other user:", error);
        }

        let recoveredJobId = chat.jobId || chat.assignedJob?.jobId;
        if (!recoveredJobId && otherIdStr) {
          try {
            // Find the most recent milestone between these two users
            const recentMilestone = await db.collection("milestones").findOne(
              {
                $or: [
                  { clientId: userObjectId, freelancerId: new ObjectId(otherIdStr) },
                  { clientId: new ObjectId(otherIdStr), freelancerId: userObjectId }
                ]
              },
              { sort: { createdAt: -1 }, projection: { jobId: 1 } }
            );
            if (recentMilestone) {
              recoveredJobId = recentMilestone.jobId;
            }
          } catch (e) {
            console.error("Project recovery failed for chat:", chat._id, e);
          }
        }

        let jobDetails: any = null;
        if (recoveredJobId) {
          try {
            // Handle both ObjectId and string jobId formats
            const jobQuery: any = { $or: [] };
            try { jobQuery.$or.push({ _id: new ObjectId(recoveredJobId.toString()) }); } catch { }
            jobQuery.$or.push({ _id: recoveredJobId });
            jobDetails = await db.collection("jobs").findOne(jobQuery, { projection: { title: 1, status: 1 } });
          } catch (e) {
            console.error("Error fetching job details:", e);
          }
        }

        return {
          ...chat,
          _id: chat._id?.toString(),
          participants: participantStrings,
          jobTitle: jobDetails?.title || null,
          jobStatus: jobDetails?.status || null,
          participantDetails: [
            {
              _id: otherIdStr,
              name: otherUser?.name || otherName || "",
              role: otherUser?.role || "",
              email: otherUser?.email || "",
              title: freelancerProfile?.title || "",
              location: freelancerProfile?.location || "",
              profileImage: freelancerProfile?.profileImage || "",
            },
          ],
        };
      })
    );

    return NextResponse.json({ chats: enrichedChats });

  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
  }
}