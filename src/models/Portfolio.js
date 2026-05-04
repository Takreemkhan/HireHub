import mongoose from "mongoose";

const PortfolioSchema = new mongoose.Schema(
  {
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: null
    },

    category: {
      type: String,
      default: null
    },

    images: [{
      type: String
    }],

    url: {
      type: String,
      default: null
    },

    technologies: [{
      type: String
    }],

    projectDate: {
      type: Date,
      default: null
    },

    isPublic: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true,
    collection: "portfolio"
  }
);

// Indexes
PortfolioSchema.index({ freelancerId: 1 });
PortfolioSchema.index({ isPublic: 1 });

export default mongoose.models.Portfolio || mongoose.model("Portfolio", PortfolioSchema);




