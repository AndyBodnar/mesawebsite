import { db } from "./db";
import { StaffRole } from "./auth";

// Ticket action types for logging
export type TicketAction =
  | "CREATED"
  | "STATUS_CHANGED"
  | "PRIORITY_CHANGED"
  | "ASSIGNED"
  | "UNASSIGNED"
  | "MESSAGE_ADDED"
  | "INTERNAL_NOTE"
  | "CLOSED"
  | "REOPENED";

// Ticket type configuration
export const TICKET_TYPES = [
  { value: "Bug", label: "Bug Report", desc: "Something is broken or not working correctly", minRole: "user" as StaffRole },
  { value: "Support", label: "Support Request", desc: "Need help with your account or features", minRole: "user" as StaffRole },
  { value: "Report", label: "Player Report", desc: "Report a player for rule violations", minRole: "user" as StaffRole },
  { value: "Appeal", label: "Ban Appeal", desc: "Appeal a ban or punishment", minRole: "user" as StaffRole },
  { value: "Internal", label: "Internal Report", desc: "Owner-only internal report", minRole: "owner" as StaffRole, ownerOnly: true },
  { value: "Staff", label: "Staff Inquiry", desc: "Owner-only staff inquiry", minRole: "owner" as StaffRole, ownerOnly: true },
  { value: "Other", label: "Other", desc: "General inquiries or other issues", minRole: "user" as StaffRole },
] as const;

export const TICKET_PRIORITIES = [
  { value: "LOW", label: "Low", desc: "Not urgent, can wait", color: "gray" },
  { value: "MEDIUM", label: "Medium", desc: "Normal priority", color: "blue" },
  { value: "HIGH", label: "High", desc: "Important issue", color: "orange" },
  { value: "URGENT", label: "Urgent", desc: "Requires immediate attention", color: "red" },
] as const;

export const TICKET_STATUSES = [
  { value: "OPEN", label: "Open", color: "blue" },
  { value: "IN_PROGRESS", label: "In Progress", color: "yellow" },
  { value: "WAITING_RESPONSE", label: "Waiting", color: "orange" },
  { value: "RESOLVED", label: "Resolved", color: "green" },
  { value: "CLOSED", label: "Closed", color: "gray" },
] as const;

// Get ticket types available for a role
export function getTicketTypesForRole(staffRole: StaffRole) {
  const roleLevel = getRoleLevel(staffRole);
  return TICKET_TYPES.filter((type) => {
    const typeLevel = getRoleLevel(type.minRole);
    return roleLevel >= typeLevel;
  });
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

// Check if a ticket type requires owner-only access
export function isOwnerOnlyType(type: string): boolean {
  const ticketType = TICKET_TYPES.find((t) => t.value === type);
  return (ticketType as { ownerOnly?: boolean } | undefined)?.ownerOnly === true;
}

// Log a ticket action
export async function logTicketAction(
  ticketId: string,
  userId: string,
  action: TicketAction,
  details?: string
): Promise<void> {
  try {
    await db.ticketLog.create({
      data: {
        ticketId,
        userId,
        action,
        details,
      },
    });
  } catch (error) {
    console.error("Failed to log ticket action:", error);
  }
}

// Format log details for status changes
export function formatStatusChange(oldStatus: string, newStatus: string): string {
  return JSON.stringify({ from: oldStatus, to: newStatus });
}

// Format log details for priority changes
export function formatPriorityChange(oldPriority: string, newPriority: string): string {
  return JSON.stringify({ from: oldPriority, to: newPriority });
}

// Format log details for assignment changes
export function formatAssignment(staffId: string | null, staffName: string | null): string {
  return JSON.stringify({ staffId, staffName });
}
