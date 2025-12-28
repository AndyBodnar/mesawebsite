"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Maximize2, RefreshCw, Shield, Siren, Users, Briefcase, Wrench } from "lucide-react";
import type { RoleStats } from "@/components/map/gtav-map";

// Dynamically import the map component (Leaflet requires client-side only)
const GTAVMap = dynamic(() => import("@/components/map/gtav-map"), {
  ssr: false,
  loading: () => (
    <div className="gtav-map-loading">
      <div className="gtav-map-loading-spinner" />
      <span>Loading Map...</span>
    </div>
  ),
});

// Mock role stats - in production, these would come from your FiveM server API
const roleStats: RoleStats[] = [
  { id: "civilian", label: "Civilians", count: 87, color: "#6b7280" },
  { id: "police", label: "Law Enforcement", count: 24, color: "#3b82f6" },
  { id: "ems", label: "EMS / Fire", count: 12, color: "#ef4444" },
  { id: "mechanic", label: "Mechanics", count: 8, color: "#f59e0b" },
  { id: "business", label: "Business Owners", count: 11, color: "#8b5cf6" },
];

const totalPlayers = roleStats.reduce((sum, role) => sum + role.count, 0);

const roleIcons: Record<string, typeof Shield> = {
  police: Shield,
  ems: Siren,
  civilian: Users,
  mechanic: Wrench,
  business: Briefcase,
};

export default function MapPage() {
  return (
    <div className="relative">
      <main className="wrap">
        <aside className="sidebar">
          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="hd">
              <h3>Server Status</h3>
              <span className="text-xs text-white/50">Live</span>
            </div>
            <div className="bd">
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center justify-between">
                  <span>Players</span>
                  <span className="text-white">{totalPlayers}/200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Uptime</span>
                  <span className="text-white">6h 32m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Latency</span>
                  <span className="text-white">28ms</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/40">
                <span className="pulse-dot" />
                Live Tracking
              </div>
            </div>
          </motion.section>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="hd">
              <h3>Population</h3>
              <span className="text-xs text-white/50">By Role</span>
            </div>
            <div className="bd">
              <div className="space-y-3">
                {roleStats.map((role) => {
                  const Icon = roleIcons[role.id] || Users;
                  const percentage = Math.round((role.count / totalPlayers) * 100);
                  return (
                    <div key={role.id} className="map-role-stat">
                      <div className="map-role-stat-header">
                        <div className="map-role-stat-label">
                          <div
                            className="map-role-stat-dot"
                            style={{ background: role.color, boxShadow: `0 0 8px ${role.color}` }}
                          />
                          <Icon className="h-4 w-4" style={{ color: role.color }} />
                          <span>{role.label}</span>
                        </div>
                        <div className="map-role-stat-count">
                          <span className="text-white font-medium">{role.count}</span>
                          <span className="text-white/40 text-xs ml-1">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="map-role-stat-bar">
                        <motion.div
                          className="map-role-stat-bar-fill"
                          style={{ background: role.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.section>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="hd">
              <h3>Quick Stats</h3>
              <span className="text-xs text-white/50">Live</span>
            </div>
            <div className="bd">
              <div className="hotlist">
                <div className="hot">
                  <div className="l">
                    <div className="t">LEO Ratio</div>
                    <div className="m">{Math.round((roleStats.find(r => r.id === "police")?.count || 0) / totalPlayers * 100)}% of server</div>
                  </div>
                  <div className="spark" aria-hidden="true" />
                </div>
                <div className="hot">
                  <div className="l">
                    <div className="t">Emergency Services</div>
                    <div className="m">{(roleStats.find(r => r.id === "police")?.count || 0) + (roleStats.find(r => r.id === "ems")?.count || 0)} units active</div>
                  </div>
                  <div className="spark" aria-hidden="true" />
                </div>
                <div className="hot">
                  <div className="l">
                    <div className="t">Civilian Activity</div>
                    <div className="m">{roleStats.find(r => r.id === "civilian")?.count || 0} players</div>
                  </div>
                  <div className="spark" aria-hidden="true" />
                </div>
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Live Map</div>

          <div className="headRow">
            <div>
              <h1>Live Map</h1>
              <div className="desc">Real-time server population across Los Santos.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary" type="button">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              <button className="btn" type="button">
                <Maximize2 className="h-4 w-4" />
                Full View
              </button>
            </div>
          </div>

          <motion.section
            className="panel map-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bd">
              <GTAVMap
                roleStats={roleStats}
                totalPlayers={totalPlayers}
                maxPlayers={200}
              />
            </div>
          </motion.section>
        </section>
      </main>
    </div>
  );
}
