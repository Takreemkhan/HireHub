
import { ObjectId } from "mongodb";
import { COLLECTIONS } from "@/lib/mongodb";

/**
 * Payment document shape:
 * {
 *   _id: ObjectId,
 *   jobId: ObjectId,
 *   clientId: ObjectId,
 *   orderId: String,          // Razorpay order_id
 *   paymentId: String,        // Razorpay payment_id (set after verification)
 *   paymentType: String,      // "razorpay" | "wallet" | "split" | "escrow" | "deferred"
 *   payLater: Boolean,        // true if escrow funding is deferred
 *   paymentStatus: String,    // "pending" | "split_pending" | "paid" | "pending_assignment" | "escrow_funded" | "failed"
 *   amount: Number,           // Total charged NOW (0 for deferred)
 *   platformCommission: Number,
 *   featuredFee: Number,
 *   walletPart: Number,       // Only for split payments
 *   rzpPart: Number,          // Only for split payments
 *   escrowAmount: Number,
 *   escrowStatus: String,     // "none" | "held" | "released"
 *   escrowReleased: Number,
 *   paymentVerifiedAt: Date,
 *   createdAt: Date,
 *   updatedAt: Date,
 * }
 */

/**
 * Insert a new payment record linked to a job.
 * @param {import('mongodb').Db} db
 * @param {Object} data
 * @returns {Promise<ObjectId>} insertedId
 */
export async function createPaymentRecord(db, data) {
    const now = new Date();
    const doc = {
        jobId: data.jobId instanceof ObjectId ? data.jobId : new ObjectId(data.jobId),
        clientId: data.clientId instanceof ObjectId ? data.clientId : new ObjectId(data.clientId),
        orderId: data.orderId || null,
        paymentId: data.paymentId || null,
        paymentType: data.paymentType || "razorpay",
        payLater: !!data.payLater,
        paymentStatus: data.paymentStatus || "pending",
        amount: data.amount ?? 0,
        platformCommission: data.platformCommission ?? 0,
        featuredFee: data.featuredFee ?? 0,
        walletPart: data.walletPart ?? 0,
        rzpPart: data.rzpPart ?? 0,
        escrowAmount: data.escrowAmount ?? 0,
        escrowStatus: data.escrowStatus ?? "none",
        escrowReleased: data.escrowReleased ?? 0,
        paymentVerifiedAt: data.paymentVerifiedAt || null,
        createdAt: now,
        updatedAt: now,
    };

    const result = await db.collection(COLLECTIONS.PAYMENTS).insertOne(doc);
    return result.insertedId;
}

/**
 * Update a payment record by its MongoDB _id.
 * @param {import('mongodb').Db} db
 * @param {ObjectId|string} paymentId
 * @param {Object} update  — fields to $set
 */
export async function updatePaymentRecord(db, paymentId, update) {
    const id = paymentId instanceof ObjectId ? paymentId : new ObjectId(paymentId);
    return db.collection(COLLECTIONS.PAYMENTS).findOneAndUpdate(
        { _id: id },
        { $set: { ...update, updatedAt: new Date() } },
        { returnDocument: "after" }
    );
}

/**
 * Get payment record by jobId.
 * @param {import('mongodb').Db} db
 * @param {ObjectId|string} jobId
 */
export async function getPaymentByJobId(db, jobId) {
    const id = jobId instanceof ObjectId ? jobId : new ObjectId(jobId);
    const payments = await db.collection(COLLECTIONS.PAYMENTS)
        .find({ jobId: id })
        .sort({ createdAt: -1 })
        .limit(1)
        .toArray();
    return payments[0] || null;
}

/**
 * Get payment record by Razorpay orderId.
 * @param {import('mongodb').Db} db
 * @param {string} orderId
 */
export async function getPaymentByOrderId(db, orderId) {
    return db.collection(COLLECTIONS.PAYMENTS).findOne({ orderId });
}

/**
 * Get all payment records for a client.
 * @param {import('mongodb').Db} db
 * @param {ObjectId|string} clientId
 */
export async function getPaymentsByClientId(db, clientId) {
    const id = clientId instanceof ObjectId ? clientId : new ObjectId(clientId);
    return db.collection(COLLECTIONS.PAYMENTS)
        .find({ clientId: id })
        .sort({ createdAt: -1 })
        .toArray();
}
