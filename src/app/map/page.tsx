"use client";

import { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Maximize2, RefreshCw, Shield, Siren, Users, Briefcase, Wrench, WifiOff } from "lucide-react";
import type { RoleStats } from "@/components/map/gtav-map";
import { useMapPlayers, useServerInfo } from "@/hooks";

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

const roleIcons: Record<string, typeof Shield> = {
  police: Shield,
  ems: Siren,
  civilian: Users,
  mechanic: Wrench,
  business: Briefcase,
};

// Map job names to categories
function getJobCategory(job: string | null | undefined): string {
  if (!job) return "civilian";
  const j = job.toLowerCase();
  if (["police", "lspd", "bcso", "sahp", "ranger", "leo"].some(k => j.includes(k))) return "police";
  if (["ems", "ambulance", "fire", "doctor", "paramedic"].some(k => j.includes(k))) return "ems";
  if (["mechanic", "bennys", "tuner", "lscustoms"].some(k => j.includes(k))) return "mechanic";
  if (["realestate", "banker", "lawyer", "manager", "ceo", "owner"].some(k => j.includes(k))) return "business";
  return "civilian";
}

export default function MapPage() {
  const { data: mapData, loading: isLoading, error, refetch: refresh } = useMapPlayers();
  const players = mapData?.players ?? [];
  const { data: serverInfo } = useServerInfo();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refresh]);

  // Calculate role stats from real player data
  const roleStats: RoleStats[] = useMemo(() => {
    const counts: Record<string, number> = {
      civilian: 0,
      police: 0,
      ems: 0,
      mechanic: 0,
      business: 0,
    };
    players.forEach(p => {
      const cat = getJobCategory(p.job);
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return [
      { id: "civilian", label: "Civilians", count: counts.civilian, color: "#6b7280" },
      { id: "police", label: "Law Enforcement", count: counts.police, color: "#3b82f6" },
      { id: "ems", label: "EMS / Fire", count: counts.ems, color: "#ef4444" },
      { id: "mechanic", label: "Mechanics", count: counts.mechanic, color: "#f59e0b" },
      { id: "business", label: "Business Owners", count: counts.business, color: "#8b5cf6" },
    ];
  }, [players]);

  const totalPlayers = players.length;
  const maxPlayers = serverInfo?.maxPlayers || 200;

  // Format uptime
  const uptime = useMemo(() => {
    if (!serverInfo?.uptime) return "--";
    const hrs = Math.floor(serverInfo.uptime / 3600);
    const mins = Math.floor((serverInfo.uptime % 3600) / 60);
    return `${hrs}h ${mins}m`;
  }, [serverInfo?.uptime]);

  const isOffline = error || (!isLoading && !serverInfo);

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
              <span className="text-xs text-white/50">{isOffline ? "Offline" : "Live"}</span>
            </div>
            <div className="bd">
              {isOffline ? (
                <div className="flex flex-col items-center justify-center py-4 text-white/40">
                  <WifiOff className="h-8 w-8 mb-2" />
                  <span className="text-sm">Server Offline</span>
                </div>
              ) : (
                <>
                  <div className="space-y-2 text-sm text-white/60">
                    <div className="flex items-center justify-between">
                      <span>Players</span>
                      <span className="text-white">{isLoading ? "..." : `${totalPlayers}/${maxPlayers}`}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Uptime</span>
                      <span className="text-white">{uptime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Latency</span>
                      <span className="text-white">{players[0]?.ping ? `${players[0].ping}ms` : "--"}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-white/40">
                    <span className="pulse-dot" />
                    Live Tracking
                  </div>
                </>
              )}
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
                  const percentage = totalPlayers > 0 ? Math.round((role.count / totalPlayers) * 100) : 0;
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
                    <div className="m">{totalPlayers > 0 ? Math.round((roleStats.find(r => r.id === "police")?.count || 0) / totalPlayers * 100) : 0}% of server</div>
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
              <button className="btn primary" type="button" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
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
                maxPlayers={maxPlayers}
              />
            </div>
          </motion.section>
        </section>
      </main>
    </div>
  );
}
