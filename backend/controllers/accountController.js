const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { deleteAccount } = require("../services/accountDeletionService");


exports.deleteMyAccount = async (req, res) => {
  try {
    const user = req.user;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required"
      });
    }

    await deleteAccount(user, password);

    return res.status(200).json({
      message: "Account deleted successfully"
    });

  } catch (error) {
    return res.status(400).json({
      message: error.message || "Failed to delete account"
    });
  }
};