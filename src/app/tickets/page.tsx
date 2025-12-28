"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";

const tickets = [
  {
    id: "145",
    subject: "Can't access my inventory",
    status: "Open",
    priority: "High",
    created: "2 hours ago",
    updated: "10 min ago",
    replies: 3,
    type: "Bug",
  },
  {
    id: "146",
    subject: "Report player for RDM",
    status: "In Progress",
    priority: "Medium",
    created: "1 day ago",
    updated: "45 min ago",
    replies: 5,
    type: "Report",
  },
  {
    id: "147",
    subject: "Vehicle disappeared from garage",
    status: "Resolved",
    priority: "Low",
    created: "3 days ago",
    updated: "8 hours ago",
    replies: 4,
    type: "Bug",
  },
  {
    id: "148",
    subject: "Application status inquiry",
    status: "Closed",
    priority: "Low",
    created: "1 week ago",
    updated: "2 days ago",
    replies: 2,
    type: "Support",
  },
];

const statusFilters = ["All", "Open", "In Progress", "Resolved", "Closed"];

const lanes = [
  { title: "Urgent Queue", note: "Priority staff and LEO reports" },
  { title: "Bug Lane", note: "Game-breaking issues and exploits" },
  { title: "Appeals", note: "Ban reviews and follow-ups" },
];

const statusHeat: Record<string, string> = {
  Open: "green",
  "In Progress": "",
  Resolved: "green",
  Closed: "dim",
};

export default function TicketsPage() {
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesQuery =
        !q ||
        ticket.subject.toLowerCase().includes(q) ||
        ticket.type.toLowerCase().includes(q);
      const matchesStatus = activeStatus === "All" || ticket.status === activeStatus;
      return matchesQuery && matchesStatus;
    });
  }, [query, activeStatus]);

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
              <h3>Ticket Search</h3>
              <span className="text-xs text-white/50">Ctrl K</span>
            </div>
            <div className="bd">
              <div className="search">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tickets, types, users..."
                />
                <div className="k">CTRL</div>
                <div className="k">K</div>
              </div>
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
              <h3>Support Lanes</h3>
              <span className="text-xs text-white/50">Live</span>
            </div>
            <div className="bd">
              <div className="hotlist">
                {lanes.map((lane) => (
                  <div className="hot" key={lane.title}>
                    <div className="l">
                      <div className="t">{lane.title}</div>
                      <div className="m">{lane.note}</div>
                    </div>
                    <div className="spark" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </aside>

        <section className="main">
          <div className="crumbs">Support &gt; Tickets</div>

          <div className="headRow">
            <div>
              <h1>Support Tickets</h1>
              <div className="desc">Priority support for bugs, reports, and account issues.</div>
            </div>
            <div className="toolbar">
              <Link className="btn primary" href="/tickets/new">
                <Plus className="h-4 w-4" />
                New Ticket
              </Link>
              <button className="btn">Sort: Recent</button>
            </div>
          </div>

          <StaggerContainer className="threads">
            {filtered.map((ticket) => (
              <StaggerItem key={ticket.id}>
                <Link href={`/tickets/${ticket.id}`}>
                  <motion.div
                    className="thread"
                    whileHover={{ scale: 1.005 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={cn("heat", statusHeat[ticket.status])} />
                    <div className="avatar">{ticket.type.charAt(0)}</div>
                    <div className="meta">
                      <div className="titleRow">
                        <div className="tTitle">{ticket.subject}</div>
                        <div className="tag">{ticket.type}</div>
                        <div className={cn("tag", ticket.priority === "High" && "hot")}>{ticket.priority}</div>
                        <div className={cn("tag", ticket.status === "Closed" && "lock")}>{ticket.status}</div>
                      </div>
                      <div className="sub">
                        <span>#{ticket.id} - opened {ticket.created}</span>
                        <span>
                          Last update <strong>{ticket.updated}</strong>
                        </span>
                      </div>
                    </div>
                    <div className="stats">
                      <div className="stat">
                        <MessageSquare className="h-4 w-4" />
                        <span>{ticket.replies}</span>
                      </div>
                      <div className="stat">
                        <Clock className="h-4 w-4" />
                        <span>{ticket.status}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <div className="pager">
            <div>Showing 1-{filtered.length} of {tickets.length} tickets</div>
            <div className="pages">
              <div className="page on">1</div>
              <div className="page">2</div>
              <div className="page">3</div>
              <div className="page">&gt;</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
