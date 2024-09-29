import React from 'react';
import { Link } from 'react-router-dom';

const Success = () => {
  return (
    <div>
      <h1>Success!</h1>
      <p>You have successfully logged in.</p>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        <li>
          <Link to="/dashboard">📊 Dashboard</Link>
        </li>
        <li>
          <Link to="/profile">👤 Profile</Link>
        </li>
        <li>
          <Link to="/nutrition-calculator">🍏 Nutrition Calculator</Link>
        </li>
        <li>
          <Link to="/diet-planner">📋 Diet Planner</Link>
        </li>
        <li>
          <Link to="/daily-price-list">📝 Daily Price List</Link>
        </li>
        <li>
          <Link to="/welloh">💬 Welloh</Link>
        </li>
        <li>
          <Link to="/calendar">📅 Calendar</Link>
        </li>
        <li>
          <Link to="/faqs">❓ FAQs</Link>
        </li>
        <li>
          <Link to="/location">📍 Location</Link>
        </li>
      </ul>
    </div>
  );
};

export default Success;
