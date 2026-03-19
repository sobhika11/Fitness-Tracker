const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['strength', 'aerobic', 'flexibility'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  caloriesBurnPerMin: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },

  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },

  sets: Number,
  reps: Number,

  intensity: {
    type: String,
    enum: ['low', 'medium', 'high']
  },

  songs: {
    type: [String],
    default: []
  },

  videoUrl: {
    type: String
  },

  poses: {
    type: [String],
    default: []
  }

}, { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise;