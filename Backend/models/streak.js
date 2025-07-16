// models/streak.js

const mongoose = require("mongoose");

const StreakSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  currentStreak: {
    type: Number,
    default: 0,
  },
  lastChecked: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Streak", StreakSchema);
