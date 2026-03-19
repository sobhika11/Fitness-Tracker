const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String,
    required: true,
    // Format: YYYY-MM-DD
  },
  meals: {
    breakfast: {
      type: String,
      default: 'skipped'
    },
    lunch: {
      type: String,
      default: 'skipped'
    },
    dinner: {
      type: String,
      default: 'skipped'
    }
  },
  totalCalories: {
    type: Number,
    default: 0
  },
  totalProtein: {
    type: Number,
    default: 0
  },
  totalCarbs: {
    type: Number,
    default: 0
  },
  totalFat: {
    type: Number,
    default: 0
  },
  waterIntake: {
    type: Number,
    default: 0
  },
  streakCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure one log per user per day
dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
