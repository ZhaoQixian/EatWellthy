import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../actions/Profile";

// Register the required elements with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressTracker = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);

  const [caloriesConsumed, setCaloriesConsumed] = useState(1350); // Placeholder value
  const [caloriesRemaining, setCaloriesRemaining] = useState(450); // Placeholder value

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  // Check for missing profile data
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
            {/* <p>↓ {profile.weeklyWeightChange || 0} kg in the previous week</p> */}
          </div>
          <Doughnut data={data} />
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
