import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const [formData, setFormData] = useState({
    name: "",
    email: userEmail || "",
    age: "",
    dob: "",
    height: "",
    weight: "",
    exerciseLevel: "",
    profession: "",
  });

  const [isUpdate, setIsUpdate] = useState(false); // whether we're updating existing profile

  // ✅ Check if profile already exists
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/profile?email=${userEmail}`
        );
        if (res.data) {
          setFormData(res.data);
          setIsUpdate(true); // existing profile
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };

    if (userEmail) fetchProfile();
  }, [userEmail]);

  // ✅ Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Submit handler (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdate) {
        await axios.put("http://localhost:5000/api/profile", formData);
        alert("Profile updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/profile", formData);
        alert("Profile created successfully!");
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Profile submit error:", err.message);
      alert("Failed to save profile");
    }
  };

  return (
    <div className="profile-container">
      <h2>{isUpdate ? "Update Your Profile" : "Complete Your Profile"}</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} disabled />

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

        <button type="submit">{isUpdate ? "Update" : "Submit"}</button>
      </form>
    </div>
  );
};

export default Profile;
