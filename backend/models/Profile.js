// models/Profile.js

import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  fullName: String,
  department: String,
  skills: [String],
  bio: String,
  phone: String,

  profileImage: String,

  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University"
  },

  advisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  isApproved: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);