import React from "react";
import { FaInstagram, FaFacebookF, FaLeaf } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero-section">
        <header className="navbar">
          <div className="logo">FITORA</div>

          <nav className="nav-links">
            <a href="#components">Core Features</a>
            <a href="#care">Fitness Care</a>
          </nav>
        </header>

        <div className="hero-content">
          <div className="hero-bg-text">FITORA</div>

          <div className="hero-left">
            <p className="hero-tag">100% Personalized Fitness Journey</p>
            <h1>
              Build strength, track progress,
              <br />
              and stay consistent.
            </h1>
            <p className="hero-description">
              A smart fitness tracker that helps you manage workouts, monitor
              progress, and stay motivated with routines designed for your goal.
            </p>

            <button className="primary-btn">
              Get Started <FiArrowRight />
            </button>
          </div>

          <div className="hero-center">
            <div className="product-glow"></div>
            <img
              src="/fitness-product.png"
              alt="Fitness product"
              className="hero-product"
            />

            <span className="floating-leaf leaf-1">
              <FaLeaf />
            </span>
            <span className="floating-leaf leaf-2">
              <FaLeaf />
            </span>
            <span className="floating-leaf leaf-3">
              <FaLeaf />
            </span>
          </div>

          <div className="hero-socials">
            <a href="/"><FaInstagram /></a>
            <a href="/"><FaFacebookF /></a>
            <a href="/"><FaLeaf /></a>
          </div>
        </div>
      </section>

      <section className="features-section" id="components">
        <h2 className="section-title">Core Components</h2>

        <div className="features-grid">
          <div className="features-left">
          <div className="feature-card">
            <div className="feature-icon">01</div>
            <div>
              <h3>Workout Tracking</h3>
              <p>
                Log your exercises, sets, reps, and calories burned with a clean
                and simple experience.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">02</div>
            <div>
              <h3>Diet Suggestions</h3>
              <p>
                Get smart meal guidance and daily nutrition support based on
                your fitness goals.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">03</div>
            <div>
              <h3>Progress Insights</h3>
              <p>
                Monitor streaks, daily consistency, and body transformation
                trends in one dashboard.
              </p>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">04</div>
            <div>
              <h3>Personal Profile</h3>
              <p>
                Save your preferences, goals, and health data to get a more
                customized experience.
              </p>
            </div>
          </div>
          </div>

          <div className="feature-image-box">
            <img
              src="/fitness-bottle.png"
              alt="Fitness visual"
              className="feature-product"
            />
          </div>
          
        </div>
      </section>

      <section className="routine-section" id="care">
        <div className="routine-image-side">
          <img
            src="/fitness-model.png"
            alt="Fitness lifestyle"
            className="routine-main-image"
          />
        </div>

        <div className="routine-content-side">
          <h2 className="routine-title">Your Daily Routine</h2>

          <div className="routine-step">
            <span>1.</span>
            <div>
              <h3>Track Workouts</h3>
              <p>
                Record your daily activities and organize your exercise sessions
                with ease.
              </p>
            </div>
          </div>

          <div className="routine-step">
            <span>2.</span>
            <div>
              <h3>Follow Smart Plans</h3>
              <p>
                Stay on track with guided meal and fitness suggestions tailored
                to you.
              </p>
            </div>
          </div>

          <div className="routine-step">
            <span>3.</span>
            <div>
              <h3>Stay Consistent</h3>
              <p>
                Maintain your streak, review progress, and keep improving every
                single day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;