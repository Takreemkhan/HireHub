import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";

/**
 * GET /api/admin/seed-plans
 * One-time seed: clears old plans and inserts Basic & Plus.
 * Remove or protect this route after first use.
 */
export async function GET() {
    const NEW_PLANS = [
        {
            planKey: "basic",
            planType: "basic",
            label: "Basic",
            description: "Free plan with essential bid features",
            isFree: true,
            price: 0,
            currency: "USD",
            bonusBids: 20,
            monthlyBids: 10,
            businessPages: 1,
            features: [
                "20 bonus bids (one-time on signup)",
                "10 bids refreshed every month",
                "1 business page",
            ],
            accentColor: "#1B365D",
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            planKey: "plus",
            planType: "plus",
            label: "Plus",
            description: "Everything you need to grow your freelance business",
            isFree: false,
            pricing: {
                monthly: { amountUSD: 25, bids: 30, billingCycle: "monthly" },
                yearly:  { amountUSD: 250, bids: 360, billingCycle: "yearly" },
            },
            businessPages: 5,
            features: [
                "Everything in Basic",
                "3 resume views with description",
                "Hide project budget publicly",
                "Email alerts for recommended jobs",
                "Send proposals to featured jobs",
                "5 business pages",
                "Featured listing placement",
                "AI-powered support",
            ],
            accentColor: "#FF6B35",
            popular: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];

    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const col = db.collection(COLLECTIONS.FREELANCER_PLAN);

        const deleteResult = await col.deleteMany({});
        const insertResult = await col.insertMany(NEW_PLANS);
        const plans = await col.find({}, { projection: { _id: 0 } }).toArray();

        return NextResponse.json({
            success: true,
            message: `Deleted ${deleteResult.deletedCount} old plans. Inserted ${insertResult.insertedCount} new plans.`,
            plans,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
