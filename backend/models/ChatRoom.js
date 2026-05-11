const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    isGroup: {
      type: Boolean,
      default: false,
    },

    groupName: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatRoom", chatRoomSchema);