import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/freelancer/plans/invoice
 * Returns payment history: Plus plan purchases + bid pack top-ups.
 */
export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const userId = new ObjectId(auth.userId);

        // Plus plan purchase history (new plan_purchases collection)
        const planPurchases = await db
            .collection("plan_purchases")
            .find({ userId })
            .sort({ purchasedAt: -1 })
            .limit(20)
            .toArray();

        // Legacy: resume_video plan subscription record (backward compat)
        const legacySub = await db
            .collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS)
            .findOne({ freelancerId: auth.userId });

        // Bid pack top-up history
        const bidPurchases = await db
            .collection("bid_purchases")
            .find({ userId })
            .sort({ purchasedAt: -1 })
            .limit(20)
            .toArray();

        const invoices = [
            // New plan_purchases entries (Plus plan payments)
            ...planPurchases.map(p => ({
                type: "plus_plan",
                label: `${p.planLabel} Plan – ${p.billingCycle === "yearly" ? "Yearly" : "Monthly"}`,
                amountUSD: p.amountUSD,
                bids: p.bids,
                orderId: p.orderId,
                paymentId: p.paymentId,
                purchasedAt: p.purchasedAt,
                planExpiry: p.planExpiry,
            })),
            // Legacy subscription record (if it exists and has an orderId — i.e. was paid)
            ...(legacySub?.orderId && !planPurchases.some(p => p.orderId === legacySub.orderId)
                ? [{
                    type: "plus_plan",
                    label: `${legacySub.planLabel ?? "Plus"} Plan`,
                    orderId: legacySub.orderId,
                    paymentId: legacySub.paymentId,
                    purchasedAt: legacySub.planStartDate,
                    planExpiry: legacySub.planExpiry,
                }]
                : []),
            // Bid pack top-up purchases
            ...bidPurchases.map(p => ({
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
