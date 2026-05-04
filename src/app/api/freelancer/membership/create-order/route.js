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

    // ── New API: packKey ────────────────────────────────────────────────────
    if (body.packKey) {
      const client = await clientPromise;
      const db = client.db(DB_NAME);

      const pack = await db.collection(COLLECTIONS.BIDS).findOne({ packKey: body.packKey });

      if (!pack) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid pack selection.`,
          },
          { status: 400 }
        );
      }

      const amountInPaise = pack.amountINR * 100;
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `bids_${body.packKey}_${Date.now()}`,
        notes: {
          userId: auth.userId,
          packKey: body.packKey,
          bidsToAdd: pack.bids,
        },
      });

      return NextResponse.json(
        {
          success: true,
          orderId: order.id,
          amount: amountInPaise,
          currency: "INR",
          packKey: body.packKey,
          packLabel: pack.label,
          bidsToAdd: pack.bids,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
        { status: 201 }
      );
    }

    // ── Legacy API: plan=custom + bidsCount ─────────────────────────────────
    if (body.plan === "custom" && body.bidsCount) {
      const PRICE_PER_BID_INR = 415;
      const count = parseInt(body.bidsCount);
      if (isNaN(count) || count < 1 || count > 500) {
        return NextResponse.json(
          { success: false, message: "bidsCount must be between 1 and 500" },
          { status: 400 }
        );
      }
      const amountINR = count * PRICE_PER_BID_INR;
      const amountInPaise = amountINR * 100;
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `custom_bids_${Date.now()}`,
        notes: { userId: auth.userId, plan: "custom", bidsCount: count },
      });
      return NextResponse.json(
        {
          success: true,
          orderId: order.id,
          amount: amountInPaise,
          currency: "INR",
          plan: "custom",
          planLabel: "Custom Bids",
          bitsTotal: count,
          keyId: process.env.RAZORPAY_KEY_ID,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Provide packKey or plan=custom with bidsCount" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Create-order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order", error: error.message },
      { status: 500 }
    );
  }
}
