const router = require("express").Router();
const { protect, allowRoles } = require("../middlewares/authMiddleware");

const adminController = require("../controllers/adminController");

// ==========================
// 👤 PENDING USERS
// ==========================
router.get("/pending", protect, adminController.getPendingUsers);

// ==========================
// ✅ APPROVE / ❌ REJECT
// ==========================
router.put("/approve/:id", protect, adminController.approveUser);
router.put("/reject/:id", protect, adminController.rejectUser);

// ==========================
// 📊 ANALYTICS
// ==========================
router.get("/analytics", protect, allowRoles("admin"), adminController.getAnalytics);

// ==========================
// 👥 USERS
// ==========================
router.get("/users", protect, adminController.getAllUsers);
router.put("/users/:id", protect, adminController.updateUser);
router.delete("/users/:id", protect, adminController.deleteUser);

// ==========================
// 🆕 ADVISORS
// ==========================
router.post("/advisors", protect, allowRoles("university"), adminController.addAdvisor);
router.put("/advisors/:id", protect, allowRoles("university"), adminController.updateAdvisor);
router.delete("/advisors/:id", protect, allowRoles("university"), adminController.deleteAdvisor);
router.get("/advisors", protect, allowRoles("university"), adminController.getAdvisorsByUniversity);

// ==========================
// 🆕 SUPERVISORS
// ==========================
router.post("/supervisors", protect, allowRoles("company"), adminController.addSupervisor);
router.put("/supervisors/:id", protect, allowRoles("company"), adminController.updateSupervisor);
router.delete("/supervisors/:id", protect, allowRoles("company"), adminController.deleteSupervisor);
router.get("/supervisors", protect, allowRoles("company", "admin"), adminController.getAllSupervisors);
// ==========================
// 🆕 internship
// ==========================
router.get("/internships", protect, allowRoles("admin"), adminController.getAllInternships);
router.delete("/internships/:id", protect, allowRoles("admin"), adminController.deleteInternship);
// ==========================
// 🆕 application
// ==========================
router.get("/applications", protect, allowRoles("admin"), adminController.getAllApplications);

// ==========================
// 👤 SUPERVISOR PROFILE
// ==========================
router.get(
  "/supervisor/profile",
  protect,
  allowRoles("supervisor"),
  (req, res) => {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      department: req.user.department,
    });
  }
);

module.exports = router;