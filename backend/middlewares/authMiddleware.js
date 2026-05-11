// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) return res.status(401).json({ message: "User not found" });

      next();
    } catch (error) {
      console.error("Auth Middleware Error:", error);
      return res.status(401).json({ message: "Token failed" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// Role-based access
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { protect, allowRoles };