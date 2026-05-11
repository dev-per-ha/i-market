const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  supervisor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  week: Number,
  tasks: [String],
  description: String,

  attendance: {
  monday: { type: String, enum: ["present", "absent"], default: "present" },
  tuesday: { type: String, enum: ["present", "absent"], default: "present" },
  wednesday: { type: String, enum: ["present", "absent"], default: "present" },
  thursday: { type: String, enum: ["present", "absent"], default: "present" },
  friday: { type: String, enum: ["present", "absent"], default: "present" }
},

  performance: Number,

  // 🔥 KEY FIELD
  sharedWithAdvisor: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);