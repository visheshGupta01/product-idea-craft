
// Commit ID - 847c25128e3293a6d335e8b3a1eacd9363043314

import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  CircleMarker,
  Popup,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
// side-effect: registers L.heatLayer
import "leaflet.heat";

// Import marker images (works with Vite / CRA)
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

interface CountryPercentage {
  country: string;
  user_count: number;
  percentage: number;
}

interface CountryGeo {
  country: string;
  lat: number;
  lon: number;
  percentage?: number;
}

interface MapAnalyticsProps {
  countryPercentages?: CountryPercentage[];
  countryGeoData?: CountryGeo[];
}

/** Fix Leaflet's default icon URLs for bundlers (Vite/CRA). Safe to call once. */
const fixLeafletIcon = () => {
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2xUrl,
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
  });
};

/** Heatmap layer component that uses react-leaflet's useMap hook. */
const HeatmapInner: React.FC<{
  points: { lat: number; lon: number; percentage?: number }[];
}> = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points || points.length === 0) return;

    const heatData = points.map((p) => [
      p.lat,
      p.lon,
      Math.min(1, Math.max(0.05, (p.percentage ?? 50) / 100)),
    ]);

    const heatLayer = (L as any)
      .heatLayer(heatData, {
        radius: 25,
        blur: 20,
        maxZoom: 7,
      })
      .addTo(map);

    const updateRadius = () => {
      const z = map.getZoom();
      try {
        heatLayer.setOptions({ radius: Math.max(8, z * 3) });
      } catch {
        /* ignore if not supported */
      }
    };

    map.on("zoomend", updateRadius);
    updateRadius();

    if (points.length > 1) {
      const latlngs = points.map((p) => [p.lat, p.lon] as [number, number]);
      try {
        map.fitBounds(latlngs as any, { padding: [40, 40], maxZoom: 4 });
      } catch {
        /* ignore fitBounds errors */
      }
    } else {
      const p = points[0];
      try {
        map.setView([p.lat, p.lon], 3);
      } catch {
        /* ignore */
      }
    }

    return () => {
      try {
        map.off("zoomend", updateRadius);
        map.removeLayer(heatLayer);
      } catch {
        /* ignore cleanup errors */
      }
    };
  }, [map, points]);

  return null;
};

const MapAnalytics: React.FC<MapAnalyticsProps> = ({
  countryPercentages = [],
  countryGeoData = [],
}) => {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  // Map country -> percentage for lookup (case-sensitive; normalize if needed)
  const percentageMap = useMemo(() => {
    const m = new Map<string, number>();
    countryPercentages.forEach((c) => {
      if (c && typeof c.country === "string") m.set(c.country, c.percentage);
    });
    return m;
  }, [countryPercentages]);

  // Enrich geo data with percentage (non-mutative)
  const enrichedGeoData = useMemo(() => {
    return countryGeoData.map((g) => ({
      ...g,
      percentage: g.percentage ?? percentageMap.get(g.country),
    }));
  }, [countryGeoData, percentageMap]);

  // Filter out invalid or unknown points so they don't break fitBounds / heatmap
  const validGeoPoints = useMemo(() => {
    return enrichedGeoData.filter(
      (p) =>
        p &&
        typeof p.country === "string" &&
        p.country.trim() !== "" &&
        p.country.toLowerCase() !== "unknown" &&
        p.lat !== 0 &&
        p.lon !== 0 &&
        !Number.isNaN(p.lat) &&
        !Number.isNaN(p.lon)
    );
  }, [enrichedGeoData]);

  const markerPoints = validGeoPoints.slice(0, 200);

  // sensible center (average of valid points) or fallback
  const center = useMemo<LatLngExpression>(() => {
    if (!validGeoPoints || validGeoPoints.length === 0) return [20, 0];
    const lats = validGeoPoints.map((p) => p.lat);
    const lons = validGeoPoints.map((p) => p.lon);
    const avgLat = lats.reduce((a, b) => a + b, 0) / lats.length;
    const avgLon = lons.reduce((a, b) => a + b, 0) / lons.length;
    return [avgLat, avgLon];
  }, [validGeoPoints]);

  const fillColorFromPercentage = (pct?: number) => {
    const p = Math.min(100, Math.max(0, pct ?? 20));
    const r = Math.round((255 * p) / 100);
    const g = Math.round((255 * (100 - p)) / 100);
    return `rgb(${r},${g},50)`;
  };

  // unknown entry for legend (if any)
  const unknownEntry = countryPercentages.find(
    (c) => c.country.toLowerCase() === "unknown"
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 relative flex-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900 text-lg font-supply">
          Users by Countries
        </h3>
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
        {/* Leaflet Map */}
        <div className="flex-1 h-56 rounded-lg overflow-hidden">
          {/* @ts-ignore */}
          <MapContainer
            // @ts-ignore
            center={center}
            zoom={2}
            minZoom={2}
            style={{ width: "100%", height: "100%" }}
            scrollWheelZoom
          >
            {/* @ts-ignore */}
            <TileLayer
              // @ts-ignore
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Heatmap uses only valid points */}
            <HeatmapInner
              points={validGeoPoints.map((p) => ({
                lat: p.lat,
                lon: p.lon,
                percentage: p.percentage,
              }))}
            />

            {/* Circle markers to show exact points and popup info */}
            {markerPoints.map((p) => {
              const weight = Math.min(
                25,
                Math.max(6, ((p.percentage ?? 20) / 100) * 20)
              );
              return (
                // @ts-ignore
                <CircleMarker
                  key={`${p.country}-${p.lat}-${p.lon}`}
                  // @ts-ignore
                  center={[p.lat, p.lon]}
                  // @ts-ignore
                  radius={weight}
                  stroke={false}
                  fillOpacity={0.9}
                  fillColor={fillColorFromPercentage(p.percentage)}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{p.country}</strong>
                      <div>Percentage: {p.percentage.toFixed(2) ?? "N/A"}%</div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* Legend / Raw list */}
        <div className="ml-6 border font-poppins border-gray-300 rounded-lg p-4 text-sm text-gray-800 bg-white shadow-sm w-52">
          <div className="font-medium mb-2">Top Countries</div>

          {countryPercentages.map((item) => (
            <div
              key={item.country}
              className="flex justify-between py-1 border-b last:border-b-0"
            >
              <span className="truncate">{item.country}</span>
              <div className="text-right">
                <div className="font-semibold">
                  {item.percentage.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500">
                  {item.user_count} users
                </div>
              </div>
            </div>
          ))}

          {/* Unknown user info */}
          {unknownEntry && (
            <div className="mt-3 p-2 border-t pt-2 text-xs text-gray-600">
              <div className="font-medium">Unmapped / Unknown</div>
              <div>{unknownEntry.user_count} users</div>
              <div>{unknownEntry.percentage.toFixed(2)}%</div>
              <div className="mt-1 text-xs text-gray-500">
                These users don't have valid geo coordinates.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapAnalytics;
