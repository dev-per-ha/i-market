const express = require("express");
const router = express.Router();

const { getCV, saveCV } = require("../controllers/cvController");
const { protect } = require("../middlewares/authMiddleware");

// GET CV
router.get("/", protect, getCV);

// CREATE / UPDATE CV
router.post("/", protect, saveCV);

module.exports = router;