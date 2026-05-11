const User = require("../models/User");
const Chat = require("../models/Chat");
const Application = require("../models/InternshipApplication");
const Internship = require("../models/Internship");
const CV = require("../models/CV");
const Report = require("../models/Report");
const bcrypt = require("bcryptjs");
const deleteAccount = async (user, password) => {
  const userId = user._id;
  const role = user.role;
const freshUser = await User.findById(userId);

if (!freshUser) {
  throw new Error("User not found");
}

const isMatch = await bcrypt.compare(password, freshUser.password);

if (!isMatch) {
  const err = new Error("Incorrect password");
  err.status = 401;
  throw err;
}
  // 🔥 COMMON CLEANUP
  await Chat.deleteMany({
    $or: [{ sender: userId }, { receiver: userId }]
  });

  // 👨‍🎓 STUDENT
  if (role === "student") {
    await Application.deleteMany({ student: userId });
    await CV.deleteOne({ user: userId });
  }

  // 🏢 COMPANY
  if (role === "company") {
    await Internship.deleteMany({ company: userId });
    await Application.deleteMany({ company: userId });
  }

  // 🏫 UNIVERSITY
  if (role === "university") {
    await Report.deleteMany({ university: userId });
  }

  // 👨‍🏫 ADVISOR / SUPERVISOR
  if (role === "advisor" || role === "supervisor") {
    await Report.updateMany(
      { advisor: userId },
      { $unset: { advisor: 1 } }
    );
  }

  // 🔥 FINAL DELETE USER
  await User.findByIdAndDelete(userId);
};

module.exports = { deleteAccount };