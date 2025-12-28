import { NextResponse } from 'next/server'
import { recordPlayerCount } from '@/lib/store/player-history'

export const dynamic = 'force-dynamic'
export const revalidate = 5

const FIVEM_IP = process.env.FIVEM_SERVER_IP || 'localhost'
const FIVEM_PORT = process.env.FIVEM_SERVER_PORT || '30120'

interface FiveMPlayer {
  id: number
  name: string
  ping: number
  identifiers?: string[]
}

interface PlayerPosition {
  id: number
  name: string
  x: number
  y: number
  z: number
  heading?: number
  health?: number
  armor?: number
  job?: string
  ping?: number
}

// In-memory cache for positions pushed from FiveM
let cachedPositions: PlayerPosition[] = []
let lastPositionUpdate = 0

export async function GET() {
  try {
    const baseUrl = `http://${FIVEM_IP}:${FIVEM_PORT}`

    // Fetch basic player list from FiveM
    const playersRes = await fetch(`${baseUrl}/players.json`, {
      next: { revalidate: 5 },
      signal: AbortSignal.timeout(5000),
    }).catch(() => null)

    if (!playersRes?.ok) {
      // Return cached positions if FiveM is down but we have cached data
      if (cachedPositions.length > 0 && Date.now() - lastPositionUpdate < 60000) {
        return NextResponse.json({
          players: cachedPositions,
          count: cachedPositions.length,
          source: 'cached',
          lastUpdate: lastPositionUpdate,
        })
      }

      return NextResponse.json({
        players: [],
        count: 0,
        source: 'offline',
        lastUpdate: null,
      })
    }

    const fivemPlayers: FiveMPlayer[] = await playersRes.json()

    // If we have cached positions from FiveM push, merge with basic player data
    if (cachedPositions.length > 0 && Date.now() - lastPositionUpdate < 30000) {
      // Create a map of positions by player id
      const positionMap = new Map(cachedPositions.map(p => [p.id, p]))

      // Merge FiveM player data with position data
      const players = fivemPlayers.map(p => {
        const pos = positionMap.get(p.id)
        return {
          id: p.id,
          name: p.name,
          ping: p.ping,
          x: pos?.x ?? 0,
          y: pos?.y ?? 0,
          z: pos?.z ?? 0,
          heading: pos?.heading ?? 0,
          health: pos?.health ?? 100,
          armor: pos?.armor ?? 0,
          job: pos?.job ?? null,
        }
      })

      return NextResponse.json({
        players,
        count: players.length,
        source: 'live',
        lastUpdate: lastPositionUpdate,
      })
    }

    // No position data - return players without positions
    // They'll appear but won't have map coordinates
    const players = fivemPlayers.map(p => ({
      id: p.id,
      name: p.name,
      ping: p.ping,
      x: 0,
      y: 0,
      z: 0,
      heading: 0,
      health: 100,
      armor: 0,
      job: null,
    }))

    return NextResponse.json({
      players,
      count: players.length,
      source: 'basic', // No position data
      lastUpdate: null,
    })
  } catch (error) {
    console.error('Error fetching map players:', error)
    return NextResponse.json({
      players: [],
      count: 0,
      source: 'error',
      lastUpdate: null,
    })
  }
}

// POST endpoint for FiveM to push position updates
export async function POST(req: Request) {
  try {
    const { secret, players } = await req.json()

    // Validate secret from FiveM server
    if (secret !== process.env.FIVEM_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (Array.isArray(players)) {
      cachedPositions = players
      lastPositionUpdate = Date.now()

      // Record player count for history tracking
      recordPlayerCount(players.length)
    }

    return NextResponse.json({
      success: true,
      received: cachedPositions.length,
    })
  } catch (error) {
    console.error('Error updating positions:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
