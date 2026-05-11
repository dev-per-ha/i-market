const Internship = require("../models/Internship");
const User = require("../models/User");

// ==========================
// Company adds internship
// ==========================
exports.createInternship = async (req, res) => {
  try {
    const companyId = req.user._id;
    const internship = await Internship.create({ ...req.body, company: companyId });
    res.json({ message: "Internship posted successfully", internship });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating internship" });
  }
};

// ==========================
// List all internships (for students)
// ==========================
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find().populate("company", "name email");
    res.json(internships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching internships" });
  }
};

// ==========================
// Company sees applications to its internships
// ==========================
exports.getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.user._id;

    // Find internships posted by this company
    const internships = await Internship.find({ company: companyId }).populate("applicants", "name email department");

    res.json(internships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load applications" });
  }
};

// ==========================
// Accept/reject applicant
// ==========================
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { internshipId, studentId } = req.params;
    const { status } = req.body;

    const internship = await Internship.findById(internshipId).populate("applicants");
    if (!internship) return res.status(404).json({ message: "Internship not found" });

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Remove or approve student in internship applicants list
    if (status === "approved") {
      student.supervisor = await User.findOne({ company: req.user._id, role: "supervisor" })?._id || null;
      await student.save();
    }

    if (status === "rejected") {
      internship.applicants = internship.applicants.filter(a => a._id.toString() !== studentId);
      await internship.save();
    }

    res.json({ message: `Application ${status}`, student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating application status" });
  }
};