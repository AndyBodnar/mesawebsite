import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const sort = searchParams.get("sort") || "votes";

    const where = status ? { status } : {};

    const suggestions = await db.suggestion.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { votes: true, comments: true } },
      },
      orderBy: sort === "votes" ? { votes: { _count: "desc" } } : { createdAt: "desc" },
    });

    // Calculate net votes for each suggestion
    const withVotes = await Promise.all(
      suggestions.map(async (s) => {
        const votes = await db.suggestionVote.aggregate({
          where: { suggestionId: s.id },
          _sum: { value: true },
        });
        return { ...s, netVotes: votes._sum.value || 0 };
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
        title,
        description,
        category,
        status: "UNDER_REVIEW",
        userId: session.user.id,
      },
    });

    return NextResponse.json(suggestion, { status: 201 });
  } catch (error) {
    console.error("Failed to create suggestion:", error);
    return NextResponse.json({ error: "Failed to create suggestion" }, { status: 500 });
  }
}
