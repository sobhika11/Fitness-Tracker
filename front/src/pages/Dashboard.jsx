import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Dashboard = () => {
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

  const [dashboardData, setDashboardData] = useState({
    name: storedUser.username || "User",
    email: storedUser.email || "user@email.com",
    streakCount: 0,
    caloriesBurned: 0,
    today: {
      waterIntake: 0,
      caloriesConsumed: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
  });

  const [mealPreview, setMealPreview] = useState({
    breakfast: "Not selected yet",
    lunch: "Not selected yet",
    dinner: "Not selected yet"
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const quickLinks = [
    { title: "Meal Planner", path: "/meal-planner" },
    { title: "Water Tracker", path: "/water-tracker" },
    { title: "Streak", path: "/streak" },
    { title: "Profile", path: "/profile" },
    { title: "AI Coach", path: "/ai-coach" }
  ];

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

  const fetchWithFallback = async (urls) => {
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          method: "GET",
          headers: getAuthHeaders()
        });

        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.log("Fetch failed for:", url, err);
      }
    }
    throw new Error("Unable to fetch data from backend");
  };

  useEffect(() => {
    const userId = storedUser?.id;

    if (!userId) {
      navigate("/dashboard");
      return;
    }

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const profileData = await fetchWithFallback([
          `${API_BASE_URL}/api/profile/${userId}`,
          `${API_BASE_URL}/api/profile/userId`
        ]);

        setDashboardData({
          name: profileData.name || storedUser.username || "User",
          email: profileData.email || storedUser.email || "user@email.com",
          streakCount: profileData.streakCount || 0,
          caloriesBurned: profileData.caloriesBurned || 0,
          today: {
            waterIntake: profileData.today?.waterIntake || 0,
            caloriesConsumed: profileData.today?.caloriesConsumed || 0,
            protein: profileData.today?.protein || 0,
            carbs: profileData.today?.carbs || 0,
            fat: profileData.today?.fat || 0
          }
        });

        try {
          const mealsLog = await fetchWithFallback([
            `${API_BASE_URL}/api/meals/log/${userId}`,
            `${API_BASE_URL}/api/meals/log/userId`
          ]);

          setMealPreview({
            breakfast: mealsLog.meals?.breakfast || "Not selected yet",
            lunch: mealsLog.meals?.lunch || "Not selected yet",
            dinner: mealsLog.meals?.dinner || "Not selected yet"
          });
        } catch {
          setMealPreview({
            breakfast: "Not selected yet",
            lunch: "Not selected yet",
            dinner: "Not selected yet"
          });
        }
      } catch (err) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [API_BASE_URL, navigate, storedUser, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const proteinWidth = Math.min((dashboardData.today.protein / 120) * 100, 100);
  const carbsWidth = Math.min((dashboardData.today.carbs / 250) * 100, 100);
  const fatWidth = Math.min((dashboardData.today.fat / 80) * 100, 100);

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
          <header className="dashboard-topbar">
            <div>
              <p className="dashboard-greeting">Welcome back,</p>
              <h1>{dashboardData.name}</h1>
              <p className="dashboard-email">{dashboardData.email}</p>
            </div>

            <div className="dashboard-date-box">
              <span>Today</span>
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
          </header>

          {loading ? (
            <div className="dashboard-message-card">Loading dashboard...</div>
          ) : error ? (
            <div className="dashboard-message-card dashboard-error-card">
              {error}
            </div>
          ) : (
            <>
              <section className="dashboard-hero-card">
                <div className="dashboard-hero-left">
                  <p className="dashboard-section-tag">Daily Summary</p>
                  <h2>Your fitness progress at a glance</h2>
                  <p>
                    Track your nutrition, water intake, streak, and calories
                    burned all in one place.
                  </p>
                </div>

                <div className="dashboard-hero-right">
                  <div className="hero-mini-stat">
                    <span>Calories</span>
                    <strong>{dashboardData.today.caloriesConsumed} kcal</strong>
                  </div>
                  <div className="hero-mini-stat">
                    <span>Water</span>
                    <strong>{dashboardData.today.waterIntake} L</strong>
                  </div>
                </div>
              </section>

              <section className="dashboard-stats-grid">
                <div className="dashboard-stat-card">
                  <p>Calories Consumed</p>
                  <h3>{dashboardData.today.caloriesConsumed} kcal</h3>
                </div>

                <div className="dashboard-stat-card">
                  <p>Water Intake</p>
                  <h3>{dashboardData.today.waterIntake} L</h3>
                </div>

                <div className="dashboard-stat-card">
                  <p>Streak Count</p>
                  <h3>{dashboardData.streakCount} days</h3>
                </div>

                <div className="dashboard-stat-card">
                  <p>Calories Burned</p>
                  <h3>{dashboardData.caloriesBurned} kcal</h3>
                </div>
              </section>

              <section className="dashboard-lower-grid">
                <div className="dashboard-nutrition-card">
                  <div className="section-head">
                    <h3>Nutrition Breakdown</h3>
                    <span>Today</span>
                  </div>

                  <div className="nutrition-list">
                    <div className="nutrition-item">
                      <div className="nutrition-row">
                        <p>Protein</p>
                        <strong>{dashboardData.today.protein} g</strong>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill protein-fill"
                          style={{ width: `${proteinWidth}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="nutrition-item">
                      <div className="nutrition-row">
                        <p>Carbs</p>
                        <strong>{dashboardData.today.carbs} g</strong>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill carbs-fill"
                          style={{ width: `${carbsWidth}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="nutrition-item">
                      <div className="nutrition-row">
                        <p>Fat</p>
                        <strong>{dashboardData.today.fat} g</strong>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill fat-fill"
                          style={{ width: `${fatWidth}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-actions-card">
                  <div className="section-head">
                    <h3>Quick Actions</h3>
                    <span>Go to</span>
                  </div>

                  <div className="quick-links-grid">
                    {quickLinks.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="quick-link-card"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              <section className="dashboard-bottom-grid">
                <div className="dashboard-meals-card">
                  <div className="section-head">
                    <h3>Today’s Meals</h3>
                    <span>Preview</span>
                  </div>

                  <div className="meal-preview-item">
                    <p>Breakfast</p>
                    <strong>{mealPreview.breakfast}</strong>
                  </div>

                  <div className="meal-preview-item">
                    <p>Lunch</p>
                    <strong>{mealPreview.lunch}</strong>
                  </div>

                  <div className="meal-preview-item">
                    <p>Dinner</p>
                    <strong>{mealPreview.dinner}</strong>
                  </div>
                </div>

                <div className="dashboard-streak-card">
                  <div className="section-head">
                    <h3>Consistency Status</h3>
                    <span>Motivation</span>
                  </div>

                  <div className="streak-badge">
                    🔥 {dashboardData.streakCount} Day Streak
                  </div>
                  <p className="streak-text">
                    Keep logging your meals and water intake daily to maintain
                    your streak.
                  </p>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;