import { NextResponse } from "next/server";
import { verifyPaymentAndPublishJob } from "@/app/controllers/razorpay-payment.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 POST - Verify Razorpay payment and publish job
 Route: /api/jobs/payment/verify
 
 Body: {
   razorpay_order_id,
    razorpay_payment_id,
   razorpay_signature,
    jobId
 }
 
  After successful verification:
  - Job is published (isDraft: false, status: "open")
 - Payment recorded
 - Client can see job live
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      jobId
    } = body;

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !jobId) {
      return NextResponse.json(
        {
          success: false,
          message: "All payment details are required"
        },
        { status: 400 }
      );
    }

    // Verify payment and publish job
    const result = await verifyPaymentAndPublishJob({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      jobId
    });

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified and job published successfully!",
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Verify Payment error:", error);

    if (error.message.includes("verification failed") || error.message.includes("not captured")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          code: "PAYMENT_VERIFICATION_FAILED"
        },
        { status: 400 }
      );
    }

    if (error.message.includes("not found") || error.message.includes("mismatch")) {
      return NextResponse.json(
        {
          success: false,
          message: error.message
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify payment",
        error: error.message
      },
      { status: 500 }
    );
  }
}