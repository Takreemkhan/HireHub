import mongoose from "mongoose";

const DraftSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    category: {
      type: String,
      default: null
    },

    subCategory: {
      type: String,
      default: null
    },

    title: {
      type: String,
      default: null
    },

    description: {
      type: String,
      default: null
    },

    budget: {
      type: Number,
      default: null
    },

    jobVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },

    freelancerSource: {
      type: String,
      default: null
    },

    projectDuration: {
      type: String,
      default: null
    },

    isDraft: {
      type: Boolean,
      default: true
    },

    status: {
      type: String,
      default: "draft"
    }
  },
  { 
    timestamps: true,
    collection: "drafts"
  }
);

// Indexes
DraftSchema.index({ clientId: 1 });
DraftSchema.index({ createdAt: -1 });

export default mongoose.models.Draft || mongoose.model("Draft", DraftSchema);