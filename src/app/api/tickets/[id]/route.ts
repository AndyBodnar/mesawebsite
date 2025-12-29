import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, hasStaffAccess, isOwner, StaffRole } from "@/lib/auth";
import { logTicketAction, formatStatusChange, formatPriorityChange } from "@/lib/tickets";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticket = await db.ticket.findUnique({
      where: { id },
      include: {
        User_Ticket_userIdToUser: { select: { id: true, name: true, image: true } },
        User_Ticket_assignedToIdToUser: { select: { id: true, name: true, image: true, staffRole: true } },
        TicketMessage: {
          where: {
            OR: [
              { isInternal: false },
              // Show internal messages to staff
              ...(hasStaffAccess((session.user.staffRole || "user") as StaffRole) ? [{ isInternal: true }] : []),
            ],
          },
          include: { User: { select: { id: true, name: true, image: true, staffRole: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const staffRole = (session.user.staffRole || "user") as StaffRole;
    const isStaff = hasStaffAccess(staffRole);
    const userIsOwner = isOwner(staffRole);

    // Owner-only tickets can only be accessed by owners
    if (ticket.isOwnerOnly && !userIsOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Non-staff can only see their own tickets
    if (ticket.userId !== session.user.id && !isStaff) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Failed to fetch ticket:", error);
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staffRole = (session.user.staffRole || "user") as StaffRole;
    const isStaff = hasStaffAccess(staffRole);
    const userIsOwner = isOwner(staffRole);

    if (!isStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get current ticket for logging
    const currentTicket = await db.ticket.findUnique({ where: { id } });
    if (!currentTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    // Owner-only tickets can only be modified by owners
    if (currentTicket.isOwnerOnly && !userIsOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    // Log status changes
    if (data.status && data.status !== currentTicket.status) {
      updateData.status = data.status;
      if (data.status === "CLOSED") {
        updateData.closedAt = new Date();
        await logTicketAction(id, session.user.id, "CLOSED");
      } else if (currentTicket.status === "CLOSED") {
        updateData.closedAt = null;
        await logTicketAction(id, session.user.id, "REOPENED");
      } else {
        await logTicketAction(id, session.user.id, "STATUS_CHANGED", formatStatusChange(currentTicket.status, data.status));
      }
    }

    // Log priority changes
    if (data.priority && data.priority !== currentTicket.priority) {
      updateData.priority = data.priority;
      await logTicketAction(id, session.user.id, "PRIORITY_CHANGED", formatPriorityChange(currentTicket.priority, data.priority));
    }

    // Handle type changes (only owner can change to/from owner-only types)
    if (data.type && data.type !== currentTicket.type) {
      updateData.type = data.type;
    }

    const ticket = await db.ticket.update({ where: { id }, data: updateData });
    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Failed to update ticket:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
