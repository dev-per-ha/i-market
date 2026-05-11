// backend/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: [
        "student",
        "company",
        "university",
        "admin",
        "advisor",
        "supervisor",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    region: String,

    document: String,

    phone: {
      type: String,
    },

    // ✅ Academic info
    department: String,

    // 🔗 Advisor assigned to student
    advisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🔗 University linked to student
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      default: null,
    },

    // 🔗 Company linked to supervisor
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🔗 Supervisor assigned to student
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ Email verification
    verificationToken: {
      type: String,
      default: null,
    },

    verificationExpires: {
      type: Date,
      default: null,
    },

    // 🔗 Internship reference
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);