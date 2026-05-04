import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/payment-center/stats
 * Returns aggregated financial and project stats for the logged-in user.
 */
export async function GET(req) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const userId = new ObjectId(auth.userId);

        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // 1. Financial Stats (Strict Wallet Source Filter)
        const allTx = await db.collection("wallet_transactions").find({
            $or: [{ userId }, { userId: auth.userId }]
        }).toArray();

        // Calculate credits (deposits) - ONLY those that affected wallet (topups or marked source:wallet)
        const totalAdded = allTx.reduce((sum, tx) => {
            const isWalletCredit = tx.type === "credit" && tx.status === "completed" &&
                (tx.source === "wallet" || tx.category === "topup");
            return isWalletCredit ? sum + (tx.amount || 0) : sum;
        }, 0);

        // Calculate debits (spending) - strictly COMPLETED wallet debits
        const totalSpent = allTx.reduce((sum, tx) => {
            const isWalletDebit = tx.type === "debit" && tx.status === "completed" && tx.source === "wallet";
            return isWalletDebit ? sum + (tx.amount || 0) : sum;
        }, 0);

        const thisMonthSpent = allTx
            .filter(tx => new Date(tx.createdAt) >= firstDayOfMonth)
            .reduce((sum, tx) => {
                const isWalletDebit = tx.type === "debit" && tx.status === "completed" && tx.source === "wallet";
                return isWalletDebit ? sum + (tx.amount || 0) : sum;
            }, 0);

        const thisMonthAdded = allTx
            .filter(tx => new Date(tx.createdAt) >= firstDayOfMonth)
            .reduce((sum, tx) => {
                return (tx.type === "credit" && tx.status === "completed") ? sum + (tx.amount || 0) : sum;
            }, 0);

        // 1b. Pending Earnings (milestones approved by client but not yet released/paid out)
        const pendingMilestones = await db.collection("milestones").find({
            freelancerId: userId,
            status: { $in: ["approved", "pending", "active"] }
        }, { projection: { amount: 1, status: 1 } }).toArray();
        const pendingEarnings = pendingMilestones.reduce((sum, m) => sum + (m.amount || 0), 0);

        // 2. Active Projects
        const activeProjectsCount = await db.collection("jobs").countDocuments({
            freelancerId: userId,
            status: { $ne: "completed" }
        });

        // 3. Earnings Trend (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);

        const trendData = await db.collection("wallet_transactions").aggregate([
            {
                $match: {
                    $or: [{ userId }, { userId: auth.userId }],
                    type: "credit",
                    status: "completed",
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    earnings: { $sum: "$amount" },
                    projects: { $addToSet: "$jobId" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]).toArray();

        const formattedTrend = trendData.map(d => {
            const date = new Date(d._id.year, d._id.month - 1);
            return {
                month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
                earnings: d.earnings,
                projects: d.projects.length
            };
        });

        // 4. Category Distribution
        const categoryData = await db.collection("wallet_transactions").aggregate([
            { $match: { userId, type: "credit", category: "milestone_release" } },
            {
                $lookup: {
                    from: "jobs",
                    localField: "jobId",
                    foreignField: "_id",
                    as: "jobInfo"
                }
            },
            { $unwind: "$jobInfo" },
            {
                $group: {
                    _id: "$jobInfo.category",
                    value: { $sum: "$amount" }
                }
            },
            { $project: { name: "$_id", value: 1, _id: 0 } }
        ]).toArray();

        // Assign colors to categories
        const colors = ['#1B365D', '#FF6B35', '#4299E1', '#10B981', '#F59E0B'];
        const finalCategoryData = categoryData.map((c, i) => ({
            ...c,
            color: colors[i % colors.length]
        }));

        return NextResponse.json({
            success: true,
            stats: {
                totalAdded,
                totalSpent,
                thisMonthSpent,
                thisMonthAdded,
                pendingEarnings,
                activeProjectsCount,
                avgProjectValue: activeProjectsCount > 0 ? (totalAdded / activeProjectsCount) : 0,
                trend: formattedTrend,
                categories: finalCategoryData
            }
        });
    } catch (error) {
        console.error("Payment Center stats error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
