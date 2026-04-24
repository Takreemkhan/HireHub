/**
 * GET  /api/freelancer/saved-jobs          → all freelancer job 
 * POST /api/freelancer/saved-jobs          → job save/unsave toggle (returns { saved: true/false })
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// ── GET ────────────────────────────────────────────────────────────────────────
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const freelancerId = new ObjectId(session.user.id);

        // Saved job IDs for this freelancer
        const savedDocs = await db
            .collection(COLLECTIONS.SAVED_JOBS)
            .find({ freelancerId })
            .toArray();

        const jobIds = savedDocs.map((d) => d.jobId);

        if (jobIds.length === 0) {
            return NextResponse.json({ success: true, jobs: [], savedJobIds: [] });
        }

        // Fetch full job details with clientInfo (same $lookup as browse)
        const jobs = await db
            .collection(COLLECTIONS.JOBS)
            .aggregate([
                { $match: { _id: { $in: jobIds }, status: "active" } },
                {
                    $addFields: {
                        clientIdObj: {
                            $cond: {
                                if: { $eq: [{ $type: "$clientId" }, "objectId"] },
                                then: "$clientId",
                                else: { $toObjectId: "$clientId" },
                            },
                        },
                    },
                },
                {
                    $lookup: {
                        from: COLLECTIONS.USERS,
                        localField: "clientIdObj",
                        foreignField: "_id",
                        as: "clientData",
                        pipeline: [
                            { $project: { name: 1, firstName: 1, lastName: 1, rating: 1 } },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: COLLECTIONS.PROPOSALS,
                        localField: "_id",
                        foreignField: "jobId",
                        as: "proposalDocs",
                        pipeline: [{ $match: { isActive: true } }, { $count: "count" }],
                    },
                },
                {
                    $addFields: {
                        clientInfo: {
                            name: { $ifNull: [{ $arrayElemAt: ["$clientData.name", 0] }, "Anonymous"] },
                            firstName: { $ifNull: [{ $arrayElemAt: ["$clientData.firstName", 0] }, ""] },
                            lastName: { $ifNull: [{ $arrayElemAt: ["$clientData.lastName", 0] }, ""] },
                            rating: { $ifNull: [{ $arrayElemAt: ["$clientData.rating", 0] }, 0] },
                        },
                        proposalCount: {
                            $ifNull: [{ $arrayElemAt: ["$proposalDocs.count", 0] }, 0],
                        },
                    },
                },
                { $project: { clientData: 0, proposalDocs: 0, clientIdObj: 0 } },
            ])
            .toArray();

        return NextResponse.json({
            success: true,
            jobs,
            savedJobIds: jobIds.map((id) => id.toString()),
        });
    } catch (error) {
        console.error("GET saved-jobs error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// ── POST (toggle) ──────────────────────────────────────────────────────────────
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { jobId } = await req.json();
        if (!jobId || !ObjectId.isValid(jobId)) {
            return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const col = db.collection(COLLECTIONS.SAVED_JOBS);

        const freelancerId = new ObjectId(session.user.id);
        const jobObjId = new ObjectId(jobId);

        const existing = await col.findOne({ freelancerId, jobId: jobObjId });

        if (existing) {
            // Already saved → unsave
            await col.deleteOne({ _id: existing._id });
            return NextResponse.json({ success: true, saved: false });
        } else {
            // Not saved → save
            await col.insertOne({
                freelancerId,
                jobId: jobObjId,
                savedAt: new Date(),
            });
            return NextResponse.json({ success: true, saved: true });
        }
    } catch (error) {
        console.error("POST saved-jobs error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}