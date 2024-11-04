// src/components/NutritionSearch.js
import React, { useState } from "react";

const NutritionSearch = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query) onSearch(query);
  };

  return (
    <div>
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
