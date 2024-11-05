import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadUser } from "./actions/auth";
import RecentMeals from "./components/nutrition_cal/Recent_meals"; // Add this import

import "./App.css";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import VerifyEmail from "./components/auth/VerifyEmail";
import PrivateRoute from "./routing/PrivateRoute";
import NotFound from "./components/NotFound/NotFound";
import Dashboard from "./components/Dashboard/Dashboard";
import setAuthToken from "./utils/setAuthToken";
import NutritionCalculator from "./components/nutrition_cal/NutritionCalculator";
import DietPlanner from "./components/Analysis/DietPlanner";
import DailyPriceList from "./components/Grocery/DailyPriceList";
import Welloh from "./components/Welloh/Welloh";
import MyCalendar from "./components/Calendar/MyCalendar";
import AddEvents from "./components/Calendar/AddEvents";
import UpdateEvent from "./components/Calendar/UpdateEvent";
import FAQs from "./components/FAQ/FAQs";
import Location from "./components/Location/Location";
import LogMeal from "./components/NutritionCalculator_U0301";
import Profile from "./components/Profile/Profile";
import Layout from "./components/layout/Layout";
import NutritionixAPI from "./components/Dashboard/NutritionixAPI";

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
            path="/nutrition-calculator"
            element={<PrivateRoute element={() => withLayout(NutritionCalculator)} />}
          />
          {/* Add this new route */}
          <Route
            path="/recent-meals"
            element={<PrivateRoute element={() => withLayout(RecentMeals)} />}
          />
          <Route path="/log-meal" element={withLayout(LogMeal)} />
          <Route path="/diet-planner" element={withLayout(DietPlanner)} />
          <Route
            path="/daily-price-list"
            element={withLayout(DailyPriceList)}
          />
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
          <Route path="/nutrition" element={<NutritionixAPI />} />
          <Route path="/faqs" element={withLayout(FAQs)} />
          <Route path="/location" element={<Location />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;