import Razorpay from "razorpay";
import { NextResponse } from "next/server";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


/* CREATE ORDER CONTROLLER */
export const createOrder = async (req) => {
  try {
    const body = await req.json();
    const { jobId, amount } = body;

    if (!jobId || !amount) {
      return NextResponse.json(
        { success: false, message: "jobId and amount required" },
        { status: 400 }
      );
    }

    

    // 2% platform fee add
    const finalAmount = amount + amount * 0.02;

    // Razorpay order create
    const order = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // convert to paisa
      currency: "INR",
      receipt: `receipt_${jobId}_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
};