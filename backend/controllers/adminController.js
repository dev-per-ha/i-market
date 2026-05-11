const User = require("../models/User");
const InternshipPost = require("../models/InternshipPost");
const bcrypt = require("bcryptjs");
const InternshipApplication = require("../models/InternshipApplication");
const UniversityApplication = require("../models/UniversityApplication");

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
    const totalAdvisors = await User.countDocuments({ role: "advisor" });
    const totalSupervisors = await User.countDocuments({ role: "supervisor" });

    const totalInternships = await InternshipPost.countDocuments();
    const totalInternshipApplications = await InternshipApplication.countDocuments();
    const totalUniversityApplications = await UniversityApplication.countDocuments();

    const totalApplications =
      totalInternshipApplications + totalUniversityApplications;

    res.json({
      totalStudents,
      totalCompanies,
      totalUniversities,
      totalAdvisors,
      totalSupervisors,
      totalInternships,
      totalInternshipApplications,
      totalUniversityApplications,
      totalApplications,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
};

// ==========================
// 👥 GET ALL USERS
// ==========================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("university", "name")
      .select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// ✏️ UPDATE USER
// ==========================
exports.updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const advisor = new User({
      name,
      email,
      password: hashedPassword,
      role: "advisor",
      status: "approved",
      department,
      universityId,
    });

    await advisor.save();

    res.json({
      message: "Advisor created successfully",
      advisor: {
        id: advisor._id,
        name: advisor.name,
        email: advisor.email,
        department: advisor.department,
        universityId: advisor.universityId,
        tempPassword,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// ✏️ UPDATE ADVISOR
// ==========================
exports.updateAdvisor = async (req, res) => {
  try {
    const advisor = await User.findById(req.params.id);

    if (!advisor || advisor.role !== "advisor") {
      return res.status(404).json({ message: "Advisor not found" });
    }

    const { name, email, department } = req.body;

    advisor.name = name || advisor.name;
    advisor.email = email || advisor.email;
    advisor.department = department || advisor.department;

    await advisor.save();

    res.json({ message: "Advisor updated", advisor });
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

    res.json({ message: "Advisor deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// 📋 GET ADVISORS BY UNIVERSITY
// ==========================
exports.getAdvisorsByUniversity = async (req, res) => {
  try {
    const advisors = await User.find({
      role: "advisor",
      universityId: req.user._id,
    }).select("-password");

    res.json(advisors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// 👤 ADD SUPERVISOR
// ==========================
exports.addSupervisor = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Supervisor already exists" });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const supervisor = new User({
      name,
      email,
      password: hashedPassword,
      role: "supervisor",
      status: "approved",
      department,
    });

    await supervisor.save();

    res.json({
      message: "Supervisor created",
      supervisor: {
        id: supervisor._id,
        name: supervisor.name,
        email: supervisor.email,
        department: supervisor.department,
        tempPassword,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// ✏️ UPDATE SUPERVISOR
// ==========================
exports.updateSupervisor = async (req, res) => {
  try {
    const supervisor = await User.findById(req.params.id);

    if (!supervisor || supervisor.role !== "supervisor") {
      return res.status(404).json({ message: "Supervisor not found" });
    }

    const { name, email, department } = req.body;

    supervisor.name = name || supervisor.name;
    supervisor.email = email || supervisor.email;
    supervisor.department = department || supervisor.department;

    await supervisor.save();

    res.json({ message: "Supervisor updated", supervisor });
  } catch (err) {
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

    res.json({ message: "Supervisor deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================
// 📋 GET SUPERVISORS
// ==========================
exports.getAllSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: "supervisor" }).select("-password");
    res.json(supervisors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL INTERNSHIPS =================
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await InternshipPost.find()
      .populate("company", "name email")
      .populate("applicants", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(internships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch internships" });
  }
};

// ================= DELETE INTERNSHIP =================
exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await InternshipPost.findById(id);

    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    await internship.deleteOne();

    res.status(200).json({ message: "Internship deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete internship" });
  }
};

// ================= GET ALL APPLICATIONS =================
exports.getAllApplications = async (req, res) => {
  try {
    const internshipApplications = await InternshipApplication.find()
      .populate("student", "name email")
      .populate({
        path: "internship",
        populate: { path: "company", select: "name" },
      })
      .lean();

    const formattedInternshipApps = internshipApplications.map((app) => ({
      ...app,
      cvUrl: app.cvFile
        ? `${process.env.SERVER_URL}/uploads/cvs/${app.cvFile.replace(/^\/+/, "")}`
        : null,
    }));

    const universityApplications = await UniversityApplication.find()
      .populate("student", "name email")
      .populate("university", "name")
      .lean();

    const formattedUniversityApps = universityApplications.map((app) => ({
      ...app,
      idImageUrl: app.idImage
        ? `${process.env.SERVER_URL}/uploads/idImages/${app.idImage.replace(/^\/+/, "")}`
        : null,
    }));

    res.status(200).json({
      internshipApplications: formattedInternshipApps,
      universityApplications: formattedUniversityApps,
    });
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};