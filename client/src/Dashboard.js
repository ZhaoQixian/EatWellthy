import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Calendar from "./components/Calendar"; // Import additional features
import NutritionCalculator from "./components/NutritionCalculator";
import DietPlanner from "./components/DietPlanner";
import DailyPriceList from "./components/DailyPriceList";
import FAQs from "./components/FAQs";
import Location from "./components/Location";
import icon from "../img/user.png";

const Dashboard = ({ auth: { user } }) => {
  // Add a check for user loading
  if (!user) {
    return <div style={{ marginTop: "5rem", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div style={{ marginTop: "5rem", textAlign: "center" }}>
      <h1>Welcome, {user.name}!</h1>
      <img
        src={icon}
        alt="user-icon"
        style={{ width: "150px", margin: "20px auto" }}
      />

      {/* Add verification reminder if user is not verified */}
      {!user.isVerified && (
        <div className="alert alert-warning" style={{ margin: "20px auto", maxWidth: "600px" }}>
          Please verify your email address. 
          <Link to="/verify" style={{ marginLeft: "10px" }}>
            Verify Now
          </Link>
        </div>
      )}

      {/* Navigation section for quick access */}
      <nav className="dashboard-nav">
        <Link to="/nutrition-calculator" className="btn">
          Nutrition Calculator
        </Link>
        <Link to="/diet-planner" className="btn">
          Diet Planner
        </Link>
        <Link to="/daily-price-list" className="btn">
          Daily Price List
        </Link>
        <Link to="/calendar" className="btn">
          Calendar
        </Link>
        <Link to="/faqs" className="btn">
          FAQs
        </Link>
        <Link to="/location" className="btn">
          Location
        </Link>
      </nav>

      {/* Display dashboard features */}
      <div className="dashboard-features">
        <h2>Your Health Overview</h2>
        <div className="feature-section">
          <h3>Today's Calendar</h3>
          <Calendar />
        </div>

        <div className="feature-section">
          <h3>Nutrition Calculator</h3>
          <NutritionCalculator />
        </div>

        <div className="feature-section">
          <h3>Diet Planner</h3>
          <DietPlanner />
        </div>

        <div className="feature-section">
          <h3>Daily Price List</h3>
          <DailyPriceList />
        </div>

        <div className="feature-section">
          <h3>FAQs</h3>
          <FAQs />
        </div>

        <div className="feature-section">
          <h3>Location</h3>
          <Location />
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

// Fix the export - connect needs to wrap the export
export default connect(mapStateToProps)(Dashboard);