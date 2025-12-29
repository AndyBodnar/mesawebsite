import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions, hasStaffAccess, isOwner, StaffRole } from "@/lib/auth";
import { logTicketAction } from "@/lib/tickets";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticket = await db.ticket.findUnique({ where: { id } });
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

    // Non-staff can only reply to their own tickets
    if (ticket.userId !== session.user.id && !isStaff) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (ticket.status === "CLOSED") {
      return NextResponse.json({ error: "Ticket is closed" }, { status: 400 });
    }

    const { content, isInternal } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content required" }, { status: 400 });
    }

    // Only staff can post internal notes
    const messageIsInternal = isStaff && isInternal === true;

    const message = await db.ticketMessage.create({
      data: {
        id: crypto.randomUUID(),
        content: content.trim(),
        ticketId: id,
        userId: session.user.id,
        isInternal: messageIsInternal,
      },
      include: { User: { select: { id: true, name: true, image: true, staffRole: true } } },
    });

    // Update ticket timestamp and set to waiting if staff replied
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (isStaff && !messageIsInternal && ticket.status === "OPEN") {
      updateData.status = "IN_PROGRESS";
    } else if (!isStaff && ticket.status === "WAITING_RESPONSE") {
      updateData.status = "IN_PROGRESS";
    }

    await db.ticket.update({ where: { id }, data: updateData });

    // Log the action
    await logTicketAction(
      id,
      session.user.id,
      messageIsInternal ? "INTERNAL_NOTE" : "MESSAGE_ADDED"
    );

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
