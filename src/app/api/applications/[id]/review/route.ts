import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPERADMIN", "MODERATOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status, reviewNotes } = await req.json();

    if (!["ACCEPTED", "DENIED", "UNDER_REVIEW", "INTERVIEW"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const application = await db.application.update({
      where: { id },
      data: {
        status,
        reviewNotes,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Failed to review application:", error);
    return NextResponse.json({ error: "Failed to review application" }, { status: 500 });
  }
}
