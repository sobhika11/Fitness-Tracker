const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DailyLog = require('../models/DailyLog');

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
   const mongoose = require("mongoose");

const log = await DailyLog.findOne({
  userId: new mongoose.Types.ObjectId(userId),
  date: today
});
    let todayStats = {
      waterIntake: 0,
      caloriesConsumed: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };

    let caloriesBurned = 0;

    if (log) {
      todayStats = {
        waterIntake: log.waterIntake || 0,
        caloriesConsumed: log.totalCalories || 0,
        protein: log.totalProtein || 0,
        carbs: log.totalCarbs || 0,
        fat: log.totalFat || 0
      };

      caloriesBurned = parseFloat((todayStats.caloriesConsumed * 0.1).toFixed(2));
    }

    res.json({
      name: user.name || user.username,
      email: user.email,
      streakCount: user.streakCount || 0,
      caloriesBurned: caloriesBurned,
      today: todayStats
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

module.exports = router;
