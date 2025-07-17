import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    const handleCredentialResponse = async (response) => {
      try {
        const decoded = jwtDecode(response.credential);
        const { email, name, picture } = decoded;

        // Save to localStorage
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", name);
        localStorage.setItem("userPicture", picture);

        // 🔍 Check if user exists in DB
        const res = await fetch(`http://localhost:5000/api/profile?email=${email}`);

        if (res.status === 200) {
          navigate("/profile-details");
        } else if (res.status === 404) {
          navigate("/profile"); // New user
        } else {
          alert("Unexpected response from server");
        }
      } catch (error) {
        console.error("❌ Login failed:", error);
        alert("Login failed. Try again.");
      }
    };

    // ✅ Google Login Init
    if (window.google && clientId) {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-login"),
        { theme: "outline", size: "large" }
      );
    }
  }, [navigate, clientId]);

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h1>Welcome to <span className="brand">FitTrack</span></h1>
        <p>Please sign in to continue</p>
        <div id="google-login"></div>
      </div>
    </div>
  );
};

export default Login;
