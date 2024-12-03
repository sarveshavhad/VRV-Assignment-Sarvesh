require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");

const app = express();
dbConnect();


// Middleware to parse JSON
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello everyone");
});

// Routes
app.use("/api/auth", authRoutes);

// Start Server
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
