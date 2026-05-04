import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  const { requestId } = await req.json();

  // ✅ FIX: Use the correct DB name (freelancehub) — not the default
  const db = (await clientPromise).db(DB_NAME);
  const chatRequests = db.collection("chat_requests");
  const chats = db.collection("chats");
  const users = db.collection("users");
  console.log("requestId", requestId);
  const request = await chatRequests.findOne({
    _id: new ObjectId(requestId),
    status: "pending",
  });
  if (!request) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  // ✅ FIX: Resolve email/id strings to actual User documents so we store
  // ObjectIds in participants (chat/list queries by ObjectId)
  const resolveUser = async (idOrEmail: string) => {
    if (!idOrEmail) return null;
    // 1. Try email lookup first (chat_requests stores emails)
    const byEmail = await users.findOne({ email: idOrEmail.toLowerCase() });
    if (byEmail) return byEmail;
    // 2. Try ObjectId lookup as fallback
    try {
      if (ObjectId.isValid(idOrEmail)) {
        return await users.findOne({ _id: new ObjectId(idOrEmail) });
      }
    } catch (_) { }
    return null;
  };

  const [fromUser, toUser] = await Promise.all([
    resolveUser(request.fromUserId),
    resolveUser(request.toUserId),
  ]);

  if (!fromUser || !toUser) {
    return NextResponse.json(
      { error: "Could not resolve one or both participants" },
      { status: 400 }
    );
  }

  // Mark request as accepted
  await chatRequests.updateOne(
    { _id: request._id },
    { $set: { status: "accepted" } }
  );

  // ✅ FIX: Check if a chat already exists between these two users
  const existing = await chats.findOne({
    participants: { $all: [fromUser._id, toUser._id] },
  });

  if (existing) {
    return NextResponse.json({
      message: "Chat already exists",
      chatId: existing._id.toString(),
      fromUserId: fromUser._id.toString(),
      fromUserName:
        fromUser.name ||
        fromUser.firstName ||
        fromUser.email?.split("@")[0] ||
        "User",
    });
  }

  // ✅ FIX: Store participants as ObjectIds so /api/chat/list can find them
  const chat = await chats.insertOne({
    participants: [fromUser._id, toUser._id],
    messages: [],
    createdAt: new Date(),
    lastMessageAt: new Date(),
    isActive: true,
  });

  return NextResponse.json({
    message: "Chat accepted",
    chatId: chat.insertedId.toString(),
    // Return sender info so frontend can display name immediately
    fromUserId: fromUser._id.toString(),
    fromUserName:
      fromUser.name ||
      fromUser.firstName ||
      fromUser.email?.split("@")[0] ||
      "User",
  });
}