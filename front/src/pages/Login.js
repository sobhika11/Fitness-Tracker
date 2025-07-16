import React from "react";
import "../styles/Login.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded:", decoded);

      // Save to localStorage
      localStorage.setItem("userEmail", decoded.email);
      localStorage.setItem("userName", decoded.name);
      localStorage.setItem("userPicture", decoded.picture);

      // ✅ Redirect
      navigate("/profile");
    } catch (error) {
      console.error("JWT Decode failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>
          Welcome to <span className="brand">FitTrack</span>
        </h1>
        <p>Please sign in to continue</p>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => alert("Login Failed")}
        />
      </div>
    </div>
  );
};

export default Login;
