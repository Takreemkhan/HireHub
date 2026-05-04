// import mongoose from "mongoose";

// const JobSchema = new mongoose.Schema(
//   {
//     clientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true
//     },

//     category: {
//       type: String,
//       required: true
//     },

//     subCategory: {
//       type: String,
//       required: true
//     },

//     title: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     description: {
//       type: String,
//       required: true
//     },

//     budget: {
//       type: Number,
//       required: true
//     },



//     jobVisibility: {
//       type: String,
//       enum: ["public", "private"],
//       default: "public"
//     },

//     freelancerSource: {
//       type: String, 
//       required: true

//     },

//     projectDuration: {
//       type: String,
//       required: true

//     },

//     status: {
//       type: String,
//       enum: ["open", "in-progress", "completed", "closed"],
//       default: "open"
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Job || mongoose.model("Job", JobSchema);



import mongoose from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },


    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true
    },

    category: {
      type: String,
      required: true,
      index: true
    },

    subCategory: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    budget: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      enum: ["USD", "INR", "GBP", "EUR"],
      default: "USD"
    },
    jobVisibility: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },

    freelancerSource: {
      type: String,
      required: true
    },

    projectDuration: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "closed"],
      default: "open",
      index: true
    },


    isDraft: {
      type: Boolean,
      default: false
    },


    proposalCount: {
      type: Number,
      default: 0
    },

    acceptedProposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proposal",
      default: null
    },


    startedAt: {
      type: Date,
      default: null
    },

    completedAt: {
      type: Date,
      default: null
    },

    durationInDays: {
      type: Number,
      default: null
    },

    finalAmount: {
      type: Number,
      default: null
    },

    completionNotes: {
      type: String,
      default: null
    },


    submittedForReview: {
      type: Boolean,
      default: false
    },

    submittedAt: {
      type: Date,
      default: null
    },

    submissionNotes: {
      type: String,
      default: null
    },

    deliverables: [{
      type: String
    }],


    clientReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
      },
      comment: {
        type: String,
        default: null
      },
      reviewedAt: {
        type: Date,
        default: null
      }
    },

    freelancerReview: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
      },
      comment: {
        type: String,
        default: null
      },
      reviewedAt: {
        type: Date,
        default: null
      }
    },

    // ── Featured Job ──────────────────────────────────────────
    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },

    featuredUntil: {
      type: Date,
      default: null
    },

    featuredFee: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: "jobs"
  }
);


JobSchema.index({ clientId: 1, status: 1 });
JobSchema.index({ freelancerId: 1, status: 1 });
JobSchema.index({ status: 1, createdAt: -1 });
JobSchema.index({ category: 1, status: 1 });


JobSchema.virtual('isActive').get(function () {
  return this.status === 'open' || this.status === 'in-progress';
});


JobSchema.virtual('canBeReviewed').get(function () {
  return this.status === 'completed';
});


JobSchema.methods.calculateDuration = function () {
  if (this.completedAt && this.startedAt) {
    const diffTime = Math.abs(this.completedAt - this.startedAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
};


JobSchema.pre('save', function (next) {
  if (this.status === 'completed' && this.completedAt && this.startedAt && !this.durationInDays) {
    this.durationInDays = this.calculateDuration();
  }
  next();
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);