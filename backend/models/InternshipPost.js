const mongoose = require("mongoose");

const internshipPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    department: { type: String },
    location: { type: String },
    duration: { type: String },
 jobType: {
      type: String,
      enum: ["remote", "full-time", "hybrid"],
      required: true,
    },     applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    slots: { type: Number, required: true },
    gpa: { type: Number, required: true },

    requiredSkills: [{ type: String }],

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InternshipPost", internshipPostSchema);