import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/**
 * GET /api/business-pages/[businessId]/stats
 * Returns job & spend stats for a business page dashboard.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ businessId: string }> }
) {
  const session: any = await getServerSession(authOptions as any);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { businessId } = await params;
    const db = (await clientPromise).db(DB_NAME);

    // Verify ownership
    const page = await db
      .collection(COLLECTIONS.BUSINESS_PAGES)
      .findOne({ _id: new ObjectId(businessId) });

    if (!page || page.ownerId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bpObjId = new ObjectId(businessId);

    // Jobs posted through this business page
    const [totalJobs, activeJobs, completedJobs] = await Promise.all([
      db.collection(COLLECTIONS.JOBS).countDocuments({ businessPageId: bpObjId }),
      db.collection(COLLECTIONS.JOBS).countDocuments({ businessPageId: bpObjId, status: "open" }),
      db.collection(COLLECTIONS.JOBS).countDocuments({ businessPageId: bpObjId, status: "completed" }),
    ]);

    // Total spend through this business page
    const spendAgg = await db.collection(COLLECTIONS.PAYMENTS).aggregate([
      { $match: { businessPageId: bpObjId, paymentStatus: { $in: ["paid", "released"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).toArray();
    const totalSpend = spendAgg[0]?.total || 0;

    // Recent proposals on business-page jobs
    const bpJobIds = (
      await db
        .collection(COLLECTIONS.JOBS)
        .find({ businessPageId: bpObjId }, { projection: { _id: 1 } })
        .toArray()
    ).map((j) => j._id);

    const recentProposals = await db
      .collection(COLLECTIONS.PROPOSALS)
      .find({ jobId: { $in: bpJobIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({
      stats: { totalJobs, activeJobs, completedJobs, totalSpend },
      recentProposals: recentProposals.map((p) => ({
        ...p,
        _id: p._id.toString(),
        jobId: p.jobId?.toString(),
        freelancerId: p.freelancerId?.toString(),
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
