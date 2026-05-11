// backend/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

// Controllers
const {
  getProfile,
  updateProfile,
  uploadImage,
  submitApplication,
  getMyApplications,
  updateApplication,
  getAssignedAdvisor,
  getStudentContacts,
  getConnections,
  uploadCV,
  getMyCV,
  saveCV,
  getMyInternships,
  getSuggestedInternships,
  applyInternship,
  getMyInternshipApplications,
  cancelInternshipApplication,
  getAllMyApplications,
  getAllInternships,
} = require("../controllers/studentController");
const { deleteMyAccount } = require("../controllers/accountController");
// Middleware
const { protect, allowRoles } = require("../middlewares/authMiddleware");

// ================= MULTER STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cvs"); // ✅ ONLY ONE FOLDER NOW
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// ================= FILE FILTERS =================

// IMAGE ONLY (for profile pictures)
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// CV ONLY (PDF/DOC/DOCX)
const cvFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOC files are allowed!"), false);
  }
};

// ================= UPLOADERS =================
const uploadImageFile = multer({ storage, fileFilter: imageFilter });
const uploadCVFile = multer({ storage, fileFilter: cvFilter });

// ================= PROFILE =================
router.get("/profile", protect, allowRoles("student"), getProfile);
router.put("/profile", protect, allowRoles("student"), updateProfile);

router.post(
  "/upload-image",
  protect,
  allowRoles("student"),
  uploadImageFile.single("image"),
  uploadImage
);

// ================= UNIVERSITY APPLICATION =================
router.post(
  "/applications/submit",
  protect,
  allowRoles("student"),
uploadImageFile.single("profileImage")
,  submitApplication
);

router.get("/applications", protect, allowRoles("student"), getMyApplications);
router.put("/applications/:id", protect, allowRoles("student"), updateApplication);

// ================= ADVISOR =================
router.get("/advisor", protect, allowRoles("student"), getAssignedAdvisor);

// ================= CONTACTS =================
router.get("/contacts", protect, allowRoles("student"), getStudentContacts);

// ================= CONNECTIONS =================
router.get("/connections", protect, allowRoles("student"), getConnections);

// ================= CV =================
router.post("/upload-cv", protect, allowRoles("student"), uploadCV, saveCV);
router.get("/cv", protect, allowRoles("student"), getMyCV);

// ================= INTERNSHIPS =================
router.get("/internships", protect, allowRoles("student"), getMyInternships);

router.get(
  "/internships/suggested",
  protect,
  allowRoles("student"),
  getSuggestedInternships
);

// ✅ FIXED HERE (CV upload)
router.post(
  "/internships/apply",
  protect,
  allowRoles("student"),
  uploadCVFile.single("cv"),
  applyInternship
);

router.get(
  "/internships/applications",
  protect,
  allowRoles("student"),
  getMyInternshipApplications
);

router.delete(
  "/internships/applications/cancel",
  protect,
  allowRoles("student"),
  cancelInternshipApplication
);

// ================= ALL APPLICATIONS =================
router.get(
  "/all-applications",
  protect,
  allowRoles("student"),
  getAllMyApplications
);

// ================= ALL INTERNSHIPS =================
router.get(
  "/all-internships",
  protect,
  allowRoles("student"),
  getAllInternships
);
// ================= Account delete =================
router.delete(
  "/delete-account",
  protect,
  allowRoles("student"),
  deleteMyAccount
);

module.exports = router;