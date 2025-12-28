import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const org = await db.organization.findUnique({
      where: { id },
      include: {
        User: { select: { id: true, name: true, image: true } },
        OrganizationMember: {
          include: { User: { select: { id: true, name: true, image: true } } },
          orderBy: { role: "asc" },
        },
        _count: { select: { OrganizationMember: true } },
      },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }
    return NextResponse.json(org);
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const org = await db.organization.findUnique({ where: { id } });
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const isLeader = org.leaderId === session.user.id;
    const isAdmin = ["ADMIN", "SUPERADMIN"].includes(session.user.role);

    if (!isLeader && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const updated = await db.organization.update({ where: { id }, data: { ...data, updatedAt: new Date() } });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update organization:", error);
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}
