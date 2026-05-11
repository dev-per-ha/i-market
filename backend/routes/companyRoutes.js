const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { protect, allowRoles } = require("../middlewares/authMiddleware");
const {
  addSupervisor,
  createInternship,
  getAllInternships,
  applyInternship,
  getSupervisors,
  assignStudentToSupervisor,
  getApprovedStudents,
  getCompanyApplications,
  updateApplicationStatus,
    getMyInternships , 
     updateInternship, 
     deleteInternship,
     deleteSupervisor,
     getCompanyDashboard,
     removeSupervisorAssignment

} = require("../controllers/companyController");
const { deleteMyAccount } = require("../controllers/accountController");
// Ensure upload folder exists
const uploadDir = path.join(__dirname, "../uploads/cv");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Serve CVs statically
router.use("/uploads", express.static(uploadDir));

// Company admin routes
router.post("/supervisor/add", protect, allowRoles("company"), addSupervisor);
router.post("/internship/create", protect, allowRoles("company"), createInternship);
router.get("/supervisors", protect, allowRoles("company"), getSupervisors);
router.patch("/assign-supervisor", protect, allowRoles("company"), assignStudentToSupervisor);
router.get("/students", protect, allowRoles("company"), getApprovedStudents);

// Student routes
router.get("/internships", protect, allowRoles("student"), getAllInternships);
router.post("/internships/apply", protect, allowRoles("student"), upload.single("cv"), applyInternship);

// ✅ Applications list & update
router.get("/applications", protect, allowRoles("company"), getCompanyApplications);
router.put("/applications/status", protect, allowRoles("company"), updateApplicationStatus);

// COMPANY OWN INTERNSHIPS
router.get(
  "/my-internships",
  protect,
  allowRoles("company"),
  getMyInternships  

);

// UPDATE INTERNSHIP
router.put(
  "/internship/:id",
  protect,
  allowRoles("company"),
  updateInternship 
);

// DELETE INTERNSHIP
router.delete(
  "/internship/:id",
  protect,
  allowRoles("company"),
  deleteInternship
);

router.delete(
  "/supervisor/:id",
  protect,
  allowRoles("company"),
  deleteSupervisor
);

router.get(
  "/dashboard",
  protect,
  allowRoles("company"),
  getCompanyDashboard
);
router.put(
  "/supervisor/remove-student",protect,
  removeSupervisorAssignment
);
router.delete(
  "/delete-account",
  protect,
  allowRoles("company"),
  deleteMyAccount
);
module.exports = router;