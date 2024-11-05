import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../actions/Profile";
import "./ProgressTracker.css"; // Import the CSS file

// Register the required elements with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressTracker = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

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

        const baseCalories =
          calculatedBMR *
          activityMultipliers[profile.activityLevel || "sedentary"];
        const adjustedCalories = adjustCaloriesForPlan(
          baseCalories,
          profile.dietPlan,
          calculatedBMI
        );
        setDailyCalories(Math.round(adjustedCalories));
      }
    }
  }, [profile]);

  const [caloriesConsumed, setCaloriesConsumed] = useState(1350); // Placeholder value
  const caloriesRemaining = dailyCalories
    ? Math.max(dailyCalories - caloriesConsumed, 0)
    : 0;

  const hasCompleteProfile = profile?.weight && profile?.targetWeight;

  const data = {
    labels: ["Calories Consumed", "Calories Remaining"],
    datasets: [
      {
        data: [caloriesConsumed, caloriesRemaining],
        backgroundColor: ["#4CAF50", "#E0E0E0"],
      },
    ],
  };

  return (
    <div className="progress-tracker">
      {loading ? (
        <div>Loading...</div>
      ) : !hasCompleteProfile ? (
        <div>
          <p>Please update your profile to see your progress data.</p>
        </div>
      ) : (
        <div>
          <div className="weight-info">
            <p>WEIGHT: {profile.weight} kg</p>
            <p>GOAL: {profile.targetWeight} kg</p>
            <p>
              TO GO: {Math.max(profile.weight - profile.targetWeight, 0)} kg
            </p>
          </div>
          <Doughnut data={data} />
          {/* <div className="calorie-info">
            <p>Daily Caloric Need: {dailyCalories || 0} kcal</p>
            <p>Calories Consumed: {caloriesConsumed} kcal</p>
            <p>Calories Remaining: {caloriesRemaining} kcal</p>
            {profile.dietPlan && profile.dietPlan !== "maintenance" && (
              <p className="plan-note">*Adjusted for {profile.dietPlan} plan</p>
            )}
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
