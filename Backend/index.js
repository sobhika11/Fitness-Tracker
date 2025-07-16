const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 
console.log("MONGO_URI:", process.env.MONGO_URI);
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Fitness Tracker API is running!");
});
const authRoutes = require("./routes/authroutes");
app.use("/api/auth", authRoutes);

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

const streakRoutes = require("./routes/streakRoutes");
app.use("/api/streak", streakRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/fitness-tracker")
  .then(() => {
    console.log("✅ MongoDB connected!");
    app.listen(process.env.PORT || 5000, () => {
      console.log("🚀 Server running at http://localhost:" + (process.env.PORT || 5000));
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
  });
