import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const recruiting = searchParams.get("recruiting");

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (recruiting === "true") where.recruiting = true;

    const organizations = await db.organization.findMany({
      where,
      include: {
        leader: { select: { id: true, name: true, image: true } },
        _count: { select: { members: true } },
      },
      orderBy: { members: { _count: "desc" } },
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, type, image } = await req.json();

    const org = await db.organization.create({
      data: {
        name,
        description,
        type,
        image,
        leaderId: session.user.id,
        verified: false,
        recruiting: true,
        members: {
          create: {
            userId: session.user.id,
            role: "LEADER",
          },
        },
      },
    });

    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    console.error("Failed to create organization:", error);
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });
  }
}
