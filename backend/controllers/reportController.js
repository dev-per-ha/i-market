// controllers/reportController.js
const Report = require("../models/Report");
const User = require("../models/User");
const notificationEngine = require("../utils/notificationEngine");
const createNotification = require("../utils/createNotification");// ================= CREATE REPORT (SUPERVISOR) =================
exports.createReport = async (req, res) => {
  try {
    if (req.user.role !== "supervisor") {
      return res.status(403).json({ message: "Only supervisor allowed" });
    }

    const { studentId } = req.params;
    const { week, tasks, description, attendance, performance } = req.body;

    // =========================
    // ✅ VALIDATE WEEK
    // =========================
    const weekNumber = Number(week);

    if (!week || isNaN(weekNumber)) {
      return res.status(400).json({
        message: "Week must be a valid number",
      });
    }

    if (weekNumber <= 0 || weekNumber > 52) {
      return res.status(400).json({
        message: "Week must be between 1 and 52",
      });
    }

    // =========================
    // 🔥 FIX: CHECK DUPLICATE REPORT (IMPORTANT)
    // =========================
    const existingReport = await Report.findOne({
      student: studentId,
      week: weekNumber,
    });

    if (existingReport) {
      return res.status(400).json({
        message: `Report for week ${weekNumber} already exists`,
      });
    }

    // ================= CREATE REPORT =================
    const report = await Report.create({
      student: studentId,
      supervisor: req.user.id,
      week: weekNumber, // always number
      tasks,
      description,
      attendance,
      performance,
    });

    const io = req.app.get("io");

    const student = await require("../models/User").findById(studentId);

    await notificationEngine(
      "REPORT_CREATED",
      {
        student,
        week: weekNumber,
      },
      io
    );

    res.json(report);

  } catch (err) {
    console.error("CREATE REPORT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET REPORTS (STUDENT & SUPERVISOR) =================
exports.getReports = async (req, res) => {
  try {
    let reports;

    if (req.user.role === "supervisor") {
      reports = await Report.find({ supervisor: req.user.id })
        .populate("student", "name email");
    }

    if (req.user.role === "student") {
      reports = await Report.find({ student: req.user.id })
        .populate("supervisor", "name email");
    }

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE REPORT (SUPERVISOR ONLY) =================
exports.updateReport = async (req, res) => {
  try {
    if (req.user.role !== "supervisor") {
      return res.status(403).json({ message: "Only supervisor can update report" });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.supervisor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // =========================
    // ✅ VALIDATE WEEK AGAIN
    // =========================
    if (req.body.week !== undefined) {
      const weekNumber = Number(req.body.week);

      if (isNaN(weekNumber)) {
        return res.status(400).json({
          message: "Week must be a valid number",
        });
      }

      req.body.week = weekNumber;
    }

    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    const io = req.app.get("io");

    const student = await require("../models/User").findById(report.student);

    await notificationEngine(
      "REPORT_UPDATED",
      { student },
      io
    );

    res.json(updated);

  } catch (error) {
    console.error("UPDATE REPORT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



// ================= DELETE REPORT (OPTIONAL) =================
exports.deleteReport = async (req, res) => {
  try {
    if (req.user.role !== "supervisor") {
      return res.status(403).json({ message: "Only supervisor can delete" });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Not found" });
    }

    await report.deleteOne();

    res.json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.shareReport = async (req, res) => {
  try {
    const userId = req.user?._id;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const report = await Report.findById(req.params.reportId)
      .populate("student", "name email advisor")
      .populate("supervisor", "name email");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (role !== "student") {
      return res.status(403).json({ message: "Only student can share report" });
    }

    if (report.student._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not your report" });
    }

    report.sharedWithAdvisor = true;
    await report.save();

    const io = req.app.get("io");

    const recipients = [];

    // advisor (from student)
    if (report.student?.advisor) {
      recipients.push(report.student.advisor);
    }

    if (recipients.length > 0) {
      await createNotification({
        users: recipients,
        title: "Report Shared",
        message: `${report.student.name} shared weekly report`,
        type: "REPORT",

        // 🔥 FIXED ROUTE (IMPORTANT PART)
        link: `/advisor/reports/${report.student._id}`,

        io,
      });
    }

    return res.json({
      message: "Shared successfully",
      reportId: report._id,
      sharedWithAdvisor: true,
    });

  } catch (err) {
    console.error("❌ SHARE REPORT ERROR:", err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};
exports.getAdvisorReports = async (req, res) => {
  try {
    if (req.user.role !== "advisor") {
      return res.status(403).json({ message: "Only advisor allowed" });
    }

    const { studentId } = req.params;

    const reports = await Report.find({
      sharedWithAdvisor: true
    }).lean(); // 🔥 IMPORTANT

    const filtered = reports.filter(
      (r) => r.student.toString() === studentId
    );

    console.log("TOTAL:", reports.length);
    console.log("FILTERED:", filtered.length);

    res.json(filtered);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
exports.getStudentReports = async (req, res) => {
  const reports = await Report.find({ student: req.user.id });
  res.json(reports);
};
exports.getSupervisorReports = async (req, res) => {
  try {
    if (req.user.role !== "supervisor") {
      return res.status(403).json({ message: "Only supervisor allowed" });
    }

    const { studentId } = req.params;

    const reports = await Report.find({
      supervisor: req.user.id,
      student: studentId
    }).sort({ createdAt: -1 });

    res.json(reports);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};