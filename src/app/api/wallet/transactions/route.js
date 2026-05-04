import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/wallet/transactions
 * Query params:
 *   type   = "credit" | "debit" | "all"  (default: "all")
 *   page   = number  (default: 1)
 *   limit  = number  (default: 20, max: 100)
 *
 * Returns paginated wallet transaction history for the logged-in user.
 */
export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "all";
        const source = searchParams.get("source") || "all"; // 'wallet' or 'all'
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20")));
        const skip = (page - 1) * limit;

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        // ── Build query filter ───────────────────────────────────────────────
        const query = { $or: [{ userId: new ObjectId(auth.userId) }, { userId: auth.userId }] };

        if (type === "credit") query.type = "credit";
        if (type === "debit") query.type = "debit";

        // Professional Filter: If source=wallet, only show transactions that affected the wallet balance
        // Top-ups, withdrawals, and payments explicitly marked as 'source: wallet'
        if (source === "wallet") {
            query.$and = [
                {
                    $or: [
                        { source: "wallet" },
                        { category: { $in: ["topup", "withdrawal", "platform_fee"] } }
                    ]
                }
            ];
        }

        // ── Fetch transactions + total count with job info ──────────────────────
        const pipeline = [
            { $match: query },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "jobs",
                    localField: "jobId",
                    foreignField: "_id",
                    as: "jobInfo"
                }
            },
            {
                $addFields: {
                    projectTitle: { $ifNull: [{ $arrayElemAt: ["$jobInfo.title", 0] }, "N/A"] }
                }
            },
            { $project: { jobInfo: 0 } }
        ];

        const [transactions, total] = await Promise.all([
            db.collection("wallet_transactions").aggregate(pipeline).toArray(),
            db.collection("wallet_transactions").countDocuments(query),
        ]);

        // Ensure transactions are processed correctly for serialization below
        // aggregate results are same as find().toArray() for mapping

        // ── Summary stats (always across all types for the user) ─────────────
        const allTx = await db
            .collection("wallet_transactions")
            .find({ $or: [{ userId: new ObjectId(auth.userId) }, { userId: auth.userId }] })
            .toArray();

        const totalIn = allTx.reduce((sum, t) => {
            const isWalletCredit = t.type === "credit" && t.status === "completed" &&
                (t.source === "wallet" || t.category === "topup");
            return isWalletCredit ? sum + (t.amount || 0) : sum;
        }, 0);

        const totalOut = allTx.reduce((sum, t) => {
            const isWalletDebit = t.type === "debit" && t.status === "completed" && t.source === "wallet";
            return isWalletDebit ? sum + (t.amount || 0) : sum;
        }, 0);

        // ── Serialize _id fields ─────────────────────────────────────────────
        const serialized = transactions.map(tx => ({
            ...tx,
            _id: tx._id.toString(),
            userId: tx.userId.toString(),
            createdAt: tx.createdAt?.toISOString?.() ?? tx.createdAt,
        }));

        return NextResponse.json({
            success: true,
            transactions: serialized,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasMore: skip + limit < total,
            },
            summary: {
                totalIn,
                totalOut,
                net: totalIn - totalOut,
            },
        });
    } catch (error) {
        console.error("Wallet transactions error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}