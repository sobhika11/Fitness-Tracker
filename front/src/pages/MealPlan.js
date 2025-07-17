import React from "react";
import "../styles/MealPlan.css";

const MealPlan = () => {
  const meals = {
    Breakfast: ["Oats with fruits", "1 boiled egg", "Green tea"],
    Lunch: ["Grilled chicken or tofu", "Brown rice", "Mixed vegetables"],
    Dinner: ["Vegetable soup", "Salad with chickpeas", "Low-fat yogurt"],
  };

  return (
    <div className="mealplan-container">
      <h2>🍽️ Today's Meal Plan</h2>
      <div className="meal-cards">
        {Object.entries(meals).map(([meal, items]) => (
          <div className="meal-card" key={meal}>
            <h3>{meal}</h3>
            <ul>
              {items.map((item, index) => (
                <li key={index}>✅ {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlan;
