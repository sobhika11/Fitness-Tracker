import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    navigate("/login");
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
                <input type="text" placeholder="Enter your full name" required />
              </div>

              <div className="input-group">
                <span className="input-icon">✉</span>
                <input type="email" placeholder="Enter your email here" required />
              </div>

              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create your password"
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

              <button type="submit" className="login-submit-btn">
                Sign Up
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