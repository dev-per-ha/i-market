const path = require("path");
const multer = require("multer");

// Models
const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const InternshipPost = require("../models/InternshipPost");
const ChatRoom = require("../models/ChatRoom");
const InternshipApplication = require("../models/InternshipApplication");
const UniversityApplication = require("../models/UniversityApplication");
const CV = require("../models/CV");
const createNotification = require("../utils/createNotification");

// ============================
// Multer setup for CV upload
// ============================
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/cvs");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const uploadCV = multer({ storage }).single("cv"); // 'cv' is the formData field

// ============================
// GET PROFILE
// ============================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    const profile = await StudentProfile.findOne({ userId: req.user._id }).lean();

    let application = null;
    if (user.application) {
      application = await UniversityApplication.findById(user.application).populate("university", "name");
    }

    res.json({
      name: user?.name || "",
      phone: user?.phone || "",
      department: user?.department || "",
      bio: profile?.bio || "",
      skills: profile?.skills || [],
      application,
    });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

// ============================
// UPDATE PROFILE
// ============================
const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, skills, department } = req.body;

    await User.findByIdAndUpdate(req.user._id, { name, phone, department });

    const skillsArr = Array.isArray(skills)
      ? skills
      : skills?.split(",").map((s) => s.trim()).filter(Boolean) || [];

    let profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { bio, skills: skillsArr, department },
      { new: true, upsert: true }
    );

    res.json({
      name,
      phone,
      department,
      bio: profile.bio,
      skills: profile.skills,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
  }
};

// ============================
// UPLOAD PROFILE IMAGE
// ============================
const uploadImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.image = req.file.filename;
    await user.save();
    res.json({ image: req.file.filename });
  } catch (err) {
    console.error("UPLOAD IMAGE ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

// ============================
// UNIVERSITY APPLICATION
// ============================
const applyUniversity = async (req, res) => {
  try {
    const { university, fullName, department } = req.body;
    const idImage = req.file?.filename;

    // =========================
    // VALIDATION
    // =========================
    if (!university || !fullName || !department || !idImage) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // =========================
    // GET STUDENT
    // =========================
    const student = await User.findById(req.user._id);

    // =========================
    // CHECK EXISTING APPLICATION
    // =========================
    const existingApp = await UniversityApplication.findOne({
      student: student._id,
      status: "waiting",
    });

    if (existingApp) {
      return res.status(400).json({
        message: "You already have a pending application",
      });
    }

    // =========================
    // CREATE APPLICATION
    // =========================
    const application = await UniversityApplication.create({
      student: student._id,
      university,
      fullName,
      department,
      idImage,
      status: "waiting",
    });

    // =========================
    // UPDATE STUDENT PROFILE
    // =========================
    await StudentProfile.findOneAndUpdate(
      { userId: student._id },
      { fullName, department },
      { upsert: true, new: true }
    );

    // =========================
    // 🔔 NOTIFICATION → UNIVERSITY ADMINS
    // =========================
// =========================
// 🔔 NOTIFICATION → ONLY SELECTED UNIVERSITY
// =========================
const io = req.app.get("io");

// ✅ GET ONLY THE SELECTED UNIVERSITY
const universityAdmin = await User.findOne({
  _id: university,
  role: "university",
});

console.log("SELECTED UNIVERSITY:", universityAdmin?.name);

// ✅ SEND NOTIFICATION ONLY TO THAT UNIVERSITY
if (universityAdmin) {
  await createNotification({
    user: universityAdmin._id,
    title: "New University Application",
    message: `${fullName} applied to your university`,
    type: "UNIVERSITY_APPLICATION",
    link: "/university/applications",
    io,
  });

  // ✅ REALTIME SOCKET
  if (io) {
    io.to(universityAdmin._id.toString()).emit(
      "new_notification",
      {
        title: "New University Application",
        message: `${fullName} applied to your university`,
        type: "UNIVERSITY_APPLICATION",
        link: "/university/applications",
      }
    );
  }
}
    // =========================
    // POPULATE RESPONSE
    // =========================
    await application.populate("university", "name");

    return res.json(application);
  } catch (err) {
    console.error("APPLY UNIVERSITY ERROR:", err);
    return res.status(500).json({
      message: "Application failed",
    });
  }
};

// ============================
// GET/CANCEL APPLICATION
// ============================
const getMyApplication = async (req, res) => {
  try {
    const application = await UniversityApplication.findOne({ student: req.user._id }).populate("university", "name").lean();
    res.json(application || null);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch application" });
  }
};

const cancelApplication = async (req, res) => {
  try {
    await UniversityApplication.deleteOne({ student: req.user._id, status: "waiting" });
    await User.findByIdAndUpdate(req.user._id, { application: null });
    res.json({ message: "Application canceled" });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel" });
  }
};

// ============================
// CV
// ============================
const saveCV = async (req, res) => {
  try {
    const { phone, skills, education, experience, projects } = req.body;

    const cv = await CV.findOneAndUpdate(
      { userId: req.user._id },
      { phone, skills, education, experience, projects },
      { new: true, upsert: true }
    );

    await StudentProfile.findOneAndUpdate({ userId: req.user._id }, { skills }, { upsert: true });

    res.json(cv);
  } catch (err) {
    console.error("SAVE CV ERROR:", err);
    res.status(500).json({ message: "Failed to save CV" });
  }
};

const getMyCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user._id });
    res.json(cv || null);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch CV" });
  }
};

