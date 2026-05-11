const router = require("express").Router();
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

router.get("/", async (req, res) => {
  try {
    const { token, action } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send(`
        <h2 style="text-align:center;margin-top:80px;color:red;">
          ❌ Invalid or expired link
        </h2>
      `);
    }

    // ==========================
    // ✅ APPROVE
    // ==========================
    if (action === "approve") {
      user.status = "approved";
      user.verificationToken = null;
      user.verificationExpires = null;

      await user.save();

      // optional: send confirmation email
      await sendEmail({
        to: user.email,
        subject: "Account Activated",
        html: `
          <h2>Hello ${user.name}</h2>
          <p>Your account is now active. You can login.</p>
        `,
      });

      return res.send(`
        <div style="text-align:center;margin-top:80px;font-family:Arial;">
          <h2 style="color:green;">✅ Account Approved</h2>
          <p>You can now login using your email and password.</p>

          <a href="${process.env.FRONTEND_URL}/login">
            <button style="
              margin-top:20px;
              padding:10px 20px;
              background:blue;
              color:white;
              border:none;
              border-radius:5px;
            ">
              Go to Login
            </button>
          </a>
        </div>
      `);
    }

    // ==========================
    // ❌ REJECT
    // ==========================
    if (action === "reject") {
      await User.findByIdAndDelete(user._id);

      return res.send(`
        <div style="text-align:center;margin-top:80px;font-family:Arial;">
          <h2 style="color:red;">❌ Account Rejected</h2>
          <p>This account has been removed for security reasons.</p>
        </div>
      `);
    }

    return res.send("Invalid action");

  } catch (error) {
    console.error(error);
    return res.send("Server error");
  }
});

module.exports = router;