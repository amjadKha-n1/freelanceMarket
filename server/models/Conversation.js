const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
      unique: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversation", conversationSchema);
