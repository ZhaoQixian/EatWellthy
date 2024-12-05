import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

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

  // Updated to format all numbers with 0 decimal places
  const formatNumber = (value) => Math.round(value);

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
      const response = await axios.post(`${config.backendUrl}/nutrition/query_meal`, {
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
      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: '100px' }}>Meal Type</th>
              <th style={{ width: '120px' }}>Food</th>
              <th style={{ width: '60px' }}>Amount</th>
              <th style={{ width: '80px' }}>Energy<br />(kcal)</th>
              <th style={{ width: '60px' }}>Fat<br />(g)</th>
              <th style={{ width: '60px' }}>Sugar<br />(g)</th>
              <th style={{ width: '60px' }}>Fiber<br />(g)</th>
              <th style={{ width: '60px' }}>Protein<br />(g)</th>
              <th style={{ width: '80px' }}>Sodium<br />(mg)</th>
              <th style={{ width: '80px' }}>Vitamin C<br />(mg)</th>
              <th style={{ width: '80px' }}>Calcium<br />(mg)</th>
              <th style={{ width: '60px' }}>Iron<br />(mg)</th>
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
                    <td>{formatNumber(meal.portion * nutrition[0].energy)}</td>
                    <td>{formatNumber(meal.portion * nutrition[0].fat)}</td>
                    <td>{formatNumber(meal.portion * nutrition[0].sugar)}</td>
                    <td>{formatNumber(meal.portion * nutrition[0].fiber)}</td>
                    <td>{formatNumber(meal.portion * nutrition[0].protein)}</td>
                    <td>{formatNumber(meal.portion * nutrition[0].sodium)}</td>
                    <td>{formatNumber(meal.portion * nutrition[0].vitamin_c)}</td>
                    <td>{formatNumber(meal.portion * nutrition[0].calcium)}</td>
                    <td>{formatNumber(meal.portion * nutrition[0].iron)}</td>
                  </tr>
                ))}
                <tr className="totals-row">
                  <td colSpan="3">Daily Totals:</td>
                  <td>{formatNumber(dayData.totals.energy)}</td>
                  <td>{formatNumber(dayData.totals.fat)}</td>
                  <td>{formatNumber(dayData.totals.sugar)}</td>
                  <td>{formatNumber(dayData.totals.fiber)}</td>
                  <td>{formatNumber(dayData.totals.protein)}</td>
                  <td>{formatNumber(dayData.totals.sodium)}</td>
                  <td>{formatNumber(dayData.totals.vitamin_c)}</td>
                  <td>{formatNumber(dayData.totals.calcium)}</td>
                  <td>{formatNumber(dayData.totals.iron)}</td>
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
