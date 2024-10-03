import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import "./App.css";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PrivateRoute from "./routing/PrivateRoute";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";
import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import { loadUser } from "./actions/auth";
import NutritionCalculator from "./components/NutritionCalculator";
import DietPlanner from "./components/DietPlanner";
import DailyPriceList from "./components/DailyPriceList";
import Welloh from "./components/Welloh";
import Calendar from "./components/Calendar";
import FAQs from "./components/FAQs";
import Location from "./components/Location";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={Dashboard} />}
            />
            <Route
              path="/nutrition-calculator"
              element={<NutritionCalculator />}
            />
            <Route path="/diet-planner" element={<DietPlanner />} />
            <Route path="/daily-price-list" element={<DailyPriceList />} />
            <Route path="/welloh" element={<Welloh />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/location" element={<Location />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
