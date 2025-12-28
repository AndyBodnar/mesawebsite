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

    const { postId, type } = await req.json();

    if (!postId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const validTypes = ["LIKE", "HEART", "LAUGH", "SAD", "ANGRY"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid reaction type" }, { status: 400 });
    }

    // Check if reaction exists
    const existing = await db.forumReaction.findFirst({
      where: { postId, userId: session.user.id },
    });

    if (existing) {
      if (existing.type === type) {
        // Remove reaction if same type
        await db.forumReaction.delete({ where: { id: existing.id } });
        return NextResponse.json({ action: "removed" });
      } else {
        // Update reaction type
        await db.forumReaction.update({
          where: { id: existing.id },
          data: { type },
        });
        return NextResponse.json({ action: "updated", type });
      }
    }

    // Create new reaction
    await db.forumReaction.create({
      data: {
        id: crypto.randomUUID(),
        type,
        postId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ action: "added", type }, { status: 201 });
  } catch (error) {
    console.error("Failed to handle reaction:", error);
    return NextResponse.json({ error: "Failed to handle reaction" }, { status: 500 });
  }
}
