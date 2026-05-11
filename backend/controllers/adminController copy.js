const User = require("../models/User");
const Internship = require("../models/InternshipPost"); // ✅ FIX
const Application = require("../models/Application"); // ✅ FIX
const bcrypt = require("bcryptjs"); // ✅ ADD THIS
// ==========================
// 👤 PENDING USERS
// ==========================
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "pending" });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// ✅ APPROVE USER
// ==========================
exports.approveUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      status: "approved",
    });
    res.json({ message: "User approved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// ❌ REJECT USER
// ==========================
exports.rejectUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      status: "rejected",
    });
    res.json({ message: "User rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// 📊 ANALYTICS
// ==========================
exports.getAnalytics = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCompanies = await User.countDocuments({ role: "company" });
    const totalUniversities = await User.countDocuments({ role: "university" });

    const totalInternships = await Internship.countDocuments();
    const totalApplications = await Application.countDocuments();

    const approvedApplications = await Application.countDocuments({
      status: "approved",
    });

    res.json({
      totalStudents,
      totalCompanies,
      totalUniversities,
      totalInternships,
      totalApplications,
      approvedApplications,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// 👥 GET ALL USERS
// ==========================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("university", "name") // ✅ populate university name for advisors
      .select("-password"); // don't send password
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// ✏️ UPDATE USER
// ==========================
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// ❌ DELETE USER
// ==========================
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// 🆕 ADD ADVISOR
// ==========================
exports.addAdvisor = async (req, res) => {
  try {
    const { name, email, department, universityId } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate random password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create advisor
    const advisor = new User({
      name,
      email,
      password: hashedPassword,
      role: "advisor",
      status: "approved",
      department,
      universityId, // save the university
    });

    await advisor.save();

    // Return advisor info + temp password
    res.json({
      message: "Advisor created successfully",
      advisor: {
        id: advisor._id,
        name: advisor.name,
        email: advisor.email,
        department: advisor.department,
        universityId: advisor.universityId,
        tempPassword, // send only once
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// 📝 EDIT ADVISOR
// ==========================
exports.updateAdvisor = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    const advisor = await User.findById(req.params.id);
    if (!advisor || advisor.role !== "advisor") {
      return res.status(404).json({ message: "Advisor not found" });
    }

    advisor.name = name || advisor.name;
    advisor.email = email || advisor.email;
    advisor.department = department || advisor.department;

    await advisor.save();

    res.json({ message: "Advisor updated successfully", advisor });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// ❌ DELETE ADVISOR
// ==========================
exports.deleteAdvisor = async (req, res) => {
  try {
    const advisor = await User.findById(req.params.id);
    if (!advisor || advisor.role !== "advisor") {
      return res.status(404).json({ message: "Advisor not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Advisor deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// 📋 GET ALL ADVISORS FOR UNIVERSITY
// ==========================
exports.getAdvisorsByUniversity = async (req, res) => {
  try {
    const universityId = req.user._id; // university admin id
    const advisors = await User.find({
      role: "advisor",
      universityId: universityId,
    }).select("-password");

    res.json(advisors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// GET all universities
exports.getUniversities = async (req, res) => {
  try {
    const universities = await User.find({ role: "university", status: "approved" })
      .select("_id name email");

    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};








// ==========================
// 👤 ADD NEW SUPERVISOR
// ==========================
exports.addSupervisor = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    // Check if supervisor already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Supervisor already exists" });
    }

    // Generate random password
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create supervisor
    const supervisor = new User({
      name,
      email,
      password: hashedPassword,
      role: "supervisor",
      status: "approved",
      department,
    });

    await supervisor.save();

    // Return info with temp password
    res.json({
      message: "Supervisor created successfully",
      supervisor: {
        id: supervisor._id,
        name: supervisor.name,
        email: supervisor.email,
        department: supervisor.department,
        tempPassword, // show only once
      },
    });
  } catch (err) {
    console.error("Add Supervisor Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// ✏️ UPDATE SUPERVISOR
// ==========================
exports.updateSupervisor = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    const supervisor = await User.findById(req.params.id);
    if (!supervisor || supervisor.role !== "supervisor") {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    supervisor.name = name || supervisor.name;
    supervisor.email = email || supervisor.email;
    supervisor.department = department || supervisor.department;

    await supervisor.save();

    res.json({ message: "Supervisor updated successfully", supervisor });
  } catch (err) {
    console.error("Update Supervisor Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// ❌ DELETE SUPERVISOR
// ==========================
exports.deleteSupervisor = async (req, res) => {
  try {
    const supervisor = await User.findById(req.params.id);
    if (!supervisor || supervisor.role !== "supervisor") {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "Supervisor deleted successfully" });
  } catch (err) {
    console.error("Delete Supervisor Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// 📋 LIST ALL SUPERVISORS
// ==========================
exports.getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: "supervisor" }).select("-password");
    res.json(supervisors);
  } catch (err) {
    console.error("Get Supervisors Error:", err);
    res.status(500).json({ message: err.message });
  }
};
