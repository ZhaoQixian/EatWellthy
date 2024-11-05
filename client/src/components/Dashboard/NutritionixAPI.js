import React, { useState } from "react";
import axios from "axios";
import NutritionSearch from "./NutritionSearch";
import NutritionDetails from "./NutritionDetails";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./NutritionixAPI.css";

const NutritionixAPI = () => {
  const [nutritionData, setNutritionData] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleSearch = async (query) => {
    try {
      const response = await axios.post("http://localhost:5050/api/nutrition", {
        query,
      });
      setNutritionData(response.data);
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="NutritionixAPI">
      <h1>Nutrition Info Finder</h1>
      <NutritionSearch onSearch={handleSearch} />
      <NutritionDetails data={nutritionData} />
      <button className="go-back-button" onClick={handleGoBack}>
        Go Back
      </button>
    </div>
  );
};

export default NutritionixAPI;
