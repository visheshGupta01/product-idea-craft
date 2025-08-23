import React from "react";

interface MapAnalyticsProps {
  countryPercentages?: Array<{
    country: string;
    user_count: number;
    percentage: number;
  }>;
  countryGeoData?: Array<{
    country: string;
    lat: number;
    lon: number;
    percentage?: number;
  }>;
}

const MapAnalytics: React.FC<MapAnalyticsProps> = ({
  countryPercentages = [
    { country: "India", user_count: 200, percentage: 50 },
    { country: "USA", user_count: 200, percentage: 50 },
  ],
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 relative flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 text-lg font-supply">
          Users by Countries
        </h3>
      </div>

      {/* Map Placeholder + Legend */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        {/* Map Placeholder */}
        <div className="flex-1 flex justify-center items-center h-56 bg-gray-200 rounded-xl">
          <p className="text-gray-500">Map visualization coming soon...</p>
        </div>

        {/* Legend */}
        <div className="ml-6 border font-poppins border-gray-300 rounded-lg p-4 text-sm text-gray-800 bg-white shadow-sm">
          {countryPercentages.slice(0, 4).map((country) => (
            <div key={country.country}>
              {country.percentage}% {country.country}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapAnalytics;