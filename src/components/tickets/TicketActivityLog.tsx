"use client";

import { formatDistanceToNow } from "date-fns";
import { 
  Plus, 
  RefreshCw, 
  UserPlus, 
  UserMinus, 
  MessageSquare, 
  Lock, 
  Unlock,
  AlertTriangle,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  action: string;
  details?: string | null;
  createdAt: string;
  User: { id: string; name: string | null; image: string | null };
}

interface TicketActivityLogProps {
  logs: LogEntry[];
  className?: string;
}

const actionConfig: Record<string, { icon: typeof Plus; label: string; className: string }> = {
  CREATED: { icon: Plus, label: "created this ticket", className: "text-green-400" },
  STATUS_CHANGED: { icon: RefreshCw, label: "changed status", className: "text-blue-400" },
  PRIORITY_CHANGED: { icon: AlertTriangle, label: "changed priority", className: "text-orange-400" },
  ASSIGNED: { icon: UserPlus, label: "assigned", className: "text-emerald-400" },
  UNASSIGNED: { icon: UserMinus, label: "removed assignment", className: "text-yellow-400" },
  MESSAGE_ADDED: { icon: MessageSquare, label: "added a message", className: "text-blue-400" },
  INTERNAL_NOTE: { icon: FileText, label: "added an internal note", className: "text-purple-400" },
  CLOSED: { icon: Lock, label: "closed this ticket", className: "text-gray-400" },
  REOPENED: { icon: Unlock, label: "reopened this ticket", className: "text-green-400" },
};

function parseDetails(details: string | null | undefined): Record<string, string> {
  if (!details) return {};
  try {
    return JSON.parse(details);
  } catch {
    return {};
  }
}

export function TicketActivityLog({ logs, className }: TicketActivityLogProps) {
  if (logs.length === 0) {
    return (
      <div className={cn("text-center py-8 text-white/40 text-sm", className)}>
        No activity yet
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {logs.map((log) => {
        const config = actionConfig[log.action] || { 
          icon: RefreshCw, 
          label: log.action.toLowerCase().replace("_", " "), 
          className: "text-white/50" 
        };
        const Icon = config.icon;
        const details = parseDetails(log.details);

        return (
          <div key={log.id} className="flex items-start gap-3">
            <div className={cn("mt-0.5 p-1.5 rounded-full bg-white/5", config.className)}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-white">{log.User.name || "Unknown"}</span>
                <span className="text-white/50">{config.label}</span>
              </div>
              {details.from && details.to && (
                <div className="text-xs text-white/40 mt-0.5">
                  {details.from} → {details.to}
                </div>
              )}
              {details.staffName && (
                <div className="text-xs text-white/40 mt-0.5">
                  {details.staffName}
                </div>
              )}
              <div className="text-xs text-white/30 mt-1">
                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
