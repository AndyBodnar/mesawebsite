import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where = categorySlug ? { ForumCategory: { slug: categorySlug } } : {};

    const [threads, total] = await Promise.all([
      db.forumThread.findMany({
        where,
        include: {
          User: { select: { id: true, name: true, image: true, role: true } },
          ForumCategory: { select: { id: true, name: true, slug: true } },
          _count: { select: { ForumPost: true } },
        },
        orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.forumThread.count({ where }),
    ]);

    return NextResponse.json({
      threads,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Failed to fetch threads:", error);
    return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, categoryId } = await req.json();

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const thread = await db.forumThread.create({
      data: {
        id: crypto.randomUUID(),
        title,
        slug: `${slug}-${Date.now()}`,
        content,
        authorId: session.user.id,
        categoryId,
        updatedAt: new Date(),
      },
      include: {
        User: { select: { id: true, name: true, image: true } },
        ForumCategory: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json(thread, { status: 201 });
  } catch (error) {
    console.error("Failed to create thread:", error);
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
