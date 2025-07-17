import React from "react";
import "../styles/Exercise.css";

const Exercise = () => {
  const activity = localStorage.getItem("activityLevel") || "medium";

  const exercisePlans = {
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
      <h2>🏋️ Exercise Recommendations</h2>
      <p className="level-tag">Level: {activity.toUpperCase()}</p>
      <ul className="exercise-list">
        {exercisePlans[activity].map((exercise, index) => (
          <li key={index}>💪 {exercise}</li>
        ))}
      </ul>
    </div>
  );
};

export default Exercise;
