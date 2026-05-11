// backend/models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    faydaNumber: { type: String, required: true, unique: true },
    university: { type: String },
    department: { type: String },
    yearOfStudy: { type: String },
    bio: { type: String },
    password: { type: String, required: true } // if using authentication
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);