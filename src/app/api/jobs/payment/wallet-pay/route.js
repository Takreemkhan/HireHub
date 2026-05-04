import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";
import { createPaymentRecord } from "@/services/payment.service";

/**
 * POST /api/jobs/payment/wallet-pay
 * Client pays for a job using their internal HireHub wallet balance.
 */
export async function POST(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const body = await req.json();
        const userId = new ObjectId(auth.userId);

        const { budget, title } = body;
        const amount = Number(budget);
        const commission = Math.round(amount * 0.02 * 100) / 100;
        const featuredFee = body.isFeatured ? Math.round(amount * 0.02 * 100) / 100 : 0;

        let totalPayable = 0;
        if (body.payLater) {
            // Pay Later: only pay Featured Fee now (if selected)
            totalPayable = featuredFee;
        } else {
            totalPayable = amount + commission + featuredFee;
        }

        // Check wallet balance
        const wallet = await db.collection(COLLECTIONS.WALLETS).findOne({
            $or: [{ userId: userId }, { userId: auth.userId }]
        });
        const currentBalance = wallet?.balance ?? 0;

        if (totalPayable > 0 && currentBalance < totalPayable) {
            return NextResponse.json({
                success: false,
                message: `Insufficient wallet balance. Required: ₹${totalPayable}, Available: ₹${currentBalance}`,
            }, { status: 400 });
        }

        const now = new Date();

        // 1. Deduct from wallet (only if something is owed now)
        if (totalPayable > 0) {
            await db.collection(COLLECTIONS.WALLETS).updateOne(
                { $or: [{ userId: userId }, { userId: auth.userId }] },
                {
                    $inc: { balance: -totalPayable },
                    $set: { updatedAt: now },
                },
                { upsert: true }
            );
        }

        // 2. Create the job — only job-related fields
        const featuredUntilTime = body.isFeatured ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null;
        const job = {
            clientId: userId,
            title: body.title?.trim(),
            category: body.category,
            subCategory: body.subCategory || null,
            description: body.description?.trim() || "",
            budget: amount,
            currency: body.currency || "INR",
            projectDuration: body.projectDuration || null,
            skills: body.skills || [],
            attachments: body.attachments || [],
            jobVisibility: body.jobVisibility || "public",
            freelancerSource: body.freelancerSource || "any",
            questions: body.questions || [],
            isFeatured: !!body.isFeatured,
            featuredUntil: featuredUntilTime,
            status: "open",
            isDraft: false,
            proposalCount: 0,
            createdAt: now,
            updatedAt: now,
        };

        const jobResult = await db.collection(COLLECTIONS.JOBS).insertOne(job);
        const jobId = jobResult.insertedId;

        // 3. Create payment record in the payments collection
        await createPaymentRecord(db, {
            jobId,
            clientId: userId,
            orderId: null,
            paymentType: "wallet",
            paymentStatus: body.payLater ? "pending_assignment" : "paid",
            amount: totalPayable,
            platformCommission: body.payLater ? 0 : commission,
            featuredFee,
            walletPart: totalPayable,
            rzpPart: 0,
            escrowAmount: body.payLater ? 0 : amount,
            escrowStatus: body.payLater ? "none" : "held",
            escrowReleased: 0,
            payLater: !!body.payLater,
            paymentVerifiedAt: totalPayable > 0 ? now : null,
        });

        // 4. Record wallet debit transaction
        if (totalPayable > 0) {
            await db.collection(COLLECTIONS.WALLET_TRANSACTIONS).insertOne({
                userId,
                type: "debit",
                category: "escrow_deposit",
                source: "wallet",
                amount: totalPayable,
                description: `Job funded via Wallet: ${title}`,
                jobId,
                status: "completed",
                createdAt: now,
            });
        }

        return NextResponse.json({
            success: true,
            message: "Job posted successfully using wallet balance!",
            jobId,
            newBalance: currentBalance - totalPayable,
        });
    } catch (error) {
        console.error("Wallet pay error:", error);
        return NextResponse.json({ success: false, message: "Failed to process wallet payment" }, { status: 500 });
    }
}
