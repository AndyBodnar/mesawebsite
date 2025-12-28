// Using relative paths for Next.js API routes
import type { GameLog, PlayerData, ServerInfo, LoadingState } from './socket'

// Generic fetch wrapper
async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

// ============================================
// Logs API
// ============================================

export interface LogsResponse {
  logs: GameLog[]
  total: number
  limit: number
  offset: number
}

export interface LogStats {
  totalLogs: number
  last24Hours: number
  byScript: { script: string; count: number }[]
  byCategory?: Record<string, number>
}

export const logsApi = {
  // Get logs with optional filters
  getLogs: (params?: {
    script?: string
    category?: string
    identifier?: string
    search?: string
    limit?: number
    offset?: number
  }): Promise<LogsResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.script) searchParams.set('script', params.script)
    if (params?.category) searchParams.set('category', params.category)
    if (params?.identifier) searchParams.set('identifier', params.identifier)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.offset) searchParams.set('offset', params.offset.toString())

    const query = searchParams.toString()
    return fetcher<LogsResponse>(`/api/logs${query ? `?${query}` : ''}`)
  },

  // Get logs by script and category
  getLogsByCategory: (script: string, category: string, limit = 50, offset = 0): Promise<LogsResponse> => {
    return fetcher<LogsResponse>(`/api/logs/${script}/${category}?limit=${limit}&offset=${offset}`)
  },

  // Get log statistics
  getStats: (): Promise<LogStats> => {
    return fetcher<LogStats>('/api/logs/stats')
  },
}

// ============================================
// Players API
// ============================================

export interface PlayersResponse {
  count: number
  maxPlayers: number
  players: PlayerData[]
}

export interface PlayerHistoryResponse {
  logs: GameLog[]
  total: number
  limit: number
  offset: number
}

export interface PlayerSearchResponse {
  online: PlayerData[]
  historical: { identifier: string; playerName: string; playerId: string }[]
}

export const playersApi = {
  // Get all online players (live from server)
  getOnline: (): Promise<PlayersResponse> => {
    return fetcher<PlayersResponse>('/api/server/players')
  },

  // Get specific player
  getPlayer: (identifier: string): Promise<PlayerData & { recentLogs: GameLog[] }> => {
    return fetcher(`/api/players/${encodeURIComponent(identifier)}`)
  },

  // Get player history
  getPlayerHistory: (identifier: string, limit = 50, offset = 0): Promise<PlayerHistoryResponse> => {
    return fetcher(`/api/players/${encodeURIComponent(identifier)}/history?limit=${limit}&offset=${offset}`)
  },

  // Search players
  search: (query: string): Promise<PlayerSearchResponse> => {
    return fetcher(`/api/players/search/${encodeURIComponent(query)}`)
  },
}

// ============================================
// Map API
// ============================================

export interface MapPlayersResponse {
  players: {
    id: number
    name: string
    x: number
    y: number
    z: number
    heading?: number
    health?: number
    armor?: number
    job?: string | null
    ping?: number
  }[]
  count: number
  source: 'live' | 'basic' | 'cached' | 'offline' | 'error'
  lastUpdate: number | null
}

export interface MapBlip {
  id: number
  type: string
  name: string
  coords: { x: number; y: number; z: number }
}

export const mapApi = {
  // Get player positions
  getPlayers: (): Promise<MapPlayersResponse> => {
    return fetcher<MapPlayersResponse>('/api/map/players')
  },

  // Get server info
  getServerInfo: (): Promise<ServerInfo> => {
    return fetcher<ServerInfo>('/api/map/server')
  },

  // Get map blips
  getBlips: (): Promise<{ blips: MapBlip[] }> => {
    return fetcher('/api/map/blips')
  },
}

// ============================================
// Loading API
// ============================================

export interface LoadingConfig {
  tips: string[]
  music: { name: string; url: string }[]
  branding: {
    logo: string
    background: string
    serverName: string
  }
  stages: { id: string; label: string; weight: number }[]
  animations: {
    progressBar: string
    background: string
    particles: boolean
  }
}

export interface ActiveLoadingResponse {
  count: number
  loading: {
    identifier: string
    name: string
    stage: string
    progress: number
    elapsed: number
  }[]
}

