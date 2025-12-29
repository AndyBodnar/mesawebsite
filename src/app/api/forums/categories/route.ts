import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const categories = await db.forumCategory.findMany({
      include: {
        _count: { select: { ForumThread: true } },
        ForumThread: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { User: { select: { id: true, name: true } } },
        },
      },
      orderBy: { order: "asc" },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formatted = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      threadCount: cat._count.ForumThread,
      latestThread: cat.ForumThread[0] || null,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
