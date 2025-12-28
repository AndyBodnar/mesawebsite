"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MessageSquare, Plus, Loader2, AlertCircle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem } from "@/components/ui/motion";
import { formatDistanceToNow } from "date-fns";

interface TicketUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface Ticket {
  id: string;
  type: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_RESPONSE" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  userId: string;
  assignedToId: string | null;
  User_Ticket_userIdToUser: TicketUser;
  User_Ticket_assignedToIdToUser: TicketUser | null;
  _count: { TicketMessage: number };
}

const statusMap: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  WAITING_RESPONSE: "Waiting",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const priorityMap: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};
const statusFilters = ["All", "Open", "In Progress", "Resolved", "Closed"];

const lanes = [
  { title: "Urgent Queue", note: "Priority staff and LEO reports" },
  { title: "Bug Lane", note: "Game-breaking issues and exploits" },
  { title: "Appeals", note: "Ban reviews and follow-ups" },
];

const statusHeat: Record<string, string> = {
  Open: "green",
  "In Progress": "",
  Waiting: "",
  Resolved: "green",
  Closed: "dim",
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets");
        if (!res.ok) {
          if (res.status === 401) {
            setError("Please sign in to view your tickets");
          } else {
            setError("Failed to load tickets");
          }
          return;
        }
        const data = await res.json();
        setTickets(data);
      } catch {
        setError("Failed to load tickets");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const displayStatus = statusMap[ticket.status] || ticket.status;
      const matchesQuery =
        !q ||
        ticket.subject.toLowerCase().includes(q) ||
        ticket.type.toLowerCase().includes(q);
      const matchesStatus = activeStatus === "All" || displayStatus === activeStatus;
      return matchesQuery && matchesStatus;
    });
  }, [query, activeStatus, tickets]);

  if (loading) {
    return (
      <div className="relative">
        <main className="wrap">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-white/50" />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative">
        <main className="wrap">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-white/70">{error}</p>
            <Link href="/auth/signin" className="btn primary">
              Sign In
            </Link>
          </div>
        </main>
      </div>
    );
  }
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
          {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Inbox className="h-12 w-12 text-white/30" />
              <p className="text-white/50">No tickets yet</p>
              <Link href="/tickets/new" className="btn primary">
                <Plus className="h-4 w-4" />
                Create Your First Ticket
              </Link>
            </div>
          ) : (
            <StaggerContainer className="threads">
              {filtered.map((ticket) => {
                const displayStatus = statusMap[ticket.status] || ticket.status;
                const displayPriority = priorityMap[ticket.priority] || ticket.priority;
                return (
                  <StaggerItem key={ticket.id}>
                    <Link href={`/tickets/${ticket.id}`}>
                      <motion.div
                        className="thread"
                        whileHover={{ scale: 1.005 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={cn("heat", statusHeat[displayStatus])} />
                        <div className="avatar">{ticket.type.charAt(0)}</div>
                        <div className="meta">
                          <div className="titleRow">
                            <div className="tTitle">{ticket.subject}</div>
                            <div className="tag">{ticket.type}</div>
                            <div className={cn("tag", (ticket.priority === "HIGH" || ticket.priority === "URGENT") && "hot")}>
                              {displayPriority}
                            </div>
                            <div className={cn("tag", ticket.status === "CLOSED" && "lock")}>
                              {displayStatus}
                            </div>
                          </div>                          <div className="sub">
                            <span>
                              #{ticket.id.slice(0, 8)} - opened{" "}
                              {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                            </span>
                            <span>
                              Last update{" "}
                              <strong>
                                {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
                              </strong>
                            </span>
                          </div>
                        </div>
                        <div className="stats">
                          <div className="stat">
                            <MessageSquare className="h-4 w-4" />
                            <span>{ticket._count.TicketMessage}</span>
                          </div>
                          <div className="stat">
                            <Clock className="h-4 w-4" />
                            <span>{displayStatus}</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          )}
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
