import React from "react";

const MapAnalytics: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 relative flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 text-lg font-supply">
          Users by Countries
        </h3>
        {/* Expand Icon */}
        <div className="flex items-center justify-center w-8 h-8 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100 shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            className="text-gray-600"
          >
            <path d="M10 3h3.5a.5.5 0 0 1 .5.5V7a.5.5 0 0 1-1 0V4.707l-5.146 5.147a.5.5 0 0 1-.708-.708L12.293 4H10a.5.5 0 0 1 0-1z" />
            <path d="M13 13H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h6a.5.5 0 0 1 0 1H3v9h10V7a.5.5 0 0 1 1 0v5a1 1 0 0 1-1 1z" />
          </svg>
        </div>
      </div>

      {/* Map + Legend side by side */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        {/* US Map with Heat Spots */}
        <div className="flex-1 flex justify-center items-center h-56">
          <svg viewBox="0 0 600 300" className="w-full h-full">
            {/* Alaska */}
            <path
              d="M60 40 L100 35 L120 45 L115 70 L90 80 L65 70 Z"
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth="1"
            />
            {/* Mainland USA */}
            <path
              d="M180 100 L400 100 L420 120 L410 160 L370 180 L300 190 L230 170 L190 140 Z"
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth="1"
            />

            {/* Heat Spots */}
            <defs>
              <radialGradient id="heat-red">
                <stop offset="0%" stopColor="red" stopOpacity="1" />
                <stop offset="100%" stopColor="red" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heat-green">
                <stop offset="0%" stopColor="lime" stopOpacity="1" />
                <stop offset="100%" stopColor="lime" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heat-blue">
                <stop offset="0%" stopColor="blue" stopOpacity="0.6" />
                <stop offset="100%" stopColor="blue" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="280" cy="160" r="30" fill="url(#heat-red)" />
            <circle cx="240" cy="180" r="25" fill="url(#heat-green)" />
            <circle cx="350" cy="140" r="20" fill="url(#heat-green)" />
            <circle cx="200" cy="120" r="18" fill="url(#heat-blue)" />
            <circle cx="400" cy="150" r="18" fill="url(#heat-blue)" />

            {/* Alaska Activity */}
            <circle cx="90" cy="55" r="22" fill="url(#heat-green)" />
            <circle cx="75" cy="65" r="18" fill="url(#heat-blue)" />
          </svg>
        </div>

        {/* Legend */}
        <div className="ml-6 border font-poppins border-gray-300 rounded-lg p-4 text-sm text-gray-800 bg-white shadow-sm">
          <div>50% Washington</div>
          <div>30% Georgia</div>
          <div>12% Iowa</div>
          <div>8% Kansas</div>
        </div>
      </div>
    </div>
  );
};

export default MapAnalytics;
