const express = require('express');
const router = express.Router();
const DailyLog = require('../models/DailyLog');

// 1. PATCH /api/log/water
router.patch('/water', async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({ error: "userId and amount are required" });
    }

    // Ensures the amount is treated as a number
    const numericAmount = Number(amount);
    
    if (isNaN(numericAmount)) {
        return res.status(400).json({ error: "amount must be a valid number" });
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    // Find and update the log, create if it doesn't exist
    // Using $inc adds the exact amount to the existing value
    const updatedLog = await DailyLog.findOneAndUpdate(
      { userId, date: today },
      { $inc: { waterIntake: numericAmount } },
      { new: true, upsert: true }
    );

    res.json({ waterIntake: updatedLog.waterIntake });
  } catch (error) {
    console.error("Error updating water intake:", error);
    res.status(500).json({ error: "Failed to update water intake" });
  }
});

// 2. GET /api/log/water/:userId
router.get('/water/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date().toISOString().split("T")[0];

    const log = await DailyLog.findOne({ userId, date: today });
    
    if (!log) {
      // If no log exists for today, they haven't logged any water yet
      return res.json({ waterIntake: 0 }); 
    }

    res.json({ waterIntake: log.waterIntake });
  } catch (error) {
    console.error("Error fetching water intake:", error);
    res.status(500).json({ error: "Failed to fetch water intake" });
  }
});

module.exports = router;
