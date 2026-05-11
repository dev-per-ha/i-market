const router = require("express").Router();
const { register, login ,forgotPassword ,changePassword} = require("../controllers/authController");
const upload = require("../middlewares/upload");
const {
  protect,
} = require("../middlewares/authMiddleware");
// Register with file upload
router.post("/register", upload.single("document"), register);

// Login
router.post("/login", login);
// forget password
router.post(
  "/forgot-password",
  forgotPassword
);
//change password
router.put(
  "/change-password",
  protect,
  changePassword
);
module.exports = router;