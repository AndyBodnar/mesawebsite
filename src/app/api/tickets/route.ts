import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isStaff = ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(session.user.role);
    const where = isStaff ? {} : { userId: session.user.id };

    const tickets = await db.ticket.findMany({
      where,
      include: {
        User_Ticket_userIdToUser: { select: { id: true, name: true, image: true } },
        User_Ticket_assignedToIdToUser: { select: { id: true, name: true } },
        _count: { select: { TicketMessage: true } },
      },
      orderBy: { updatedAt: "desc" },
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

    const ticket = await db.ticket.create({
      data: {
        id: crypto.randomUUID(),
        subject,
        type,
        priority: priority || "MEDIUM",
        status: "OPEN",
        userId: session.user.id,
        updatedAt: new Date(),
        TicketMessage: {
          create: {
            id: crypto.randomUUID(),
            content: message,
            userId: session.user.id,
          },
        },
      },
      include: {
        TicketMessage: true,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
