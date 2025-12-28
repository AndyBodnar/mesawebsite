import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const thread = await db.forumThread.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true, role: true, createdAt: true } },
        category: { select: { id: true, name: true, slug: true } },
        posts: {
          include: {
            author: { select: { id: true, name: true, image: true, role: true, createdAt: true } },
            reactions: true,
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { posts: true } },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    await db.forumThread.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(thread);
  } catch (error) {
    console.error("Failed to fetch thread:", error);
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thread = await db.forumThread.findUnique({ where: { id } });
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const isAuthor = thread.authorId === session.user.id;
    const isStaff = ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(session.user.role);

    if (!isAuthor && !isStaff) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const allowedFields = isStaff ? ["title", "content", "pinned", "locked"] : ["title", "content"];
    const updateData: Record<string, unknown> = {};
    allowedFields.forEach((field) => {
      if (data[field] !== undefined) updateData[field] = data[field];
    });

    const updated = await db.forumThread.update({ where: { id }, data: updateData });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update thread:", error);
    return NextResponse.json({ error: "Failed to update thread" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const thread = await db.forumThread.findUnique({ where: { id } });
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const isAuthor = thread.authorId === session.user.id;
    const isStaff = ["ADMIN", "SUPERADMIN", "MODERATOR"].includes(session.user.role);

    if (!isAuthor && !isStaff) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.forumThread.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete thread:", error);
    return NextResponse.json({ error: "Failed to delete thread" }, { status: 500 });
  }
}
