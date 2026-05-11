const User = require("../models/User");
const InternshipPost = require("../models/InternshipPost");
const ChatRoom = require("../models/ChatRoom");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const InternshipApplication = require("../models/InternshipApplication");
const Report = require("../models/Report");
const createNotification = require("../utils/createNotification")
const Payment = require("../models/Payment");
// ==================== INTERNSHIP ====================

// Create Internship Post

exports.createInternship = async (req, res) => {
  try {
    const {
      title,
      description,
      department,
      location,
      duration,
      jobType,
      slots,
      gpa,
      requiredSkills,
    } = req.body;

    const Payment = require("../models/Payment");
    const InternshipPost = require("../models/InternshipPost");
    const User = require("../models/User");
    const createNotification = require("../utils/createNotification");

    // =========================
    // VALIDATION
    // =========================
    if (!title || !description || !slots || !gpa || !jobType) {
      return res.status(400).json({
        message:
          "Please fill all required fields (title, description, slots, gpa, jobType)",
      });
    }

    if (isNaN(slots) || isNaN(gpa)) {
      return res.status(400).json({
        message: "Slots and GPA must be valid numbers",
      });
    }

    // =========================
    // GET OR CREATE PAYMENT DOC
    // =========================
    let paymentData = await Payment.findOne({
      company: req.user._id,
    });

    if (!paymentData) {
      paymentData = await Payment.create({
        company: req.user._id,
        freePostsUsed: 0,
        postsRemaining: 0,
      });
    }

    const FREE_LIMIT = 2;

    const freeRemaining =
      paymentData.freePostsUsed < FREE_LIMIT
        ? FREE_LIMIT - paymentData.freePostsUsed
        : 0;

    const paidRemaining = paymentData.postsRemaining || 0;

    const totalAvailable = freeRemaining + paidRemaining;

    // =========================
    // BLOCK IF NO POSTS LEFT
    // =========================
    if (totalAvailable <= 0) {
      return res.status(403).json({
        message: "Free limit reached. Please pay 500 ETB for 2 posts.",
        requiresPayment: true,
      });
    }

    // =========================
    // CREATE INTERNSHIP
    // =========================
    const internship = await InternshipPost.create({
      title,
      description,
      department,
      location,
      duration,
      jobType,
      slots: Number(slots),
      gpa: Number(gpa),
      requiredSkills,
      company: req.user._id,
    });

    // =========================
    // CONSUME POSTS
    // =========================
    if (paymentData.freePostsUsed < FREE_LIMIT) {
      paymentData.freePostsUsed += 1;
    } else {
      paymentData.postsRemaining -= 1;
    }

    if (paymentData.postsRemaining < 0) {
      paymentData.postsRemaining = 0;
    }

    await paymentData.save();

    // ==================================================
    // 🔔 SEND NOTIFICATION TO ALL STUDENTS
    // ==================================================
    try {
      const io = req.app.get("io");

      // get company info
      const company = await User.findById(req.user._id);

      // get all students
      const students = await User.find({
        role: "student",
      });

      for (const student of students) {
        await createNotification({
          user: student._id,
          title: "New Internship Posted",
          message: `${
            company?.name || "A company"
          } posted a new internship: ${title}`,
          type: "NEW_INTERNSHIP",
          link: "/student/internships/all",
          io,
        });

        // REALTIME SOCKET NOTIFICATION
        if (io) {
          io.to(student._id.toString()).emit("new_notification", {
            user: student._id.toString(), // IMPORTANT FIX
            title: "New Internship Posted",
            message: `${
              company?.name || "A company"
            } posted a new internship: ${title}`,
            type: "NEW_INTERNSHIP",
            link: "/student/internships/all",
          });
        }
      }
    } catch (notifError) {
      console.error("INTERNSHIP NOTIFICATION ERROR:", notifError);
    }

    return res.status(201).json({
      message: "Internship created successfully",
      internship,
      freePostsUsed: paymentData.freePostsUsed,
      postsRemaining: paymentData.postsRemaining,
      totalAvailable: totalAvailable - 1,
    });
  } catch (err) {
    console.error("CREATE INTERNSHIP ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
// Get all internships (for students)
exports.getAllInternships = async (req, res) => {
  try {
    const internships = await InternshipPost.find().populate("company", "name email");
    res.status(200).json(internships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch internships" });
  }
};

// Apply for internship (Student)
exports.applyInternship = async (req, res) => {
  const { name, coverLetter, internshipId } = req.body;
  const cv = req.file?.filename;

  if (!name || !coverLetter || !cv || !internshipId) {
    return res.status(400).json({
      message: "Name, coverLetter, CV, and internshipId are required",
    });
  }

  try {
    const internship = await InternshipPost.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    // Prevent duplicate applications
    if (internship.applicants.includes(req.user._id)) {
      return res.status(400).json({
        message: "You have already applied for this internship",
      });
    }

    internship.applicants.push(req.user._id);
    await internship.save();
     // 🔔 NOTIFICATION: STUDENT APPLIED → COMPANY ADMIN
const io = req.app.get("io");

console.log("👀 Company ID:", internship.company);

// 🔥 FORCE STRING SAFETY
const companyId = internship.company?.toString();

if (!companyId) {
  console.log("❌ Company ID missing");
  return;
}

await createNotification({
  user: companyId,
  title: "New Internship Application",
  message: `${name} applied for ${internship.title}`,
  type: "NEW_APPLICATION",
  link: "/company/applications",
  io,
});
    res.json({ message: "Application submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error applying for internship" });
  }
};

// ==================== SUPERVISORS ====================

exports.addSupervisor = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    if (!name || !email || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingSupervisor = await User.findOne({ email });
    if (existingSupervisor) {
      return res.status(400).json({ message: "Supervisor already exists" });
    }

    const randomPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const supervisor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "supervisor",
      department,
    });

    // Send email
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Supervisor Account Credentials",
        text: `Hello ${name},

Your supervisor account has been created.

Email: ${email}
Password: ${randomPassword}`,
      });
    } catch (emailErr) {
      console.error("Email failed:", emailErr);
    }

    res.status(201).json({
      message: "Supervisor added successfully",
      supervisor: {
        _id: supervisor._id,
        name: supervisor.name,
        email: supervisor.email,
        department: supervisor.department,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add supervisor" });
  }
};

// Get all supervisors
exports.getSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: "supervisor" }).select(
      "_id name email department"
    );
    res.status(200).json(supervisors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch supervisors" });
  }
};

