const Notification = require("../models/Notification");

// ================= GET MY NOTIFICATIONS =================
exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50); // prevent overload

    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (err) {
    console.error("GET NOTIFICATIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

// ================= MARK ONE AS READ =================
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Marked as read" });
  } catch (err) {
    console.error("MARK READ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= MARK ALL AS READ =================
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("MARK ALL READ ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE NOTIFICATION =================
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Not found" });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await notification.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE NOTIFICATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE ALL =================
exports.clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });

    res.json({ message: "All notifications cleared" });
  } catch (err) {
    console.error("CLEAR ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};