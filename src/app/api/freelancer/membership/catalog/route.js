import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const plusPlan = await db.collection(COLLECTIONS.FREELANCER_PLAN).findOne({ planKey: "plus" });
        const monthlyAmount = plusPlan?.pricing?.monthly?.amountUSD || 25;
        const monthlyBids = plusPlan?.pricing?.monthly?.bids || 30;

        return NextResponse.json({
            success: true,
            monthlyAmount,
            monthlyBids,
            exchangeRate: 83
        });
    } catch (error) {
        console.error("Bids catalog error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch bids catalog" },
            { status: 500 }
        );
    }
}
