import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      enum: ["client", "freelancer","admin"],
      required: true
    },

    image: {
      type: String,
      default: null
    },

    // Email Verification
    emailVerified: {
      type: Boolean,
      default: false
    },

    emailVerifiedAt: {
      type: Date,
      default: null
    },
documentVerified:{
   type: Boolean,
  default: false
},
documentVerifiedAt: {
      type: Date,
      default: null
    },
    phoneVerified:{
   type: Boolean,
  default: false
},
phoneVerifiedAt: {
      type: Date,
      default: null
    },
    // Rating
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    // Status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true,
    collection: "users"
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);