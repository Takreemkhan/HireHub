import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { ObjectId } from "mongodb";
import { invalidateCache } from "@/lib/redis";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ── GET: All plans + user subscription + bids ── */
export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // Fetch plans (Basic & Plus) from DB
        const plans = await db.collection(COLLECTIONS.FREELANCER_PLAN).find({}).sort({ isFree: -1 }).toArray();
        const planMap = {};
        plans.forEach(p => planMap[p.planKey] = p);

        // Fetch user subscription
        const sub = await db.collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS)
            .findOne({ freelancerId: auth.userId });

        // Fetch user bids balance
        const userId = new ObjectId(auth.userId);
        const bidsDoc = await db.collection("freelancer_bids").findOne({ userId });
        const bidsTotal = bidsDoc?.bidsTotal ?? 0;
        const bidsUsed = bidsDoc?.bidsUsed ?? 0;
        const bidsRemaining = Math.max(0, bidsTotal - bidsUsed);

        // Determine active plan — default is basic
        const now = new Date();
        let isPlanActive = true;
        let activePlanKey = "basic";
        let activeBillingCycle = null;

        if (sub) {
            if (sub.planKey === "plus" && sub.isPlanActive && sub.planExpiry && new Date(sub.planExpiry) > now) {
                isPlanActive = true;
                activePlanKey = "plus";
                activeBillingCycle = sub.billingCycle ?? null;
            }
        }

        const activePlan = planMap[activePlanKey] ?? null;

        return NextResponse.json({
            success: true,
            plans,
            subscription: {
                isPlanActive,
                planKey: activePlanKey,
                planType: activePlan?.planType ?? "basic",
                planLabel: activePlan?.label ?? "Basic",
                billingCycle: activeBillingCycle,
                bidsRemaining,
                bidsTotal,
                planStartDate: sub?.planStartDate ?? null,
                planExpiry: sub?.planExpiry ?? null,
                // Legacy field kept for backward compat
                maxVideos: activePlanKey === "plus" ? 3 : 0,
                planLabel_legacy: activePlan?.label ?? "Basic",
            },
            bidsRemaining,
            bidsTotal,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Freelancer plans GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch plans", error: error.message },
            { status: 500 }
        );
    }
}

/* ── POST: Create Razorpay order for Plus plan ── */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const body = await req.json().catch(() => ({}));
        const planKey = body.planKey ?? "plus";
        const billingCycle = body.billingCycle ?? "monthly"; // "monthly" | "yearly"

        if (planKey === "basic") {
            return NextResponse.json(
                { success: false, message: "Basic plan is free — no payment required." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const plan = await db.collection(COLLECTIONS.FREELANCER_PLAN).findOne({ planKey });
        if (!plan) {
            return NextResponse.json({ success: false, message: "Invalid plan." }, { status: 400 });
        }

        const pricing = plan.pricing?.[billingCycle];
        if (!pricing) {
            return NextResponse.json({ success: false, message: "Invalid billing cycle." }, { status: 400 });
        }

        // Convert USD → INR (1 USD ≈ 83 INR) for Razorpay
        const amountINR = pricing.amountUSD * 83;
        const amountInPaise = Math.round(amountINR * 100);

        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `plus_${billingCycle}_${Date.now()}`,
            notes: {
                userId: auth.userId,
                plan: planKey,
                billingCycle,
                bids: pricing.bids,
            },
        });

        return NextResponse.json(
            {
                success: true,
                orderId: order.id,
                amount: amountInPaise,
                currency: "INR",
                amountUSD: pricing.amountUSD,
                billingCycle,
                plan: planKey,
                planLabel: plan.label,
                bids: pricing.bids,
                keyId: process.env.RAZORPAY_KEY_ID,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Freelancer plans POST error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create payment order", error: error.message },
            { status: 500 }
        );
    }
}

/* ── PUT: Verify Razorpay payment → activate Plus → reset bids ── */
export async function PUT(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            planKey,
            billingCycle,
        } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { success: false, message: "All payment verification fields are required." },
                { status: 400 }
            );
        }

        // Verify Razorpay signature (order_id|payment_id for one-time orders)
        const expectedSig = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSig !== razorpay_signature) {
            return NextResponse.json(
                { success: false, message: "Payment verification failed — invalid signature." },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const plan = await db.collection(COLLECTIONS.FREELANCER_PLAN).findOne({ planKey: planKey ?? "plus" });
        if (!plan) {
            return NextResponse.json({ success: false, message: "Plan not found." }, { status: 400 });
        }

        const cycle = billingCycle ?? "monthly";
        const pricing = plan.pricing?.[cycle];
        if (!pricing) {
            return NextResponse.json({ success: false, message: "Invalid billing cycle." }, { status: 400 });
        }

        const now = new Date();
        const planExpiry = new Date(now);
        if (cycle === "yearly") {
            planExpiry.setFullYear(planExpiry.getFullYear() + 1);
        } else {
            planExpiry.setMonth(planExpiry.getMonth() + 1);
        }

        const newBids = pricing.bids; // 30 for monthly, 360 for yearly

        // 1. Update / create subscription record
        await db.collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS).findOneAndUpdate(
            { freelancerId: auth.userId },
            {
                $set: {
                    freelancerId: auth.userId,
                    isPlanActive: true,
                    planKey: plan.planKey,
                    planType: plan.planType,
                    planLabel: plan.label,
                    billingCycle: cycle,
                    planStartDate: now,
                    planExpiry,
                    orderId: razorpay_order_id,
                    paymentId: razorpay_payment_id,
                    updatedAt: now,
                    // Legacy compat
                    maxVideos: 0,
                },
                $setOnInsert: { createdAt: now },
            },
            { upsert: true }
        );

        // 2. RESET bids — discard old Basic bids, start fresh with Plus allocation
        const userId = new ObjectId(auth.userId);
        await db.collection("freelancer_bids").updateOne(
            { userId },
            {
                $set: {
                    bidsTotal: newBids,
                    bidsUsed: 0,
                    lastBidRefresh: now,
                    planKey: plan.planKey,
                    billingCycle: cycle,
                    updatedAt: now,
                },
                $setOnInsert: { userId, createdAt: now },
            },
            { upsert: true }
        );

        // 3. Record purchase for invoice history
        await db.collection("plan_purchases").insertOne({
            userId,
            planKey: plan.planKey,
            planLabel: plan.label,
            billingCycle: cycle,
            amountUSD: pricing.amountUSD,
            bids: newBids,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            purchasedAt: now,
            planExpiry,
        });

        // Invalidate freelancer membership status cache
        await invalidateCache(`api:freelancer:membership:status:${auth.userId}`);

        return NextResponse.json(
            {
                success: true,
                message: `${plan.label} Plan (${cycle}) activated successfully!`,
                subscription: {
                    isPlanActive: true,
                    planKey: plan.planKey,
                    planType: plan.planType,
                    planLabel: plan.label,
                    billingCycle: cycle,
                    bidsRemaining: newBids,
                    bidsTotal: newBids,
                    planStartDate: now,
                    planExpiry,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Freelancer plans PUT error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to verify payment", error: error.message },
            { status: 500 }
        );
    }
}