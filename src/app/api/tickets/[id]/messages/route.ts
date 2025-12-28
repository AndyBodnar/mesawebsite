import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ticket = await db.ticket.findUnique({ where: { id: params.id } });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const isStaff = ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(session.user.role);
    if (ticket.userId !== session.user.id && !isStaff) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (ticket.status === "CLOSED") {
      return NextResponse.json({ error: "Ticket is closed" }, { status: 400 });
    }

    const { content } = await req.json();

    const message = await db.ticketMessage.create({
      data: {
        content,
        ticketId: params.id,
        userId: session.user.id,
        isStaff,
      },
      include: {
        user: { select: { id: true, name: true, image: true, role: true } },
      },
    });

    // Update ticket timestamp
    await db.ticket.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
