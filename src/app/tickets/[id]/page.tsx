"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2, AlertCircle, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { PriorityBadge, StatusBadge, TypeBadge } from "@/components/tickets";

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

interface Ticket {
  id: string;
  type: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "WAITING_RESPONSE" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  User_Ticket_userIdToUser: TicketUser;
  User_Ticket_assignedToIdToUser: TicketUser | null;
  TicketMessage: TicketMessage[];
}

export default function TicketDetailPage() {
  const params = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await fetch("/api/tickets/" + params.id);
        if (!res.ok) {
          if (res.status === 401) setError("Please sign in to view this ticket");
          else if (res.status === 404) setError("Ticket not found");
          else if (res.status === 403) setError("You do not have access to this ticket");
          else setError("Failed to load ticket");
          return;
        }
        const data = await res.json();
        setTicket(data);
      } catch { setError("Failed to load ticket"); }
      finally { setLoading(false); }
    }
    if (params.id) fetchTicket();
  }, [params.id]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || sending || !ticket) return;
    setSending(true);
    try {
      const res = await fetch("/api/tickets/" + params.id + "/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }
      const newMessage = await res.json();
      setTicket({ ...ticket, TicketMessage: [...ticket.TicketMessage, newMessage] });
      setMessage("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send message");
    } finally { setSending(false); }
  }

  if (loading) return (<div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-white/50" /></div>);

  if (error || !ticket) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <p className="text-white/70">{error || "Ticket not found"}</p>
      <Link href="/tickets" className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors">Back to Tickets</Link>
    </div>
  );

  const isClosed = ticket.status === "CLOSED";

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/tickets" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-6"><ArrowLeft className="h-4 w-4" />Back to Tickets</Link>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{ticket.subject}</h1>
              <div className="flex items-center gap-2 mt-2">
                <TypeBadge type={ticket.type} />
                <PriorityBadge priority={ticket.priority} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>
            <div className="text-right text-sm text-white/50">
              <div className="flex items-center gap-2 justify-end"><Clock className="h-4 w-4" /><span>Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span></div>
              {ticket.User_Ticket_assignedToIdToUser && (<div className="flex items-center gap-2 justify-end mt-1"><User className="h-4 w-4" /><span>Assigned to {ticket.User_Ticket_assignedToIdToUser.name}</span></div>)}
            </div>
          </div>
        </motion.div>

        <motion.div className="space-y-4 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          {ticket.TicketMessage.map((msg, idx) => {
            const isStaff = ["staff", "admin", "owner"].includes(msg.User.staffRole || "");
            return (
              <motion.div key={msg.id} className={cn("p-4 rounded-xl border", isStaff ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/5 border-white/10")} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                      {msg.User.image ? (<img src={msg.User.image} alt="" className="w-full h-full object-cover" />) : (<span className="text-sm font-medium">{(msg.User.name || "U").charAt(0).toUpperCase()}</span>)}
                    </div>
                    <div>
                      <div className="font-medium text-white">{msg.User.name || "Unknown"}</div>
                      {isStaff && <span className="text-xs text-emerald-400">Staff</span>}
                    </div>
                  </div>
                  <span className="text-xs text-white/40">{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</span>
                </div>
                <div className="text-white/80 whitespace-pre-wrap">{msg.content}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {!isClosed ? (
          <motion.form onSubmit={handleSendMessage} className="p-4 rounded-xl bg-white/5 border border-white/10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your reply..." className="w-full bg-transparent border-0 text-white placeholder-white/40 resize-none focus:outline-none" rows={4} disabled={sending} />
            <div className="flex justify-end mt-3">
              <button type="submit" disabled={!message.trim() || sending} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Send Reply
              </button>
            </div>
          </motion.form>
        ) : (
          <div className="text-center py-8 text-white/50 rounded-xl bg-white/5 border border-white/10">This ticket is closed. No further replies can be sent.</div>
        )}
      </main>
    </div>
  );
}
