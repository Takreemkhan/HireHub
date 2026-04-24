/* GET  /api/notifications   - fetch notifications for logged-in user
  PUT  /api/notifications    - mark ALL as read */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "notifications";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
        const skip = parseInt(searchParams.get("skip") || "0");
        const unreadOnly = searchParams.get("unreadOnly") === "true";
        const type = searchParams.get("type");

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        console.log(type)
        // Build query
        const query = { recipientId: new ObjectId(session.user.id) };
        if (unreadOnly) query.isRead = false;
        if (type) query.type = type;

        // Run both queries in parallel
        const [notifications, totalUnread] = await Promise.all([
            db.collection(COLLECTION)
                .aggregate([
                    { $match: query },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    // Populate sender info (name, image, role)
                    {
                        $lookup: {
                            from: "users",
                            localField: "senderId",
                            foreignField: "_id",
                            as: "senderInfo",
                            pipeline: [
                                { $project: { name: 1, image: 1, role: 1 } }
                            ],
                        },
                    },
                    {
                        $addFields: {
                            senderId: { $arrayElemAt: ["$senderInfo", 0] },
                        },
                    },
                    { $unset: "senderInfo" },
                ])
                .toArray(),

            db.collection(COLLECTION).countDocuments({
                recipientId: new ObjectId(session.user.id),
                isRead: false,
            }),
        ]);

        return NextResponse.json({
            success: true,
            notifications,
            totalUnread,
            pagination: { limit, skip },
        });
    } catch (error) {
        console.error("GET /api/notifications error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get("chatId");

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const query = { recipientId: new ObjectId(session.user.id), isRead: false };
        if (chatId) {
            query["meta.chatId"] = new ObjectId(chatId);
            query.type = "message";
        }

        await db.collection(COLLECTION).updateMany(
            query,
            { $set: { isRead: true } }
        );

        return NextResponse.json({ success: true, message: chatId ? "Chat notifications marked as read" : "All notifications marked as read" });
    } catch (error) {
        console.error("PUT /api/notifications error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
