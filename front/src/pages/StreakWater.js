import React, { useEffect, useState } from "react";
import "../styles/StreakWater.css";

const StreakWater = () => {
  const [streak, setStreak] = useState(0);
  const [lastSubmitted, setLastSubmitted] = useState(null);
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

  const handleWaterIncrease = () => {
    if (waterCount < waterGoal) {
      const newCount = waterCount + 1;
      setWaterCount(newCount);
      localStorage.setItem("fittrackWater", newCount);
    }
  };

  return (
    <div className="streak-water-container">
      <h2>🔥 Streak & 💧 Water Tracker</h2>

      <div className="tracker-box">
        <h3>🔥 Current Streak</h3>
        <p>{streak} day{streak === 1 ? "" : "s"}</p>
        {lastSubmitted && <p>✅ Last submitted: {lastSubmitted}</p>}
      </div>

      <div className="tracker-box">
        <h3>💧 Water Intake</h3>
        <p>{waterCount} / {waterGoal} glasses</p>
        <button onClick={handleWaterIncrease}>+ Add Glass</button>
      </div>
    </div>
  );
};

export default StreakWater;
