import mongoose from "mongoose";

const OTPVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true
    },

    otp: {
      type: String,
      required: true
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true
    },

    verified: {
      type: Boolean,
      default: false
    },

    verifiedAt: {
      type: Date,
      default: null
    },

    // Rate limiting
    attempts: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true,
    collection: "otp_verifications"
  }
);

// Indexes
OTPVerificationSchema.index({ email: 1 });
OTPVerificationSchema.index({ expiresAt: 1 });
OTPVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 }); // Auto-delete after 1 hour

export default mongoose.models.OTPVerification || mongoose.model("OTPVerification", OTPVerificationSchema);