import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { getProfile } from "../../actions/Profile";
import "./ProgressTracker.css";
import config from '../../config';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressTracker = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const auth = useSelector((state) => state.auth);
  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // New function to fetch today's meals
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
        // Calculate total calories from all meals
        const totalCalories = response.data.meals.reduce((total, { meal, nutrition }) => {
          if (nutrition !== "No nutrition data found for this meal.") {
            return total + (nutrition[0].energy * meal.portion);
          }
          return total;
        }, 0);

        setCaloriesConsumed(Math.round(totalCalories));
      }
    } catch (err) {
      console.error("Error fetching meals:", err);
      setCaloriesConsumed(0);
    }
  };

  useEffect(() => {
    if (auth.user?._id) {
      fetchTodaysMeals();
    }
  }, [auth.user]);

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
          <Doughnut data={data} />
          <div className="caloric-summary">
            <h3>Caloric Summary</h3>
            <p>Need: {dailyCalories} Cal</p>
            <p>Consumed: {caloriesConsumed} Cal</p>
            <p>Remaining: {caloriesRemaining} Cal</p>
            
          </div>
          <div className="weight-info">
            <p data-label="WEIGHT:">
              <span>{profile.weight} kg</span>
            </p>
            <p data-label="GOAL:">
              <span>{profile.targetWeight} kg</span>
            </p>
            <p data-label="TO GO:">
              <span>
                {Math.max(profile.weight - profile.targetWeight, 0)} kg
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;

//<p>Adjusted for {profile.dietPlan} plan</p>