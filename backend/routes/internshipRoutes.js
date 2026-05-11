const express = require("express");
const router = express.Router();
const { protect, allowRoles } = require("../middlewares/authMiddleware");
const {
  createInternship,
  getAllInternships,
  getCompanyApplications,
  updateApplicationStatus,
} = require("../controllers/internshipController");

// Company posts internship
router.post("/", protect, allowRoles("company"), createInternship);

// Students see all internships
router.get("/", protect, allowRoles("student"), getAllInternships);

// Company sees applications
router.get("/company/applications", protect, allowRoles("company"), getCompanyApplications);

// Update applicant status (now using internshipId and studentId)
router.put(
  "/applications/:internshipId/:studentId",
  protect,
  allowRoles("company"),
  updateApplicationStatus
);

module.exports = router;