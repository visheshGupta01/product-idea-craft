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
          "#EC4899", // Pink - Pro
          "#3B82F6", // Blue - Team
          "#34D399", // Green - Individual
          "#F97316", // Orange - Free
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
      {/* Top Row - Conversion Rate & Avg Time Spent */}
      <div className="grid grid-cols-2 gap-4">
        {/* Conversion Rate */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <p className="text-4xl font-bold text-gray-900 font-supply">59%</p>
            <span className="text-green-500 text-3xl font-supply">^</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Conversion Rate</p>
        </div>

        {/* Average Time Spent */}
        {/* Average Time Spent */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center">
          <p className="text-4xl font-bold text-gray-900 whitespace-nowrap font-supply">
            3hr 42m
          </p>
          <p className="text-gray-500 text-sm mt-2">Average Time Spent</p>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm col-span-2">
        {/* Header */}
        <div className="flex items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
          <div className="bg-gray-100 px-3 ml-3 py-1 rounded-full text-sm flex items-center border border-black gap-1">
            <span className="text-black font-poppins">4%</span>
            <span className="text-green-500">▲</span>
          </div>
        </div>

        {/* Donut + Legend */}
        <div className="flex items-center gap-8">
          {/* Donut */}
          <div className="relative w-36 h-36">
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
                <span className="text-black text-sm">Pro</span>
              </div>
              <span className="text-black text-xs">..........</span>

              <span className="font-semibold text-black text-sm">$17M</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-black text-sm">Team</span>
              </div>
              <span className="text-black text-xs">.........</span>

              <span className="font-semibold text-black text-sm">$4M</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-black text-sm">Individual</span>
              </div>
              <span className="text-black text-xs">...</span>

              <span className="font-semibold text-black text-sm">$3.7M</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-black text-sm">Free</span>
              </div>
              <span className="text-black text-xs">.........</span>

              <span className="font-semibold text-black text-sm">$0M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
