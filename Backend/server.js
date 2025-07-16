const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/Profile", profileRoutes);
