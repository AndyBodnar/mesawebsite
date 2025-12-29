import { NextRequest, NextResponse } from "next/server";

// In-memory store (use Redis in production for better scaling)
let playerPositions: Record<string, unknown>[] = [];
let lastUpdate = Date.now();

export async function GET() {
  return NextResponse.json({
    players: playerPositions,
    lastUpdate,
    count: playerPositions.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const { secret, players } = await req.json();

    // Validate secret from FiveM server
    if (secret !== process.env.FIVEM_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    playerPositions = players || [];
    lastUpdate = Date.now();

    return NextResponse.json({ success: true, received: playerPositions.length });
  } catch (error) {
    console.error("Failed to update positions:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
