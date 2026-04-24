/**
 * Migration Script: Move payment fields from jobs collection → payments collection
 *
 * Run with: node src/scripts/migrate-payments.js
 */

"use strict";

const { MongoClient, ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

// ── Load .env.local manually (no dotenv dependency needed) ─────────────────
const envPath = path.resolve(__dirname, "../../.env.local");
if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx === -1) continue;
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) process.env[key] = val;
    }
    console.log("✅ Loaded .env.local");
} else {
    console.warn("⚠️  .env.local not found — using existing environment variables");
}

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = "freelancehub";

const PAYMENT_FIELDS_TO_MIGRATE = [
    "paymentStatus",
    "paymentOrderId",
    "paymentId",
    "walletPart",
    "rzpPart",
    "walletAmount",
    "remainingAmount",
    "platformCommission",
    "featuredFee",
    "totalAmount",
    "escrowAmount",
    "escrowReleased",
    "escrowStatus",
    "paymentVerifiedAt",
];

async function migrate() {
    if (!MONGODB_URI) {
        console.error("❌ MONGODB_URI is not set. Check your .env.local file.");
        process.exit(1);
    }

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    console.log("✅ Connected to MongoDB:", DB_NAME);

    const jobsCollection = db.collection("jobs");
    const paymentsCollection = db.collection("payments");

    // Find all jobs that have any payment-related field
    const jobsWithPaymentData = await jobsCollection.find({
        $or: PAYMENT_FIELDS_TO_MIGRATE.map((field) => ({ [field]: { $exists: true } })),
    }).toArray();

    console.log(`📦 Found ${jobsWithPaymentData.length} job(s) with payment data to migrate.`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const job of jobsWithPaymentData) {
        try {
            const jobId = job._id;

            // Skip if a payment record already exists for this job
            const existing = await paymentsCollection.findOne({ jobId });
            if (existing) {
                console.log(`⏭️  Skipped job ${jobId} — payment record already exists.`);
                skipped++;
                continue;
            }

            // Determine payment type
            let paymentType = "razorpay";
            const walletPart = job.walletPart || job.walletAmount || 0;
            const rzpPart = job.rzpPart || job.remainingAmount || 0;
            if (walletPart > 0 && rzpPart > 0) paymentType = "split";
            else if (walletPart > 0 && rzpPart === 0) paymentType = "wallet";
            else if (job.paymentStatus === "pending_assignment" && !job.paymentOrderId) paymentType = "deferred";

            // Build the payment document
            const paymentDoc = {
                jobId,
                clientId: job.clientId
                    ? (typeof job.clientId === "string" ? new ObjectId(job.clientId) : job.clientId)
                    : null,
                orderId: job.paymentOrderId || null,
                paymentId: job.paymentId || null,
                paymentType,
                paymentStatus: job.paymentStatus || "unknown",
                amount: job.totalAmount || 0,
                platformCommission: job.platformCommission || 0,
                featuredFee: job.featuredFee || 0,
                walletPart,
                rzpPart,
                escrowAmount: job.escrowAmount || 0,
                escrowStatus: job.escrowStatus || "none",
                escrowReleased: job.escrowReleased || 0,
                paymentVerifiedAt: job.paymentVerifiedAt || null,
                createdAt: job.createdAt || new Date(),
                updatedAt: new Date(),
            };

            await paymentsCollection.insertOne(paymentDoc);

            // Build the $unset object for all payment fields present in this job
            const unsetFields = {};
            PAYMENT_FIELDS_TO_MIGRATE.forEach((field) => {
                if (job[field] !== undefined) {
                    unsetFields[field] = "";
                }
            });

            if (Object.keys(unsetFields).length > 0) {
                await jobsCollection.updateOne(
                    { _id: jobId },
                    { $unset: unsetFields, $set: { updatedAt: new Date() } }
                );
            }

            console.log(`✅ Migrated job: ${jobId} (${job.title || "untitled"})`);
            migrated++;
        } catch (err) {
            console.error(`❌ Failed for job ${job._id}:`, err.message);
            failed++;
        }
    }

    console.log("\n─────────────────────────────────────");
    console.log(`Migration complete:`);
    console.log(`  ✅ Migrated : ${migrated}`);
    console.log(`  ⏭️  Skipped  : ${skipped}`);
    console.log(`  ❌ Failed   : ${failed}`);
    console.log("─────────────────────────────────────");

    await client.close();
    console.log("🔌 MongoDB connection closed.");
}

migrate().catch((err) => {
    console.error("Fatal migration error:", err);
    process.exit(1);
});
