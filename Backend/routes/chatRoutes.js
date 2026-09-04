const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/User');
const DailyLog = require('../models/DailyLog');

const router = express.Router();

router.post('/', async (req, res) => {
  console.log("AI route hit", req.body);
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
    // Fetch user and daily log for context
    let user;
    let log;
    if (userId) {
      user = await User.findById(userId);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      log = await DailyLog.findOne({ userId, date: today });
    }

    const chatCompletion = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "You are a friendly and motivating fitness coach. Give short, practical advice." },
            ...history.slice(-6).map(m => ({ role: m.role, content: m.content || m.text || "Hello" })),
            { role: "user", content: `User Details: Weight: ${user?.weight || "unknown"} Goal: ${user?.goal || "fitness"} Cal: ${log?.totalCalories || 0}\n\nUser Message: ${message}` }
          ],
          max_tokens: 250,
          temperature: 0.7
        })
      }
    );

    const data = await chatCompletion.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't respond.";

    res.json({ reply });

  } catch (error) {
    console.error("🔥 AI API Error:", error);
    res.status(500).json({
      error: "Something went wrong with the AI coach."
    });
  }
});

module.exports = router;