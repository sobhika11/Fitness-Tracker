import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess(data.message || "Account created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-page">
      <header className="login-topbar">
        <div className="login-brand">FITORA</div>

        <div className="login-top-actions">
          <Link to="/" className="login-top-link">
            Home
          </Link>
          <Link to="/login" className="login-demo-btn">
            Login
          </Link>
        </div>
      </header>

      <div className="login-layout">
        <div className="login-side left-decor">
          <div className="decor-shape square-shape"></div>
          <div className="decor-circle"></div>
          <div className="decor-line"></div>
        </div>

        <div className="login-card-wrapper">
          <div className="login-card">
            <h2>Create Account</h2>
            <p className="login-subtitle">
              Enter your details to create your fitness account
            </p>

            <form className="login-form" onSubmit={handleSignup}>
              <div className="input-group">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email here"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              {error && <p className="auth-error">{error}</p>}
              {success && <p className="auth-success">{success}</p>}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <p className="login-footer-text">
              Already have an account?{" "}
              <Link to="/login" className="login-inline-link">
                Login
              </Link>
            </p>
          </div>
        </div>

        <div className="login-side right-illustration">
          <div className="illustration-block illustration-tall"></div>
          <div className="illustration-block illustration-small"></div>
          <div className="login-person">
            <div className="person-head"></div>
            <div className="person-body"></div>
            <div className="person-leg leg-left"></div>
            <div className="person-leg leg-right"></div>
            <div className="person-laptop"></div>
          </div>
        </div>
      </div>

      <footer className="login-footer">
        <p>Copyright @FITORA 2026</p>
        <div className="footer-links">
          <a href="/">Privacy Policy</a>
          <a href="/">Terms & Conditions</a>
        </div>
      </footer>
    </section>
  );
};

export default Signup;