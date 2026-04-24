import mongoose from "mongoose";

const ChatRequestSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true
    },

    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },

    message: {
      type: String,
      default: null
    }
  },
  { 
    timestamps: true,
    collection: "chat_requests"
  }
);

// Indexes
ChatRequestSchema.index({ toUserId: 1, status: 1 });
ChatRequestSchema.index({ fromUserId: 1 });

export default mongoose.models.ChatRequest || mongoose.model("ChatRequest", ChatRequestSchema);