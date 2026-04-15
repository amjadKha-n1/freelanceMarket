const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      default: "client",
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    freelancerRequest: {
      status: {
        type: String,
        enum: ["none", "pending", "approved", "rejected"],
        default: "none",
      },
      submittedAt: {
        type: Date,
      },
      reviewedAt: {
        type: Date,
      },
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      notes: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
