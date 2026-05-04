import { NextResponse } from "next/server";
import { checkPaymentRequired } from "@/app/controllers/razorpay-payment.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET - Check if payment is required for next job post
 * Route: /api/jobs/payment/check
 */
export async function GET(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const result = await checkPaymentRequired(auth.userId);

    return NextResponse.json(
      {
        success: true,
        ...result
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Check Payment error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check payment requirement",
        error: error.message
      },
      { status: 500 }
    );
  }
}