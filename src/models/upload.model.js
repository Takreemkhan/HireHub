import mongoose from "mongoose";

const UploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    fileName: {
      type: String,
      required: true,
      trim: true
    },

    storedName: {
      type: String,
      required: true,
      unique: true
    },

    fileType: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      required: true
    },

    url: {
      type: String,
      required: true
    },

    // 📌 Document Type
    documentType: {
      type: String,
      enum: [
        "aadhar",
        "pan", 
        "voter_id",
        "driving_license",
        "passport",
        "bank_statement",
       
        "other"
      ],
      required: true
    },

    // 📌 Document Category
    category: {
      type: String,
      enum: ["identity", "address", "income", "education", "professional", "other"],
      required: true
    },

    // 📌 Verification Status
    verificationStatus: {
      type: String,
      enum: ["under_review", "approved", "rejected"],
      default: "pending"
    },

    // 📌 Approval Details
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null
    },

    approvedAt: {
      type: Date,
      default: null
    },

    // 📌 Rejection Details
    rejectionReason: {
      type: String,
      default: null
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null
    },

    rejectedAt: {
      type: Date,
      default: null
    },

    // 📌 Admin Notes
    adminNotes: {
      type: String,
      default: null
    },

    // 📌 Document Expiry
    expiryDate: {
      type: Date,
      default: null
    },

    // Document Number (for identity docs)
    documentNumber: {
      type: String,
      trim: true,
      default: null
    },

    //Document Metadata
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // 📌 Verification History
    verificationHistory: [
      {
        status: String,
        comment: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Admin"
        },
        updatedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: "uploads"
  }
);

// Indexes for better performance
UploadSchema.index({ userId: 1, verificationStatus: 1 });
UploadSchema.index({ documentType: 1, verificationStatus: 1 });
UploadSchema.index({ createdAt: -1 });
UploadSchema.index({ updatedAt: -1 });

export default mongoose.models.Upload || mongoose.model("Upload", UploadSchema);