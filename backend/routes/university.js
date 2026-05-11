// backend/routes/university.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/university/list
// Returns all users with role "university" (so students can apply)
router.get("/list", async (req, res) => {
  try {
    const universities = await User.find({ role: "university" }).select("name _id");
    res.json(universities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch universities" });
  }
});

module.exports = router;