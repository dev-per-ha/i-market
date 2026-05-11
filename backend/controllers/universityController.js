const { randomBytes } = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const Chat = require("../models/Chat"); // New Chat model
const Advisor = require("../models/User");
const UniversityApplication = require("../models/UniversityApplication");
const StudentProfile = require("../models/StudentProfile");
const University = require("../models/University");
const createNotification = require("../utils/createNotification");

const User = require("../models/User");
const Student = require("../models/Student");
const ChatRoom = require("../models/ChatRoom");
// ================= GET STUDENTS =================
exports.getUniversityStudents = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
      university: req.user._id,
      status: "approved",
    })
      .populate("advisor", "name email")
      .select("name email department advisor status");

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

// ================= GET ADVISORS =================
exports.getUniversityAdvisors = async (req, res) => {
  try {
    const advisors = await User.find({
      role: "advisor",
      university: req.user._id,
    }).select("name email department");

    res.json(advisors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch advisors" });
  }
};



exports.assignAdvisor = async (req, res) => {
  try {
    const { studentId, advisorId } = req.body;

    if (!studentId || !advisorId) {
      return res.status(400).json({
        message: "Student and Advisor required",
      });
    }

    const student = await User.findById(studentId);
    const advisor = await User.findById(advisorId);

    if (!student || !advisor) {
      return res.status(404).json({
        message: "Student or Advisor not found",
      });
    }

    if (student.role !== "student" || advisor.role !== "advisor") {
      return res.status(400).json({
        message: "Invalid roles",
      });
    }

    // same university check
    if (
      student.university?.toString() !== req.user._id.toString() ||
      advisor.university?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Must belong to your university",
      });
    }

    if (student.advisor) {
      return res.status(400).json({
        message: "Student already has an advisor",
      });
    }

    // ================= ASSIGN =================
    student.advisor = advisor._id;
    await student.save();

    // ================= CHAT ROOM =================
    let room = await ChatRoom.findOne({
      members: { $all: [student._id, advisor._id], $size: 2 },
    });

    if (!room) {
      room = await ChatRoom.create({
        members: [student._id, advisor._id],
      });
    }

    const io = req.app.get("io");

    console.log("🔔 AssignAdvisor Triggered");

    // ================= NOTIFICATIONS (CLEAN VERSION) =================

    const createNotification = require("../utils/createNotification");

    const notificationPayload = {
      io,
    };

    // 🔥 1. STUDENT NOTIFICATION
    await createNotification({
      user: student._id,
      title: "Advisor Assigned",
      message: `You have been assigned to ${advisor.name}`,
      type: "ADVISOR_ASSIGNED",
      link: "/student/dashboard",
      ...notificationPayload,
    });

    // 🔥 2. ADVISOR NOTIFICATION
    await createNotification({
      user: advisor._id,
      title: "New Student Assigned",
      message: `${student.name} has been assigned to you`,
      type: "ADVISOR_ASSIGNED",
      link: "/advisor/dashboard",
      ...notificationPayload,
    });

    // ================= RESPONSE =================
    return res.json({
      message: "Advisor assigned successfully",
      roomId: room._id,
      advisor: {
        _id: advisor._id,
        name: advisor.name,
        email: advisor.email,
      },
    });
  } catch (err) {
    console.error("Assign Advisor Error:", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

// ================= APPROVE APPLICATION =================

// After approving student, assign advisor & create chat





exports.getAllUniversities = async (req, res) => {
  try {
    // Only fetch universities that have login accounts
    const universities = await University.find({ status: "active" }).select("name");
    res.json(universities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch universities" });
  }
};





exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const app = await UniversityApplication.findById(req.params.id)
      .populate("student", "name email")
      .populate("university", "name");

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.status = status;
    await app.save();

    // assign university only if approved
    if (status === "approved") {
      await StudentProfile.findOneAndUpdate(
        { userId: app.student._id },
        { university: app.university._id },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const io = req.app.get("io");

    const createNotification = require("../utils/createNotification");

    // 🔥 ONLY STUDENT SHOULD GET THIS
    await createNotification({
      user: app.student._id,
      title:
        status === "approved"
          ? "Application Approved 🎉"
          : "Application Rejected ❌",
      message:
        status === "approved"
          ? `Your application to ${app.university.name} was approved`
          : `Your application was rejected`,
      type: "UNIVERSITY_STATUS",
      link: "/student/applications",
      io,
    });

    // ❌ DO NOT EMIT SOCKET MANUALLY HERE
    // createNotification already handles socket

    return res.json(app);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Update failed" });
  }
};


// ================= ADD ADVISOR =================
// ================= ADD ADVISOR =================
exports.addAdvisor = async (req, res) => {
  try {
    const { name, email, department } = req.body;

    let advisor = await User.findOne({ email });
    let tempPassword = null;

    if (!advisor) {
      tempPassword = randomBytes(6).toString("hex");
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      advisor = new User({
        name,
        email,
        department,
        role: "advisor",
        university: req.user._id,
        password: hashedPassword,
        status: "approved",
      });

      await advisor.save();
    } else {
      advisor.name = name;
      advisor.department = department;
      advisor.role = "advisor";
      advisor.university = req.user._id;
      advisor.status = "approved";
      await advisor.save();
    }

    // ================= EMAIL SYSTEM =================
    let emailStatus = "not_sent";

    if (tempPassword) {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // ✅ STEP 1: VERIFY CONNECTION
        await transporter.verify();
        console.log("✅ Email server ready");

        // ✅ STEP 2: SEND EMAIL
        const info = await transporter.sendMail({
          from: `"Internship System" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Advisor Account Credentials",
          html: `
            <div style="font-family: Arial; padding: 10px;">
              <h2>Hello ${name}</h2>
              <p>Your advisor account has been created successfully.</p>
              <hr/>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${tempPassword}</p>
              <hr/>
              <p>Please login and change your password.</p>
            </div>
          `,
        });

        console.log("📧 Email sent:", info.response);
        emailStatus = "sent";

      } catch (emailErr) {
        console.error("❌ EMAIL FAILED:", emailErr.message);
        emailStatus = "failed";
      }
    }
    // ===================================================

    // ✅ ALWAYS RETURN PASSWORD (SAFE FALLBACK)
    res.json({
      message:
        emailStatus === "sent"
          ? "Advisor created and email sent"
          : "Advisor created but email failed",

      advisor,
      tempPassword, // 🔥 IMPORTANT: always available
      emailStatus,  // 🔥 helps debugging frontend
    });

  } catch (error) {
    console.error("❌ ADD ADVISOR ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===================== UNIVERSITIES (STUDENT DROPDOWN) =====================
exports.getUniversities = async (req, res) => {
  try {
    const universities = await User.find({ role: "university", status: "approved" }).select("_id name");
    res.json(universities);
  } catch (err) {
    console.error("Error fetching universities:", err);
    res.status(500).json({ message: "Failed to fetch universities" });
  }
};// ===================== APPLY TO UNIVERSITY =====================



exports.applyToUniversity = async (req, res) => {
  try {
    const { university, fullName, department } = req.body;
    const idImage = req.file?.filename;

    if (!university || !fullName || !department || !idImage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    const existingApp = await UniversityApplication.findOne({ student: student._id, status: "waiting" });
    if (existingApp) return res.status(400).json({ message: "You already have a pending application" });

    // Create new university application
    const application = new UniversityApplication({
      student: student._id,
      university,
      fullName,
      department,
      idImage,
      status: "waiting",
    });

    await application.save();

    // Update student's application reference
    student.application = application._id;
    await student.save();

    // Upsert student profile
    await StudentProfile.findOneAndUpdate(
      { userId: student._id },
      { fullName, department },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true } // ✅ updated
    );

    // Populate before returning
    await application.populate([
      { path: "university", select: "name" },
      { path: "student", select: "fullName department" }
    ]);

    res.json(application);
  } catch (err) {
    console.error("Error applying to university:", err);
    res.status(500).json({ message: "Application failed" });
  }
};
// ===================== GET STUDENT APPLICATION =====================
exports.getMyApplication = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).populate("university", "name");
    res.json(student.application || null);
  } catch (err) {
    console.error("Error fetching application:", err);
    res.status(500).json({ message: "Failed to fetch application" });
  }
};

// ===================== CANCEL APPLICATION =====================
exports.cancelApplication = async (req, res) => {
  try {
    const student = await User.findById(req.user._id);
    student.application = null;
    student.university = null;
    await student.save();
    res.json({ message: "Application canceled" });
  } catch (err) {
    console.error("Cancel application error:", err);
    res.status(500).json({ message: "Failed to cancel" });
  }
};


// ================= GET ALL UNIVERSITY APPLICATIONS =================
exports.getUniversityApplications = async (req, res) => {
  try {
    const apps = await UniversityApplication.find({
      university: req.user._id,
    })
      .populate("student", "name department") // optional
      .sort({ createdAt: -1 });

    // Force correct data (VERY IMPORTANT)
    const fixedApps = apps.map((app) => ({
      _id: app._id,
      student: {
        name: app.fullName || app.student?.name || "N/A",
        department: app.department || app.student?.department || "N/A",
      },
      idImage: app.idImage,
      status: app.status,
    }));

    res.json(fixedApps);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Fetch failed" });
  }
};

// ================= APPROVE APPLICATION =================

exports.approveApplication = async (req, res) => {
  try {
    const app = await UniversityApplication.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.status = "approved";
    await app.save();

    const student = await User.findById(app.student);

    student.university = app.university;
    student.application = app._id;
    await student.save();

    await StudentProfile.findOneAndUpdate(
      { userId: student._id },
      {
        university: app.university,
        fullName: app.fullName,
        department: app.department,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const io = req.app.get("io");

    // ================= NOTIFICATION =================
    await createNotification({
  user: student._id,
  title: "University Application Approved",
  message: `Your application to ${app.university} was approved`,
  type: "UNIVERSITY_STATUS",
  link: "/profile",
  io,
});

    res.json(
      await app
        .populate("student", "fullName department")
        .populate("university", "name")
    );

  } catch (err) {
    res.status(500).json({ message: "Approve failed" });
  }
};

// ================= REJECT APPLICATION =================

exports.rejectApplication = async (req, res) => {
  try {
    const app = await UniversityApplication.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    app.status = "rejected";
    await app.save();

    const student = await User.findById(app.student);

    if (student) {
      student.university = null;
      student.application = null;
      await student.save();
    }

    const io = req.app.get("io");

    // ================= NOTIFICATION =================
    await createNotification({
  user: app.student,
  title: "University Application Rejected",
  message: `Your university application was rejected`,
  type: "UNIVERSITY_STATUS",
  link: "/profile",
  io,
});

    res.json(
      await app
        .populate("student", "fullName department")
        .populate("university", "name")
    );

  } catch (err) {
    res.status(500).json({ message: "Reject failed" });
  }
};

exports.getUniversityDashboard = async (req, res) => {
  try {
    const universityId = req.user._id;

    // 1. Students of this university
    const students = await User.find({
      role: "student",
      university: universityId,
    });

    const studentIds = students.map((s) => s._id);

    // 2. Advisors of this university
    const advisors = await User.find({
      role: "advisor",
      university: universityId,
    });

    // 3. University applications
    const applications = await UniversityApplication.find({
      university: universityId,
    });

    // 4. Status breakdown
    const waiting = applications.filter((a) => a.status === "waiting").length;
    const approved = applications.filter((a) => a.status === "approved").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    // 5. Students WITH advisor assigned
    const assignedStudents = students.filter((s) => s.advisor).length;

    // 6. Students WITHOUT advisor
    const unassignedStudents = students.length - assignedStudents;

    // 7. Departments breakdown
    const deptMap = {};
    students.forEach((s) => {
      const dept = s.department || "Unknown";
      deptMap[dept] = (deptMap[dept] || 0) + 1;
    });

    const departmentStats = Object.keys(deptMap).map((key) => ({
      name: key,
      value: deptMap[key],
    }));

    res.json({
      totalStudents: students.length,
      totalAdvisors: advisors.length,
      totalApplications: applications.length,

      assignedStudents,
      unassignedStudents,

      applicationStats: {
        waiting,
        approved,
        rejected,
      },

      departmentStats,
    });
  } catch (err) {
    console.error("University dashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
};

// ================= REMOVE ADVISOR ASSIGNMENT =================
exports.removeAdvisorAssignment = async (req, res) => {
  try {
    const { studentId } = req.body;

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ SAFE REMOVE (no strict check)
    student.advisor = null;
    await student.save();

    return res.json({
      message: "Removed successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};





