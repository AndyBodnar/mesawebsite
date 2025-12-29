"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2, AlertCircle, Inbox, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { TicketCard } from "@/components/tickets";

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
  User_Ticket_userIdToUser: TicketUser;
  User_Ticket_assignedToIdToUser: TicketUser | null;
  _count: { TicketMessage: number };
}

const statusFilters = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "active", label: "Active" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/tickets");
        if (!res.ok) {
          if (res.status === 401) setError("Please sign in to view your tickets");
          else setError("Failed to load tickets");
          return;
        }
        const data = await res.json();
        setTickets(data);
      } catch { setError("Failed to load tickets"); }
      finally { setLoading(false); }
    }
    fetchTickets();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesQuery = !q || ticket.subject.toLowerCase().includes(q) || ticket.type.toLowerCase().includes(q);
      let matchesStatus = true;
      if (statusFilter === "open") matchesStatus = ticket.status === "OPEN";
      else if (statusFilter === "active") matchesStatus = ["IN_PROGRESS", "WAITING_RESPONSE"].includes(ticket.status);
      else if (statusFilter === "resolved") matchesStatus = ticket.status === "RESOLVED";
      else if (statusFilter === "closed") matchesStatus = ticket.status === "CLOSED";
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter, tickets]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    active: tickets.filter((t) => ["IN_PROGRESS", "WAITING_RESPONSE"].includes(t.status)).length,
    resolved: tickets.filter((t) => t.status === "RESOLVED").length,
  }), [tickets]);

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-white/50" /></div>);

  if (error) return (<div className="min-h-screen flex flex-col items-center justify-center gap-4"><AlertCircle className="h-12 w-12 text-red-500" /><p className="text-white/70">{error}</p><Link href="/auth/signin" className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors">Sign In</Link></div>);

  return (
    <div className="min-h-screen">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Support Tickets</h1>
              <p className="text-white/50 mt-1">View and manage your support requests</p>
            </div>
            <Link href="/tickets/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"><Plus className="h-4 w-4" />New Ticket</Link>
          </div>
        </motion.div>
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {[{ label: "Total", value: stats.total, color: "white" },{ label: "Open", value: stats.open, color: "blue" },{ label: "Active", value: stats.active, color: "yellow" },{ label: "Resolved", value: stats.resolved, color: "green" }].map((stat) => (<div key={stat.label} className="p-4 rounded-xl bg-white/5 border border-white/10"><div className="text-sm text-white/50">{stat.label}</div><div className={cn("text-2xl font-bold mt-1", stat.color === "blue" && "text-blue-400", stat.color === "yellow" && "text-yellow-400", stat.color === "green" && "text-green-400", stat.color === "white" && "text-white")}>{stat.value}</div></div>))}
        </motion.div>
        <motion.div className="flex flex-col sm:flex-row gap-4 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/20" /></div>
          <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-white/40" /><div className="flex gap-1">{statusFilters.map((filter) => (<button key={filter.value} onClick={() => setStatusFilter(filter.value)} className={cn("px-3 py-1.5 rounded-lg text-sm transition-colors", statusFilter === filter.value ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5")}>{filter.label}</button>))}</div></div>
        </motion.div>
        {tickets.length === 0 ? (<motion.div className="flex flex-col items-center justify-center py-16 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Inbox className="h-16 w-16 text-white/20" /><p className="text-white/50 text-lg">No tickets yet</p><p className="text-white/30 text-sm">Create your first support ticket to get help</p><Link href="/tickets/new" className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors mt-4"><Plus className="h-4 w-4" />Create Ticket</Link></motion.div>) : filtered.length === 0 ? (<motion.div className="flex flex-col items-center justify-center py-16 gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Search className="h-16 w-16 text-white/20" /><p className="text-white/50 text-lg">No matching tickets</p><p className="text-white/30 text-sm">Try adjusting your search or filters</p></motion.div>) : (<motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>{filtered.map((ticket, idx) => (<motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * idx }}><TicketCard ticket={ticket} /></motion.div>))}</motion.div>)}
        {filtered.length > 0 && (<div className="mt-8 text-center text-sm text-white/40">Showing {filtered.length} of {tickets.length} tickets</div>)}
      </main>
    </div>
  );
}
