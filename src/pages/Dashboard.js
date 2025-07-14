import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const [extraFood, setExtraFood] = useState("");
  const [streak, setStreak] = useState(0);
  const [lastSubmitted, setLastSubmitted] = useState(null);
  const [waterCount, setWaterCount] = useState(0);
  const waterGoal = 8;

  const mockExerciseLevel = "medium"; // replace with profile value later

  // Load saved streak and date on component mount
  useEffect(() => {
    const savedStreak = localStorage.getItem("fittrackStreak");
    const savedDate = localStorage.getItem("fittrackLastSubmit");

    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedDate) setLastSubmitted(savedDate);
  }, []);

  const handleMealChange = (e) => {
    const { name, checked } = e.target;
    setMeals((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

    console.log("Meals:", meals);
    console.log("Extra Food:", extraFood);
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📆 Daily Tracker</h2>

      <form onSubmit={handleSubmit} className="meal-form">
        <div className="meal-checks">
          <label>
            <input
              type="checkbox"
              name="breakfast"
              checked={meals.breakfast}
              onChange={handleMealChange}
            />
            🍳 Breakfast
          </label>
          <label>
            <input
              type="checkbox"
              name="lunch"
              checked={meals.lunch}
              onChange={handleMealChange}
            />
            🍱 Lunch
          </label>
          <label>
            <input
              type="checkbox"
              name="dinner"
              checked={meals.dinner}
              onChange={handleMealChange}
            />
            🍲 Dinner
          </label>
        </div>

        <label>🍔 Extra Foods Taken:</label>
        <textarea
          value={extraFood}
          onChange={(e) => setExtraFood(e.target.value)}
          placeholder="Snacks, desserts, drinks, etc."
        />

        <button type="submit">✅ Submit for Today</button>
      </form>

      <div className="streak-badge">
        🔥 Streak: <span>{streak}</span> day{streak === 1 ? "" : "s"}!
      </div>

      <div className="water-tracker">
        💧 Water Intake:
        <p>
          {waterCount} / {waterGoal} glasses
        </p>
        <button
          onClick={() =>
            setWaterCount((prev) => (prev < waterGoal ? prev + 1 : prev))
          }
        >
          + Add Glass
        </button>
      </div>

      <div className="meal-suggestions">
        <h3>🍽️ Today's Meal Plan</h3>
        <div className="meal-cards">
          <div className="meal-card">
            <h4>Breakfast</h4>
            <ul>
              <li>Oats with fruits</li>
              <li>1 boiled egg</li>
              <li>Green tea</li>
            </ul>
          </div>
          <div className="meal-card">
            <h4>Lunch</h4>
            <ul>
              <li>Grilled chicken or tofu</li>
              <li>Brown rice</li>
              <li>Mixed vegetables</li>
            </ul>
          </div>
          <div className="meal-card">
            <h4>Dinner</h4>
            <ul>
              <li>Vegetable soup</li>
              <li>Salad with chickpeas</li>
              <li>Low-fat yogurt</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="exercise-suggestions">
        <h3>🏋️ Exercise Recommendations ({mockExerciseLevel.toUpperCase()})</h3>

        {mockExerciseLevel === "light" && (
          <ul>
            <li>10-minute stretching</li>
            <li>5-minute breathing exercise</li>
            <li>Walk around your home</li>
          </ul>
        )}

        {mockExerciseLevel === "medium" && (
          <ul>
            <li>15-minute yoga</li>
            <li>20 squats + 15 push-ups</li>
            <li>10-minute brisk walk</li>
          </ul>
        )}

        {mockExerciseLevel === "heavy" && (
          <ul>
            <li>30-minute cardio (running/cycling)</li>
            <li>40 push-ups + 40 squats</li>
            <li>10-minute core workout</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
