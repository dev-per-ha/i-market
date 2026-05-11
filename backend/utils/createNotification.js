const Notification = require("../models/Notification");

const createNotification = async ({
  users,
  user,
  title,
  message,
  type,
  link,
  io,
}) => {
  try {
    const targetUsers = users || (user ? [user] : []);

    if (!targetUsers.length) {
      console.log("❌ Notification skipped: no users");
      return;
    }

    const notifications = await Notification.insertMany(
      targetUsers.map((u) => ({
        user: u,
        title,
        message,
        type,
        link,
        isRead: false,
      }))
    );

    // 🔥 STRICT DELIVERY (NO GLOBAL EMIT)
    if (io) {
      for (const notif of notifications) {
        const userId = notif.user.toString();

        // ONLY send to user room
        io.to(userId).emit("new_notification", {
          _id: notif._id,
          user: userId,
          title: notif.title,
          message: notif.message,
          type: notif.type,
          link: notif.link,
          isRead: false,
          createdAt: notif.createdAt,
        });
      }
    }

    return notifications;
  } catch (error) {
    console.error("❌ Notification Error:", error);
  }
};

module.exports = createNotification;