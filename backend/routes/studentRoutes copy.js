// backend/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const studentController = require("../controllers/studentController");
const { protect } = require("../middlewares/authMiddleware");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

const upload = multer({ storage, fileFilter });

// Profile routes
router.get("/profile", protect, studentController.getProfile);
router.put("/profile", protect, studentController.updateProfile);
router.post("/upload-image", protect, upload.single("image"), studentController.uploadImage);
router.post(
  "/applications/submit",
  protect,
  upload.single("profileImage"),
  studentController.submitApplication
);
// Application routes
router.get("/applications", protect, studentController.getMyApplications);
router.put("/applications/:id", protect, studentController.updateApplication);

// Advisor
router.get("/advisor", protect, studentController.getAssignedAdvisor);

// Contacts
router.get("/contacts", protect, studentController.getStudentContacts);

// Connections
router.get("/connections", protect, studentController.getConnections);

module.exports = router;