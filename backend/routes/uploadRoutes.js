const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Save files to /uploads/chat
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/chat"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fileUrl = `http://localhost:5000/uploads/chat/${req.file.filename}`;
  res.json({ fileUrl });
});

module.exports = router;