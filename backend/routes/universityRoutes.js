const express = require("express");
const router = express.Router();

// Controller functions
const {
  addAdvisor,
  getUniversities,
  applyToUniversity,
  getUniversityApplications,
  approveApplication,
  rejectApplication,
  getUniversityStudents,
  assignAdvisor,
  getUniversityAdvisors,
  getAllUniversities,
  getMyApplication,        // ✅ NEW
  cancelApplication  ,      // ✅ NEW
getUniversityDashboard,
removeAdvisorAssignment
} = require("../controllers/universityController");
const { deleteMyAccount } = require("../controllers/accountController");
// Middleware
const { protect, allowRoles } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload"); // multer upload

// ================= ROUTES =================

// Add advisor
router.post("/advisor", protect, allowRoles("university"), addAdvisor);

// Get universities (for students)
router.get("/universities", protect, allowRoles("student"), getUniversities);

// Apply to university (student) ✅ includes file upload
router.post(
  "/apply",
  protect,
  allowRoles("student"),
  upload.single("idImage"),
  applyToUniversity
);

// Get student's own application
router.get("/my-application", protect, allowRoles("student"), getMyApplication);

// Cancel application (student)
router.delete("/cancel", protect, allowRoles("student"), cancelApplication);

// Get applications (for university)
router.get("/applications", protect, allowRoles("university"), getUniversityApplications);

// Approve / Reject applications (university)
router.patch("/applications/:id/approve", protect, allowRoles("university"), approveApplication);
router.patch("/applications/:id/reject", protect, allowRoles("university"), rejectApplication);

// Get students of this university
router.get("/students", protect, allowRoles("university"), getUniversityStudents);

// Get advisors of this university
router.get("/advisors", protect, allowRoles("university"), getUniversityAdvisors);

// Get all universities (for university/admin)
router.get("/list", protect, allowRoles("university"), getAllUniversities);

// Assign advisor to student
router.patch("/assign-advisor", protect, allowRoles("university"), assignAdvisor);
router.put(
  "/advisor/remove-student",protect,
  allowRoles("advisor"),
  removeAdvisorAssignment
);
router.get(
  "/dashboard",
  protect,
  getUniversityDashboard
);
router.delete(
  "/delete-account",
  protect,
  allowRoles("university"),
  deleteMyAccount
);
module.exports = router;