import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        const db = (await clientPromise).db(DB_NAME);
        const id = params.id;

        const chats = await db
            .collection(COLLECTIONS.CHATS)
            .find({})
            .toArray(); // ✅ IMPORTANT

        return NextResponse.json({
            success: true,
            count: chats.length,
            data: chats,
            userOtherId: id,
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Error fetching chats",
                error: error.message,
            },
            { status: 500 }
        );
    }
}