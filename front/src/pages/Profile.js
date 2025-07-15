import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")); // 👈 from Google Sign-In

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    dob: "",
    height: "",
    weight: "",
    exerciseLevel: "",
    profession: "",
  });

  // 🔐 Redirect if not logged in
  useEffect(() => {
    if (!user?.email) {
      navigate("/");
    } else {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/profile", formData);

      localStorage.setItem("userEmail", formData.email);

      alert("Profile submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error submitting profile:", err.message);
      alert("Failed to submit profile");
    }
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} readOnly />

        <label>Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} required />

        <label>Date of Birth:</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

        <label>Height (cm):</label>
        <input type="number" name="height" value={formData.height} onChange={handleChange} required />

        <label>Weight (kg):</label>
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />

        <label>Exercise Level:</label>
        <select name="exerciseLevel" value={formData.exerciseLevel} onChange={handleChange} required>
          <option value="">-- Select --</option>
          <option value="light">Light</option>
          <option value="medium">Medium</option>
          <option value="heavy">Heavy</option>
        </select>

        <label>Profession:</label>
        <select name="profession" value={formData.profession} onChange={handleChange} required>
          <option value="">-- Select --</option>
          <option value="student">Student</option>
          <option value="working">Working Professional</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Profile;
