import React from "react";
import { TrendingUp, Clock, BarChart3 } from "lucide-react";
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

interface MetricsCardsProps {
  conversionRate?: number;
  userGrowthRate?: number;
  revenueData?: {
    total_revenue: number;
    pro_revenue: number;
    team_revenue: number;
  };
  droppingRate?: number;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ 
  conversionRate = 25.0,
  revenueData,
droppingRate = 8.0
}) => {
  console.log('MetricsCards props:', { conversionRate, revenueData, droppingRate });
  const totalRevenue = revenueData?.total_revenue || 90200;
  const proRevenue = revenueData?.pro_revenue || 45000;
  const teamRevenue = revenueData?.team_revenue ?? 25000;

  const data: ChartData<"doughnut"> = {
    labels: ["Pro", "Team"],
    datasets: [
      {
        label: "Revenue",
        data: [proRevenue, teamRevenue], // <-- raw values instead of percentages
        backgroundColor: [
          "#EC4899", // Pink - Pro
          "#3B82F6", // Blue - Team
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
            <p className="text-4xl font-bold text-gray-900 font-supply">
              {new Intl.NumberFormat(undefined, {
                maximumFractionDigits: 2,
              }).format(conversionRate)}
              %
            </p>
            <span className="text-green-500 text-3xl font-supply">^</span>
          </div>
          <p className="text-gray-500 text-sm mt-2">Conversion Rate</p>
        </div>

        {/* Average Time Spent */}
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center">
          <p className="text-4xl font-bold text-gray-900 whitespace-nowrap font-supply">
            {droppingRate}%
          </p>
          <p className="text-gray-500 text-sm mt-2">Dropping Rate</p>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm col-span-2">
        {/* Header */}
        <div className="flex items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900 font-supply">
            Revenue
          </h3>
          {/* <div className="bg-gray-100 px-3 ml-3 py-1 rounded-full text-sm flex items-center border border-black gap-1">
            <span className="text-black font-poppins">4%</span>
            <span className="text-green-500">▲</span>
          </div> */}
        </div>

        {/* Donut + Legend */}
        <div className="flex items-center gap-5">
          {/* Donut */}
          <div className="relative w-36 h-36">
            <Doughnut data={data} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-lg font-semibold text-gray-900 font-supply">
                ${(totalRevenue / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-gray-500 font-poppins">
                Total Amount
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                <span className="text-black text-sm font-poppins">Pro</span>
              </div>
              <span className="text-black text-xs">..........</span>

              <span className="font-semibold text-black text-sm">
                ${(proRevenue / 1000000).toFixed(1)}M
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-black text-sm font-poppins">Team</span>
              </div>
              <span className="text-black text-xs">.........</span>

              <span className="font-semibold text-black text-sm">
                ${(teamRevenue / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCards;
