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
    <div className="flex flex-col gap-3 w-full max-w-[900px]">
      {/* Top Two Cards */}
      <div className="flex gap-6">
        {/* Conversion Rate */}
        <div className="bg-[#F5F5F5] rounded-xl shadow flex flex-col items-center justify-center w-[220px] h-[140px] ml-2">
          <h1 className="text-[44px] font-bold text-black leading-none">
            59% <span className="text-green-500">▲</span>
          </h1>
          <p className="text-[12px] font-poppins text-[#727272] mt-1">
            Conversion Rate
          </p>
        </div>

        {/* Average Time */}
        <div className="bg-[#F5F5F5] rounded-xl shadow flex flex-col items-center justify-center w-[270px] h-[140px] ml-2">
          <h1 className="text-[42px] font-bold text-black leading-none">
            3hr 42m
          </h1>
          <p className="text-[12px] text-[#727272] font-poppins mt-1">
            Average Time Spent
          </p>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-[#F5F5F5] rounded-xl shadow p-4 w-[520px] h-[262px] mt-2 ml-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[20px] font-semibold font-supply text-black ml-4">
            Revenue
          </div>
          <div className="text-[18px] px-2 py-[2px] rounded-full bg-gray-100 border border-black font-semibold flex items-center">
            4% ▲
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* Donut Chart */}
          <div className="relative w-[215px] h-[180px] ml-4">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[20px] font-bold text-gray-800 font-supply mr-10">
                $90.2K
              </span>
              <span className="text-[15px] text-gray-500 mr-10">
                Total Amount
              </span>
            </div>
          </div>

          {/* Labels */}
          <div className="grid grid-cols-1 gap-[4px] text-[14px]">
            {[
              ["#EC4899", "Pro", "$17M"],
              ["#3B82F6", "Team", "$4M"],
              ["#34D399", "Individual", "$3.7M"],
              ["#FBBF24", "Free", "$0M"],
              ["#A78BFA", "Other", "$2M"],
            ].map(([color, label, amount], idx) => (
              <div
                key={idx}
                className="flex items-center justify-between w-[130px]"
              >
                <div className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color as string }}
                  ></span>
                  <span>{label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">•</span>
                  <span>{amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
