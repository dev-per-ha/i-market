// models/StudentProfile.js
const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  userId: { // ✅ FIXED (was user)
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  fullName: String,
  department: String,

  skills: [String], // ✅ FIXED (was String)

  bio: String,
  phone: String,

  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    default: null,
  },
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);