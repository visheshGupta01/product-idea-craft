import React, { useState } from "react";
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

interface UserGrowthChartProps {
  data?: Array<{
    year: number;
    months: Array<{
      month: string;
      total_verified: number;
      total_verified_pro: number;
      days: Array<{
        date: string;
        total_verified: number;
        total_verified_pro: number;
      }>;
      weeks: Array<{
        week_number: number;
        days: Array<{
          date: string;
          total_verified: number;
          total_verified_pro: number;
        }>;
      }>;
    }>;
  }>;
}

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
      {/* Paid Users */}
      <div className="flex items-center gap-1 mr-8">
        <div className="w-5 h-5 bg-[#ff4db8] border border-black"></div>
        <span className="text-black font-medium">Paid Users</span>
      </div>
      {/* Active Users */}
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 border-2 border-[#009dff]"></div>
        <span className="text-black font-medium">Active Users</span>
      </div>
    </div>
  );
};

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ data: apiData }) => {
  // Initialize with actual data from API if available
  let currentYear = 2025;
  let currentMonth = "Aug";

  if (apiData && apiData.length > 0) {
    const lastYearData = apiData[apiData.length - 1]; // last element (2025)
    currentYear = lastYearData.year;

    if (lastYearData.months && lastYearData.months.length > 0) {
      const lastMonthData = lastYearData.months[lastYearData.months.length - 1];
      currentMonth = lastMonthData.month;
    }
  }

  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  console.log("UserGrowthChart props:", { apiData });
  console.log("Selected Year and Month:", { selectedYear, selectedMonth });
  // Transform API data to chart format
  const getChartData = () => {
    if (!apiData || apiData.length === 0) {
      // Fallback data
      return [
        { date: "Jan 1", paid: 20, active: 45 },
        { date: "Jan 8", paid: 35, active: 60 },
        { date: "Jan 15", paid: 45, active: 70 },
        { date: "Jan 22", paid: 55, active: 85 },
        { date: "Jan 29", paid: 70, active: 100 },
        { date: "Feb 5", paid: 65, active: 95 },
        { date: "Feb 12", paid: 80, active: 110 },
        { date: "Feb 19", paid: 90, active: 125 },
        { date: "Feb 26", paid: 85, active: 120 },
        { date: "Mar 5", paid: 100, active: 140 },
        { date: "Mar 12", paid: 110, active: 150 },
        { date: "Mar 19", paid: 120, active: 165 },
      ];
    }

    const yearData = apiData.find((y) => y.year === selectedYear);
    if (!yearData) return [];

    const monthData = yearData.months.find((m) => m.month === selectedMonth);
    if (!monthData) return [];

    return monthData.days.map((day) => ({
      date: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      paid: day.total_verified_pro,
      active: day.total_verified,
    }));
  };

  const chartData = getChartData();
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
            <span className="text-pink-500 font-semibold">WEEK</span>
            <span className="text-[#1A1A16] font-semibold">MONTH</span>
            <span className="text-[#1A1A16] font-semibold">YEAR</span>
          </div>
        </div>

        {/* Week Selector */}
        <div className="flex gap-1 mb-6">
          {apiData &&
          apiData.length > 0 &&
          apiData
            .find((y) => y.year === selectedYear)
            ?.months.find((m) => m.month === selectedMonth)?.weeks
            ? apiData
                .find((y) => y.year === selectedYear)
                ?.months.find((m) => m.month === selectedMonth)
                ?.weeks.slice(0, 4)
                .map((week, index) => (
                  <div
                    key={index}
                    className={`w-16 h-14 text-xs flex flex-col items-center justify-center text-black rounded-xl ${
                      index === 1 ? "bg-[#ff94da]" : "bg-[#d8cee8]"
                    }`}
                  >
                    <div className="font-medium text-sm">{selectedMonth}</div>
                    <div className="font-medium text-xs mt-1">
                      Week {week.week_number}
                    </div>
                  </div>
                ))
            : [
                { month: selectedMonth, week: "Week 1" },
                { month: selectedMonth, week: "Week 2" },
                { month: selectedMonth, week: "Week 3" },
                { month: selectedMonth, week: "Week 4" },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`w-16 h-14 text-xs flex flex-col items-center justify-center text-black rounded-xl ${
                    index === 1 ? "bg-[#ff94da]" : "bg-[#d8cee8]"
                  }`}
                >
                  <div className="font-medium text-sm">{item.month}</div>
                  <div className="font-medium text-xs mt-1">{item.week}</div>
                </div>
              ))}
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
