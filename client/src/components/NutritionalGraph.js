import React, { useEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required elements with Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionalGraph = () => {
  const chartRef = useRef(null);

  const data = {
    labels: ["Carbohydrates", "Fat", "Protein"],
    datasets: [
      {
        data: [60, 20, 20],
        backgroundColor: ["#007bff", "#ff6347", "#28a745"],
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
    <div className="nutritional-graph">
      <Doughnut data={data} ref={chartRef} />
    </div>
  );
};

export default NutritionalGraph;
