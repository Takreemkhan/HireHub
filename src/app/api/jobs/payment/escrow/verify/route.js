import { NextResponse } from "next/server";
import { verifyEscrowPayment } from "@/app/controllers/razorpay-payment.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
  POST - Verify Razorpay payment for Escrow Deposit
  Route: /api/jobs/payment/escrow/verify
 */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) {
            return unauthorizedResponse(auth.error);
        }

        const body = await req.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !jobId) {
            return NextResponse.json({ success: false, message: "All payment details are required" }, { status: 400 });
        }

        const result = await verifyEscrowPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            jobId
        });

        return NextResponse.json(
            { success: true, message: "Escrow funded successfully!", ...result },
            { status: 200 }
        );
    } catch (error) {
        console.error("Verify Escrow Payment error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to verify escrow payment", error: error.message },
            { status: 500 }
        );
    }
}
