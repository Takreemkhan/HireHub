import mongoose from "mongoose";

const ProposalSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true
    },

    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    coverLetter: {
      type: String,
      default: null
    },

    proposedBudget: {
      type: Number,
      default: null
    },

    estimatedDuration: {
      type: String,
      default: null
    },

    milestones: [{
      title: String,
      description: String,
      amount: Number,
      duration: String
    }],

    attachments: [{
      type: String
    }],

    // Draft/Published
    isDraft: {
      type: Boolean,
      default: false,
      index: true
    },

    status: {
      type: String,
      enum: ["draft", "pending", "accepted", "rejected", "withdrawn"],
      default: "draft",
      index: true
    },

    isActive: {
      type: Boolean,
      default: false
    },

    // Submission
    submittedAt: {
      type: Date,
      default: null
    }
  },
  { 
    timestamps: true,
    collection: "proposals"
  }
);

// Indexes
ProposalSchema.index({ jobId: 1, freelancerId: 1 });
ProposalSchema.index({ freelancerId: 1, isDraft: 1 });
ProposalSchema.index({ freelancerId: 1, status: 1 });

export default mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema);