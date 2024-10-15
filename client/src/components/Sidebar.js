import React from "react";
import { Link } from "react-router-dom";
import icon from "../img/user.png"; // Ensure you have this image

const Sidebar = ({ user }) => (
  <div className="sidebar">
    <div className="profile-section">
      <img src={icon} alt="user-icon" className="user-avatar" />
      <p>{user && user.name}</p>
    </div>
    <ul className="menu">
      <li>
        <Link to="/nutrition-calculator">Nutrition Calculator</Link>
      </li>
      <li>
        <Link to="/diet-planner">Diet Planner</Link>
      </li>
      <li>
        <Link to="/daily-price-list">Daily Price List</Link>
      </li>
      <li>
        <Link to="/calendar">Calendar</Link>
      </li>
      <li>
        <Link to="/faqs">FAQs</Link>
      </li>
      <li>
        <Link to="/location">Location</Link>
      </li>
      <li>
        <Link to="/Welloh" class = "wellohli">Talk to Welloh</Link>
      </li>
    </ul>
  </div>
);

export default Sidebar;
