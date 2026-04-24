import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId"); // ObjectId

  if (!userId) {
    return NextResponse.json({ requests: [] });
  }

  const db = (await clientPromise).db();
  const chatRequests = db.collection("chat_requests");
  const users = db.collection("users");

  // userId (ObjectId) with user current email
  let userEmail: string | null = null;
  if (!userId.includes("@")) {
    try {
      const user = await users.findOne({ _id: new ObjectId(userId) });
      userEmail = user?.email || null;
    } catch (_) { }
  } else {
    userEmail = userId;
  }

  if (!userEmail) {
    return NextResponse.json({ requests: [] });
  }


  // pending requests
  const requests = await chatRequests
    .find({ toUserId: userEmail, status: "pending" })
    .sort({ createdAt: -1 })
    .toArray();

  // fromUserId ObjectId  with user email

  const enriched = await Promise.all(
    requests.map(async (r: any) => {
      let fromEmail = r.fromUserId;



      if (r.fromUserId && !r.fromUserId.includes("@")) {
        try {
          const sender = await users.findOne({ _id: new ObjectId(r.fromUserId) });
          if (sender?.email) {
            fromEmail = sender.email; // e.g. "infotech4793@gmail.com"
          }
        } catch (_) { }
      }

      return {
        ...r,
        fromUserId: fromEmail, // ✅ ObjectId ki jagah email
      };
    })
  );

  return NextResponse.json({ requests: enriched });
}

export async function POST(req: Request) {
  const { fromUserId, toUserId } = await req.json();
  const db = (await clientPromise).db();
  const chatRequests = db.collection("chat_requests");
  const users = db.collection("users");
  console.log("re send req", req)
  if (toUserId && toUserId.includes("@")) {
    const receiverUser = await users.findOne({ email: toUserId.toLowerCase() });
    if (!receiverUser) {
      return NextResponse.json(
        { error: `No user found with "${toUserId}". Please check the email and try again.` },
        { status: 404 }
      );
    }
  }

  if (fromUserId === toUserId) {
    return NextResponse.json(
      { error: "You cannot send a request to yourself." },
      { status: 400 }
    );
  }

  const existing = await chatRequests.findOne({
    fromUserId,
    toUserId,
    status: "pending",
  });

  if (existing) {
    return NextResponse.json({ message: "Request already sent" });
  }

  const result = await chatRequests.insertOne({
    fromUserId,
    toUserId,
    status: "pending",
    createdAt: new Date(),
  });

  return NextResponse.json({
    message: "Request sent",
    requestId: result.insertedId.toString(),
  });
}