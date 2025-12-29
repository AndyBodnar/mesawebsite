"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { PriorityBadge, StatusBadge, TypeBadge } from "./TicketBadges";

interface TicketCardProps {
  ticket: {
    id: string;
    subject: string;
    type: string;
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    status: "OPEN" | "IN_PROGRESS" | "WAITING_RESPONSE" | "RESOLVED" | "CLOSED";
    createdAt: string;
    updatedAt: string;
    User_Ticket_userIdToUser?: { id: string; name: string | null; image: string | null };
    User_Ticket_assignedToIdToUser?: { id: string; name: string | null; image: string | null } | null;
    _count?: { TicketMessage: number };
  };
  href?: string;
  showUser?: boolean;
  className?: string;
}

export function TicketCard({ ticket, href, showUser = false, className }: TicketCardProps) {
  const linkHref = href || `/tickets/${ticket.id}`;
  const messageCount = ticket._count?.TicketMessage || 0;

  return (
    <Link
      href={linkHref}
      className={cn(
        "block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/[0.07] transition-all",
        ticket.status === "CLOSED" && "opacity-60",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{ticket.subject}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <TypeBadge type={ticket.type} />
            <PriorityBadge priority={ticket.priority} />
            <StatusBadge status={ticket.status} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 text-xs text-white/50 shrink-0">
          <span>{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</span>
          <div className="flex items-center gap-3">
            {messageCount > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {messageCount}
              </span>
            )}
            {ticket.User_Ticket_assignedToIdToUser && (
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {ticket.User_Ticket_assignedToIdToUser.name?.split(" ")[0] || "Staff"}
              </span>
            )}
          </div>
        </div>
      </div>
      {showUser && ticket.User_Ticket_userIdToUser && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-white/50">
          {ticket.User_Ticket_userIdToUser.image ? (
            <img
              src={ticket.User_Ticket_userIdToUser.image}
              alt=""
              className="w-5 h-5 rounded-full"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
              {(ticket.User_Ticket_userIdToUser.name || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <span>{ticket.User_Ticket_userIdToUser.name || "Unknown"}</span>
        </div>
      )}
    </Link>
  );
}
