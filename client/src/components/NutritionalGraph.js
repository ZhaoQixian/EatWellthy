import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getProfile, updateProfile } from "../actions/Profile";

// Register the required elements with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionalGraph = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [macroData, setMacroData] = useState({ carbs: 0, fat: 0, protein: 0 });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile?.height && profile?.weight) {
      const heightInMeters = profile.height / 100;
      const calculatedBMI = (
        profile.weight /
        (heightInMeters * heightInMeters)
      ).toFixed(1);
      setBmi(calculatedBMI);

      if (profile.age && profile.gender) {
        let calculatedBMR;
        if (profile.gender === "male") {
          calculatedBMR =
            88.362 +
            13.397 * profile.weight +
            4.799 * profile.height -
            5.677 * profile.age;
        } else {
          calculatedBMR =
            447.593 +
            9.247 * profile.weight +
            3.098 * profile.height -
            4.33 * profile.age;
        }
        setBmr(Math.round(calculatedBMR));

        const activityMultipliers = {
          sedentary: 1.2,
          lightly: 1.375,
          moderately: 1.55,
          very: 1.725,
          super: 1.9,
        };
        const calories =
          calculatedBMR *
          activityMultipliers[profile.activityLevel || "sedentary"];
        setDailyCalories(Math.round(calories));
      }
    }
  }, [profile]);

  useEffect(() => {
    if (dailyCalories && profile) {
      const dietPlan = profile.dietPlan || "maintenance";
      const macroSplit = getDietPlanMacros(dietPlan);

      setMacroData({
        carbs: calculateMacroCalories(dailyCalories, macroSplit.carbs),
        fat: calculateMacroCalories(dailyCalories, macroSplit.fats),
        protein: calculateMacroCalories(dailyCalories, macroSplit.protein),
      });
    }
  }, [dailyCalories, profile]);

  const calculateMacroCalories = (totalCalories, macroPercentage) => {
    const calories = totalCalories * (macroPercentage / 100);
    return Math.round(calories);
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

  // Check for missing profile data
  const hasCompleteProfile =
    profile?.height && profile?.weight && profile?.age && profile?.gender;

  const data = {
    labels: ["Carbohydrates", "Fat", "Protein"],
    datasets: [
      {
        data: [macroData.carbs, macroData.fat, macroData.protein],
        backgroundColor: ["#007bff", "#ff6347", "#28a745"],
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
        <Doughnut data={data} />
      )}
    </div>
  );
};

export default NutritionalGraph;
