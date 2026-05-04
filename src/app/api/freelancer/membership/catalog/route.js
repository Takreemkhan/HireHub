import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const bidPacks = await db.collection(COLLECTIONS.BIDS).find({}).sort({ amountINR: 1 }).toArray();

        return NextResponse.json({
            success: true,
            bidPacks: bidPacks
        });
    } catch (error) {
        console.error("Bids catalog error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch bids catalog" },
            { status: 500 }
        );
    }
}
