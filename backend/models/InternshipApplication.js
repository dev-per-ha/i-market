// backend/models/InternshipApplication.js
const mongoose = require("mongoose");

const internshipApplicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InternshipPost",
    },

    email: String,
    coverLetter: String,
    cvFile: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InternshipApplication",
  internshipApplicationSchema
);