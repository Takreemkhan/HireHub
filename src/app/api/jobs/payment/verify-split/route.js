import { NextResponse } from "next/server";
import { verifySplitPaymentAndPublishJob } from "@/app/controllers/razorpay-payment.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
  POST - Verify Split payment (Razorpay portion) and Publish Job
  Route: /api/jobs/payment/verify-split
 */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const body = await req.json();

        // Validation
        if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.jobId) {
            return NextResponse.json({ success: false, message: "Missing verification data" }, { status: 400 });
        }

        const result = await verifySplitPaymentAndPublishJob(body);

        return NextResponse.json({
            success: true,
            message: "Split payment verified and job published!",
            ...result
        }, { status: 200 });

    } catch (error) {
        console.error("Verify Split Payment error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
