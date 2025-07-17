import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileDetails.css";

const ProfileDetails = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/profile?email=${email}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("❌ Failed to load profile:", err);
      }
    };

    fetchProfile();
  }, [email]);

  if (!profile) return <p className="loading-text">Loading profile...</p>;

  return (
    <div className="profile-details-page">
      <h2>Your Profile</h2>
      <div className="profile-card">
        <p><strong>👤 Name:</strong> {profile.name}</p>
        <p><strong>📧 Email:</strong> {profile.email}</p>
        <p><strong>🎂 DOB:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>📏 Height:</strong> {profile.height} cm</p>
        <p><strong>⚖️ Weight:</strong> {profile.weight} kg</p>
        <p><strong>🏃 Activity:</strong> {profile.physicalActivity}</p>
        <p><strong>💼 Occupation:</strong> {profile.occupation}</p>
      </div>
      <button className="edit-btn" onClick={() => navigate("/profile")}>Edit Profile</button>
    </div>
  );
};

export default ProfileDetails;
