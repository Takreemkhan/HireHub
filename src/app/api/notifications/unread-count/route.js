/* GET /api/notifications/unread-count */

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

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const count = await db.collection(COLLECTION).countDocuments({
            recipientId: new ObjectId(session.user.id),
            isRead: false,
        });

        return NextResponse.json({ success: true, count });
    } catch (error) {
        console.error("GET /api/notifications/unread-count error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
