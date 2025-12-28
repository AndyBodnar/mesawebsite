import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const type = searchParams.get("type");

    const where: Record<string, unknown> = { approved: true };
    if (type && type !== "All") where.type = type;

    const [items, total] = await Promise.all([
      db.galleryItem.findMany({
        where,
        include: {
          User: { select: { id: true, name: true, image: true } },
          _count: { select: { GalleryComment: true } },
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

    const { caption, url, type } = await req.json();

    const item = await db.galleryItem.create({
      data: {
        id: crypto.randomUUID(),
        caption,
        url,
        type: type || "image",
        userId: session.user.id,
        approved: false,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to upload to gallery:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
