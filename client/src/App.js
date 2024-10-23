import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./routing/PrivateRoute";
import NotFound from "./components/ErrorHandling/NotFound";
import Dashboard from "./components/Dashboard/Dashboard";
import setAuthToken from "./utils/setAuthToken";
import NutritionCalculator from "./components/NutritionCalculator/NutritionCalculator";
import DietPlanner from "./components/DailyPlanner/DietPlanner";
import DailyPriceList from "./components/DailyPriceList/DailyPriceList";
import Welloh from "./components/WellOh/Welloh";
import MyCalendar from "./components/Calendar/MyCalendar";
import AddEvents from "./components/Calendar/AddEvents";
import UpdateEvent from "./components/Calendar/UpdateEvent";
import FAQs from "./components/FAQ/FAQs";
import Location from "./components/Location/Location";
import LogMeal from "./components/NutritionCalculator/NutritionCalculator_U0301";
import Profile from "./components/Profile/Profile";

// import { loadUser } from "./actions/auth";

function App() {
  // useEffect(() => dispatch(loadUser()), []);
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={Dashboard} />}
          />
          <Route path="/profile" element={<PrivateRoute element={Profile} />} />

          <Route
            path="/nutrition-calculator/:username"
            element={<NutritionCalculator />}
          />
          <Route path="/log-meal" element={<LogMeal />} />
          <Route path="/diet-planner" element={<DietPlanner />} />
          <Route path="/daily-price-list" element={<DailyPriceList />} />
          <Route path="/welloh" element={<Welloh />} />
          <Route path="/calendar" element={<MyCalendar />} />
          <Route path="/events/add" element={<AddEvents />} />
          <Route path="/event/:id/update" element={<UpdateEvent />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/location" element={<Location />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
