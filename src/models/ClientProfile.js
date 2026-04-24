import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    hourlyRate: {
      type: Number,
      required: true,
      min: 1,
      default: 25
    },

    currency: {
      type: String,
      default: "USD"
    },

    professionalHeadline: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100
    },

    topSkills: {
      type: [String],
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length >= 3 && arr.length <= 20;
        },
        message: "You must have between 3 and 20 skills"
      }
    },

    summary: {
      type: String,
      required: true,
      minLength: 50,
      maxLength: 5000
    },

    availability: {
      type: String,
      enum: ["available", "busy", "not-available"],
      default: "available"
    },

    profileCompleteness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    matchingJobsCount: {
      type: Number,
      default: 0
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for faster queries
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ topSkills: 1 });

// Method to calculate profile completeness
ProfileSchema.methods.calculateCompleteness = function() {
  let completeness = 0;
  
  if (this.hourlyRate) completeness += 15;
  if (this.professionalHeadline && this.professionalHeadline.length > 10) completeness += 20;
  if (this.topSkills && this.topSkills.length >= 5) completeness += 25;
  if (this.summary && this.summary.length >= 100) completeness += 40;
  
  this.profileCompleteness = completeness;
  return completeness;
};

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
