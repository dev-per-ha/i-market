const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, default: "active" }, // Add this field
});

module.exports = mongoose.model("University", universitySchema);