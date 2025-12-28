"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, ImageOverlay, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type RoleStats = {
  id: string;
  label: string;
  count: number;
  color: string;
  icon?: React.ReactNode;
};

export type PlayerPosition = {
  x: number;
  y: number;
  job?: string | null;
};

export type HeatPoint = {
  x: number;
  y: number;
  intensity: number;
  count: number;
};

type GTAVMapProps = {
  roleStats?: RoleStats[];
  totalPlayers?: number;
  maxPlayers?: number;
  players?: PlayerPosition[];
  showHeatmap?: boolean;
};

// GTA V coordinate bounds
const GTA_BOUNDS = {
  minX: -4000,
  maxX: 4500,
  minY: -4000,
  maxY: 8000,
};

// Map image bounds (8192x8192)
const MAP_SIZE = 8192;

// Convert GTA coordinates to Leaflet map coordinates
function gtaToLeaflet(x: number, y: number): [number, number] {
  const leafletX = ((x - GTA_BOUNDS.minX) / (GTA_BOUNDS.maxX - GTA_BOUNDS.minX)) * MAP_SIZE;
  // Y is inverted in GTA (positive is north)
  const leafletY = MAP_SIZE - ((y - GTA_BOUNDS.minY) / (GTA_BOUNDS.maxY - GTA_BOUNDS.minY)) * MAP_SIZE;
  return [leafletY, leafletX]; // Leaflet uses [lat, lng] which maps to [y, x]
}

// Calculate heat points from player positions
function calculateHeatPoints(players: PlayerPosition[]): HeatPoint[] {
  if (players.length === 0) return [];

  const grid: Map<string, { x: number; y: number; count: number }> = new Map();
  const GRID_SIZE = 500; // Group players in 500-unit cells

  players.forEach(player => {
    if (player.x === 0 && player.y === 0) return; // Skip invalid positions

    const gridX = Math.floor(player.x / GRID_SIZE) * GRID_SIZE;
    const gridY = Math.floor(player.y / GRID_SIZE) * GRID_SIZE;
    const key = `${gridX},${gridY}`;

    const existing = grid.get(key);
    if (existing) {
      existing.count++;
    } else {
      grid.set(key, { x: gridX + GRID_SIZE / 2, y: gridY + GRID_SIZE / 2, count: 1 });
    }
  });

  const maxCount = Math.max(...Array.from(grid.values()).map(g => g.count), 1);

  return Array.from(grid.values()).map(g => ({
    x: g.x,
    y: g.y,
    count: g.count,
    intensity: g.count / maxCount,
  }));
}

// Component to render heatmap circles with pulsing effect
function HeatmapLayer({ players }: { players: PlayerPosition[] }) {
  const heatPoints = useMemo(() => calculateHeatPoints(players), [players]);

  if (heatPoints.length === 0) return null;

  return (
    <>
      {heatPoints.map((point, i) => {
        const coords = gtaToLeaflet(point.x, point.y);
        // Radius scales with player count (200 base + 150 per player)
        const radius = 200 + (point.count * 150);
        // Higher opacity - 0.5 to 0.8
        const opacity = 0.5 + (point.intensity * 0.3);

        return (
          <Circle
            key={i}
            center={coords}
            radius={radius}
            pathOptions={{
              color: "rgba(220, 38, 38, 0.3)",
              weight: 2,
              fillColor: "#dc2626",
              fillOpacity: opacity,
              className: "heat-pulse",
            }}
          />
        );
      })}
    </>
  );
}

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

export function GTAVMap({
  roleStats = [],
  totalPlayers = 0,
  maxPlayers = 200,
  players = [],
  showHeatmap = true,
}: GTAVMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Map bounds - the image is 8192x8192 (square)
  const bounds = useMemo((): L.LatLngBoundsExpression => [
    [0, 0],
    [MAP_SIZE, MAP_SIZE],
  ], []);

  const center: L.LatLngExpression = [MAP_SIZE / 2, MAP_SIZE / 2];

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
        {/* Heatmap overlay showing population density */}
        {showHeatmap && players.length > 0 && (
          <HeatmapLayer players={players} />
        )}
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

        {/* Heatmap legend */}
        {showHeatmap && players.length > 0 && (
          <div className="gtav-legend-heat">
            <div className="gtav-legend-heat-label">Activity Hotspots</div>
            <div className="gtav-legend-heat-bar">
              <span>Low</span>
              <div className="gtav-legend-heat-gradient" />
              <span>High</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GTAVMap;
