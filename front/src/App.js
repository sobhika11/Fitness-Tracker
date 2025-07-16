import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProfileDetails from "./pages/ProfileDetails";
import StreakWater from "./pages/StreakWater";
import MealPlan from "./pages/MealPlan";
import Exercise from "./pages/Exercise";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Router>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-details"
          element={
            <ProtectedRoute>
              <ProfileDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/streak"
          element={
            <ProtectedRoute>
              <StreakWater />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meals"
          element={
            <ProtectedRoute>
              <MealPlan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exercise"
          element={
            <ProtectedRoute>
              <Exercise />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
