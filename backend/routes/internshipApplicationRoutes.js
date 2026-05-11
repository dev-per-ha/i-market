const express = require("express");
const router = express.Router();

// 1️⃣ Import controller functions
const {
  applyToInternship,
  getCompanyApplications,
  updateApplicationStatus,
  assignSupervisor,
} = require("../controllers/internshipApplicationController");

// 2️⃣ Import auth middleware
const { protect } = require("../middlewares/authMiddleware");

// 3️⃣ Student applies
router.post("/apply", protect, applyToInternship);

// 4️⃣ Company views applications
router.get("/company", protect, getCompanyApplications);

// 5️⃣ Accept / Reject
router.put("/:id/status", protect, updateApplicationStatus);

// 6️⃣ Assign supervisor
router.put("/:id/assign-supervisor", protect, assignSupervisor);

module.exports = router;