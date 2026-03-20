const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String
    },
    name: {
        type: String
    },
    weight: {
        type: Number,
        default: null
    },
    goal: {
        type: String,
        default: null
    },
    streakCount: {
        type: Number,
        default: 0
    },
    lastStreakUpdate: {
        type: String,
        default: null
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;