const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    freePostsUsed: {
      type: Number,
      default: 0,
    },

    credits: {
      type: Number,
      default: 0, // each payment = 2 credits
    },

    amount: {
      type: Number,
      default: 500,
    },

    tx_ref: {
      type: String,
      default: null,
    },

    pendingTxRef: {
      type: String,
      default: null,
    },
    postsRemaining: {
  type: Number,
  default: 2,
},
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    subscriptionStart: Date,
    subscriptionEnd: Date,

    paidAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);