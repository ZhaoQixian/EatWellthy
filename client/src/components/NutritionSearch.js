// src/components/NutritionSearch.js
import React, { useState } from "react";
import "./NutritionSearch.css";
const NutritionSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query) onSearch(query);
  };

  return (
    <div className="NutritionSearch">
      <input
        type="text"
        placeholder="Enter food item"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default NutritionSearch;
