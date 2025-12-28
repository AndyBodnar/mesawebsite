"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Loader2, AlertCircle, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface TicketUser {
  id: string;
  name: string | null;
  image: string | null;
  role?: string;
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
export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function fetchTicket() {
      try {
        const res = await fetch(`/api/tickets/${params.id}`);
        if (!res.ok) {
          if (res.status === 401) {
            setError("Please sign in to view this ticket");
          } else if (res.status === 404) {
            setError("Ticket not found");
          } else if (res.status === 403) {
            setError("You do not have access to this ticket");
          } else {
            setError("Failed to load ticket");
          }
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
    if (params.id) {
      fetchTicket();
    }
  }, [params.id]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || sending || !ticket) return;

    setSending(true);
    try {
      const res = await fetch(`/api/tickets/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }
      const newMessage = await res.json();
      setTicket({
        ...ticket,
        TicketMessage: [...ticket.TicketMessage, newMessage],
      });
      setMessage("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }
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

  if (error || !ticket) {
    return (
      <div className="relative">
        <main className="wrap">
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-white/70">{error || "Ticket not found"}</p>
            <Link href="/tickets" className="btn primary">
              Back to Tickets
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const displayStatus = statusMap[ticket.status] || ticket.status;
  const displayPriority = priorityMap[ticket.priority] || ticket.priority;
  const isClosed = ticket.status === "CLOSED";
  return (
    <div className="relative">
      <main className="wrap">
        <section className="main full">
          <div className="crumbs">
            <Link href="/tickets" className="flex items-center gap-2 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Link>
          </div>

          <div className="headRow">
            <div>
              <h1>{ticket.subject}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="tag">{ticket.type}</span>
                <span className={cn("tag", (ticket.priority === "HIGH" || ticket.priority === "URGENT") && "hot")}>
                  {displayPriority}
                </span>
                <span className={cn("tag", isClosed && "lock")}>{displayStatus}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Created {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span>
              </div>
              {ticket.User_Ticket_assignedToIdToUser && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Assigned to {ticket.User_Ticket_assignedToIdToUser.name}</span>
                </div>
              )}
            </div>
          </div>
          <div className="messages">
            {ticket.TicketMessage.map((msg, idx) => {
              const isStaff = ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(msg.User.role || "");
              return (
                <motion.div
                  key={msg.id}
                  className={cn("message", isStaff && "staff")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="msg-header">
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        {msg.User.image ? (
                          <img src={msg.User.image} alt={msg.User.name || "User"} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span>{(msg.User.name || "U").charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{msg.User.name || "Unknown"}</div>
                        {isStaff && <span className="text-xs text-emerald-400">Staff</span>}
                      </div>
                    </div>
                    <span className="text-xs text-white/40">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="msg-content">
                    {msg.content}
                  </div>
                </motion.div>
              );
            })}
          </div>
          {!isClosed ? (
            <form onSubmit={handleSendMessage} className="reply-form">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your reply..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/40 resize-none focus:outline-none focus:border-white/20"
                rows={4}
                disabled={sending}
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!message.trim() || sending}
                  className="btn primary flex items-center gap-2"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  Send Reply
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 text-white/50">
              This ticket is closed. No further replies can be sent.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
