const createNotification = require("./createNotification");

/**
 * 🎯 CENTRAL NOTIFICATION ENGINE
 * Handles ALL system events in one place
 */
const notificationEngine = async (event, payload, io) => {
  try {
    switch (event) {

      // =========================
      // 💬 NEW CHAT MESSAGE
      // =========================
      case "NEW_MESSAGE": {
        const { recipients, sender, roomId } = payload;

        if (!recipients?.length) return;

        return await createNotification({
          users: recipients.map((u) => u._id),
          title: "New Message",
          message: `${sender.name} sent you a message`,
          type: "CHAT",
          link: `/chat/${roomId}`,
          io,
        });
      }

      // =========================
      // 📊 REPORT CREATED (SUPERVISOR → STUDENT)
      // =========================
      case "REPORT_CREATED": {
        const { student, week } = payload;

        return await createNotification({
          user: student._id,
          title: "New Weekly Report",
          message: `Your supervisor created week ${week} report`,
          type: "REPORT",
          link: "/student/reports",
          io,
        });
      }

      // =========================
      // 📊 REPORT UPDATED
      // =========================
      case "REPORT_UPDATED": {
        const { student } = payload;

        return await createNotification({
          user: student._id,
          title: "Report Updated",
          message: `Your weekly report has been updated`,
          type: "REPORT",
          link: "/student/reports",
          io,
        });
      }

      // =========================
      // 📤 REPORT SHARED (STUDENT → ADVISOR)
      // =========================
      case "REPORT_SHARED": {
        const { student, advisor } = payload;

        return await createNotification({
          user: advisor._id,
          title: "Report Shared",
          message: `${student.name} shared a report with you`,
          type: "REPORT",
          link: "/advisor/reports",
          io,
        });
      }

      default:
        console.log("❌ Unknown notification event:", event);
    }
  } catch (err) {
    console.error("❌ Notification Engine Error:", err);
  }
};

module.exports = notificationEngine;