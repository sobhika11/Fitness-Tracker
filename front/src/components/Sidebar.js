import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userPicture = localStorage.getItem("userPicture");

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored data (email, name, picture, etc.)
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="sidebar">
      <img src={userPicture} alt="Profile" className="sidebar-avatar" />
      <p className="sidebar-user">{userName}</p>
      <nav className="sidebar-nav">
        <Link to="/profile-details">👤 Profile</Link>
        <Link to="/streak">🔥 Streak</Link>
        <Link to="/meals">🍱 Meal Plan</Link>
        <Link to="/exercise">🏋️ Exercise</Link>
      </nav>
      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;
