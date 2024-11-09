// src/components/NutritionixAPI.js
import React, { useState } from "react";
import axios from "axios";
import NutritionSearch from "./NutritionSearch";
import NutritionDetails from "./NutritionDetails";
import { useNavigate } from "react-router-dom";
import "./NutritionixAPI.css";
import config from '../../config'; 

const NutritionixAPI = () => {
  const [nutritionData, setNutritionData] = useState(null);
  const [error, setError] = useState(false); // State for handling invalid input
  const navigate = useNavigate();

  const handleSearch = async (query) => {
    try {
      const response = await axios.post(`${config.backendUrl}/api/nutrition`, {
        query,
      });
      if (response.data) {
        setNutritionData(response.data);
        setError(false); // Reset error if data is returned
      } else {
        setNutritionData(null);
        setError(true); // Set error if no data is returned
      }
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      setNutritionData(null);
      setError(true); // Set error on API call failure
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="NutritionixAPI">
      <h1>Nutrition Info Finder</h1>
      <NutritionSearch onSearch={handleSearch} />
      {error && (
        <p className="error-message">Invalid input. Please try again.</p>
      )}
      <NutritionDetails data={nutritionData} />
      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default NutritionixAPI;
