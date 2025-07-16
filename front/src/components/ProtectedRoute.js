// src/components/ProtectedRoute.js

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = user && user.email;

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
