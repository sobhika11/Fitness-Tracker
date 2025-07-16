const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Handle form data POST
router.post("/", async (req, res) => {
  console.log("🔥 Received data:", req.body); 
  try {
    const { name, email, age, weight, height, activityLevel ,profession} = req.body;

    const user = new User({ name, email, age, weight, height, activityLevel ,profession});
    await user.save();

    res.status(201).send("✅ Form data saved successfully!");
  } catch (err) {
    console.error("❌ Error saving user:", err.message);
    res.status(500).send("Failed to save user");
  }
});

module.exports = router;
