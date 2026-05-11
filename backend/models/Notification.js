const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
  type: String,
  enum: [
"APPLICATION_STATUS",
    "NEW_APPLICATION",
    "NEW_INTERNSHIP",
    "ADVISOR_ASSIGNED",
        "UNIVERSITY_APPLICATION",

    "CHAT",
    "REPORT",
    "ATTENDANCE",
    "SUPERVISOR_ASSIGNED",
    "REPORT_SHARE", 
    "SYSTEM",
    "UNIVERSITY_STATUS",
    "ADMIN"   // ✅ ADD THIS
  ],
},

    link: {
      type: String, // frontend route
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);