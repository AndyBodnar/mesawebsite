import { NextRequest, NextResponse } from "next/server";

// In-memory store (use Redis in production)
let activeUnits: Record<string, unknown>[] = [];

export async function GET() {
  return NextResponse.json(activeUnits);
}

export async function POST(req: NextRequest) {
  try {
    const { secret, units } = await req.json();

    // Validate secret
    if (secret !== process.env.FIVEM_API_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    activeUnits = units || [];

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update units:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
