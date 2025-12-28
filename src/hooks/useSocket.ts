'use client'

import { useEffect, useState, useCallback } from 'react'
import { getMainSocket, getLoadingSocket, type PlayerData, type GameLog, type ServerInfo } from '@/lib/api/socket'
import type { Socket } from 'socket.io-client'

// Generic socket hook
export function useSocket(namespace: 'main' | 'loading' = 'main') {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const s = namespace === 'loading' ? getLoadingSocket() : getMainSocket()

    s.on('connect', () => setIsConnected(true))
    s.on('disconnect', () => setIsConnected(false))

    s.connect()
    setSocket(s)

    return () => {
      s.off('connect')
      s.off('disconnect')
      s.disconnect()
    }
  }, [namespace])

  return { socket, isConnected }
}

// Live map hook - real-time player positions
export function useLiveMap() {
  const { socket, isConnected } = useSocket('main')
  const [players, setPlayers] = useState<PlayerData[]>([])
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null)

  useEffect(() => {
    if (!socket) return

    // Join map room
    socket.emit('join:map')

    // Initial data
    socket.on('map:players', (data: PlayerData[]) => {
      setPlayers(data)
    })

    // Player updates
    socket.on('map:playerUpdate', (player: PlayerData) => {
      setPlayers(prev => {
        const idx = prev.findIndex(p => p.identifier === player.identifier)
        if (idx >= 0) {
          const updated = [...prev]
          updated[idx] = player
          return updated
        }
        return [...prev, player]
      })
    })

    // Player join
    socket.on('map:playerJoin', (player: PlayerData) => {
      setPlayers(prev => [...prev, player])
    })

    // Player leave
    socket.on('map:playerLeave', (identifier: string) => {
      setPlayers(prev => prev.filter(p => p.identifier !== identifier))
    })

    // Server info
    socket.on('map:serverInfo', (info: ServerInfo) => {
      setServerInfo(info)
    })

    return () => {
      socket.emit('leave:map')
      socket.off('map:players')
      socket.off('map:playerUpdate')
      socket.off('map:playerJoin')
      socket.off('map:playerLeave')
      socket.off('map:serverInfo')
    }
  }, [socket])

  return { players, serverInfo, isConnected }
}

// Live logs hook - real-time log streaming
export function useLiveLogs(filters?: { script?: string; category?: string }) {
  const { socket, isConnected } = useSocket('main')
  const [logs, setLogs] = useState<GameLog[]>([])

  useEffect(() => {
    if (!socket) return

    // Join logs room with filters
    socket.emit('join:logs', filters)

    // New log received
    socket.on('logs:new', (log: GameLog) => {
      // Apply client-side filter if needed
      if (filters?.script && log.script !== filters.script) return
      if (filters?.category && log.category !== filters.category) return

      setLogs(prev => [log, ...prev].slice(0, 100)) // Keep last 100
    })

    return () => {
      socket.emit('leave:logs')
      socket.off('logs:new')
    }
  }, [socket, filters?.script, filters?.category])

  const clearLogs = useCallback(() => setLogs([]), [])

  return { logs, isConnected, clearLogs }
}

// Staff panel hook - real-time staff updates
export function useStaffPanel() {
  const { socket, isConnected } = useSocket('main')
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    if (!socket) return

    socket.emit('join:staff')

    socket.on('staff:playerJoin', (data) => {
      setEvents(prev => [{ type: 'join', ...data, time: new Date() }, ...prev].slice(0, 50))
    })

    socket.on('staff:playerLeave', (data) => {
      setEvents(prev => [{ type: 'leave', ...data, time: new Date() }, ...prev].slice(0, 50))
    })

    socket.on('staff:serverInfo', (info) => {
      // Handle server info updates
    })

    return () => {
      socket.emit('leave:staff')
      socket.off('staff:playerJoin')
      socket.off('staff:playerLeave')
      socket.off('staff:serverInfo')
    }
  }, [socket])

  return { events, isConnected }
}

// Loading screen hook
export function useLoadingScreen(identifier?: string) {
  const { socket, isConnected } = useSocket('loading')
  const [state, setState] = useState<{
    stage: string
    progress: number
    currentAsset?: string
    serverInfo?: any
  } | null>(null)
  const [tips, setTips] = useState<string[]>([])

  useEffect(() => {
    if (!socket || !identifier) return

    socket.emit('loading:init', { identifier, name: 'Player' })

    socket.on('loading:state', (data) => {
      setState(data)
    })

    socket.on('loading:update', (data) => {
      setState(prev => ({ ...prev, ...data }))
    })

    socket.on('loading:tips', (serverTips: string[]) => {
      setTips(serverTips)
    })

    socket.on('loading:serverInfo', (info) => {
      setState(prev => prev ? { ...prev, serverInfo: info } : null)
    })

    socket.on('loading:done', (data) => {
      setState(prev => prev ? { ...prev, stage: 'complete', progress: 100 } : null)
    })

    return () => {
      socket.emit('loading:cancel', { identifier })
      socket.off('loading:state')
      socket.off('loading:update')
      socket.off('loading:tips')
      socket.off('loading:serverInfo')
      socket.off('loading:done')
    }
  }, [socket, identifier])

  return { state, tips, isConnected }
}
