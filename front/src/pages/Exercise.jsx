import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Exercise = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const token = localStorage.getItem("token");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [activeSection, setActiveSection] = useState("overview");
  const [aerobicExercises, setAerobicExercises] = useState([]);
  const [loadingAerobic, setLoadingAerobic] = useState(false);
  const [cyclingForm, setCyclingForm] = useState({
    duration: "",
    distance: "",
    spotifyUrl: ""
  });
  const [cyclingResult, setCyclingResult] = useState(null);
  const [savingCycling, setSavingCycling] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navLinks = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Meal Planner", path: "/meal-planner" },
    { title: "Water Tracker", path: "/water-tracker" },
    { title: "Streak", path: "/streak" },
    { title: "Profile", path: "/profile" },
    { title: "AI Coach", path: "/ai-coach" },
    { title: "Exercise", path: "/exercise" }
  ];

  const yogaCards = [
    {
      title: "Surya Namaskar",
      subtitle: "Full body warmup flow"
    },
    {
      title: "Bhujangasana",
      subtitle: "Back opening stretch"
    },
    {
      title: "Vrikshasana",
      subtitle: "Balance and posture"
    },
    {
      title: "Balasana",
      subtitle: "Relaxation and recovery"
    }
  ];

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const loadAerobicExercises = async () => {
    setLoadingAerobic(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/exercise/aerobic`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load aerobic exercises");
      }

      setAerobicExercises(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load aerobic exercises");
    } finally {
      setLoadingAerobic(false);
    }
  };

  useEffect(() => {
    if (activeSection === "aerobic") {
      loadAerobicExercises();
    }
  }, [activeSection]);

  const handleCyclingChange = (e) => {
    const { name, value } = e.target;
    setCyclingForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCyclingSubmit = async (e) => {
    e.preventDefault();

    const userId = storedUser?.id;
    if (!userId) {
      navigate("/exercise");
      return;
    }

    setSavingCycling(true);
    setError("");
    setSuccess("");
    setCyclingResult(null);

    try {
      const payload = {
        userId,
        spotifyUrl: cyclingForm.spotifyUrl || undefined
      };

      if (cyclingForm.duration) payload.duration = Number(cyclingForm.duration);
      if (cyclingForm.distance) payload.distance = Number(cyclingForm.distance);

      const response = await fetch(`${API_BASE_URL}/api/exercise/cycling`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save cycling workout");
      }

      setCyclingResult(data);
      setSuccess(data.message || "Cycling workout recorded");
      setCyclingForm({
        duration: "",
        distance: "",
        spotifyUrl: ""
      });
    } catch (err) {
      setError(err.message || "Failed to save cycling workout");
    } finally {
      setSavingCycling(false);
    }
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-content-wrap">
        <header className="app-topbar">
          <div className="app-brand">FITORA</div>

          <nav className="app-topnav">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`app-topnav-link ${
                  location.pathname === item.path ? "app-topnav-active" : ""
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <button className="app-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="dashboard-main">
          <div className="exercise-header">
            <div>
              <p className="dashboard-greeting">Exercise Module</p>
              <h1>Move your body, build your habit</h1>
              <p className="dashboard-email">
                Explore aerobics, yoga, and cardio workouts in one elegant space.
              </p>
            </div>

            <div className="dashboard-date-box">
              <span>Today</span>
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
          </div>

          {(error || success) && (
            <div
              className={`exercise-alert ${
                error ? "exercise-error" : "exercise-success"
              }`}
            >
              {error || success}
            </div>
          )}

          <section className="exercise-overview-grid">
            <button
              className={`exercise-type-card ${
                activeSection === "aerobic" ? "exercise-type-card-active" : ""
              }`}
              onClick={() => setActiveSection("aerobic")}
            >
              <div className="exercise-card-image"></div>
              <h3>Aerobics</h3>
              <p>Backend-powered aerobic exercise list</p>
            </button>

            <button
              className={`exercise-type-card ${
                activeSection === "yoga" ? "exercise-type-card-active" : ""
              }`}
              onClick={() => setActiveSection("yoga")}
            >
              <div className="exercise-card-image"></div>
              <h3>Flexibility & Yoga</h3>
              <p>Static yoga suggestions with image placeholders</p>
            </button>

            <button
              className={`exercise-type-card ${
                activeSection === "cardio" ? "exercise-type-card-active" : ""
              }`}
              onClick={() => setActiveSection("cardio")}
            >
              <div className="exercise-card-image"></div>
              <h3>Cardio</h3>
              <p>Track cycling workout and calories burned</p>
            </button>
          </section>

          {activeSection === "overview" && (
            <section className="exercise-section-card">
              <div className="section-head">
                <h3>Choose a category</h3>
                <span>Exercise types</span>
              </div>
              <p className="exercise-section-text">
                Pick Aerobics, Flexibility & Yoga, or Cardio to explore workouts
                and track your activity.
              </p>
            </section>
          )}

          {activeSection === "aerobic" && (
            <section className="exercise-section-card">
              <div className="section-head">
                <h3>Aerobic Exercises</h3>
                <span>From backend</span>
              </div>

              {loadingAerobic ? (
                <div className="dashboard-message-card">Loading aerobics...</div>
              ) : aerobicExercises.length === 0 ? (
                <div className="dashboard-message-card">
                  No aerobic exercises available.
                </div>
              ) : (
                <div className="exercise-cards-grid">
                  {aerobicExercises.map((exercise, index) => (
                    <div
                      key={`${exercise.name}-${index}`}
                      className="exercise-item-card"
                    >
                      <div className="exercise-item-image"></div>
                      <div className="exercise-item-content">
                        <h4>{exercise.name}</h4>
                        <p>{exercise.description || "Aerobic routine"}</p>

                        <div className="exercise-item-tags">
                          <span>{exercise.duration} min</span>
                          <span>{exercise.intensity}</span>
                        </div>

                        {exercise.videoUrl && (
                          <a
                            href={exercise.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="exercise-action-link"
                          >
                            Watch Video
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === "yoga" && (
            <section className="exercise-section-card">
              <div className="section-head">
                <h3>Flexibility & Yoga</h3>
                <span>Suggested flow</span>
              </div>

              <div className="exercise-cards-grid">
                {yogaCards.map((yoga, index) => (
                  <div key={index} className="exercise-item-card">
                    <div className="exercise-item-image"></div>
                    <div className="exercise-item-content">
                      <h4>{yoga.title}</h4>
                      <p>{yoga.subtitle}</p>
                      <div className="exercise-item-tags">
                        <span>Yoga</span>
                        <span>Beginner Friendly</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeSection === "cardio" && (
            <section className="exercise-cardio-grid">
              <div className="exercise-section-card">
                <div className="section-head">
                  <h3>Track Cycling Workout</h3>
                  <span>Backend connected</span>
                </div>

                <form className="exercise-form" onSubmit={handleCyclingSubmit}>
                  <input
                    className="exercise-input"
                    type="number"
                    name="duration"
                    placeholder="Duration in minutes"
                    value={cyclingForm.duration}
                    onChange={handleCyclingChange}
                  />

                  <input
                    className="exercise-input"
                    type="number"
                    name="distance"
                    placeholder="Distance in km"
                    value={cyclingForm.distance}
                    onChange={handleCyclingChange}
                  />

                  <input
                    className="exercise-input"
                    type="text"
                    name="spotifyUrl"
                    placeholder="Spotify playlist URL (optional)"
                    value={cyclingForm.spotifyUrl}
                    onChange={handleCyclingChange}
                  />

                  <button
                    type="submit"
                    className="exercise-primary-btn"
                    disabled={savingCycling}
                  >
                    {savingCycling ? "Saving..." : "Save Cycling Workout"}
                  </button>
                </form>
              </div>

              <div className="exercise-section-card">
                <div className="section-head">
                  <h3>Workout Result</h3>
                  <span>Today</span>
                </div>

                {cyclingResult ? (
                  <div className="exercise-result-box">
                    <div className="exercise-result-row">
                      <p>Calories Burned</p>
                      <strong>{cyclingResult.caloriesBurned} kcal</strong>
                    </div>
                    <div className="exercise-result-row">
                      <p>Duration</p>
                      <strong>
                        {cyclingResult.cycling?.duration ?? "-"} min
                      </strong>
                    </div>
                    <div className="exercise-result-row">
                      <p>Distance</p>
                      <strong>
                        {cyclingResult.cycling?.distance ?? "-"} km
                      </strong>
                    </div>
                    <div className="exercise-result-row">
                      <p>Spotify</p>
                      <strong>
                        {cyclingResult.cycling?.spotifyUrl ? "Added" : "Not added"}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <div className="dashboard-message-card">
                    Save a cycling workout to see the result here.
                  </div>
                )}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Exercise;