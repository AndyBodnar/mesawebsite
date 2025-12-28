import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const article = await db.newsArticle.findUnique({
      where: { slug },
      include: {
        User: { select: { id: true, name: true, image: true, role: true } },
        NewsComment: {
          include: { User: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { NewsComment: true } },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Failed to fetch article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await db.newsArticle.delete({ where: { slug } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete article:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
