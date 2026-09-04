import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const WaterTracker = () => {
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

  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(3000); // ml
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navLinks = [
    { title: "Dashboard", path: "/dashboard" },
    { title: "Meal Planner", path: "/meal-planner" },
    { title: "Water Tracker", path: "/water-tracker" },
    { title: "Streak", path: "/streak" },
    { title: "Profile", path: "/profile" },
    { title: "AI Coach", path: "/ai-coach" },
    { title: "Exercise", path: "/exercise" },
  ];

  const quickAddOptions = [250, 500, 750, 1000];

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const fetchWaterIntake = async () => {
    const userId = storedUser?.id;
    if (!userId) {
      navigate("/water-tracker");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/log/water/${userId}`, {
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch water intake");
      }

      setWaterIntake(Number(data.waterIntake) || 0);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterIntake();
  }, []);

  const handleAddWater = async (amount) => {
    const userId = storedUser?.id;
    if (!userId) {
      navigate("/water-tracker");
      return;
    }

    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/log/water`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId,
          amount
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update water intake");
      }

      setWaterIntake(Number(data.waterIntake) || 0);
      setSuccess(`${amount} ml added successfully`);
    } catch (err) {
      setError(err.message || "Failed to update water intake");
    } finally {
      setUpdating(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();

    const amount = Number(customAmount);
    if (!amount || amount <= 0) {
      setError("Enter a valid amount in ml");
      setSuccess("");
      return;
    }

    handleAddWater(amount);
    setCustomAmount("");
  };

  const progressPercent = Math.min((waterIntake / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - waterIntake, 0);

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
          <div className="watertracker-header">
            <div>
              <p className="dashboard-greeting">Water Tracker</p>
              <h1>Hydrate and stay balanced</h1>
              <p className="dashboard-email">
                Track your daily water intake and reach your hydration goal.
              </p>
            </div>

            <div className="dashboard-date-box">
              <span>Today</span>
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
          </div>

          {(error || success) && (
            <div
              className={`watertracker-alert ${
                error ? "watertracker-error" : "watertracker-success"
              }`}
            >
              {error || success}
            </div>
          )}

          {loading ? (
            <div className="dashboard-message-card">Loading water intake...</div>
          ) : (
            <>
              <section className="watertracker-top-grid">
                <div className="water-hero-card">
                  <div className="water-hero-left">
                    <p className="dashboard-section-tag">Today’s Hydration</p>
                    <h2>{waterIntake} ml</h2>
                    <p>
                      Keep your body refreshed and maintain your hydration streak
                      every day.
                    </p>

                    <div className="water-goal-meta">
                      <div className="water-goal-pill">
                        <span>Goal</span>
                        <strong>{dailyGoal} ml</strong>
                      </div>
                      <div className="water-goal-pill">
                        <span>Remaining</span>
                        <strong>{remaining} ml</strong>
                      </div>
                    </div>
                  </div>

                  <div className="water-hero-right">
                    <div className="water-circle-wrap">
                      <div className="water-circle">
                        <span>{Math.round(progressPercent)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="water-goal-card">
                  <div className="section-head">
                    <h3>Daily Goal Indicator</h3>
                    <span>Progress</span>
                  </div>

                  <div className="water-progress-block">
                    <div className="water-progress-labels">
                      <p>Hydration Progress</p>
                      <strong>
                        {waterIntake} / {dailyGoal} ml
                      </strong>
                    </div>

                    <div className="water-progress-bar">
                      <div
                        className="water-progress-fill"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="water-goal-info">
                    <div className="water-goal-info-card">
                      <span>Status</span>
                      <strong>
                        {waterIntake >= dailyGoal ? "Goal Reached" : "In Progress"}
                      </strong>
                    </div>
                    <div className="water-goal-info-card">
                      <span>Target</span>
                      <strong>{dailyGoal / 1000} L</strong>
                    </div>
                  </div>
                </div>
              </section>

              <section className="watertracker-bottom-grid">
                <div className="water-quick-card">
                  <div className="section-head">
                    <h3>Quick Add Water</h3>
                    <span>Tap to add</span>
                  </div>

                  <div className="water-quick-grid">
                    {quickAddOptions.map((amount) => (
                      <button
                        key={amount}
                        className="water-quick-btn"
                        onClick={() => handleAddWater(amount)}
                        disabled={updating}
                      >
                        +{amount} ml
                      </button>
                    ))}
                  </div>
                </div>

                <div className="water-custom-card">
                  <div className="section-head">
                    <h3>Custom Amount</h3>
                    <span>Manual entry</span>
                  </div>

                  <form className="water-custom-form" onSubmit={handleCustomSubmit}>
                    <input
                      type="number"
                      className="water-custom-input"
                      placeholder="Enter amount in ml"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                    />

                    <button
                      type="submit"
                      className="water-custom-btn"
                      disabled={updating}
                    >
                      {updating ? "Updating..." : "Add Water"}
                    </button>
                  </form>
                </div>
              </section>

              <section className="watertracker-tip-card">
                <div className="section-head">
                  <h3>Hydration Tip</h3>
                  <span>Wellness</span>
                </div>

                <p className="water-tip-text">
                  Spread your intake through the day instead of drinking everything
                  at once. Small, consistent sips help you stay energized and support
                  better digestion.
                </p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default WaterTracker;