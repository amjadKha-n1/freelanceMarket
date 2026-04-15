const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
      unique: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("review", reviewSchema);
