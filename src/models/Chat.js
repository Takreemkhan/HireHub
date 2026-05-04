import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }],

    messages: [{
      _id: mongoose.Schema.Types.ObjectId,
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      content: {
        type: String,
        required: true
      },
      messageType: {
        type: String,
        enum: ["text", "job_share"],
        default: "text"
      },
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        default: null
      },
      isRead: {
        type: Boolean,
        default: false
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }],

    lastMessage: {
      type: String,
      default: null
    },

    lastMessageAt: {
      type: Date,
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ["active", "disputed", "resolved"],
      default: "active"
    }
  },
  {
    timestamps: true,
    collection: "chats"
  }
);

// Indexes
ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastMessageAt: -1 });

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);