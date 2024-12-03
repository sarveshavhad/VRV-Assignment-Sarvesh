require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");

const app = express();
dbConnect();

// Enable CORS
app.use(
    cors({
        origin: "http://localhost:3000", // Allow requests from your frontend
        methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
        credentials: true, // If you need to allow cookies
    })
);

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
