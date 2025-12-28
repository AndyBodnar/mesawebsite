import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, threadId } = await req.json();

    if (!content || !threadId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const thread = await db.forumThread.findUnique({ where: { id: threadId } });
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    if (thread.locked) {
      return NextResponse.json({ error: "Thread is locked" }, { status: 403 });
    }

    const post = await db.forumPost.create({
      data: {
        id: crypto.randomUUID(),
        content,
        threadId,
        authorId: session.user.id,
        updatedAt: new Date(),
      },
      include: {
        User: { select: { id: true, name: true, image: true, role: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
