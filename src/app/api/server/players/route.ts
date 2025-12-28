import { NextResponse } from "next/server";

// FiveM player list for live map
export async function GET() {
  try {
    const serverIp = process.env.FIVEM_SERVER_IP || "127.0.0.1";
    const serverPort = process.env.FIVEM_SERVER_PORT || "30120";

    const response = await fetch(`http://${serverIp}:${serverPort}/players.json`, {
      next: { revalidate: 5 }, // Refresh every 5 seconds
    });

    if (!response.ok) {
      throw new Error("Failed to fetch players");
    }

    const players = await response.json();

    // Map to simpler format with position data from custom endpoint
    // This requires a server-side script to expose player positions
    const formatted = players.map((p: { id: number; name: string; identifiers: string[] }) => ({
      id: p.id,
      name: p.name,
      // Position would come from a custom FiveM resource
      // For now, return placeholder
      position: { x: 0, y: 0, z: 0 },
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json([]);
  }
}
