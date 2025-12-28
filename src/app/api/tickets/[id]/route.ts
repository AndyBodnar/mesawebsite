import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
        User_Ticket_assignedToIdToUser: { select: { id: true, name: true, image: true } },
        TicketMessage: {
          include: { User: { select: { id: true, name: true, image: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const isStaff = ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(session.user.role);
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

    const isStaff = ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(session.user.role);
    if (!isStaff) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const ticket = await db.ticket.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    return NextResponse.json(ticket);
  } catch (error) {
    console.error("Failed to update ticket:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}
