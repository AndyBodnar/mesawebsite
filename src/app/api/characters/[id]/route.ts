import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const character = await db.character.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { id: true, name: true, image: true } },
        gallery: true,
        relationships: {
          include: {
            relatedCharacter: { select: { id: true, firstName: true, lastName: true, image: true } },
          },
        },
        _count: { select: { likes: true } },
      },
    });

    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error("Failed to fetch character:", error);
    return NextResponse.json({ error: "Failed to fetch character" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const character = await db.character.findUnique({ where: { id: params.id } });
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    if (character.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const updated = await db.character.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update character:", error);
    return NextResponse.json({ error: "Failed to update character" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const character = await db.character.findUnique({ where: { id: params.id } });
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    if (character.userId !== session.user.id && !["ADMIN", "SUPERADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.character.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete character:", error);
    return NextResponse.json({ error: "Failed to delete character" }, { status: 500 });
  }
}
