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
        <div className="w-3 h-3 bg-[#ff80d3] rounded-sm"></div>
        <span>Paid Users</span>
      </div>
      {/* Active Users */}
      <div className="flex items-center gap-1">
        <div className="w-3 h-3 border-2 border-[#009dff]"></div>
        <span>Active Users</span>
      </div>
    </div>
  );
};

const UserGrowthChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Active User Growth
          </h2>
          <div className="bg-green-50 text-green-700 font-semibold text-sm px-3 py-1 border border-green-200 rounded-full flex items-center gap-1">
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
      <div className="flex gap-3 mb-6">
        {[
          { month: "Mar", week: "Week 1" },
          { month: "Mar", week: "Week 2" },
          { month: "Mar", week: "Week 3" },
          { month: "Mar", week: "Week 4" },
        ].map((item, index) => (
          <div
            key={index}
            className={`w-16 h-14 text-xs flex flex-col items-center justify-center rounded-xl ${
              index === 1 ? "bg-pink-400 text-white" : "bg-gray-100 text-gray-700"
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
  );
};

export default UserGrowthChart;
