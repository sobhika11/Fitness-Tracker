const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 
console.log("MONGO_URI:", process.env.MONGO_URI);
const app = express();
app.use(cors());
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("Fitness Tracker API is running!");
});
const authRoutes = require("./routes/authroutes");
app.use("/api/auth", authRoutes);

// Connect to MongoDBmongoose
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected!");
    app.listen(5000, () => {
      console.log("🚀 Server running at http://localhost:5000");
    });
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err.message);
  });
