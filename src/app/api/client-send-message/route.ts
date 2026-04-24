import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { fromUserId, toUserId } = await req.json();
  console.log("toUserId", toUserId);
  console.log("fromUserId", fromUserId);
  const db = (await clientPromise).db();
  const chatRequests = db.collection("chat_requests");
  const users = db.collection("users");
  const chats = db.collection("chats");

  if (toUserId?.includes("@")) {
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

  // ✅ FIX: Check for BOTH pending and accepted — not just pending
  const existingRequest = await chatRequests.findOne({
    fromUserId,
    toUserId,
    status: { $in: ["pending", "accepted"] },
  });

  if (existingRequest) {
    return NextResponse.json({ message: "Request already sent" });
  }

  const resolveUser = async (idOrEmail: string) => {
    if (!idOrEmail) return null;
    const byEmail = await users.findOne({ email: idOrEmail.toLowerCase() });
    if (byEmail) return byEmail;
    try {
      if (ObjectId.isValid(idOrEmail)) {
        return await users.findOne({ _id: new ObjectId(idOrEmail) });
      }
    } catch (_) { }
    return null;
  };

  const [fromUser, toUser] = await Promise.all([
    resolveUser(fromUserId),
    resolveUser(toUserId),
  ]);

  if (!fromUser || !toUser) {
    return NextResponse.json(
      { error: "Could not resolve one or both participants." },
      { status: 400 }
    );
  }

  // ✅ FIX: Check if chat already exists BEFORE inserting a new request
  const existingChat = await chats.findOne({
    participants: { $all: [fromUser._id, toUser._id] },
  });

  if (existingChat) {
    return NextResponse.json({
      message: "Chat ready",
      chatId: existingChat._id.toString(),
      fromUserId: fromUser._id.toString(),
      fromUserName:
        fromUser.name ||
        fromUser.firstName ||
        fromUser.email?.split("@")[0] ||
        "User",
    });
  }

  // Only insert a new request if none exists
  await chatRequests.insertOne({
    fromUserId,
    toUserId,
    status: "accepted", // ✅ Insert directly as accepted — no need for pending→accepted flow
    createdAt: new Date(),
  });

  const chat = await chats.insertOne({
    participants: [fromUser._id, toUser._id],
    messages: [],
    createdAt: new Date(),
    lastMessageAt: new Date(),
    isActive: true,
  });

  return NextResponse.json({
    message: "Chat ready",
    chatId: chat.insertedId.toString(),
    fromUserId: fromUser._id.toString(),
    fromUserName:
      fromUser.name ||
      fromUser.firstName ||
      fromUser.email?.split("@")[0] ||
      "User",
  });
}