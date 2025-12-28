// Shared player history storage - used by both map/players and stats/player-history routes

interface HistoryEntry {
  time: string
  players: number
  timestamp: number
}

// Module-level storage (shared across imports)
const playerHistoryStore: HistoryEntry[] = []
const MAX_HISTORY_ENTRIES = 288 // 24 hours * 12 (every 5 minutes)
let lastHistoryRecord = 0
const HISTORY_INTERVAL = 5 * 60 * 1000 // Record every 5 minutes

export function recordPlayerCount(count: number) {
  const now = Date.now()
  
  // Always record immediately on first call, then every 5 minutes after
  const isFirstRecord = lastHistoryRecord === 0
  if (!isFirstRecord && now - lastHistoryRecord < HISTORY_INTERVAL) return

  const date = new Date(now)
  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  playerHistoryStore.push({
    time: timeStr,
    players: count,
    timestamp: now
  })

  // Keep only last 24 hours
  const cutoff = now - 24 * 60 * 60 * 1000
  while (playerHistoryStore.length > 0 && playerHistoryStore[0].timestamp < cutoff) {
    playerHistoryStore.shift()
  }

  // Also cap at MAX_ENTRIES
  while (playerHistoryStore.length > MAX_HISTORY_ENTRIES) {
    playerHistoryStore.shift()
  }

  lastHistoryRecord = now
}

export function getPlayerHistory() {
  return playerHistoryStore
}

export type { HistoryEntry }
