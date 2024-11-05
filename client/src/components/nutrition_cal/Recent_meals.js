import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "./Recent_meals.css";

const RecentMeals = ({ userId }) => {
  const [mealData, setMealData] = useState({
    today: { meals: [], totals: {} },
    yesterday: { meals: [], totals: {} },
    twoDaysAgo: { meals: [], totals: {} }
  });

  const getDateForQuery = (daysAgo) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - daysAgo);
    return date;
  };

  const formatMacro = (value) => Math.round(value);
  const formatMicro = (value) => value.toFixed(3);

  const calculateDayTotals = (meals) => {
    const totals = {
      energy: 0,
      fat: 0,
      sugar: 0,
      fiber: 0,
      protein: 0,
      sodium: 0,
      vitamin_c: 0,
      calcium: 0,
      iron: 0
    };

    meals.forEach(({ meal, nutrition }) => {
      if (nutrition !== "No nutrition data found for this meal.") {
        Object.keys(totals).forEach(nutrient => {
          totals[nutrient] += (nutrition[0][nutrient] * meal.portion) || 0;
        });
      }
    });

    return totals;
  };

  const fetchMealsForDate = async (date) => {
    try {
      const response = await axios.post("http://localhost:5050/nutrition/query_meal", {
        meal_type: '',
        owner: userId,
        time: date
      });
      return response.data.success ? response.data.meals : [];
    } catch (err) {
      console.error("Error fetching meals:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchAllMeals = async () => {
      const dates = [0, 1, 2].map(getDateForQuery);
      const [todayMeals, yesterdayMeals, twoDaysAgoMeals] = await Promise.all(
        dates.map(fetchMealsForDate)
      );

      setMealData({
        today: {
          meals: todayMeals,
          totals: calculateDayTotals(todayMeals)
        },
        yesterday: {
          meals: yesterdayMeals,
          totals: calculateDayTotals(yesterdayMeals)
        },
        twoDaysAgo: {
          meals: twoDaysAgoMeals,
          totals: calculateDayTotals(twoDaysAgoMeals)
        }
      });
    };

    fetchAllMeals();
  }, [userId]);

  const renderMealTable = (dayData, title) => (
    <div className="meal-section">
      <h2>{title}</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Meal Type</th>
              <th>Food</th>
              <th>Amount</th>
              <th>Energy(kcal)</th>
              <th>Fat(g)</th>
              <th>Sugar(g)</th>
              <th>Fiber(g)</th>
              <th>Protein(g)</th>
              <th>Sodium(mg)</th>
              <th>Vitamin C(mg)</th>
              <th>Calcium(mg)</th>
              <th>Iron(mg)</th>
            </tr>
          </thead>
          <tbody>
            {dayData.meals.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: 'center' }}>No meals recorded</td>
              </tr>
            ) : (
              <>
                {dayData.meals.map(({ meal, nutrition }) => (
                  <tr key={meal._id}>
                    <td>{meal.meal_type}</td>
                    <td>{meal.food_taken}</td>
                    <td>{meal.portion}</td>
                    <td>{formatMacro(meal.portion * nutrition[0].energy)}</td>
                    <td>{formatMacro(meal.portion * nutrition[0].fat)}</td>
                    <td>{formatMacro(meal.portion * nutrition[0].sugar)}</td>
                    <td>{formatMacro(meal.portion * nutrition[0].fiber)}</td>
                    <td>{formatMacro(meal.portion * nutrition[0].protein)}</td>
                    <td>{formatMicro(meal.portion * nutrition[0].sodium)}</td>
                    <td>{formatMicro(meal.portion * nutrition[0].vitamin_c)}</td>
                    <td>{formatMicro(meal.portion * nutrition[0].calcium)}</td>
                    <td>{formatMicro(meal.portion * nutrition[0].iron)}</td>
                  </tr>
                ))}
                <tr className="totals-row">
                  <td colSpan="3">Daily Totals:</td>
                  <td>{formatMacro(dayData.totals.energy)}</td>
                  <td>{formatMacro(dayData.totals.fat)}</td>
                  <td>{formatMacro(dayData.totals.sugar)}</td>
                  <td>{formatMacro(dayData.totals.fiber)}</td>
                  <td>{formatMacro(dayData.totals.protein)}</td>
                  <td>{formatMicro(dayData.totals.sodium)}</td>
                  <td>{formatMicro(dayData.totals.vitamin_c)}</td>
                  <td>{formatMicro(dayData.totals.calcium)}</td>
                  <td>{formatMicro(dayData.totals.iron)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="recent-meals">
      {renderMealTable(mealData.today, "Today's Meals")}
      {renderMealTable(mealData.yesterday, "Yesterday's Meals")}
      {renderMealTable(mealData.twoDaysAgo, "Two Days Ago Meals")}
    </div>
  );
};

export default RecentMeals;