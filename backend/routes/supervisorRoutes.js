// routes/supervisorRoutes.js
const express = require("express");
const router = express.Router();
const { getMyStudents } = require("../controllers/supervisorController");
const { protect, allowRoles } = require("../middlewares/authMiddleware");

// Only supervisors can access
router.get("/my-students", protect, allowRoles("supervisor"), getMyStudents);

module.exports = router;