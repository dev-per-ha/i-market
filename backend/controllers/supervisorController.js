// controllers/supervisorController.js
const User = require("../models/User");

exports.getAssignedStudents = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const supervisorId = req.user._id;

    // Find students assigned to this supervisor
    const students = await User.find({ supervisor: supervisorId, role: "student" })
      .select("name email department status university")
      .populate("university", "name"); // populate university name

    res.json(students);
  } catch (error) {
    console.error("Error fetching supervisor students:", error);
    res.status(500).json({ message: "Server error fetching students" });
  }
};



// GET STUDENTS FOR SUPERVISOR
exports.getMyStudents = async (req, res) => {
  try {
    const students = await User.find({ supervisor: req.user._id });

    res.json(students);
  } catch (err) {
    console.error("SUPERVISOR STUDENTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};