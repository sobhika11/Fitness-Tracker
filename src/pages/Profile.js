import React, { useState } from "react";
import "../styles/Profile.css";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dob: "",
    height: "",
    weight: "",
    exerciseLevel: "",
    profession: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Profile Data:", formData);
    alert("Profile submitted successfully!");
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

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

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;
