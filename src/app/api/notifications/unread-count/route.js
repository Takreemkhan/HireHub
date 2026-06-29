import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth.middleware";
import { ObjectId } from "mongodb";
import { getOrSetCache } from "@/lib/redis";

const COLLECTION = "notifications";

export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
        }
        const userId = auth.userId;

        const count = await getOrSetCache(
            `api:notifications:unread:${userId}`,
            async () => {
                const client = await clientPromise;
                const db = client.db(DB_NAME);

                return await db.collection(COLLECTION).countDocuments({
                    recipientId: new ObjectId(userId),
                    isRead: false,
                });
            },
            300 // Cache for 5 minutes
        );

        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error("GET /api/notifications/unread-count error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
