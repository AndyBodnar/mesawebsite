import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");

    const where: Record<string, unknown> = { approved: true };
    if (category && category !== "All") where.category = category;

    const [items, total] = await Promise.all([
      db.galleryItem.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.galleryItem.count({ where }),
    ]);

    return NextResponse.json({
      items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Failed to fetch gallery:", error);
    return NextResponse.json({ error: "Failed to fetch gallery" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, category, url, type } = await req.json();

    const item = await db.galleryItem.create({
      data: {
        title,
        description,
        category,
        url,
        type: type || "IMAGE",
        userId: session.user.id,
        approved: false, // Requires approval
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to upload to gallery:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
