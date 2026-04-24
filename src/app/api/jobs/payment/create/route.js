import { NextResponse } from "next/server";
import { createPaymentOrder } from "@/app/controllers/razorpay-payment.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
  POST - Create Razorpay payment order for job posting
  Route: /api/jobs/payment/create
  
  Body: {
    title, budget, category, description, etc. (all job fields)
  }
  
  Returns: Razorpay order details for frontend integration
 */
export async function POST(req) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }

    const body = await req.json();

    // Validation
    if (!body.title || !body.budget || !body.category) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, budget, and category are required"
        },
        { status: 400 }
      );
    }

    if (Number(body.budget) < 500) {
      return NextResponse.json(
        {
          success: false,
          message: "Minimum budget is ₹500"
        },
        { status: 400 }
      );
    }

    // Create payment order
    const result = await createPaymentOrder(auth.userId, body);

    return NextResponse.json(
      {
        success: true,
        message: "Payment order created successfully",
        ...result
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create Payment Order error:", error);

    if (error.message.includes("not found")) {
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
        message: "Failed to create payment order",
        error: error.message
      },
      { status: 500 }
    );
  }
}