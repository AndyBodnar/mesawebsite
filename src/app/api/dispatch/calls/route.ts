import { NextRequest, NextResponse } from "next/server";

// In-memory store (use Redis in production)
let activeCalls: Record<string, unknown>[] = [];

export async function GET() {
  return NextResponse.json(activeCalls);
}

export async function POST(req: NextRequest) {
  try {
    const { secret, calls } = await req.json();

    // Validate secret
    if (secret !== process.env.FIVEM_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    activeCalls = calls || [];

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update calls:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
