"use client";

import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Phone, Radio, Shield, Siren, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

const activeCalls = [
  { id: "1", code: "10-31", description: "Crime in Progress", location: "Vinewood Blvd", units: 2, priority: "High", time: "2 min ago" },
  { id: "2", code: "10-50", description: "Traffic Accident", location: "Del Perro Freeway", units: 1, priority: "Medium", time: "5 min ago" },
  { id: "3", code: "10-70", description: "Prowler", location: "Mirror Park", units: 1, priority: "Low", time: "12 min ago" },
];

const units = [
  { callsign: "ADAM-1", officer: "Officer Miller", status: "Available", location: "Mission Row" },
  { callsign: "ADAM-2", officer: "Officer Chen", status: "On Scene", location: "Vinewood" },
  { callsign: "DAVID-1", officer: "Sergeant Johnson", status: "En Route", location: "Del Perro" },
  { callsign: "AIR-1", officer: "Pilot Williams", status: "Available", location: "LSIA" },
];

const priorityHeat: Record<string, string> = {
  High: "",
  Medium: "",
  Low: "dim",
};

const priorityTag: Record<string, string> = {
  High: "hot",
  Medium: "",
  Low: "",
};

export default function DispatchPage() {
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
              <h3>Active Units</h3>
              <span className="text-xs text-white/50">Live</span>
            </div>
            <div className="bd">
              <div className="hotlist">
                {units.map((unit) => (
                  <div className="hot" key={unit.callsign}>
                    <div className="l">
                      <div className="t">{unit.callsign}</div>
                      <div className="m">
                        {unit.officer} - {unit.status}
                      </div>
                    </div>
                    <div className="spark" aria-hidden="true" />
                  </div>
                ))}
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
              <h3>Quick Actions</h3>
            </div>
            <div className="bd space-y-2">
              <button className="btn w-full justify-center" type="button">
                <Phone className="h-4 w-4" />
                New Call
              </button>
              <button className="btn w-full justify-center" type="button">
                <Siren className="h-4 w-4" />
                Panic Alert
              </button>
              <button className="btn w-full justify-center" type="button">
                <Radio className="h-4 w-4" />
                Broadcast
              </button>
            </div>
          </motion.section>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="hd">
              <h3>Dispatch Pulse</h3>
              <span className="text-xs text-white/50">Shift</span>
            </div>
            <div className="bd space-y-2 text-sm text-white/60">
              <div className="flex items-center justify-between">
                <span>Active Calls</span>
                <span className="text-white">{activeCalls.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>High Priority</span>
                <span className="text-white">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Units Online</span>
                <span className="text-white">{units.length}</span>
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Dispatch &gt; Active Calls</div>

          <div className="headRow">
            <div>
              <h1>LEO Dispatch</h1>
              <div className="desc">Real time call intake, unit tracking, and incident flow.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary" type="button">
                <Phone className="h-4 w-4" />
                Create Call
              </button>
              <button className="btn" type="button">
                <Radio className="h-4 w-4" />
                Broadcast
              </button>
            </div>
          </div>

          <motion.section
            className="panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bd">
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                <div className="stat">
                  <AlertTriangle className="h-4 w-4" />
                  {activeCalls.length} Active Calls
                </div>
                <div className="stat">
                  <Shield className="h-4 w-4" />
                  {units.length} Units Online
                </div>
              </div>
            </div>
          </motion.section>

          <StaggerContainer className="threads">
            {activeCalls.map((call) => (
              <StaggerItem key={call.id}>
                <motion.div className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                  <div className={cn("heat", priorityHeat[call.priority])} />
                  <div className="avatar">{call.code}</div>
                  <div className="meta">
                    <div className="titleRow">
                      <div className="tTitle">{call.description}</div>
                      <div className="tag">{call.code}</div>
                      <div className={cn("tag", priorityTag[call.priority])}>{call.priority}</div>
                    </div>
                    <div className="sub">
                      <span>
                        <MapPin className="inline h-3.5 w-3.5" /> {call.location}
                      </span>
                      <span>
                        Reported <strong>{call.time}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <Users className="h-4 w-4" />
                      <span>{call.units} units</span>
                    </div>
                    <button className="btn" type="button">
                      Respond
                    </button>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </main>
    </div>
  );
}

