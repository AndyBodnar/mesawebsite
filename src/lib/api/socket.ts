'use client'

import { io, Socket } from 'socket.io-client'
import { WS_URL } from './config'

// Socket instances for different namespaces
let mainSocket: Socket | null = null
let loadingSocket: Socket | null = null

// Main socket connection
export function getMainSocket(): Socket {
  if (!mainSocket) {
    mainSocket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: false,
    })
  }
  return mainSocket
}

// Loading screen namespace
export function getLoadingSocket(): Socket {
  if (!loadingSocket) {
    loadingSocket = io(`${WS_URL}/loading`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: false,
    })
  }
  return loadingSocket
}

// Disconnect all sockets
export function disconnectAll() {
  if (mainSocket) {
    mainSocket.disconnect()
    mainSocket = null
  }
  if (loadingSocket) {
    loadingSocket.disconnect()
    loadingSocket = null
  }
}

// Types for socket events
export interface PlayerData {
  id: number
  name: string
  identifier: string
  coords: { x: number; y: number; z: number }
  heading: number
  health: number
  armor: number
  job?: string
  vehicle?: string
  lastUpdate: number
}

export interface ServerInfo {
  cpu?: number
  memory?: number
  avgPing?: number
  playerCount: number
  maxPlayers: number
  uptime: number
}

export interface GameLog {
  id: string
  script: string
  category: string
  title: string
  message: string
  color?: number
  playerId?: string
  playerName?: string
  identifier?: string
  metadata?: any
  createdAt: string
}

export interface LoadingState {
  identifier: string
  name: string
  stage: 'connecting' | 'loading_assets' | 'loading_map' | 'loading_scripts' | 'spawning' | 'complete'
  progress: number
  currentAsset?: string
  serverInfo?: {
    name: string
    playerCount: number
    maxPlayers: number
    queue?: number
  }
}
