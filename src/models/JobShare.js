import mongoose from "mongoose";

const JobShareSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    shareType: {
      type: String,
      enum: ["public_link", "direct_message"],
      required: true
    },

    // For public links
    shareToken: {
      type: String,
      default: null,
      unique: true,
      sparse: true
    },

    viewCount: {
      type: Number,
      default: 0
    },

    lastViewedAt: {
      type: Date,
      default: null
    },

    // For direct messages
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    },

    message: {
      type: String,
      default: null
    },

    isRead: {
      type: Boolean,
      default: false
    },

    // Common
    isActive: {
      type: Boolean,
      default: true
    },

    sharedAt: {
      type: Date,
      default: Date.now
    },

    expiresAt: {
      type: Date,
      default: null
    },

    deactivatedAt: {
      type: Date,
      default: null
    }
  },
  { 
    timestamps: true,
    collection: "job_shares"
  }
);

// Indexes
JobShareSchema.index({ jobId: 1 });
JobShareSchema.index({ shareToken: 1 });
JobShareSchema.index({ freelancerId: 1 });

export default mongoose.models.JobShare || mongoose.model("JobShare", JobShareSchema);