import { NextResponse } from 'next/server'
import { getPlayerHistory } from '@/lib/store/player-history'

export const dynamic = 'force-dynamic'

// Get historical data
export async function GET() {
  try {
    const playerHistory = getPlayerHistory()
    
    // Return data aggregated by hour for the chart
    const hourlyData: { time: string; players: number }[] = []
    const hourMap = new Map<string, number[]>()

    // Group by hour
    playerHistory.forEach(entry => {
      const hour = entry.time.split(':')[0] + ':00'
      if (!hourMap.has(hour)) {
        hourMap.set(hour, [])
      }
      hourMap.get(hour)!.push(entry.players)
    })

    // Average each hour
    hourMap.forEach((counts, hour) => {
      const avg = Math.round(counts.reduce((a, b) => a + b, 0) / counts.length)
      hourlyData.push({ time: hour, players: avg })
    })

    // Sort by time
    hourlyData.sort((a, b) => a.time.localeCompare(b.time))

    return NextResponse.json({
      history: hourlyData,
      raw: playerHistory.slice(-50), // Last 50 raw entries
      totalEntries: playerHistory.length
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
