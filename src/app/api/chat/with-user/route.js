import { NextResponse } from "next/server";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const toObjId = (id) => {
  try {
    return typeof id === 'string' ? new ObjectId(id) : id;
  } catch {
    return id;
  }
};

/**
 * GET - Find a chat between two users, optionally filtered by jobId
 */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const { searchParams } = new URL(req.url);
    const otherUserId = searchParams.get("otherUserId");
    const jobId = searchParams.get("jobId");

    if (!otherUserId) {
      return NextResponse.json({ success: false, message: "otherUserId is required" }, { status: 400 });
    }

    const db = (await clientPromise).db(DB_NAME);
    const chats = db.collection(COLLECTIONS.CHATS);
    const myId = auth.userId;

    const query = {
      $or: [
        { participants: { $all: [toObjId(myId), toObjId(otherUserId)] } },
        { participants: { $all: [myId, otherUserId] } },
        { participants: { $all: [toObjId(myId), otherUserId] } },
        { participants: { $all: [myId, toObjId(otherUserId)] } },
      ]
    };

    if (jobId) {
      query.jobId = toObjId(jobId);
    } else {
      query.jobId = { $exists: false };
    }

    const chat = await chats.findOne(query);

    if (!chat) {
      return NextResponse.json({ success: true, message: "No chat found", chat: null }, { status: 200 });
    }

    return NextResponse.json({ success: true, chat }, { status: 200 });

  } catch (error) {
    console.error("Get Chat error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch chat", error: error.message }, { status: 500 });
  }
}

/**
 * POST - Find or Create a chat between two users, optionally linked to a jobId
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const body = await req.json();
    const { otherUserId, jobId } = body;

    if (!otherUserId) {
      return NextResponse.json({ success: false, message: "otherUserId is required" }, { status: 400 });
    }

    const db = (await clientPromise).db(DB_NAME);
    const chats = db.collection(COLLECTIONS.CHATS);
    const myId = auth.userId;

    const query = {
      $or: [
        { participants: { $all: [toObjId(myId), toObjId(otherUserId)] } },
        { participants: { $all: [myId, otherUserId] } },
        { participants: { $all: [toObjId(myId), otherUserId] } },
        { participants: { $all: [myId, toObjId(otherUserId)] } },
      ]
    };

    if (jobId) {
      query.jobId = toObjId(jobId);
    } else {
      query.jobId = { $exists: false };
    }

    const existing = await chats.findOne(query);

    if (existing) {
      return NextResponse.json({
        success: true,
        chatId: existing._id.toString(),
        chat: { ...existing, _id: existing._id.toString() },
        created: false,
      });
    }

    const now = new Date();
    const newChat = {
      participants: [toObjId(myId), toObjId(otherUserId)],
      messages: [],
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
    };

    if (jobId) {
      newChat.jobId = toObjId(jobId);
    }

    const result = await chats.insertOne(newChat);

    return NextResponse.json({
      success: true,
      chatId: result.insertedId.toString(),
      chat: { ...newChat, _id: result.insertedId.toString() },
      created: true,
    });

  } catch (error) {
    console.error("Create Chat error:", error);
    return NextResponse.json({ success: false, message: "Failed to create chat", error: error.message }, { status: 500 });
  }
}