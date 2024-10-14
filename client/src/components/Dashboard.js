import React from "react";
import { connect } from "react-redux";
import "./Dashboard.css";
import Sidebar from "./Sidebar";
import NutritionalGraph from "./NutritionalGraph";
import ProgressTracker from "./ProgressTracker";
import DietSuggestions from "./DietSuggestions";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // 
import icon from "../img/user.png";
import { Route } from 'react-router-dom';

import NutritionCalculator from "./NutritionCalculator"
<Route path="./NutritionCalculator" element={<NutritionCalculator />} />

const Dashboard = ({ auth }) => {
  // Debugging: Log auth object
  console.log("auth object:", auth);

  // Check if user exists before rendering
  if (!auth || !auth.user) {
    return <div>Loading...</div>; // Display loading or placeholder
  }

  return (
    <div className="dashboard-container">
      <Sidebar user={auth.user} />

      <div className="dashboard-content">
        <h1>Welcome, {auth.user.name}!</h1>
        <Link to="/nutrition-calculator" style={{ marginTop: "2rem", display: "block" }}>
        Go to Nutrition Calculator
      </Link>
        <div className="dashboard-sections">
          <div className="section">
            <h2>Daily Nutritional Intake</h2>
            <NutritionalGraph />
          </div>

          <div className="section">
            <h2>Progress Tracking</h2>
            <ProgressTracker />
          </div>

          <div className="section">
            <h2>Diet Suggestions</h2>
            <DietSuggestions />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth, // Ensure this matches your Redux structure
});

export default connect(mapStateToProps)(Dashboard);
