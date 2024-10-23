import React, { useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required elements with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressTracker = () => {
  const chartRef = useRef(null);

  const data = {
    labels: ["Calories Consumed", "Calories Remaining"],
    datasets: [
      {
        data: [1350, 450],
        backgroundColor: ["#4CAF50", "#E0E0E0"],
      },
    ],
  };

  // Clean up the chart when the component is unmounted or re-rendered
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="progress-tracker">
      <div className="weight-info">
        <p>WEIGHT: 60kg</p>
        <p>GOAL: 55kg</p>
        <p>TO GO: 2.5kg</p>
        <p>↓ 0.2kg in the previous week</p>
      </div>
      <Doughnut data={data} ref={chartRef} />
    </div>
  );
};

export default ProgressTracker;
