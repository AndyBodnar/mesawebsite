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

    const { vote } = await req.json();
    if (![1, -1].includes(vote)) {
      return NextResponse.json({ error: "Invalid vote value" }, { status: 400 });
    }

    const existing = await db.suggestionVote.findFirst({
      where: { suggestionId: id, userId: session.user.id },
    });

    if (existing) {
      if (existing.vote === vote) {
        await db.suggestionVote.delete({ where: { id: existing.id } });
        return NextResponse.json({ action: "removed" });
      } else {
        await db.suggestionVote.update({ where: { id: existing.id }, data: { vote } });
        return NextResponse.json({ action: "changed", vote });
      }
    }

    await db.suggestionVote.create({
      data: { id: crypto.randomUUID(), vote, suggestionId: id, userId: session.user.id },
    });

    return NextResponse.json({ action: "added", vote }, { status: 201 });
  } catch (error) {
    console.error("Failed to vote:", error);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
