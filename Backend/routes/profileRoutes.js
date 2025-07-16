const express = require("express");
const router = express.Router();
const Profile = require("../models/user"); 
router.post("/", async (req, res) => {
  try {
    console.log("🔹 Incoming Data:", req.body);
    const newProfile = new Profile(req.body);
    await newProfile.save();
    res.status(201).json({ message: "User profile saved!" });
  } catch (err) {
    console.error("❌ Error saving profile:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
