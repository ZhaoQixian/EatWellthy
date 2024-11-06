import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./Dashboard.css";
import NutritionalGraph from "./NutritionalGraph";
import ProgressTracker from "./ProgressTracker";
import DietSuggestions from "./DietSuggestions";
import FoodTransformLoading from "./FoodTransformLoading";

const Dashboard = ({ auth }) => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  // Debugging: Log auth object
  console.log("DASHBOARD/isAuthenticated", auth.isAuthenticated);
  console.log("DASHBOARD/Loading", auth.loading);
  console.log("DASHBOARD/User", auth.user);

  // Check if user exists before rendering
  if (!auth.user) {
    return <div>Loading...</div>; // Display loading or placeholder
  }

  if (!auth.isAuthenticated) {
    navigate("/");
  }

  // Get the current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <h1 className="welcome-message">Welcome, {auth.user.name}!</h1>
      <p className="date-display">{currentDate}</p>
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
          <DietSuggestions setDashboardLoading={setIsGenerating} />
        </div>
      </div>

      {isGenerating && <FoodTransformLoading />}
    </>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
