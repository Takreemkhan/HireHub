import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Static PLAN_CONFIG removed in favor of DB collection COLLECTIONS.FREELANCER_PLAN

/* ── GET — return all plans + user's current subscription status ── */
export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Fetch all plans from DB
        const plans = await db.collection(COLLECTIONS.FREELANCER_PLAN).find({}).toArray();
        const planMap = {};
        plans.forEach(p => planMap[p.planKey] = p);

        const sub = await db
            .collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS)
            .findOne({ freelancerId: auth.userId });

        const now = new Date();
        const isPlanActive = sub
            ? sub.isPlanActive && sub.planExpiry && new Date(sub.planExpiry) > now
            : false;

        const activePlanKey = isPlanActive ? sub.planKey : null;
        const activePlan = activePlanKey ? planMap[activePlanKey] ?? null : null;

        return NextResponse.json({
            success: true,
            plans: plans,   // array from DB
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

/* ── POST — create Razorpay Subscription for selected plan ── */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const body = await req.json().catch(() => ({}));
        const planKey = body.planKey ?? "pro";   // default to pro

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Fetch plan from DB
        const plan = await db.collection(COLLECTIONS.FREELANCER_PLAN).findOne({ planKey });

        if (!plan) {
            return NextResponse.json(
                { success: false, message: "Invalid plan selected" },
                { status: 400 }
            );
        }

        const amountInPaise = plan.amountINR * 100;

        // Fetch our settings store to see if this razorpay_plan already exists
        const settings = await db.collection("settings").findOne({ _id: "razorpay_plans" });
        let razorpayPlanId = settings?.[planKey];

        // 1. If we don't have a Plan created in Razorpay yet, create it dynamically
        if (!razorpayPlanId) {
            const newRzPlan = await razorpay.plans.create({
                period: "monthly",
                interval: 1,
                item: {
                    name: `FreelanceHub ${plan.label} Plan`,
                    amount: amountInPaise,
                    currency: "INR",
                    description: plan.description
                }
            });
            razorpayPlanId = newRzPlan.id;
            // Cache it back to DB
            await db.collection("settings").updateOne(
                { _id: "razorpay_plans" },
                { $set: { [planKey]: razorpayPlanId } },
                { upsert: true }
            );
        }

        // 2. Create the Subscription mapped to that Plan
        const subscription = await razorpay.subscriptions.create({
            plan_id: razorpayPlanId,
            customer_notify: 1,
            total_count: 12, // Automatically renews for 12 months
            notes: {
                userId: auth.userId,
                plan: plan.planKey,
            }
        });

        return NextResponse.json(
            {
                success: true,
                subscriptionId: subscription.id,
                plan: plan.planKey,
                planLabel: plan.label,
                keyId: process.env.RAZORPAY_KEY_ID,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("freelancer plans POST error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create subscription", error: error.message },
            { status: 500 }
        );
    }
}

/* ── PUT — verify Razorpay payment and activate subscription ── */
export async function PUT(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature, planKey } =
            await req.json();

        if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, message: "All payment verification fields are required" },
                { status: 400 }
            );
        }

        // Verify Razorpay signature for subscriptions (payment_id | subscription_id)
        const expectedSig = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
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
                    orderId: razorpay_subscription_id, // we use subscriptionId as orderId for compatibility internally
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
                message: `${plan.label} subscription activated successfully!`,
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