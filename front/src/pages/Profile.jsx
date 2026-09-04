import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
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

  const [profileData, setProfileData] = useState({
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navLinks = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Meal Planner", path: "/meal-planner" },
    { title: "Water Tracker", path: "/water-tracker" },
    { title: "Streak", path: "/streak" },
    { title: "Profile", path: "/profile" },
    { title: "AI Coach", path: "/ai-coach" },
    { title: "Exercise", path: "/exercise" },
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
    throw new Error("Failed to fetch profile");
  };

  useEffect(() => {
    const userId = storedUser?.id;

    if (!userId) {
      navigate("/profile");
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await fetchWithFallback([
          `${API_BASE_URL}/api/profile/${userId}`,
          `${API_BASE_URL}/api/profile/userId`
        ]);

        setProfileData({
          name: data.name || storedUser.username || "User",
          email: data.email || storedUser.email || "user@email.com",
          streakCount: data.streakCount || 0,
          caloriesBurned: data.caloriesBurned || 0,
          today: {
            waterIntake: data.today?.waterIntake || 0,
            caloriesConsumed: data.today?.caloriesConsumed || 0,
            protein: data.today?.protein || 0,
            carbs: data.today?.carbs || 0,
            fat: data.today?.fat || 0
          }
        });
      } catch (err) {
        setError(err.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [API_BASE_URL, navigate, storedUser]);

  const totalMacro =
    profileData.today.protein +
    profileData.today.carbs +
    profileData.today.fat;

  const proteinPercent =
    totalMacro > 0 ? (profileData.today.protein / totalMacro) * 100 : 0;
  const carbsPercent =
    totalMacro > 0 ? (profileData.today.carbs / totalMacro) * 100 : 0;
  const fatPercent =
    totalMacro > 0 ? (profileData.today.fat / totalMacro) * 100 : 0;

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
          <div className="profile-header">
            <div>
              <p className="dashboard-greeting">Profile Overview</p>
              <h1>Your health snapshot</h1>
              <p className="dashboard-email">
                View your account details, current streak, and today’s nutrition.
              </p>
            </div>

            <div className="dashboard-date-box">
              <span>Today</span>
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-message-card">Loading profile...</div>
          ) : error ? (
            <div className="dashboard-message-card dashboard-error-card">
              {error}
            </div>
          ) : (
            <>
              <section className="profile-top-grid">
                <div className="profile-hero-card">
                  <div className="profile-avatar-wrap">
                    <div className="profile-avatar-circle">
                      {profileData.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  </div>

                  <div className="profile-hero-content">
                    <h2>{profileData.name}</h2>
                    <p>{profileData.email}</p>

                    <div className="profile-highlight-row">
                      <div className="profile-highlight-pill">
                        <span>Current Streak</span>
                        <strong>{profileData.streakCount} days</strong>
                      </div>

                      <div className="profile-highlight-pill">
                        <span>Calories Burned</span>
                        <strong>{profileData.caloriesBurned} kcal</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="profile-summary-card">
                  <div className="section-head">
                    <h3>Today Summary</h3>
                    <span>Live stats</span>
                  </div>

                  <div className="profile-summary-row">
                    <p>Water Intake</p>
                    <strong>{profileData.today.waterIntake} L</strong>
                  </div>

                  <div className="profile-summary-row">
                    <p>Calories Consumed</p>
                    <strong>{profileData.today.caloriesConsumed} kcal</strong>
                  </div>

                  <div className="profile-summary-row">
                    <p>Protein</p>
                    <strong>{profileData.today.protein} g</strong>
                  </div>

                  <div className="profile-summary-row">
                    <p>Carbs</p>
                    <strong>{profileData.today.carbs} g</strong>
                  </div>

                  <div className="profile-summary-row">
                    <p>Fat</p>
                    <strong>{profileData.today.fat} g</strong>
                  </div>
                </div>
              </section>

              <section className="profile-bottom-grid">
                <div className="profile-macros-card">
                  <div className="section-head">
                    <h3>Macro Breakdown</h3>
                    <span>Today</span>
                  </div>

                  <div className="profile-macro-item">
                    <div className="profile-macro-row">
                      <p>Protein</p>
                      <strong>{profileData.today.protein} g</strong>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill protein-fill"
                        style={{ width: `${proteinPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="profile-macro-item">
                    <div className="profile-macro-row">
                      <p>Carbs</p>
                      <strong>{profileData.today.carbs} g</strong>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill carbs-fill"
                        style={{ width: `${carbsPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="profile-macro-item">
                    <div className="profile-macro-row">
                      <p>Fat</p>
                      <strong>{profileData.today.fat} g</strong>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill fat-fill"
                        style={{ width: `${fatPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="profile-achievement-card">
                  <div className="section-head">
                    <h3>Performance Snapshot</h3>
                    <span>Status</span>
                  </div>

                  <div className="profile-achievement-grid">
                    <div className="profile-achievement-box">
                      <span>Hydration</span>
                      <strong>
                        {profileData.today.waterIntake >= 2 ? "Good" : "Improve"}
                      </strong>
                    </div>

                    <div className="profile-achievement-box">
                      <span>Consistency</span>
                      <strong>
                        {profileData.streakCount >= 5 ? "Strong" : "Building"}
                      </strong>
                    </div>

                    <div className="profile-achievement-box">
                      <span>Nutrition</span>
                      <strong>
                        {profileData.today.caloriesConsumed > 0 ? "Tracked" : "Empty"}
                      </strong>
                    </div>

                    <div className="profile-achievement-box">
                      <span>Burn Rate</span>
                      <strong>{profileData.caloriesBurned} kcal</strong>
                    </div>
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

export default Profile;