import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function POST(req: Request) {
  const { fromUserId, toUserId } = await req.json();
  console.log("check msg")
  const db = (await clientPromise).db();
  const chatRequests = db.collection("chat_requests");
  const users = db.collection("users");
  const { userID } = await req.json();
  console.log("re send req", userID)
  if (toUserId && toUserId.includes("@")) {
    const receiverUser = await users.findOne({ email: toUserId.toLowerCase() });
    if (!receiverUser) {
      return NextResponse.json(
        { error: `"${toUserId}" se koi user nahi mila. Email dobara check karo.` },
        { status: 404 }
      );
    }
  }

  if (fromUserId === toUserId) {
    return NextResponse.json(
      { error: "Aap khud ko request nahi bhej sakte" },
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