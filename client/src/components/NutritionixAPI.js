import React, { useState } from "react";
import axios from "axios";
import NutritionSearch from "./NutritionSearch";
import NutritionDetails from "./NutritionDetails";
import "./NutritionixAPI.css";
const NutritionixAPI = () => {
  const [nutritionData, setNutritionData] = useState(null);

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

  return (
    <div className="NutritionixAPI">
      <h1>Nutrition Info Finder</h1>
      <NutritionSearch onSearch={handleSearch} />
      <NutritionDetails data={nutritionData} />
    </div>
  );
};

export default NutritionixAPI;
