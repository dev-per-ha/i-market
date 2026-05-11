const InternshipApplication = require("../models/InternshipApplication");
const Internship = require("../models/InternshipPost");
const User = require("../models/User");


// 🟢 1. APPLY TO INTERNSHIP
exports.applyToInternship = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { internshipId } = req.body;

    // Get student
    const student = await User.findById(studentId);

    // Detect type
    const type = student.university ? "university" : "private";

    // Get internship
    const internship = await Internship.findById(internshipId);

    // Prevent duplicate apply
    const existing = await InternshipApplication.findOne({
      student: studentId,
      internship: internshipId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await InternshipApplication.create({
      student: studentId,
      internship: internshipId,
      company: internship.company,
      type,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🟢 2. COMPANY VIEW APPLICATIONS
exports.getCompanyApplications = async (req, res) => {
  try {
    const companyId = req.user._id;

    const applications = await InternshipApplication.find({
      company: companyId,
    })
      .populate("student", "name email university")
      .populate("internship", "title");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🟢 3. ACCEPT / REJECT APPLICATION
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const application = await InternshipApplication.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🟢 4. ASSIGN SUPERVISOR
exports.assignSupervisor = async (req, res) => {
  try {
    const { id } = req.params;
    const { supervisorId } = req.body;

    const application = await InternshipApplication.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.supervisor = supervisorId;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};