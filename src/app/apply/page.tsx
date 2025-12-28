"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Clock, FileText, Plus, Shield, Siren, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

const applications = [
  {
    id: "whitelist",
    title: "Whitelist Application",
    description: "Apply to join Black Mesa RP and unlock full access.",
    status: "Open",
    eta: "2-4 days",
    category: "Access",
    icon: FileText,
  },
  {
    id: "police",
    title: "LSPD Application",
    description: "Join the Los Santos Police Department roster.",
    status: "Open",
    eta: "4-7 days",
    category: "Department",
    icon: Shield,
  },
  {
    id: "ems",
    title: "EMS Application",
    description: "Become a paramedic or doctor and save lives.",
    status: "Open",
    eta: "3-5 days",
    category: "Department",
    icon: Siren,
  },
  {
    id: "staff",
    title: "Staff Application",
    description: "Help moderate and guide the community.",
    status: "Closed",
    eta: "Unavailable",
    category: "Staff",
    icon: Users,
  },
  {
    id: "business",
    title: "Business Application",
    description: "Launch a legal business in Los Santos.",
    status: "Open",
    eta: "5-10 days",
    category: "Business",
    icon: Briefcase,
  },
];

const statusFilters = ["All", "Open", "Closed"];

const processSteps = [
  { title: "Submit", note: "Tell us your story and goals" },
  { title: "Review", note: "Staff vote and interview" },
  { title: "Decision", note: "Discord DM and in-game sync" },
];

const myApplications = [
  { title: "Whitelist", note: "Pending review" },
  { title: "LSPD", note: "Approved" },
];

export default function ApplicationsPage() {
  const [activeStatus, setActiveStatus] = useState("All");

  const filtered = useMemo(() => {
    if (activeStatus === "All") return applications;
    return applications.filter((app) => app.status === activeStatus);
  }, [activeStatus]);

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
              <h3>Application Filters</h3>
            </div>
            <div className="bd">
              <div className="filters">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    className={cn("chip", activeStatus === status && "on")}
                    onClick={() => setActiveStatus(status)}
                  >
                    {status}
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
              <h3>Process</h3>
              <span className="text-xs text-white/50">3 steps</span>
            </div>
            <div className="bd">
              <div className="hotlist">
                {processSteps.map((step) => (
                  <div className="hot" key={step.title}>
                    <div className="l">
                      <div className="t">{step.title}</div>
                      <div className="m">{step.note}</div>
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
              <h3>My Applications</h3>
            </div>
            <div className="bd">
              <div className="hotlist">
                {myApplications.map((app) => (
                  <div className="hot" key={app.title}>
                    <div className="l">
                      <div className="t">{app.title}</div>
                      <div className="m">{app.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Apply</div>

          <div className="headRow">
            <div>
              <h1>Applications</h1>
              <div className="desc">Submit department, staff, and whitelist applications.</div>
            </div>
            <div className="toolbar">
              <Link className="btn primary" href="/apply/whitelist">
                <Plus className="h-4 w-4" />
                Start Application
              </Link>
              <button className="btn">Status Board</button>
            </div>
          </div>

          <StaggerContainer className="threads">
            {filtered.map((app) => (
              <StaggerItem key={app.id}>
                <motion.div
                  className="thread"
                  whileHover={{ scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={cn("heat", app.status === "Open" ? "green" : "dim")} />
                  <div className="avatar">
                    <app.icon className="h-4 w-4" />
                  </div>
                  <div className="meta">
                    <div className="titleRow">
                      <div className="tTitle">{app.title}</div>
                      <div className="tag">{app.category}</div>
                      <div className={cn("tag", app.status === "Open" && "hot", app.status === "Closed" && "lock")}>
                        {app.status}
                      </div>
                    </div>
                    <div className="sub">
                      <span>{app.description}</span>
                      <span>
                        Estimated review <strong>{app.eta}</strong>
                      </span>
                    </div>
                  </div>
                  <div className="stats">
                    <div className="stat">
                      <Clock className="h-4 w-4" />
                      <span>{app.eta}</span>
                    </div>
                    {app.status === "Open" ? (
                      <Link className="btn primary" href={`/apply/${app.id}`}>
                        Apply
                      </Link>
                    ) : (
                      <div className="stat">Closed</div>
                    )}
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
