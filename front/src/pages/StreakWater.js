import React, { useEffect, useState } from "react";
import "../styles/StreakWater.css";

const StreakWater = () => {
  const [streak, setStreak] = useState(0);
  const [lastSubmitted, setLastSubmitted] = useState(null);
  const [meals, setMeals] = useState({ breakfast: false, lunch: false, dinner: false });
  const [waterCount, setWaterCount] = useState(0);
  const waterGoal = 8;

  useEffect(() => {
    const savedStreak = localStorage.getItem("fittrackStreak");
    const savedDate = localStorage.getItem("fittrackLastSubmit");
    const savedWater = localStorage.getItem("fittrackWater");

    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedDate) setLastSubmitted(savedDate);
    if (savedWater) setWaterCount(parseInt(savedWater));
  }, []);

  const handleMealChange = (e) => {
    const { name, checked } = e.target;
    setMeals((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = () => {
    const allMealsChecked = meals.breakfast && meals.lunch && meals.dinner;
    const today = new Date().toDateString();

    if (lastSubmitted === today) {
      alert("You already submitted for today!");
      return;
    }

    if (allMealsChecked) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("fittrackStreak", newStreak);
      alert("Streak continued! ✅");
    } else {
      setStreak(0);
      localStorage.setItem("fittrackStreak", 0);
      alert("Streak broken! ❌ You must check all 3 meals.");
    }

    setLastSubmitted(today);
    localStorage.setItem("fittrackLastSubmit", today);
  };

  const handleWaterIncrement = () => {
    if (waterCount < waterGoal) {
      const newCount = waterCount + 1;
      setWaterCount(newCount);
      localStorage.setItem("fittrackWater", newCount);
    }
  };

  return (
    <div className="streak-water-container">
      <h2>🔥 Your Daily Streak</h2>
      <p className="streak-count">Current Streak: <strong>{streak}</strong> days</p>

      <form className="meal-form" onSubmit={(e) => e.preventDefault()}>
        <div className="meal-checkboxes">
          {["breakfast", "lunch", "dinner"].map((meal) => (
            <label key={meal}>
              <input
                type="checkbox"
                name={meal}
                checked={meals[meal]}
                onChange={handleMealChange}
              />
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </label>
          ))}
        </div>
        <button type="button" onClick={handleSubmit}>✅ Submit Meals</button>
      </form>

      <div className="water-tracker">
        <h3>💧 Water Intake</h3>
        <p>{waterCount} / {waterGoal} glasses</p>
        <button onClick={handleWaterIncrement}>+ Add Glass</button>
      </div>
    </div>
  );
};

export default StreakWater;
