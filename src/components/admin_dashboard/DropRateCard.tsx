// src/components/DropRateCard.tsx
import React from "react";
import { ChevronDown } from "lucide-react";

const DropRateCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 w-80">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-gray-900 text-lg">
          Dropping Rate
        </h2>
        <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-red-200 bg-red-50 font-semibold text-red-600">
          <span>8%</span>
          <ChevronDown size={16} className="text-red-500" />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 text-sm text-gray-700">
        <div>
          <span className="font-semibold mr-2">6%</span> Left at "Choose Template" step
        </div>
        <div>
          <span className="font-semibold mr-2">5%</span> Users dropped at pricing page
        </div>
        <div>
          <span className="font-semibold mr-2">3%</span> After hitting "Preview Website"
        </div>
        <div>
          <span className="font-semibold mr-2">1%</span> Before publishing
        </div>
        <div>
          <span className="font-semibold mr-2">0.2%</span> At "Connect Domain" step
        </div>
      </div>
    </div>
  );
};

export default DropRateCard;