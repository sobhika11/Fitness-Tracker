import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: localStorage.getItem("userName") || "",
    email: localStorage.getItem("userEmail") || "",
    dateOfBirth: "",
    height: "",
    weight: "",
    physicalActivity: "",
    occupation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/profile", formData);
      localStorage.setItem("activityLevel", formData.physicalActivity);
      alert("Profile submitted successfully!");
      navigate("/profile-details");
    } catch (err) {
      console.error("Error submitting profile:", err.message);
      alert("Failed to submit profile");
    }
  };

  return (
    <div className="profile-container">
      <h2>👤 Complete Your Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled />

        <label>Date of Birth:</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />

        <label>Height (cm):</label>
        <input type="number" name="height" value={formData.height} onChange={handleChange} required />

        <label>Weight (kg):</label>
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />

        <label>Activity Level:</label>
        <select name="physicalActivity" value={formData.physicalActivity} onChange={handleChange} required>
          <option value="">-- Select --</option>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="heavy">Heavy</option>
        </select>

        <label>Occupation:</label>
        <select name="occupation" value={formData.occupation} onChange={handleChange} required>
          <option value="">-- Select --</option>
          <option value="student">Student</option>
          <option value="working">Working</option>
          <option value="other">Other</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Profile;
