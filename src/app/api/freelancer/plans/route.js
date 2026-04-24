import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Three plan configs ────────────────────────────────────────────────────────
const PLAN_CONFIG = {
    basic: {
        planKey: "basic",
        label: "Basic",
        amountINR: 499,
        durationDays: 30,
        maxVideos: 1,
        description: "Upload 1 resume video on proposals",
    },
    pro: {
        planKey: "pro",
        label: "Pro",
        amountINR: 999,
        durationDays: 30,
        maxVideos: 3,
        description: "Upload up to 3 resume videos on proposals",
    },
    elite: {
        planKey: "elite",
        label: "Elite",
        amountINR: 1999,
        durationDays: 30,
        maxVideos: 5,
        description: "Upload up to 5 resume videos + featured profile badge",
    },
};

/* ── GET — return all plans + user's current subscription status ── */
export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const sub = await db
            .collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS)
            .findOne({ freelancerId: auth.userId });

        const now = new Date();
        const isPlanActive = sub
            ? sub.isPlanActive && sub.planExpiry && new Date(sub.planExpiry) > now
            : false;

        const activePlanKey = isPlanActive ? sub.planKey : null;
        const activePlan = activePlanKey ? PLAN_CONFIG[activePlanKey] ?? null : null;

        return NextResponse.json({
            success: true,
            plans: Object.values(PLAN_CONFIG),   // array of all 3 plans
            subscription: sub
                ? {
                    isPlanActive,
                    planKey: isPlanActive ? sub.planKey : null,
                    planLabel: isPlanActive ? sub.planLabel : null,
                    maxVideos: activePlan ? activePlan.maxVideos : 0,
                    planStartDate: sub.planStartDate,
                    planExpiry: sub.planExpiry,
                }
                : { isPlanActive: false, planKey: null, planLabel: null, maxVideos: 0, planStartDate: null, planExpiry: null },
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("freelancer plans GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch plans", error: error.message },
            { status: 500 }
        );
    }
}

/* ── POST — create Razorpay order for selected plan ── */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const body = await req.json().catch(() => ({}));
        const planKey = body.planKey ?? "pro";   // default to pro

        const plan = PLAN_CONFIG[planKey];
        if (!plan) {
            return NextResponse.json(
                { success: false, message: "Invalid plan selected" },
                { status: 400 }
            );
        }

        const amountInPaise = plan.amountINR * 100;

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `fplan_${planKey}_${Date.now()}`,
            notes: {
                userId: auth.userId,
                plan: plan.planKey,
                description: plan.description,
            },
        });

        return NextResponse.json(
            {
                success: true,
                orderId: order.id,
                amount: amountInPaise,
                currency: "INR",
                plan: plan.planKey,
                planLabel: plan.label,
                keyId: process.env.RAZORPAY_KEY_ID,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("freelancer plans POST error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create order", error: error.message },
            { status: 500 }
        );
    }
}

/* ── PUT — verify Razorpay payment and activate subscription ── */
export async function PUT(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planKey } =
            await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, message: "All payment fields are required" },
                { status: 400 }
            );
        }

        // Verify Razorpay signature
        const expectedSig = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSig !== razorpay_signature) {
            return NextResponse.json(
                { success: false, message: "Payment verification failed – invalid signature" },
                { status: 400 }
            );
        }

        const plan = PLAN_CONFIG[planKey] ?? PLAN_CONFIG.pro;

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const now = new Date();
        const planExpiry = new Date(now);
        planExpiry.setDate(planExpiry.getDate() + plan.durationDays);

        await db.collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS).findOneAndUpdate(
            { freelancerId: auth.userId },
            {
                $set: {
                    freelancerId: auth.userId,
                    isPlanActive: true,
                    planStartDate: now,
                    planExpiry,
                    planKey: plan.planKey,
                    planLabel: plan.label,
                    maxVideos: plan.maxVideos,
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    updatedAt: now,
                },
                $setOnInsert: { createdAt: now },
            },
            { upsert: true }
        );

        return NextResponse.json(
            {
                success: true,
                message: `${plan.label} plan activated successfully!`,
                subscription: {
                    isPlanActive: true,
                    planKey: plan.planKey,
                    planLabel: plan.label,
                    maxVideos: plan.maxVideos,
                    planStartDate: now,
                    planExpiry,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("freelancer plans PUT error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to verify payment", error: error.message },
            { status: 500 }
        );
    }
}