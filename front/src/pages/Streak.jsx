import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Streak = () => {
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

  const [streakData, setStreakData] = useState({
    streakCount: 0,
    streakCompleted: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navLinks = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Meal Planner", path: "/meal-planner" },
    { title: "Water Tracker", path: "/water-tracker" },
    { title: "Streak", path: "/streak" },
    { title: "Profile", path: "/profile" },
    { title: "AI Coach", path: "/ai-coach" }
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

  const fetchWithFallback = async (urls) => {
    for (const url of urls) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: getAuthHeaders()
        });

        if (response.ok) {
          return await response.json();
        }
      } catch {
        // ignore and try next
      }
    }
    throw new Error("Failed to fetch streak data");
  };

  useEffect(() => {
    const userId = storedUser?.id;

    if (!userId) {
      navigate("/streak");
      return;
    }

    const loadStreak = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchWithFallback([
          `${API_BASE_URL}/api/streak/${userId}`,
          `${API_BASE_URL}/api/streak/userId`
        ]);

        setStreakData({
          streakCount: data.streakCount || 0,
          streakCompleted: Boolean(data.streakCompleted)
        });
      } catch (err) {
        setError(err.message || "Unable to load streak");
      } finally {
        setLoading(false);
      }
    };

    loadStreak();
  }, [API_BASE_URL, navigate, storedUser]);

  const getMotivationMessage = () => {
    if (streakData.streakCount === 0) {
      return "Start today by logging meals or water and build your streak from zero.";
    }
    if (streakData.streakCount < 3) {
      return "You’ve started strong. Keep showing up daily and your streak will grow.";
    }
    if (streakData.streakCount < 7) {
      return "Nice momentum. You’re building a healthy habit day by day.";
    }
    return "Amazing consistency. Your streak is becoming a lifestyle now.";
  };

  const weekDays = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

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
          <div className="streak-header">
            <div>
              <p className="dashboard-greeting">Streak Tracker</p>
              <h1>Stay consistent every day</h1>
              <p className="dashboard-email">
                Keep your meals and hydration updated to protect your streak.
              </p>
            </div>

            <div className="dashboard-date-box">
              <span>Today</span>
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-message-card">Loading streak...</div>
          ) : error ? (
            <div className="dashboard-message-card dashboard-error-card">
              {error}
            </div>
          ) : (
            <>
              <section className="streak-hero-card">
                <div className="streak-flame-wrap">
                  <div className="streak-flame-circle">🔥</div>
                </div>

                <div className="streak-hero-content">
                  <h2>{streakData.streakCount} Day Streak</h2>
                  <p>
                    {streakData.streakCompleted
                      ? "Today’s streak is completed."
                      : "Today’s streak is not completed yet."}
                  </p>
                </div>
              </section>

              <section className="streak-week-card">
                <div className="section-head">
                  <h3>Weekly Consistency</h3>
                  <span>Visual progress</span>
                </div>

                <div className="streak-days-row">
                  {weekDays.map((day, index) => {
                    const filled = index < Math.min(streakData.streakCount, 7);
                    const isTodayDone =
                      day === weekDays[0] && streakData.streakCompleted;

                    return (
                      <div key={day} className="streak-day-item">
                        <div
                          className={`streak-day-circle ${
                            filled ? "streak-day-filled" : ""
                          } ${isTodayDone ? "streak-day-today" : ""}`}
                        >
                          {isTodayDone ? "✓" : ""}
                        </div>
                        <span>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="streak-bottom-grid">
                <div className="streak-status-card">
                  <div className="section-head">
                    <h3>Status</h3>
                    <span>Today</span>
                  </div>

                  <div className="streak-status-row">
                    <p>Current Streak</p>
                    <strong>{streakData.streakCount} days</strong>
                  </div>

                  <div className="streak-status-row">
                    <p>Today Completed</p>
                    <strong>
                      {streakData.streakCompleted ? "Yes" : "No"}
                    </strong>
                  </div>

                  <div className="streak-status-row">
                    <p>Consistency Level</p>
                    <strong>
                      {streakData.streakCount >= 7
                        ? "Strong"
                        : streakData.streakCount >= 3
                        ? "Growing"
                        : "Starting"}
                    </strong>
                  </div>
                </div>

                <div className="streak-motivation-card">
                  <div className="section-head">
                    <h3>Motivation</h3>
                    <span>Keep going</span>
                  </div>

                  <p className="streak-big-message">
                    {streakData.streakCount > 0
                      ? "You’ve started a streak!"
                      : "Your streak starts today!"}
                  </p>

                  <p className="streak-text">{getMotivationMessage()}</p>

                  <div className="streak-badge-large">
                    {streakData.streakCompleted
                      ? "🔥 Keep the fire alive"
                      : "💧 Log water or meals today"}
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Streak;