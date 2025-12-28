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
    if (recruiting === "true") where.recruitmentStatus = "open";

    const organizations = await db.organization.findMany({
      where,
      include: {
        User: { select: { id: true, name: true, image: true } },
        _count: { select: { OrganizationMember: true } },
      },
      orderBy: { OrganizationMember: { _count: "desc" } },
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

    const { name, description, type, logoUrl, characterId } = await req.json();

    if (!characterId) {
      return NextResponse.json({ error: "Character ID is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const timestamp = Date.now();

    const org = await db.organization.create({
      data: {
        id: crypto.randomUUID(),
        name,
        slug: slug + "-" + timestamp,
        description,
        type,
        logoUrl,
        leaderId: session.user.id,
        recruitmentStatus: "open",
        updatedAt: new Date(),
        OrganizationMember: {
          create: {
            id: crypto.randomUUID(),
            userId: session.user.id,
            characterId,
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
