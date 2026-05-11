const express = require("express");
const router = express.Router();

const {
  createReport,
  updateReport,
  deleteReport,
  getStudentReports,
  getAdvisorReports,
  getSupervisorReports,
  shareReport
} = require("../controllers/reportController");

const { protect, allowRoles } = require("../middlewares/authMiddleware");

// CREATE
router.post("/:studentId", protect, allowRoles("supervisor"), createReport);

// GET
router.get("/student", protect, allowRoles("student"), getStudentReports);
router.get("/advisor/:studentId", protect, allowRoles("advisor"), getAdvisorReports);
router.get("/supervisor/:studentId", protect, allowRoles("supervisor"), getSupervisorReports);

// UPDATE / DELETE
router.put("/:id", protect, allowRoles("supervisor"), updateReport);
router.delete("/:id", protect, allowRoles("supervisor"), deleteReport);

// SHARE
router.put("/share/:reportId", protect, allowRoles("student"), shareReport);

module.exports = router;