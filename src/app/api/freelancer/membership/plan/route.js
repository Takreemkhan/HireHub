import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

const DEFAULT_PLANS = [
    { planKey: "plus", bitsTotal: 30, amountINR: 1999, label: "Plus" },
    { planKey: "premium", bitsTotal: 50, amountINR: 4999, label: "Premium" },
];

/**
 * GET /api/freelancer/membership/plan
 * Returns all membership plans from DB.
 * Falls back to default plans if collection is empty.
 */
export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const plans = await db
            .collection(COLLECTIONS.FREELANCER_PLAN)
            .find({}, { projection: { _id: 0 } })
            .toArray();

        if (!plans || plans.length === 0) {
            return NextResponse.json(
                { success: true, plans: DEFAULT_PLANS, source: "default" },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: true, plans, source: "db" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Membership plan GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch plans", error: error.message },
            { status: 500 }
        );
    }
}

/**
 * POST /api/freelancer/membership/plan
 * Body: { plans: [{ planKey, bitsTotal, amountINR, label }, ...] }
 * Upserts plans into DB. Existing plans with same planKey are replaced.
 * Protected: Only authenticated admins should call this in production.
 */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        // if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const body = await req.json();
        const plans = body?.plans;

        if (!Array.isArray(plans) || plans.length === 0) {
            return NextResponse.json(
                { success: false, message: "Body must have a non-empty 'plans' array" },
                { status: 400 }
            );
        }

        // Validate each plan entry
        for (const plan of plans) {
            if (
                !plan.planKey ||
                typeof plan.bitsTotal !== "number" ||
                typeof plan.amountINR !== "number" ||
                !plan.label
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Each plan must have: planKey (string), bitsTotal (number), amountINR (number), label (string)",
                    },
                    { status: 400 }
                );
            }
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTIONS.FREELANCER_PLAN);

        // Upsert each plan by planKey
        const bulkOps = plans.map((plan) => ({
            updateOne: {
                filter: { planKey: plan.planKey.toLowerCase() },
                update: {
                    $set: {
                        planKey: plan.planKey.toLowerCase(),
                        bitsTotal: plan.bitsTotal,
                        amountINR: plan.amountINR,
                        label: plan.label,
                        updatedAt: new Date(),
                    },
                    $setOnInsert: { createdAt: new Date() },
                },
                upsert: true,
            },
        }));

        const result = await collection.bulkWrite(bulkOps);

        return NextResponse.json(
            {
                success: true,
                message: "Plans saved successfully",
                upsertedCount: result.upsertedCount,
                modifiedCount: result.modifiedCount,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Membership plan POST error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to save plans", error: error.message },
            { status: 500 }
        );
    }
}