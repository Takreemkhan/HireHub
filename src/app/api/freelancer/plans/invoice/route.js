import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/freelancer/plans/invoice
 * Returns the bid purchase history for the logged-in freelancer.
 * Also includes resume video plan payment history.
 */
export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const userId = new ObjectId(auth.userId);

        // Bid purchase history
        const bidPurchases = await db
            .collection("bid_purchases")
            .find({ userId })
            .sort({ purchasedAt: -1 })
            .limit(20)
            .toArray();

        // Resume video plan subscription (single record per user)
        const videoSub = await db
            .collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS)
            .findOne({ freelancerId: auth.userId });

        const invoices = [
            // Video plan as invoice entry if it exists
            ...(videoSub?.orderId
                ? [
                    {
                        type: "resume_video_plan",
                        label: `${videoSub.planLabel} Plan – Resume Video`,
                        amountINR: videoSub.planKey === "basic" ? 499 : videoSub.planKey === "pro" ? 999 : 1999,
                        orderId: videoSub.orderId,
                        paymentId: videoSub.paymentId,
                        purchasedAt: videoSub.planStartDate,
                        planExpiry: videoSub.planExpiry,
                    },
                ]
                : []),
            // Bid pack purchases
            ...bidPurchases.map((p) => ({
                type: "bid_pack",
                label: p.packLabel || `${p.bidsAdded} Bids`,
                bidsAdded: p.bidsAdded,
                orderId: p.orderId,
                paymentId: p.paymentId,
                purchasedAt: p.purchasedAt,
            })),
        ].sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt));

        return NextResponse.json({ success: true, invoices });
    } catch (error) {
        console.error("Invoice GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch invoices", error: error.message },
            { status: 500 }
        );
    }
}
