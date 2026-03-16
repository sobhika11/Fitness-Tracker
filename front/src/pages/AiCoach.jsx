import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AiCoach = () => {
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

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: `Hi ${storedUser?.username || "there"} 👋 I’m your AI fitness coach. Ask me about diet, workouts, consistency, hydration, or daily fitness advice.`
    }
  ]);

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

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    const userId = storedUser?.id;
    if (!userId) {
      navigate("/ai-coach");
      return;
    }

    const newUserMessage = {
      role: "user",
      text: trimmedMessage
    };

    setChatMessages((prev) => [...prev, newUserMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message: trimmedMessage,
          userId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply || "No response received."
        }
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: error.message || "Something went wrong while contacting AI coach."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Suggest a simple Indian high-protein breakfast",
    "How can I improve my daily fitness consistency?",
    "Give me a beginner home workout plan",
    "How much water should I drink today?"
  ];

  const handleQuickPrompt = (prompt) => {
    setMessage(prompt);
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
          <div className="aicoach-header">
            <div>
              <p className="dashboard-greeting">AI Coach</p>
              <h1>Ask your fitness assistant anything</h1>
              <p className="dashboard-email">
                Get short, practical guidance on fitness, diet, workouts, and healthy habits.
              </p>
            </div>

            <div className="dashboard-date-box">
              <span>User</span>
              <strong>{storedUser?.username || "Guest"}</strong>
            </div>
          </div>

          <section className="aicoach-hero-card">
            <div className="aicoach-hero-glow"></div>
            <div className="aicoach-hero-content">
              <p className="dashboard-section-tag">Smart Guidance</p>
              <h2>Your personal coach for daily consistency</h2>
              <p>
                Ask about Indian diet ideas, hydration, muscle gain, fat loss,
                workouts, and building better fitness habits.
              </p>
            </div>
          </section>

          <section className="aicoach-layout">
            <div className="aicoach-chat-card">
              <div className="section-head">
                <h3>Conversation</h3>
                <span>Live chat</span>
              </div>

              <div className="aicoach-messages">
                {chatMessages.map((chat, index) => (
                  <div
                    key={index}
                    className={`aicoach-message ${
                      chat.role === "user"
                        ? "aicoach-user-message"
                        : "aicoach-assistant-message"
                    }`}
                  >
                    <div className="aicoach-message-bubble">{chat.text}</div>
                  </div>
                ))}

                {loading && (
                  <div className="aicoach-message aicoach-assistant-message">
                    <div className="aicoach-message-bubble">Thinking...</div>
                  </div>
                )}
              </div>

              <form className="aicoach-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  className="aicoach-input"
                  placeholder="Ask about workouts, meals, hydration..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="aicoach-send-btn"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send"}
                </button>
              </form>
            </div>

            <div className="aicoach-side-card">
              <div className="section-head">
                <h3>Quick Prompts</h3>
                <span>Try these</span>
              </div>

              <div className="aicoach-prompt-list">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="aicoach-prompt-btn"
                    onClick={() => handleQuickPrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="aicoach-tip-box">
                <h4>Coach Tip</h4>
                <p>
                  Ask specific questions like your goal, food preference, or workout level
                  to get more useful advice.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AiCoach;