// ============================
// INTERNSHIPS
// ============================
const getMyInternships = async (req, res) => {
  try {
    const applications = await InternshipApplication.find({ student: req.user._id })
      .populate({ path: "internship", populate: { path: "company", select: "name email location" } })
      .lean();

    const internships = applications.map((app) => ({ ...app.internship, applicationId: app._id, status: app.status }));
    res.json(internships);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch internships" });
  }
};

const getSuggestedInternships = async (req, res) => {
  try {
    const studentId = req.user._id;

    // =========================
    // GET STUDENT CV (MAIN SOURCE)
    // =========================
    const cv = await CV.findOne({ userId: studentId });

    // fallback to profile if CV missing
    const profile = await StudentProfile.findOne({
      userId: studentId,
    });

    // =========================
    // NORMALIZE SKILLS
    // =========================
    let studentSkills = [];

    if (cv?.skills?.length) {
      studentSkills = cv.skills;
    } else {
      studentSkills = profile?.skills || [];
    }

    studentSkills = studentSkills
      .map((skill) =>
        skill
          .toString()
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ")
      )
      .filter(Boolean);

    // =========================
    // NO SKILLS CASE
    // =========================
    if (!studentSkills.length) {
      return res.status(200).json({
        message: "NO_CV",
        internships: [],
      });
    }

    // =========================
    // GET ALL INTERNSHIPS
    // =========================
    let internships = await InternshipPost.find()
      .populate("company", "name email location")
      .sort({ createdAt: -1 })
      .lean();

    // =========================
    // REMOVE ALREADY APPLIED
    // =========================
    const applications = await InternshipApplication.find({
      student: studentId,
    }).select("internship");

    const appliedIds = applications.map((a) =>
      a.internship?.toString()
    );

    internships = internships.filter(
      (i) => !appliedIds.includes(i._id.toString())
    );

    // =========================
    // NORMALIZATION HELPER
    // =========================
    const normalize = (s) =>
      s
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");

    // =========================
    // SMART MATCHING
    // =========================
    internships = internships.map((internship) => {
      const internshipSkills = (internship.requiredSkills || [])
        .map((skill) => normalize(skill))
        .filter(Boolean);

      let matchedSkills = [];

      internshipSkills.forEach((requiredSkill) => {
        const found = studentSkills.some((studentSkill) => {
          const s = normalize(studentSkill);
          const r = requiredSkill;

          // exact match
          if (s === r) return true;

          // partial match
          if (s.includes(r) || r.includes(s)) return true;

          // stronger cleanup match
          const cleanS = s.replace(/[^a-z0-9]/g, "");
          const cleanR = r.replace(/[^a-z0-9]/g, "");

          return (
            cleanS === cleanR ||
            cleanS.includes(cleanR) ||
            cleanR.includes(cleanS)
          );
        });

        if (found) {
          matchedSkills.push(requiredSkill);
        }
      });

      const matchPercent = internshipSkills.length
        ? Math.round(
            (matchedSkills.length / internshipSkills.length) * 100
          )
        : 0;

      return {
        ...internship,
        matchedSkills,
        matchedCount: matchedSkills.length,
        totalSkills: internshipSkills.length,
        matchPercent,
      };
    });

    // =========================
    // SMART FILTER (FIX EMPTY SCREEN ISSUE)
    // =========================
    const hasAnyMatch = internships.some(
      (i) => i.matchPercent > 0
    );

    if (hasAnyMatch) {
      internships = internships.filter(
        (i) => i.matchPercent > 0
      );
    } else {
      // fallback → show all internships (NO EMPTY UI)
      internships = internships.map((i) => ({
        ...i,
        matchPercent: 0,
        matchedSkills: [],
        matchedCount: 0,
      }));
    }

    // =========================
    // SORT BEST MATCH FIRST
    // =========================
    internships.sort(
      (a, b) => b.matchPercent - a.matchPercent
    );

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      message: "OK",
      internships,
    });

  } catch (err) {
    console.error("SUGGESTED INTERNSHIPS ERROR:", err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
const applyInternship = async (req, res) => {
  try {
    const { internshipId, coverLetter } = req.body;

    if (!internshipId || !coverLetter || !req.file)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await InternshipApplication.findOne({
      internship: internshipId,
      student: req.user._id,
    });

    if (existing)
      return res.status(400).json({ message: "Already applied" });

    const application = await InternshipApplication.create({
      internship: internshipId,
      student: req.user._id,
      coverLetter,
      cvFile: `/uploads/cvs/${req.file.filename}`,
      status: "pending",
    });

    // 🔔 NOTIFICATION → COMPANY ADMIN
    const io = req.app.get("io");

    const internship = await InternshipPost.findById(internshipId).populate("company");

    if (!internship || !internship.company) {
      return res.status(404).json({ message: "Internship not found" });
    }

    await createNotification({
      user: internship.company._id,
      title: "New Internship Application",
      message: `${req.user.name || "A student"} applied for "${internship.title}"`,
      type: "NEW_APPLICATION",
      link: "/company/applications",
      io,
    });

    res.status(201).json({ message: "Application submitted", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyInternshipApplications = async (req, res) => {
  try {
    const apps = await InternshipApplication.find({ student: req.user._id })
      .populate({ path: "internship", populate: { path: "company", select: "name email location" } })
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const cancelInternshipApplication = async (req, res) => {
  try {
    const { applicationId } = req.body;

    if (!applicationId) return res.status(400).json({ message: "Application ID missing" });

    const app = await InternshipApplication.findOne({ _id: applicationId, student: req.user._id });
    if (!app) return res.status(404).json({ message: "Application not found" });

    await app.deleteOne();
    res.json({ message: "Application cancelled" });
  } catch (err) {
    console.error("CANCEL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// GET ALL MY APPLICATIONS
// ============================
const getAllMyApplications = async (req, res) => {
  try {
    const universityApp = await UniversityApplication.findOne({ student: req.user._id }).populate("university", "name");

    const internshipApps = await InternshipApplication.find({ student: req.user._id }).populate({
      path: "internship",
      populate: { path: "company", select: "name email location" },
    });

    res.json({
      universityApplication: universityApp || null,
      internshipApplications: internshipApps || [],
    });
  } catch (err) {
    console.error("GET ALL APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

// ============================
// ADVISOR & CONTACTS
// ============================
const getAssignedAdvisor = async (req, res) => {
  res.json({ message: "Advisor feature coming soon" });
};

const getStudentContacts = async (req, res) => {
  res.json({ message: "Contacts feature coming soon" });
};

// ============================
// CONNECTIONS
// ============================
const getConnections = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).populate("advisor", "name email").populate("supervisor", "name email");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({
      advisor: student.advisor || null,
      supervisor: student.supervisor || null,
    });
  } catch (err) {
    console.error("Get Connections Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// EXPORT ALL CONTROLLERS
// ============================
module.exports = {
  getProfile,
  updateProfile,
  uploadImage,
  submitApplication: applyUniversity, // correct mapping
  getMyApplications: getMyApplication,
  updateApplication: cancelApplication,
  getAssignedAdvisor,
  getStudentContacts,
  getConnections,
  uploadCV,
  getMyCV,
  saveCV,
  getMyInternships,
  getSuggestedInternships,
  applyInternship,
  getMyInternshipApplications,
  cancelInternshipApplication,
  getAllMyApplications,
  getAllInternships: async (req, res) => {
    try {
      const studentId = req.user._id;
      const appliedIds = (await InternshipApplication.find({ student: studentId }).select("internship")).map((a) => a.internship.toString());
      let internships = await InternshipPost.find().populate("company", "name email location").lean();
      internships = internships.filter((i) => !appliedIds.includes(i._id.toString()));
      res.status(200).json(internships);
    } catch (err) {
      console.error("getAllInternships ERROR:", err);
      res.status(500).json({ message: "Failed to fetch internships" });
    }
  },
};