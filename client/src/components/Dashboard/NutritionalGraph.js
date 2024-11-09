import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getProfile } from "../../actions/Profile";
import "./NutritionGraph.css";
import config from '../../config';

ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionalGraph = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [actualMacros, setActualMacros] = useState({
    carbs: 0,
    fat: 0,
    protein: 0
  });
  const [targetMacros, setTargetMacros] = useState({
    carbs: 0,
    fat: 0,
    protein: 0
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // Original fetchTodaysMeals function - keeping the actual macro tracking the same
  const fetchTodaysMeals = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const response = await axios.post(`${config.backendUrl}/nutrition/query_meal`, {
        meal_type: '',
        owner: auth.user._id,
        time: today
      });

      if (response.data.success) {
        const totals = response.data.meals.reduce((acc, { meal, nutrition }) => {
          if (nutrition !== "No nutrition data found for this meal.") {
            const portion = meal.portion || 1;
            const carbsInGrams = (nutrition[0].sugar + nutrition[0].fiber) * portion;
            return {
              carbs: acc.carbs + (carbsInGrams * 4),
              fat: acc.fat + (nutrition[0].fat * portion * 9),
              protein: acc.protein + (nutrition[0].protein * portion * 4)
            };
          }
          return acc;
        }, { carbs: 0, fat: 0, protein: 0 });

        setActualMacros({
          carbs: Math.round(totals.carbs),
          fat: Math.round(totals.fat),
          protein: Math.round(totals.protein)
        });
      }
    } catch (err) {
      console.error("Error fetching meals:", err);
      setActualMacros({ carbs: 0, fat: 0, protein: 0 });
    }
  };

  useEffect(() => {
    if (auth.user?._id) {
      fetchTodaysMeals();
    }
  }, [auth.user]);

  // Calculate BMR and daily calories using the DietPlanner logic
  useEffect(() => {
    if (profile?.height && profile?.weight) {
      const heightInMeters = profile.height / 100;
      const calculatedBMI = (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(calculatedBMI);

      if (profile.age && profile.gender) {
        let calculatedBMR;
        if (profile.gender === "male") {
          calculatedBMR = 88.362 + 13.397 * profile.weight + 4.799 * profile.height - 5.677 * profile.age;
        } else {
          calculatedBMR = 447.593 + 9.247 * profile.weight + 3.098 * profile.height - 4.33 * profile.age;
        }
        setBmr(Math.round(calculatedBMR));

        const activityMultipliers = {
          sedentary: 1.2,
          lightly: 1.375,
          moderately: 1.55,
          very: 1.725,
          super: 1.9,
        };

        const baseCalories = calculatedBMR * activityMultipliers[profile.activityLevel || "sedentary"];
        const adjustedCalories = adjustCaloriesForPlan(baseCalories, profile.dietPlan, calculatedBMI);
        setDailyCalories(Math.round(adjustedCalories));
      }
    }
  }, [profile]);

  const adjustCaloriesForPlan = (baseCalories, plan, bmi) => {
    switch (plan) {
      case "weightloss":
        const deficitPercentage = parseFloat(bmi) > 30 ? 0.25 : 0.2;
        return baseCalories * (1 - deficitPercentage);
      case "keto":
        return baseCalories * 0.85;
      case "maintenance":
      case "vegetarian":
      default:
        return baseCalories;
    }
  };

  const getDietPlanMacros = (plan) => {
    const plans = {
      maintenance: { carbs: 55, protein: 15, fats: 30 },
      weightloss: { carbs: 50, protein: 25, fats: 25 },
      keto: { carbs: 5, protein: 20, fats: 75 },
      vegetarian: { carbs: 55, protein: 20, fats: 25 },
    };
    return plans[plan || "maintenance"];
  };

  // Calculate target macros based on DietPlanner logic
  useEffect(() => {
    if (dailyCalories && profile) {
      const macroSplit = getDietPlanMacros(profile.dietPlan);
      
      const carbsCal = calculateMacroCalories(dailyCalories, macroSplit.carbs);
      const proteinCal = calculateMacroCalories(dailyCalories, macroSplit.protein);
      const fatCal = calculateMacroCalories(dailyCalories, macroSplit.fats);

      setTargetMacros({
        carbs: carbsCal,
        protein: proteinCal,
        fat: fatCal,
      });
    }
  }, [dailyCalories, profile]);

  const calculateMacroCalories = (totalCalories, macroPercentage) => {
    const calories = totalCalories * (macroPercentage / 100);
    return Math.round(calories);
  };

  const hasCompleteProfile = profile?.height && profile?.weight && profile?.age && profile?.gender;

  const getMacroGrams = (calories, macro) => {
    switch (macro) {
      case "carbs":
      case "protein":
        return Math.round(calories / 4);
      case "fat":
        return Math.round(calories / 9);
      default:
        return 0;
    }
  };

  const handleNavigateToNutrition = () => {
    navigate("/nutrition");
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          filter: (legendItem) => {
            return !legendItem.text.includes('Remaining');
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const macro = label.toLowerCase().includes('carbohydrates') ? 'carbs' :
                         label.toLowerCase().includes('protein') ? 'protein' : 'fat';
            return `${label}: ${value} Cal (${getMacroGrams(value, macro)}g)`;
          }
        }
      }
    }
  };

  const data = {
    labels: ["Carbohydrates", "Carbohydrates Remaining", "Fat", "Fat Remaining", "Protein", "Protein Remaining"],
    datasets: [
      {
        data: [
          actualMacros.carbs,
          Math.max(0, targetMacros.carbs - actualMacros.carbs),
          actualMacros.fat,
          Math.max(0, targetMacros.fat - actualMacros.fat),
          actualMacros.protein,
          Math.max(0, targetMacros.protein - actualMacros.protein)
        ],
        backgroundColor: [
          "#007bff",
          "#E0E0E0",
          "#ff6347",
          "#E0E0E0",
          "#28a745",
          "#E0E0E0",
        ],
      },
    ],
  };

  return (
    <div className="nutritional-graph">
      {loading ? (
        <div>Loading...</div>
      ) : !hasCompleteProfile ? (
        <div>
          <p>Please update your profile to see your nutritional data.</p>
        </div>
      ) : (
        <>
          <div>
            <Doughnut data={data} options={options} />
            <div className="macro-info">
              <h3>Nutrition Summary</h3>
              <p>
                Carbohydrates: {actualMacros.carbs}/{targetMacros.carbs} Cal ({getMacroGrams(actualMacros.carbs, 'carbs')}/{getMacroGrams(targetMacros.carbs, 'carbs')}g)
              </p>
              <p>
                Fat: {actualMacros.fat}/{targetMacros.fat} Cal ({getMacroGrams(actualMacros.fat, 'fat')}/{getMacroGrams(targetMacros.fat, 'fat')}g)
              </p>
              <p>
                Protein: {actualMacros.protein}/{targetMacros.protein} Cal ({getMacroGrams(actualMacros.protein, 'protein')}/{getMacroGrams(targetMacros.protein, 'protein')}g)
              </p>
            </div>
          </div>
          <div className="nutrition-prompt">
            <p>Curious about meal nutrition? Just search it up!</p>
            <button onClick={handleNavigateToNutrition} className="diet-calendar-button">
              Go to Nutrition Info Finder
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NutritionalGraph;