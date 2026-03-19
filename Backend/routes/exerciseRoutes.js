const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const User = require('../models/User');
const DailyLog = require('../models/DailyLog');

router.post('/cycling', async (req, res) => {
  try {
    const { userId, duration, distance, spotifyUrl } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    if (!duration && !distance) {
      return res.status(400).json({ error: 'Either duration OR distance must be provided' });
    }
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    const dateStr = (new Date(today - offset)).toISOString().split('T')[0];
    let calories = 0;
    if (duration) calories = duration * 10;
    else if (distance) calories = distance * 40;
    let log = await DailyLog.findOne({ userId, date: dateStr });
    if (!log) {
      log = new DailyLog({
        userId,
        date: dateStr,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        waterIntake: 0,
        streakCompleted: false
      });
    }
    log.cycling = {
      duration: duration || null,
      distance: distance || null,
      calories,
      spotifyUrl: spotifyUrl || null
    };

    log.totalCalories = (log.totalCalories || 0) + calories;
    log.streakCompleted = true;
    await log.save();
    res.status(200).json({
      message: "Cycling workout recorded 🚴",
      caloriesBurned: calories,
      cycling: log.cycling
    });
  }
  catch (error) {
    console.error('Error recording cycling:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/exercise/aerobic
router.get('/aerobic', async (req, res) => {
  try {
    const exercises = await Exercise.find({
      type: 'aerobic',
      videoUrl: { $exists: true, $ne: "" }
    })
      .sort({ duration: 1 })
      .select('name duration intensity videoUrl description -_id');

    res.status(200).json(exercises);
  } catch (error) {
    console.error('Error fetching aerobic exercises:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