export const loadingApi = {
  // Get loading screen config
  getConfig: (): Promise<LoadingConfig> => {
    return fetcher<LoadingConfig>('/api/loading/config')
  },

  // Get player loading status
  getStatus: (identifier: string): Promise<{
    stage: string
    progress: number
    currentAsset?: string
    elapsed: number
  }> => {
    return fetcher(`/api/loading/status/${encodeURIComponent(identifier)}`)
  },

  // Get all active loading sessions
  getActive: (): Promise<ActiveLoadingResponse> => {
    return fetcher<ActiveLoadingResponse>('/api/loading/active')
  },
}

// ============================================
// Auth API
// ============================================

export const authApi = {
  // Get Discord OAuth URL
  getDiscordUrl: (): string => {
    return "/api/auth/discord"
  },

  // Get current user
  getMe: (): Promise<any> => {
    return fetcher('/api/auth/me')
  },

  // Logout
  logout: (): Promise<{ success: boolean }> => {
    return fetcher('/api/auth/logout', { method: 'POST' })
  },
}

// ============================================
// Server API (Resources, Health)
// ============================================

export interface Resource {
  name: string
  state: 'started' | 'stopped' | 'starting' | 'stopping' | 'unknown'
}

export interface ResourcesResponse {
  success: boolean
  resources: Resource[]
  count: number
  error?: string
}

export interface ServerHealthResponse {
  online: boolean
  status?: string
  timestamp?: number
  error?: string
}

export const serverApi = {
  // Get all resources
  getResources: (): Promise<ResourcesResponse> => {
    return fetcher<ResourcesResponse>('/api/server/resources')
  },

  // Get server health
  getHealth: (): Promise<ServerHealthResponse> => {
    return fetcher<ServerHealthResponse>('/api/server/health')
  },
}

// ============================================
// Moderation API (Wasabi tables)
// ============================================

export interface Ban {
  id?: number
  author: string
  player: string
  license: string
  ip?: string
  discord?: string
  reason: string
  ban_time: number
  exp_time: string
}

export interface Warn {
  id?: number
  identifier: string
  reason: string
  staff: string
  created_at: string
}

export interface AuditLog {
  id: number
  action_type: string
  staff_name: string
  target_id: string
  target_name: string
  reason: string
  details: string
  created_at: string
}

export const moderationApi = {
  // Get all bans from Wasabi
  getBans: (): Promise<{ success: boolean; bans: Ban[] }> => {
    return fetcher('/api/moderation/bans')
  },

  // Get all warns from Wasabi
  getWarns: (): Promise<{ success: boolean; warns: Warn[] }> => {
    return fetcher('/api/moderation/warns')
  },

  // Get audit log
  getAudit: (): Promise<{ success: boolean; logs: AuditLog[] }> => {
    return fetcher('/api/moderation/audit')
  },
}

// ============================================
// txAdmin API (JSON files)
// ============================================

export interface TxPlayer {
  license: string
  ids: string[]
  displayName: string
  playTime: number
  tsLastConnection: number
  notes?: { text: string; author: string }
}

export interface TxAction {
  id: string
  type: 'ban' | 'warn'
  author: string
  reason: string
  ts: number
  expiration?: number | 'permanent'
  playerName?: string
  ids?: string[]
}

export interface TxAdmin {
  name: string
  master: boolean
  permissions: string[]
  discord?: string
  citizenfx?: string
}

export const txadminApi = {
  // Get all tracked players
  getPlayers: (): Promise<{ success: boolean; players: TxPlayer[] }> => {
    return fetcher('/api/txadmin/players')
  },

  // Get all actions (bans + warns)
  getActions: (): Promise<{ success: boolean; actions: TxAction[] }> => {
    return fetcher('/api/txadmin/actions')
  },

  // Get only bans
  getBans: (): Promise<{ success: boolean; bans: TxAction[] }> => {
    return fetcher('/api/txadmin/bans')
  },

  // Get only warns
  getWarns: (): Promise<{ success: boolean; warns: TxAction[] }> => {
    return fetcher('/api/txadmin/warns')
  },

  // Get txAdmin admins
  getAdmins: (): Promise<{ success: boolean; admins: TxAdmin[] }> => {
    return fetcher('/api/txadmin/admins')
  },

  // Get server stats
  getStats: (): Promise<{ success: boolean; stats: any }> => {
    return fetcher('/api/txadmin/stats')
  },
}

// Export all APIs
export const api = {
  logs: logsApi,
  players: playersApi,
  map: mapApi,
  loading: loadingApi,
  auth: authApi,
  server: serverApi,
  moderation: moderationApi,
  txadmin: txadminApi,
}

export default api
