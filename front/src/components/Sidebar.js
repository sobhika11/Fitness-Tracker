import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userPicture = localStorage.getItem("userPicture");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="profile-section">
        <img src={userPicture} alt="Profile" className="avatar" />
        <p>{userName}</p>
      </div>
      <nav className="sidebar-nav">
        <Link to="/profile-details">👤 Profile</Link>
        <Link to="/streak">🔥 Streak</Link>
        <Link to="/meals">🍽️ Meals</Link>
        <Link to="/exercise">🏋️ Exercise</Link>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </nav>
    </div>
  );
};

export default Sidebar;
