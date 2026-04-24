import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

/**
 * GET /api/payment-center/client-stats
 * Returns aggregated spending stats for the logged-in client.
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

        // 0. Get Active Jobs (open + in-progress)
        const activeJobsQuery = {
            $or: [{ clientId: userId }, { clientId: auth.userId.toString() }],
            isDraft: { $ne: true },
            status: { $in: ["open", "in-progress", "in progress"] }
        };

        const activeJobs = await db.collection("jobs").find(activeJobsQuery).toArray();
        const activeProjectsCount = activeJobs.length;

        // 1. Total Spent = Sum of finalAmount (completed) + platform commissions (now in payments)
        // A much easier way to calculate total spent now is to trust our transactions table, OR
        // calculate based on jobs + payments.
        // Let's use the current logic but join with payments.
        const completedJobs = await db.collection("jobs").aggregate([
            {
                $match: {
                    $or: [{ clientId: userId }, { clientId: auth.userId.toString() }],
                    isDraft: { $ne: true },
                    status: "completed"
                }
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "payment"
                }
            }
        ]).toArray();

        // Calculate total spent on completed jobs (finalAmount + upfront commission from payments)
        const totalSpentCompleted = completedJobs.reduce((sum, j) => {
            const p = j.payment?.[0] || {};
            return sum + (j.finalAmount || j.budget || 0) + (p.platformCommission || 0);
        }, 0);

        // Total releases on active jobs + their upfront commissions
        const activeJobsWithPayments = await db.collection("jobs").aggregate([
            { $match: activeJobsQuery },
            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "payment"
                }
            }
        ]).toArray();

        // Here we read escrowReleased from payments
        const totalReleasedActive = activeJobsWithPayments.reduce((sum, j) => {
            const p = j.payment?.[0] || {};
            return sum + (p.escrowReleased || 0) + (p.platformCommission || 0);
        }, 0);

        const totalSpent = totalSpentCompleted + totalReleasedActive;

        // "This Month Spent"
        const thisMonthTx = await db.collection("wallet_transactions").find({
            $or: [{ clientId: userId, userId: userId }, { userId: auth.userId.toString() }],
            type: "debit",
            status: "completed",
            category: "milestone_payment",
            createdAt: { $gte: firstDayOfMonth }
        }).toArray();

        const releaseSum = thisMonthTx.reduce((sum, tx) => sum + (tx.amount || 0), 0);

        // Get commissions from jobs published this month (read from payments)
        const thisMonthsJobsWithPayments = await db.collection("jobs").aggregate([
            {
                $match: {
                    $or: [{ clientId: userId }, { clientId: auth.userId.toString() }],
                    isDraft: { $ne: true },
                    createdAt: { $gte: firstDayOfMonth }
                }
            },
            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "jobId",
                    as: "payment"
                }
            }
        ]).toArray();

        const commissionSum = thisMonthsJobsWithPayments.reduce((sum, j) => {
            const p = j.payment?.[0] || {};
            return sum + (p.platformCommission || 0);
        }, 0);

        const jobsCompletedThisMonth = completedJobs.filter(j => new Date(j.completedAt) >= firstDayOfMonth);

        const manualCompletionSum = jobsCompletedThisMonth.reduce((sum, j) => {
            const txForThisJob = thisMonthTx.filter(tx => tx.jobId?.toString() === j._id.toString());
            const txTotalForJob = txForThisJob.reduce((s, t) => s + (t.amount || 0), 0);
            const remaining = Math.max(0, (j.finalAmount || j.budget || 0) - txTotalForJob);
            return sum + remaining;
        }, 0);

        const thisMonthSpent = releaseSum + commissionSum + manualCompletionSum;

        // 2. Completed Projects Count
        const completedProjectsCount = completedJobs.length;

        // 3. Secured Project Funds (Deposited in Escrow but not yet released) -> From Payments!
        // We only secure funds for active jobs
        const securedProjectFunds = activeJobsWithPayments.reduce((sum, j) => {
            const p = j.payment?.[0] || {};
            const held = (p.escrowAmount || 0) - (p.escrowReleased || 0);
            return sum + Math.max(0, held);
        }, 0);


        // 4. Spending Trend (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        sixMonthsAgo.setDate(1);

        const trendData = await db.collection("wallet_transactions").aggregate([
            {
                $match: {
                    $or: [{ userId: userId }, { userId: auth.userId.toString() }],
                    type: "debit",
                    status: "completed",
                    category: "milestone_payment",
                    createdAt: { $gte: sixMonthsAgo },
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    spent: { $sum: "$amount" },
                    projects: { $addToSet: "$jobId" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]).toArray();

        const formattedTrend = trendData.map(d => {
            const date = new Date(d._id.year, d._id.month - 1);
            return {
                month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
                spent: d.spent,
                projects: d.projects.length
            };
        });

        // 5. Top categories (jobs posted by this client)
        const categoryData = await db.collection("jobs").aggregate([
            {
                $match: {
                    $or: [{ clientId: userId }, { clientId: auth.userId.toString() }],
                    category: { $exists: true, $ne: null },
                    isDraft: { $ne: true }
                }
            },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    totalBudget: { $sum: "$budget" }
                }
            },
            { $sort: { totalBudget: -1 } },
            { $limit: 5 },
            { $project: { name: "$_id", value: "$totalBudget", count: 1, _id: 0 } }
        ]).toArray();

        const colors = ['#1B365D', '#FF6B35', '#4299E1', '#10B981', '#F59E0B'];
        const finalCategoryData = categoryData.map((c, i) => ({ ...c, color: colors[i % colors.length] }));

        // Get current wallet balance
        const wallet = await db.collection("wallets").findOne({
            $or: [{ userId: userId }, { userId: auth.userId.toString() }]
        });

        return NextResponse.json({
            success: true,
            stats: {
                totalSpent,
                thisMonthSpent,
                activeProjectsCount,
                completedProjectsCount,
                securedProjectFunds,
                walletBalance: wallet?.balance || 0,
                avgProjectSpend: activeProjectsCount + completedProjectsCount > 0
                    ? totalSpent / (activeProjectsCount + completedProjectsCount)
                    : 0,
                trend: formattedTrend,
                categories: finalCategoryData
            }
        });
    } catch (error) {
        console.error("Client Payment Center stats error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch client stats" }, { status: 500 });
    }
}
