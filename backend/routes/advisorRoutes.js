const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const { getMyStudents } = require("../controllers/advisorController");

// ✅ THIS IS THE ROUTE YOUR FRONTEND CALLS
router.get("/my-students", protect, getMyStudents);

module.exports = router;