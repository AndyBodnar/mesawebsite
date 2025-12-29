"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle,
  Clock,
  User,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PriorityBadge,
  StatusBadge,
  TypeBadge,
  StatusSelector,
  PrioritySelector,
  StaffSelector,
  TicketActivityLog,
} from "@/components/tickets";

interface TicketUser {
  id: string;
  name: string | null;
  image: string | null;
  staffRole?: string;
}

interface TicketMessage {
  id: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
  User: TicketUser;
}

interface LogEntry {
  id: string;
  action: string;
  details?: string | null;
  createdAt: string;
  User: TicketUser;
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
  isOwnerOnly: boolean;
  User_Ticket_userIdToUser: TicketUser;
  User_Ticket_assignedToIdToUser: TicketUser | null;
  TicketMessage: TicketMessage[];
}

export default function StaffTicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  const staffRole = (session?.user as any)?.staffRole || "user";
  const isOwner = staffRole === "owner";

  async function fetchTicket() {
    try {
      const res = await fetch("/api/tickets/" + params.id);
      if (!res.ok) {
        if (res.status === 401) setError("Please sign in");
        else if (res.status === 404) setError("Ticket not found");
        else if (res.status === 403) setError("Access denied");
        else setError("Failed to load ticket");
        return;
      }
      const data = await res.json();
      setTicket(data);
    } catch {
      setError("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }

  async function fetchLogs() {
    try {
      const res = await fetch("/api/tickets/" + params.id + "/logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch {}
  }

  useEffect(() => {
    if (params.id) {
      fetchTicket();
      fetchLogs();
    }
  }, [params.id]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || sending || !ticket) return;
    setSending(true);
    try {
      const res = await fetch("/api/tickets/" + params.id + "/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message, isInternal }),
      });
      if (!res.ok) throw new Error("Failed to send");
      const newMessage = await res.json();
      setTicket({ ...ticket, TicketMessage: [...ticket.TicketMessage, newMessage] });
      setMessage("");
      fetchLogs();
    } catch {
      alert("Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(status: string) {
    if (!ticket || updating) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/tickets/" + params.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setTicket({ ...ticket, status: updated.status, updatedAt: updated.updatedAt, closedAt: updated.closedAt });
      fetchLogs();
    } catch {
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

  async function handlePriorityChange(priority: string) {
    if (!ticket || updating) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/tickets/" + params.id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setTicket({ ...ticket, priority: updated.priority, updatedAt: updated.updatedAt });
      fetchLogs();
    } catch {
      alert("Failed to update priority");
    } finally {
      setUpdating(false);
    }
  }

  async function handleAssign(staffId: string | null) {
    if (!ticket || updating) return;
    setUpdating(true);
    try {
      const method = staffId ? "POST" : "DELETE";
      const res = await fetch("/api/tickets/" + params.id + "/assign", {
        method,
        headers: { "Content-Type": "application/json" },
        body: staffId ? JSON.stringify({ staffId }) : undefined,
      });
      if (!res.ok) throw new Error("Failed to update");
      fetchTicket();
      fetchLogs();
    } catch {
      alert("Failed to update assignment");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return (<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>);

  if (error || !ticket) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <p className="text-gray-400">{error || "Ticket not found"}</p>
      <Link href="/staff/tickets" className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Back to Tickets</Link>
    </div>
  );

  const isClosed = ticket.status === "CLOSED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/staff/tickets" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="h-4 w-4" />Back to Tickets
          </Link>
          <h1 className="text-2xl font-bold text-white">{ticket.subject}</h1>
          <div className="flex items-center gap-3 mt-2">
            <TypeBadge type={ticket.type} />
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
            {ticket.isOwnerOnly && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Owner Only</span>
            )}
          </div>
        </div>
        <div className="text-right text-sm text-gray-400">
          <div className="flex items-center gap-2 justify-end"><Clock className="h-4 w-4" />Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</div>
          <div className="flex items-center gap-2 justify-end mt-1"><User className="h-4 w-4" />{ticket.User_Ticket_userIdToUser.name || "Unknown"}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-4">
          <motion.div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 space-y-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Status</label>
              <StatusSelector value={ticket.status} onChange={handleStatusChange} disabled={updating} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Priority</label>
              <PrioritySelector value={ticket.priority} onChange={handlePriorityChange} disabled={updating} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Assigned To</label>
              <StaffSelector value={ticket.User_Ticket_assignedToIdToUser?.id || null} onChange={handleAssign} disabled={updating} />
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50 space-y-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
            {!ticket.User_Ticket_assignedToIdToUser && (
              <button onClick={() => handleAssign((session?.user as any)?.id)} disabled={updating} className="w-full flex items-center gap-2 px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded-lg text-sm transition-colors">
                <UserPlus className="h-4 w-4" />Assign to Me
              </button>
            )}
            {ticket.User_Ticket_assignedToIdToUser?.id === (session?.user as any)?.id && (
              <button onClick={() => handleAssign(null)} disabled={updating} className="w-full flex items-center gap-2 px-3 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg text-sm transition-colors">
                <UserMinus className="h-4 w-4" />Unassign Me
              </button>
            )}
            {!isClosed && (
              <button onClick={() => handleStatusChange("CLOSED")} disabled={updating} className="w-full flex items-center gap-2 px-3 py-2 bg-gray-600/20 hover:bg-gray-600/30 text-gray-400 rounded-lg text-sm transition-colors">
                <Lock className="h-4 w-4" />Close Ticket
              </button>
            )}
            {isClosed && (
              <button onClick={() => handleStatusChange("OPEN")} disabled={updating} className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg text-sm transition-colors">
                <RefreshCw className="h-4 w-4" />Reopen Ticket
              </button>
            )}
          </motion.div>
        </div>

        {/* Center Column - Messages */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {ticket.TicketMessage.map((msg, idx) => {
              const isStaff = ["staff", "admin", "owner"].includes(msg.User.staffRole || "");
              if (msg.isInternal && !["staff", "admin", "owner"].includes(staffRole)) return null;
              return (
                <motion.div key={msg.id} className={cn("p-4 rounded-xl border", msg.isInternal ? "bg-purple-500/5 border-purple-500/20" : isStaff ? "bg-emerald-500/5 border-emerald-500/20" : "bg-gray-800/50 border-gray-700")} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        {msg.User.image ? (<img src={msg.User.image} alt="" className="w-full h-full object-cover" />) : (<span className="text-sm font-medium">{(msg.User.name || "U").charAt(0).toUpperCase()}</span>)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{msg.User.name || "Unknown"}</div>
                        <div className="flex items-center gap-2">
                          {isStaff && <span className="text-xs text-emerald-400">Staff</span>}
                          {msg.isInternal && <span className="text-xs text-purple-400 flex items-center gap-1"><EyeOff className="h-3 w-3" />Internal</span>}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</span>
                  </div>
                  <div className="text-gray-300 whitespace-pre-wrap">{msg.content}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Reply Form */}
          <motion.form onSubmit={handleSendMessage} className="p-4 rounded-xl border border-gray-800 bg-gray-900/50" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Reply to ticket</span>
              <button type="button" onClick={() => setIsInternal(!isInternal)} className={cn("flex items-center gap-2 px-3 py-1 rounded-lg text-xs transition-colors", isInternal ? "bg-purple-500/20 text-purple-400" : "bg-gray-700 text-gray-400 hover:text-white")}>
                {isInternal ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {isInternal ? "Internal Note" : "Public Reply"}
              </button>
            </div>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={isInternal ? "Write an internal note (only visible to staff)..." : "Type your reply..."} className="w-full bg-transparent border-0 text-white placeholder-gray-500 resize-none focus:outline-none" rows={4} disabled={sending} />
            <div className="flex justify-end mt-3">
              <button type="submit" disabled={!message.trim() || sending} className={cn("inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors", isInternal ? "bg-purple-600 hover:bg-purple-500 disabled:opacity-50" : "bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50", "text-white disabled:cursor-not-allowed")}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {isInternal ? "Add Note" : "Send Reply"}
              </button>
            </div>
          </motion.form>
        </div>

        {/* Right Column - Activity */}
        <div className="space-y-4">
          <motion.div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Activity Log</h3>
            <TicketActivityLog logs={logs} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
