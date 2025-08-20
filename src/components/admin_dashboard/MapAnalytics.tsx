import React from "react";

const MapAnalytics: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 relative flex-1">
      <div className="flex justify-between items-center mb-6">
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
            <path d="M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0-2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </div>
      </div>

      {/* World Map with Activity Indicators */}
      <div className="relative flex justify-center items-center h-48 bg-gray-50 rounded-lg overflow-hidden">
        {/* Simplified World Map SVG */}
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* World map outlines - simplified */}
          <g fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1">
            {/* North America */}
            <path d="M150 80 L180 75 L220 85 L250 90 L280 95 L300 110 L290 140 L270 160 L240 170 L200 165 L170 150 L150 120 Z" />
            {/* United States */}
            <path d="M160 120 L280 125 L290 140 L270 160 L240 170 L200 165 L170 150 Z" />
            {/* Europe */}
            <path d="M380 90 L420 85 L440 95 L430 120 L400 125 L380 115 Z" />
            {/* Asia */}
            <path d="M450 80 L550 75 L580 90 L570 130 L520 140 L480 125 L450 100 Z" />
            {/* Africa */}
            <path d="M350 140 L400 135 L420 180 L400 220 L370 225 L350 200 Z" />
            {/* South America */}
            <path d="M220 200 L250 195 L260 240 L240 280 L220 275 L210 240 Z" />
            {/* Australia */}
            <path d="M520 220 L560 218 L565 235 L550 240 L520 238 Z" />
          </g>
          
          {/* Activity indicators - colored dots */}
          {/* USA - Red dot */}
          <circle cx="240" cy="140" r="8" fill="#ef4444" opacity="0.8" />
          {/* California area - Green dot */}
          <circle cx="180" cy="150" r="6" fill="#22c55e" opacity="0.8" />
          {/* Texas area - Green dot */}
          <circle cx="220" cy="165" r="5" fill="#22c55e" opacity="0.8" />
          {/* Europe - Blue dot */}
          <circle cx="410" cy="105" r="4" fill="#3b82f6" opacity="0.6" />
          {/* Asia - Blue dot */}
          <circle cx="520" cy="110" r="4" fill="#3b82f6" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};

export default MapAnalytics;
