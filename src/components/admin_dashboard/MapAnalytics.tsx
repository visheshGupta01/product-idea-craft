import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.heat";

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

const HeatmapLayer: React.FC<{ points: any[] }> = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const heatData = points.map((p) => [
      p.lat,
      p.lon,
      (p.percentage ?? 50) / 100,
    ]);

    const heatLayer = (L as any)
      .heatLayer(heatData, {
        radius: 20,
        blur: 15,
        maxZoom: 5,
      })
      .addTo(map);

    const updateRadius = () => {
      const zoom = map.getZoom();
      heatLayer.setOptions({
        radius: Math.max(10, zoom * 2),
      });
    };

    map.on("zoomend", updateRadius);
    updateRadius();

    return () => {
      map.removeLayer(heatLayer);
      map.off("zoomend", updateRadius);
    };
  }, [map, points]);

  return null;
};

const HeatmapLegend: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const legend = L.control({ position: "bottomright" });

    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "info legend");
      div.innerHTML = `
        <div style="padding:8px; background:white; border-radius:8px; box-shadow:0 0 6px rgba(0,0,0,0.2);">
          <h4 style="margin:0 0 5px; font-size:14px;">Intensity</h4>
          <div style="width:120px; height:12px; background:linear-gradient(to right, blue, lime, yellow, red); margin-bottom:4px;"></div>
          <div style="display:flex; justify-content:space-between; font-size:12px;">
            <span>Low</span><span>High</span>
          </div>
        </div>
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

const MapAnalytics: React.FC<MapAnalyticsProps> = ({
  countryPercentages = [
    { country: "India", user_count: 200, percentage: 50 },
    { country: "USA", user_count: 200, percentage: 50 },
  ],
  countryGeoData = [
    { country: "India", lat: 20.5937, lon: 78.9629, percentage: 90 },
    { country: "USA", lat: 37.0902, lon: -95.7129, percentage: 70 },
    { country: "Brazil", lat: -14.235, lon: -51.9253, percentage: 40 },
    { country: "Germany", lat: 51.1657, lon: 10.4515, percentage: 60 },
  ],
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 relative flex-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 text-lg font-supply">
          Users by Countries
        </h3>
        {/* <div className="flex items-center justify-center w-8 h-8 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100 shadow-sm">
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
        </div> */}
      </div>

{/* Map + Legend side by side */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        {/* Heatmap Map - Temporarily disabled due to build issues */}
        <div className="flex-1 flex justify-center items-center h-56">
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Map temporarily unavailable</p>
          </div>
        </div>

        {/* Legend (raw list of countries + percentages) */}
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
