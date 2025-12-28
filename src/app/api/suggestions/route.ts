import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Suggestion_status } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as Suggestion_status | null;
    const sort = searchParams.get("sort") || "votes";

    const where = status ? { status } : {};

    const suggestions = await db.suggestion.findMany({
      where,
      include: {
        User: { select: { id: true, name: true, image: true } },
        _count: { select: { SuggestionVote: true } },
      },
      orderBy: sort === "votes" ? { SuggestionVote: { _count: "desc" } } : { createdAt: "desc" },
    });

    // Calculate net votes for each suggestion
    const withVotes = await Promise.all(
      suggestions.map(async (s) => {
        const votes = await db.suggestionVote.aggregate({
          where: { suggestionId: s.id },
          _sum: { vote: true },
        });
        return { ...s, netVotes: votes._sum.vote || 0 };
      })
    );

    return NextResponse.json(withVotes);
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, category } = await req.json();

    const suggestion = await db.suggestion.create({
      data: {
        id: crypto.randomUUID(),
        title,
        description,
        category,
        status: "NEW",
        userId: session.user.id,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(suggestion, { status: 201 });
  } catch (error) {
    console.error("Failed to create suggestion:", error);
    return NextResponse.json({ error: "Failed to create suggestion" }, { status: 500 });
  }
}
