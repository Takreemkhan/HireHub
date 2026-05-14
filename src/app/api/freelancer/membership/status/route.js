import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/freelancer/membership/status
 * Returns bidsRemaining, bidsTotal, current plan name for the logged-in freelancer.
 * Handles monthly bid refresh automatically:
 *   - Basic:        10 bids/month
 *   - Plus Monthly: 30 bids/month
 *   - Plus Yearly:  no monthly reset (360 bids for the year)
 * New users get 20 bonus bids (Basic plan one-time signup bonus).
 */
export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const userId = new ObjectId(auth.userId);
        const now = new Date();

        // Fetch subscription to know current plan
        const sub = await db.collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS)
            .findOne({ freelancerId: auth.userId });

        // Determine active plan key
        let activePlanKey = "basic";
        let activePlanLabel = "Basic";
        let activeBillingCycle = null;
        if (sub?.planKey === "plus" && sub?.isPlanActive && sub?.planExpiry && new Date(sub.planExpiry) > now) {
            activePlanKey = "plus";
            activePlanLabel = "Plus";
            activeBillingCycle = sub.billingCycle ?? "monthly";
        }

        let doc = await db.collection("freelancer_bids").findOne({ userId });

        // ── First-time user: initialise with Basic plan + 20 bonus bids ──────
        if (!doc) {
            const basicPlan = await db.collection(COLLECTIONS.FREELANCER_PLAN)
                .findOne({ planKey: "basic" });
            const bonusBids = basicPlan?.bonusBids ?? 20;

            await db.collection("freelancer_bids").insertOne({
                userId,
                bidsTotal: bonusBids,
                bidsUsed: 0,
                planKey: "basic",
                lastBidRefresh: now,
                createdAt: now,
                updatedAt: now,
            });
            doc = await db.collection("freelancer_bids").findOne({ userId });
        }

        // ── Monthly Bid Refresh ───────────────────────────────────────────────
        // Skip refresh for Plus Yearly (360 bids for the full year, no monthly reset)
        const isYearlyPlus = activePlanKey === "plus" && activeBillingCycle === "yearly";
        const lastRefresh = doc?.lastBidRefresh ? new Date(doc.lastBidRefresh) : null;
        const daysSinceRefresh = lastRefresh
            ? (now.getTime() - lastRefresh.getTime()) / (1000 * 60 * 60 * 24)
            : 999;

        if (!isYearlyPlus && daysSinceRefresh >= 30) {
            // Look up monthly bid limit from DB plan
            const planDoc = await db.collection(COLLECTIONS.FREELANCER_PLAN)
                .findOne({ planKey: activePlanKey });
            let refreshBids = planDoc?.monthlyBids ?? 10; // fallback 10 for Basic
            if (activePlanKey === "plus") {
                refreshBids = planDoc?.pricing?.monthly?.bids ?? 30;
            }

            await db.collection("freelancer_bids").updateOne(
                { userId },
                {
                    $set: {
                        bidsTotal: refreshBids,
                        bidsUsed: 0,
                        lastBidRefresh: now,
                        planKey: activePlanKey,
                        updatedAt: now,
                    },
                }
            );
            doc = await db.collection("freelancer_bids").findOne({ userId });
        }

        const bidsTotal = doc?.bidsTotal ?? 0;
        const bidsUsed = doc?.bidsUsed ?? 0;
        const bidsRemaining = Math.max(0, bidsTotal - bidsUsed);

        return NextResponse.json({
            success: true,
            bidsTotal,
            bidsUsed,
            bidsRemaining,
            planKey: activePlanKey,
            planLabel: activePlanLabel,
            billingCycle: activeBillingCycle,
            planExpiry: sub?.planExpiry ?? null,
            // Legacy compat — old callers that read subscription.bitsRemaining etc.
            subscription: {
                planLabel: activePlanLabel,
                planKey: activePlanKey,
                bitsTotal: bidsTotal,
                bitsUsed: bidsUsed,
                bitsRemaining: bidsRemaining,
                bidsTotal,
                bidsUsed,
                bidsRemaining,
            },
        });
    } catch (error) {
        console.error("Membership status GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch membership status" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/freelancer/membership/status
 * Initialises the Basic plan + 20 bonus bids for a new freelancer on signup.
 */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const userId = new ObjectId(auth.userId);
        const now = new Date();

        // Look up bonus bids from DB
        const basicPlan = await db.collection(COLLECTIONS.FREELANCER_PLAN)
            .findOne({ planKey: "basic" });
        const bonusBids = basicPlan?.bonusBids ?? 20;

        // Upsert: only sets values if document doesn't exist yet (first signup)
        await db.collection("freelancer_bids").updateOne(
            { userId },
            {
                $setOnInsert: {
                    userId,
                    bidsTotal: bonusBids,
                    bidsUsed: 0,
                    planKey: "basic",
                    lastBidRefresh: now,
                    createdAt: now,
                    updatedAt: now,
                },
            },
            { upsert: true }
        );

        // Also upsert Basic subscription record
        await db.collection(COLLECTIONS.FREELANCER_SUBSCRIPTIONS).updateOne(
            { freelancerId: auth.userId },
            {
                $setOnInsert: {
                    freelancerId: auth.userId,
                    isPlanActive: true,
                    planKey: "basic",
                    planType: "basic",
                    planLabel: "Basic",
                    billingCycle: null,
                    planStartDate: now,
                    planExpiry: null, // Basic never expires
                    createdAt: now,
                    updatedAt: now,
                },
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            message: "Basic plan initialised with bonus bids",
            bidsTotal: bonusBids,
            bidsUsed: 0,
            bidsRemaining: bonusBids,
            planLabel: "Basic",
            planKey: "basic",
            // Legacy compat
            subscription: {
                planLabel: "Basic",
                bitsTotal: bonusBids,
                bitsUsed: 0,
                bitsRemaining: bonusBids,
                subscriptionId: `basic_${auth.userId}`,
            },
        });
    } catch (error) {
        console.error("Membership status POST error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to initialise membership" },
            { status: 500 }
        );
    }
}
