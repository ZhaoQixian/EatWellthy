import React from 'react';
import axios from 'axios';
import MealForm from './nutrition_cal/Meal_form';





const Log_meal = () => {
  return (
    <div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h1>NutritionCalculator</h1>
      <p>Log your meal</p>
      <MealForm/>
    </div>
  ) 
};

export default Log_meal;