import { NextResponse } from "next/server";
import { createSplitPaymentOrder } from "@/app/controllers/razorpay-payment.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
  POST - Create Split payment order (Wallet + Razorpay)
  Route: /api/jobs/payment/create-split
 */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const body = await req.json();

        // Validation
        if (!body.title || !body.budget || body.walletAmount === undefined || body.remainingAmount === undefined) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const result = await createSplitPaymentOrder(auth.userId, body);

        return NextResponse.json({
            success: true,
            message: "Split payment order created",
            ...result
        }, { status: 201 });

    } catch (error) {
        console.error("Create Split Order error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
