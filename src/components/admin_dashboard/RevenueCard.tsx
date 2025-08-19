// src/components/RevenueCard.tsx
import React, { useState, useRef, useEffect } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./calendarStyles.css"

interface DateRangeState {
  startDate: Date;
  endDate: Date;
  key: string;
}

const RevenueCard: React.FC = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState<DateRangeState[]>([
    {
      startDate: new Date(2025, 3, 19), // Apr 19, 2025
      endDate: new Date(2025, 4, 16), // May 16, 2025
      key: "selection",
    },
  ]);

  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-lg font-medium text-gray-600 mb-1">
            Your total revenue
          </h2>
          <div className="text-5xl font-bold text-gray-900">
            $90,239.00
          </div>
        </div>
        
        {/* Date Range Picker Button */}
        <div className="relative">
          <button
            onClick={() => setShowPicker((v) => !v)}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm shadow bg-gray-50 flex items-center gap-2"
          >
            {`${format(range[0].startDate, "MMM dd")} – ${format(
              range[0].endDate,
              "MMM dd, yyyy"
            )}`}
            <span>▾</span>
          </button>
          
          {/* Date Range Picker */}
          {showPicker && (
            <div
              ref={pickerRef}
              className="absolute left-1 -top-[0] mt-2 z-[888] bg-white rounded-2xl shadow-2xl border border-gray-200 p-2"
              style={{
                width: "500px",
                transform: "scale(0.85)",
                transformOrigin: "top right",
              }}
            >
              <DateRange
                editableDateInputs
                onChange={(item: RangeKeyDict) =>
                  setRange([item.selection as DateRangeState])
                }
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={2}
                direction="horizontal"
                showMonthAndYearPickers={false}
                rangeColors={["#3B82F6"]}
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPicker(false)}
                  className="mt-2 bg-black text-white px-4 py-2 rounded-md"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
