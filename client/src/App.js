import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./actions/auth";

import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyEmail from "./components/auth/VerifyEmail";
import PrivateRoute from "./routing/PrivateRoute";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import setAuthToken from "./utils/setAuthToken";
import NutritionCalculator from "./components/NutritionCalculator";
import DietPlanner from "./components/DietPlanner";
import DailyPriceList from "./components/DailyPriceList";
import Welloh from "./components/Welloh";
import MyCalendar from "./components/Calendar/MyCalendar";
import AddEvents from "./components/Calendar/AddEvents";
import UpdateEvent from "./components/Calendar/UpdateEvent";
import FAQs from "./components/FAQs";
import Location from "./components/Location/Location";
import LogMeal from "./components/NutritionCalculator_U0301";
import Profile from "./components/Profile";
import Layout from "./components/layout/Layout";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if token exists and set auth token in axios headers
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      dispatch(loadUser()); // Load user data whenever app mounts
    }
  }, [dispatch]); // Only run once when component mounts

  // Set auth token on initial load
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  const withLayout = (Component) => {
    return (
      <Layout>
        <Component />
      </Layout>
    );
  };

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute element={() => withLayout(Dashboard)} />}
          />
          <Route 
            path="/profile" 
            element={<PrivateRoute element={() => withLayout(Profile)} />} 
          />
          <Route
            path="/nutrition-calculator/:userId/:username"
            element={withLayout(NutritionCalculator)}
          />
          <Route path="/log-meal" element={withLayout(LogMeal)} />
          <Route path="/diet-planner" element={withLayout(DietPlanner)} />
          <Route path="/daily-price-list" element={withLayout(DailyPriceList)} />
          <Route path="/welloh" element={withLayout(Welloh)} />
          <Route 
            path="/calendar" 
            element={<PrivateRoute element={() => withLayout(MyCalendar)} />} 
          />
          <Route 
            path="/events/add" 
            element={<PrivateRoute element={() => withLayout(AddEvents)} />} 
          />
          <Route 
            path="/event/:id/update" 
            element={<PrivateRoute element={() => withLayout(UpdateEvent)} />} 
          />
          <Route path="/faqs" element={withLayout(FAQs)} />
          <Route path="/location" element={<Location />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;