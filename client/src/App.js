import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Success from './Success';
import Dashboard from './Dashboard';
import Profile from './Profile';
import NutritionCalculator from './NutritionCalculator';
import DietPlanner from './DietPlanner';
import DailyPriceList from './DailyPriceList';
import Welloh from './Welloh';
import Calendar from './Calendar';
import FAQs from './FAQs';
import Location from './Location';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nutrition-calculator" element={<NutritionCalculator />} />
        <Route path="/diet-planner" element={<DietPlanner />} />
        <Route path="/daily-price-list" element={<DailyPriceList />} />
        <Route path="/welloh" element={<Welloh />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/faqs" element={<FAQs />} />
        <Route path="/location" element={<Location />} />
      </Routes>
    </Router>
  );
}

export default App;
