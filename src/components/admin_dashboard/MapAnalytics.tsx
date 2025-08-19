// src/components/AnalyticsSection.tsx
import React from "react";

const AnalyticsSection: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 relative flex-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 text-lg">
          Users by Countries
        </h3>
        {/* Expand Icon */}
        <div className="flex items-center justify-center w-8 h-8 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-gray-600"
          >
            <path d="M7 14s-3-3-3-7.5C4 3.8 5.8 2 8 2s4 1.8 4 4.5c0 4.5-3 7.5-3 7.5h-2zm1-9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
          </svg>
        </div>
      </div>

      {/* Map */}
      <div className="flex justify-center items-center mb-4">
        <img
          src="/heatmap.png"
          alt="US Heatmap"
          className="w-full h-48 object-contain"
        />
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 right-6 border border-gray-300 rounded-lg p-3 text-sm font-medium text-gray-700 bg-white shadow-sm">
        <div>50% Washington</div>
        <div>30% Georgia</div>
        <div>12% Iowa</div>
        <div>8% Kansas</div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
