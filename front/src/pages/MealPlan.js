import React from "react";
import "../styles/MealPlan.css";

const MealPlan = () => {
  const meals = {
    Breakfast: ["Oats with fruits", "1 boiled egg", "Green tea"],
    Lunch: ["Grilled chicken or tofu", "Brown rice", "Mixed vegetables"],
    Dinner: ["Vegetable soup", "Salad with chickpeas", "Low-fat yogurt"],
  };

  return (
    <div className="meal-plan-container">
      <h2>🍽️ Today's Meal Plan</h2>
      <div className="meal-cards">
        {Object.entries(meals).map(([meal, items]) => (
          <div className="meal-card" key={meal}>
            <h4>{meal}</h4>
            <ul>
              {items.map((food, i) => (
                <li key={i}>✔️ {food}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlan;
