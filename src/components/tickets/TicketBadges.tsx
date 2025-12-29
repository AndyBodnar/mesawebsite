"use client";

import { cn } from "@/lib/utils";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type Status = "OPEN" | "IN_PROGRESS" | "WAITING_RESPONSE" | "RESOLVED" | "CLOSED";

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  LOW: { label: "Low", className: "bg-gray-500/20 text-gray-300 border-gray-500/30" },
  MEDIUM: { label: "Medium", className: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  HIGH: { label: "High", className: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  URGENT: { label: "Urgent", className: "bg-red-500/20 text-red-300 border-red-500/30 animate-pulse" },
};

const statusConfig: Record<Status, { label: string; className: string }> = {
  OPEN: { label: "Open", className: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  IN_PROGRESS: { label: "In Progress", className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  WAITING_RESPONSE: { label: "Waiting", className: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  RESOLVED: { label: "Resolved", className: "bg-green-500/20 text-green-300 border-green-500/30" },
  CLOSED: { label: "Closed", className: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
};

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.MEDIUM;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.OPEN;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        "bg-white/5 text-white/70 border-white/10",
        className
      )}
    >
      {type}
    </span>
  );
}
