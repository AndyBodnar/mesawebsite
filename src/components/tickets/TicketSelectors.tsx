"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { TICKET_TYPES, TICKET_PRIORITIES, TICKET_STATUSES } from "@/lib/tickets";
import { StaffRole } from "@/lib/auth";

interface TypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  staffRole?: StaffRole;
  disabled?: boolean;
  className?: string;
}

export function TypeSelector({ value, onChange, staffRole = "user", disabled, className }: TypeSelectorProps) {
  const roleLevel = getRoleLevel(staffRole);
  const availableTypes = TICKET_TYPES.filter((type) => {
    const typeLevel = getRoleLevel(type.minRole);
    return roleLevel >= typeLevel;
  });

  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="" className="bg-zinc-900">Select type...</option>
        {availableTypes.map((type) => (
          <option key={type.value} value={type.value} className="bg-zinc-900">
            {type.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
    </div>
  );
}

interface PrioritySelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function PrioritySelector({ value, onChange, disabled, className }: PrioritySelectorProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {TICKET_PRIORITIES.map((priority) => (
          <option key={priority.value} value={priority.value} className="bg-zinc-900">
            {priority.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
    </div>
  );
}

interface StatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function StatusSelector({ value, onChange, disabled, className }: StatusSelectorProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {TICKET_STATUSES.map((status) => (
          <option key={status.value} value={status.value} className="bg-zinc-900">
            {status.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
    </div>
  );
}

interface StaffSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  className?: string;
}

export function StaffSelector({ value, onChange, disabled, className }: StaffSelectorProps) {
  const [staffList, setStaffList] = useState<Array<{ id: string; name: string | null; staffRole: string | null }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch("/api/staff");
        if (res.ok) {
          const data = await res.json();
          setStaffList(data);
        }
      } catch {}
      finally { setLoading(false); }
    }
    fetchStaff();
  }, []);

  return (
    <div className={cn("relative", className)}>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
        disabled={disabled || loading}
        className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="" className="bg-zinc-900">Unassigned</option>
        {staffList.map((staff) => (
          <option key={staff.id} value={staff.id} className="bg-zinc-900">
            {staff.name || "Unknown"} ({staff.staffRole})
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
    </div>
  );
}

function getRoleLevel(role: StaffRole): number {
  switch (role) {
    case "owner": return 3;
    case "admin": return 2;
    case "staff": return 1;
    case "user": return 0;
    default: return 0;
  }
}
