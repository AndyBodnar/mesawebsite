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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const templateId = searchParams.get("templateId");

    const isStaff = ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(session.user.role);

    const where: Record<string, unknown> = isStaff ? {} : { userId: session.user.id };
    if (status) where.status = status;
    if (templateId) where.templateId = templateId;

    const applications = await db.application.findMany({
      where,
      include: {
        User: { select: { id: true, name: true, image: true } },
        ApplicationTemplate: { select: { id: true, name: true, type: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { templateId, responses } = await req.json();

    const existing = await db.application.findFirst({
      where: { userId: session.user.id, templateId, status: "PENDING" },
    });

    if (existing) {
      return NextResponse.json({ error: "You already have a pending application of this type" }, { status: 400 });
    }

    const application = await db.application.create({
      data: {
        id: crypto.randomUUID(),
        templateId,
        responses: JSON.stringify(responses),
        userId: session.user.id,
        status: "PENDING",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Failed to create application:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}
