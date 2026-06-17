import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";

/**
 * Static BID_PACKS removed in favor of DB collection COLLECTIONS.BIDS
 */

/**
 * POST /api/freelancer/membership/create-order
 * Body: { packKey: 'pack10' | 'pack20' | 'pack50' }
 *       OR legacy: { plan: 'custom', bidsCount: <number> }
 *
 * Creates a Razorpay order for the selected bid pack.
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) return unauthorizedResponse(auth.error);

    const body = await req.json();
    const bidsCount = parseInt(body.bidsCount);

    if (isNaN(bidsCount) || bidsCount < 1) {
      return NextResponse.json(
        { success: false, message: "Invalid bidsCount. Must be greater than 0." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    // Fetch dynamic rate from DB (plus monthly plan)
    const plusPlan = await db.collection(COLLECTIONS.FREELANCER_PLAN).findOne({ planKey: "plus" });
    const monthlyAmount = plusPlan?.pricing?.monthly?.amountUSD || 25;
    const monthlyBids = plusPlan?.pricing?.monthly?.bids || 30;

    const costPerBidUSD = monthlyAmount / monthlyBids;
    const totalUSD = costPerBidUSD * bidsCount;
    const amountINR = totalUSD * 83;
    const amountInPaise = Math.round(amountINR * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `custom_bids_${Date.now()}`,
      notes: {
        userId: auth.userId,
        bidsCount: String(bidsCount),
        amountUSD: String(totalUSD.toFixed(2)),
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: amountInPaise,
        currency: "INR",
        bidsCount,
        amountUSD: totalUSD,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create-order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}
