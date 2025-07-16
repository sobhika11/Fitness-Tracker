import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
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

  const userEmail = localStorage.getItem("userEmail");
  const userName = localStorage.getItem("userName");
  const userPicture = localStorage.getItem("userPicture");

  useEffect(() => {
    if (!userEmail) navigate("/");
  }, [userEmail, navigate]);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/profile?email=${userEmail}`);
      console.log("✅ Profile fetched:", res.data); // ✅ Log success
      setProfile(res.data);
    } catch (err) {
      console.error("❌ Error fetching profile:", err.message);
    }
  };
  fetchProfile();
}, [userEmail]);


  useEffect(() => {
    const savedStreak = localStorage.getItem("fittrackStreak");
    const savedDate = localStorage.getItem("fittrackLastSubmit");
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedDate) setLastSubmitted(savedDate);
  }, []);

  const handleMealChange = (e) => {
    const { name, checked } = e.target;
    setMeals((prev) => ({ ...prev, [name]: checked }));
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
  };

  const activity = profile?.physicalActivity || "medium";

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src={userPicture} alt="Profile" className="sidebar-avatar" onClick={() => navigate("/profile")} />
        <p>{userName}</p>
      </div>

      <div className="main-content">
        <h2 className="dashboard-title">📆 Daily Tracker</h2>

        {!profile ? (
          <p>Loading profile...</p>
        ) : (
          <>
            <div className="user-info">
              <h3>👋 Hello, {profile.name}!</h3>
              <p>📧 Email: {profile.email}</p>
              <p>🎂 Age: {profile.age}</p>
              <p>📅 DOB: {new Date(profile.dateOfBirth).toDateString()}</p>
              <p>📏 Height: {profile.height} cm</p>
              <p>⚖️ Weight: {profile.weight} kg</p>
              <p>🏋️ Activity Level: {profile.physicalActivity}</p>
              <p>💼 Occupation: {profile.occupation}</p>
            </div>

            <form onSubmit={handleSubmit} className="meal-form">
              <div className="meal-checks">
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <label key={meal}>
                    <input type="checkbox" name={meal} checked={meals[meal]} onChange={handleMealChange} />
                    {meal === "breakfast" && "🍳 Breakfast"}
                    {meal === "lunch" && "🍱 Lunch"}
                    {meal === "dinner" && "🍲 Dinner"}
                  </label>
                ))}
              </div>

              <label>🍔 Extra Foods Taken:</label>
              <textarea value={extraFood} onChange={(e) => setExtraFood(e.target.value)} placeholder="Snacks, desserts, drinks, etc." />

              <button type="submit">✅ Submit for Today</button>
            </form>

            <div className="streak-badge">
              🔥 Streak: <span>{streak}</span> day{streak === 1 ? "" : "s"}!
            </div>

            <div className="water-tracker">
              💧 Water Intake:
              <p>{waterCount} / {waterGoal} glasses</p>
              <button onClick={() => setWaterCount((prev) => (prev < waterGoal ? prev + 1 : prev))}>+ Add Glass</button>
            </div>

            <div className="meal-suggestions">
              <h3>🍽️ Today's Meal Plan</h3>
              <div className="meal-cards">
                {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                  <div className="meal-card" key={meal}>
                    <h4>{meal}</h4>
                    <ul>
                      {meal === "Breakfast" && (
                        <>
                          <li>Oats with fruits</li>
                          <li>1 boiled egg</li>
                          <li>Green tea</li>
                        </>
                      )}
                      {meal === "Lunch" && (
                        <>
                          <li>Grilled chicken or tofu</li>
                          <li>Brown rice</li>
                          <li>Mixed vegetables</li>
                        </>
                      )}
                      {meal === "Dinner" && (
                        <>
                          <li>Vegetable soup</li>
                          <li>Salad with chickpeas</li>
                          <li>Low-fat yogurt</li>
                        </>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="exercise-suggestions">
              <h3>🏋️ Exercise Recommendations ({activity.toUpperCase()})</h3>
              <ul>
                {activity === "light" && (
                  <>
                    <li>10-minute stretching</li>
                    <li>5-minute breathing exercise</li>
                    <li>Walk around your home</li>
                  </>
                )}
                {activity === "medium" && (
                  <>
                    <li>15-minute yoga</li>
                    <li>20 squats + 15 push-ups</li>
                    <li>10-minute brisk walk</li>
                  </>
                )}
                {activity === "heavy" && (
                  <>
                    <li>30-minute cardio (running/cycling)</li>
                    <li>40 push-ups + 40 squats</li>
                    <li>10-minute core workout</li>
                  </>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
