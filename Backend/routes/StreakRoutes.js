const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DailyLog = require('../models/DailyLog');
const updateStreak = async (userId) => {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const user = await User.findById(userId);
  if (!user) return { streakCompleted: false, streakCount: 0 };

  const todayLog = await DailyLog.findOne({ userId, date: todayStr });
  let todayCompleted = false;
  if (todayLog) {
    const { breakfast, lunch, dinner } = todayLog.meals || {};
    const hasMeal = (breakfast && breakfast !== 'skipped') || 
                    (lunch && lunch !== 'skipped') || 
                    (dinner && dinner !== 'skipped');
    
    if (hasMeal || (todayLog.waterIntake && todayLog.waterIntake > 0)) {
      todayCompleted = true;
    }

    if (todayLog.streakCompleted !== todayCompleted) {
      todayLog.streakCompleted = todayCompleted;
      await todayLog.save();
    }
  }

  let newStreakVal = user.streakCount || 0;
  if (todayCompleted) {
    const yesterdayLog = await DailyLog.findOne({ userId, date: yesterdayStr });
    const yesterdayCompleted = yesterdayLog ? yesterdayLog.streakCompleted : false;

    if (yesterdayCompleted) {
      if (user.lastStreakUpdate !== todayStr) {
        newStreakVal += 1;
      }
    } else {
      newStreakVal = 1; 
    }

    user.lastStreakUpdate = todayStr;
  } else {
    newStreakVal = 0;
  }

  if (user.streakCount !== newStreakVal) {
    user.streakCount = newStreakVal;
    await user.save();
  }

  return { streakCompleted: todayCompleted, streakCount: newStreakVal };
};

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await updateStreak(userId);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error updating/fetching streak:", error);
    res.status(500).json({ error: "Failed to fetch streak" });
  }
});

module.exports = router;
