import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-logo">FitTrack</h2>
      </div>
      <div className="navbar-right">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/">Logout</Link>
      </div>
    </nav>
  );
};

export default Navbar;
