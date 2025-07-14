const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const router = express.Router();
const User = require("../models/user");

// ✅ Create OAuth2 client using your real Google Client ID
const client = new OAuth2Client("638475211495-7klcgcis21gon45ismio5meg9094e1s9.apps.googleusercontent.com");

// ✅ Route to handle Google Login
router.post("/google-login", async (req, res) => {
  const { token } = req.body;

  // Debug: Log the received token
  console.log("Received token:", token);

  if (!token) {
    console.error("No token provided in request body");
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    // Step 1: Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "638475211495-7klcgcis21gon45ismio5meg9094e1s9.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    // Step 2: Check if user already exists
    let user = await User.findOne({ email });

    // Step 3: If not, create new user
    if (!user) {
      user = new User({ name, email, picture });
      await user.save();
    }

    // Step 4: Send back success message
    res.status(200).json({ message: "Login success", user });
  } catch (err) {
    // Debug: Log the error details
    console.error("Google login error:", err);
    res.status(400).json({ message: "Login failed", error: err.message, details: err });
  }
});

// ✅ Test route to confirm route is working
router.get("/test", (req, res) => {
  res.send("✅ Auth Route Working!");
});

module.exports = router;
