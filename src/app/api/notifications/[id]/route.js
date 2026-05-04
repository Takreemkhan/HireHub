/* PATCH  /api/notifications/[id]   - mark single notification as read
 * DELETE /api/notifications/[id]   - delete a single notification */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "notifications";

export async function PATCH(req, { params }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const result = await db.collection(COLLECTION).findOneAndUpdate(
            {
                _id: new ObjectId(id),
                recipientId: new ObjectId(session.user.id),
            },
            { $set: { isRead: true } },
            { returnDocument: "after" }
        );

        if (!result) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
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
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const result = await db.collection(COLLECTION).findOneAndDelete({

            _id: new ObjectId(id),
            recipientId: new ObjectId(session.user.id),
        });

        if (!result) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Notification deleted" });
    } catch (error) {
        console.error("DELETE /api/notifications/[id] error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
