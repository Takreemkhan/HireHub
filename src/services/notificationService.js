

import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

const COLLECTION = "notifications";

export async function createNotification({
    recipientId,
    senderId = null,
    type,
    title,
    body,
    meta = {},
    link = null,
}) {
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const doc = {
        recipientId: new ObjectId(recipientId),
        senderId: senderId ? new ObjectId(senderId) : null,
        type,
        title,
        body,
        meta: {
            jobId: meta.jobId ? new ObjectId(meta.jobId) : null,
            chatId: meta.chatId ? new ObjectId(meta.chatId) : null,
            proposalId: meta.proposalId ? new ObjectId(meta.proposalId) : null,
            jobTitle: meta.jobTitle ?? null,
            amount: meta.amount ?? null,
        },
        link,
        isRead: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const result = await db.collection(COLLECTION).insertOne(doc);
    const notification = { ...doc, _id: result.insertedId };


    try {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
        await fetch(`${socketUrl}/emit-notification`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                recipientId: recipientId.toString(),
                notification: {
                    _id: notification._id.toString(),
                    type: notification.type,
                    title: notification.title,
                    body: notification.body,
                    meta: notification.meta,
                    link: notification.link,
                    isRead: notification.isRead,
                    createdAt: notification.createdAt,
                },
            }),
        });
    } catch (err) {
        console.warn("⚠️  Could not emit real-time notification:", err.message);
    }

    return notification;
}




export const notifyNewMessage = ({ recipientId, senderId, senderName, chatId }) =>
    createNotification({
        recipientId,
        senderId,
        type: "message",
        title: "New Message",
        body: `${senderName} sent you a message.`,
        meta: { chatId },
        link: `/freelancer/messages`,
    });


export const notifyJobInvite = ({ recipientId, senderId, clientName, jobId, jobTitle }) =>
    createNotification({
        recipientId,
        senderId,
        type: "job_invite",
        title: "Job Invitation",
        body: `${clientName} invited you to: "${jobTitle}"`,
        meta: { jobId, jobTitle },
        link: `/freelancer-dashboard?tab=invitations`,
    });


export const notifyProposalUpdate = ({ recipientId, senderId, status, jobTitle, jobId, proposalId }) =>
    createNotification({
        recipientId,
        senderId,
        type: "proposal_update",
        title: status === "accepted" ? "🎉 Proposal Accepted!" : "Proposal Update",
        body: status === "accepted"
            ? `Your proposal for "${jobTitle}" was accepted!`
            : `Your proposal for "${jobTitle}" was ${status}.`,
        meta: { jobId, jobTitle, proposalId },
        link: `/freelancer-dashboard?tab=current`,
    });


export const notifyRecommendedJob = ({ recipientId, jobId, jobTitle, budget }) =>
    createNotification({
        recipientId,
        senderId: null,
        type: "recommended_job",
        title: "Recommended Job",
        body: `A new job matches your skills: "${jobTitle}" — Budget $${budget}`,
        meta: { jobId, jobTitle, amount: budget },
        link: `/project-detail-pages?jobId=${jobId}`,
    });


export const notifyPayment = ({ recipientId, senderId, amount, jobTitle, jobId }) =>
    createNotification({
        recipientId,
        senderId,
        type: "payment",
        title: "Payment Released",
        body: `You received $${amount} for "${jobTitle}".`,
        meta: { jobId, jobTitle, amount },
        link: `/payment-center`,
    });


export const notifyReview = ({ recipientId, senderId, clientName, jobTitle, jobId }) =>
    createNotification({
        recipientId,
        senderId,
        type: "review",
        title: "New Review",
        body: `${clientName} left you a review for "${jobTitle}".`,
        meta: { jobId, jobTitle },
        link: `/freelancer-dashboard?tab=overview`,
    });
