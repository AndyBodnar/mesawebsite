import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, hasStaffAccess, isOwner, StaffRole } from "@/lib/auth";
import { logTicketAction, formatAssignment } from "@/lib/tickets";

// Assign staff to ticket
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staffRole = (session.user.staffRole || "user") as StaffRole;
    if (!hasStaffAccess(staffRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ticket = await db.ticket.findUnique({ where: { id } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Owner-only tickets can only be assigned by owners
    if (ticket.isOwnerOnly && !isOwner(staffRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { staffId } = await req.json();

    // Verify target is a staff member
    const targetStaff = await db.user.findUnique({
      where: { id: staffId },
      select: { id: true, name: true, staffRole: true },
    });

    if (!targetStaff || !hasStaffAccess((targetStaff.staffRole || "user") as StaffRole)) {
      return NextResponse.json({ error: "Invalid staff member" }, { status: 400 });
    }

    const updatedTicket = await db.ticket.update({
      where: { id },
      data: {
        assignedToId: staffId,
        updatedAt: new Date(),
      },
      include: {
        User_Ticket_assignedToIdToUser: { select: { id: true, name: true, image: true } },
      },
    });

    await logTicketAction(id, session.user.id, "ASSIGNED", formatAssignment(staffId, targetStaff.name));

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Failed to assign ticket:", error);
    return NextResponse.json({ error: "Failed to assign ticket" }, { status: 500 });
  }
}

// Remove assignment
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staffRole = (session.user.staffRole || "user") as StaffRole;
    if (!hasStaffAccess(staffRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ticket = await db.ticket.findUnique({
      where: { id },
      include: { User_Ticket_assignedToIdToUser: { select: { name: true } } },
    });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    if (ticket.isOwnerOnly && !isOwner(staffRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const previousAssignee = ticket.User_Ticket_assignedToIdToUser?.name || null;

    const updatedTicket = await db.ticket.update({
      where: { id },
      data: {
        assignedToId: null,
        updatedAt: new Date(),
      },
    });

    await logTicketAction(id, session.user.id, "UNASSIGNED", formatAssignment(null, previousAssignee));

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Failed to unassign ticket:", error);
    return NextResponse.json({ error: "Failed to unassign ticket" }, { status: 500 });
  }
}
