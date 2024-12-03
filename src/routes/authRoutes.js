// routes/authRoutes.js

const express = require("express");
const { register, login, refreshToken, logout, updateRole, adminDashboard, viewReports } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const checkPermission = require("../middleware/permissionMiddleware"); // Import checkPermission

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", verifyToken, logout);

// Example of a protected route with permission check
router.put("/update-role/:userId", verifyToken, checkPermission("canEditUsers"), updateRole);

// Admin-only route
router.get("/admin-dashboard", verifyToken, checkPermission("canViewReports"), adminDashboard);

// User with 'canViewReports' permission
router.get("/view-reports", verifyToken, checkPermission("canViewReports"), viewReports);

module.exports = router;
