import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const jobs = await db.collection('jobs').find({ isDraft: false }).toArray();
        let updatedCount = 0;

        for (const job of jobs) {
            let modified = false;
            let newEscrowAmount = job.escrowAmount || 0;

            const tx = await db.collection('transactions').findOne({
                jobId: job._id,
                status: 'captured'
            });

            if (tx && newEscrowAmount === 0) {
                newEscrowAmount = tx.amount;
                modified = true;
            }

            if (!tx && newEscrowAmount === 0 && (job.paymentStatus === 'deposit' || job.paymentStatus === 'paid' || job.status === 'completed')) {
                newEscrowAmount = job.budget;
                modified = true;
            }

            if (modified && newEscrowAmount > 0) {
                await db.collection('jobs').updateOne(
                    { _id: job._id },
                    {
                        $set: {
                            escrowAmount: newEscrowAmount,
                            escrowReleased: job.escrowReleased || 0,
                            escrowStatus: job.escrowStatus || (job.status === 'completed' ? 'released' : 'held')
                        }
                    }
                );

                const wtx = await db.collection('wallet_transactions').findOne({
                    jobId: job._id,
                    category: 'escrow_deposit'
                });

                if (!wtx) {
                    await db.collection('wallet_transactions').insertOne({
                        userId: job.clientId,
                        type: 'debit',
                        category: 'escrow_deposit',
                        amount: newEscrowAmount,
                        description: `Escrow securely deposited for: ${job.title}`,
                        jobId: job._id,
                        status: 'completed',
                        createdAt: job.createdAt
                    });
                }

                updatedCount++;
            }
        }

        return NextResponse.json({ success: true, updatedCount });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message });
    }
}
