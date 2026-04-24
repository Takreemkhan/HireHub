import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

const DEFAULT_PLANS = [
  { planKey: "plus", bitsTotal: 30, amountINR: 2499, label: "Plus" },
  { planKey: "premium", bitsTotal: 60, amountINR: 6999, label: "Premium" },
  { planKey: "free", bitsTotal: 10, amountINR: 0, label: "Free" },
];

/**
 * GET /api/client/membership/plan
 * Returns all client membership plans from DB.
 * Falls back to default plans if collection is empty.
 */
export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const plans = await db
      .collection(COLLECTIONS.CLIENT_PLAN)
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
    console.error("Client membership plan GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch plans", error: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/client/membership/plan
 * Body: { plans: [{ planKey, bitsTotal, amountINR, label }, ...] }
 * Upserts plans into DB.
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);

    const body = await req.json();
    const plans = body?.plans;

    if (!Array.isArray(plans) || plans.length === 0) {
      return NextResponse.json(
        { success: false, message: "Body must have a non-empty 'plans' array" },
        { status: 400 }
      );
    }

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
              "Each plan must have: planKey (string), connectsTotal (number), amountINR (number), label (string)",
          },
          { status: 400 }
        );
      }
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTIONS.CLIENT_PLAN);

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
    console.error("Client membership plan POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save plans", error: error.message },
      { status: 500 }
    );
  }
}