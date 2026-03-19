const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const User = require('../models/User');
const DailyLog = require('../models/DailyLog');

const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemInstruction = `
You are a professional fitness coach.
Give short, practical advice.
Focus on Indian diet and simple workouts.
`;

router.post('/', async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is not configured." });
    }

    let user = null;
    let log = null;

    if (userId) {
      user = await User.findById(userId);

      const today = new Date().toISOString().split("T")[0];
      log = await DailyLog.findOne({ userId, date: today });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const prompt = `
User Details:
Weight: ${user?.weight || "unknown"}
Goal: ${user?.goal || "fitness"}
City: ${user?.location?.city || "India"}

Today's Intake:
Calories: ${log?.totalCalories || 0}
Protein: ${log?.totalProtein || 0}

User Question:
${message}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;