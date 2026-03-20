const express = require('express');
const Groq = require('groq-sdk');
const mongoose = require('mongoose');

const User = require('../models/User');
const DailyLog = require('../models/DailyLog');

const router = express.Router();

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// System instruction (AI personality)
const systemInstruction = `
You are a friendly and motivating fitness coach.
Give short, practical advice.
Focus on Indian diet and simple workouts.
Talk like a real human, not robotic.
Encourage consistency and positivity.
`;

router.post('/', async (req, res) => {
  try {
    const { message, userId, history = [] } = req.body;

    // ✅ Validate message
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // ✅ Check API key
    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "Groq API key is missing. Add GROQ_API_KEY in .env"
      });
    }

    let user = null;
    let log = null;

    // ✅ Safe userId handling
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId);

      const today = new Date().toLocaleDateString("en-CA");

      log = await DailyLog.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        date: today
      });
    } else {
      console.log("⚠️ Invalid or missing userId:", userId);
    }

    // ✅ Safe history handling
    const limitedHistory = Array.isArray(history) ? history.slice(-6) : [];

    // ✅ Build smart prompt
    const prompt = `
User Details:
Weight: ${user?.weight || "unknown"}
Goal: ${user?.goal || "fitness"}
City: ${user?.location?.city || "India"}

Today's Intake:
Calories: ${log?.totalCalories || 0}
Protein: ${log?.totalProtein || 0}

User Message:
${message}
`;

    // ✅ Call Groq AI
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemInstruction },
        ...limitedHistory,
        { role: 'user', content: prompt }
      ],
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 250
    });

    // ✅ Safe response extraction
    const reply =
      chatCompletion?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't respond properly.";

    res.json({ reply });

  } catch (error) {
    console.error("🔥 AI API Error:", error);
    res.status(500).json({
      error: "Something went wrong with the AI coach."
    });
  }
});

module.exports = router;