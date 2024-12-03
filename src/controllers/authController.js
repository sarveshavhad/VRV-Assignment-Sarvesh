const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Permissions by role
const rolePermissions = {
    admin: ["canEditUsers", "canDeletePosts", "canViewReports"],
    user: ["canViewPosts", "canComment"],
    manager: ["canViewReports", "canManageTeam"],
};

// Helper function to assign permissions based on role
const assignPermissions = (role) => rolePermissions[role] || [];

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, permissions: user.permissions },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
};

// Register
const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create user
        const newUser = new User({
            username,
            password: hashedPassword,
            role: role || "user", // Default to 'user' role
            permissions: assignPermissions(role || "user"), // Assign permissions based on role
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully!", user: newUser });
    } catch (err) {
        res.status(500).json({ message: "Registration failed", error: err.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({ token, refreshToken });
    } catch (err) {
        res.status(500).json({ message: "Login failed", error: err.message });
    }
};

// Refresh Token
const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ message: "Refresh token required" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateToken(user);
        res.status(200).json({ token: newAccessToken });
    } catch (err) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

// Logout
const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Clear the refresh token from the user
        user.refreshToken = null;
        await user.save();

        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        res.status(500).json({ message: "Failed to log out", error: err.message });
    }
};
// Update User Role (Admin-only functionality)
// Update Role by Username
const updateRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { username } = req.params;

        // Validate the role
        const validRoles = ["admin", "user", "manager"];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }

        // Assign permissions for the role
        const permissions = assignPermissions(role);

        // Update the user role
        const user = await User.findOneAndUpdate(
            { username },
            { role, permissions },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Role updated successfully", user });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Failed to update role", error: err.message });
    }
};

// Protected Route for Admins (Example)
const adminDashboard = (req, res) => {
    // Example of a protected route for Admins
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access Denied" });
    }
    res.status(200).json({ message: "Welcome to Admin Dashboard" });
};

// Protected Route for Users (Example)
const viewReports = (req, res) => {
    // Example of a protected route for users with 'canViewReports' permission
    if (!req.user.permissions.includes("canViewReports")) {
        return res.status(403).json({ message: "Access Denied" });
    }
    res.status(200).json({ message: "Viewing reports" });
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    updateRole,
    adminDashboard,
    viewReports
};
