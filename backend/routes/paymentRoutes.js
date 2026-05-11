const express = require("express");
const router = express.Router();
const { initiatePayment, verifyPayment } = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware"); // your existing auth middleware

router.post("/initiate", protect, initiatePayment);
router.get("/verify", verifyPayment); // Chapa hits this — no auth

module.exports = router;