const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "user", enum: ["admin", "user", "manager"] },
        permissions: [String], // Array of permissions
        refreshToken: { type: String }, // Store refresh tokens for session management
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
