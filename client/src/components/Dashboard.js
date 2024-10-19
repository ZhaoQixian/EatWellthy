import React from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import "./Dashboard.css";
import Sidebar from "./Sidebar";
import NutritionalGraph from "./NutritionalGraph";
import ProgressTracker from "./ProgressTracker";
import DietSuggestions from "./DietSuggestions";

// import icon from "../img/user.png";
// import { Route } from "react-router-dom";

const Dashboard = ({ auth }) => {
  const navigate = useNavigate();

  console.log("DASHBOARD/isAuthenticated", auth.isAuthenticated);
  console.log("DASHBOARD/Loading", auth.loading);
  console.log("DASHBOARD/User", auth.user);

  // Debugging: Log auth object
  console.log("auth object:", auth);

  // Check if user exists before rendering
  if (!auth.user) {
    return <div>Loading...</div>; // Display loading or placeholder
  }

  if (!auth.isAuthenticated) {
    navigate("/");
  }

  return (
    <div className="dashboard-container">
      <Sidebar user={auth.user} />

      <div className="dashboard-content">
        <h1>Welcome, {auth.user.name}!</h1>
        <Link
          to="/nutrition-calculator"
          style={{ marginTop: "2rem", display: "block" }}
        >
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

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth, // Ensure this matches your Redux structure
});

export default connect(mapStateToProps)(Dashboard);
