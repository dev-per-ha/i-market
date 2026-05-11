const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const Student = require("../models/Student");
const Application = require("../models/Application");
const InternshipPost = require("../models/InternshipPost");
const ChatRoom = require("../models/ChatRoom");


// ================= GET MY APPLICATIONS =================
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.user._id,
    }).populate("internshipId", "title companyName");

    res.status(200).json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};






// ================= GET ASSIGNED ADVISOR =================
exports.getAssignedAdvisor = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .populate("advisor", "name email department");

    if (!student)
      return res.status(404).json({ message: "Student not found" });

    res.json({ advisor: student.advisor || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET CONTACTS =================
exports.getStudentContacts = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .populate("advisor", "name email role");

    const supervisors = await User.find({
      role: "supervisor",
    }).select("name email role");

    const groupChats = await ChatRoom.find({
      participants: req.user._id,
      type: "group",
    })
      .populate("participants", "name email role")
      .populate("internship", "title");

    res.json({
      advisors: student.advisor ? [student.advisor] : [],
      supervisors,
      groupChats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
};





// ================= UPDATE APPLICATION =================
exports.updateApplication = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);

    if (!app)
      return res.status(404).json({ message: "Not found" });

    app.status = "pending";
    await app.save();

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.image = req.file.filename;
    await user.save();

    res.json({ image: req.file.filename });
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
};



// POST /apply-university
exports.applyUniversity = async (req, res) => {
  try {
    const { name, email, universityId } = req.body;
    let profileImage = req.file ? req.file.filename : null;

    if (!name || !email || !universityId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if already applied
    const existing = await Application.findOne({ student: req.user._id, university: universityId });
    if (existing) {
      return res.status(400).json({ message: "You already applied to this university" });
    }

    const application = new Application({
      student: req.user._id,
      name,
      email,
      profileImage,
      university: universityId,
    });

    await application.save();

    res.json({ message: "Application submitted successfully", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.submitApplication = async (req, res) => {
  try {
    const { name, email, university } = req.body;
    const profileImage = req.file ? req.file.filename : null;

    const application = new Application({
      student: req.user._id,
      name,
      email,
      university,
      profileImage,
    });

    await application.save();
    res.json({ message: "Application submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};








// ================= GET CONNECTIONS =================
exports.getMyConnections = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("advisor", "name email")
      .populate("supervisor", "name email");

    res.json({
      advisor: user?.advisor || null,
      supervisor: user?.supervisor || null,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id }).lean();

    const user = await User.findById(req.user._id)
      .select("name email phone status university advisor image")
      .populate("university", "name email")
      .populate("advisor", "name email")
      .lean();

    res.json({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      image: user?.image || null,
      skills: profile?.skills || [],
      bio: profile?.bio || "",
      status: user?.status || "not_applied",
      university: user?.university || null,
      advisor: user?.advisor || null,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, skills } = req.body;

    await User.findByIdAndUpdate(req.user._id, { name, phone });

    const skillsArr = Array.isArray(skills)
      ? skills
      : skills?.split(",").map(s => s.trim());

    let profile = await StudentProfile.findOne({ userId: req.user._id });

    if (profile) {
      profile = await StudentProfile.findOneAndUpdate(
        { userId: req.user._id },
        { bio, skills: skillsArr },
        { new: true }
      );
    } else {
      profile = new StudentProfile({
        userId: req.user._id,
        bio,
        skills: skillsArr,
      });
      await profile.save();
    }

    res.json(profile);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};