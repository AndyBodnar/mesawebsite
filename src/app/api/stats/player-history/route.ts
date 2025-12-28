import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Get historical data from database
export async function GET() {
  try {
    // Get last 24 hours of data
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const history = await db.playerHistory.findMany({
      where: {
        recordedAt: { gte: cutoff }
      },
      orderBy: { recordedAt: 'asc' },
      take: 288 // Max 288 entries (5 min intervals for 24h)
    })

    // Group by hour for the chart
    const hourlyData: { time: string; players: number }[] = []
    const hourMap = new Map<string, number[]>()

    history.forEach(entry => {
      const hour = entry.recordedAt.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }).split(':')[0] + ':00'
      
      if (!hourMap.has(hour)) {
        hourMap.set(hour, [])
      }
      hourMap.get(hour)!.push(entry.playerCount)
    })

    // Average each hour
    hourMap.forEach((counts, hour) => {
      const avg = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length)
      hourlyData.push({ time: hour, players: avg })
    })

    // Sort by time
    hourlyData.sort((a, b) => a.time.localeCompare(b.time))

    // Get raw recent entries
    const raw = history.slice(-50).map(h => ({
      time: h.recordedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      players: h.playerCount,
      timestamp: h.recordedAt.getTime()
    }))

    return NextResponse.json({
      history: hourlyData,
      raw,
      totalEntries: history.length
    })
  } catch (error) {
    console.error('Error fetching player history:', error)
    return NextResponse.json({ error: 'Failed to fetch', history: [], raw: [], totalEntries: 0 }, { status: 500 })
  }
}

// POST endpoint to record player count (called by FiveM or map API)
export async function POST(req: Request) {
  try {
    const { secret, players } = await req.json()

    // Validate secret
    if (secret !== process.env.FIVEM_API_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const playerCount = typeof players === 'number' ? players : (Array.isArray(players) ? players.length : 0)

    await db.playerHistory.create({
      data: { playerCount }
    })

    return NextResponse.json({ success: true, recorded: playerCount })
  } catch (error) {
    console.error('Error recording player history:', error)
    return NextResponse.json({ error: 'Failed to record' }, { status: 500 })
  }
}
