const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createNotification = require("../utils/createNotification");
const nodemailer = require("nodemailer");
// ==========================
// REGISTER
// ==========================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, region, uploadType } = req.body;

    // ✅ REQUIRED FIELDS
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password, and role are required",
      });
    }
   // ✅ NAME VALIDATION
if (!/^[A-Za-z\s]+$/.test(name)) {
  return res.status(400).json({
    message: "Name must contain only letters and spaces",
  });
}
// ✅ REQUIRE DOCUMENT FOR COMPANY & UNIVERSITY
if ((role === "company" || role === "university") && !req.file) {
  return res.status(400).json({
    message: "Document is required for registration",
  });
}
// ✅ FILE TYPE VALIDATION
if (req.file) {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: "Invalid file type (only JPG, PNG, PDF allowed)",
    });
  }
}
    // ✅ STRONG PASSWORD VALIDATION (NEW)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let folder = "others";
    const documentPath = req.file
      ? `uploads/${folder}/${req.file.filename}`
      : "";

    // ==========================
    // CREATE USER (ALL PENDING)
    // ==========================
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      region,
      document: documentPath,
      status: "pending",
    });

    await user.save();

    // ==========================
    // 🎓 STUDENT → EMAIL VERIFICATION
    // ==========================
    if (role === "student") {
      const crypto = require("crypto");
      const sendEmail = require("../utils/sendEmail");

      const token = crypto.randomBytes(32).toString("hex");

      user.verificationToken = token;
      user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000;

      await user.save();

      const BASE_URL = "http://localhost:5000"; // change for production

      const approveLink = `${BASE_URL}/api/verify-account?token=${token}&action=approve`;
      const rejectLink = `${BASE_URL}/api/verify-account?token=${token}&action=reject`;

      await sendEmail({
        to: email,
        subject: "Confirm Your Student Registration",
        html: `
          <div style="font-family:Arial;">
            <h2>Hello ${name}</h2>

            <p>
              Thank you for registering with the <strong>Internship Marketplace System</strong>.
              <br />
              Please confirm that this registration belongs to you.
            </p>

            <a href="${approveLink}">
              <button style="
                padding:12px 20px;
                background:green;
                color:white;
                border:none;
                border-radius:5px;
                margin-right:10px;
              ">
                ✅ Yes, it's me
              </button>
            </a>

            <a href="${rejectLink}">
              <button style="
                padding:12px 20px;
                background:red;
                color:white;
                border:none;
                border-radius:5px;
              ">
                ❌ No, it's not me
              </button>
            </a>
          </div>
        `,
      });

      return res.status(201).json({
        message: "Please check your email to confirm your account.",
      });
    }

    // ==========================
    // 🏢 COMPANY + UNIVERSITY + ADMIN
    // ==========================
    else {
      const io = req.app.get("io");
      const admin = await User.findOne({ role: "admin" });

      if (admin && io) {
        await createNotification({
          user: admin._id,
          title: "New User Registration",
          message: `${name} registered as ${role}`,
          type: "ADMIN",
          link: "/admin/dashboard",
          io,
        });
      }

      return res.status(201).json({
        message: "Registered successfully. Wait for admin approval.",
      });
    }

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};


// ==========================
// LOGIN
// ==========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ❌ BLOCK REJECTED USERS (NEW)
    if (user.status === "rejected") {
      return res.status(403).json({
        message: "You are not allowed to access the system",
      });
    }

    // ==========================
    // 🎓 STUDENT → MUST VERIFY EMAIL
    // ==========================
    if (user.role === "student" && user.status !== "approved") {
      return res.status(403).json({
        message: "Please confirm your email before login",
      });
    }

    // ==========================
    // 👨‍💼 SUPERVISOR → NO CHANGE
    // ==========================
    if (user.role === "supervisor") {
      // allowed
    }

    // ==========================
    // 🏢 COMPANY + UNIVERSITY + ADMIN
    // ==========================
    else if (
      (user.role === "company" ||
        user.role === "university" ||
        user.role === "admin") &&
      user.status !== "approved"
    ) {
      return res.status(403).json({
        message: "Waiting for admin approval",
      });
    }

    // ==========================
    // PASSWORD CHECK
    // ==========================
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // ==========================
    // TOKEN
    // ==========================
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // generate random password
    const newPassword =
      Math.random().toString(36).slice(-8) + "A@1";

    // hash password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      newPassword,
      salt
    );

    await user.save();

    // email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // email message
    const message = `
      <h2>Password Reset</h2>
      <p>Your new temporary password is:</p>

      <h1>${newPassword}</h1>

      <p>Please login and change it later.</p>
    `;

    // send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "New Password",
      html: message,
    });

    res.status(200).json({
      message: "New password sent to email",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // check current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    // strong password validation
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPassword.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      });
    }

    // hash new password
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(
      newPassword,
      salt
    );

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};