// src/components/AnalyticsSection.tsx
import React from "react";

const AnalyticsSection: React.FC = () => {
  return (
    <div
      className="bg-[#F5F5F5] rounded-xl shadow-sm p-6 relative mt-20"
      style={{ width: "600px", height: "327px" }}
    >
      <h3 className="font-bold text-black text-[20px] text-base ml-4 mt-4 font-supply leading-6">
        Users by Countries
      </h3>

      {/* Expand Icon */}
      <div className="absolute top-6 right-6 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8z" />
        </svg>
      </div>

      {/* Map */}
      <div className="mt-6 flex justify-center items-center">
        <img
          src="/heatmap.png"
          alt="US Heatmap"
          style={{ width: "100%", height: "220px", objectFit: "contain" }}
        />
      </div>

      {/* Legend */}
      <div
        className="absolute bottom-6 right-6 border border-[#A5A5A5] rounded-lg p-3 text-sm font-medium text-black bg-white"
        style={{ lineHeight: "20px" }}
      >
        <div>50% Washington</div>
        <div>30% Georgia</div>
        <div>12% Iowa</div>
        <div>8% Kansas</div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
