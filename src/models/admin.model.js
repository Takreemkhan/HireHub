import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"]
    },

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"]
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"]
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin"
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
    },

    // Login tracking
    lastLogin: {
      type: Date,
      default: null
    },

    loginCount: {
      type: Number,
      default: 0
    },

    // Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { 
    timestamps: true,
    collection: "users"
  }
);

// Hash password before saving
AdminSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Set full name
    this.name = `${this.firstName} ${this.lastName}`.trim();
    
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update last login
AdminSchema.methods.updateLoginStats = async function() {
  this.lastLogin = new Date();
  this.loginCount = (this.loginCount || 0) + 1;
  await this.save();
};

// Remove password from JSON response
AdminSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  delete obj.__v;
  return obj;
};

// Indexes
AdminSchema.index({ email: 1 });
AdminSchema.index({ role: 1 });
AdminSchema.index({ isActive: 1 });

export default mongoose.models.Admin || mongoose.model("Admin", AdminSchema);