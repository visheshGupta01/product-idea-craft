// src/components/DropRateCard.tsx
import React from "react";
import { ChevronDown } from "lucide-react";

const DropRateCard: React.FC = () => {
  return (
    <div
      className="bg-[#F5F5F5] rounded-xl shadow-sm p-6 mt-20"
      style={{ width: "330px", height: "327px" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-black text-base font-supply leading-6 mb-4 ml-2 mt-4 text-[20px]">
          Dropping Rate
        </h2>

        <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-black bg-white mr-4 font-semibold text-black">
          <span>8%</span>
          <ChevronDown size={16} className="text-red-500" fill="red" />
        </div>
      </div>

      {/* Steps */}
      <div className="mt-6 space-y-3 text-base text-black font-medium">
        <div>
          <span className="font-normal mr-2">6%</span> Left at “Choose Template”
          step
        </div>
        <div>
          <span className="font-normal mr-2">5%</span> Users dropped at pricing
          page
        </div>
        <div>
          <span className="font-normal mr-2">3%</span> After hitting "Preview
          Website"
        </div>
        <div>
          <span className="font-normal mr-2">1%</span> Before publishing
        </div>
        <div>
          <span className="font-normal mr-2">0.2%</span> At “Connect Domain”
          step
        </div>
      </div>
    </div>
  );
};

export default DropRateCard;
