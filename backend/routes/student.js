const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UniversityApplication = require("../models/UniversityApplication");

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads/idImages");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Apply route
router.post("/apply", upload.single("idImage"), async (req, res) => {
  try {
    const { fullName, department, university } = req.body;

    const application = await UniversityApplication.create({
      student: req.user?._id, // if using auth
      fullName,
      department,
      university,
      idImage: req.file.filename,
      status: "waiting",
    });

    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Application failed" });
  }
});

module.exports = router;