import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ProfileDetails.css"; // Create this file for styling if needed

const ProfileDetails = () => {
  const [profile, setProfile] = useState(null);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile?email=${userEmail}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to fetch profile:", err.message);
      }
    };

    if (userEmail) fetchProfile();
  }, [userEmail]);

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-details-container">
      <h2>👤 Your Profile</h2>
      <div className="profile-card">
        <p><strong>📧 Email:</strong> {profile.email}</p>
        <p><strong>👤 Name:</strong> {profile.name}</p>
        <p><strong>🎂 Age:</strong> {profile.age}</p>
        <p><strong>📅 DOB:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}</p>
        <p><strong>📏 Height:</strong> {profile.height} cm</p>
        <p><strong>⚖️ Weight:</strong> {profile.weight} kg</p>
        <p><strong>🏋️ Activity Level:</strong> {profile.physicalActivity}</p>
        <p><strong>💼 Occupation:</strong> {profile.occupation}</p>
      </div>
    </div>
  );
};

export default ProfileDetails;
