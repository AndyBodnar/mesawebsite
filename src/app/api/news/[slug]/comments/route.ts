import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const article = await db.newsArticle.findUnique({ where: { slug: params.slug } });
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const { content } = await req.json();

    const comment = await db.newsComment.create({
      data: {
        content,
        articleId: article.id,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Failed to create comment:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}
