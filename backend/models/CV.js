const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ✅ one CV per student
    },

    phone: String,

    skills: [String],

    education: [
      {
        school: String,
        degree: String,
        year: String,
      },
    ],

    experience: [
      {
        title: String,
        company: String,
        duration: String,
        description: String, // ✅ added
      },
    ],

    projects: [
      {
        title: String,
        description: String,
        link: String, // ✅ added
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("CV", cvSchema);