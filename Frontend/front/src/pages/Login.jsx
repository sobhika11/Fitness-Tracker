import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
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
          <Link to="/signup" className="login-demo-btn">
            Sign up
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
            <h2>Login</h2>
            <p className="login-subtitle">
              Hey, enter your details to sign in to your account
            </p>

            <form className="login-form" onSubmit={handleLogin}>
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
                  placeholder="Enter your password here"
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

              <p className="trouble-text">Having trouble signing in?</p>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="login-divider-text">Single Sign On</div>

            <div className="social-login-divider">
              <span></span>
              <p>Or Sign in with</p>
              <span></span>
            </div>

            <div className="social-login-row">
              <button type="button" className="social-btn">f</button>
              <button type="button" className="social-btn">G</button>
              <button type="button" className="social-btn">in</button>
              <button type="button" className="social-btn">X</button>
              <button type="button" className="social-btn"></button>
            </div>

            <p className="login-footer-text">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="login-inline-link">
                Sign up
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

export default Login;