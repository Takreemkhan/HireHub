import { NextResponse } from "next/server";
import clientPromise, { DB_NAME } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyAuth, unauthorizedResponse } from "@/lib/auth.middleware";

export async function POST(req: Request) {
    try {
        const auth = await verifyAuth(req);
        if (!auth.authenticated) return unauthorizedResponse(auth.error);

        const body = await req.json();
        const {
            chatId,
            jobId,
            milestoneId,
            clientId,
            freelancerId,
            raisedBy,
            disputeType,
            title,
            description,
            resolution,
            partialAmount,
            additionalNotes,
            mediaFiles
        } = body;

        // Basic validation
        if (!chatId || !jobId || !clientId || !freelancerId || !raisedBy || !disputeType || !title || !description || !resolution) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(DB_NAME);

        const disputeData = {
            chatId: new ObjectId(chatId),
            jobId: new ObjectId(jobId),
            milestoneId: milestoneId ? new ObjectId(milestoneId) : null,
            clientId: new ObjectId(clientId),
            freelancerId: new ObjectId(freelancerId),
            raisedBy,
            disputeType,
            title,
            description,
            resolution,
            partialAmount: partialAmount ? Number(partialAmount) : null,
            additionalNotes: additionalNotes || "",
            mediaFiles: mediaFiles || [],
            status: "open",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection("disputes").insertOne(disputeData);

        // Update chat status to "disputed" to freeze communication
        await db.collection("chats").updateOne(
            { _id: new ObjectId(chatId) },
            { $set: { status: "disputed", updatedAt: new Date() } }
        );

        return NextResponse.json({
            success: true,
            message: "Dispute created and chat frozen",
            disputeId: result.insertedId.toString()
        });
    } catch (error) {
        console.error("Create dispute error:", error);
        return NextResponse.json({ success: false, message: "Failed to file dispute" }, { status: 500 });
    }
}
