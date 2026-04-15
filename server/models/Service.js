const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    deliveryTime: {
      type: Number,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    freelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("service", serviceSchema);
