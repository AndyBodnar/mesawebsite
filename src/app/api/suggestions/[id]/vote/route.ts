import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { value } = await req.json();
    if (![1, -1].includes(value)) {
      return NextResponse.json({ error: "Invalid vote value" }, { status: 400 });
    }

    const existing = await db.suggestionVote.findFirst({
      where: { suggestionId: id, userId: session.user.id },
    });

    if (existing) {
      if (existing.value === value) {
        await db.suggestionVote.delete({ where: { id: existing.id } });
        return NextResponse.json({ action: "removed" });
      } else {
        await db.suggestionVote.update({ where: { id: existing.id }, data: { value } });
        return NextResponse.json({ action: "changed", value });
      }
    }

    await db.suggestionVote.create({
      data: { value, suggestionId: id, userId: session.user.id },
    });

    return NextResponse.json({ action: "added", value }, { status: 201 });
  } catch (error) {
    console.error("Failed to vote:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
