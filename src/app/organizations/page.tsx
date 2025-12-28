"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building2, Car, Shield, Siren, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

const organizations = [
  { id: "1", name: "Los Santos Police Department", type: "Government", members: 45, status: "Official", icon: Shield, recruiting: true },
  { id: "2", name: "Pillbox Medical Center", type: "Government", members: 28, status: "Official", icon: Siren, recruiting: true },
  { id: "3", name: "Ballas", type: "Gang", members: 32, status: "Verified", icon: Users, recruiting: false },
  { id: "4", name: "LS Customs", type: "Business", members: 12, status: "Verified", icon: Car, recruiting: true },
  { id: "5", name: "Dynasty 8 Real Estate", type: "Business", members: 8, status: "Verified", icon: Briefcase, recruiting: true },
  { id: "6", name: "The Lost MC", type: "Gang", members: 24, status: "Verified", icon: Users, recruiting: false },
];

const typeFilters = ["All", "Government", "Gang", "Business"];

export default function OrganizationsPage() {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return organizations.filter((org) => {
      const matchesQuery = !q || org.name.toLowerCase().includes(q);
      const matchesType = activeType === "All" || org.type === activeType;
      return matchesQuery && matchesType;
    });
  }, [query, activeType]);

  const recruiting = useMemo(
    () => organizations.filter((org) => org.recruiting).slice(0, 3),
    []
  );

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
              <h3>Org Search</h3>
              <span className="text-xs text-white/50">Ctrl K</span>
            </div>
            <div className="bd">
              <div className="search">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search organizations, tags, roles..."
                />
                <div className="k">CTRL</div>
                <div className="k">K</div>
              </div>
              <div className="filters">
                {typeFilters.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={cn("chip", activeType === type && "on")}
                    onClick={() => setActiveType(type)}
                  >
                    {type}
                  </button>
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
              <h3>Recruiting</h3>
              <span className="text-xs text-white/50">Open</span>
            </div>
            <div className="bd">
              <div className="hotlist">
                {recruiting.map((org) => (
                  <div className="hot" key={org.id}>
                    <div className="l">
                      <div className="t">{org.name}</div>
                      <div className="m">{org.type} - {org.members} members</div>
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
            transition={{ delay: 0.1 }}
          >
            <div className="hd">
              <h3>Signals</h3>
            </div>
            <div className="bd space-y-2 text-sm text-white/60">
              <div className="flex items-center justify-between">
                <span>Total Orgs</span>
                <span className="text-white">{organizations.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Recruiting</span>
                <span className="text-white">{organizations.filter((org) => org.recruiting).length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Verified</span>
                <span className="text-white">6</span>
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Community &gt; Organizations</div>

          <div className="headRow">
            <div>
              <h1>Organizations</h1>
              <div className="desc">Departments, gangs, and businesses shaping the city.</div>
            </div>
            <div className="toolbar">
              <button className="btn primary" type="button">
                <Building2 className="h-4 w-4" />
                Create Org
              </button>
              <button className="btn" type="button">
                Roster
              </button>
            </div>
          </div>

          <StaggerContainer className="threads">
            {filtered.map((org) => (
              <StaggerItem key={org.id}>
                <Link href={`/organizations/${org.id}`}>
                  <motion.div className="thread" whileHover={{ scale: 1.005 }} transition={{ duration: 0.2 }}>
                    <div className={cn("heat", org.recruiting ? "green" : "dim")} />
                    <div className="avatar">
                      <org.icon className="h-4 w-4" />
                    </div>
                    <div className="meta">
                      <div className="titleRow">
                        <div className="tTitle">{org.name}</div>
                        <div className="tag">{org.type}</div>
                        <div className="tag">{org.status}</div>
                        {org.recruiting && <div className="tag hot">Recruiting</div>}
                      </div>
                      <div className="sub">
                        <span>{org.members} active members</span>
                        <span>Applications {org.recruiting ? "open" : "closed"}</span>
                      </div>
                    </div>
                    <div className="stats">
                      <div className="stat">
                        <Users className="h-4 w-4" />
                        <span>{org.members}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      </main>
    </div>
  );
}
