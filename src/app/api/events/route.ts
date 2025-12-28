import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const upcoming = searchParams.get("upcoming") === "true";
    const type = searchParams.get("type");

    const where: Record<string, unknown> = {};
    if (upcoming) {
      where.startTime = { gte: new Date() };
    }
    if (type) {
      where.type = type;
    }

    const events = await db.event.findMany({
      where,
      include: {
        User: { select: { id: true, name: true, image: true } },
        _count: { select: { EventRsvp: true } },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, location, startTime, endTime, type, recurring, maxAttendees } = await req.json();

    // Check permissions for Server events
    if (type === "Server") {
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });

      if (!user || !["ADMIN", "SUPERADMIN"].includes(user.role)) {
        return NextResponse.json({ error: "Only admins can create server events" }, { status: 403 });
      }
    }

    // Validate required fields
    if (!title || !description || !startTime || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const event = await db.event.create({
      data: {
        id: crypto.randomUUID(),
        title,
        description,
        location,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        type,
        recurring,
        maxAttendees,
        authorId: session.user.id,
        updatedAt: new Date(),
      },
      include: {
        User: { select: { id: true, name: true, image: true } },
        _count: { select: { EventRsvp: true } },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
