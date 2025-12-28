import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 30

const FIVEM_IP = process.env.FIVEM_SERVER_IP || 'localhost'
const FIVEM_PORT = process.env.FIVEM_SERVER_PORT || '30120'

interface FiveMPlayer {
  id: number
  name: string
  ping: number
}

interface FiveMInfo {
  resources: string[]
  vars: Record<string, string>
}

export async function GET() {
  try {
    const baseUrl = `http://${FIVEM_IP}:${FIVEM_PORT}`

    // Fetch players and info in parallel
    const [playersRes, infoRes] = await Promise.all([
      fetch(`${baseUrl}/players.json`, {
        next: { revalidate: 30 },
        signal: AbortSignal.timeout(5000),
      }).catch(() => null),
      fetch(`${baseUrl}/info.json`, {
        next: { revalidate: 30 },
        signal: AbortSignal.timeout(5000),
      }).catch(() => null),
    ])

    if (!playersRes?.ok) {
      return NextResponse.json({
        online: false,
        players: 0,
        maxPlayers: 64,
        serverName: 'Black Mesa RP',
        uptime: '0h',
        cpu: 0,
        memory: 0,
        avgPing: 0,
      })
    }

    const players: FiveMPlayer[] = await playersRes.json()
    const info: FiveMInfo | null = infoRes?.ok ? await infoRes.json() : null

    // Calculate average ping
    const avgPing = players.length > 0
      ? Math.round(players.reduce((sum, p) => sum + (p.ping || 0), 0) / players.length)
      : 0

    // Get server name from vars
    const serverName = info?.vars?.['sv_projectName'] || info?.vars?.['sv_hostname'] || 'Black Mesa RP'
    const maxPlayers = parseInt(info?.vars?.['sv_maxClients'] || '64')

    return NextResponse.json({
      online: true,
      players: players.length,
      maxPlayers,
      serverName,
      uptime: '24h+', // FiveM doesn't expose this directly
      cpu: 0, // Would need txAdmin/external monitoring
      memory: 0,
      avgPing,
    })
  } catch (error) {
    console.error('Error fetching server info:', error)
    return NextResponse.json({
      online: false,
      players: 0,
      maxPlayers: 64,
      serverName: 'Black Mesa RP',
      uptime: '0h',
      cpu: 0,
      memory: 0,
      avgPing: 0,
    })
  }
}
