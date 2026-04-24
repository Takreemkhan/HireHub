import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { createNotification } from "@/services/notificationService";

/**
 * POST /api/milestones/[id]/approve-release
 * Client approves the release request:
 *  1. Deduct milestone amount from job escrow pool
 *  2. Credit full amount to freelancer wallet
 *  3. Record wallet_transactions for milestone_release
 *  4. Mark milestone as "released"
 *  5. Activate next milestone OR mark job as completed
 */
export async function POST(req, { params }) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { id } = await params;
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const milestoneId = new ObjectId(id);

        let chatId = null;
        try {
            const body = await req.json();
            chatId = body.chatId;
        } catch (e) { }

        const milestone = await db.collection("milestones").findOne({ _id: milestoneId });
        if (!milestone) return NextResponse.json({ success: false, message: "Milestone not found" }, { status: 404 });

        if (milestone.clientId.toString() !== auth.userId) {
            return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
        }

        if (milestone.status !== "submitted") {
            return NextResponse.json({ success: false, message: "Milestone has not been submitted for review" }, { status: 400 });
        }

        // Find the job
        const job = await db.collection("jobs").findOne({ _id: milestone.jobId });
        if (!job) return NextResponse.json({ success: false, message: "Job not found" }, { status: 404 });

        const amount = Number(milestone.amount);
        const platformFee = Math.round(amount * 0.10 * 100) / 100;
        const freelancerCredit = Math.round((amount - platformFee) * 100) / 100;

        const now = new Date();
        const freelancerObjectId = milestone.freelancerId;
        const clientObjectId = new ObjectId(auth.userId);

        // Credit freelancer wallet with NET amount
        await db.collection("wallets").updateOne(
            { userId: freelancerObjectId },
            { $inc: { balance: freelancerCredit }, $set: { updatedAt: now } },
            { upsert: true }
        );

        // Record milestone_release transaction (full credit for freelancer)
        await db.collection("wallet_transactions").insertOne({
            userId: freelancerObjectId,
            type: "credit",
            category: "milestone_release",
            amount: amount,
            description: `Milestone released: ${milestone.title} for "${job.title}"`,
            jobId: milestone.jobId,
            milestoneId,
            status: "completed",
            createdAt: now,
        });

        // Record platform_fee transaction (debit for freelancer)
        await db.collection("wallet_transactions").insertOne({
            userId: freelancerObjectId,
            type: "debit",
            category: "platform_fee",
            amount: platformFee,
            description: `Platform service fee (10%): ${milestone.title} for "${job.title}"`,
            jobId: milestone.jobId,
            milestoneId,
            status: "completed",
            createdAt: now,
        });

        // Record milestone_payment transaction (debit for client - representing actual spending)
        await db.collection("wallet_transactions").insertOne({
            userId: clientObjectId,
            type: "debit",
            category: "milestone_payment",
            amount: amount,
            description: `Payment released: ${milestone.title} for "${job.title}"`,
            jobId: milestone.jobId,
            milestoneId,
            status: "completed",
            createdAt: now,
        });

        // Fetch payment record
        const paymentRecord = await db.collection("payments").findOne({ jobId: milestone.jobId });

        // Update payment escrow released amount
        const newEscrowReleased = (paymentRecord?.escrowReleased ?? 0) + amount;

        // Calculate total expected escrow from all milestones
        const allMilestones = await db.collection("milestones").find({ jobId: milestone.jobId }).toArray();
        const totalJobBudget = allMilestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0);

        // Use a small epsilon for floating point comparison safety
        const isAllReleased = newEscrowReleased >= (totalJobBudget - 0.01);

        await db.collection("payments").updateOne(
            { jobId: milestone.jobId },
            {
                $set: {
                    escrowReleased: newEscrowReleased,
                    escrowStatus: isAllReleased ? "released" : "partial",
                    updatedAt: now,
                },
            }
        );

        // Mark this milestone as released
        await db.collection("milestones").updateOne(
            { _id: milestoneId },
            { $set: { status: "released", releasedAt: now, updatedAt: now } }
        );

        // Update the milestone_request as approved
        await db.collection("milestone_requests").updateOne(
            { milestoneId, status: "pending" },
            { $set: { status: "approved", reviewedAt: now } }
        );

        // Find next milestone to activate
        const nextMilestone = await db.collection("milestones").findOne(
            { jobId: milestone.jobId, status: "locked" },
            { sort: { orderIndex: 1 } }
        );

        let jobCompleted = false;

        if (nextMilestone) {
            // Activate next milestone
            await db.collection("milestones").updateOne(
                { _id: nextMilestone._id },
                { $set: { status: "active", updatedAt: now } }
            );
        } else {
            // No more milestones — job is complete
            await db.collection("jobs").updateOne(
                { _id: milestone.jobId },
                { $set: { status: "completed", completedAt: now, updatedAt: now } }
            );
            jobCompleted = true;

            // If there's any remaining escrow (rounding), refund to client
            const remaining = (paymentRecord?.escrowAmount ?? 0) - newEscrowReleased;
            if (remaining > 0) {
                await db.collection("wallets").updateOne(
                    { userId: clientObjectId },
                    { $inc: { balance: remaining }, $set: { updatedAt: now } },
                    { upsert: true }
                );
                await db.collection("wallet_transactions").insertOne({
                    userId: clientObjectId,
                    type: "credit",
                    category: "escrow_refund",
                    amount: remaining,
                    description: `Escrow refund (rounding difference) - ${job.title}`,
                    jobId: milestone.jobId,
                    status: "completed",
                    createdAt: now,
                });
            }
        }

        // Send push notification to Freelancer
        if (job) {
            await createNotification({
                recipientId: milestone.freelancerId,
                senderId: auth.userId,
                type: "payment",
                title: "Payment Released",
                body: `Fund released for milestone: "${milestone.title}".`,
                meta: { jobId: milestone.jobId.toString(), jobTitle: job.title, amount: freelancerCredit },
                link: `/freelancer/messages?chatId=${chatId}&jobId=${milestone.jobId.toString()}`
            }).catch(err => console.log('Notification error:', err));
        }

        return NextResponse.json({
            success: true,
            message: jobCompleted
                ? "Final milestone released! Job is now completed."
                : `₹${freelancerCredit} released to freelancer. Next milestone is now active.`,
            freelancerCredit,
            jobCompleted,
        });
    } catch (error) {
        console.error("Approve release error:", error);
        return NextResponse.json({ success: false, message: "Failed to release payment" }, { status: 500 });
    }
}
