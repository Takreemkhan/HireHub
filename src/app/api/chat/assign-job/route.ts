import { NextResponse } from "next/server";
import clientPromise, { DB_NAME, COLLECTIONS } from "@/lib/mongodb";
import { ObjectId } from "mongodb";


export async function POST(req: Request) {
    try {
        const { chatId, jobId, freelancerId } = await req.json();
        if (!chatId) return NextResponse.json({ error: "chatId required" }, { status: 400 });

        const db = (await clientPromise).db(DB_NAME);

        await db.collection(COLLECTIONS.CHATS).updateOne(
            { _id: new ObjectId(chatId) },
            {
                $set: {
                    assignedJob: {
                        jobId: jobId || null,
                        freelancerId: freelancerId || null,
                        assignedAt: new Date(),
                    },
                    updatedAt: new Date(),
                },
            }
        );

        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get("chatId");
        if (!chatId) return NextResponse.json({ assigned: false });

        const db = (await clientPromise).db(DB_NAME);
        const chat = await db.collection(COLLECTIONS.CHATS).findOne(
            { _id: new ObjectId(chatId) }
        );

        if (!chat) return NextResponse.json({ assigned: false });

        if (chat.assignedJob?.jobId) {
            const job = await db.collection(COLLECTIONS.JOBS).findOne(
                { _id: new ObjectId(chat.assignedJob.jobId) },
                { projection: { title: 1, _id: 1, status: 1, currency: 1, paymentStatus: 1 } }
            );
            if (job) {
                const paymentInfo = await db.collection(COLLECTIONS.PAYMENTS).findOne({ jobId: job._id });
                return NextResponse.json({
                    assigned: true,
                    pinnedJob: {
                        jobId: job._id.toString(),
                        jobTitle: job.title,
                        jobStatus: job.status,
                        jobCurrency: job.currency || "USD",
                        paymentStatus: paymentInfo?.paymentStatus || job.paymentStatus,
                        assigned: true
                    }
                });
            }
        }

        // If not assigned, search for the active proposal between the two participants
        if (chat.participants?.length === 2) {
            const userId1 = chat.participants[0].toString();
            const userId2 = chat.participants[1].toString();

            const jobsOwnedBy1 = await db.collection(COLLECTIONS.JOBS).find({ clientId: new ObjectId(userId1) }).toArray();
            const jobsOwnedBy2 = await db.collection(COLLECTIONS.JOBS).find({ clientId: new ObjectId(userId2) }).toArray();
            const jobIdsOwnedBy1 = jobsOwnedBy1.map(j => j._id);
            const jobIdsOwnedBy2 = jobsOwnedBy2.map(j => j._id);

            const activeProposal = await db.collection(COLLECTIONS.PROPOSALS).findOne(
                {
                    $or: [
                        { freelancerId: new ObjectId(userId2), jobId: { $in: jobIdsOwnedBy1 } },
                        { freelancerId: new ObjectId(userId1), jobId: { $in: jobIdsOwnedBy2 } }
                    ]
                },
                { sort: { createdAt: -1 } }
            );

            if (activeProposal) {
                const job = await db.collection(COLLECTIONS.JOBS).findOne(
                    { _id: activeProposal.jobId },
                    { projection: { title: 1, _id: 1, currency: 1, paymentStatus: 1 } }
                );
                if (job) {
                    const paymentInfo = await db.collection(COLLECTIONS.PAYMENTS).findOne({ jobId: job._id });
                    return NextResponse.json({
                        assigned: false,
                        pinnedJob: {
                            jobId: job._id.toString(),
                            jobTitle: job.title,
                            jobCurrency: job.currency || "USD",
                            paymentStatus: paymentInfo?.paymentStatus || job.paymentStatus,
                            assigned: false
                        }
                    });
                }
            }
        }

        return NextResponse.json({
            assigned: false,
            pinnedJob: null,
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
