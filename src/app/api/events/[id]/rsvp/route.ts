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

    const event = await db.event.findUnique({
      where: { id: params.id },
      include: { _count: { select: { rsvps: true } } },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if already RSVPed
    const existing = await db.eventRsvp.findFirst({
      where: { eventId: params.id, userId: session.user.id },
    });

    if (existing) {
      // Toggle RSVP
      await db.eventRsvp.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed" });
    }

    // Check max attendees
    if (event.maxAttendees && event._count.rsvps >= event.maxAttendees) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    await db.eventRsvp.create({
      data: {
        eventId: params.id,
        userId: session.user.id,
        status: "GOING",
      },
    });

    return NextResponse.json({ action: "added" }, { status: 201 });
  } catch (error) {
    console.error("Failed to RSVP:", error);
    return NextResponse.json({ error: "Failed to RSVP" }, { status: 500 });
  }
}
