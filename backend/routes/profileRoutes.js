// routes/profileRoutes.js

const express = require("express");
const {
  createOrUpdateProfile,
  getMyProfile,
  getProfileById,
} = require("../controllers/profileController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

// CREATE or UPDATE
router.post("/", protect, upload.single("image"), createOrUpdateProfile);

// GET MY PROFILE
router.get("/me", protect, getMyProfile);

// GET BY ID
router.get("/:id", protect, getProfileById);

module.exports = router; // ✅ VERY IMPORTANT