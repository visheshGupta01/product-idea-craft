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
    labels: ["Pro", "Team", "Individual", "Free"],
    datasets: [
      {
        label: "Revenue",
        data: [45, 25, 20, 10],
        backgroundColor: [
          "#EC4899", // Pink for Pro
          "#3B82F6", // Blue for Team  
          "#34D399", // Green for Individual
          "#F97316", // Orange for Free
        ],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="space-y-4">
      {/* Top Row - Conversion Rate and Average Time Spent */}
      <div className="grid grid-cols-2 gap-4">
        {/* Conversion Rate Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Conversion Rate</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-bold text-gray-900">59%</p>
            <div className="text-green-500 text-lg mb-1">▲</div>
          </div>
        </div>

        {/* Average Time Spent Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <p className="text-gray-500 text-sm mb-2">Average Time Spent</p>
          <p className="text-4xl font-bold text-gray-900">3hr 42m</p>
        </div>
      </div>

      {/* Revenue Card with Donut Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <span className="text-gray-700">4%</span>
            <span className="text-green-500">▲</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          {/* Donut Chart */}
          <div className="relative w-32 h-32">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-lg font-bold text-gray-900">$90.2K</div>
              <div className="text-xs text-gray-500">Total Amount</div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-gray-700 text-sm">Pro</span>
                <span className="text-gray-300 text-xs">............</span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">$17M</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 text-sm">Team</span>
                <span className="text-gray-300 text-xs">............</span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">$4M</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-700 text-sm">Individual</span>
                <span className="text-gray-300 text-xs">......</span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">$3.7M</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 text-sm">Free</span>
                <span className="text-gray-300 text-xs">.............</span>
              </div>
              <span className="font-semibold text-gray-500 text-sm">$0M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
