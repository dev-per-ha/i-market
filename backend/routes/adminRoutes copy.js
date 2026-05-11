const router = require("express").Router();
const { protect, allowRoles } = require("../middlewares/authMiddleware");

const {
  getPendingUsers,
  approveUser,
  rejectUser,
  getAnalytics,
  getAllUsers,
  updateUser,
  deleteUser,
   addAdvisor,
  updateAdvisor,
  deleteAdvisor,
  getAdvisorsByUniversity,
  addSupervisor,
  getAllSupervisors,
  updateSupervisor,
  deleteSupervisor,
} = require("../controllers/adminController");


// Pending users
router.get("/pending", protect, getPendingUsers);

// Approve / Reject
router.put("/approve/:id", protect, approveUser);
router.put("/reject/:id", protect, rejectUser);

// Analytics
router.get("/analytics", protect,allowRoles("admin"), getAnalytics);

// Users
router.get("/users", protect, getAllUsers);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);

// ==========================
// 🆕 ADVISOR MANAGEMENT
// ==========================
router.post("/advisors", protect, addAdvisor); // create
router.put("/advisors/:id", protect, updateAdvisor); // edit
router.delete("/advisors/:id", protect, deleteAdvisor); // delete
router.get("/advisors", protect, getAdvisorsByUniversity); // list



// ==========================
// 🆕 SUPERVISOR MANAGEMENT
// ==========================
router.post("/supervisors", protect, addSupervisor); // create
router.put("/supervisors/:id", protect, updateSupervisor); // edit
router.delete("/supervisors/:id", protect, deleteSupervisor); // delete
router.get("/supervisors", protect, getAllSupervisors); // list
// 

// Example: get supervisor profile
router.get("/supervisor/profile", protect, allowRoles("supervisor"), async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    department: req.user.department,
  });
});
module.exports = router;