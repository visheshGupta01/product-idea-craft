import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RevenueDonut: React.FC = () => {
  const data: ChartData<"doughnut"> = {
    labels: ["Pro", "Team", "Individual", "Free"],
    datasets: [
      {
        label: "Revenue Distribution",
        data: [45, 25, 20, 10],
        backgroundColor: [
          "#EC4899",
          "#3B82F6", 
          "#34D399",
          "#FBBF24",
        ],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "70%",
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${percentage}%`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-background rounded-xl shadow-sm p-6 w-full h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Revenue Distribution
        </h3>
        <div className="text-sm bg-muted px-3 py-1 rounded-full border">
          <span className="font-medium">$90.2K</span>
        </div>
      </div>
      
      <div className="h-[200px]">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueDonut;