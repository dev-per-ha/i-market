// backend/routes/chatRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const { protect } = require("../middlewares/authMiddleware");

const {
  accessChat,
  createGroupChat,
  getMyChats,
  getChatById,
  sendMessage,
  editMessage,
  deleteMessage,
} = require("../controllers/chatController");

// =====================
// MULTER CONFIG
// =====================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// =====================
// CHAT ROUTES
// =====================

// 1-to-1 chat
router.post("/access", protect, accessChat);

// Group chat
router.post("/group", protect, createGroupChat);

// Get all chats
router.get("/", protect, getMyChats);

// Get chat by ID
router.get("/:id", protect, getChatById);

// =====================
// SEND MESSAGE (TEXT + FILE)
// =====================
router.post(
  "/message",
  protect,
  upload.single("file"),
  sendMessage
);

// =====================
// EDIT MESSAGE
// =====================
router.put("/message/:messageId", protect, editMessage);

// =====================
// DELETE MESSAGE
// =====================
router.delete("/message/:messageId", protect, deleteMessage);

module.exports = router;