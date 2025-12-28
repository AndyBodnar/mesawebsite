'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { api, type LogsResponse, type LogStats, type PlayersResponse, type LoadingConfig, type ResourcesResponse, type ServerHealthResponse } from '@/lib/api/client'

// Generic fetch hook with smooth refresh (no loading flicker on refetch)
function useFetch<T>(fetcher: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const isInitialLoad = useRef(true)

  const refetch = useCallback(async () => {
    // Only show loading spinner on initial load, not on refreshes
    if (isInitialLoad.current) {
      setLoading(true)
    } else {
      setIsRefreshing(true)
    }
    setError(null)

    try {
      const result = await fetcher()
      setData(result)
      isInitialLoad.current = false
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [fetcher])

  useEffect(() => {
    refetch()
  }, deps)

  return { data, loading, isRefreshing, error, refetch }
}

// ============================================
// Logs Hooks
// ============================================

export function useLogs(params?: {
  script?: string
  category?: string
  identifier?: string
  search?: string
  limit?: number
  offset?: number
}) {
  return useFetch(
    () => api.logs.getLogs(params),
    [params?.script, params?.category, params?.identifier, params?.search, params?.limit, params?.offset]
  )
}

export function useLogsByCategory(script: string, category: string, limit = 50, offset = 0) {
  return useFetch(
    () => api.logs.getLogsByCategory(script, category, limit, offset),
    [script, category, limit, offset]
  )
}

export function useLogStats() {
  return useFetch(() => api.logs.getStats(), [])
}

// ============================================
// Players Hooks
// ============================================

export function useOnlinePlayers() {
  const result = useFetch(() => api.players.getOnline(), [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      result.refetch()
    }, 30000)
    return () => clearInterval(interval)
  }, [result.refetch])

  return result
}

export function usePlayer(identifier: string) {
  return useFetch(
    () => api.players.getPlayer(identifier),
    [identifier]
  )
}

export function usePlayerHistory(identifier: string, limit = 50, offset = 0) {
  return useFetch(
    () => api.players.getPlayerHistory(identifier, limit, offset),
    [identifier, limit, offset]
  )
}

export function usePlayerSearch(query: string) {
  const [results, setResults] = useState<Awaited<ReturnType<typeof api.players.search>> | null>(null)
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResults(null)
      return
    }

    setLoading(true)
    try {
      const data = await api.players.search(q)
      setResults(data)
    } catch (err) {
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => search(query), 300) // Debounce
    return () => clearTimeout(timeout)
  }, [query, search])

  return { results, loading }
}

// ============================================
// Map Hooks
// ============================================

export function useMapPlayers() {
  const result = useFetch(() => api.map.getPlayers(), [])

  // Auto-refresh every 5 seconds for map
  useEffect(() => {
    const interval = setInterval(() => {
      result.refetch()
    }, 5000)
    return () => clearInterval(interval)
  }, [result.refetch])

  return result
}

export function useServerInfo() {
  const result = useFetch(() => api.map.getServerInfo(), [])

  useEffect(() => {
    const interval = setInterval(() => {
      result.refetch()
    }, 10000)
    return () => clearInterval(interval)
  }, [result.refetch])

  return result
}

export function useMapBlips() {
  return useFetch(() => api.map.getBlips(), [])
}

// ============================================
// Loading Hooks
// ============================================

export function useLoadingConfig() {
  return useFetch(() => api.loading.getConfig(), [])
}

export function useActiveLoading() {
  const result = useFetch(() => api.loading.getActive(), [])

  useEffect(() => {
    const interval = setInterval(() => {
      result.refetch()
    }, 2000)
    return () => clearInterval(interval)
  }, [result.refetch])

  return result
}

// ============================================
// Combined Dashboard Hook
// ============================================

export function useDashboard() {
  const players = useOnlinePlayers()
  const logStats = useLogStats()
  const serverInfo = useServerInfo()

  // Only show loading on initial load, not on refreshes
  const isInitialLoading = players.loading || logStats.loading || serverInfo.loading
  const isRefreshing = players.isRefreshing || logStats.isRefreshing || serverInfo.isRefreshing

  return {
    players: players.data,
    logStats: logStats.data,
    serverInfo: serverInfo.data,
    loading: isInitialLoading,
    isRefreshing,
    error: players.error || logStats.error || serverInfo.error,
    refetch: () => {
      players.refetch()
      logStats.refetch()
      serverInfo.refetch()
    }
  }
}

// ============================================
// Server Hooks (Resources, Health)
// ============================================

export function useResources() {
  const result = useFetch(() => api.server.getResources(), [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      result.refetch()
    }, 30000)
    return () => clearInterval(interval)
  }, [result.refetch])

  return result
}

export function useServerHealth() {
  const result = useFetch(() => api.server.getHealth(), [])

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      result.refetch()
    }, 10000)
    return () => clearInterval(interval)
  }, [result.refetch])

  return result
}

// ============================================
// Moderation Hooks (Wasabi tables)
// ============================================

export function useBans() {
  return useFetch(() => api.moderation.getBans(), [])
}

export function useWarns() {
  return useFetch(() => api.moderation.getWarns(), [])
}

export function useAuditLog() {
  const result = useFetch(() => api.moderation.getAudit(), [])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      result.refetch()
    }, 30000)
    return () => clearInterval(interval)
  }, [result.refetch])

  return result
}

// ============================================
// txAdmin Hooks (JSON files)
// ============================================

export function useTxPlayers() {
  return useFetch(() => api.txadmin.getPlayers(), [])
}

export function useTxActions() {
  return useFetch(() => api.txadmin.getActions(), [])
}

export function useTxBans() {
  return useFetch(() => api.txadmin.getBans(), [])
}

export function useTxWarns() {
  return useFetch(() => api.txadmin.getWarns(), [])
}

export function useTxAdmins() {
  return useFetch(() => api.txadmin.getAdmins(), [])
}

export function useTxStats() {
  return useFetch(() => api.txadmin.getStats(), [])
}

// ============================================
// Stats Hooks (Player Activity)
// ============================================

export function usePlayerActivityHistory() {
  const result = useFetch(() => api.stats.getPlayerActivityHistory(), [])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      result.refetch()
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [result.refetch])

  return result
}

