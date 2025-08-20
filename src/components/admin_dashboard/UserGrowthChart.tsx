// src/components/UserGrowthChart.tsx
import React from "react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

interface DataPoint {
  date: string;
  paid: number;
  active: number;
}

const data: DataPoint[] = [
  { date: "09 Mar", paid: 2000, active: 3000 },
  { date: "10 Mar", paid: 2800, active: 3400 },
  { date: "11 Mar", paid: 1500, active: 2800 },
  { date: "12 Mar", paid: 2600, active: 3000 },
  { date: "13 Mar", paid: 1900, active: 3200 },
  { date: "14 Mar", paid: 2400, active: 3100 },
  { date: "15 Mar", paid: 3000, active: 3700 },
];

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md p-2 rounded text-xs">
        <p>{label}</p>
        <p style={{ color: "#ff80d3" }}>Paid Users: {payload[0].value}</p>
        <p style={{ color: "#009dff" }}>Active Users: {payload[1].value}</p>
      </div>
    );
  }
  return null;
};

const renderLegend = () => {
  return (
    <div className="flex justify-center items-center gap-6 mt-2 text-xs">
      {/* Paid Users */}
      <div className="flex items-center gap-1 mr-8">
        <div className="w-5 h-5 bg-[#ff80d3] border-black border"></div>
        <span className="text-black font-sm font-medium">Paid Users</span>
      </div>
      {/* Active Users */}
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 border-2 border-[#009dff]"></div>
        <span className="text-black font-medium">Active Users</span>
      </div>
    </div>
  );
};

const UserGrowthChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      {/* Layout with Week Selector and Metrics Cards aligned */}
      <div className="flex gap-6">
        {/* Left side - Header, Week Selector and Chart */}
        <div className="flex-1">
          {/* Header - contained within left card */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold font-supply text-gray-900">
                Active User Growth
              </h2>
              <div className="bg-green-50  text-sm px-3 py-1 border text-black border-black  rounded-full flex items-center gap-1">
                23% <span className="text-green-600">▲</span>
              </div>
            </div>
            <div className="flex gap-4 text-sm font-medium">
              <span className="text-pink-500 font-semibold">WEEK</span>
              <span className="text-gray-500">MONTH</span>
              <span className="text-gray-500">YEAR</span>
            </div>
          </div>
          {/* Week Selector */}
          <div className="flex gap-1 mb-6">
            {[
              { month: "Mar", week: "Week 1" },
              { month: "Mar", week: "Week 2" },
              { month: "Mar", week: "Week 3" },
              { month: "Mar", week: "Week 4" },
            ].map((item, index) => (
              <div
                key={index}
                className={`w-16 h-14 text-xs flex flex-col items-center justify-center text-black rounded-xl ${
                  index === 1 ? "bg-[#ff94da]" : "bg-[#d8cee8]"
                }`}
              >
                <div className="font-medium text-sm">
                  {item.month}
                </div>
                <div className="font-medium text-xs mt-1">
                  {item.week}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff80d3" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ffc3ea" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="paid"
                stroke="#ff80d3"
                fillOpacity={1}
                fill="url(#colorPaid)"
                name="Paid Users"
              />
              <Area
                type="monotone"
                dataKey="active"
                stroke="#009dff"
                strokeDasharray="5 5"
                fill="transparent"
                name="Active Users"
              />

              <Legend
                content={renderLegend}
                verticalAlign="bottom"
                align="center"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right side - Metrics Cards aligned with header filter */}
        <div className="w-96 space-y-4"> {/* Aligned with WEEK/MONTH/YEAR filter */}
          {/* Top Row - Conversion Rate and Average Time */}
          <div className="grid grid-cols-2 gap-4">
            {/* Conversion Rate Card */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-600 text-sm font-medium mb-2">Conversion Rate</p>
              <p className="text-3xl font-bold text-gray-900">59%</p>
              <div className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 mt-2">
                <span className="text-green-600">▲</span>
              </div>
            </div>

            {/* Average Time Spent Card */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-gray-600 text-sm font-medium mb-2">Average Time Spent</p>
              <p className="text-3xl font-bold text-gray-900">3hr 42m</p>
            </div>
          </div>

          {/* Revenue Chart Card */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900 font-semibold">Revenue</h3>
              <div className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                4% <span className="text-green-600">▲</span>
              </div>
            </div>
            
            <div className="relative h-32 mb-4">
              <Doughnut 
                data={{
                  labels: ["Pro", "Team", "Individual", "Free", "Other"],
                  datasets: [{
                    label: "Revenue",
                    data: [20, 18, 19, 17, 21],
                    backgroundColor: ["#EC4899", "#3B82F6", "#34D399", "#FBBF24", "#A78BFA"],
                    borderWidth: 0,
                    borderRadius: 10,
                  }],
                }} 
                options={{
                  cutout: "70%",
                  plugins: { legend: { display: false } },
                  maintainAspectRatio: false,
                }} 
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-lg font-bold text-gray-900">$90.2K</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span>Pro</span>
                </div>
                <span className="font-medium">$17M</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Team</span>
                </div>
                <span className="font-medium">$4M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthChart;