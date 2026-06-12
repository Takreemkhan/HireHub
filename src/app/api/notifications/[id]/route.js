import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth.middleware";
import { ObjectId } from "mongodb";
import { invalidateCache, redis } from "@/lib/redis";

const COLLECTION = "notifications";

export async function PATCH(req, { params }) {
    const { id } = await params;
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
        }
        const userId = auth.userId;

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const result = await db.collection(COLLECTION).findOneAndUpdate(
            {
                _id: new ObjectId(id),
                recipientId: new ObjectId(userId),
            },
            { $set: { isRead: true } },
            { returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        // Invalidate caches
        await invalidateCache([`api:notifications:unread:${userId}`]);
        if (redis) {
            const keys = await redis.keys(`api:notifications:list:${userId}:*`);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        }

        return NextResponse.json({ success: true, notification: result });
    } catch (error) {
        console.error("PATCH /api/notifications/[id] error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = await params;
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) {
            return NextResponse.json({ error: auth.error || "Unauthorized" }, { status: 401 });
        }
        const userId = auth.userId;

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const result = await db.collection(COLLECTION).findOneAndDelete({
            _id: new ObjectId(id),
            recipientId: new ObjectId(userId),
        });

        if (!result) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        // Invalidate caches
        await invalidateCache([`api:notifications:unread:${userId}`]);
        if (redis) {
            const keys = await redis.keys(`api:notifications:list:${userId}:*`);
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        }

        return NextResponse.json({ success: true, message: "Notification deleted" });
    } catch (error) {
        console.error("DELETE /api/notifications/[id] error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
