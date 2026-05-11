const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = require("../controllers/notificationController");

// ✅ FIXED IMPORT
const { protect } = require("../middlewares/authMiddleware");

// ================= ROUTES =================

// Get notifications + unread count
router.get("/", protect, getMyNotifications);

// Mark one as read
router.put("/:id/read", protect, markAsRead);

// Mark all as read
router.put("/read-all", protect, markAllAsRead);

// Delete one notification
router.delete("/:id", protect, deleteNotification);

// Delete all notifications
router.delete("/", protect, clearAllNotifications);

module.exports = router;