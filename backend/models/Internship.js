// backend/models/Internship.js
const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    department: { type: String },
    location: { type: String },
    duration: { type: String },
    slots: { type: Number, default: 1 },
    gpa: { type: Number },
    requiredSkills: [{ type: String }],
    company: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);