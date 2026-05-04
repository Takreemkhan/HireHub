import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },

    role: {
      type: String,
      enum: ["client", "freelancer"],
      required: true
    },

    // Profile Images
    profileImage: {
      type: String,
      default: null
    },

    coverPhoto: {
      type: String,
      default: null
    },

    // Basic Info
    title: {
      type: String,
      default: null
    },

    about: {
      type: String,
      default: null
    },

    location: {
      type: String,
      default: null
    },

    hourlyRate: {
      type: Number,
      default: null
    },

    responseTime: {
      type: String,
      default: null
    },

    // Skills & Languages
    skills: [{
      type: String
    }],

    languages: [{
      language: String,
      level: String
    }],

    // Portfolio
    portfolio: [{
      _id: mongoose.Schema.Types.ObjectId,
      title: String,
      description: String,
      image: String,
      url: String,
      addedAt: Date
    }],

    // Work Experience
    workExperience: [{
      _id: mongoose.Schema.Types.ObjectId,
      title: String,
      company: String,
      startDate: String,
      endDate: String,
      duration: String,
      addedAt: Date
    }],

    // Education
    education: [{
      _id: mongoose.Schema.Types.ObjectId,
      degree: String,
      school: String,
      addedAt: Date
    }],

    // Certifications
    certifications: [{
      _id: mongoose.Schema.Types.ObjectId,
      name: String,
      issuedBy: String,
      year: String,
      addedAt: Date
    }],

    // Contact Info
    contactInfo: {
      email: String,
      phone: String,
      website: String,
      linkedin: String
    },

    // Stats
    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    totalEarned: {
      type: Number,
      default: 0
    },

    completedJobs: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    reviews: [{
      jobId: mongoose.Schema.Types.ObjectId,
      rating: Number,
      comment: String,
      reviewedBy: mongoose.Schema.Types.ObjectId,
      reviewedAt: Date
    }],

    memberSince: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true,
    collection: "profiles"
  }
);

// Indexes
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ role: 1 });
ProfileSchema.index({ skills: 1 });

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);




