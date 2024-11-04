// src/components/NutritionDetails.js
import React from "react";

const NutritionDetails = ({ data }) => {
  if (!data) return null;

  return (
    <div>
      <h3>Nutrition Facts</h3>
      {data.foods.map((food, index) => (
        <div key={index}>
          <h4>{food.food_name}</h4>
          <p>Calories: {food.nf_calories}</p>
          <p>Protein: {food.nf_protein}g</p>
          <p>Carbohydrates: {food.nf_total_carbohydrate}g</p>
          <p>Fats: {food.nf_total_fat}g</p>
        </div>
      ))}
    </div>
  );
};

export default NutritionDetails;
