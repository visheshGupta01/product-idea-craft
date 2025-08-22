import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  TooltipProps,
} from "recharts";
import {
  ValueType,
  NameType,
} from "recharts/types/component/DefaultTooltipContent";

// Matches the YearlyStats part of your Go struct
interface YearlyStat {
  year: number;
  months: Array<{
    month: string;
    total_verified: number;
    total_verified_pro: number;
  }>;
}

interface UserGrowthChartProps {
  data?: YearlyStat[];
}

const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md px-3 py-2 rounded text-xs border">
        <p className="font-medium text-gray-700">{label}</p>
        <p style={{ color: "#ff4db8" }}>
          Paid Users: <span className="font-semibold">{payload[0].value}</span>
        </p>
        <p style={{ color: "#009dff" }}>
          Active Users:{" "}
          <span className="font-semibold">{payload[1].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const renderLegend = () => {
  return (
    <div className="flex justify-center items-center gap-6 mt-2 text-xs font-poppins">
      <div className="flex items-center gap-1 mr-8">
        <div className="w-5 h-5 bg-[#ff4db8] border border-black"></div>
        <span className="text-black font-medium">Paid Users</span>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 border-2 border-[#009dff]"></div>
        <span className="text-black font-medium">Active Users</span>
      </div>
    </div>
  );
};

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data: apiData }) => {
  // Default to the latest year from the data, or the current year.
  const latestYear = apiData && apiData.length > 0 ? apiData[apiData.length - 1].year : new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(latestYear);

  const chartData = useMemo(() => {
    if (!apiData) {
      return [];
    }

    const yearData = apiData.find(y => y.year === selectedYear);
    if (!yearData) {
      return [];
    }

    return yearData.months.map(m => ({
      date: m.month,
      paid: m.total_verified_pro,
      active: m.total_verified,
    }));
  }, [apiData, selectedYear]);

  const availableYears = apiData ? apiData.map(y => y.year) : [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900 font-supply">
              Active User Growth
            </h2>
            <div className="bg-green-50 text-sm px-3 font-poppins py-1 border text-black border-black rounded-full flex items-center gap-1">
              23% <span className="text-green-600">▲</span>
            </div>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            {availableYears.map(year => (
              <span 
                key={year}
                className={`cursor-pointer ${selectedYear === year ? 'text-pink-500 font-semibold' : 'text-[#1A1A16]'}`}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </span>
            ))}
          </div>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff4db8" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#ffc3ea" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#1E1E1E" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#1E1E1E" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="paid"
              stroke="#ff4db8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPaid)"
              name="Paid Users"
            />
            <Area
              type="monotone"
              dataKey="active"
              stroke="#009dff"
              strokeDasharray="6 6"
              strokeWidth={3}
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
    </div>
  );
};
  

export default UserGrowthChart;
