const express = require('express');
const router = express.Router();
const Mealplan = require('../models/Mealplan');
const DailyLog = require('../models/DailyLog');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
router.get('/meal_type', async (req, res) => {
  try {
    const { meal_type } = req.params;
    const { city } = req.query;

    let filter = { meal_type };
    if (city) {
      filter['location.city'] = city;
    }

    const meals = await Mealplan.find(filter).select('food calories protein carbs fat serving_size');
    res.json(meals);
  } catch (error) {
    console.error("Error fetching meals by type:", error);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});


router.post('/select', async (req, res) => {
  try {
    const { userId, date, breakfast, lunch, dinner } = req.body;

    if (!userId || !date) {
      return res.status(400).json({ error: "userId and date are required" });
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    const mealsData = { breakfast: 'skipped', lunch: 'skipped', dinner: 'skipped' };
    const processMeal = async (mealId, type) => {
      if (mealId && mealId !== "skipped") {
        const meal = await Mealplan.findById(mealId);
        if (meal) {
          mealsData[type] = meal.food;
          totalCalories += meal.calories || 0;
          totalProtein += meal.protein || 0;
          totalCarbs += meal.carbs || 0;
          totalFat += meal.fat || 0;
        }
      }
    };

    await Promise.all([
      processMeal(breakfast, 'breakfast'),
      processMeal(lunch, 'lunch'),
      processMeal(dinner, 'dinner')
    ]);

    const logData = {
      userId,
      date,
      meals: mealsData,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat
    };

    const updatedLog = await DailyLog.findOneAndUpdate(
      { userId, date },
      { $set: logData },
      { new: true, upsert: true } 
    );

    res.json(updatedLog);
  } catch (error) {
    console.error("Error processing meal selection:", error);
    res.status(500).json({ error: "Failed to save meal selection" });
  }
});

router.get('/log/userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const dailyLog = await DailyLog.findOne({ userId, date: today });
    if (!dailyLog) {
      return res.status(404).json({ message: "No daily log found for today" });
    }

    res.json({
      meals: dailyLog.meals,
      totalCalories: dailyLog.totalCalories,
      totalProtein: dailyLog.totalProtein,
      totalCarbs: dailyLog.totalCarbs,
      totalFat: dailyLog.totalFat
    });
  } catch (error) {
    console.error("Error fetching daily log:", error);
    res.status(500).json({ error: "Failed to fetch daily log" });
  }
});

router.post('/recommend', async (req, res) => {
  try {
    const { goal, weather, temp } = req.body;
    const meals = await Mealplan.find({}).select('food meal_type calories protein carbs fat serving_size -_id');
    const meal_data_json = JSON.stringify(meals);
    const prompt = `
      You are a smart nutritionist.

      User details:
      - Goal: ${goal || 'Healthy Living'}
      - Weather: ${weather || 'moderate'} (hot / cold / rainy)
      - Temperature: ${temp || '25'}

      Available meals:
      ${meal_data_json}

      Instructions:
      - If weather is HOT:
        - Prefer light, hydrating, low-oil foods
        - Avoid heavy, fried foods
      - If weather is COLD:
        - Prefer warm, high-energy foods
      - If RAINY:
        - Suggest warm and immunity-boosting foods

      Select best meals for:
      - breakfast
      - lunch
      - dinner

      Include:
      - food
      - calories
      - protein
      - carbs
      - fat

      Return ONLY a valid JSON object matching this exact structure containing the selected meals:
      {
        "breakfast": { "food": "...", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
        "lunch": { "food": "...", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 },
        "dinner": { "food": "...", "calories": 0, "protein": 0, "carbs": 0, "fat": 0 }
      }
      `;

      const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
      responseMimeType: "application/json",
      }
      });

    const result = await model.generateContent(prompt);
    const recommendation = JSON.parse(result.response.text());
    res.json(recommendation);
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    res.status(500).json({ error: "Failed to generate meal plan recommendation." });
  }
});

module.exports = router;
