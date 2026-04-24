import { NextResponse } from "next/server";
import { createEscrowPaymentOrder } from "@/app/controllers/razorpay-payment.controller";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
  POST - Create Razorpay payment order for Job Assignment Escrow Deposit
  Route: /api/jobs/payment/escrow/create
 */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) {
            return unauthorizedResponse(auth.error);
        }

        const { jobId } = await req.json();

        if (!jobId) {
            return NextResponse.json({ success: false, message: "Job ID is required" }, { status: 400 });
        }

        const result = await createEscrowPaymentOrder(auth.userId, jobId);

        return NextResponse.json(
            {
                success: true,
                message: "Escrow payment order created successfully",
                ...result
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create Escrow Payment Order error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create escrow order", error: error.message },
            { status: 500 }
        );
    }
}
