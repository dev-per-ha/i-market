// models/UniversityApplication.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
    },

    fullName: String,
    department: String,
    idImage: String, // uploaded file

    status: {
      type: String,
      enum: ["waiting", "approved", "rejected"],
      default: "waiting",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UniversityApplication", applicationSchema);