import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Calendar from "./Calendar"; // Import additional features
import NutritionCalculator from "./NutritionCalculator";
import DietPlanner from "./DietPlanner";
import DailyPriceList from "./DailyPriceList";
import FAQs from "./FAQs";
import Location from "./Location";
import icon from "../img/user.png";

const Dashboard = ({ auth: { user } }) => {
  return (
    <div style={{ marginTop: "5rem", textAlign: "center" }}>
      <h1>Welcome, {user && user.name}!</h1>
      <img
        src={icon}
        alt="user-icon"
        style={{ width: "150px", margin: "20px auto" }}
      />

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

// Ensure that `connect` is properly returning the connected component
export default connect(mapStateToProps)(Dashboard);
