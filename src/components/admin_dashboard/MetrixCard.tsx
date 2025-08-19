// src/components/MetricsCards.tsx
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

const MetricsCards: React.FC = () => {
  const data: ChartData<"doughnut"> = {
    labels: ["Pro", "Team", "Individual", "Free", "Other"],
    datasets: [
      {
        label: "Revenue",
        data: [20, 18, 19, 17, 21],
        backgroundColor: [
          "#EC4899",
          "#3B82F6",
          "#34D399",
          "#FBBF24",
          "#A78BFA",
        ],
        borderWidth: 0,
        borderRadius: 10,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="space-y-4">
      {/* Conversion Rate Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Conversion Rate</p>
            <p className="text-4xl font-bold text-gray-900">59%</p>
          </div>
          <div className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <span className="text-green-600">▲</span>
          </div>
        </div>
      </div>

      {/* Average Time Spent Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600 text-sm font-medium mb-1">Average Time Spent</p>
            <p className="text-4xl font-bold text-gray-900">3hr 42m</p>
          </div>
        </div>
      </div>

      {/* Revenue Card with Donut Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-gray-900 font-semibold">Revenue</h3>
          <div className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            4% <span className="text-green-600">▲</span>
          </div>
        </div>
        
        <div className="relative h-32 mb-4">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-lg font-bold text-gray-900">$90.2K</div>
            <div className="text-xs text-gray-500">Total Amount</div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <span>Pro</span>
              <span className="text-gray-400">...........</span>
            </div>
            <span className="font-medium">$17M</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Team</span>
              <span className="text-gray-400">...........</span>
            </div>
            <span className="font-medium">$4M</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span>Individual</span>
              <span className="text-gray-400">.......</span>
            </div>
            <span className="font-medium">$3.7M</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span>Free</span>
              <span className="text-gray-400">.............</span>
            </div>
            <span className="font-medium">$0M</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
