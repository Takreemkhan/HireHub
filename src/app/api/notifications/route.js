/* GET  /api/notifications   - fetch notifications for logged-in user
  PUT  /api/notifications    - mark ALL as read */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth.middleware";
import { ObjectId } from "mongodb";
import { getOrSetCache, invalidateCache, invalidatePattern } from "@/lib/redis";

const COLLECTION = "notifications";

export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
        }
        const userId = auth.userId;

        const { searchParams } = new URL(req.url);
        const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
        const skip = parseInt(searchParams.get("skip") || "0");
        const unreadOnly = searchParams.get("unreadOnly") === "true";
        const type = searchParams.get("type");

        const cacheKey = `api:notifications:list:${userId}:${limit}:${skip}:${unreadOnly}:${type || "all"}`;

        const data = await getOrSetCache(
            cacheKey,
            async () => {
                const client = await clientPromise;
                const db = client.db(DB_NAME);

                // Build query
                const query = { recipientId: new ObjectId(userId) };
                if (unreadOnly) query.isRead = false;
                if (type) query.type = type;

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
                        recipientId: new ObjectId(userId),
                        isRead: false,
                    }),
                ]);

                return {
                    notifications,
                    totalUnread,
                };
            },
            60 // Cache for 1 minute (notifications are relatively volatile, keep TTL small)
        );

        return NextResponse.json({
            success: true,
            notifications: data.notifications,
            totalUnread: data.totalUnread,
            pagination: { limit, skip },
        });
    } catch (error) {
        console.error("GET /api/notifications error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
        }
        const userId = auth.userId;

        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get("chatId");

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const query = { recipientId: new ObjectId(userId), isRead: false };
        if (chatId) {
            query["meta.chatId"] = new ObjectId(chatId);
            query.type = "message";
        }

        await db.collection(COLLECTION).updateMany(
            query,
            { $set: { isRead: true } }
        );

        // Invalidate notifications cache for this user
        await invalidateCache([`api:notifications:unread:${userId}`]);
        await invalidatePattern(`api:notifications:list:${userId}:*`);

        return NextResponse.json({ success: true, message: chatId ? "Chat notifications marked as read" : "All notifications marked as read" });
    } catch (error) {
        console.error("PUT /api/notifications error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