// Assign student to supervisor
exports.assignStudentToSupervisor = async (req, res) => {
  try {
    const { studentId, supervisorId } = req.body;

    const student = await User.findById(studentId);
    const supervisor = await User.findById(supervisorId);

    if (!student || !supervisor) {
      return res.status(404).json({
        message: "Student or Supervisor not found",
      });
    }

    if (student.supervisor?.toString() === supervisorId) {
      return res.status(400).json({
        message: "Already assigned to this supervisor",
      });
    }

    // =========================
    // ASSIGN SUPERVISOR
    // =========================
    student.supervisor = supervisor._id;
    await student.save();

    // =========================
    // REPORT INIT
    // =========================
    const existingReport = await Report.findOne({ student: studentId });

    if (!existingReport) {
      await Report.create({
        student: studentId,
        supervisor: supervisorId,
      });
    }

    // =========================
    // CHAT ROOM
    // =========================
    const existingRoom = await ChatRoom.findOne({
      members: { $all: [student._id, supervisor._id] },
    });

    if (!existingRoom) {
      const room = await ChatRoom.create({
        members: [student._id, supervisor._id],
      });

      const io = req.app.get("io");

      // ONLY STUDENT + SUPERVISOR
      io.to(student._id.toString()).emit("newChat", room);
      io.to(supervisor._id.toString()).emit("newChat", room);
    }

    // =========================
    // 🔔 NOTIFICATIONS (FIXED)
    // =========================
    const io = req.app.get("io");
    const createNotification = require("../utils/createNotification");

    // 🔵 STUDENT NOTIFICATION
    await createNotification({
      user: student._id,
      title: "Supervisor Assigned",
      message: `You have been assigned to ${supervisor.name}`,
      type: "SUPERVISOR_ASSIGNED",
      link: "/student/dashboard",
      io,
    });

    // 🟢 SUPERVISOR NOTIFICATION
    await createNotification({
      user: supervisor._id,
      title: "New Student Assigned",
      message: `${student.name} has been assigned to you`,
      type: "SUPERVISOR_ASSIGNED",
      link: "/supervisor/dashboard",
      io,
    });

    // ❌ IMPORTANT: DO NOT NOTIFY COMPANY ADMIN

    return res.json({
      message:
        "Student assigned to supervisor successfully, chat and report initialized",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
exports.getApprovedStudents = async (req, res) => {
  try {
    const internships = await InternshipPost.find({
      company: req.user._id,
    }).select("_id");

    if (!internships.length) return res.status(200).json([]);

    const internshipIds = internships.map((i) => i._id);

    const approvedApplications = await InternshipApplication.find({
      internship: { $in: internshipIds },
      status: "approved",
    }).populate("student", "name email university");

    // ✅ FIX: remove null students
    const students = approvedApplications
      .map((app) => app.student)
      .filter((student) => student !== null);

    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch approved students" });
  }
}; 

exports.getCompanyApplications = async (req, res) => {
  try {
    const apps = await InternshipApplication.find()
      .populate("student", "name email phone")
      .populate("internship", "title company")
      .lean();

    const appsWithCVUrl = apps.map((app) => ({
      ...app,
      cvUrl: app.cvFile
        ? `${process.env.SERVER_URL}/uploads/cv/${app.cvFile}`
        : null,
    }));

    res.json(appsWithCVUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const app = await InternshipApplication.findById(applicationId)
      .populate("internship")
      .populate("student");

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.status = status;
    await app.save();

    // 🔔 NOTIFICATION: STATUS UPDATE → STUDENT
    const io = req.app.get("io");

    let title, message;

    if (status === "approved") {
      title = "Application Approved 🎉";
      message = `You were accepted for "${app.internship.title}"`;
    } else {
      title = "Application Rejected ❌";
      message = `Your application for "${app.internship.title}" was rejected`;
    }

    await createNotification({
      user: app.student._id,
      title,
      message,
      type: "APPLICATION_STATUS",
      link: "/student/applications",
      io,
    });

    res.json({ message: "Status updated", status: app.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

exports.getMyInternships = async (req, res) => {
  try {
    const internships = await InternshipPost.find({
      company: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(internships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch internships" });
  }
};

exports.updateInternship = async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await InternshipPost.findById(id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const updated = await InternshipPost.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteInternship = async (req, res) => {
  try {
    const { id } = req.params;

    const internship = await InternshipPost.findById(id);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    if (internship.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await InternshipPost.findByIdAndDelete(id);

    res.json({ message: "Internship deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.deleteSupervisor = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.json({ message: "Supervisor deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};

// ================= COMPANY DASHBOARD =================
exports.getCompanyDashboard = async (req, res) => {
  try {
    const companyId = req.user._id;

    const internships = await InternshipPost.find({ company: companyId });
    const internshipIds = internships.map((i) => i._id);

    const applications = await InternshipApplication.find({
      internship: { $in: internshipIds },
    }).populate("student", "supervisor");

    const studentIds = [
      ...new Set(applications.map((a) => a.student?._id?.toString())),
    ];

    const totalStudents = studentIds.length;
    const totalInternships = internships.length;
    const totalApplications = applications.length;

    const pending = applications.filter((a) => a.status === "pending").length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    const supervisorIds = new Set(
      applications
        .map((a) => a.student?.supervisor?.toString())
        .filter(Boolean)
    );

    const supervisorCount = supervisorIds.size;

    res.json({
      totalInternships,
      totalApplications,
      totalStudents,
      supervisorCount,
      applicationStats: { pending, approved, rejected },
      internshipStats: internships.map((i) => ({
        title: i.title,
        applicants: i.applicants?.length || 0,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

// ================= REMOVE SUPERVISOR ASSIGNMENT =================
exports.removeSupervisorAssignment = async (req, res) => {
  try {
    const { studentId } = req.body;

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.supervisor = null;
    await student.save();

    return res.json({
      message: "Removed successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};