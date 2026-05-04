import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Fallback hardcoded config if DB is empty
const DEFAULT_PLAN_CONFIG = {
  plus: { bitsTotal: 30, amountINR: 1999, label: "Plus" },
  premium: { bitsTotal: 50, amountINR: 4999, label: "Premium" },
};

async function getPlanConfig() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const plans = await db
      .collection(COLLECTIONS.CLIENT_PLAN)
      .find({}, { projection: { _id: 0 } })
      .toArray();

    if (!plans || plans.length === 0) return DEFAULT_PLAN_CONFIG;

    return plans.reduce((acc, plan) => {
      acc[plan.planKey] = {
        connectsTotal: plan.connectsTotal,
        amountINR: plan.amountINR,
        label: plan.label,
      };
      return acc;
    }, {});
  } catch (error) {
    console.warn("Could not fetch client plan config from DB, using default:", error.message);
    return DEFAULT_PLAN_CONFIG;
  }
}

/**
 * POST /api/client/membership/create-order
 * Body: { plan: 'plus' | 'premium' }
 * Creates a Razorpay order for client membership upgrade.
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);
    console.log("client membership create order ")
    const { plan } = await req.json();

    if (!plan) {
      return NextResponse.json(
        { success: false, message: "Plan is required" },
        { status: 400 }
      );
    }

    const planKey = plan.toLowerCase();
    const PLAN_CONFIG = await getPlanConfig();

    if (!PLAN_CONFIG[planKey]) {
      const validPlans = Object.keys(PLAN_CONFIG).join(", ");
      return NextResponse.json(
        { success: false, message: `Invalid plan. Valid options are: ${validPlans}` },
        { status: 400 }
      );
    }

    const config = PLAN_CONFIG[planKey];
    const amountInPaise = config.amountINR * 100;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `client_membership_${planKey}_${Date.now()}`,
      notes: {
        userId: auth.userId,
        plan: planKey,
        connectsTotal: config.connectsTotal,
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: amountInPaise,
        currency: "INR",
        plan: planKey,
        planLabel: config.label,
        connectsTotal: config.connectsTotal,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Client membership create-order error:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}