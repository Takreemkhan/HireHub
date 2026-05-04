require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');

async function fixDb() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("Missing MONGODB_URI");
        process.exit(1);
    }

    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB.");

    const db = client.db('freelanceHub');

    // 1. Iterate over all jobs that are not drafts
    const jobs = await db.collection('jobs').find({ isDraft: false }).toArray();
    let updatedCount = 0;

    for (const job of jobs) {
        let modified = false;
        let newEscrowAmount = job.escrowAmount || 0;

        // Check if the job was paid for (using Razorpay transactions)
        const tx = await db.collection('transactions').findOne({
            jobId: job._id,
            status: 'captured'
        });

        if (tx && newEscrowAmount === 0) {
            newEscrowAmount = tx.amount;
            modified = true;
        }

        // Fallback: If it's open/completed and has a budget but no escrow amount, assume it was deposited if paymentStatus was "deposit" or "paid"
        if (!tx && newEscrowAmount === 0 && (job.paymentStatus === 'deposit' || job.paymentStatus === 'paid' || job.status === 'completed')) {
            newEscrowAmount = job.budget;
            modified = true;
        }

        if (modified && newEscrowAmount > 0) {
            // Set escrowAmount
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

            // Also ensure a wallet transaction exists for the deposit
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

    console.log(`Updated ${updatedCount} jobs to include proper escrow constraints.`);

    client.close();
}

fixDb().catch(console.error);
