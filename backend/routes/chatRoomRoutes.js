const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");

// ✅ IMPORT CORRECT FUNCTIONS
const {
  getUserRooms,
  createRoom
} = require("../controllers/chatRoomController");

// ✅ ROUTES

// Get or create chat room for internship
router.get("/:internshipId", protect, getUserRooms);

// Create room (optional)
router.post("/", protect, createRoom);

module.exports = router;