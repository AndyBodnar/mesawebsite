import { NextResponse } from "next/server";

// FiveM server status endpoint
export async function GET() {
  try {
    const serverIp = process.env.FIVEM_SERVER_IP || "127.0.0.1";
    const serverPort = process.env.FIVEM_SERVER_PORT || "30120";

    // Fetch player count from FiveM server
    const response = await fetch(`http://${serverIp}:${serverPort}/players.json`, {
      next: { revalidate: 30 }, // Cache for 30 seconds
    });

    if (!response.ok) {
      throw new Error("Server offline");
    }

    const players = await response.json();

    // Fetch server info
    const infoResponse = await fetch(`http://${serverIp}:${serverPort}/info.json`, {
      next: { revalidate: 60 },
    });

    const serverInfo = infoResponse.ok ? await infoResponse.json() : { vars: {} };

    return NextResponse.json({
      online: true,
      players: players.length,
      maxPlayers: serverInfo.vars?.sv_maxClients || 200,
      serverName: serverInfo.vars?.sv_projectName || "Black Mesa RP",
      uptime: serverInfo.vars?.Uptime || "Unknown",
    });
  } catch {
    return NextResponse.json({
      online: false,
      players: 0,
      maxPlayers: 200,
      serverName: "Black Mesa RP",
      uptime: "Offline",
    });
  }
}
