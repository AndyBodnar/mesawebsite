"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Inbox,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PriorityBadge, StatusBadge, TypeBadge } from "@/components/tickets";

interface TicketUser {
  id: string;
  name: string | null;
  image: string | null;
}

interface TicketData {
  id: string;
  type: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_RESPONSE" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  isOwnerOnly: boolean;
  User_Ticket_userIdToUser: TicketUser;
  User_Ticket_assignedToIdToUser: TicketUser | null;
  _count: { TicketMessage: number };
}

const statusFilters = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "active", label: "Active" },
  { value: "unassigned", label: "Unassigned" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const priorityFilters = [
  { value: "all", label: "All Priorities" },
  { value: "URGENT", label: "Urgent" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

export default function StaffTicketsPage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  async function fetchTickets() {
    try {
      const res = await fetch("/api/tickets");
      if (!res.ok) {
        if (res.status === 401) setError("Please sign in");
        else if (res.status === 403) setError("Access denied");
        else setError("Failed to load tickets");
        return;
      }
      const data = await res.json();
      setTickets(data);
      setError(null);
    } catch {
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchTickets(); }, []);

  function handleRefresh() {
    setRefreshing(true);
    fetchTickets();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesQuery = !q || ticket.subject.toLowerCase().includes(q) || ticket.type.toLowerCase().includes(q) || ticket.User_Ticket_userIdToUser.name?.toLowerCase().includes(q);
      let matchesStatus = true;
      if (statusFilter === "open") matchesStatus = ticket.status === "OPEN";
      else if (statusFilter === "active") matchesStatus = ["IN_PROGRESS", "WAITING_RESPONSE"].includes(ticket.status);
      else if (statusFilter === "unassigned") matchesStatus = !ticket.User_Ticket_assignedToIdToUser && ticket.status !== "CLOSED";
      else if (statusFilter === "resolved") matchesStatus = ticket.status === "RESOLVED";
      else if (statusFilter === "closed") matchesStatus = ticket.status === "CLOSED";
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
      return matchesQuery && matchesStatus && matchesPriority;
    });
  }, [query, statusFilter, priorityFilter, tickets]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === "OPEN").length,
    unassigned: tickets.filter((t) => !t.User_Ticket_assignedToIdToUser && t.status !== "CLOSED").length,
    urgent: tickets.filter((t) => t.priority === "URGENT" && t.status !== "CLOSED").length,
    active: tickets.filter((t) => ["IN_PROGRESS", "WAITING_RESPONSE"].includes(t.status)).length,
  }), [tickets]);

  if (loading) return (<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>);
  if (error) return (<div className="flex flex-col items-center justify-center py-20 gap-4"><AlertCircle className="h-12 w-12 text-red-500" /><p className="text-gray-400">{error}</p></div>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
          <p className="text-gray-400">Manage and respond to support requests</p>
        </div>
        <button onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white rounded-lg transition-colors">
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />{refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {[{ label: "Total", value: stats.total, color: "text-white" },{ label: "Open", value: stats.open, color: "text-blue-400" },{ label: "Active", value: stats.active, color: "text-yellow-400" },{ label: "Unassigned", value: stats.unassigned, color: "text-orange-400" },{ label: "Urgent", value: stats.urgent, color: "text-red-400" }].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
            <div className="text-sm text-gray-400">{stat.label}</div>
            <div className={cn("text-2xl font-bold mt-1", stat.color)}>{stat.value}</div>
          </div>
        ))}
      </motion.div>

      <motion.div className="flex flex-col lg:flex-row gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by subject, type, or user..." className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-600" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-500" />
          <div className="flex gap-1">{statusFilters.map((filter) => (<button key={filter.value} onClick={() => setStatusFilter(filter.value)} className={cn("px-3 py-1.5 rounded-lg text-sm transition-colors", statusFilter === filter.value ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800")}>{filter.label}</button>))}</div>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none">{priorityFilters.map((filter) => (<option key={filter.value} value={filter.value}>{filter.label}</option>))}</select>
        </div>
      </motion.div>

      {tickets.length === 0 ? (
        <motion.div className="flex flex-col items-center justify-center py-16 gap-4 rounded-xl border border-gray-800 bg-gray-900/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Inbox className="h-16 w-16 text-gray-600" /><p className="text-gray-400 text-lg">No tickets yet</p><p className="text-gray-500 text-sm">Tickets from users will appear here</p></motion.div>
      ) : filtered.length === 0 ? (
        <motion.div className="flex flex-col items-center justify-center py-16 gap-4 rounded-xl border border-gray-800 bg-gray-900/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Search className="h-16 w-16 text-gray-600" /><p className="text-gray-400 text-lg">No matching tickets</p><p className="text-gray-500 text-sm">Try adjusting your search or filters</p></motion.div>
      ) : (
        <motion.div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-800"><th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Ticket</th><th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">User</th><th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th><th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Priority</th><th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Assigned</th><th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Updated</th><th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-800">{filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 px-4"><div className="flex items-start gap-3"><div className="flex-shrink-0 mt-0.5"><TypeBadge type={ticket.type} /></div><div className="min-w-0"><Link href={`/staff/tickets/${ticket.id}`} className="font-medium text-white hover:text-blue-400 transition-colors line-clamp-1">{ticket.subject}</Link><div className="flex items-center gap-2 mt-1 text-xs text-gray-500"><span>{ticket._count.TicketMessage} messages</span>{ticket.isOwnerOnly && (<span className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">Owner Only</span>)}</div></div></div></td>
                  <td className="py-3 px-4"><div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">{ticket.User_Ticket_userIdToUser.image ? (<img src={ticket.User_Ticket_userIdToUser.image} alt="" className="w-full h-full object-cover" />) : (<span className="text-xs">{(ticket.User_Ticket_userIdToUser.name || "U").charAt(0).toUpperCase()}</span>)}</div><span className="text-sm text-gray-300 truncate max-w-[120px]">{ticket.User_Ticket_userIdToUser.name || "Unknown"}</span></div></td>
                  <td className="py-3 px-4"><StatusBadge status={ticket.status} /></td>
                  <td className="py-3 px-4"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="py-3 px-4">{ticket.User_Ticket_assignedToIdToUser ? (<div className="flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center overflow-hidden flex-shrink-0">{ticket.User_Ticket_assignedToIdToUser.image ? (<img src={ticket.User_Ticket_assignedToIdToUser.image} alt="" className="w-full h-full object-cover" />) : (<span className="text-xs text-emerald-400">{(ticket.User_Ticket_assignedToIdToUser.name || "S").charAt(0).toUpperCase()}</span>)}</div><span className="text-sm text-gray-300 truncate max-w-[100px]">{ticket.User_Ticket_assignedToIdToUser.name || "Staff"}</span></div>) : (<span className="text-sm text-gray-500">Unassigned</span>)}</td>
                  <td className="py-3 px-4"><span className="text-sm text-gray-400">{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</span></td>
                  <td className="py-3 px-4"><Link href={`/staff/tickets/${ticket.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">View <ExternalLink className="h-3 w-3" /></Link></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-800 text-sm text-gray-400">Showing {filtered.length} of {tickets.length} tickets</div>
        </motion.div>
      )}
    </div>
  );
}
