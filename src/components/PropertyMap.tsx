"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, Info } from "lucide-react";
import { MapLocation, RiskLevel } from "@/lib/types";
import { DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/constants";

// Import Leaflet CSS from CDN in App.tsx
interface PropertyMapProps {
  locations: MapLocation[];
  areaName?: string;
  areaInfo?: {
    aqi?: { value: number; text: string };
    floodRisk?: string;
    earthquakeRisk?: string;
  };
}

declare global {
  interface Window {
    L: any;
  }
}

const PropertyMap = ({ locations, areaName, areaInfo }: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (!window.L) {
        // Load CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.3/dist/leaflet.css";
        link.integrity = "sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=";
        link.crossOrigin = "";
        document.head.appendChild(link);

        // Load JS
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js";
          script.integrity =
            "sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=";
          script.crossOrigin = "";
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      await initializeMap();
      setIsMapReady(true);
    };

    loadLeaflet();

    // Cleanup function
    return () => {
      if (leafletMapRef.current) {
        // Remove all markers first
        markersRef.current.forEach((marker) => {
          if (marker) {
            marker.remove();
          }
        });
        markersRef.current = [];

        // Stop all map events and remove the map
        leafletMapRef.current.off();
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isMapReady && leafletMapRef.current) {
      updateMarkers();
    }
  }, [locations, isMapReady]);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
    }

    const map = window.L.map(mapRef.current).setView(
      DEFAULT_CENTER,
      DEFAULT_ZOOM
    );

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    leafletMapRef.current = map;
  };

  const updateMarkers = () => {
    if (!leafletMapRef.current || !window.L) return; // early exit if map or Leaflet not ready

    // Clear existing markers
    if (markersRef.current.length) {
      markersRef.current.forEach((marker) =>
        leafletMapRef.current.removeLayer(marker)
      );
      markersRef.current = [];
    }

    const markers: any[] = [];
    locations.forEach((location) => {
      const markerColor = getRiskColor(location.riskLevel);

      const marker = window.L.marker(location.position, {
        icon: window.L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      });

      let popupContent = `<div style="font-size: 12px;"><strong>${location.name}</strong>`;

      if (location.property) {
        popupContent += `<div>${location.property.price.toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }
        )}</div>
        <div>${location.property.beds} beds, ${
          location.property.baths
        } baths</div>
        <div>Safety Score: ${location.property.safetyScore.toFixed(
          1
        )}/10</div>`;
      }

      if (location.neighborhood) {
        popupContent += `<div>HDI Score: ${location.neighborhood.hdiScore.toFixed(
          2
        )}</div>
        <div>Emergency Response: ${
          location.neighborhood.medicalResponse
        } min</div>`;
      }

      popupContent += `</div>`;

      marker.bindPopup(popupContent);

      if (leafletMapRef.current) {
        marker.addTo(leafletMapRef.current);
        markers.push(marker);
      }
    });

    markersRef.current = markers;

    // If we have locations, fit the map to show all markers
    if (locations.length > 0 && leafletMapRef.current) {
      const group = new window.L.featureGroup(markers);
      leafletMapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.Low:
        return "#43A047"; // green
      case RiskLevel.Medium:
        return "#FB8C00"; // orange
      case RiskLevel.High:
        return "#E53935"; // red
      default:
        return "#1E88E5"; // blue
    }
  };

  return (
    <Card className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="font-semibold text-neutral-900 font-sans">Map View</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center"
          >
            <Layers className="h-4 w-4 mr-1" />
            Layers
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="inline-flex items-center"
          >
            <Info className="h-4 w-4 mr-1" />
            Legend
          </Button>
        </div>
      </div>
      <div className="relative h-80">
        <div ref={mapRef} className="h-full w-full" />

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white p-2 rounded-md shadow-lg">
          <div className="flex space-x-2 text-xs">
            <span className="inline-block w-3 h-3 rounded-full bg-success"></span>
            <span>Low Risk</span>
            <span className="inline-block w-3 h-3 rounded-full bg-warning"></span>
            <span>Medium Risk</span>
            <span className="inline-block w-3 h-3 rounded-full bg-danger"></span>
            <span>High Risk</span>
          </div>
        </div>

        {/* Area info */}
        {areaName && (
          <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-md shadow">
            <div className="text-xs text-neutral-700">
              <div className="font-medium mb-1">Area: {areaName}</div>
              <div className="flex flex-col space-y-1">
                {areaInfo?.aqi && (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                    <span>
                      AQI: {areaInfo.aqi.value} ({areaInfo.aqi.text})
                    </span>
                  </div>
                )}
                {areaInfo?.floodRisk && (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1 text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    <span>Flood Risk: {areaInfo.floodRisk}</span>
                  </div>
                )}
                {areaInfo?.earthquakeRisk && (
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1 text-warning"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    <span>Earthquake Risk: {areaInfo.earthquakeRisk}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PropertyMap;
