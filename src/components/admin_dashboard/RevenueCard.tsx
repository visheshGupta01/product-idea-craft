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
    <div className="rounded-xl p-6 w-full max-w-[900px] font-poppins text-[#232323] ml-14 flex justify-between items-start">
      {/* Left Section */}
      <div>
        <p className="text-[42px] font-semibold font-poppins leading-none">
          Your total revenue
        </p>
        <h1 className="text-[52px] font-regular font-supply mt-0 tracking-wide text-[#000000]">
          $90,239.00
        </h1>
      </div>

      {/* Right Section */}
      <div className="relative">
        <button
          onClick={() => setShowPicker((v) => !v)}
          className="px-3 py-2 rounded-md border border-gray-300 text-sm shadow bg-white flex items-center gap-2"
        >
          {`${format(range[0].startDate, "MMM dd")} – ${format(
            range[0].endDate,
            "MMM dd, yyyy"
          )}`}
          <span>▾</span>
        </button>

        {showPicker && (
          <div
            ref={pickerRef}
            className="absolute left-1 -top-[0] mt-2 z-[888] bg-white rounded-2xl shadow-2xl border border-gray-200 p-2"
            style={{
              width: "500px", // reduced overall width
              transform: "scale(0.85)", // shrink height + width proportionally
              transformOrigin: "top right", // keep aligned to button
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
  );
};

export default RevenueCard;
