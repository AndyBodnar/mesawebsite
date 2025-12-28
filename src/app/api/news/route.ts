import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured") === "true";

    const where = featured ? { featured: true } : {};

    const [articles, total] = await Promise.all([
      db.newsArticle.findMany({
        where: { ...where, published: true },
        include: {
          User: { select: { id: true, name: true, image: true } },
          _count: { select: { NewsComment: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.newsArticle.count({ where: { ...where, published: true } }),
    ]);

    return NextResponse.json({
      articles,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, excerpt, category, featured, coverImage } = await req.json();

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const article = await db.newsArticle.create({
      data: {
        id: crypto.randomUUID(),
        title,
        slug: `${slug}-${Date.now()}`,
        content,
        excerpt,
        category,
        featured: featured || false,
        coverImage,
        authorId: session.user.id,
        published: true,
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Failed to create article:", error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
