import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const userId = searchParams.get("userId");

    const where = userId ? { userId } : {};

    const [characters, total] = await Promise.all([
      db.character.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, image: true } },
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.character.count({ where }),
    ]);

    return NextResponse.json({
      characters,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Failed to fetch characters:", error);
    return NextResponse.json({ error: "Failed to fetch characters" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, nickname, backstory, faction, image } = await req.json();

    const character = await db.character.create({
      data: {
        firstName,
        lastName,
        nickname,
        backstory,
        faction,
        image,
        userId: session.user.id,
      },
    });

    return NextResponse.json(character, { status: 201 });
  } catch (error) {
    console.error("Failed to create character:", error);
    return NextResponse.json({ error: "Failed to create character" }, { status: 500 });
  }
}
