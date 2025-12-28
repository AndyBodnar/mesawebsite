import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = await db.event.findUnique({
      where: { id },
      include: { _count: { select: { rsvps: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const existing = await db.eventRsvp.findFirst({
      where: { eventId: id, userId: session.user.id },
    });

    if (existing) {
      await db.eventRsvp.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed" });
    }

    if (event.maxAttendees && event._count.rsvps >= event.maxAttendees) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    await db.eventRsvp.create({
      data: { eventId: id, userId: session.user.id, status: "GOING" },
    });

    return NextResponse.json({ action: "added" }, { status: 201 });
  } catch (error) {
    console.error("Failed to RSVP:", error);
    return NextResponse.json({ error: "Failed to RSVP" }, { status: 500 });
  }
}
