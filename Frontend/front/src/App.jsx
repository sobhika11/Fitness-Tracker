import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import MealPlanner from "./pages/MealPlanner";
import WaterTracker from "./pages/WaterTracker";
import Streak from "./pages/Streak";
import Profile from "./pages/Profile";
import AiCoach from "./pages/AiCoach";
import Exercise from "./pages/Exercise";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meal-planner" element={<MealPlanner />} />
        <Route path="/water-tracker" element={<WaterTracker />} />
        <Route path="/streak" element={<Streak />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-coach" element={<AiCoach />} />
        <Route path="/exercise" element={<Exercise />} />
      </Routes>
    </Router>
  );
}

export default App;