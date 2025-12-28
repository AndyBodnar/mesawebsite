"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type RoleStats = {
  id: string;
  label: string;
  count: number;
  color: string;
  icon?: React.ReactNode;
};

type GTAVMapProps = {
  roleStats?: RoleStats[];
  totalPlayers?: number;
  maxPlayers?: number;
};

// Component to handle map initialization
function MapController() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

export function GTAVMap({ roleStats = [], totalPlayers = 0, maxPlayers = 200 }: GTAVMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Map bounds - the image is 8192x8192 (square)
  const bounds = useMemo((): L.LatLngBoundsExpression => [
    [0, 0],
    [8192, 8192],
  ], []);

  const center: L.LatLngExpression = [4096, 4096];

  if (!isClient) {
    return (
      <div className="gtav-map-loading">
        <div className="gtav-map-loading-spinner" />
        <span>Loading Map...</span>
      </div>
    );
  }

  return (
    <div className="gtav-map-container">
      <MapContainer
        center={center}
        zoom={-1}
        minZoom={-2}
        maxZoom={2}
        crs={L.CRS.Simple}
        maxBounds={bounds}
        maxBoundsViscosity={0.8}
        zoomControl={true}
        attributionControl={false}
        className="gtav-map"
        style={{ height: "100%", width: "100%", background: "#0a1628" }}
      >
        <MapController />
        <ImageOverlay
          url="/gtav-map.jpg"
          bounds={bounds}
        />
      </MapContainer>

      {/* Stats Legend Overlay */}
      <div className="gtav-legend">
        <div className="gtav-legend-header">
          <div className="gtav-legend-title">Server Population</div>
          <div className="gtav-legend-total">
            <span className="gtav-legend-count">{totalPlayers}</span>
            <span className="gtav-legend-max">/ {maxPlayers}</span>
          </div>
        </div>

        <div className="gtav-legend-bar">
          <div
            className="gtav-legend-bar-fill"
            style={{ width: `${(totalPlayers / maxPlayers) * 100}%` }}
          />
        </div>

        <div className="gtav-legend-roles">
          {roleStats.map((role) => (
            <div key={role.id} className="gtav-legend-role">
              <div className="gtav-legend-role-indicator" style={{ background: role.color }} />
              <div className="gtav-legend-role-info">
                <span className="gtav-legend-role-label">{role.label}</span>
                <span className="gtav-legend-role-count">{role.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GTAVMap;
