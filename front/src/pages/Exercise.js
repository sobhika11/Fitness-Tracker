import React from "react";
import "../styles/Exercise.css";

const Exercise = () => {
  const activity = localStorage.getItem("activityLevel") || "medium";

  const recommendations = {
    light: [
      "10-minute stretching",
      "5-minute breathing exercise",
      "Walk around your home",
    ],
    medium: [
      "15-minute yoga",
      "20 squats + 15 push-ups",
      "10-minute brisk walk",
    ],
    heavy: [
      "30-minute cardio (running/cycling)",
      "40 push-ups + 40 squats",
      "10-minute core workout",
    ],
  };

  return (
    <div className="exercise-container">
      <h2>🏋️ Exercise Recommendations ({activity.toUpperCase()})</h2>
      <ul>
        {recommendations[activity].map((item, index) => (
          <li key={index}>✔️ {item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Exercise;
