import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, hasStaffAccess, isOwner, StaffRole } from "@/lib/auth";
import { logTicketAction, isOwnerOnlyType, getTicketTypesForRole } from "@/lib/tickets";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staffRole = (session.user.staffRole || "user") as StaffRole;
    const isStaff = hasStaffAccess(staffRole);
    const userIsOwner = isOwner(staffRole);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const type = searchParams.get("type");
    const assigned = searchParams.get("assigned");

    // Build where clause
    const where: Record<string, unknown> = {};

    // Access control
    if (isStaff) {
      // Staff see all tickets EXCEPT owner-only tickets (unless they are owner)
      if (!userIsOwner) {
        where.isOwnerOnly = false;
      }
    } else {
      // Regular users only see their own tickets
      where.userId = session.user.id;
    }

    // Apply filters
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (type) where.type = type;
    if (assigned === "unassigned") where.assignedToId = null;
    if (assigned === "me") where.assignedToId = session.user.id;

    const tickets = await db.ticket.findMany({
      where,
      include: {
        User_Ticket_userIdToUser: { select: { id: true, name: true, image: true } },
        User_Ticket_assignedToIdToUser: { select: { id: true, name: true, image: true } },
        _count: { select: { TicketMessage: true } },
      },
      orderBy: [
        { priority: "desc" },
        { updatedAt: "desc" },
      ],
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, type, priority, message } = await req.json();

    if (!subject?.trim() || !type || !message?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const staffRole = (session.user.staffRole || "user") as StaffRole;
    const userIsOwner = isOwner(staffRole);

    // Check if user can create this ticket type
    const allowedTypes = getTicketTypesForRole(staffRole);
    const typeConfig = allowedTypes.find((t) => t.value === type);

    if (!typeConfig) {
      return NextResponse.json({ error: "Invalid ticket type for your role" }, { status: 403 });
    }

    // Set owner-only flag based on type
    const ticketIsOwnerOnly = isOwnerOnlyType(type);
    if (ticketIsOwnerOnly && !userIsOwner) {
      return NextResponse.json({ error: "Only owners can create this ticket type" }, { status: 403 });
    }

    const ticketId = crypto.randomUUID();
    const ticket = await db.ticket.create({
      data: {
        id: ticketId,
        subject: subject.trim(),
        type,
        priority: priority || "MEDIUM",
        status: "OPEN",
        isOwnerOnly: ticketIsOwnerOnly,
        userId: session.user.id,
        updatedAt: new Date(),
        TicketMessage: {
          create: {
            id: crypto.randomUUID(),
            content: message.trim(),
            userId: session.user.id,
          },
        },
      },
      include: {
        TicketMessage: true,
      },
    });

    // Log the creation
    await logTicketAction(ticketId, session.user.id, "CREATED", JSON.stringify({ type, priority, subject }));

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
