const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    fileUrl: {
      type: String,
      default: null,
    },

    fileType: {
      type: String,
      default: null,
    },

    edited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);