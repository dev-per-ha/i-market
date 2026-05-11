// controllers/advisorController.js
const User = require("../models/User");



// GET STUDENTS FOR ADVISOR
exports.getMyStudents = async (req, res) => {
  try {
    const students = await User.find({ advisor: req.user._id });

    res.json(students);
  } catch (err) {
    console.error("ADVISOR STUDENTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};