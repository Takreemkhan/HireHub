import mongoose from "mongoose";

const DisputeSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
            index: true
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
            index: true
        },
        milestoneId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Milestone",
            default: null, // null if entire job
            index: true
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        freelancerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        raisedBy: {
            type: String,
            enum: ["client", "freelancer"],
            required: true
        },
        disputeType: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        resolution: {
            type: String,
            required: true
        },
        partialAmount: {
            type: Number,
            default: null
        },
        additionalNotes: {
            type: String,
            default: ""
        },
        mediaFiles: [
            {
                fileUrl: String,
                fileName: String,
                fileType: String,
                fileSize: Number
            }
        ],
        status: {
            type: String,
            enum: ["open", "in_review", "resolved", "rejected"],
            default: "open",
            index: true
        }
    },
    {
        timestamps: true,
        collection: "disputes"
    }
);

export default mongoose.models.Dispute || mongoose.model("Dispute", DisputeSchema);
