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

    const { characterId } = await req.json();

    if (!characterId) {
      return NextResponse.json({ error: "Character ID is required" }, { status: 400 });
    }

    const org = await db.organization.findUnique({ where: { id } });
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (org.recruitmentStatus !== "open") {
      return NextResponse.json({ error: "Organization is not recruiting" }, { status: 400 });
    }

    const existing = await db.organizationMember.findFirst({
      where: { orgId: id, characterId },
    });

    if (existing) {
      return NextResponse.json({ error: "Already a member" }, { status: 400 });
    }

    await db.organizationMember.create({
      data: { id: crypto.randomUUID(), orgId: id, userId: session.user.id, characterId, role: "MEMBER" },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Failed to join organization:", error);
    return NextResponse.json({ error: "Failed to join" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const membership = await db.organizationMember.findFirst({
      where: { orgId: id, userId: session.user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not a member" }, { status: 400 });
    }

    if (membership.role === "LEADER") {
      return NextResponse.json({ error: "Leaders cannot leave, transfer ownership first" }, { status: 400 });
    }

    await db.organizationMember.delete({ where: { id: membership.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to leave organization:", error);
    return NextResponse.json({ error: "Failed to leave" }, { status: 500 });
  }
}
